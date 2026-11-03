/* Índice de todas las regiones y ciudades con página de carreras (el pie solo enlaza las 8 con más carreras). */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import { SITE_URL, pageTitle, breadcrumbLd, ROBOTS_INDEX } from "../../lib/site";
import { fetchUpcomingRaces, seasonLabel, todayISO } from "../../lib/races-server";
import { HYBRID_CITIES, raceMatchesCity } from "../../lib/hybrid-cities";
import { fechaLarga } from "../../lib/dates";

export async function getStaticProps() {
  const races = await fetchUpcomingRaces();
  const rows = HYBRID_CITIES.map(c => ({ slug: c.slug, name: c.name, en: c.en || `en ${c.name}`, kind: c.kind, ccaa: c.ccaa, n: races.filter(r => raceMatchesCity(r, c)).length }));
  return { props: { rows, total: races.length, season: seasonLabel(), generated: todayISO() }, revalidate: 3600 };
}

export default function Regiones({ rows, total, season, generated }) {
  const url = `${SITE_URL}/carreras-hibridas`;
  const title = `Carreras híbridas por comunidad y ciudad ${season}`;
  const desc = `Carreras híbridas en España por comunidad y ciudad: Madrid, Cataluña, Andalucía, Comunidad Valenciana, Canarias y más, con fechas, precios e inscripción.`;
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Carreras por comunidad" }];
  const comunidades = rows.filter(r => r.kind === "comunidad").sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "es"));
  const ciudades = rows.filter(r => r.kind === "ciudad").sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "es"));
  return (
    <PageShell activePath="/calendario">
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
      </Head>
      <article className="guide city-page">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Por zona</p>
          <h1 className="guide-title">{title}</h1>
          <p className="guide-updated">{total} carreras con fecha en España · Actualizado: <time dateTime={generated}>{fechaLarga(generated)}</time></p>
        </div>
        <div className="guide-body">
          <p className="guide-lead">
            Cada comunidad y cada ciudad tiene su página con las carreras con fecha, ordenadas por día, los centros donde entrenar cerca y las zonas de alrededor.
            Si prefieres verlo todo junto, tienes el <a href="/calendario">calendario completo</a> con filtros por mes y modalidad.
          </p>
          <h2 id="comunidades">Comunidades</h2>
          <ul className="city-links city-links--inline">
            {comunidades.map(r => <li key={r.slug}><a href={`/carreras-hibridas/${r.slug}`}>Carreras híbridas {r.en}<span className="city-count">{r.n ? `${r.n} ${r.n === 1 ? "carrera" : "carreras"}` : "sin fechas"}</span></a></li>)}
          </ul>
          <h2 id="ciudades">Ciudades</h2>
          <ul className="city-links city-links--inline">
            {ciudades.map(r => <li key={r.slug}><a href={`/carreras-hibridas/${r.slug}`}>Carreras híbridas {r.en}<span className="city-count">{r.n ? `${r.n} ${r.n === 1 ? "carrera" : "carreras"}` : "sin fechas"}</span></a></li>)}
          </ul>
          <p>¿Buscas dónde entrenar? Mira los <a href="/centros-entrenamiento#por-ciudad">centros por ciudad</a>.</p>
        </div>
      </article>
    </PageShell>
  );
}
