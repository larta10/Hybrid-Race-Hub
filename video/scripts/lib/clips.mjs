// Pexels Video API: búsqueda con filtros y descarga en caché (video/cache/{id}.mp4).
import { existsSync, createWriteStream, renameSync, statSync, unlinkSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { CACHE, mkdirp } from "./common.mjs";

const API = "https://api.pexels.com/videos";

function key() {
  const k = process.env.PEXELS_API_KEY;
  if (!k) throw new Error("Falta PEXELS_API_KEY (en .env.local o como secreto de GitHub)");
  return k;
}

async function api(pathname, params = {}) {
  const url = new URL(API + pathname);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  for (let a = 0; ; a++) {
    const r = await fetch(url, { headers: { Authorization: key() } });
    if (r.status === 429 && a < 3) {
      await new Promise((ok) => setTimeout(ok, 5000 * (a + 1)));
      continue;
    }
    if (!r.ok) throw new Error(`Pexels ${r.status} en ${url.pathname}`);
    return r.json();
  }
}

/** Mejor archivo del vídeo: lado corto ≥ 1080 si existe (sin pasar de 4K), mp4 */
export function bestFile(video) {
  const files = (video.video_files || []).filter((f) => f.file_type === "video/mp4" && f.width && f.height);
  const corto = (f) => Math.min(f.width, f.height);
  const hd = files.filter((f) => corto(f) >= 1080 && corto(f) <= 2160).sort((a, b) => corto(a) - corto(b));
  if (hd.length) return hd[0];
  const ok = files.filter((f) => corto(f) >= 720).sort((a, b) => corto(b) - corto(a));
  return ok[0] || null;
}

/**
 * Candidatos para una escena, mejor primero. Filtros: mínimo HD, duración suficiente,
 * vertical primero y luego horizontal (recortable a 9:16 ajustando centro_x).
 */
export async function searchCandidates(query, minDur, excluir = new Set()) {
  const out = [];
  for (const orientation of ["portrait", "landscape"]) {
    const data = await api("/search", { query, orientation, size: "medium", per_page: 40 });
    for (const v of data.videos || []) {
      if (excluir.has(String(v.id)) || out.some((o) => o.id === v.id)) continue;
      if (v.duration < minDur) continue;
      const f = bestFile(v);
      if (!f) continue;
      out.push({ ...v, file: f, orientation });
    }
  }
  return out;
}

export function toClip(v, query, previo = {}) {
  return {
    query,
    pexels_id: String(v.id),
    url: v.url,
    autor: v.user?.name || "",
    autor_url: v.user?.url || "",
    archivo_url: v.file.link,
    ancho: v.file.width,
    alto: v.file.height,
    duracion_clip: v.duration,
    inicio: previo.inicio ?? (v.duration > 8 ? 1 : 0),
    recorte: previo.recorte || { centro_x: 0.5, centro_y: 0.5, zoom: 1 },
    revisado: false,
  };
}

/** Descarga (con caché) y devuelve la ruta local */
export async function downloadClip(clip) {
  mkdirp(CACHE);
  const dest = path.join(CACHE, `${clip.pexels_id}.mp4`);
  if (existsSync(dest) && statSync(dest).size > 10000) return dest;
  const tmp = `${dest}.part`;
  const r = await fetch(clip.archivo_url, { redirect: "follow" });
  if (!r.ok || !r.body) throw new Error(`No se pudo descargar el clip ${clip.pexels_id} (${r.status})`);
  try {
    await pipeline(Readable.fromWeb(r.body), createWriteStream(tmp));
    renameSync(tmp, dest);
  } catch (e) {
    if (existsSync(tmp)) unlinkSync(tmp);
    throw e;
  }
  return dest;
}
