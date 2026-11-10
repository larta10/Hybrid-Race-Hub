// Fuentes de vídeo de stock: Pixabay siempre; Pexels además si hay PEXELS_API_KEY.
// Las búsquedas se cachean 24 h en video/cache/busquedas/ (normas de uso de las dos API).
// Licencias: Pixabay Content License y Pexels License (uso comercial y modificación sin atribución obligatoria).
// En los dos casos el clip se descarga, se recorta y se sube a nuestro bucket: nunca se enlaza a su CDN.
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { CACHE, mkdirp } from "./common.mjs";

const DIA = 24 * 3600 * 1000;
const STOP = new Set(["the", "a", "of", "and", "with", "in", "on", "man", "woman", "person", "people", "video"]);
/** Altura mínima del original: el recorte 9:16 sale de la altura completa */
export const ALTO_MINIMO = 1080;
// Señales de metraje de estudio posado, con texto, marcas o que no es deporte de personas: bajan la puntuación
const MALAS = /\b(studio|isolated|green ?screen|chroma|smil\w*|portrait|posing|pose|logo|brand|nike|adidas|text|animation|cartoon|3d|illustration|render|model|selfie|animals?|dogs?|cats?|horses?|pets?|puppy|frog|bird|fish|shark|underwater|motocross|motorcycle|motorbike|car|bike|bicycle|drone|aerial|toy|children|kids?|baby|wallpaper)\b/i;
const BUENAS = /\b(race|competition|marathon|runners?|athletes?|sweat\w*|effort|crossfit|workout|training|exercise|obstacle|mud|gym|fitness)\b/i;

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

/** Relevancia 0-1: palabras de la consulta que son palabras completas de las etiquetas, con ajuste por señales */
export function score(query, tags) {
  const base = cobertura(query, tags);
  return Math.max(0, Math.min(1, base + (BUENAS.test(tags) ? 0.1 : 0) - (MALAS.test(tags) ? 0.5 : 0)));
}

/** Parte de las palabras de la consulta que aparecen como palabras completas en las etiquetas */
export function cobertura(query, tags) {
  const t = String(tags).toLowerCase();
  const toks = new Set(t.split(/[\s,]+/).filter(Boolean));
  const has = (w) => toks.has(w) || toks.has(`${w}s`) || toks.has(w.replace(/s$/, "")) || toks.has(w.replace(/ing$/, "")) || toks.has(`${w}ing`);
  const ws = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  return ws.reduce((a, w) => a + (has(w) ? 1 : 0), 0) / Math.max(1, ws.length);
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
    // Mejor calidad con al menos 1080 px de alto, sin pasar de 4K
    const f = ["large", "medium"].map((k) => h.videos?.[k]).find((v) => v?.url && v.height >= ALTO_MINIMO && v.width <= 3840 && v.height <= 3840);
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

// ---------- Pexels (solo con PEXELS_API_KEY) ----------
/** Pexels no da etiquetas: la descripción está en la URL de la página (/video/man-pushing-a-sled-123/) */
const slugPexels = (u) => String(u || "").replace(/\/$/, "").split("/").pop().replace(/-\d+$/, "").replace(/-/g, " ");

async function pexels(query, minDur) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const out = [];
  for (const orientation of ["portrait", "landscape"]) {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientation}&size=medium&per_page=40`;
    const j = await cachedJson(`pexels:${orientation}:${query}`, url, { Authorization: key });
    for (const v of j.videos || []) {
      if (v.duration < minDur) continue;
      const files = (v.video_files || []).filter((f) => f.file_type === "video/mp4" && f.height >= ALTO_MINIMO && f.width <= 3840 && f.height <= 3840).sort((a, b) => a.height - b.height);
      if (!files.length) continue;
      // El más pequeño que cumple el mínimo (1080p o 4K vertical): menos descarga, misma salida 1080x1920
      const f = files[0];
      const prev = (v.video_files || []).filter((x) => x.file_type === "video/mp4").sort((a, b) => a.width - b.width)[0] || f;
      const etiquetas = slugPexels(v.url);
      out.push({ fuente: "pexels", id: String(v.id), url_pagina: v.url, autor: v.user?.name || "", autor_url: v.user?.url || "", archivo_origen: f.link, preview: prev.link, ancho: f.width, alto: f.height, duracion_clip: v.duration, etiquetas, relevancia: score(query, etiquetas) });
    }
  }
  return out;
}

export const FUENTES = { pixabay, pexels };
export const fuentesActivas = () => ["pixabay", ...(process.env.PEXELS_API_KEY ? ["pexels"] : [])];

/** Candidatos de una consulta en una fuente: más relevantes primero, luego más resolución */
export async function buscar(query, minDur, { fuente = "pixabay", excluir = new Set() } = {}) {
  const fn = FUENTES[fuente];
  if (!fn) throw new Error(`Fuente desconocida: ${fuente}`);
  const c = (await fn(query, minDur)).filter((v) => !excluir.has(`${v.fuente}-${v.id}`));
  return c.sort((a, b) => b.relevancia - a.relevancia || b.alto - a.alto);
}

/**
 * Varias consultas (lo que se VE en la escena) en todas las fuentes activas. Sin duplicados;
 * se intercalan fuentes y consultas para que la hoja de candidatos sea variada.
 */
export async function buscarVarias(queries, minDur, { fuentes = fuentesActivas(), excluir = new Set(), n = 6 } = {}) {
  const listas = [];
  for (const q of queries) for (const f of fuentes) listas.push((await buscar(q, minDur, { fuente: f, excluir })).filter((v) => cobertura(q, v.etiquetas) >= 0.66 && !MALAS.test(v.etiquetas)));
  const vistos = new Set();
  const out = [];
  for (let k = 0; out.length < n && listas.some((l) => l.length > k); k++) {
    for (const l of listas) {
      const v = l[k];
      if (!v || vistos.has(`${v.fuente}-${v.id}`)) continue;
      vistos.add(`${v.fuente}-${v.id}`);
      out.push(v);
      if (out.length >= n) break;
    }
  }
  return out;
}
