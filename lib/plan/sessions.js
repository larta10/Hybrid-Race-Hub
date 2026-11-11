/**
 * Constructores de sesiones. Cada una devuelve:
 *   { slot, type, title, objetivo, warmup[], main[{ name, dose, kg }], cooldown[], minutes, rpe, note }
 * Todo depende solo del contexto c = { input, family, week, idx, pc, B } → mismo plan con las mismas respuestas.
 *   week = { phase, deload, vol, load, last }   idx = nº de semana desde 0   pc = ritmos o null
 *   B    = minutos disponibles esa semana (minutos por sesión × volumen de la semana)
 */
import { STATIONS } from "./constants.js";
import { fmtRange } from "./paces.js";
import { doseText } from "./material.js";
import { scheme, targetKg } from "./strength.js";

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const round5 = x => Math.round(x / 5) * 5;
const item = (name, dose = "", kg = null) => ({ name, dose, kg });
const pace = (c, key) => (c.pc ? ` (${fmtRange(c.pc[key])})` : "");
const byLevel = (c, pri, int, adv) => ({ principiante: pri, intermedio: int, avanzado: adv }[c.input.nivel]);
const isWeak = (c, id) => c.input.debiles.includes(id);

const WARM_RUN = ["8 min de trote muy suave", "Movilidad de tobillo y cadera, 2 min", "3 progresiones de 60 m"];
const COOL_RUN = ["5 min de trote suave o caminando", "Estira gemelos y cadera sin forzar"];
const WARM_GYM = ["5 min de remo, bici o trote suave", "Dos series ligeras del primer ejercicio"];
const COOL_GYM = ["Movilidad de cadera y hombro, 5 min"];

/** Distancia del tramo de carrera entre estaciones: 500 m en DEKA y en relevos (tramos más rápidos). */
const repDist = c => (c.family === "deka" ? 500 : 1000);
const repLabel = c => (repDist(c) === 1000 ? "1 km" : "500 m");

const OCR_LONG_CAP = { ocr_sprint: 60, ocr_media: 90, ocr_larga: 150 };

/* ── Carrera fácil y tirada larga ─────────────────────────────────────────── */
export function runEasy(c, slot) {
  const long = slot === "larga";
  const ocrLong = long && c.family === "ocr";
  const top = ocrLong ? Math.max(c.input.min, (OCR_LONG_CAP[c.input.prueba] || 60) * byLevel(c, 0.8, 1, 1)) : c.input.min;
  const total = Math.max(25, round5(top * c.week.vol));
  const run = Math.max(15, total - 10);
  const main = [item(`${ocrLong ? "Carrera continua por terreno con desnivel; camina las cuestas duras" : "Carrera continua a ritmo fácil"}${pace(c, "facil")}`, `${run} min`)];
  if (!c.week.deload && c.week.phase !== "taper") main.push(item("Rectas progresivas al terminar", "4 × 20 s"));
  return {
    slot, type: "carrera",
    title: long ? "Tirada larga" : "Rodaje fácil",
    objetivo: long ? "Fondo aeróbico: es lo que sostiene todo lo demás." : "Sumar kilómetros sin fatiga y recuperar de las sesiones duras.",
    warmup: ["5 min caminando rápido o al trote muy suave"],
    main,
    cooldown: ["5 min caminando", "Estira gemelos y cadera sin forzar"],
    minutes: total, rpe: "3-4",
    note: c.input.nivel === "principiante" ? "Si no aguantas seguido, alterna 4 minutos corriendo y 1 andando. Cuenta igual." : null,
  };
}

