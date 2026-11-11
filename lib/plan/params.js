/**
 * Respuestas del formulario ⇄ parámetros de la URL. El plan se reconstruye solo con esto, sin base de datos.
 *   prueba, fecha (YYYY-MM-DD), nivel, t5k (s) o rc (s/km), dias, min, material, debiles (a,b,c),
 *   edad, peso, altura y carrera (slug de la ficha, si viene del calendario)
 */
import { PRUEBA_BY_ID, NIVELES, MATERIALES, DIAS, MINUTOS, weakOptions } from "./constants.js";
import { isIso } from "./dates.js";
import { parseClock, T5K_MIN, T5K_MAX, RC_MIN, RC_MAX } from "./paces.js";

const one = v => (Array.isArray(v) ? v[0] : v);
const num = (v, min, max) => {
  const n = Number(String(one(v) ?? "").replace(",", "."));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

export const DEFAULTS = { prueba: null, fecha: null, nivel: null, t5k: null, rc: null, dias: null, min: null, material: null, debiles: [], edad: null, peso: null, altura: null, carrera: null };

/** Lee y limpia los parámetros. Lo que no es válido se queda en null (nunca lanza). */
export function parseParams(q = {}) {
  const prueba = PRUEBA_BY_ID[one(q.prueba)] ? one(q.prueba) : null;
  const t5k = parseClock(one(q.t5k)), rc = parseClock(one(q.rc));
  const weakIds = prueba ? weakOptions(prueba).map(o => o.id) : [];
  const slug = String(one(q.carrera) || "").toLowerCase();
  return {
    prueba,
    fecha: isIso(one(q.fecha)) ? one(q.fecha) : null,
    nivel: NIVELES.some(n => n.id === one(q.nivel)) ? one(q.nivel) : null,
    t5k: t5k >= T5K_MIN && t5k <= T5K_MAX ? t5k : null,
    rc: rc >= RC_MIN && rc <= RC_MAX ? rc : null,
    dias: DIAS.includes(Number(one(q.dias))) ? Number(one(q.dias)) : null,
    min: MINUTOS.includes(Number(one(q.min))) ? Number(one(q.min)) : null,
    material: MATERIALES.some(m => m.id === one(q.material)) ? one(q.material) : null,
    debiles: [...new Set(String(one(q.debiles) || "").split(",").filter(id => weakIds.includes(id)))],
    edad: num(q.edad, 14, 85),
    peso: num(q.peso, 35, 200),
    altura: num(q.altura, 130, 220),
    carrera: /^[a-z0-9-]{3,120}$/.test(slug) ? slug : null,
  };
}

/** Lo mínimo para generar un plan. */
export const isComplete = i => !!(i && i.prueba && i.nivel && i.dias && i.min && i.material);

/** Respuestas → objeto de query, sin claves vacías y siempre en el mismo orden (URL estable). */
export function toQuery(i) {
  const q = {};
  for (const k of ["prueba", "fecha", "nivel", "t5k", "rc", "dias", "min", "material"]) if (i[k] != null && i[k] !== "") q[k] = String(i[k]);
  if (i.debiles?.length) q.debiles = i.debiles.join(",");
  for (const k of ["edad", "peso", "altura", "carrera"]) if (i[k] != null && i[k] !== "") q[k] = String(i[k]);
  return q;
}
export const toQueryString = i => new URLSearchParams(toQuery(i)).toString();
