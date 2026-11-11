// Tests del motor del plan: npm test  (node --test lib/plan/)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPlan, planLength, weeksUntil, buildPhases, taperWeeks, paces, parseParams, toQuery, isComplete,
  substitutions, doseText, STATIONS, pruebaFromRace, planHrefForRace, PRUEBAS, DIAS, MINUTOS, MATERIALES, NIVELES,
} from "./index.js";

const TODAY = "2026-11-11";
const base = { prueba: "hyrox", fecha: null, nivel: "intermedio", t5k: 1500, rc: null, dias: 4, min: 60, material: "completo", debiles: [], edad: 34, peso: 75, altura: 178, carrera: null };
const plan = (over = {}) => buildPlan({ ...base, ...over }, { today: TODAY });
const allText = p => JSON.stringify(p.weeks);

/* ── Semanas desde la fecha ── */
test("semanas completas hasta la carrera", () => {
  assert.equal(weeksUntil("2026-11-18", TODAY), 1);
  assert.equal(weeksUntil("2026-11-17", TODAY), 0);
  assert.equal(weeksUntil("2027-02-03", TODAY), 12);
});

test("sin fecha: bloque de 12 semanas", () => {
  assert.deepEqual(planLength(null, TODAY), { mode: "sin_fecha", weeks: 12, daysLeft: null, startIso: null, raceIso: null });
  assert.equal(plan().meta.weeks, 12);
  assert.equal(plan().weeks.length, 12);
});

test("con fecha: tantas semanas como faltan, entre 4 y 24", () => {
  assert.equal(planLength("2026-12-09", TODAY).weeks, 4);          // 28 días
  assert.equal(planLength("2027-01-10", TODAY).weeks, 8);          // 60 días → 8 completas
  assert.equal(planLength("2027-04-28", TODAY).weeks, 24);         // 168 días
  const far = planLength("2027-10-10", TODAY);
  assert.equal(far.weeks, 24);
  assert.equal(far.mode, "aplazado");
});

test("menos de 4 semanas: puesta a punto, sin fase de base", () => {
  const l = planLength("2026-11-28", TODAY);                       // 17 días
  assert.deepEqual([l.mode, l.weeks], ["puesta_a_punto", 2]);
  const p = plan({ fecha: "2026-11-28" });
  assert.equal(p.meta.mode, "puesta_a_punto");
  assert.ok(p.weeks.every(w => w.phase !== "base" && w.phase !== "construccion"));
  assert.match(p.notices[0], /no se gana forma/);
  assert.equal(planLength("2026-11-13", TODAY).weeks, 1);          // 2 días: una sola semana
});

test("fecha pasada: no rompe, deja 12 semanas y avisa", () => {
  const p = plan({ fecha: "2026-10-01" });
  assert.equal(p.meta.weeks, 12);
  assert.ok(p.notices.some(n => /ya ha pasado/.test(n)));
});

test("la última semana termina el día de la carrera y la primera empieza después de hoy", () => {
  for (const fecha of ["2027-01-16", "2027-02-14", "2027-03-07", "2027-04-25"]) {
    const p = plan({ fecha });
    const last = p.weeks.at(-1);
    assert.equal(last.endIso, fecha);
    assert.equal(last.sessions.at(-1).date, fecha);
    assert.equal(last.sessions.at(-1).title, "Día de carrera");
    assert.ok(p.weeks[0].startIso > TODAY, "el plan no empieza en el pasado");
    assert.ok(p.weeks.every((w, i) => i === 0 || w.startIso > p.weeks[i - 1].endIso), "semanas consecutivas");
    for (const w of p.weeks) for (const s of w.sessions) assert.ok(s.date >= w.startIso && s.date <= w.endIso);
  }
});

/* ── Taper ── */
test("taper: 1 semana en planes cortos, 2 a partir de 10 semanas", () => {
  for (let n = 4; n <= 24; n++) {
    const ph = buildPhases(n);
    assert.equal(ph.length, n);
    const taper = ph.filter(w => w.phase === "taper");
    assert.equal(taper.length, n >= 10 ? 2 : 1);
    assert.equal(taperWeeks(n), taper.length);
    assert.ok(ph.slice(-taper.length).every(w => w.phase === "taper"), "el taper va al final");
    assert.ok(ph.at(-1).last);
  }
});

test("el taper baja el volumen entre un 30 y un 60 % respecto al pico", () => {
  for (let n = 4; n <= 24; n++) {
    const ph = buildPhases(n);
    const peak = Math.max(...ph.filter(w => w.phase !== "taper").map(w => w.vol));
    assert.equal(peak, 1);
    for (const w of ph.filter(x => x.phase === "taper")) assert.ok(w.vol <= 0.7 && w.vol >= 0.4, `semana ${w.n} de ${n}: ${w.vol}`);
    assert.ok(ph.at(-1).vol <= 0.5);
  }
});

