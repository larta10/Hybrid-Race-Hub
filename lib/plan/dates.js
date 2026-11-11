/** Fechas ISO (YYYY-MM-DD) en UTC, sin depender de la zona horaria de la máquina. */
const MS = 864e5;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function isIso(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
const toDate = iso => new Date(`${iso}T00:00:00Z`);
export const addDays = (iso, n) => new Date(toDate(iso).getTime() + n * MS).toISOString().slice(0, 10);
export const daysBetween = (fromIso, toIso) => Math.round((toDate(toIso) - toDate(fromIso)) / MS);
/** 0 = domingo … 6 = sábado */
export const weekday = iso => toDate(iso).getUTCDay();
export const weekdayName = iso => DIAS[weekday(iso)];
export const DAY_NAMES = DIAS;
export const shortDate = iso => `${Number(iso.slice(8, 10))} ${MESES[Number(iso.slice(5, 7)) - 1]}`;
export const longDate = iso => `${Number(iso.slice(8, 10))} de ${MESES_L[Number(iso.slice(5, 7)) - 1]} de ${iso.slice(0, 4)}`;

/** Semanas completas que faltan hasta la carrera. */
export const weeksUntil = (raceIso, todayIso) => Math.floor(daysBetween(todayIso, raceIso) / 7);

export const MIN_WEEKS = 4, MAX_WEEKS = 24, DEFAULT_WEEKS = 12;

/**
 * Duración del plan a partir de la fecha de carrera.
 *  - sin fecha (o fecha ya pasada): bloque de 12 semanas
 *  - 4 a 24 semanas completas: plan periodizado de esa duración
 *  - más de 24: las últimas 24 (el plan empieza más adelante)
 *  - menos de 4: plan de puesta a punto de 1 a 3 semanas
 * Las semanas son bloques de 7 días que terminan el día de la carrera.
 */
export function planLength(fecha, todayIso) {
  if (!fecha || !isIso(fecha)) return { mode: "sin_fecha", weeks: DEFAULT_WEEKS, daysLeft: null, startIso: null, raceIso: null };
  const daysLeft = daysBetween(todayIso, fecha);
  if (daysLeft < 0) return { mode: "pasada", weeks: DEFAULT_WEEKS, daysLeft, startIso: null, raceIso: null };
  const full = Math.floor(daysLeft / 7);
  if (full < MIN_WEEKS) {
    const weeks = Math.max(1, full);
    return { mode: "puesta_a_punto", weeks, daysLeft, startIso: addDays(fecha, -7 * weeks + 1), raceIso: fecha };
  }
  const weeks = Math.min(MAX_WEEKS, full);
  return { mode: full > MAX_WEEKS ? "aplazado" : "completo", weeks, daysLeft, startIso: addDays(fecha, -7 * weeks + 1), raceIso: fecha };
}
