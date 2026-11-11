/**
 * Ritmos de carrera en min/km a partir de la marca de 5 km (o del ritmo cómodo si no hay marca).
 * El umbral se calcula como el ritmo que se sostiene alrededor de una hora, proyectando la marca
 * de 5 km con la fórmula de Riegel (1981): T2 = T1 × (D2 / D1)^1,06.
 */
export const T5K_MIN = 12 * 60 + 30, T5K_MAX = 60 * 60;   // 12:30 a 60:00
export const RC_MIN = 3 * 60 + 30, RC_MAX = 10 * 60;        // 3:30 a 10:00 por km
const RIEGEL = 1.06;

/** "25:30" o "5:45" → segundos. Admite también un número de segundos. */
export function parseClock(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim().replace(/[.,]/g, ":");
  if (/^\d+$/.test(s)) return Number(s);
  const m = s.match(/^(\d{1,2}):(\d{1,2})$/);
  return m && Number(m[2]) < 60 ? Number(m[1]) * 60 + Number(m[2]) : null;
}
export function fmtClock(sec) {
  const t = Math.round(sec);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
export const fmtRange = ([a, b]) => `${fmtClock(a)}-${fmtClock(b)} min/km`;

/** Marca de 5 km en segundos: la que da el usuario o la estimada desde su ritmo cómodo. */
export function fiveK({ t5k, rc }) {
  if (t5k >= T5K_MIN && t5k <= T5K_MAX) return { seconds: t5k, estimated: false };
  // El ritmo fácil suele ir un 25-30 % más lento que el de 5 km
  if (rc >= RC_MIN && rc <= RC_MAX) return { seconds: Math.round((rc / 1.28) * 5), estimated: true };
  return null;
}

export function paces(input) {
  const ref = fiveK(input);
  if (!ref) return null;
  const p5 = ref.seconds / 5;
  const hourKm = Math.max(5, 5 * Math.pow(3600 / ref.seconds, 1 / RIEGEL));
  const hourPace = Math.max(p5, 3600 / hourKm);
  return {
    estimated: ref.estimated,
    t5k: ref.seconds,
    facil: [p5 * 1.25, p5 * 1.38],
    umbral: [hourPace, hourPace * 1.04],
    intervalos: [p5 * 0.98, p5 * 1.02],
    carrera: [p5 * 1.1, p5 * 1.18],
  };
}

export const PACE_ROWS = [
  { key: "facil", label: "Fácil", use: "Rodajes y tirada larga. Puedes hablar con frases completas." },
  { key: "umbral", label: "Umbral", use: "Bloques de 5 a 10 minutos. Solo te salen frases cortas." },
  { key: "intervalos", label: "Intervalos", use: "Series de 400 m a 1 km, cerca de tu ritmo de 5 km." },
  { key: "carrera", label: "Carrera con fatiga", use: "El kilómetro que sale justo después de una estación." },
];
