// Metraje de stock para los guiones. Fuente por defecto: Pixabay (Pexels solo si hay PEXELS_API_KEY).
//
//   node scripts/fetch-clips.mjs buscar  <reel_id|_calendario|--all> [--n=4] [--fuente=pixabay] [--rehacer=3]
//        Busca candidatos para cada hueco sin clip, descarga vistas previas y crea una hoja de contactos
//        (out/frames/candidatos/<reel>.jpg): una fila por hueco, una columna por candidato.
//   node scripts/fetch-clips.mjs elegir  <reel_id> <hueco>=<candidato>[:centro_x[:inicio[:zoom]]] …
//        Fija el candidato, descarga el original, genera la versión vertical y una hoja con 3 fotogramas
//        por clip (out/frames/clips/<reel>.jpg) para revisarla.
//   node scripts/fetch-clips.mjs aprobar <reel_id> <hueco>… | todos
//        Marca "revisado": true, prepara el recorte final y lo sube a nuestro almacenamiento (clips/).
//   node scripts/fetch-clips.mjs sinclip <reel_id> <hueco>…
//        La escena pasa a texto y gráfica sobre fondo neutro (no hay clip adecuado).
//
// Los huecos se numeran desde 1 en el orden de las escenas; el último es el fondo final.
import { rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadReel, saveReel, reelIds, clipSlots, ffmpeg, OUT, mkdirp } from "./lib/common.mjs";
import { buscar } from "./lib/sources.mjs";
import { clipKey, downloadPreview, prepareVertical, uploadClip } from "./lib/clips.mjs";

const [cmd, objetivo, ...resto] = process.argv.slice(2);
const opt = (k, d) => resto.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const META = ["fuente", "id", "url_pagina", "autor", "autor_url", "archivo_origen", "ancho", "alto", "duracion_clip"];
const CELL_W = 480;
const CELL_H = 270;

function frameTo(file, t, out, w, h) {
  ffmpeg(["-ss", String(Math.max(0, t)), "-i", file, "-frames:v", "1", "-vf", `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=black`, "-q:v", "4", out]);
}
function blank(out, w, h) {
  ffmpeg(["-f", "lavfi", "-i", `color=c=0x222222:s=${w}x${h}`, "-frames:v", "1", out]);
}
function sheet(dir, cols, rows, out) {
  ffmpeg(["-framerate", "1", "-i", path.join(dir, "c%03d.jpg"), "-vf", `tile=${cols}x${rows}:padding=10:margin=10:color=white`, "-frames:v", "1", "-q:v", "3", out]);
}

async function cmdBuscar(id) {
  const reel = loadReel(id);
  const n = Number(opt("n", 4));
  const fuente = opt("fuente", "pixabay");
  const rehacer = opt("rehacer");
  const slots = clipSlots(reel);
  const usados = new Set(slots.map((s) => clipKey(s.clip)).filter(Boolean));
  console.log(`\n${reel.id}`);
  const dir = path.join(OUT, "frames", "candidatos", `${reel.id}-celdas`);
  rmSync(dir, { recursive: true, force: true });
  mkdirp(dir);
  let k = 0;
  for (const [i, s] of slots.entries()) {
    const c = s.clip;
    if (rehacer && Number(rehacer) !== i + 1) {
      for (let j = 0; j < n; j++) blank(path.join(dir, `c${String(k++).padStart(3, "0")}.jpg`), CELL_W, CELL_H);
      continue;
    }
    if (!c.sin_clip && (!c.id || rehacer)) {
      const minDur = Math.ceil((c.inicio ?? 1) + s.duracion + 0.5);
      const excluir = new Set([...usados, ...(c.descartados || [])]);
      const cands = (await buscar(c.query, minDur, { fuente, excluir })).slice(0, n);
      c.candidatos = cands.map(({ preview, etiquetas, relevancia, ...m }) => ({ ...m, preview, etiquetas, relevancia }));
      console.log(`  hueco ${i + 1} (${s.donde}) "${c.query}": ${cands.length} candidatos`);
      cands.forEach((v, j) => console.log(`     ${j + 1}. ${v.fuente}-${v.id} ${v.ancho}x${v.alto} ${v.duracion_clip}s rel ${v.relevancia.toFixed(2)} · ${v.etiquetas}`));
    }
    const cands = c.candidatos || [];
    for (let j = 0; j < n; j++) {
      const out = path.join(dir, `c${String(k++).padStart(3, "0")}.jpg`);
      const v = cands[j];
      if (!v) {
        blank(out, CELL_W, CELL_H);
        continue;
      }
      const f = await downloadPreview(v);
      frameTo(f, (c.inicio ?? 1) + s.duracion / 2, out, CELL_W, CELL_H);
    }
  }
  saveReel(reel);
  const out = path.join(OUT, "frames", "candidatos", `${reel.id}.jpg`);
  sheet(dir, n, slots.length, out);
  console.log(out);
}

