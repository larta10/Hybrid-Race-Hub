/**
 * Proyectos amigos. Hoy solo Buscar Pareja Híbrida (colaboración editorial, sin contraprestación).
 * Enlaces con UTM, target _blank y rel="noopener" (sin nofollow: es una recomendación real).
 */
export const BUSCAR_PAREJA = {
  id: "buscarparejahibrida",
  name: "Buscar Pareja Híbrida",
  url: "https://www.buscarparejahibrida.es/?utm_source=hybridracehub&utm_medium=referral&utm_campaign=colaboracion",
  instagram: "https://www.instagram.com/buscarparejahibrida/",
  handle: "@buscarparejahibrida",
};

const TEAM_RE = /\b(parejas?|dobles|doubles|relevos?|relay|equipos?|teams?|mixto|mixed)\b/i;
const ALWAYS_TEAM_RE = /\b(hyrox|deka)\b/i;

/**
 * ¿La carrera tiene categoría de parejas, dobles, relevos o equipos?
 * 1) formato o nombre lo dicen; 2) HYROX y DEKA siempre tienen dobles/relevos aunque el formato esté vacío.
 */
export function isTeamRace(race) {
  if (!race) return false;
  const text = [race.formato, race.nombre].filter(Boolean).join(" ");
  if (TEAM_RE.test(text)) return true;
  return ALWAYS_TEAM_RE.test([race.modalidad, race.nombre].filter(Boolean).join(" "));
}

/** partner_outbound_click al dataLayer (GTM). */
export function trackPartnerClick(placement, partner = BUSCAR_PAREJA.id) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "partner_outbound_click", partner, placement, page_path: window.location.pathname });
}
