/**
 * Lectura de carreras desde Supabase en el servidor (getStaticProps / ISR).
 * Solo lectura con la clave anon. Nada de datos inventados: si Supabase falla,
 * se devuelve una lista vacía y la página muestra un mensaje neutro.
 */
import { SUPABASE_URL, ANON_KEY, NICHE_PARENTS } from "./shared";
import { officialUrl } from "./race-links";

const FIELDS = [
  "id", "nombre", "modalidad", "modalidad_id", "modalidad_parent", "fecha", "fecha_iso",
  "ubicacion", "comunidad", "municipio", "provincia", "precio", "formato", "distancia",
  "url", "estado",
].join(",");

export function todayISO(d = new Date()) {
  // Fecha de hoy en hora de Madrid (la web es para España)
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);
}

export async function fetchUpcomingRaces({ limit = 500 } = {}) {
  const p = new URLSearchParams();
  p.set("select", FIELDS);
  p.set("modalidad_parent", `in.(${NICHE_PARENTS.join(",")})`);
  p.set("fecha_iso", `gte.${todayISO()}`);
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
    console.error("fetchUpcomingRaces:", e.message);
    return [];
  }
}

/** Normaliza campos vacíos o con guiones a null para no mostrar basura. */
function cleanRace(r) {
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

/** Schema.org Event a partir de una carrera real */
export function raceEventSchema(r, siteUrl) {
  if (!r.fecha_iso) return null;
  const place = r.ubicacion || r.municipio || r.provincia || r.comunidad || "España";
  const ev = {
    "@type": "SportsEvent",
    "name": r.nombre,
    "startDate": r.fecha_iso,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "sport": modalityLabel(r),
    "location": {
      "@type": "Place",
      "name": place,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": r.municipio || place,
        ...(r.provincia ? { "addressRegion": r.provincia } : {}),
        "addressCountry": "ES",
      },
    },
  };
  if (r.url) ev.url = r.url;
  const n = priceNumber(r.precio);
  if (n != null && r.url) {
    ev.offers = { "@type": "Offer", "price": n, "priceCurrency": "EUR", "url": r.url };
  }
  ev.organizer = { "@type": "Organization", "name": r.nombre.split(/\s+\d{4}|\s+—|\(/)[0].trim(), ...(r.url ? { url: r.url } : {}) };
  return ev;
}
