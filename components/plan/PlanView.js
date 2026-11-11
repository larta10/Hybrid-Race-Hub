/* Plan generado: resumen, fases, ritmos, semanas desplegables y el porqué de cada decisión.
   Recibe el plan ya calculado por lib/plan (mismo resultado en servidor y navegador). */
import { refText } from "../../lib/plan/principles.js";
import s from "./plan.module.css";

const Chevron = () => (
  <svg className={s.chev} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
);
const kg = n => `${String(n).replace(".", ",")} kg`;

function Session({ s: x }) {
  return (
    <details className={s.session}>
      <summary>
        <span className={s.sDay}>{x.day}{x.dateLabel ? ` ${x.dateLabel}` : ""}{x.minutes ? ` · ${x.minutes} min` : ""} · RPE {x.rpe}</span>
        <span className={s.sTitle}>{x.title}</span>
        <Chevron />
      </summary>
      <div className={s.sBody}>
        <p className={s.sGoal}>{x.objetivo}</p>
        {x.warmup.length > 0 && (<><p className={s.sLabel}>Calentamiento</p><ul className={s.sList}>{x.warmup.map((t, i) => <li key={i}>{t}</li>)}</ul></>)}
        <p className={s.sLabel}>Parte principal</p>
        <ul className={`${s.sList} ${s.sMain}`}>
          {x.main.map((it, i) => (
            <li key={i}>{it.name}{(it.dose || it.kg) && <span className={s.dose}>{[it.dose, it.kg ? kg(it.kg) : null].filter(Boolean).join(" · ")}</span>}</li>
          ))}
        </ul>
        {x.cooldown.length > 0 && (<><p className={s.sLabel}>Vuelta a la calma</p><ul className={s.sList}>{x.cooldown.map((t, i) => <li key={i}>{t}</li>)}</ul></>)}
        {x.note && <p className={s.note}>{x.note}</p>}
      </div>
    </details>
  );
}

export default function PlanView({ plan, today }) {
  const { meta, weeks } = plan;
  // Abierta la semana en curso; si el plan aún no ha empezado o no tiene fecha, la primera
  const current = weeks.find(w => w.startIso && w.startIso <= today && w.endIso >= today) || weeks[0];
  return (
    <>
      <dl className={s.stats}>
        <div><dt>Semanas</dt><dd>{meta.weeks}</dd></div>
        <div><dt>Sesiones</dt><dd>{meta.sessions}</dd></div>
        <div><dt>Días por semana</dt><dd>{plan.input.dias}</dd></div>
        <div><dt>{meta.hasDate ? "Días para la carrera" : "Final del bloque"}</dt><dd>{meta.hasDate ? meta.daysLeft : "Test"}</dd></div>
      </dl>

      <h2 className={s.h2} id="fases">Cómo se reparten las semanas</h2>
      <div className={s.phases} aria-hidden="true">
        {plan.phases.map((p, i) => <span key={i} className={s[`ph_${p.phase}`]} style={{ flexGrow: p.weeks }} />)}
      </div>
      <ul className={s.legend}>
        {plan.phases.map((p, i) => (
          <li key={i} className={s[`ph_${p.phase}`]}><strong>{p.label}, {p.weeks} {p.weeks === 1 ? "semana" : "semanas"}.</strong> {p.desc}</li>
        ))}
      </ul>
      <p className={s.small}>Descarga cada {meta.deloadEvery} semanas: baja el volumen para asimilar lo entrenado.</p>

      {plan.paces && (
        <>
          <h2 className={s.h2} id="ritmos">Tus ritmos</h2>
          <dl className={s.paces}>
            {plan.paces.rows.map(r => (
              <div key={r.key}><dt>{r.label}</dt><dd>{r.range}</dd><dd className={s.use}>{r.use}</dd></div>
            ))}
          </dl>
          <p className={s.small} style={{ marginTop: 8 }}>
            Calculados con tu {plan.paces.estimated ? "ritmo cómodo (marca de 5 km estimada" : "marca de 5 km ("}{plan.paces.t5k}) y la fórmula de Riegel.
            Son una referencia: si el pulso o las sensaciones dicen otra cosa, manda el RPE.
          </p>
        </>
      )}

      <h2 className={s.h2} id="semanas">Semana a semana</h2>
      <p className={s.small} style={{ marginBottom: 12 }}>{plan.rpe}</p>
      {weeks.map(w => (
        <details key={w.n} className={s.week} open={w === current}>
          <summary>
            <span className={s.weekName}>
              Semana {w.n}
              {w.raceWeek ? <span className={s.tag}>{meta.hasDate ? "Carrera" : "Test"}</span> : w.deload ? <span className={`${s.tag} ${s.tagMuted}`}>Descarga</span> : null}
            </span>
            <span className={s.weekMeta}>{w.phaseLabel}{w.range ? ` · ${w.range}` : ""} · {w.sessions.length} sesiones</span>
            <Chevron />
          </summary>
          <div className={s.weekBody}>
            <p className={s.focus}>{w.focus}</p>
            {w.sessions.map((x, i) => <Session key={i} s={x} />)}
          </div>
        </details>
      ))}

      {plan.substitutions.length > 0 && (
        <>
          <h2 className={s.h2} id="material">Lo que cambia con tu material</h2>
          <p className={s.p}>No tienes todas las máquinas de la carrera, así que el plan usa estos sustitutos. Trabajan lo mismo, pero no son iguales: si puedes, prueba la estación real dos o tres veces antes de competir.</p>
          <ul className={s.subs}>
            {plan.substitutions.map(x => <li key={x.id}><strong>{x.original}</strong>{x.sustituto}</li>)}
          </ul>
        </>
      )}

      <h2 className={s.h2} id="por-que">Por qué está hecho así</h2>
      <div className={s.why}>
        {plan.principles.map(p => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <p className={s.ref}><a href={p.ref.url} target="_blank" rel="noopener noreferrer">{refText(p.ref)}</a></p>
          </article>
        ))}
        {plan.paces && (
          <article>
            <h3>De dónde salen los ritmos</h3>
            <p>De tu marca de 5 km. El ritmo de umbral es el que podrías sostener alrededor de una hora, y se calcula proyectando esa marca a distancias más largas con una fórmula que lleva más de cuarenta años usándose para comparar marcas.</p>
            <p className={s.ref}><a href={plan.paces.ref.url} target="_blank" rel="noopener noreferrer">{refText(plan.paces.ref)}</a></p>
          </article>
        )}
      </div>

      <p className={s.health}><strong>Antes de empezar.</strong> {plan.health}</p>
    </>
  );
}
