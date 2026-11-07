// Rutas y utilidades comunes de los scripts de vídeo.
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

export const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const ROOT = path.resolve(VIDEO, "..");
export const REELS_DIR = path.join(ROOT, "instagram/reels");
export const MUSIC_DIR = path.join(ROOT, "instagram/music");
export const FONTS_DIR = path.join(ROOT, "instagram/fonts");
export const CACHE = path.join(VIDEO, "cache");
export const OUT = path.join(VIDEO, "out");
export const PUBLIC = path.join(VIDEO, "public");

const envLocal = path.join(ROOT, ".env.local");
if (existsSync(envLocal)) dotenv.config({ path: envLocal, quiet: true });

const require = createRequire(import.meta.url);
/** ffmpeg: FFMPEG_PATH si está definido; si no, el binario de ffmpeg-static */
export const FFMPEG = process.env.FFMPEG_PATH || require("ffmpeg-static");

export function ffmpeg(args, { quiet = true } = {}) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-y", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`ffmpeg falló (${r.status}): ${(r.stderr || "").split("\n").slice(-6).join("\n")}`);
  if (!quiet) process.stdout.write(r.stderr);
  return r.stderr || "";
}

/** Duración en segundos leyendo la cabecera con ffmpeg (no hace falta ffprobe) */
export function mediaDuration(file) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const m = (r.stderr || "").match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
}

export const mkdirp = (d) => (mkdirSync(d, { recursive: true }), d);

export function reelPath(id) {
  const f = path.join(REELS_DIR, `${id.replace(/\.json$/, "")}.json`);
  if (!existsSync(f)) throw new Error(`No existe el guion ${f}`);
  return f;
}
export const loadReel = (id) => JSON.parse(readFileSync(reelPath(id), "utf8"));
export const saveReel = (reel) => writeFileSync(reelPath(reel.id), JSON.stringify(reel, null, 2) + "\n");
export const reelIds = () =>
  readdirSync(REELS_DIR)
    .filter((f) => /^r\d{3}-[a-z0-9-]+\.json$/.test(f))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();

/** Todos los clips de un guion (escenas + fondo final), con la duración que necesita cada uno */
export function clipSlots(reel) {
  const slots = (reel.escenas || []).map((e, i) => ({ clip: e.clip, duracion: e.duracion, donde: `escena ${i + 1}`, clave: String(i) }));
  if (reel.clip_final) slots.push({ clip: reel.clip_final, duracion: 9.5, donde: "fondo final", clave: "final" });
  return slots.filter((s) => s.clip);
}

/** Un clip está listo si tiene fuente, id, copia propia recortada (archivo) y se ha revisado a ojo */
export const clipListo = (c) => Boolean(c?.sin_clip || (c?.fuente && c?.id && c?.archivo && c?.revisado === true));
