/**
 * Enlaces "web oficial" de las carreras.
 *
 * Muchas filas de la tabla races apuntan a la portada de carrerasocr.com, un
 * agregador que no es la web del organizador. Esos enlaces no se muestran como
 * oficiales. Donde hemos verificado la web real del organizador, se sustituye
 * aquí (por id) hasta que se corrija en Supabase con scripts/fix-race-urls.sql.
 */

// Webs de agregadores / calendarios de terceros: nunca son "web oficial"
export const AGGREGATOR_HOSTS = ["carrerasocr.com"];

// Verificadas el 2026-10-14 (la web del organizador anuncia la prueba o es la web oficial de la serie)
export const OFFICIAL_URL_OVERRIDES = {
  130: "https://www.gladiusrace.com/",      // Gladius Race Santacara (anuncia 17-10-2026)
  137: "https://desafiocostablanca.com/",   // Desafío Costa Blanca (web oficial de la serie)
  139: "https://bestialrace.com/",          // Bestial Race Gran Canaria (Arucas)
};

export function isAggregatorUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return AGGREGATOR_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
  } catch {
    return true; // URL mal formada: no se muestra
  }
}

/** Devuelve la web oficial de la carrera o null si no hay una fiable. */
export function officialUrl(race) {
  if (!race) return null;
  if (race.id != null && OFFICIAL_URL_OVERRIDES[race.id]) return OFFICIAL_URL_OVERRIDES[race.id];
  const url = race.url && String(race.url).trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return isAggregatorUrl(url) ? null : url;
}

/** Copia de la carrera con la url ya saneada */
export function withOfficialUrl(race) {
  return { ...race, url: officialUrl(race) };
}

/** Guía del blog que explica la modalidad de una carrera (se enlaza desde el calendario y las listas). */
export function guideFor(race) {
  const id = race?.modalidad_id || "";
  const name = `${race?.nombre || ""} ${race?.modalidad || ""}`;
  if (id === "func-hyatlon" || /hyatl[oó]n/i.test(name)) return { href: "/blog/que-es-el-hyatlon", label: "Qué es el Hyatlón" };
  if (id === "func-hurbax" || /hurbax/i.test(name)) return { href: "/blog/que-es-hurbax", label: "Qué es HURBAX" };
  if (/\bhyrox\b/i.test(name)) return { href: "/blog/que-es-hyrox", label: "Qué es HYROX" };
  return null;
}