/* ── Carrera de calidad: cambia con la fase ───────────────────────────────── */
export function runQuality(c) {
  const { phase, deload } = c.week;
  const adj = byLevel(c, -1, 0, 1) + (isWeak(c, "carrera") ? 1 : 0);
  const cut = n => (deload ? Math.max(2, Math.ceil(n * 0.6)) : n);
  const B = Math.max(35, c.B);
  let title, objetivo, main, rpe;

  if (phase === "base" && c.family === "ocr") {
    const n = cut(clamp(Math.round((B - 20) / 3) + adj, 5, 12));
    title = "Cuestas cortas";
    objetivo = "Fuerza de piernas corriendo y técnica de subida, sin el desgaste de las series largas.";
    main = [item("Cuesta de 30-45 s fuerte; baja al trote", `${n} rep`)];
    rpe = "7";
  } else if (phase === "base") {
    const n = cut(clamp(Math.round((B - 20) / 4) + adj, 4, 10));
    title = "Cambios de ritmo";
    objetivo = "Acostumbrar al cuerpo a cambiar de marcha sin llegar a pasarlo mal.";
    main = [item(`2 min alegre${pace(c, "umbral")} y 2 min suave`, `${n} rep`)];
    rpe = "6-7";
  } else if (phase === "construccion") {
    const block = c.input.nivel === "principiante" ? 5 : 8;
    const n = cut(clamp(Math.floor((B - 20) / (block + 2)) + Math.max(0, adj), 2, 5));
    title = "Umbral";
    objetivo = "Subir el ritmo que aguantas mucho rato: es el que usas entre estaciones.";
    main = [item(`Bloques a ritmo de umbral${c.family === "ocr" ? " por terreno ondulado" : ""}${pace(c, "umbral")}`, `${n} × ${block} min, 2 min de trote entre bloques`)];
    rpe = "7-8";
  } else if (phase === "especifico") {
    const km = repDist(c) === 1000;
    const n = cut(clamp(Math.floor((B - 20) / (km ? 7.5 : 4.5)) + adj, km ? 3 : 6, km ? 8 : 12));
    title = `Series de ${repLabel(c)}`;
    objetivo = "Correr rápido con pausas cortas, como te va a pedir la carrera.";
    main = [item(`${repLabel(c)} a ritmo de intervalos${pace(c, "intervalos")}`, `${n} rep, 2 min de pausa`)];
    rpe = "8";
  } else {
    title = "Recordar el ritmo de carrera";
    objetivo = "Mantener la chispa sin cansarte: tienes que acabar con ganas de más.";
    main = [item(`${repLabel(c)} al ritmo que quieres llevar en carrera${pace(c, "carrera")}`, `${repDist(c) === 1000 ? 3 : 5} rep, pausa completa`)];
    rpe = "6-7";
  }
  return { slot: "calidad", type: "carrera", title, objetivo, warmup: WARM_RUN, main, cooldown: COOL_RUN, minutes: Math.min(B, c.input.min), rpe, note: null };
}

/* ── Fuerza ───────────────────────────────────────────────────────────────── */
const EX = {
  sentadilla: { key: "squat", completo: "Sentadilla con barra", casa: "Sentadilla goblet con mancuerna o mochila" },
  pesomuerto: { key: "deadlift", completo: "Peso muerto", casa: "Peso muerto a una pierna con mancuerna o mochila" },
  press: { key: "press", completo: "Press de hombro de pie", casa: "Flexiones (con los pies elevados si te sobran)" },
  remo: { key: "row", completo: "Remo con barra o mancuerna", casa: "Remo con banda o mochila" },
  zancada: { key: "lunge", completo: "Zancada caminando con mancuernas (kilos entre las dos)", casa: "Zancada caminando con mochila", reps: r => `${Math.max(8, Number(r) + 2)} por pierna` },
  swing: { key: "kb", completo: "Swing con kettlebell", casa: "Swing con mancuerna o kettlebell", reps: () => "15" },
  dominadas: { completo: "Dominadas (con goma si hace falta)", basico: "Dominadas o jalón al pecho", casa: "Dominadas en barra de puerta o remo invertido bajo una mesa firme", reps: (r, c) => byLevel(c, "5", "6-8", "8-10") },
  carry: { completo: "Paseo del granjero", casa: "Paseo con garrafas o bolsas cargadas", reps: () => "40 m" },
};
const LISTS = {
  a: ["sentadilla", "zancada", "press", "swing"],
  b: ["pesomuerto", "remo", "dominadas", "carry"],
  full: ["sentadilla", "pesomuerto", "press", "remo", "zancada"],
};
const HOME_REPS = { 10: "15", 6: "12", 5: "10" };
const STRENGTH_GOAL = {
  base: "Aprender los movimientos y acumular repeticiones con margen.",
  construccion: "Subir carga: menos repeticiones y más peso que en la base.",
  especifico: "Mantener la fuerza ganada sin llegar cargado a las sesiones de carrera.",
  taper: "Recordatorio corto: nada que deje agujetas.",
};

