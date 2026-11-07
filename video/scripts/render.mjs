// Renderiza un Reel: descarga los clips (con caché), prepara public/, renderiza con Remotion
// (H.264 CRF 20, x264 veryfast, AAC 128 kbps, yuv420p, faststart) y exporta la portada en JPG.
//
//   node scripts/render.mjs <reel_id> [--out=<carpeta>] [--fecha=YYYY-MM-DD]
//
// También se usa como módulo desde scripts/instagram/publish.mjs (renderReel, renderCalendar).
import { copyFileSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, ensureBrowser } from "@remotion/renderer";
import { VIDEO, PUBLIC, OUT, FONTS_DIR, mkdirp, ffmpeg, mediaDuration, loadReel, clipSlots, clipListo } from "./lib/common.mjs";
import { downloadClip } from "./lib/clips.mjs";
import { pickTrack } from "./lib/music.mjs";

const RUNTIME = path.join(PUBLIC, "runtime");
const MAX_MB = 50;

/** Copia fuentes, clips y música a public/ (Remotion solo sirve archivos de esa carpeta) */
export function preparePublic({ clipFiles = {}, musicFile = null } = {}) {
  const fonts = mkdirp(path.join(PUBLIC, "fonts"));
  for (const f of readdirSync(FONTS_DIR).filter((x) => x.endsWith(".ttf"))) copyFileSync(path.join(FONTS_DIR, f), path.join(fonts, f));
  rmSync(RUNTIME, { recursive: true, force: true });
  mkdirp(path.join(RUNTIME, "clips"));
  const clips = {};
  for (const [id, file] of Object.entries(clipFiles)) {
    copyFileSync(file, path.join(RUNTIME, "clips", `${id}.mp4`));
    clips[id] = `runtime/clips/${id}.mp4`;
  }
  let music = null;
  if (musicFile) {
    copyFileSync(musicFile.path, path.join(RUNTIME, path.basename(musicFile.path)));
    music = { file: `runtime/${path.basename(musicFile.path)}`, bpm: musicFile.bpm, offset: musicFile.offset || 0, inicio: musicFile.inicio || 0 };
  }
  return { clips, music };
}

/**
 * Descarga los clips de una lista de huecos. Con soloRevisados, un clip sin revisar se trata como
 * ausente (fondo neutro). Devuelve {clipFiles, faltan}.
 */
async function gatherClips(slots, { soloRevisados }) {
  const clipFiles = {};
  const faltan = [];
  for (const s of slots) {
    const c = s.clip;
    if (c.sin_clip) continue;
    if (!c.pexels_id || !c.archivo_url || (soloRevisados && !clipListo(c))) {
      faltan.push(s.donde);
      continue;
    }
    try {
      clipFiles[c.pexels_id] = await downloadClip(c);
    } catch (e) {
      console.warn(`  ${s.donde}: ${e.message}`);
      faltan.push(s.donde);
    }
  }
  return { clipFiles, faltan };
}

let bundleCache = null;
async function getBundle() {
  if (!bundleCache) bundleCache = await bundle({ entryPoint: path.join(VIDEO, "src/index.jsx"), publicDir: PUBLIC, onProgress: () => {} });
  return bundleCache;
}

// Remotion guarda el navegador en node_modules/.remotion del directorio actual: se trabaja desde video/
async function renderComposition(opts) {
  const prev = process.cwd();
  process.chdir(VIDEO);
  try {
    return await renderCompositionIn(opts);
  } finally {
    process.chdir(prev);
  }
}