async function cmdElegir(id, picks) {
  const reel = loadReel(id);
  const slots = clipSlots(reel);
  for (const p of picks) {
    const [h, spec] = p.split("=");
    const [cand, cx, ini, zoom] = spec.split(":");
    const s = slots[Number(h) - 1];
    if (!s) throw new Error(`No existe el hueco ${h}`);
    const c = s.clip;
    const v = c.candidatos?.[Number(cand) - 1];
    if (cand !== "0") {
      if (!v) throw new Error(`Hueco ${h}: no hay candidato ${cand}`);
      for (const k of META) c[k] = v[k];
    }
    c.recorte = { centro_x: cx !== undefined && cx !== "" ? Number(cx) : c.recorte?.centro_x ?? 0.5, centro_y: c.recorte?.centro_y ?? 0.5, zoom: zoom ? Number(zoom) : c.recorte?.zoom ?? 1 };
    if (ini !== undefined && ini !== "") c.inicio = Number(ini);
    c.revisado = false;
    delete c.archivo;
    delete c.sin_clip;
    console.log(`  hueco ${h}: ${clipKey(c)} centro_x ${c.recorte.centro_x} inicio ${c.inicio} zoom ${c.recorte.zoom}`);
  }
  saveReel(reel);
  await hojaElegidos(reel);
}

/** 3 fotogramas (inicio, mitad, final del tramo) de cada clip vertical elegido */
async function hojaElegidos(reel) {
  const slots = clipSlots(reel);
  const dir = path.join(OUT, "frames", "clips", `${reel.id}-celdas`);
  rmSync(dir, { recursive: true, force: true });
  mkdirp(dir);
  let k = 0;
  for (const s of slots) {
    const c = s.clip;
    for (let j = 0; j < 3; j++) {
      const out = path.join(dir, `c${String(k++).padStart(3, "0")}.jpg`);
      if (!clipKey(c) || c.sin_clip) {
        blank(out, 270, 480);
        continue;
      }
      const { file } = await prepareVertical(c, s.duracion);
      frameTo(file, [0.05, s.duracion / 2, s.duracion - 0.1][j], out, 270, 480);
    }
  }
  // 3 fotogramas por hueco, 2 huecos por fila
  const out = path.join(OUT, "frames", "clips", `${reel.id}.jpg`);
  const filas = Math.ceil(slots.length / 2);
  if (slots.length % 2) for (let j = 0; j < 3; j++) blank(path.join(dir, `c${String(k++).padStart(3, "0")}.jpg`), 270, 480);
  sheet(dir, 6, filas, out);
  console.log(out);
}

async function cmdAprobar(id, huecos) {
  const reel = loadReel(id);
  const slots = clipSlots(reel);
  const lista = huecos[0] === "todos" ? slots.map((_, i) => i + 1) : huecos.map(Number);
  for (const h of lista) {
    const s = slots[h - 1];
    const c = s.clip;
    if (c.sin_clip) continue;
    if (!clipKey(c)) throw new Error(`Hueco ${h}: sin clip elegido`);
    const { file, archivo } = await prepareVertical(c, s.duracion);
    await uploadClip(file, archivo);
    c.archivo = archivo;
    c.revisado = true;
    delete c.candidatos;
    console.log(`  hueco ${h}: ${clipKey(c)} aprobado → ${archivo}`);
  }
  saveReel(reel);
}

function cmdSinClip(id, huecos) {
  const reel = loadReel(id);
  const slots = clipSlots(reel);
  for (const h of huecos.map(Number)) {
    const c = slots[h - 1].clip;
    for (const k of [...META, "archivo", "candidatos"]) delete c[k];
    c.sin_clip = true;
    c.revisado = true;
    console.log(`  hueco ${h}: sin clip (fondo neutro)`);
  }
  // Los anillos de músculo de esas escenas ya no tienen sobre qué ir
  for (const e of reel.escenas) if (e.clip?.sin_clip && e.musculo) e.musculo = e.musculo.map((m) => ({ nombre: m.nombre, clip: null, x: null, y: null, keyframes: [] }));
  saveReel(reel);
}

const ids = objetivo === "--all" ? reelIds() : [objetivo];
if (!cmd || !objetivo) {
  console.log("Uso: node scripts/fetch-clips.mjs buscar|elegir|aprobar|sinclip <reel_id> …");
  process.exit(1);
}
const args = resto.filter((a) => !a.startsWith("--"));
for (const id of ids) {
  if (cmd === "buscar") await cmdBuscar(id);
  else if (cmd === "elegir") await cmdElegir(id, args);
  else if (cmd === "aprobar") await cmdAprobar(id, args);
  else if (cmd === "sinclip") cmdSinClip(id, args);
  else if (cmd === "hoja") await hojaElegidos(loadReel(id));
  else throw new Error(`Comando desconocido: ${cmd}`);
}
writeFileSync(path.join(OUT, ".ultimo-fetch"), new Date().toISOString());
