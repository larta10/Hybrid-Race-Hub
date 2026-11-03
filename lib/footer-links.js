/**
 * Enlaces del pie (auditoría 11/2026). Listas fijas y ligeras para no meter datos pesados
 * (centros, textos de regiones) en el JavaScript de todas las páginas.
 * Revisar cuando cambien las regiones (lib/hybrid-cities.js) o el orden de ciudades por nº de centros
 * (lib/center-cities.js, CENTER_CITIES ordenado por count).
 */
import { nextMonths } from "./calendar-months";

export const FOOTER_REGIONS = [
  ["madrid", "Madrid"], ["cataluna", "Cataluña"], ["barcelona", "Barcelona"], ["andalucia", "Andalucía"],
  ["comunidad-valenciana", "Comunidad Valenciana"], ["valencia", "Valencia"], ["canarias", "Canarias"],
  ["baleares", "Baleares"], ["galicia", "Galicia"], ["bilbao", "Bilbao"], ["malaga", "Málaga"], ["sevilla", "Sevilla"],
  ["cantabria", "Cantabria"], ["castilla-la-mancha", "Castilla-La Mancha"], ["zaragoza", "Zaragoza"],
];

// Las 10 ciudades con más centros (orden de CENTER_CITIES a 3/11/2026)
export const FOOTER_CENTER_CITIES = [
  ["barcelona", "Barcelona"], ["madrid", "Madrid"], ["zaragoza", "Zaragoza"], ["sevilla", "Sevilla"], ["valencia", "Valencia"],
  ["malaga", "Málaga"], ["alicante", "Alicante"], ["bilbao", "Bilbao"], ["gijon", "Gijón"], ["marbella", "Marbella"],
];

export const FOOTER_GUIDES = [
  ["/que-es-una-carrera-hibrida", "Qué es una carrera híbrida"],
  ["/blog/que-es-hyrox", "Qué es HYROX"],
  ["/blog/calendario-hyrox-espana-2026-2027", "Calendario HYROX España"],
  ["/blog/que-es-hurbax", "Qué es HURBAX"],
  ["/blog/que-es-el-hyatlon", "Qué es el Hyatlón"],
  ["/blog/carreras-hibridas-principiantes-primera-prueba", "Tu primera carrera híbrida"],
  ["/blog/plan-entrenamiento-hyrox-12-semanas", "Plan HYROX de 12 semanas"],
  ["/como-verificamos-las-carreras", "Cómo verificamos las carreras"],
];

/** Este mes y los dos siguientes, con la fecha de Madrid */
export function footerMonths() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  return nextMonths(today, 3).map(m => [m.href, `Carreras en ${m.label}`]);
}
