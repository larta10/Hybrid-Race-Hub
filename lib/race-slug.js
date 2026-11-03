/**
 * URL estable de la ficha de cada carrera: /carreras/<nombre-ciudad-año>.
 * Se usa en el servidor y en el navegador (tarjetas), así que no importa nada de Node.
 *
 * - Se quita el año y lo que va entre paréntesis del nombre y se añade al final.
 * - La ciudad (municipio) solo se añade si ninguna palabra de ella o de la provincia (de 4 letras o más) está ya en el nombre.
 *   "HYROX Madrid 2027" -> hyrox-madrid-2027 · "DEKA FIT Tenerife" -> deka-fit-tenerife-2026
 */
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const words = s => norm(s).replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);

export function raceSlug(r) {
  const year = String(r.fecha_iso || "").slice(0, 4);
  const name = words(String(r.nombre || "").replace(/\([^)]*\)/g, " ")).filter(w => w !== year);
  const inName = s => words(s).some(x => x.length >= 4 && name.includes(x));
  const city = r.municipio && !inName(r.municipio) && !inName(r.provincia) ? words(r.municipio) : [];
  return [...name, ...city, year].filter(Boolean).join("-").replace(/-+/g, "-");
}

export function raceHref(r) {
  return `/carreras/${raceSlug(r)}`;
}
