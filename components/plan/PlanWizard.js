/* Generador del plan: una pregunta por pantalla, barra de progreso y botón de volver.
   No calcula el plan: junta las respuestas y abre /mi-plan?…, que lo reconstruye a partir de la URL.
   El HTML del primer paso sale del servidor (sin saltos al cargar); los parámetros de la URL
   (?prueba=&fecha=&carrera=… desde el calendario o desde "Cambiar respuestas") se aplican al hidratar. */
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { PRUEBAS, NIVELES, MATERIALES, DIAS, MINUTOS, weakOptions, familyOf } from "../../lib/plan/constants.js";
import { planLength, longDate, addDays } from "../../lib/plan/dates.js";
import { parseClock, fmtClock, T5K_MIN, T5K_MAX, RC_MIN, RC_MAX } from "../../lib/plan/paces.js";
import { parseParams, toQueryString, isComplete } from "../../lib/plan/params.js";
import { MI_PLAN_PATH } from "../../lib/plan/from-race.js";
import { trackPlan } from "../../lib/track";
import s from "./plan.module.css";

const STEPS = ["prueba", "fecha", "nivel", "ritmo", "dias", "minutos", "material", "debiles", "datos"];
const EMPTY = { prueba: null, fecha: "", sinFecha: false, nivel: null, ritmoTipo: "t5k", ritmo: "", dias: null, min: null, material: null, debiles: [], edad: "", peso: "", altura: "", carrera: null };

const madridToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const inRange = (v, a, b) => v === "" || (Number(v) >= a && Number(v) <= b);

/** Respuestas del formulario → entrada del motor (lib/plan/params.js) */
function toInput(a) {
  const sec = parseClock(a.ritmo);
  return {
    prueba: a.prueba, fecha: a.sinFecha ? null : a.fecha || null, nivel: a.nivel,
    t5k: a.ritmoTipo === "t5k" ? sec : null, rc: a.ritmoTipo === "rc" ? sec : null,
    dias: a.dias, min: a.min, material: a.material, debiles: a.debiles,
    edad: a.edad || null, peso: a.peso || null, altura: a.altura || null, carrera: a.sinFecha ? null : a.carrera,
  };
}

function Option({ selected, onClick, label, sub, compact }) {
  return (
    <button type="button" className={`${s.opt}${selected ? ` ${s.optOn}` : ""}${compact ? ` ${s.optCompact}` : ""}`} aria-pressed={selected} onClick={onClick}>
      <span className={s.optLabel}>{label}</span>
      {sub && <span className={s.optSub}>{sub}</span>}
    </button>
  );
}

