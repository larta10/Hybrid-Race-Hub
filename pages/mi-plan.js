/* Plan generado: /mi-plan?prueba=…&fecha=…&nivel=…
   Se reconstruye entero a partir de los parámetros de la URL (sin base de datos), así que el enlace se puede
   guardar y compartir. Lleva noindex y canonical a la landing: lo que posiciona es la landing, no cada plan. */
import Head from "next/head";
import { useMemo } from "react";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import PlanView from "../components/plan/PlanView";
import ShareButton from "../components/plan/ShareButton";
import { buildPlan, parseParams, isComplete, toQueryString, landingFor, pruebaFromRace, familyOf, daysBetween } from "../lib/plan/index.js";
import { todayISO, fetchAllRaces, modalityLabel } from "../lib/races-server";
import { fechaLarga } from "../lib/dates";
import { SITE_URL, ROBOTS_NOINDEX } from "../lib/site";
import s from "../components/plan/plan.module.css";

export async function getServerSideProps({ query, res }) {
  const input = parseParams(query);
  const qs = toQueryString(input);
  // Sin los datos mínimos no hay plan: de vuelta al formulario con lo que sí venía en la URL
  if (!isComplete(input)) return { redirect: { destination: `${landingFor(input.prueba)}${qs ? `?${qs}` : ""}`, permanent: false } };
  res.setHeader("X-Robots-Tag", "noindex, follow");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  const today = todayISO();
  const { race, others } = await racesFor(input, today);
  return { props: { input, qs, today, race, others } };
}

const lite = r => ({ slug: r.slug, nombre: r.nombre, fecha_iso: r.fecha_iso, municipio: r.municipio || null, comunidad: r.comunidad || null, modalidad: modalityLabel(r) });

/**
 * "Tu carrera" (si el plan viene de una ficha) y tres carreras futuras parecidas:
 * primero las de la misma comunidad, luego las de la misma modalidad. Solo lectura; si Supabase falla, listas vacías.
 */
async function racesFor(input, today) {
  let all = [];
  try { all = await fetchAllRaces(); } catch {}
  const race = input.carrera ? all.find(r => r.slug === input.carrera) || null : null;
  const family = familyOf(input.prueba);
  const upcoming = all.filter(r => r.fecha_iso && r.fecha_iso > today && r.slug !== race?.slug);
  const sameMod = r => familyOf(pruebaFromRace(r)) === family;
  const score = r => (race?.comunidad && r.comunidad === race.comunidad ? 2 : 0) + (sameMod(r) ? 1 : 0);
  const others = upcoming.filter(r => score(r) > 0)
    .sort((a, b) => score(b) - score(a) || a.fecha_iso.localeCompare(b.fecha_iso))
    .slice(0, 3);
  return { race: race ? lite(race) : null, others: others.map(lite) };
}

export default function MiPlan({ input, qs, today, race, others }) {
  // El motor es determinista: con las mismas respuestas y el mismo día sale el mismo plan en servidor y navegador
  const plan = useMemo(() => buildPlan(input, { today }), [input, today]);
  const landing = landingFor(input.prueba);
  const daysToRace = race ? daysBetween(today, race.fecha_iso) : null;
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento", href: landing }, { name: "Tu plan" }];
  return (
    <PageShell activePath="/plan-entrenamiento-hyrox">
      <Head>
        <title>{`${plan.meta.title} | Hybrid Race Hub`}</title>
        <meta name="description" content={`${plan.meta.title}. ${plan.meta.subtitle}. Plan gratuito de Hybrid Race Hub, semana a semana.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_NOINDEX} />
        <link rel="canonical" href={`${SITE_URL}${landing}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={plan.meta.title} />
        <meta property="og:description" content={`${plan.meta.subtitle}. Plan gratuito, semana a semana.`} />
        <meta property="og:image" content={`${SITE_URL}/og?title=${encodeURIComponent(plan.meta.title)}&cat=${encodeURIComponent("Plan gratis")}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <article className={s.plan}>
        <Breadcrumbs items={crumbs} />
        <p className="section-label">Plan gratis · {plan.meta.pruebaLabel}</p>
        <h1 className={s.planTitle}>{plan.meta.title}</h1>
        <p className={s.planSub}>{plan.meta.subtitle}</p>

        <div className={s.actions}>
          <ShareButton title={plan.meta.title} />
          <a className="btn-line" href={`${landing}?${qs}`}>Cambiar respuestas</a>
        </div>

        {race && (
          <section className={s.race} aria-labelledby="tu-carrera">
            <p className={s.raceLabel} id="tu-carrera">Tu carrera</p>
            <p className={s.raceName}>{race.nombre}</p>
            <p className={s.raceMeta}><time dateTime={race.fecha_iso}>{fechaLarga(race.fecha_iso)}</time>{race.municipio ? ` · ${race.municipio}` : ""}</p>
            <p className={s.raceCount}>
              {daysToRace > 1 ? `Faltan ${daysToRace} días` : daysToRace === 1 ? "Es mañana" : daysToRace === 0 ? "Es hoy" : "Ya se ha celebrado"}
            </p>
            <a href={`/carreras/${race.slug}`}>Ver la ficha: inscripción, sede y precio</a>
          </section>
        )}

        {plan.notices.map((n, i) => <p key={i} className={s.notice} role="note">{n}</p>)}

        <PlanView plan={plan} today={today} />

        {others.length > 0 && (
          <section aria-labelledby="otras-carreras">
            <h2 className={s.h2} id="otras-carreras">Otras carreras para ti</h2>
            <ul className={s.others}>
              {others.map(r => (
                <li key={r.slug}>
                  <a href={`/carreras/${r.slug}`}>
                    <strong>{r.nombre}</strong>
                    <span>{fechaLarga(r.fecha_iso)}{r.municipio ? ` · ${r.municipio}` : ""}{r.comunidad && r.comunidad !== r.municipio ? ` · ${r.comunidad}` : ""}</span>
                    <em>{r.modalidad}</em>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={s.foot}>
          <a className="btn-line" href={`${landing}?${qs}`}>Cambiar respuestas</a>
          <a className="btn-line" href="/calendario">Ver el calendario</a>
          <a className="btn-line" href="/centros-entrenamiento">Dónde entrenar</a>
        </div>
      </article>
    </PageShell>
  );
}
