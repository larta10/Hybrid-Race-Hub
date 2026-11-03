/**
 * Lectura de carreras desde Supabase en el servidor (getStaticProps / ISR).
 * Solo lectura con la clave anon. Nada de datos inventados: si Supabase falla,
 * se devuelve una lista vacía y la página muestra un mensaje neutro.
 */
import { SUPABASE_URL, ANON_KEY, NICHE_PARENTS } from "./shared";
import { officialUrl } from "./race-links";
import { raceSlug } from "./race-slug";
import { upcomingVerifiedEvents } from "./verified-events";

const FIELDS = [
  "id", "nombre", "modalidad", "modalidad_id", "modalidad_parent", "fecha", "fecha_iso",
  "ubicacion", "comunidad", "municipio", "provincia", "precio", "formato", "distancia",
  "url", "estado", "notas", "created_at", "updated_at",
].join(",");

export function todayISO(d = new Date()) {
  // Fecha de hoy en hora de Madrid (la web es para España)
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);
}

/**
 * Carreras futuras de Supabase más los eventos comprobados a mano (lib/verified-events.js),
 * ordenadas por fecha y con su slug de ficha (/carreras/<slug>).
 */
export async function fetchUpcomingRaces({ limit = 500 } = {}) {
  const fromDb = await fetchRaces({ from: todayISO(), limit });
  const all = [...fromDb, ...upcomingVerifiedEvents(todayISO(), fromDb)].sort((a, b) => a.fecha_iso.localeCompare(b.fecha_iso));
  return withSlugs(all).slice(0, limit);
}

/** Todas las carreras del nicho (pasadas y futuras) con slug: para las fichas y el sitemap. */
export async function fetchAllRaces() {
  const fromDb = await fetchRaces({ limit: 2000 });
  return withSlugs([...fromDb, ...upcomingVerifiedEvents("0000-00-00", fromDb)]);
}

/**
 * Slug único por carrera. Si dos comparten slug (misma prueba y año repetida en la tabla),
 * la edición más reciente se queda el slug limpio y las demás llevan el id al final.
 */
export function withSlugs(races) {
  const order = [...races].sort((a, b) => (b.fecha_iso || "").localeCompare(a.fecha_iso || "") || String(a.id).localeCompare(String(b.id), "en", { numeric: true }));
  const used = new Set();
  const slugOf = new Map();
  for (const r of order) {
    let s = raceSlug(r);
    if (used.has(s)) s = `${s}-${String(r.id).replace(/^verified-/, "v")}`;
    used.add(s);
    slugOf.set(r, s);
  }
  return races.map(r => ({ ...r, slug: slugOf.get(r) }));
}

async function fetchRaces({ from = null, limit = 500 } = {}) {
  const p = new URLSearchParams();
  p.set("select", FIELDS);
  p.set("modalidad_parent", `in.(${NICHE_PARENTS.join(",")})`);
  if (from) p.set("fecha_iso", `gte.${from}`);
  p.set("order", "fecha_iso.asc");
  p.set("limit", String(limit));
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!r.ok) throw new Error(`Supabase ${r.status}`);
    const data = await r.json();
    return Array.isArray(data) ? data.map(cleanRace) : [];
  } catch (e) {
    console.error("fetchRaces:", e.message);
    return [];
  }
}

/**
 * Correcciones comprobadas en la web oficial que aún no están en Supabase (se aplican al leer).
 * El SQL equivalente está en docs/datos/cambios-races-2026-11-03.sql: cuando se ejecute, se puede borrar de aquí.
 */
const RACE_FIXES = {
  // hyrox.es/eventos/hyrox-barcelona-26-27 (03-11-2026): horarios del miércoles 11 al domingo 15 de noviembre
  153: { fecha_iso: "2026-11-11", fecha_fin_iso: "2026-11-15", fuente: "hyrox.es", verificado: "2026-11-03" },
};

/** Normaliza campos vacíos o con guiones a null para no mostrar basura. */
function cleanRace(row) {
  const r = { ...row, ...(RACE_FIXES[row.id] || {}) };
  const blank = v => (v == null || /^\s*(—|-|–|n\/a)?\s*$/i.test(String(v)) ? null : v);
  return {
    ...r,
    precio: blank(r.precio),
    formato: blank(r.formato),
    distancia: blank(r.distancia),
    url: officialUrl({ ...r, url: blank(r.url) }),
    ubicacion: blank(r.ubicacion),
  };
}