export default function PlanWizard({ presets = {} }) {
  const router = useRouter();
  const [a, setA] = useState({ ...EMPTY, ...presets });
  const [step, setStep] = useState(0);
  const [today, setToday] = useState(null);
  const [fromRace, setFromRace] = useState(false);
  const started = useRef(false);
  const headRef = useRef(null);
  const moved = useRef(false);

  // Fecha de hoy y parámetros de la URL: solo en el navegador (la página es estática)
  useEffect(() => {
    if (!router.isReady) return;
    /* eslint-disable react-hooks/set-state-in-effect -- la URL y el reloj solo existen tras hidratar */
    setToday(madridToday());
    const q = parseParams(router.query);
    const patch = {};
    if (q.prueba) patch.prueba = q.prueba;
    if (q.fecha) { patch.fecha = q.fecha; patch.sinFecha = false; }
    for (const k of ["nivel", "dias", "min", "material", "carrera"]) if (q[k]) patch[k] = q[k];
    if (q.debiles.length) patch.debiles = q.debiles;
    if (q.t5k) { patch.ritmoTipo = "t5k"; patch.ritmo = fmtClock(q.t5k); }
    else if (q.rc) { patch.ritmoTipo = "rc"; patch.ritmo = fmtClock(q.rc); }
    for (const k of ["edad", "peso", "altura"]) if (q[k]) patch[k] = String(q[k]);
    if (Object.keys(patch).length) setA(prev => ({ ...prev, ...patch }));
    if (q.carrera && q.fecha) {
      setFromRace(true);
      trackPlan("plan_from_race", { race: q.carrera, prueba: q.prueba || undefined });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar de paso, el foco va a la pregunta (lectores de pantalla y teclado)
  useEffect(() => { if (moved.current) headRef.current?.focus({ preventScroll: false }); }, [step]);

  const set = patch => setA(prev => ({ ...prev, ...patch }));
  const begin = () => { if (!started.current) { started.current = true; trackPlan("plan_start", { prueba: a.prueba || undefined }); } };
  const key = STEPS[step];
  const len = useMemo(() => (today && a.fecha && !a.sinFecha ? planLength(a.fecha, today) : null), [today, a.fecha, a.sinFecha]);
  const ritmoSec = parseClock(a.ritmo);
  const ritmoOk = a.ritmo === "" || (a.ritmoTipo === "t5k" ? ritmoSec >= T5K_MIN && ritmoSec <= T5K_MAX : ritmoSec >= RC_MIN && ritmoSec <= RC_MAX);
  const weak = useMemo(() => (a.prueba ? weakOptions(a.prueba) : []), [a.prueba]);

  const valid = {
    prueba: !!a.prueba,
    fecha: a.sinFecha || (!!a.fecha && !!len && len.mode !== "pasada"),
    nivel: !!a.nivel,
    ritmo: ritmoOk,
    dias: !!a.dias,
    minutos: !!a.min,
    material: !!a.material,
    debiles: true,
    datos: inRange(a.edad, 14, 85) && inRange(a.peso, 35, 200) && inRange(a.altura, 130, 220),
  };

  function go(n) { moved.current = true; setStep(n); }
  function next(patch) {
    begin();
    const answers = patch ? { ...a, ...patch } : a;
    trackPlan("plan_step", { step: step + 1, step_name: key });
    if (step < STEPS.length - 1) { go(step + 1); return; }
    const input = parseParams(Object.fromEntries(new URLSearchParams(toQueryString(toInput(answers)))));
    if (!isComplete(input)) { go(STEPS.findIndex(k => !valid[k])); return; }
    const weeks = planLength(input.fecha, today || madridToday()).weeks;
    trackPlan("plan_generated", { prueba: input.prueba, semanas: weeks, nivel: input.nivel, dias: input.dias, con_fecha: !!input.fecha });
    window.location.assign(`${MI_PLAN_PATH}?${toQueryString(input)}`);
  }
  // En las preguntas de una sola respuesta, tocar la opción ya pasa a la siguiente
  function pick(patch) {
    begin();
    set(patch);
    trackPlan("plan_step", { step: step + 1, step_name: key });
    setTimeout(() => go(Math.min(step + 1, STEPS.length - 1)), 140);
  }
  function pickPrueba(id) {
    // Las estaciones débiles dependen de la prueba: si cambia de familia, se vacían
    const keep = a.prueba && familyOf(a.prueba) === familyOf(id);
    pick({ prueba: id, debiles: keep ? a.debiles : [] });
  }
  const toggleWeak = id => set({ debiles: a.debiles.includes(id) ? a.debiles.filter(x => x !== id) : [...a.debiles, id] });

  const last = step === STEPS.length - 1;
  const fechaMsg = !len ? null
    : len.mode === "pasada" ? "Esa fecha ya ha pasado."
      : len.mode === "puesta_a_punto" ? `Quedan ${len.daysLeft} días. No da para un plan completo: te haremos una puesta a punto de ${len.weeks} ${len.weeks === 1 ? "semana" : "semanas"}.`
        : len.mode === "aplazado" ? `Faltan más de 24 semanas. El plan cubrirá las últimas 24 y empezará el ${longDate(len.startIso)}.`
          : `Faltan ${len.weeks} semanas: el plan tendrá ${len.weeks} semanas y acabará el día de la carrera.`;

  return (
    <section className={s.wizard} aria-label="Generador del plan de entrenamiento">
      <div className={s.progress}>
        <span className={s.progressText}>Paso {step + 1} de {STEPS.length}</span>
        <div className={s.bar} role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progreso del formulario">
          <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {fromRace && step <= 1 && a.fecha && (
        <p className={s.fromRace}>Vienes del calendario: carrera del <strong>{longDate(a.fecha)}</strong>. La prueba y la fecha ya están puestas; cámbialas si no cuadran.</p>
      )}

      <form className={s.step} onSubmit={e => { e.preventDefault(); if (valid[key]) next(); }} noValidate>
        {key === "prueba" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Qué carrera preparas?</h2>
            <div className={s.grid2}>
              {PRUEBAS.map(p => <Option key={p.id} compact label={p.label} sub={p.sub} selected={a.prueba === p.id} onClick={() => pickPrueba(p.id)} />)}
            </div>
          </>
        )}

        {key === "fecha" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Cuándo es la carrera?</h2>
            <p className={s.hint}>Con la fecha, el plan se cuenta hacia atrás desde ese día.</p>
            <label className={s.field}>
              <span className={s.label}>Fecha de la carrera</span>
              <input className={s.input} type="date" value={a.sinFecha ? "" : a.fecha} min={today ? addDays(today, 1) : undefined}
                onChange={e => set({ fecha: e.target.value, sinFecha: false, carrera: e.target.value === a.fecha ? a.carrera : null })} />
            </label>
            {fechaMsg && !a.sinFecha && <p className={len.mode === "pasada" ? s.error : s.info} role="status">{fechaMsg}</p>}
            <Option label="Aún no tengo fecha" sub="Bloque de 12 semanas que acaba con un test" selected={a.sinFecha} onClick={() => pick({ sinFecha: true })} />
            <p className={s.hint}>¿Buscas carrera? Mira el <a href="/calendario">calendario</a> y vuelve desde su ficha.</p>
          </>
        )}

        {key === "nivel" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Cuánto llevas entrenando?</h2>
            <div className={s.list}>
              {NIVELES.map(n => <Option key={n.id} label={n.label} sub={n.sub} selected={a.nivel === n.id} onClick={() => pick({ nivel: n.id })} />)}
            </div>
          </>
        )}

        {key === "ritmo" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿A qué ritmo corres?</h2>
            <p className={s.hint}>Con esto calculamos tus ritmos en min/km. Si no lo sabes, déjalo vacío y el plan irá por sensaciones.</p>
            <div className={s.seg} role="group" aria-label="Qué dato tienes">
              <button type="button" className={a.ritmoTipo === "t5k" ? s.segOn : undefined} aria-pressed={a.ritmoTipo === "t5k"} onClick={() => set({ ritmoTipo: "t5k", ritmo: "" })}>Mi marca en 5 km</button>
              <button type="button" className={a.ritmoTipo === "rc" ? s.segOn : undefined} aria-pressed={a.ritmoTipo === "rc"} onClick={() => set({ ritmoTipo: "rc", ritmo: "" })}>Mi ritmo cómodo</button>
            </div>
            <label className={s.field}>
              <span className={s.label}>{a.ritmoTipo === "t5k" ? "Tiempo en 5 km (minutos:segundos)" : "Ritmo al que puedes hablar (min:seg por km)"}</span>
              <input className={s.input} type="text" inputMode="numeric" autoComplete="off" maxLength={5}
                placeholder={a.ritmoTipo === "t5k" ? "27:30" : "6:15"} value={a.ritmo} aria-invalid={!ritmoOk}
                onChange={e => set({ ritmo: e.target.value.replace(/[^\d:.,]/g, "") })} />
            </label>
            {!ritmoOk && <p className={s.error} role="alert">{a.ritmoTipo === "t5k" ? "Escríbelo como 27:30 (entre 12:30 y 60:00)." : "Escríbelo como 6:15 (entre 3:30 y 10:00 por km)."}</p>}
          </>
        )}

        {key === "dias" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Cuántos días puedes entrenar?</h2>
            <p className={s.hint}>Los que puedas cumplir todas las semanas, no los de tu mejor semana.</p>
            <div className={s.grid4}>
              {DIAS.map(d => <Option key={d} compact label={`${d} días`} selected={a.dias === d} onClick={() => pick({ dias: d })} />)}
            </div>
          </>
        )}

        {key === "minutos" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Cuánto dura cada sesión?</h2>
            <p className={s.hint}>Contando el calentamiento. Las primeras semanas son más cortas.</p>
            <div className={s.grid4}>
              {MINUTOS.map(m => <Option key={m} compact label={`${m} min`} selected={a.min === m} onClick={() => pick({ min: m })} />)}
            </div>
          </>
        )}

        {key === "material" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Dónde entrenas?</h2>
            <p className={s.hint}>Si no tienes trineo o SkiErg, el plan pone un sustituto en cada sesión.</p>
            <div className={s.list}>
              {MATERIALES.map(m => <Option key={m.id} label={m.label} sub={m.sub} selected={a.material === m.id} onClick={() => pick({ material: m.id })} />)}
            </div>
          </>
        )}

        {key === "debiles" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>¿Qué se te da peor?</h2>
            <p className={s.hint}>Marca las que quieras, o ninguna. Las que marques salen todas las semanas.</p>
            <div className={s.chips}>
              {weak.map(w => (
                <button key={w.id} type="button" className={`${s.chip}${a.debiles.includes(w.id) ? ` ${s.chipOn}` : ""}`} aria-pressed={a.debiles.includes(w.id)} onClick={() => toggleWeak(w.id)}>{w.label}</button>
              ))}
            </div>
          </>
        )}

        {key === "datos" && (
          <>
            <h2 className={s.q} ref={headRef} tabIndex={-1}>Tus datos</h2>
            <p className={s.hint}>Con el peso calculamos los kilos orientativos de la fuerza; con la edad, cada cuánto toca descargar. No se guardan: van en el enlace de tu plan.</p>
            <div className={s.grid3}>
              <label className={s.field}><span className={s.label}>Edad</span>
                <input className={s.input} type="number" inputMode="numeric" min={14} max={85} placeholder="años" value={a.edad} aria-invalid={!inRange(a.edad, 14, 85)} onChange={e => set({ edad: e.target.value })} /></label>
              <label className={s.field}><span className={s.label}>Peso</span>
                <input className={s.input} type="number" inputMode="decimal" min={35} max={200} placeholder="kg" value={a.peso} aria-invalid={!inRange(a.peso, 35, 200)} onChange={e => set({ peso: e.target.value })} /></label>
              <label className={s.field}><span className={s.label}>Altura</span>
                <input className={s.input} type="number" inputMode="numeric" min={130} max={220} placeholder="cm" value={a.altura} aria-invalid={!inRange(a.altura, 130, 220)} onChange={e => set({ altura: e.target.value })} /></label>
            </div>
            {!valid.datos && <p className={s.error} role="alert">Revisa los datos: edad de 14 a 85, peso de 35 a 200 kg y altura de 130 a 220 cm. Puedes dejarlos vacíos.</p>}
          </>
        )}

        <div className={s.nav}>
          {step > 0
            ? <button type="button" className="btn-line" onClick={() => go(step - 1)}>Atrás</button>
            : <span />}
          <button type="submit" className="btn-solid" disabled={!valid[key]}>{last ? "Ver mi plan" : key === "debiles" && !a.debiles.length ? "Ninguna en especial" : key === "ritmo" && a.ritmo === "" ? "No lo sé" : "Continuar"}</button>
        </div>
      </form>
      <p className={s.free}>Gratis y sin registro. Lo descargas en PDF o Excel.</p>
    </section>
  );
}
