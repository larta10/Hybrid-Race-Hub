/**
 * Fuerza con sobrecarga progresiva.
 * Peso orientativo = peso corporal × ratio por nivel × progresión × ajuste de la fase.
 * Los ratios vienen del generador anterior: son cargas de trabajo, no máximos.
 */
export const RATIOS = {
  principiante: { squat: 0.5, deadlift: 0.6, press: 0.3, row: 0.35, lunge: 0.3, kb: 0.2 },
  intermedio: { squat: 0.8, deadlift: 1.0, press: 0.5, row: 0.55, lunge: 0.45, kb: 0.3 },
  avanzado: { squat: 1.1, deadlift: 1.4, press: 0.7, row: 0.75, lunge: 0.6, kb: 0.4 },
};

/** Series, repeticiones y RPE de los ejercicios principales en cada fase. */
export const SCHEME = {
  base: { sets: 3, reps: "10", rpe: "6-7", k: 0.85 },
  construccion: { sets: 4, reps: "6", rpe: "7-8", k: 1 },
  especifico: { sets: 3, reps: "5", rpe: "7", k: 1.05 },
  taper: { sets: 2, reps: "5", rpe: "6", k: 0.95 },
};

/** +2,5 % por cada semana de carga completada, con tope del +20 %. */
export const progression = loadWeeks => Math.min(1.2, 1 + 0.025 * loadWeeks);

const round25 = kg => Math.max(2.5, Math.round(kg / 2.5) * 2.5);

/** Peso orientativo en kg, o null si no hay peso corporal o se entrena en casa (ahí manda el RPE). */
export function targetKg({ peso, nivel, material }, key, week) {
  const ratio = RATIOS[nivel]?.[key];
  if (!peso || !ratio || material === "casa") return null;
  return round25(peso * ratio * progression(week.load) * SCHEME[week.phase].k * (week.deload ? 0.9 : 1));
}

export function scheme(week) {
  const s = SCHEME[week.phase];
  return week.deload ? { ...s, sets: Math.max(2, s.sets - 1), rpe: "6" } : s;
}