/** Temporada actual-siguiente, p. ej. "2026-2027". */
export function seasonLabel(d = new Date()) {
  const y = Number(todayISO(d).slice(0, 4));
  return `${y}-${y + 1}`;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "2026-10-16" -> { d: "16", m: "oct", y: "2026", long: "16 de octubre de 2026" } */
export function dateParts(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return { d: String(Number(d)), m: MESES[Number(m) - 1], y, long: `${Number(d)} de ${MESES_LARGOS[Number(m) - 1]} de ${y}` };
}

/** Modalidad legible y corta para etiquetas */
export function modalityLabel(r) {
  const id = r.modalidad_id || "";
  if (/spartan/.test(id)) return "Spartan";
  if (/hyrox/.test(id) && /deka/i.test(r.modalidad || "")) return "DEKA";
  return r.modalidad || (r.modalidad_parent === "ocr" ? "OCR" : "Funcional");
}

/** Precio numérico mínimo si el texto lo contiene ("desde 80€" -> 80) */
export function priceNumber(precio) {
  const m = String(precio || "").match(/(\d+(?:[.,]\d+)?)\s*€|€\s*(\d+)/);
  return m ? Number((m[1] || m[2]).replace(",", ".")) : null;
}

/**
 * Último día de la carrera (YYYY-MM-DD) si dura varios días: sale de fecha_fin_iso o de las notas
 * del organizador ("Nov 12–15", "Del 17 al 21 de marzo", "6 y 7 de febrero"). Solo se acepta si el
 * primer día de las notas coincide con fecha_iso; si no, la carrera es de un día.
 */
export function raceEndDate(r) {
  if (!r.fecha_iso) return null;
  if (r.fecha_fin_iso && r.fecha_fin_iso >= r.fecha_iso) return r.fecha_fin_iso;
  const t = String(r.notas || "");
  if (/se corren? el (s[áa]bado|domingo)/i.test(t)) return r.fecha_iso;
  const startDay = Number(r.fecha_iso.slice(8, 10));
  const m = t.match(/(?:del\s+)?(\d{1,2})(?:\s*,\s*\d{1,2})*\s*(?:[–-]|\by\b|\bal\b)\s*(\d{1,2})\b/i);
  if (!m || Number(m[1]) !== startDay) return r.fecha_iso;
  const end = Number(m[2]);
  if (end <= startDay || end - startDay > 6) return r.fecha_iso;
  return `${r.fecha_iso.slice(0, 8)}${String(end).padStart(2, "0")}`;
}

// Organizadores conocidos por el dominio de la web oficial; si no, se usa el propio dominio
const ORGANIZERS = {
  "hyrox.es": "HYROX España", "spartan.com": "Spartan Race España", "desafiodeguerreros.com.es": "Desafío de Guerreros",
  "medievalxtremrace.com": "Medieval Xtreme Race", "survivor-race.com": "Survivor Race", "hybrid-day.com": "Hybrid Day",
  "hybridzone.es": "Hybrid Zone", "hybridleague.es": "Hybrid League", "theboldseries.com": "The BOLD Series",
  "farinatorace.es": "Farinato Race", "bestialrace.com": "Bestial Race", "desafiocostablanca.com": "Desafío Costa Blanca",
  "hyatlon.org": "Federación Española de Triatlón (Hyatlón)",
};
export function raceOrganizer(r) {
  if (!r.url) return null;
  try {
    const u = new URL(r.url);
    const host = u.hostname.replace(/^(www|es|my)\./, "");
    const key = Object.keys(ORGANIZERS).find(k => host === k || host.endsWith(`.${k}`));
    return { name: key ? ORGANIZERS[key] : host, url: `${u.protocol}//${u.hostname}/` };
  } catch { return null; }
}

/** Disponibilidad de schema.org según el estado de inscripción de la tabla races */
function availability(estado) {
  const e = String(estado || "").toLowerCase();
  if (/agotad/.test(e)) return "https://schema.org/SoldOut";
  if (/[uú]ltimas/.test(e)) return "https://schema.org/LimitedAvailability";
  if (/abiert/.test(e)) return "https://schema.org/InStock";
  if (/pr[oó]xim/.test(e)) return "https://schema.org/PreOrder";
  return null;
}

/**
 * Schema.org SportsEvent a partir de una carrera real. Solo para carreras futuras (devuelve null si ya pasó).
 * Las fechas van sin hora: los organizadores no publican la hora de salida de forma fiable y
 * Google acepta fecha sin hora; inventar una hora con zona sería dar un dato falso.
 */
export function raceEventSchema(r, siteUrl) {
  if (!r.fecha_iso) return null;
  const end = raceEndDate(r);
  if (end < todayISO()) return null;
  const place = r.ubicacion || r.municipio || r.provincia || r.comunidad || "España";
  const page = r.slug ? `${siteUrl}/carreras/${r.slug}` : null;
  const mod = modalityLabel(r);
  const ev = {
    "@type": "SportsEvent",
    "name": r.nombre,
    "startDate": r.fecha_iso,
    "endDate": end,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "sport": mod,
    "description": [`${mod} en ${r.municipio || place}`, r.formato && `Formato: ${r.formato}`, r.distancia && `Distancia: ${r.distancia}`].filter(Boolean).join(". ") + ".",
    "image": [`${siteUrl}/og?title=${encodeURIComponent(r.nombre)}&cat=${encodeURIComponent(mod)}`],
    "location": {
      "@type": "Place",
      "name": place,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": r.municipio || place,
        ...(r.provincia || r.comunidad ? { "addressRegion": r.provincia || r.comunidad } : {}),
        "addressCountry": "ES",
      },
    },
  };
  if (page) ev.url = page;
  const org = raceOrganizer(r);
  if (org) ev.organizer = { "@type": "Organization", ...org };
  if (r.url) {
    const n = priceNumber(r.precio);
    const av = availability(r.estado);
    ev.offers = {
      "@type": "Offer", "url": r.url,
      ...(n != null ? { "price": n, "priceCurrency": "EUR" } : {}),
      ...(av ? { "availability": av } : {}),
    };
  }
  return ev;
}

/** Fecha (YYYY-MM-DD) del último cambio entre varias carreras, para el lastmod del sitemap. */
export function lastUpdated(races, floor = "2026-01-01") {
  return races.reduce((m, r) => {
    const d = String(r.updated_at || "").slice(0, 10);
    return d > m ? d : m;
  }, floor);
}
