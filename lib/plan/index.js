/**
 * Motor del plan de entrenamiento. Módulo puro y determinista:
 *   buildPlan(respuestas, { today: "YYYY-MM-DD" }) → plan completo (mismas respuestas y mismo día = mismo plan).
 * No lee el reloj, la red ni el navegador, así que sirve igual en el servidor, en el navegador y en los tests.
 */
import { PRUEBA_BY_ID, NIVEL_LABEL, MATERIAL_LABEL, PHASE_LABEL, PHASE_DESC, familyOf } from "./constants.js";
import { planLength, addDays, weekday, DAY_NAMES, shortDate, longDate } from "./dates.js";
import { buildPhases, phaseSegments } from "./periodize.js";
import { paces, fmtRange, fmtClock, PACE_ROWS } from "./paces.js";
import { substitutions } from "./material.js";
import { runEasy, runQuality, strength, stations, mixed, raceWeek } from "./sessions.js";
import { PRINCIPLES, PACE_REF, HEALTH_NOTICE, RPE_LEGEND } from "./principles.js";
import { isComplete } from "./params.js";

export * from "./constants.js";
export * from "./params.js";
export * from "./from-race.js";
export { planLength, weeksUntil, longDate, shortDate, isIso, addDays, daysBetween } from "./dates.js";
export { buildPhases, taperWeeks, phaseSegments } from "./periodize.js";
export { paces, parseClock, fmtClock, fmtRange } from "./paces.js";
export { substitutions, doseText, resolveStation } from "./material.js";
export { PRINCIPLES, PACE_REF, HEALTH_NOTICE, RPE_LEGEND, refText } from "./principles.js";

/** Reparto semanal: [tipo de sesión, día de la semana (0 = domingo … 6 = sábado)]. */
const TEMPLATES = {
  hybrid: {
    3: [["mixta", 1], ["calidad", 3], ["estaciones", 6]],
    4: [["fuerza", 1], ["calidad", 2], ["larga", 4], ["estaciones", 6]],
    5: [["fuerza_a", 1], ["calidad", 2], ["facil", 3], ["fuerza_b", 5], ["estaciones", 6]],
    6: [["fuerza_a", 1], ["calidad", 2], ["facil", 3], ["fuerza_b", 4], ["estaciones", 6], ["larga", 0]],
  },
  ocr: {
    3: [["mixta", 1], ["calidad", 3], ["larga", 6]],
    4: [["fuerza", 1], ["calidad", 2], ["estaciones", 4], ["larga", 6]],
    5: [["fuerza_a", 1], ["calidad", 2], ["estaciones", 4], ["fuerza_b", 5], ["larga", 0]],
    6: [["fuerza_a", 1], ["calidad", 2], ["facil", 3], ["estaciones", 4], ["fuerza_b", 5], ["larga", 0]],
  },
};

