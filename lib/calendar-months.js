/**
 * Calendario por meses: /calendario/<año>/<mes> para el mes actual y los 11 siguientes.
 * Una página de mes con menos de MIN_MONTH_RACES carreras se publica con noindex.
 */
export const MIN_MONTH_RACES = 3;
export const MONTH_SLUGS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** Los 12 meses a partir de hoy (YYYY-MM-DD): [{ year, month (1-12), slug, label, href, key "YYYY-MM" }] */
export function nextMonths(todayIso, n = 12) {
  let y = Number(todayIso.slice(0, 4)), m = Number(todayIso.slice(5, 7));
  const out = [];
  for (let i = 0; i < n; i++) {
    const slug = MONTH_SLUGS[m - 1];
    out.push({ year: y, month: m, slug, label: `${slug} ${y}`, href: `/calendario/${y}/${slug}`, key: `${y}-${String(m).padStart(2, "0")}` });
    m += 1; if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

/** Meses con su número de carreras (por fecha de inicio) */
export function monthsWithCounts(races, todayIso) {
  return nextMonths(todayIso).map(mo => ({ ...mo, count: races.filter(r => (r.fecha_iso || "").startsWith(mo.key)).length }));
}
