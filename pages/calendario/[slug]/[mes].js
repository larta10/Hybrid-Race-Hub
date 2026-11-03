/* Calendario de un mes: /calendario/<año>/<mes>. Se publican el mes actual y los 11 siguientes;
   los meses ya pasados siguen respondiendo (desde noviembre de 2026) pero con noindex. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../../../components/PageShell";
import RaceList from "../../../components/RaceList";
import Related from "../../../components/Related";
import { SITE_URL, pageTitle, fitDesc, breadcrumbLd, ROBOTS_INDEX, ROBOTS_NOINDEX } from "../../../lib/site";
import { fetchUpcomingRaces, todayISO, raceEventSchema, modalityLabel } from "../../../lib/races-server";
import { MONTH_SLUGS, MIN_MONTH_RACES, nextMonths } from "../../../lib/calendar-months";
import { HYBRID_CITIES, raceMatchesCity } from "../../../lib/hybrid-cities";
import { fechaLarga } from "../../../lib/dates";

const FIRST_MONTH = "2026-11"; // primer mes publicado

export async function getStaticPaths() {
  return { paths: nextMonths(todayISO()).map(m => ({ params: { slug: String(m.year), mes: m.slug } })), fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const year = Number(params.slug), mi = MONTH_SLUGS.indexOf(params.mes);
  if (!/^20\d\d$/.test(params.slug) || mi < 0) return { notFound: true };
  const key = `${year}-${String(mi + 1).padStart(2, "0")}`;
  const today = todayISO();
  const months = nextMonths(today);
  const last = months[months.length - 1].key;
  if (key < FIRST_MONTH || key > last) return { notFound: true, revalidate: 3600 };
  const all = await fetchUpcomingRaces();
  const races = all.filter(r => r.fecha_iso.startsWith(key));
  const regions = HYBRID_CITIES.map(c => ({ slug: c.slug, en: c.en || `en ${c.name}`, kind: c.kind, n: races.filter(r => raceMatchesCity(r, c)).length }))
    .filter(c => c.n > 0).sort((a, b) => b.n - a.n);
  const mods = {};
  races.forEach(r => { const k = modalityLabel(r); mods[k] = (mods[k] || 0) + 1; });
  const idx = months.findIndex(m => m.key === key);
  return {
    props: {
      year, mes: params.mes, key, races, regions,
      mods: Object.entries(mods).sort((a, b) => b[1] - a[1]),
      past: key < today.slice(0, 7),
      months: months.map(m => ({ key: m.key, href: m.href, label: m.label, n: all.filter(r => r.fecha_iso.startsWith(m.key)).length })),
      prev: idx > 0 ? months[idx - 1] : null,
      next: idx >= 0 && idx < months.length - 1 ? months[idx + 1] : null,
      generated: today,
    },
    revalidate: 3600,
  };
}

const joinEs = a => (a.length > 1 ? `${a.slice(0, -1).join(", ")} y ${a[a.length - 1]}` : a.join(""));

export default function Mes({ year, mes, key, races, regions, mods, past, months, prev, next, generated }) {
  const path = `/calendario/${year}/${mes}`;
  const url = `${SITE_URL}${path}`;
  const label = `${mes} ${year}`;
  const n = races.length;
  const indexable = !past && n >= MIN_MONTH_RACES;
  const h1 = `Carreras híbridas en ${label} en España`;
  const desc = fitDesc([
    `${n} ${n === 1 ? "carrera híbrida" : "carreras híbridas"} en ${label} en España: ${joinEs(mods.slice(0, 3).map(([k]) => k))}. Fechas, ciudades, precios e inscripción oficial de cada una.`,
    `${n} ${n === 1 ? "carrera híbrida" : "carreras híbridas"} en ${label} en España: HYROX, DEKA, OCR y Spartan con fecha, ciudad, precio e inscripción oficial.`,
    `Carreras híbridas en ${label} en España: HYROX, DEKA, OCR y Spartan con fecha, ciudad, precio y enlace a la inscripción oficial de cada prueba.`,
  ]);
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Calendario", href: "/calendario" }, { name: label.charAt(0).toUpperCase() + label.slice(1) }];
  const events = races.map(r => raceEventSchema(r, SITE_URL)).filter(Boolean).map(e => ({ "@context": "https://schema.org", ...e }));
  const ld = [breadcrumbLd(crumbs, url), ...events];

  return (
    <PageShell activePath="/calendario">
      <Head>
        <title>{pageTitle(h1)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og?title=${encodeURIComponent(h1)}&cat=Calendario`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>

      <article className="guide city-page">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Calendario por meses</p>
          <h1 className="guide-title">{h1}</h1>
          <p className="guide-updated">{n} {n === 1 ? "carrera" : "carreras"} · Actualizado: <time dateTime={generated}>{fechaLarga(generated)}</time></p>
        </div>
        <div className="guide-body">
          <nav className="month-nav" aria-label="Otros meses">
            {prev && <a href={prev.href}>← {prev.label}</a>}
            {next && <a href={next.href}>{next.label} →</a>}
          </nav>
          {past ? (
            <p className="guide-lead">Este mes ya ha pasado. Tienes las carreras de los próximos meses en el <a href="/calendario">calendario</a>.</p>
          ) : n ? (
            <p className="guide-lead">
              En {label} hay {n} {n === 1 ? "carrera híbrida programada" : "carreras híbridas programadas"} en España
              {mods.length ? `: ${joinEs(mods.map(([k, c]) => `${c} de ${k}`))}` : ""}.
              {regions.length ? ` Por zonas, ${joinEs(regions.slice(0, 4).map(r => `${r.n} ${r.en}`))}.` : ""}
              {" "}Cada tarjeta lleva a la ficha de la carrera, con la inscripción oficial y cómo prepararla.
            </p>
          ) : (
            <p className="guide-lead">
              Todavía no hay carreras con fecha en {label}. Los organizadores suelen anunciar con pocos meses de margen: vuelve más adelante o mira los meses de alrededor.
            </p>
          )}
          {n > 0 && <RaceList races={races} />}
          {n > 0 && (
            <>
              <h2 id="elegir">Cómo elegir entre las carreras de {mes}</h2>
              <p>
                Si es tu primera, mira primero el formato: una OCR corta o un DEKA FIT duran menos de una hora y se pueden hacer con dos o tres meses
                de preparación; una HYROX individual o una Spartan Super piden más. Antes de pagar, comprueba en la ficha el estado de la inscripción y
                la fecha de la última verificación, y confirma en la web oficial el horario de tu categoría, porque las pruebas de varios días reparten
                a cada grupo en una jornada distinta. Si viajas, las fichas enlazan también a los centros de la ciudad para hacer una última sesión.
              </p>
            </>
          )}

          {regions.length > 0 && (
            <>
              <h2 id="por-zona">Por zona</h2>
              <ul className="city-links city-links--inline">
                {regions.map(r => <li key={r.slug}><a href={`/carreras-hibridas/${r.slug}`}>Carreras híbridas {r.en}<span className="city-count">{r.n} este mes</span></a></li>)}
              </ul>
            </>
          )}

          <h2 id="meses">Carreras por mes</h2>
          <nav className="month-nav" aria-label="Calendario por meses">
            {months.map(m => m.key === key
              ? <span key={m.key} aria-current="page">{m.label} ({m.n})</span>
              : <a key={m.key} href={m.href}>{m.label} ({m.n})</a>)}
          </nav>

          <Related links={[
            { href: "/calendario", label: "Calendario completo con filtros" },
            { href: "/blog/calendario-hyrox-espana-2026-2027", label: "Calendario HYROX España 2026-2027" },
            { href: "/que-es-una-carrera-hibrida", label: "Qué es una carrera híbrida" },
            { href: "/blog/carreras-hibridas-principiantes-primera-prueba", label: "Cómo elegir tu primera carrera" },
          ]} />
        </div>
      </article>
    </PageShell>
  );
}