function strengthItems(c, variant, max) {
  const sch = scheme(c.week);
  return LISTS[variant].slice(0, max).map(k => {
    const ex = EX[k];
    const name = ex[c.input.material] || ex.completo;
    // En casa no hay carga pesada: se compensa con más repeticiones
    const base = c.input.material === "casa" ? HOME_REPS[sch.reps] || sch.reps : sch.reps;
    const reps = ex.reps ? ex.reps(base, c) : base;
    return item(name, `${sch.sets} × ${reps}`, ex.key ? targetKg(c.input, ex.key, c.week) : null);
  });
}

function strengthNote(c, items) {
  if (items.some(i => i.kg)) return "Los pesos son orientativos. Si no llegas a las repeticiones con el RPE indicado, baja la carga.";
  if (c.input.material === "casa") return "En casa manda el RPE: cuando te sobren repeticiones, baja más lento o mete más peso en la mochila.";
  return "Elige un peso con el que te queden dos o tres repeticiones en la recámara.";
}

export function strength(c, variant) {
  const max = c.B < 40 ? 3 : c.B < 55 ? 4 : 5;
  const main = strengthItems(c, variant, max);
  main.push(item(variant === "b" ? "Hollow hold o rodillas al pecho colgado" : "Plancha frontal", `3 × ${byLevel(c, 30, 45, 60)} s`));
  // Punto débil: un extra técnico al final del día de tirón o del día único de fuerza
  const weak = (STATIONS[c.family] || []).find(s => isWeak(c, s.id));
  if (weak && variant !== "a" && c.week.phase !== "taper" && !c.week.deload) {
    const d = doseText(weak, 0.25, c.input.material);
    main.push(item(`Punto débil: ${d.name}, técnica sin reloj`, `3 × ${d.dose}`));
  }
  return {
    slot: variant === "a" ? "fuerza_a" : variant === "b" ? "fuerza_b" : "fuerza",
    type: "fuerza",
    title: { a: "Fuerza: piernas y empuje", b: "Fuerza: cadena posterior y tirón", full: "Fuerza general" }[variant],
    objetivo: STRENGTH_GOAL[c.week.phase],
    warmup: WARM_GYM, main, cooldown: COOL_GYM,
    minutes: Math.max(30, Math.min(c.B, 60)), rpe: scheme(c.week).rpe,
    note: strengthNote(c, main),
  };
}

/* ── Estaciones y carrera con fatiga (HYROX, DEKA y otras híbridas) ───────── */
function pickStations(c, k) {
  const all = STATIONS[c.family];
  const weak = all.filter(s => isWeak(c, s.id));
  const weakPick = weak.length ? Array.from({ length: Math.min(2, k, weak.length) }, (_, i) => weak[(c.idx + i) % weak.length]) : [];
  const rest = all.filter(s => !weakPick.includes(s));
  const picks = [...weakPick];
  for (let i = 0; picks.length < Math.min(k, all.length); i++) picks.push(rest[(c.idx * k + i) % rest.length]);
  return [...new Set(picks)].sort((a, b) => all.indexOf(a) - all.indexOf(b));
}

const FORMAT_NOTE = {
  hyrox_dobles: "Con tu pareja: corréis juntos y en la estación os turnáis en bloques cortos (10-15 repeticiones o 250 m). Ensayad quién empieza cada una.",
  hyrox_relevos: "En relevos te tocan dos tramos: hazlos más rápido que en individual y descansa 3-4 minutos entre rondas, como cuando corren tus compañeros.",
  deka: "Dosis de DEKA FIT. En DEKA MILE la carrera entre zonas es de 160 m y en DEKA STRONG no se corre.",
  hibrida: "Cambia estas estaciones por las del reglamento de tu prueba si son distintas.",
};