test("orden de las fases: base, construcción, específico y taper, todas presentes", () => {
  const order = ["base", "construccion", "especifico", "taper"];
  for (let n = 4; n <= 24; n++) {
    const seq = buildPhases(n).map(w => order.indexOf(w.phase));
    assert.deepEqual(seq, [...seq].sort((a, b) => a - b));
    assert.equal(new Set(seq).size, 4);
  }
});

/* ── Descargas ── */
test("descarga cada 4 semanas (3 de carga + 1) y nunca pegada al taper", () => {
  const ph = buildPhases(12);
  assert.deepEqual(ph.filter(w => w.deload).map(w => w.n), [4, 8]);
  for (let n = 4; n <= 24; n++) {
    const p = buildPhases(n);
    let streak = 0;
    p.forEach((w, i) => {
      if (w.phase === "taper") return;
      if (w.deload) {
        assert.equal(streak, 3, `plan de ${n}: descarga tras ${streak} semanas`);
        assert.ok(p[i + 1].phase !== "taper" && p[i + 2].phase !== "taper", "quedan 2 semanas de carga antes del taper");
        assert.ok(w.vol < p[i - 1].vol * 0.75, "la descarga baja el volumen");
        streak = 0;
      } else streak++;
      assert.ok(streak <= 5, `plan de ${n}: ${streak} semanas seguidas de carga`);
    });
  }
});

test("descarga cada 3 semanas para principiantes y mayores de 50", () => {
  assert.deepEqual(buildPhases(12, { deloadEvery: 3 }).filter(w => w.deload).map(w => w.n), [3, 6]);
  assert.equal(plan({ nivel: "principiante" }).meta.deloadEvery, 3);
  assert.equal(plan({ edad: 52 }).meta.deloadEvery, 3);
  assert.equal(plan().meta.deloadEvery, 4);
  assert.deepEqual(plan().weeks.filter(w => w.deload).map(w => w.n), [4, 8]);
});

test("planes cortos sin hueco para descargar no llevan descarga", () => {
  assert.equal(buildPhases(4).filter(w => w.deload).length, 0);
  assert.equal(buildPhases(6).filter(w => w.deload).length, 0);
});

/* ── Sustitución por material ── */
test("con gimnasio completo no se sustituye nada", () => {
  assert.deepEqual(substitutions("hyrox", "completo"), []);
  assert.equal(plan().substitutions.length, 0);
  assert.match(allText(plan()), /SkiErg/);
});

test("sin trineo ni SkiErg: salen sustitutos y desaparecen las máquinas", () => {
  for (const material of ["basico", "casa"]) {
    const subs = substitutions("hyrox", material);
    for (const id of ["ski", "sled_push", "sled_pull", "wallballs"]) assert.ok(subs.some(s => s.id === id), `${material}: falta sustituto de ${id}`);
    const text = allText(plan({ material }));
    assert.doesNotMatch(text, /SkiErg|trineo|Wall balls/, `${material}: aún aparece material que no hay`);
  }
  assert.match(doseText(STATIONS.hyrox[1], 1, "basico").name, /Empuje de disco/);
  assert.match(doseText(STATIONS.hyrox[0], 1, "casa").name, /banda/);
});

