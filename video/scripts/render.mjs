// Renderiza un Reel: descarga los clips (con caché), prepara public/, renderiza con Remotion
// (H.264 CRF 20, x264 veryfast, AAC 128 kbps, yuv420p, faststart) y exporta la portada en JPG.
//
//   node scripts/render.mjs <reel_id> [--out=<carpeta>] [--fecha=YYYY-MM-DD]
//
// También se usa como módulo desde scripts/instagram/publish.mjs (renderReel, renderCalendar).
import { copyFileSync, readdirSync, rmSync, statSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, ensureBrowser } from "@remotion/renderer";
import { VIDEO, ROOT, PUBLIC, OUT, FONTS_DIR, REELS_DIR, mkdirp, ffmpeg, mediaDuration, loadReel, clipSlots, clipListo } from "./lib/common.mjs";
import { localClip, prepareVertical, clipKey } from "./lib/clips.mjs";
import { pickTrack } from "./lib/music.mjs";

const RUNTIME = path.join(PUBLIC, "runtime");
const MAX_MB = 50;

/** Copia fuentes, clips y música a public/ (Remotion solo sirve archivos de esa carpeta) */
export function preparePublic({ clipFiles = {}, musicFile = null, voz = null, clipSeg = {} } = {}) {
  const fonts = mkdirp(path.join(PUBLIC, "fonts"));
  for (const f of readdirSync(FONTS_DIR).filter((x) => x.endsWith(".ttf"))) copyFileSync(path.join(FONTS_DIR, f), path.join(fonts, f));
  // Efectos de sonido (instagram/sfx, generados con scripts/make-sfx.mjs)
  const sfxDir = path.join(ROOT, "instagram", "sfx");
  if (existsSync(sfxDir)) {
    const sfx = mkdirp(path.join(PUBLIC, "sfx"));
    for (const f of readdirSync(sfxDir).filter((x) => x.endsWith(".wav"))) copyFileSync(path.join(sfxDir, f), path.join(sfx, f));
  }
  rmSync(RUNTIME, { recursive: true, force: true });
  mkdirp(path.join(RUNTIME, "clips"));
  const clips = {};
  for (const [slot, file] of Object.entries(clipFiles)) {
    copyFileSync(file, path.join(RUNTIME, "clips", `${slot}.mp4`));
    clips[slot] = `runtime/clips/${slot}.mp4`;
  }
  let music = null;
  if (musicFile) {
    copyFileSync(musicFile.path, path.join(RUNTIME, path.basename(musicFile.path)));
    music = { file: `runtime/${path.basename(musicFile.path)}`, bpm: musicFile.bpm, offset: musicFile.offset || 0, inicio: musicFile.inicio || 0 };
  }
  let vozOut = null;
  if (voz) {
    copyFileSync(voz.mp3, path.join(RUNTIME, "voz.mp3"));
    vozOut = { file: "runtime/voz.mp3", words: voz.words };
  }
  return { clips, music, voz: vozOut, clipSeg };
}

/** Nombre de la voz configurada en voz.json, igual que motores.nombre_voz() en Python */
function vozEsperada() {
  try {
    const v = JSON.parse(readFileSync(path.join(REELS_DIR, "voz.json"), "utf8"));
    return v.motor === "kokoro" ? `kokoro-${v.voz}` : v.modelo || null;
  } catch {
    return null;
  }
}

/**
 * Narración ya generada (instagram/reels/audio/<id>.mp3 + .words.json, ver narrar.py).
 * Si falta o no casa con el guion, el reel sale sin voz (texto y música), como respaldo.
 */
export function cargarNarracion(reel) {
  if (!reel.narracion) return null;
  const mp3 = path.join(REELS_DIR, "audio", `${reel.id}.mp3`);
  const wj = path.join(REELS_DIR, "audio", `${reel.id}.words.json`);
  if (!existsSync(mp3) || !existsSync(wj)) return null;
  const words = JSON.parse(readFileSync(wj, "utf8"));
  const n = reel.narracion;
  const esperadas = [...n.escenas, n.conclusion, n.aplicacion, n.cierre].join(" ").split(/\s+/).filter(Boolean).length;
  if (words.palabras?.length !== esperadas || words.segmentos?.length !== n.escenas.length + 3) return null;
  // El audio tiene que ser de la voz configurada ahora (nunca de una voz anterior)
  const esperada = vozEsperada();
  if (esperada && words.voz !== esperada) {
    console.warn(`  Aviso: la narración de ${reel.id} es de otra voz (${words.voz}, se espera ${esperada}).`);
    return null;
  }
  return { mp3, words };
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
    if (!clipKey(c) || (soloRevisados && !clipListo(c))) {
      faltan.push(s.donde);
      continue;
    }
    try {
      // Revisado: copia propia (caché o nuestro bucket). Sin revisar (solo vista previa local): se recorta aquí
      clipFiles[s.clave] = c.archivo && c.revisado ? await localClip(c) : (await prepareVertical(c, s.duracion)).file;
    } catch (e) {
      console.warn(`  ${s.donde}: ${e.message}`);
      faltan.push(s.donde);
    }
  }
  return { clipFiles, faltan };
}

