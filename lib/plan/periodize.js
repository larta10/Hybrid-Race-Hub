/**
 * Periodización hacia atrás desde la carrera: base → construcción → específico → taper.
 * Devuelve una entrada por semana: { n, phase, deload, vol, load, last }.
 *   vol  = volumen relativo de la semana (1 = la semana más cargada del plan)
 *   load = semanas de carga acumuladas (para la sobrecarga progresiva de la fuerza)
 */
const r2 = x => Math.round(x * 100) / 100;

/** 2 semanas de taper en planes de 10 semanas o más; 1 en los cortos. */
export const taperWeeks = weeks => (weeks >= 10 ? 2 : 1);

export function buildPhases(weeks, { mode = "completo", deloadEvery = 4 } = {}) {
  const out = [];
  if (mode === "puesta_a_punto") {
    for (let i = 0; i < weeks - 1; i++) out.push({ n: i + 1, phase: "especifico", deload: false, vol: 0.8, load: i });
    out.push({ n: weeks, phase: "taper", deload: false, vol: 0.5, load: Math.max(0, weeks - 1), last: true });
    return out;
  }
  const taper = taperWeeks(weeks);
  const build = weeks - taper;
  const especifico = Math.max(1, Math.round(build * 0.3));
  const construccion = Math.max(1, Math.floor(build * 0.35));
  const base = Math.max(1, build - especifico - construccion);
  const phaseAt = i => (i < base ? "base" : i < base + construccion ? "construccion" : "especifico");

  let streak = 0, load = 0;
  for (let i = 0; i < build; i++) {
    const remaining = build - 1 - i;
    // Descarga tras (deloadEvery - 1) semanas de carga, salvo que queden menos de 2 antes del taper
    const deload = streak >= deloadEvery - 1 && remaining >= 2;
    const prog = build > 1 ? i / (build - 1) : 1;
    out.push({ n: i + 1, phase: phaseAt(i), deload, vol: r2((0.7 + 0.3 * prog) * (deload ? 0.6 : 1)), load });
    if (deload) streak = 0; else { streak++; load++; }
  }
  const taperVol = taper === 2 ? [0.7, 0.45] : [0.5];
  taperVol.forEach((vol, k) => out.push({ n: build + k + 1, phase: "taper", deload: false, vol, load, last: k === taper - 1 }));
  return out;
}

/** Tramos consecutivos de la misma fase, para la barra del plan. */
export function phaseSegments(weeks) {
  const segs = [];
  for (const w of weeks) {
    const last = segs[segs.length - 1];
    if (last && last.phase === w.phase) last.weeks++;
    else segs.push({ phase: w.phase, weeks: 1, from: w.n });
  }
  return segs;
}
