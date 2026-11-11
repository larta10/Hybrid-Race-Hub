/**
 * Del calendario al plan: qué prueba del generador corresponde a una carrera de la tabla races
 * y el enlace que abre el generador con prueba y fecha ya puestas.
 */
export const PLAN_PATH = "/plan-entrenamiento-hyrox";
export const PLAN_OCR_PATH = "/plan-entrenamiento-ocr";
export const MI_PLAN_PATH = "/mi-plan";

const txt = r => `${r.nombre || ""} ${r.modalidad || ""} ${r.formato || ""} ${r.distancia || ""}`.toLowerCase();

export function pruebaFromRace(r) {
  const t = txt(r);
  if (/\bhyrox\b/.test(t)) return "hyrox";
  if (/\bdeka\b/.test(t)) return "deka";
  const ocr = r.modalidad_parent === "ocr" || /spartan|ocr|obst[aá]culos/.test(t);
  if (ocr) {
    const km = Math.max(0, ...[...t.matchAll(/(\d+(?:[.,]\d+)?)\s*k(?:m|\b)/g)].map(m => Number(m[1].replace(",", "."))));
    if (/beast|ultra/.test(t) || km >= 18) return "ocr_larga";
    if (/sprint/.test(t) || (km > 0 && km <= 7)) return "ocr_sprint";
    return "ocr_media";
  }
  return "hibrida";
}

/** Landing del generador que le toca a cada prueba (para el canonical y para "cambiar respuestas"). */
export const landingFor = prueba => (String(prueba || "").startsWith("ocr") ? PLAN_OCR_PATH : PLAN_PATH);

/** Enlace "Prepárala: plan gratis" de una carrera con slug y fecha. */
export function planHrefForRace(r) {
  const prueba = pruebaFromRace(r);
  const q = new URLSearchParams({ prueba });
  if (r.fecha_iso) q.set("fecha", r.fecha_iso);
  if (r.slug) q.set("carrera", r.slug);
  return `${landingFor(prueba)}?${q}`;
}