// El bundle copia public/ en el momento de crearlo: uno por render, después de preparar public/
const getBundle = () => bundle({ entryPoint: path.join(VIDEO, "src/index.jsx"), publicDir: PUBLIC, onProgress: () => {} });

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

/**
 * Mezcla final: la música entra por debajo de lo que ha renderizado Remotion (voz + efectos) con ducking real
 * (sidechaincompress con la voz como cadena lateral), fundidos de entrada y salida, y todo a -14 LUFS / -1 dBTP
 * (medida + ganancia fija + limitador, como la voz).
 */
function mezclar(entrada, musica, salida) {
  const dur = mediaDuration(entrada);
  const ini = musica.inicio || 0;
  const filtro = [
    `[1:a]atrim=start=${ini},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo,afade=t=in:d=0.5,afade=t=out:st=${Math.max(0, dur - 1.2).toFixed(2)}:d=1.2,volume=0.32[m]`,
    "[0:a]aformat=channel_layouts=stereo,asplit=2[v][sc]",
    "[m][sc]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350:makeup=1[md]",
    "[v][md]amix=inputs=2:duration=first:normalize=0[mx]",
  ].join(";");
  const wav = `${salida}.mezcla.wav`;
  ffmpeg(["-i", entrada, "-i", musica.path, "-filter_complex", `${filtro};[mx]loudnorm=I=-14:TP=-1:LRA=11[out]`, "-map", "[out]", "-ar", "48000", wav]);
  const log = ffmpeg(["-i", wav, "-af", "loudnorm=I=-14:TP=-1:print_format=json", "-f", "null", "-"]);
  const med = JSON.parse(log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1));
  const gan = Math.max(-6, Math.min(6, -14 - Number(med.input_i)));
  ffmpeg(["-i", entrada, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", `volume=${gan.toFixed(2)}dB,alimiter=limit=0.86:attack=2:release=50:level=false`, "-c:a", "aac", "-b:a", "128k", "-shortest", salida]);
  rmSync(wav, { force: true });
}

async function renderCompositionIn({ compId, inputProps, outBase, coverSecond, mezcla = null }) {
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
  if (mezcla) {
    const mix = `${outBase}.mix.mp4`;
    mezclar(tmp, mezcla, mix);
    rmSync(tmp, { force: true });
    ffmpeg(["-i", mix, "-c", "copy", "-movflags", "+faststart", mp4]);
    rmSync(mix, { force: true });
  } else {
    // faststart: el índice (moov) al principio para que Instagram empiece a leer sin descargar todo
    ffmpeg(["-i", tmp, "-c", "copy", "-movflags", "+faststart", mp4]);
    rmSync(tmp, { force: true });
  }
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
export async function renderReel(reelOrId, { outDir = OUT, fecha, soloRevisados = false, exigirClips = false, conVoz = true } = {}) {
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
  const voz = conVoz ? cargarNarracion(reel) : null;
  if (conVoz && reel.narracion && !voz) console.warn("  Aviso: falta la narración o no coincide con el guion. Sale sin voz.");
  if (voz) console.log(`  voz: ${voz.words.voz}, ${voz.words.duracion} s`);
  // Segundos útiles de cada clip recortado (duración de la escena en el guion + 0,5 s)
  const clipSeg = Object.fromEntries(clipSlots(reel).map((s) => [s.clave, s.clip.tramo ?? s.duracion + 0.5]));
  const assets = preparePublic({ clipFiles, musicFile: track, voz, clipSeg });
  // Con voz, la música se mezcla fuera de Remotion con ducking real (ver mezclar)
  const mezcla = voz && track ? { path: track.path, inicio: track.inicio || 0 } : null;
  if (mezcla) assets.mezclaExterna = true;
  mkdirp(outDir);
  const res = await renderComposition({ compId: "Reel", inputProps: { reel, assets }, outBase: path.join(outDir, reel.id), coverSecond: reel.portada_segundo ?? 1.2, mezcla });
  return { ...res, faltan, musica: track?.titulo || null, pista: track, conVoz: Boolean(voz) };
}

/** Reel del calendario dinámico: carreras [{dia, mes, nombre, ciudad}] */
export async function renderCalendar({ id, carreras, rango, outDir = OUT, fecha, soloRevisados = true, exigirClips = false }) {
  const cal = loadReel("_calendario");
  const { clipFiles, faltan } = await gatherClips(clipSlots(cal), { soloRevisados });
  if (faltan.length && exigirClips) throw new Error(`Calendario sin clip revisado en: ${faltan.join(", ")}`);
  const track = pickTrack("auto", fecha);
  const assets = preparePublic({ clipFiles, musicFile: track });
  mkdirp(outDir);
  const res = await renderComposition({ compId: "Calendario", inputProps: { carreras, rango, assets }, outBase: path.join(outDir, id), coverSecond: 3.5 });
  return { ...res, faltan, musica: track?.titulo || null, pista: track };
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
  renderReel(id, { outDir: opt("out") ? path.resolve(opt("out")) : OUT, fecha: opt("fecha"), soloRevisados: args.includes("--solo-revisados"), conVoz: !args.includes("--sin-voz") })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(`ERROR: ${e.message}`);
      process.exit(1);
    });
}
