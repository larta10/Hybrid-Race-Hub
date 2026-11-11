/* Plan generado: /mi-plan?prueba=…&fecha=…&nivel=…
   Se reconstruye entero a partir de los parámetros de la URL (sin base de datos), así que el enlace se puede
   guardar y compartir. Lleva noindex y canonical a la landing: lo que posiciona es la landing, no cada plan. */
import Head from "next/head";
import { useMemo } from "react";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import PlanView from "../components/plan/PlanView";
import { buildPlan, parseParams, isComplete, toQueryString, landingFor } from "../lib/plan/index.js";
import { todayISO } from "../lib/races-server";
import { SITE_URL, ROBOTS_NOINDEX } from "../lib/site";
import s from "../components/plan/plan.module.css";

export async function getServerSideProps({ query, res }) {
  const input = parseParams(query);
  const qs = toQueryString(input);
  // Sin los datos mínimos no hay plan: de vuelta al formulario con lo que sí venía en la URL
  if (!isComplete(input)) return { redirect: { destination: `${landingFor(input.prueba)}${qs ? `?${qs}` : ""}`, permanent: false } };
  res.setHeader("X-Robots-Tag", "noindex, follow");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  return { props: { input, qs, today: todayISO() } };
}

export default function MiPlan({ input, qs, today }) {
  // El motor es determinista: con las mismas respuestas y el mismo día sale el mismo plan en servidor y navegador
  const plan = useMemo(() => buildPlan(input, { today }), [input, today]);
  const landing = landingFor(input.prueba);
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
          <a className="btn-line" href={`${landing}?${qs}`}>Cambiar respuestas</a>
        </div>

        {plan.notices.map((n, i) => <p key={i} className={s.notice} role="note">{n}</p>)}

        <PlanView plan={plan} today={today} />

        <div className={s.foot}>
          <a className="btn-line" href={`${landing}?${qs}`}>Cambiar respuestas</a>
          <a className="btn-line" href="/calendario">Ver el calendario</a>
          <a className="btn-line" href="/centros-entrenamiento">Dónde entrenar</a>
        </div>
      </article>
    </PageShell>
  );
}
