// Fuentes de vídeo de stock. "pixabay" por defecto; "pexels" solo si hay PEXELS_API_KEY.
// Las búsquedas se cachean 24 h en video/cache/busquedas/ (normas de uso de la API de Pixabay).
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { CACHE, mkdirp } from "./common.mjs";

const DIA = 24 * 3600 * 1000;
const STOP = new Set(["the", "a", "of", "and", "with", "in", "on", "man", "woman", "person", "people"]);

async function cachedJson(clave, url, headers = {}) {
  const dir = mkdirp(path.join(CACHE, "busquedas"));
  const f = path.join(dir, `${createHash("sha1").update(clave).digest("hex").slice(0, 16)}.json`);
  if (existsSync(f) && Date.now() - statSync(f).mtimeMs < DIA) return JSON.parse(readFileSync(f, "utf8"));
  for (let a = 0; ; a++) {
    const r = await fetch(url, { headers });
    if (r.status === 429 && a < 4) {
      await new Promise((ok) => setTimeout(ok, 15000 * (a + 1)));
      continue;
    }
    if (!r.ok) throw new Error(`Búsqueda de vídeo ${r.status}`);
    const j = await r.json();
    writeFileSync(f, JSON.stringify(j));
    return j;
  }
}

/** Relevancia: palabras de la consulta presentes en las etiquetas del vídeo */
function score(query, tags) {
  const t = String(tags).toLowerCase();
  const ws = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  return ws.reduce((a, w) => a + (t.includes(w) || t.includes(w.replace(/s$/, "")) ? 1 : 0), 0) / Math.max(1, ws.length);
}

// ---------- Pixabay ----------
async function pixabay(query, minDur) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error("Falta PIXABAY_API_KEY");
  const url = `https://pixabay.com/api/videos/?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&video_type=film&per_page=50&safesearch=true`;
  const j = await cachedJson(`pixabay:${query}`, url);
  const out = [];
  for (const h of j.hits || []) {
    if (h.duration < minDur) continue;
    // Mejor calidad disponible con al menos 1280 px de ancho, sin pasar de 4K
    const f = ["large", "medium"].map((k) => h.videos?.[k]).find((v) => v?.url && v.width >= 1280 && v.width <= 3840);
    if (!f) continue;
    const prev = ["tiny", "small", "medium"].map((k) => h.videos?.[k]).find((v) => v?.url) || f;
    out.push({
      fuente: "pixabay",
      id: String(h.id),
      url_pagina: h.pageURL,
      autor: h.user,
      autor_url: `https://pixabay.com/users/${h.user}-${h.user_id}/`,
      archivo_origen: f.url,
      preview: prev.url,
      ancho: f.width,
      alto: f.height,
      duracion_clip: h.duration,
      etiquetas: h.tags,
      relevancia: score(query, h.tags),
    });
  }
  return out;
}

// ---------- Pexels (desactivado si no hay clave) ----------
async function pexels(query, minDur) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const out = [];
  for (const orientation of ["portrait", "landscape"]) {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientation}&size=medium&per_page=40`;
    const j = await cachedJson(`pexels:${orientation}:${query}`, url, { Authorization: key });
    for (const v of j.videos || []) {
      if (v.duration < minDur) continue;
      const files = (v.video_files || []).filter((f) => f.file_type === "video/mp4" && f.width >= 1280 && f.width <= 3840).sort((a, b) => b.width - a.width);
      if (!files.length) continue;
      out.push({ fuente: "pexels", id: String(v.id), url_pagina: v.url, autor: v.user?.name || "", autor_url: v.user?.url || "", archivo_origen: files[0].link, preview: files.at(-1).link, ancho: files[0].width, alto: files[0].height, duracion_clip: v.duration, etiquetas: "", relevancia: 0.5 });
    }
  }
  return out;
}

export const FUENTES = { pixabay, pexels };
export const fuentesActivas = () => ["pixabay", ...(process.env.PEXELS_API_KEY ? ["pexels"] : [])];

/** Candidatos ordenados: más relevantes primero, luego más resolución */
export async function buscar(query, minDur, { fuente = "pixabay", excluir = new Set() } = {}) {
  const fn = FUENTES[fuente];
  if (!fn) throw new Error(`Fuente desconocida: ${fuente}`);
  const c = (await fn(query, minDur)).filter((v) => !excluir.has(`${v.fuente}-${v.id}`));
  return c.sort((a, b) => b.relevancia - a.relevancia || b.ancho - a.ancho);
}
