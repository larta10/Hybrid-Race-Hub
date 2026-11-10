// Clips de stock: original en video/cache/ (D:\hrh-video), versión vertical recortada al tramo usado
// y subida a NUESTRO almacenamiento (Supabase, bucket "instagram", carpeta clips/).
// Nunca se enlaza a las URLs de Pixabay: el render usa siempre la copia propia.
import { existsSync, createWriteStream, renameSync, statSync, unlinkSync, readFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { CACHE, mkdirp, ffmpeg } from "./common.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ssyljhtganuaanczxeep.supabase.co";
const BUCKET = "instagram";
export const W = 1080;
export const H = 1920;

export const clipKey = (c) => (c?.fuente && c?.id ? `${c.fuente}-${c.id}` : null);
export const origenPath = (c) => path.join(CACHE, `${clipKey(c)}.mp4`);

async function download(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 10000) return dest;
  mkdirp(path.dirname(dest));
  const tmp = `${dest}.part`;
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok || !r.body) throw new Error(`Descarga fallida (${r.status}) ${path.basename(dest)}`);
  try {
    await pipeline(Readable.fromWeb(r.body), createWriteStream(tmp));
    renameSync(tmp, dest);
  } catch (e) {
    if (existsSync(tmp)) unlinkSync(tmp);
    throw e;
  }
  return dest;
}

/** Original (máxima calidad elegida) en la caché local */
export const downloadOrigen = (c) => download(c.archivo_origen, origenPath(c));
export const downloadPreview = (cand) => download(cand.preview, path.join(CACHE, "prev", `${cand.fuente}-${cand.id}.mp4`));

/** Ventana de recorte 9:16 sobre el original, centrada en centro_x/centro_y y con zoom */
export function cropBox(c) {
  const { ancho: w, alto: h } = c;
  const r = c.recorte || {};
  const zoom = Math.max(1, r.zoom || 1);
  let cw, ch;
  if (w / h > 9 / 16) [ch, cw] = [h, (h * 9) / 16];
  else [cw, ch] = [w, (w * 16) / 9];
  cw = Math.floor(cw / zoom / 2) * 2;
  ch = Math.floor(ch / zoom / 2) * 2;
  const x = Math.round(Math.min(w - cw, Math.max(0, (r.centro_x ?? 0.5) * w - cw / 2)));
  const y = Math.round(Math.min(h - ch, Math.max(0, (r.centro_y ?? 0.5) * h - ch / 2)));
  return { cw, ch, x, y };
}

/** Huella del recorte: si cambian el clip, el inicio, la duración o el encuadre, se regenera */
export const prepHash = (c, dur) => createHash("sha1").update(JSON.stringify([clipKey(c), c.inicio, dur, c.recorte])).digest("hex").slice(0, 8);

/** Segundos que se recortan: c.tramo si ya está fijado; si no, al menos 7 s (o lo que quede del clip) para
 *  que una escena alargada por la voz o dividida en planos no tenga que ir a cámara lenta */
export const tramoDe = (c, dur) => c.tramo ?? Math.max(dur + 0.5, Math.min(7, (c.duracion_clip || 99) - (c.inicio || 0) - 0.2));

/**
 * Versión vertical 1080x1920 del tramo [inicio, inicio + tramo], sin audio.
 * Devuelve la ruta local (video/cache/v/...) y el tramo usado.
 */
export async function prepareVertical(c, dur) {
  await downloadOrigen(c);
  const tramo = Math.round(tramoDe(c, dur) * 10) / 10;
  const name = `${clipKey(c)}-${c.tramo == null && c.archivo ? prepHash(c, dur) : prepHash(c, tramo)}.mp4`;
  const out = path.join(mkdirp(path.join(CACHE, "v")), name);
  if (!existsSync(out)) {
    const { cw, ch, x, y } = cropBox(c);
    ffmpeg(["-ss", String(c.inicio || 0), "-t", String(c.tramo == null && c.archivo ? dur + 0.5 : tramo), "-i", origenPath(c), "-an", "-vf", `crop=${cw}:${ch}:${x}:${y},scale=${W}:${H}:flags=lanczos,fps=30,format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-movflags", "+faststart", out]);
  }
  return { file: out, archivo: `clips/${name}`, tramo };
}

/** Sube la versión vertical a nuestro bucket (necesita la service role key) */
export async function uploadClip(file, archivo) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY para subir el clip");
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${archivo}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "video/mp4", "x-upsert": "true", "cache-control": "31536000" },
    body: readFileSync(file),
  });
  if (!r.ok) throw new Error(`Subida del clip ${archivo}: ${r.status} ${await r.text()}`);
}

/** Copia local del clip vertical: de la caché o, si no está, de nuestro bucket público */
export async function localClip(c) {
  if (!c?.archivo) throw new Error("clip sin preparar");
  const dest = path.join(CACHE, "v", path.basename(c.archivo));
  return download(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${c.archivo}`, dest);
}