function buildSession(slot, c) {
  switch (slot) {
    case "mixta": return mixed(c);
    case "fuerza": return strength(c, "full");
    case "fuerza_a": return strength(c, "a");
    case "fuerza_b": return strength(c, "b");
    case "calidad": return runQuality(c);
    case "estaciones": return stations(c);
    default: return runEasy(c, slot);
  }
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const withDay = (s, wd, date) => ({ ...s, wd, day: cap(DAY_NAMES[wd]), date: date || null, dateLabel: date ? shortDate(date) : null });

export function buildPlan(raw, { today }) {
  if (!isComplete(raw)) return null;
  const input = { ...raw, debiles: raw.debiles || [] };
  const prueba = PRUEBA_BY_ID[input.prueba];
  const family = familyOf(input.prueba);
  const len = planLength(input.fecha, today);
  const hasDate = !!len.raceIso;
  // Descarga cada 3 semanas si empiezas o tienes 50 años o más; cada 4 en el resto
  const deloadEvery = input.nivel === "principiante" || (input.edad || 0) >= 50 ? 3 : 4;
  const phases = buildPhases(len.weeks, { mode: len.mode === "puesta_a_punto" ? "puesta_a_punto" : "completo", deloadEvery });
  const pc = paces(input);
  const template = TEMPLATES[family === "ocr" ? "ocr" : "hybrid"][input.dias];

  const weeks = phases.map((week, idx) => {
    const c = { input, family, week, idx, pc, B: Math.max(25, Math.round((input.min * week.vol) / 5) * 5) };
    // Bloques de 7 días que acaban el día de la carrera; sin fecha, semanas de lunes a domingo
    const startIso = hasDate ? addDays(len.startIso, idx * 7) : null;
    const dateOf = wd => (hasDate ? addDays(startIso, (wd - weekday(startIso) + 7) % 7) : null);
    let sessions;
    if (week.last) {
      const rw = raceWeek(c, { hasDate });
      // Con fecha: días 2, 4 y 6 del bloque y la carrera el 7. Sin fecha: lunes, miércoles, viernes y test el sábado
      const at = offset => (hasDate ? { wd: weekday(addDays(startIso, offset)), date: addDays(startIso, offset) } : { wd: [0, 1, 2, 3, 4, 5, 6][offset], date: null });
      const plan = [[rw.sharpen, 1], [rw.activation, 3], ...(input.dias >= 5 ? [[rw.loosen, 5]] : []), [rw.race, 6]];
      sessions = plan.map(([s, off]) => { const d = at(off); return withDay(s, d.wd, d.date); })
        .filter(s => !s.date || s.date >= today || s.slot === "carrera");
    } else {
      sessions = template.map(([slot, wd]) => withDay(buildSession(slot, c), wd, dateOf(wd)));
      sessions.sort(hasDate ? (a, b) => a.date.localeCompare(b.date) : (a, b) => ((a.wd + 6) % 7) - ((b.wd + 6) % 7));
    }
    const minutes = sessions.reduce((t, s) => t + (s.minutes || 0), 0);
    return {
      n: week.n, phase: week.phase, phaseLabel: PHASE_LABEL[week.phase], deload: week.deload, raceWeek: !!week.last, vol: week.vol,
      startIso, endIso: hasDate ? addDays(startIso, 6) : null,
      range: hasDate ? `${shortDate(startIso)} - ${shortDate(addDays(startIso, 6))}` : null,
      focus: week.deload ? "Semana de descarga: mismo esquema con menos volumen. No la compenses entrenando de más."
        : week.last ? (hasDate ? "Semana de carrera: poco volumen, algo de ritmo y dormir bien." : "Semana de test: cierras el bloque con una simulación.")
          : PHASE_DESC[week.phase],
      minutes, sessions,
    };
  });
  // withDay guarda wd solo para ordenar las semanas sin fecha
  weeks.forEach(w => w.sessions.forEach(s => { delete s.wd; }));

  const notices = [];
  if (len.mode === "puesta_a_punto") notices.push(`Quedan ${len.daysLeft} días para la carrera. En ese tiempo no se gana forma: lo que sí se puede hacer es llegar descansado, con las estaciones ensayadas y un ritmo claro. Este plan hace eso y nada más.`);
  if (len.mode === "aplazado") notices.push(`Faltan más de 24 semanas. El plan cubre las últimas 24 y empieza el ${longDate(len.startIso)}. Hasta entonces, corre fácil dos o tres días por semana y haz fuerza uno o dos.`);
  if (len.mode === "pasada") notices.push("La fecha de este plan ya ha pasado. Te dejamos un bloque de 12 semanas sin fecha: cambia las respuestas para ajustarlo a tu próxima carrera.");
  if (!pc) notices.push("No has puesto marca de 5 km ni ritmo cómodo, así que los ritmos van por sensaciones (RPE). Si haces un test de 5 km, vuelve y ajústalo.");
  const longest = Math.max(...weeks.flatMap(w => w.sessions.map(s => s.minutes || 0)));
  if (family === "ocr" && longest > input.min) notices.push(`La tirada larga se sale de tus ${input.min} minutos: para esta distancia hace falta llegar a ${longest} minutos algún fin de semana.`);
  if (input.nivel === "principiante" && input.dias === 6) notices.push("Seis días son muchos si llevas poco tiempo entrenando. Si acumulas cansancio, quita el rodaje fácil antes que cualquier otra sesión.");

  const pruebaTxt = prueba.short;
  const semanas = `${len.weeks} ${len.weeks === 1 ? "semana" : "semanas"}`;
  return {
    input,
    meta: {
      title: len.mode === "puesta_a_punto" ? `Puesta a punto para ${pruebaTxt}: ${semanas}` : `Plan ${pruebaTxt} de ${semanas}`,
      subtitle: [`Nivel ${NIVEL_LABEL[input.nivel]}`, `${input.dias} días por semana`, `${input.min} min por sesión`, cap(MATERIAL_LABEL[input.material])].join(" · "),
      prueba: input.prueba, pruebaLabel: prueba.label, family,
      weeks: len.weeks, mode: len.mode, hasDate,
      raceIso: len.raceIso, startIso: len.startIso, daysLeft: len.daysLeft,
      sessions: weeks.reduce((t, w) => t + w.sessions.length, 0),
      deloadEvery,
    },
    paces: pc && {
      estimated: pc.estimated, t5k: fmtClock(pc.t5k),
      rows: PACE_ROWS.map(r => ({ ...r, range: fmtRange(pc[r.key]) })),
      ref: PACE_REF,
    },
    phases: phaseSegments(phases).map(s => ({ ...s, label: PHASE_LABEL[s.phase], desc: PHASE_DESC[s.phase] })),
    weeks,
    substitutions: substitutions(family, input.material),
    notices,
    principles: PRINCIPLES,
    health: HEALTH_NOTICE,
    rpe: RPE_LEGEND,
  };
}
