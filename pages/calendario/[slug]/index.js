/* Hub de fechas por modalidad: /calendario/deka, /calendario/spartan, /calendario/ocr…
   Solo existe si la modalidad tiene 3 o más carreras futuras. HYROX no tiene hub aquí: el suyo es
   el artículo /blog/calendario-hyrox-espana-2026-2027. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../../../components/PageShell";
import RaceList from "../../../components/RaceList";
import Related from "../../../components/Related";
import { SITE_URL, pageTitle, fitDesc, breadcrumbLd, ROBOTS_INDEX } from "../../../lib/site";
import { fetchUpcomingRaces, todayISO, seasonLabel, raceEventSchema } from "../../../lib/races-server";
import { MODALITY_BY_SLUG, hubModalities } from "../../../lib/modalities";
import { monthsWithCounts } from "../../../lib/calendar-months";
import { HYBRID_CITIES, raceMatchesCity } from "../../../lib/hybrid-cities";
import { fechaLarga } from "../../../lib/dates";

const hubSlugs = races => hubModalities(races).filter(m => !m.fixedHub).map(m => m.slug);

export async function getStaticPaths() {
  const races = await fetchUpcomingRaces();
  return { paths: hubSlugs(races).map(slug => ({ params: { slug } })), fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const all = await fetchUpcomingRaces();
  const m = MODALITY_BY_SLUG[params.slug];
  if (!m || !hubSlugs(all).includes(params.slug)) return { notFound: true, revalidate: 3600 };
  const races = all.filter(r => m.test(r));
  const regions = HYBRID_CITIES.map(c => ({ slug: c.slug, en: c.en || `en ${c.name}`, n: races.filter(r => raceMatchesCity(r, c)).length }))
    .filter(c => c.n > 0).sort((a, b) => b.n - a.n);
  const today = todayISO();
  return {
    props: {
      mod: { slug: m.slug, name: m.name, about: m.about, guide: m.guide, ranking: m.ranking },
      races, regions, season: seasonLabel(),
      months: monthsWithCounts(races, today).filter(x => x.count > 0).map(x => ({ key: x.key, href: x.href, label: x.label, n: x.count })),
      others: hubModalities(all).filter(x => x.slug !== m.slug).map(x => ({ href: x.hub, label: x.fixedHub ? x.hubLabel : `Carreras ${x.name} en España`, n: x.count })),
      generated: today,
    },
    revalidate: 3600,
  };
}

export default function Hub({ mod, races, regions, season, months, others, generated }) {
  const path = `/calendario/${mod.slug}`;
  const url = `${SITE_URL}${path}`;
  const n = races.length;
  const h1 = `Carreras ${mod.name} en España ${season}: fechas y sedes`;
  const cities = [...new Set(races.map(r => r.municipio).filter(Boolean))];
  const desc = fitDesc([
    `${n} carreras ${mod.name} con fecha en España en ${season}: ${cities.slice(0, 4).join(", ")}. Fechas, sedes, precios e inscripción oficial de cada una.`,
    `${n} carreras ${mod.name} con fecha en España en ${season}. Fechas, ciudades, precios, estado de la inscripción y enlace oficial de cada prueba.`,
    `Calendario de ${mod.name} en España ${season}: fechas, sedes, precios e inscripción oficial.`,
  ]);
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Calendario", href: "/calendario" }, { name: mod.name }];
  const events = races.map(r => raceEventSchema(r, SITE_URL)).filter(Boolean).map(e => ({ "@context": "https://schema.org", ...e }));

  return (
    <PageShell activePath="/calendario">
      <Head>
        <title>{pageTitle(`Carreras ${mod.name} en España ${season}`)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og?title=${encodeURIComponent(`Carreras ${mod.name} en España ${season}`)}&cat=${encodeURIComponent(mod.name)}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd(crumbs, url), ...events]) }} />
      </Head>

      <article className="guide city-page">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Calendario por modalidad</p>
          <h1 className="guide-title">{h1}</h1>
          <p className="guide-updated">{n} carreras con fecha · Actualizado: <time dateTime={generated}>{fechaLarga(generated)}</time></p>
        </div>
        <div className="guide-body">
          <p className="guide-lead">{mod.about}</p>
          <p>
            Ahora mismo hay {n} carreras {mod.name} con fecha en nuestro calendario{cities.length ? `, en ${cities.length > 6 ? `${cities.slice(0, 6).join(", ")} y otras` : cities.join(", ")}` : ""}.
            Cada tarjeta lleva a su ficha, con la sede, el precio publicado, el estado de la inscripción y el enlace a la web oficial.
          </p>
          <RaceList races={races} />

          {regions.length > 0 && (
            <>
              <h2 id="por-zona">{mod.name} por zona</h2>
              <ul className="city-links city-links--inline">
                {regions.map(r => <li key={r.slug}><a href={`/carreras-hibridas/${r.slug}`}>Carreras híbridas {r.en}<span className="city-count">{r.n} de {mod.name}</span></a></li>)}
              </ul>
            </>
          )}
          {months.length > 0 && (
            <>
              <h2 id="por-mes">{mod.name} por mes</h2>
              <nav className="month-nav" aria-label="Meses con carreras">
                {months.map(m => <a key={m.key} href={m.href}>{m.label} ({m.n})</a>)}
              </nav>
            </>
          )}

          <h2 id="preparar">Cómo prepararla</h2>
          <p>
            Antes de inscribirte, lee <a href={mod.guide.href}>{mod.guide.label.charAt(0).toLowerCase() + mod.guide.label.slice(1)}</a>.
            Para el calzado, el ranking de <a href={mod.ranking.href}>{mod.ranking.label.toLowerCase()}</a>, y para encontrar box con material,
            el <a href="/centros-entrenamiento">directorio de centros por ciudad</a>.
          </p>

          <Related title="Otras modalidades" links={others.map(o => ({ href: o.href, label: `${o.label} (${o.n})` }))} />
        </div>
      </article>
    </PageShell>
  );
}