function stationsHybrid(c) {
  const { phase, deload } = c.week;
  const m = c.input.material;
  const all = STATIONS[c.family];
  const km = repDist(c) === 1000;
  const B = Math.max(35, c.B);
  const relay = c.input.prueba === "hyrox_relevos";
  let title, objetivo, main, rpe;

  if (phase === "base") {
    const rounds = deload ? 2 : 3;
    const frac = byLevel(c, 0.4, 0.5, 0.5);
    title = "Técnica de estaciones";
    objetivo = "Aprender cada estación sin prisa: postura, respiración y un ritmo que puedas repetir.";
    main = pickStations(c, 3).map(s => { const d = doseText(s, frac, m); return item(d.name, `${rounds} × ${d.dose}`); });
    main.push(item("Trote suave entre estaciones", "400 m"));
    rpe = "6";
  } else if (phase === "construccion") {
    let rounds = clamp(Math.floor((B - 15) / (km ? 9 : 5)), 3, relay ? 4 : km ? 6 : 8);
    if (deload) rounds = Math.max(2, rounds - 2);
    const frac = byLevel(c, 0.5, 0.6, 0.75);
    const picks = pickStations(c, Math.min(rounds, 4));
    title = "Correr con fatiga";
    objetivo = "Salir a correr justo después de cada estación, que es lo que decide una carrera híbrida.";
    main = Array.from({ length: rounds }, (_, r) => {
      const d = doseText(picks[r % picks.length], frac, m);
      return item(`${repLabel(c)} a ritmo de carrera${pace(c, "carrera")} y, sin parar, ${lower(d.name)}`, d.dose);
    });
    rpe = "7-8";
  } else if (phase === "especifico") {
    let rounds = clamp(Math.floor((B - 15) / (km ? 10 : 5.5)), km ? 3 : 5, relay ? 4 : all.length);
    if (deload) rounds = Math.max(3, rounds - 2);
    const frac = byLevel(c, 0.75, 1, 1);
    // Semanas alternas: primera mitad de la carrera y segunda mitad
    const start = c.idx % 2 ? all.length - rounds : 0;
    const picks = all.slice(start, start + rounds);
    title = rounds === all.length ? "Simulación completa" : `Simulación parcial: ${rounds} de ${all.length} estaciones`;
    objetivo = "Ensayar la carrera: ritmo, transiciones y qué estación te obliga a frenar.";
    main = picks.map(s => { const d = doseText(s, frac, m); return item(`${repLabel(c)} a ritmo de carrera${pace(c, "carrera")} y ${lower(d.name)}`, d.dose); });
    rpe = "8";
  } else {
    title = "Afinar transiciones";
    objetivo = "Repasar las estaciones a ritmo de carrera con muy poco volumen.";
    main = pickStations(c, 2).map(s => { const d = doseText(s, 0.5, m); return item(`${repLabel(c)} a ritmo de carrera${pace(c, "carrera")} y ${lower(d.name)}`, d.dose); });
    rpe = "6-7";
  }
  return {
    slot: "estaciones", type: "estaciones", title, objetivo,
    warmup: ["8 min de trote suave", "Una ronda muy ligera de cada estación del día"],
    main, cooldown: ["5 min caminando", "Movilidad de cadera, hombro y antebrazo"],
    minutes: Math.min(B, c.input.min), rpe, note: FORMAT_NOTE[c.input.prueba] || null,
  };
}
const lower = s => s.charAt(0).toLowerCase() + s.slice(1);