test("en casa no hay barra ni pesos en kilos", () => {
  const p = plan({ material: "casa" });
  assert.doesNotMatch(allText(p), /con barra|Peso muerto"|polea/);
  assert.ok(p.weeks.every(w => w.sessions.every(s => s.main.every(i => i.kg == null))));
});

test("las dosis se convierten al sustituto", () => {
  assert.deepEqual(doseText(STATIONS.hyrox[0], 1, "completo"), { name: "SkiErg", dose: "1.000 m", original: null });
  assert.equal(doseText(STATIONS.hyrox[0], 1, "basico").dose, "60 rep");
  assert.equal(doseText(STATIONS.hyrox[7], 0.5, "completo").dose, "50 rep");
  assert.equal(doseText(STATIONS.hyrox[1], 0.5, "completo").dose, "25 m");
});

/* ── Ritmos ── */
test("ritmos derivados de la marca de 5 km", () => {
  const p = paces({ t5k: 1500 });                                   // 25:00 → 5:00/km
  assert.ok(p.facil[0] > p.umbral[1] && p.umbral[0] > p.intervalos[1], "fácil > umbral > intervalos");
  assert.equal(Math.round(p.intervalos[0]), 294);
  assert.ok(p.umbral[0] > 310 && p.umbral[0] < 320, `umbral ${p.umbral[0]}`);
  assert.equal(paces({ t5k: null, rc: null }), null);
  assert.equal(paces({ rc: 384 }).estimated, true);
  assert.match(allText(plan()), /min\/km/);
  assert.doesNotMatch(allText(plan({ t5k: null })), /min\/km/);
});

/* ── Fuerza ── */
test("sobrecarga progresiva: el peso sube entre semanas de carga y baja en la descarga", () => {
  const p = plan({ dias: 5 });
  const squat = w => w.sessions.flatMap(s => s.main).find(i => /Sentadilla con barra/.test(i.name))?.kg;
  const [w1, w2, w3, w4] = p.weeks.map(squat);
  assert.ok(w2 >= w1 && w3 >= w2 && w3 > w1, `${w1} ${w2} ${w3}`);
  assert.ok(w4 < w3, "la descarga baja el peso");
});

/* ── Estructura de las sesiones ── */
test("cada sesión tiene objetivo, calentamiento, parte principal, vuelta a la calma, duración y RPE", () => {
  for (const pr of PRUEBAS) for (const dias of DIAS) for (const material of MATERIALES) for (const nivel of NIVELES) {
    const p = plan({ prueba: pr.id, dias, material: material.id, nivel: nivel.id, min: MINUTOS[dias % 4], fecha: "2027-02-14" });
    assert.equal(p.weeks.length, 13);
    for (const w of p.weeks) {
      if (!w.raceWeek) assert.equal(w.sessions.length, dias, `${pr.id} ${dias} días, semana ${w.n}`);
      for (const s of w.sessions) {
        assert.ok(s.title && s.objetivo && s.rpe && s.day, `${pr.id}: sesión incompleta`);
        assert.ok(s.main.length > 0 && s.cooldown.length > 0);
        assert.ok(s.slot === "carrera" || (s.minutes >= 20 && s.warmup.length > 0) || s.title === "Soltar piernas");
        for (const i of s.main) assert.ok(typeof i.name === "string" && !/undefined|NaN|null/.test(`${i.name} ${i.dose}`), `${pr.id}: ${i.name} ${i.dose}`);
      }
    }
  }
});

test("las sesiones no pasan de los minutos elegidos (salvo la tirada larga de OCR, que se avisa)", () => {
  const p = plan({ min: 45, dias: 6 });
  assert.ok(p.weeks.every(w => w.sessions.every(s => (s.minutes || 0) <= 45)));
  const ocr = plan({ prueba: "ocr_larga", min: 60 });
  assert.ok(ocr.notices.some(n => /tirada larga/.test(n)));
});

test("los puntos débiles aparecen todas las semanas de carga", () => {
  const p = plan({ debiles: ["wallballs"], dias: 5 });
  const withWeak = p.weeks.filter(w => !w.raceWeek && !w.deload && w.phase !== "taper").filter(w => /Wall balls|wall balls/.test(JSON.stringify(w.sessions)));
  assert.ok(withWeak.length >= 8, `solo ${withWeak.length} semanas`);
});

test("mismas respuestas y mismo día: mismo plan", () => {
  assert.deepEqual(plan({ fecha: "2027-03-07", debiles: ["ski"] }), plan({ fecha: "2027-03-07", debiles: ["ski"] }));
});

/* ── Parámetros de la URL ── */
test("ida y vuelta por la URL", () => {
  const input = { ...base, fecha: "2027-02-14", debiles: ["ski", "wallballs"], carrera: "hyrox-madrid-2027" };
  const back = parseParams(toQuery(input));
  assert.deepEqual(back, input);
  assert.ok(isComplete(back));
});

test("parámetros basura: se ignoran sin romper", () => {
  const i = parseParams({ prueba: "<script>", fecha: "2027-02-31", nivel: "dios", dias: "9", min: "1", material: "x", debiles: "a,b", edad: "-3", carrera: "../etc" });
  assert.deepEqual(i, { prueba: null, fecha: null, nivel: null, t5k: null, rc: null, dias: null, min: null, material: null, debiles: [], edad: null, peso: null, altura: null, carrera: null });
  assert.equal(isComplete(i), false);
  assert.equal(buildPlan(i, { today: TODAY }), null);
  assert.equal(parseParams({ t5k: "25:30" }).t5k, 1530);
});

/* ── Calendario → plan ── */
test("la carrera del calendario abre el generador con su prueba y su fecha", () => {
  assert.equal(pruebaFromRace({ nombre: "HYROX Madrid 2027", modalidad: "HYROX" }), "hyrox");
  assert.equal(pruebaFromRace({ nombre: "DEKA FIT Tenerife", modalidad: "DEKA" }), "deka");
  assert.equal(pruebaFromRace({ nombre: "Spartan Race Sprint Madrid", modalidad_parent: "ocr", distancia: "5 km" }), "ocr_sprint");
  assert.equal(pruebaFromRace({ nombre: "Spartan Beast Barcelona", modalidad_parent: "ocr", distancia: "21 km" }), "ocr_larga");
  assert.equal(pruebaFromRace({ nombre: "Farinato Race", modalidad_parent: "ocr" }), "ocr_media");
  assert.equal(pruebaFromRace({ nombre: "HURBAX Valencia", modalidad: "Funcional" }), "hibrida");
  assert.equal(planHrefForRace({ nombre: "HYROX Madrid 2027", fecha_iso: "2027-02-14", slug: "hyrox-madrid-2027" }),
    "/plan-entrenamiento-hyrox?prueba=hyrox&fecha=2027-02-14&carrera=hyrox-madrid-2027");
  assert.match(planHrefForRace({ nombre: "Spartan Sprint", modalidad_parent: "ocr", fecha_iso: "2027-05-01", slug: "x-2027" }), /^\/plan-entrenamiento-ocr\?/);
});
