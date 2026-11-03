/**
 * Enlaces del pie (rediseño 11/2026). Listas fijas y ligeras para no meter datos pesados
 * (centros, textos de regiones) en el JavaScript de todas las páginas.
 * El listado completo de regiones está en /carreras-hibridas y el de ciudades en /centros-entrenamiento.
 * Revisar cuando cambie el orden por nº de carreras (lib/hybrid-cities.js) o de centros (lib/center-cities.js).
 */
import { nextMonths } from "./calendar-months";

// Las 8 regiones con más carreras futuras (3/11/2026)
export const FOOTER_REGIONS = [
  ["madrid", "Madrid"], ["comunidad-valenciana", "Comunidad Valenciana"], ["cataluna", "Cataluña"], ["andalucia", "Andalucía"],
  ["canarias", "Canarias"], ["barcelona", "Barcelona"], ["valencia", "Valencia"], ["malaga", "Málaga"],
];

// Las 12 ciudades con más centros (orden de CENTER_CITIES a 3/11/2026)
export const FOOTER_CENTER_CITIES = [
  ["barcelona", "Barcelona"], ["madrid", "Madrid"], ["zaragoza", "Zaragoza"], ["sevilla", "Sevilla"], ["valencia", "Valencia"],
  ["malaga", "Málaga"], ["alicante", "Alicante"], ["bilbao", "Bilbao"], ["gijon", "Gijón"], ["marbella", "Marbella"],
  ["palma", "Palma"], ["pontevedra", "Pontevedra"],
];

export const FOOTER_RESOURCES = [
  ["/que-es-una-carrera-hibrida", "Qué es una carrera híbrida"],
  ["/blog/que-es-hyrox", "Qué es HYROX"],
  ["/blog/hyrox-vs-carrera-hibrida-diferencias", "HYROX vs carrera híbrida"],
  ["/blog/calendario-hyrox-espana-2026-2027", "Calendario HYROX España"],
  ["/blog/que-es-hurbax", "Qué es HURBAX"],
  ["/blog/que-es-el-hyatlon", "Qué es el Hyatlón"],
  ["/blog/carreras-hibridas-principiantes-primera-prueba", "Tu primera carrera híbrida"],
  ["/blog/plan-entrenamiento-hyrox-12-semanas", "Plan HYROX de 12 semanas"],
  ["/calculadora-hyrox", "Calculadora de tiempos HYROX"],
  ["/plan-entrenamiento", "Plan de entrenamiento gratis"],
  ["/race-hub#training-programs", "Programas HYROX"],
  ["/blog", "Blog y guías"],
];

// Rankings de material (máximo 6)
export const FOOTER_RANKINGS = [
  ["/productos/zapatillas-hyrox", "Zapatillas para HYROX"],
  ["/productos/zapatillas-trail", "Zapatillas de trail para OCR"],
  ["/productos/ropa", "Ropa técnica"],
  ["/productos/relojes", "Relojes GPS"],
  ["/productos/pulsometros", "Pulsómetros"],
  ["/productos/zapatillas-crossfit", "Zapatillas de CrossFit"],
];

export const FOOTER_PROJECT = [
  ["/organizadores", "Organizadores"],
  ["/como-verificamos-las-carreras", "Cómo verificamos las carreras"],
  ["/sobre-nosotros", "Sobre nosotros"],
  ["/contacto-organizadores", "Contacto"],
];

/** Este mes y el siguiente, con la fecha de Madrid */
export function footerMonths() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  return nextMonths(today, 2).map((m, i) => [m.href, `${i === 0 ? "Este mes" : "Próximo mes"}: ${m.label}`]);
}