async function renderCompositionIn({ compId, inputProps, outBase, coverSecond }) {
  await ensureBrowser();
  const serveUrl = await getBundle();
  const composition = await selectComposition({ serveUrl, id: compId, inputProps });
  const tmp = `${outBase}.tmp.mp4`;
  const mp4 = `${outBase}.mp4`;
  const jpg = `${outBase}.jpg`;
  const t0 = Date.now();
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    codec: "h264",
    crf: 20,
    x264Preset: "veryfast",
    audioCodec: "aac",
    audioBitrate: "128k",
    pixelFormat: "yuv420p",
    outputLocation: tmp,
    concurrency: process.env.REMOTION_CONCURRENCY ? Number(process.env.REMOTION_CONCURRENCY) : null,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== last) {
        last = p;
        process.stdout.write(`  render ${p * 10} %\r`);
      }
    },
  });
  process.stdout.write("\n");
  // faststart: el índice (moov) al principio para que Instagram empiece a leer sin descargar todo
  ffmpeg(["-i", tmp, "-c", "copy", "-movflags", "+faststart", mp4]);
  rmSync(tmp, { force: true });
  await renderStill({ serveUrl, composition, inputProps, output: jpg, frame: Math.min(composition.durationInFrames - 1, Math.round(coverSecond * composition.fps)), imageFormat: "jpeg", jpegQuality: 90 });

  const dur = mediaDuration(mp4);
  const mb = statSync(mp4).size / 1024 / 1024;
  const segundos = Math.round((Date.now() - t0) / 1000);
  console.log(`  ${path.basename(mp4)}: ${dur?.toFixed(1)} s, ${mb.toFixed(1)} MB, render en ${segundos} s`);
  if (!dur || dur < 15 || dur > 60) throw new Error(`El vídeo dura ${dur} s: tiene que estar entre 15 y 60 s`);
  if (mb >= MAX_MB) throw new Error(`El vídeo pesa ${mb.toFixed(1)} MB: tiene que pesar menos de ${MAX_MB} MB`);
  return { mp4, jpg, duracion: dur, mb, segundos };
}

/**
 * Renderiza un guion. Opciones:
 *  - soloRevisados: los clips sin "revisado": true no se usan (fondo neutro en su lugar)
 *  - exigirClips: falla si falta algún clip (para publicar de verdad)
 */
export async function renderReel(reelOrId, { outDir = OUT, fecha, soloRevisados = false, exigirClips = false } = {}) {
  const reel = typeof reelOrId === "string" ? loadReel(reelOrId) : reelOrId;
  console.log(`Reel ${reel.id}`);
  const { clipFiles, faltan } = await gatherClips(clipSlots(reel), { soloRevisados });
  if (faltan.length) {
    const msg = `sin clip revisado en: ${faltan.join(", ")}`;
    if (exigirClips) throw new Error(`Reel ${reel.id} ${msg}`);
    console.warn(`  Aviso: ${msg}. Esas escenas salen con fondo neutro.`);
  }
  const track = pickTrack(reel.musica, fecha);
  if (track) console.log(`  música: ${track.titulo}`);
  const assets = preparePublic({ clipFiles, musicFile: track });
  mkdirp(outDir);
  const res = await renderComposition({ compId: "Reel", inputProps: { reel, assets }, outBase: path.join(outDir, reel.id), coverSecond: reel.portada_segundo ?? 1.2 });
  return { ...res, faltan, musica: track?.titulo || null };
}

/** Reel del calendario dinámico: carreras [{dia, mes, nombre, ciudad}] */
export async function renderCalendar({ id, carreras, rango, outDir = OUT, fecha, soloRevisados = true, exigirClips = false }) {
  const cal = loadReel("_calendario");
  const { clipFiles, faltan } = await gatherClips(clipSlots(cal), { soloRevisados });
  if (faltan.length && exigirClips) throw new Error(`Calendario sin clip revisado en: ${faltan.join(", ")}`);
  const track = pickTrack("auto", fecha);
  const assets = preparePublic({ clipFiles, musicFile: track });
  mkdirp(outDir);
  const clips = cal.escenas.map((e) => e.clip);
  const res = await renderComposition({ compId: "Calendario", inputProps: { carreras, rango, clips, assets }, outBase: path.join(outDir, id), coverSecond: 3.5 });
  return { ...res, faltan, musica: track?.titulo || null };
}

// ---------- CLI ----------
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const id = args.find((a) => !a.startsWith("--"));
  const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
  if (!id) {
    console.log("Uso: node scripts/render.mjs <reel_id> [--out=carpeta] [--fecha=YYYY-MM-DD] [--solo-revisados]");
    process.exit(1);
  }
  renderReel(id, { outDir: opt("out") ? path.resolve(opt("out")) : OUT, fecha: opt("fecha"), soloRevisados: args.includes("--solo-revisados") })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(`ERROR: ${e.message}`);
      process.exit(1);
    });
}