/* ── Obstáculos (OCR) ─────────────────────────────────────────────────────── */
const OCR_MOVES = {
  agarre: { completo: "Colgarse de la barra o pasar monkey bars", basico: "Colgarse de la barra de dominadas", casa: "Colgarse de una barra de puerta o de parque" },
  trepa: { completo: "Trepa de cuerda (o remo invertido con toalla)", basico: "Dominadas con toalla o remo invertido", casa: "Remo invertido bajo una mesa firme o con una toalla en la barra" },
  cargas: { completo: "Transporte de saco o cubo", basico: "Transporte de mancuernas pesadas", casa: "Transporte de mochila o garrafas" },
};
const OCR_WEAK = {
  agarre: ["Punto débil: paseo del granjero pesado", "3 × 40 m"],
  trepa: ["Punto débil: dominadas o bajadas lentas de dominada", "4 × 4"],
  cargas: ["Punto débil: zancadas con carga", "3 × 20 m"],
  burpees: ["Punto débil: burpees a ritmo constante", "3 × 12"],
  cuestas: ["Punto débil: cuesta caminando rápido con carga", "4 × 1 min"],
};

function stationsOcr(c) {
  const { phase, deload } = c.week;
  const mv = k => OCR_MOVES[k][c.input.material];
  const B = Math.max(35, c.B);
  let title, objetivo, main, rpe;
  if (phase === "base") {
    const rounds = deload ? 2 : 3;
    title = "Técnica de obstáculos";
    objetivo = "Agarre, tirón y cargas sin prisa, para que el obstáculo no te pille de nuevas.";
    main = [
      item(mv("agarre"), `${rounds} × ${byLevel(c, "20 s", "30 s", "40 s")}`),
      item(mv("trepa"), `${rounds} × ${byLevel(c, 4, 6, 8)} rep`),
      item(mv("cargas"), `${rounds} × 40 m`),
      item("Burpees", `${rounds} × ${byLevel(c, 6, 8, 10)}`),
      item("Trote suave entre rondas", "400 m"),
    ];
    rpe = "6";
  } else if (phase === "construccion") {
    let rounds = clamp(Math.floor((B - 15) / 8), 3, 6);
    if (deload) rounds = Math.max(2, rounds - 2);
    title = "Obstáculos con fatiga";
    objetivo = "Llegar al obstáculo con el pulso alto y resolverlo igual.";
    main = [
      item(`800 m a ritmo de umbral${pace(c, "umbral")}`, `${rounds} rondas`),
      item(`${mv("agarre")}, al terminar cada 800 m`, byLevel(c, "20 s", "30 s", "40 s")),
      item(`${mv("cargas")}, a continuación`, "60 m"),
    ];
    rpe = "7-8";
  } else if (phase === "especifico") {
    let rounds = clamp(Math.floor((B - 15) / 9), 3, 8);
    if (deload) rounds = Math.max(3, rounds - 2);
    title = "Simulación de carrera";
    objetivo = "Ensayar el día de la prueba: correr, parar en el obstáculo y volver a arrancar.";
    main = [
      item("1 km por terreno, a ritmo que puedas mantener", `${rounds} rondas`),
      item("Burpees al terminar cada kilómetro", `${byLevel(c, 6, 10, 15)} rep`),
      item(mv("cargas"), "100 m"),
      item(mv("agarre"), byLevel(c, "20 s", "30 s", "45 s")),
    ];
    rpe = "8";
  } else {
    title = "Repaso de obstáculos";
    objetivo = "Tocar agarre y cargas con poco volumen para no llegar oxidado.";
    main = [item(mv("agarre"), "2 × 20 s"), item(mv("cargas"), "2 × 40 m"), item("Trote suave entre rondas", "400 m")];
    rpe = "6";
  }
  const weak = Object.keys(OCR_WEAK).find(k => isWeak(c, k));
  if (weak && phase !== "taper" && !deload) main.push(item(...OCR_WEAK[weak]));
  return {
    slot: "estaciones", type: "estaciones", title, objetivo,
    warmup: ["8 min de trote suave", "Movilidad de hombro y muñeca; cuélgate 2 × 10 s"],
    main, cooldown: ["5 min caminando", "Estira antebrazos, dorsal y cadera"],
    minutes: Math.min(B, c.input.min), rpe,
    note: "Si un obstáculo te da respeto, practícalo antes en un centro con circuito. El agarre mojado y con barro falla antes que en seco.",
  };
}

export const stations = c => (c.family === "ocr" ? stationsOcr(c) : stationsHybrid(c));

