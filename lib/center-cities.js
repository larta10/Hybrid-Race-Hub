/**
 * Centros de entrenamiento agrupados por ciudad para /centros-entrenamiento/[ciudad].
 * Fuente: lib/centros-entrenamiento.json (la tabla sport_centers no existe en Supabase).
 *
 * El campo "ciudad" del JSON viene de un scraping y a veces está cortado
 * ("Palmas", "Real", "Rozas"...): se corrige con ALIASES y el código postal.
 * Los centros repetidos (mismo nombre y código postal) se cuentan una vez.
 * Solo se publica página para ciudades con MIN_CENTERS centros distintos o más.
 */
import CENTROS from "./centros-entrenamiento.json";

export const MIN_CENTERS = 3;

const ALIASES = {
  "Palmas": (cp) => (cp.startsWith("350") ? "Las Palmas de Gran Canaria" : null),
  "María": (cp) => (cp.startsWith("115") ? "El Puerto de Santa María" : null),
  "Real": (cp) => (cp.startsWith("13") ? "Ciudad Real" : null),
  "Rozas": () => "Las Rozas",
  "Cristóbal de la Laguna": () => "San Cristóbal de La Laguna",
  "Orotava": () => "La Orotava",
  "Montalt": () => "Sant Vicenç de Montalt",
  "Vendrell": () => "El Vendrell",
  "Donostia": () => "San Sebastián",
};

// Slugs cortos para las búsquedas habituales ("hyrox palma")
const SLUG_OVERRIDES = { "Palma de Mallorca": "palma" };
const NAME_OVERRIDES = { "Palma de Mallorca": "Palma" };

// Prefijo de código postal -> provincia, tal y como aparece en races.provincia
export const CP_PROVINCE = {
  "01": "Álava", "02": "Albacete", "03": "Alicante", "04": "Almería", "05": "Ávila", "06": "Badajoz", "07": "Islas Baleares",
  "08": "Barcelona", "09": "Burgos", "10": "Cáceres", "11": "Cádiz", "12": "Castellón", "13": "Ciudad Real", "14": "Córdoba",
  "15": "A Coruña", "16": "Cuenca", "17": "Girona", "18": "Granada", "19": "Guadalajara", "20": "Gipuzkoa", "21": "Huelva",
  "22": "Huesca", "23": "Jaén", "24": "León", "25": "Lleida", "26": "La Rioja", "27": "Lugo", "28": "Madrid", "29": "Málaga",
  "30": "Murcia", "31": "Navarra", "32": "Ourense", "33": "Asturias", "34": "Palencia", "35": "Las Palmas", "36": "Pontevedra",
  "37": "Salamanca", "38": "Santa Cruz de Tenerife", "39": "Cantabria", "40": "Segovia", "41": "Sevilla", "42": "Soria",
  "43": "Tarragona", "44": "Teruel", "45": "Toledo", "46": "Valencia", "47": "Valladolid", "48": "Bizkaia", "49": "Zamora",
  "50": "Zaragoza", "51": "Ceuta", "52": "Melilla",
};

const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const citySlug = name => SLUG_OVERRIDES[name] || norm(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function canonicalCity(c) {
  const raw = String(c.ciudad || "").trim();
  if (!raw) return null;
  const cp = String(c.codigo_postal || "").padStart(5, "0");
  return ALIASES[raw] ? ALIASES[raw](cp) : raw;
}

function build() {
  const groups = new Map();
  for (const c of CENTROS) {
    const city = canonicalCity(c);
    if (!city) continue;
    const key = norm(city);
    if (!groups.has(key)) groups.set(key, { name: city, centers: [], seen: new Set() });
    const g = groups.get(key);
    const dedupe = `${norm(c.nombre).replace(/crossfit|box|gym|\s+/g, "")}|${c.codigo_postal || ""}`;
    if (g.seen.has(dedupe)) continue;
    g.seen.add(dedupe);
    g.centers.push(c);
  }
  return [...groups.values()]
    .filter(g => g.centers.length >= MIN_CENTERS)
    .map(g => {
      const cps = g.centers.map(c => String(c.codigo_postal || "")).filter(Boolean);
      const cp = cps[0] ? cps[0].padStart(5, "0") : "";
      return {
        slug: citySlug(g.name),
        name: NAME_OVERRIDES[g.name] || g.name,
        fullName: g.name,
        cp: cp.slice(0, 2),
        province: CP_PROVINCE[cp.slice(0, 2)] || null,
        ccaa: g.centers.find(c => c.ccaa)?.ccaa || null,
        count: g.centers.length,
        centers: g.centers,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

const ALL = build();

/** Lista ligera (sin centros) para enlaces y sitemap. */
export const CENTER_CITIES = ALL.map(({ centers, ...rest }) => rest);
export const CENTER_CITY_BY_SLUG = Object.fromEntries(ALL.map(c => [c.slug, c]));
