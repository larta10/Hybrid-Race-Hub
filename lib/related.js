/**
 * Enlaces "Relacionado" generados a partir de los datos (se calculan en el servidor y se pasan como props):
 *   ficha  -> región, centros de su ciudad, hub de la modalidad, guía, ranking y calendario del mes
 *   post   -> 2 regiones + 1 ranking + calendario
 * Devuelven [{ href, label }] sin duplicados.
 */
import { MONTH_SLUGS, nextMonths } from "./calendar-months";

const uniq = links => links.filter(l => l && l.href).filter((l, i, a) => a.findIndex(x => x.href === l.href) === i);

// Solo meses publicados (el actual y los 11 siguientes)
function monthLink(iso, todayIso) {
  if (!iso || !todayIso || !nextMonths(todayIso).some(m => m.key === iso.slice(0, 7))) return null;
  const y = iso.slice(0, 4), m = MONTH_SLUGS[Number(iso.slice(5, 7)) - 1];
  return { href: `/calendario/${y}/${m}`, label: `Carreras híbridas en ${m} de ${y}` };
}

export function relatedForRace({ race, mod, regions = [], centerCities = [], todayIso }) {
  return uniq([
    ...regions.slice(0, 2).map(r => ({ href: `/carreras-hibridas/${r.slug}`, label: `Carreras híbridas ${r.en}` })),
    centerCities[0] && { href: `/centros-entrenamiento/${centerCities[0].slug}`, label: `Dónde entrenar HYROX en ${centerCities[0].name}` },
    mod.hub && { href: mod.hub, label: mod.hubLabel },
    mod.guide,
    mod.ranking,
    monthLink(race.fecha_iso, todayIso),
  ]);
}

// Ranking que corresponde a cada artículo según su tema
function rankingForPost(post) {
  const t = `${post.slug} ${post.category || ""}`.toLowerCase();
  if (/reloj|gadget|tecnolog/.test(t)) return { href: "/productos/relojes", label: "Mejores relojes GPS para HYROX y OCR" };
  if (/podcast/.test(t)) return { href: "/productos/pulsometros", label: "Mejores pulsómetros para HYROX y OCR" };
  if (/ocr|obstacul|spartan/.test(t)) return { href: "/productos/zapatillas-trail", label: "Mejores zapatillas de trail para OCR" };
  if (/crossfit|crosstraining/.test(t)) return { href: "/productos/zapatillas-crossfit", label: "Mejores zapatillas de CrossFit" };
  return { href: "/productos/zapatillas-hyrox", label: "Mejores zapatillas para HYROX" };
}

/**
 * Para un artículo: dos regiones con carreras (se reparten entre artículos para no enlazar siempre las mismas),
 * su ranking y el calendario del mes en curso.
 * regions: [{ slug, en, count }] con carreras futuras, ordenadas por nº de carreras.
 */
export function relatedForPost(post, regions = [], todayIso) {
  const withRaces = regions.filter(r => r.count > 0);
  const h = [...post.slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const pickTwo = withRaces.length > 2 ? [withRaces[h % withRaces.length], withRaces[(h + 1 + (h >> 3) % (withRaces.length - 1)) % withRaces.length]] : withRaces;
  return uniq([
    ...pickTwo.map(r => ({ href: `/carreras-hibridas/${r.slug}`, label: `Carreras híbridas ${r.en}` })),
    rankingForPost(post),
    monthLink(todayIso, todayIso),
    { href: "/calendario", label: "Calendario completo de carreras híbridas" },
  ]);
}