/* ── Sesión mixta (planes de 3 días): fuerza corta + estaciones ───────────── */
export function mixed(c) {
  const main = strengthItems(c, "full", 3);
  if (c.family === "ocr") {
    main.push(item(OCR_MOVES.agarre[c.input.material], `3 × ${byLevel(c, "20 s", "30 s", "40 s")}`), item(OCR_MOVES.cargas[c.input.material], "3 × 40 m"));
  } else if (c.week.phase !== "taper") {
    pickStations(c, 2).forEach(s => { const d = doseText(s, 0.4, c.input.material); main.push(item(`${d.name}, técnica`, `2 × ${d.dose}`)); });
  }
  return {
    slot: "mixta", type: "fuerza",
    title: c.family === "ocr" ? "Fuerza y agarre" : "Fuerza y estaciones",
    objetivo: `${STRENGTH_GOAL[c.week.phase]} Con tres días, la fuerza y la técnica comparten sesión.`,
    warmup: WARM_GYM, main, cooldown: COOL_GYM,
    minutes: Math.max(30, Math.min(c.B, c.input.min)), rpe: scheme(c.week).rpe,
    note: strengthNote(c, main),
  };
}

/* ── Semana de carrera ────────────────────────────────────────────────────── */
export function raceWeek(c, { hasDate }) {
  const sharpen = runQuality(c);
  const activation = stations({ ...c, B: 35 });
  activation.title = "Activación";
  activation.objetivo = "Una pasada corta por las estaciones para llegar con el gesto fresco.";
  activation.main = activation.main.slice(0, 2);
  activation.minutes = 30;
  const loosen = {
    slot: "facil", type: "carrera", title: "Soltar piernas",
    objetivo: "Moverte un poco el día antes. Si prefieres descansar, descansa.",
    warmup: [], main: [item(`Trote muy suave${pace(c, "facil")}`, "15-20 min"), item("Rectas progresivas", "4 × 15 s")],
    cooldown: ["Movilidad suave, 5 min"], minutes: 25, rpe: "2-3", note: null,
  };
  const ocr = c.family === "ocr";
  const race = hasDate
    ? {
      slot: "carrera", type: "carrera_dia", title: "Día de carrera",
      objetivo: "Hacer lo que has entrenado. Nada nuevo: ni zapatillas, ni desayuno, ni ritmo.",
      warmup: ["10-15 min de trote suave, movilidad y 3 progresiones"],
      main: [
        item("Sal más lento de lo que te pide el cuerpo: el primer kilómetro engaña"),
        item(ocr ? "En los obstáculos, respira antes de entrar y asegura el agarre" : "En las estaciones, lleva un ritmo que no te obligue a parar"),
        item(ocr ? "Camina las cuestas duras y corre lo que sea corrible" : `Corre entre estaciones al ritmo que has ensayado${pace(c, "carrera")}`),
        item("Bebe a sorbos cuando haya agua y aprieta en el último tercio, no antes"),
      ],
      cooldown: ["Camina 10 min, come y bebe. Mañana, descanso."], minutes: null, rpe: "9-10", note: null,
    }
    : {
      slot: "carrera", type: "carrera_dia", title: "Test: simulación a ritmo controlado",
      objetivo: "Cerrar el bloque midiendo dónde estás. Apunta tiempos: son tu punto de partida para el siguiente plan.",
      warmup: ["10-15 min de trote suave, movilidad y 3 progresiones"],
      main: ocr
        ? [item("Carrera por terreno con una parada por kilómetro: 10 burpees, carga 100 m y colgarse 30 s", byLevel(c, "5 km", "8 km", "10 km"))]
        : (STATIONS[c.family] || []).slice(0, byLevel(c, 4, 6, 8)).map(s => { const d = doseText(s, byLevel(c, 0.75, 1, 1), c.input.material); return item(`${repLabel(c)} a ritmo de carrera${pace(c, "carrera")} y ${lower(d.name)}`, d.dose); }),
      cooldown: ["Camina 10 min y estira. Dos días fáciles después."], minutes: null, rpe: "8-9", note: null,
    };
  return { sharpen, activation, loosen, race };
}
