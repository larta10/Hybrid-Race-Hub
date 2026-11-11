/**
 * Sustitución de estaciones cuando falta material.
 *   completo: todo disponible · basico: pesas, poleas y cinta · casa: mancuerna o kettlebell, banda y mochila
 * factor convierte la dosis de carrera a la del sustituto (p. ej. 1.000 m de SkiErg ≈ 60 jalones).
 */
import { STATIONS } from "./constants.js";

export const SUBS = {
  ski: {
    basico: { name: "Jalón de polea alta con cuerda, de pie y doblando la cadera", unit: "rep", factor: 0.06 },
    casa: { name: "Tirón de banda anclada arriba, doblando la cadera", unit: "rep", factor: 0.06 },
  },
  sled_push: {
    basico: { name: "Empuje de disco por el suelo (sobre una toalla si no desliza)", unit: "m", factor: 1 },
    casa: { name: "Zancadas caminando con mochila cargada y el tronco inclinado", unit: "m", factor: 1 },
  },
  sled_pull: {
    basico: { name: "Arrastre de disco con cuerda o toalla, caminando hacia atrás", unit: "m", factor: 1 },
    casa: { name: "Arrastre hacia atrás de una mochila cargada con una cuerda", unit: "m", factor: 1 },
  },
  remo: {
    basico: { name: "Remo en máquina si tu gimnasio tiene; si no, bici o elíptica fuerte", unit: "min", factor: 0.0045 },
    casa: { name: "Swing con kettlebell o mancuerna", unit: "rep", factor: 0.06 },
  },
  bike: {
    basico: { name: "Bici estática fuerte", unit: "min", factor: 0.08 },
    casa: { name: "Rodillas arriba en el sitio, a tope", unit: "min", factor: 0.08 },
  },
  farmers: {
    casa: { name: "Paseo con garrafas o bolsas cargadas", unit: "m", factor: 1 },
  },
  lunges: {
    basico: { name: "Zancadas caminando con mancuernas", unit: null, factor: 1 },
    casa: { name: "Zancadas caminando con mochila cargada", unit: null, factor: 1 },
  },
  wallballs: {
    basico: { name: "Thruster con mancuernas ligeras", unit: "rep", factor: 0.75 },
    casa: { name: "Thruster con mancuerna o mochila", unit: "rep", factor: 0.75 },
  },
  ram_lunges: {
    basico: { name: "Zancadas atrás con un disco o una mancuerna al hombro", unit: "rep", factor: 1 },
    casa: { name: "Zancadas atrás con una mochila cargada al hombro", unit: "rep", factor: 1 },
  },
  ram_burpees: {
    basico: { name: "Burpees levantando una mancuerna al hombro", unit: "rep", factor: 1 },
    casa: { name: "Burpees levantando una mochila cargada al hombro", unit: "rep", factor: 1 },
  },
  tank: {
    basico: { name: "Empuje de disco por el suelo a la ida y arrastre a la vuelta", unit: "m", factor: 1 },
    casa: { name: "Zancadas caminando con mochila cargada, ida y vuelta", unit: "m", factor: 1 },
  },
  situp: {
    casa: { name: "Sit-up con una mochila ligera al pecho", unit: "rep", factor: 1 },
  },
  box: {
    casa: { name: "Subidas a un banco o escalón firme", unit: "rep", factor: 1 },
  },
  wallover: {
    basico: { name: "Balón medicinal o mancuerna del suelo al hombro", unit: "rep", factor: 1 },
    casa: { name: "Mochila cargada del suelo al hombro", unit: "rep", factor: 1 },
  },
};

function roundDose(amount, unit) {
  if (unit === "min") return Math.max(1, Math.round(amount * 2) / 2);
  if (unit === "m") {
    const step = amount >= 200 ? 50 : amount >= 40 ? 10 : 5;
    return Math.max(step, Math.round(amount / step) * step);
  }
  return Math.max(5, Math.round(amount / 5) * 5);
}
const fmtAmount = (n, unit) => `${String(n).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${unit}`;

/** Estación tal y como se hace con ese material: la original o su sustituto. */
export function resolveStation(station, material) {
  const sub = material === "completo" ? null : SUBS[station.id]?.[material] || null;
  if (!sub) return { id: station.id, name: station.name, unit: station.unit, factor: 1, race: station.race, original: null };
  return { id: station.id, name: sub.name, unit: sub.unit || station.unit, factor: sub.factor, race: station.race, original: station.name };
}

/** Dosis como fracción de la de carrera, ya convertida al sustituto. */
export function doseText(station, fraction, material) {
  const s = resolveStation(station, material);
  return { name: s.name, dose: fmtAmount(roundDose(s.race * fraction * s.factor, s.unit), s.unit), original: s.original };
}

/** Sustituciones que aplican a una prueba con ese material (para explicarlas en el plan). */
export function substitutions(family, material) {
  if (material === "completo" || !STATIONS[family]) return [];
  return STATIONS[family]
    .map(st => ({ st, r: resolveStation(st, material) }))
    .filter(x => x.r.original)
    .map(x => ({ id: x.st.id, original: x.st.name, sustituto: x.r.name }));
}
