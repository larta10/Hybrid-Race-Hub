import Head from "next/head";
import { useEffect } from "react";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import RaceList from "../../components/RaceList";
import { SITE_URL, SITE_NAME } from "../../lib/site";
import { track } from "../../lib/shared";
import { fetchUpcomingRaces, seasonLabel, dateParts, raceEventSchema } from "../../lib/races-server";
import { HYBRID_CITIES, CITY_BY_SLUG, raceMatchesCity, centerMatchesCity } from "../../lib/hybrid-cities";
import CENTROS from "../../lib/centros-entrenamiento.json";

export async function getStaticPaths() {
  return { paths: HYBRID_CITIES.map(c => ({ params: { ciudad: c.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const city = CITY_BY_SLUG[params.ciudad];
  if (!city) return { notFound: true };
  const all = await fetchUpcomingRaces();
  const races = all.filter(r => raceMatchesCity(r, city));
  const centers = CENTROS.filter(c => centerMatchesCity(c, city))
    .map(c => ({ nombre: c.nombre, tipo: c.tipo || null, ciudad: c.ciudad || null, direccion: c.direccion || null, web: c.web || null }));
  const nearby = city.nearby.map(slug => {
    const n = CITY_BY_SLUG[slug];
    const nr = all.filter(r => raceMatchesCity(r, n));
    return { slug, name: n.name, count: nr.length, next: nr[0] ? { nombre: nr[0].nombre, fecha_iso: nr[0].fecha_iso } : null };
  });
  // Si no hay carreras aquí, enseñamos las más próximas de las zonas cercanas
  let nearbyRaces = [];
  if (!races.length) {
    const seen = new Set();
    city.nearby.forEach(slug => all.filter(r => raceMatchesCity(r, CITY_BY_SLUG[slug])).forEach(r => {
      if (!seen.has(r.id)) { seen.add(r.id); nearbyRaces.push(r); }
    }));
    nearbyRaces.sort((a, b) => a.fecha_iso.localeCompare(b.fecha_iso));
    nearbyRaces = nearbyRaces.slice(0, 6);
  }
  return {
    props: {
      city: { slug: city.slug, name: city.name, kind: city.kind, ccaa: city.ccaa, intro: city.intro },
      races,
      centers: centers.slice(0, 18),
      centersTotal: centers.length,
      nearby,
      nearbyRaces,
      season: seasonLabel(),
      totalSpain: all.length,
    },
    revalidate: 86400,
  };
}

function buildFaqs({ city, races, centers, centersTotal, nearby }) {
  const where = city.kind === "comunidad" ? `en ${city.name}` : `en ${city.name}`;
  const faqs = [];
  faqs.push({
    q: `¿Cuántas carreras híbridas hay ${where}?`,
    a: races.length
      ? `Ahora mismo hay ${races.length} ${races.length === 1 ? "carrera híbrida programada" : "carreras híbridas programadas"} ${where} en nuestro calendario${races.length ? `, la primera el ${dateParts(races[0].fecha_iso).long}` : ""}. La lista se actualiza cada día con los datos que publican los organizadores.`
      : `En este momento no hay carreras híbridas futuras ${where} en nuestro calendario. En cuanto un organizador publique una fecha aparecerá en esta página; mientras tanto, abajo tienes las más cercanas.`,
  });
  if (races.length) {
    const r = races[0];
    faqs.push({
      q: `¿Cuál es la próxima carrera híbrida ${where}?`,
      a: `${r.nombre}, el ${dateParts(r.fecha_iso).long}${r.ubicacion ? ` en ${r.ubicacion}` : ""}.${r.precio ? ` Precio publicado: ${r.precio}.` : ""} Confirma fecha y precio en la web oficial antes de inscribirte.`,
    });
  }
  faqs.push({
    q: `¿Dónde puedo entrenar para HYROX u OCR ${where}?`,
    a: centersTotal
      ? `Tenemos ${centersTotal} ${centersTotal === 1 ? "centro registrado" : "centros registrados"} ${where} en el directorio${centers.length ? `, por ejemplo ${centers.slice(0, 3).map(c => c.nombre).join(", ")}` : ""}. Antes de ir, llama para confirmar si tienen sled, SkiErg y remo, que son lo más difícil de encontrar.`
      : `Todavía no tenemos centros registrados ${where}. Busca boxes de CrossFit o gimnasios funcionales con sled y remo, o consulta el directorio de centros de entrenamiento por código postal.`,
  });
  const withRaces = nearby.filter(n => n.count > 0);
  faqs.push({
    q: `¿Qué carreras híbridas hay cerca de ${city.name}?`,
    a: withRaces.length
      ? `Cerca tienes ${withRaces.map(n => `${n.name} (${n.count} ${n.count === 1 ? "carrera" : "carreras"})`).join(", ")}. Cada una tiene su página con fechas y enlaces de inscripción.`
      : `Las zonas cercanas (${nearby.map(n => n.name).join(", ")}) tampoco tienen fechas publicadas ahora mismo. Revisa el calendario completo de España para ver todas las opciones.`,
  });
  return faqs;
}

export default function CiudadPage(props) {
  const { city, races, centers, centersTotal, nearby, nearbyRaces, season, totalSpain } = props;
  const path = `/carreras-hibridas/${city.slug}`;
  const url = `${SITE_URL}${path}`;
  const indexable = races.length > 0;
  const faqs = buildFaqs(props);
  const title = `Carreras híbridas en ${city.name} ${season}: HYROX y OCR | ${SITE_NAME}`;
  const desc = races.length
    ? `${races.length} ${races.length === 1 ? "carrera híbrida" : "carreras híbridas"} en ${city.name}: HYROX, OCR y Spartan con fechas, precios e inscripción. Próxima: ${races[0].nombre}.`
    : `Carreras híbridas en ${city.name}: HYROX, OCR y Spartan. Centros donde entrenar y las carreras más cercanas con fecha publicada.`;

  useEffect(() => { track("city_page_view", { city_name: city.name, city_slug: city.slug, races_count: races.length }); }, [city.slug]);

  const events = races.map(r => raceEventSchema(r, SITE_URL)).filter(Boolean).map(e => ({ "@context": "https://schema.org", ...e }));
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Carreras híbridas", "item": `${SITE_URL}/que-es-una-carrera-hibrida` },
        { "@type": "ListItem", "position": 3, "name": city.name, "item": url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
    ...events,
  ];

  return (
    <PageShell activePath="/calendario">
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={indexable ? "index, follow, max-image-preview:large" : "noindex, follow"} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={`Carreras híbridas en ${city.name} ${season}`} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <article className="guide city-page">
        <div className="guide-head">
          <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Carreras híbridas", href: "/que-es-una-carrera-hibrida" }, { name: city.name }]} />
          <p className="section-label">{city.kind === "comunidad" ? "COMUNIDAD" : "CIUDAD"} · {city.ccaa.toUpperCase()}</p>
          <h1 className="guide-title">Carreras híbridas en {city.name} {season}</h1>
          <p className="guide-updated">
            {races.length
              ? `${races.length} ${races.length === 1 ? "carrera programada" : "carreras programadas"} · Calendario actualizado cada día`
              : "Sin carreras programadas ahora mismo · Calendario actualizado cada día"}
          </p>
        </div>

        <div className="guide-body">
          {city.intro.map((p, i) => <p key={i} className={i === 0 ? "guide-lead" : undefined}>{p}</p>)}

          <h2 id="proximas">{races.length ? `Próximas carreras en ${city.name}` : `¿Hay carreras híbridas en ${city.name} ahora?`}</h2>
          {races.length ? (
            <>
              <p>Ordenadas por fecha. Precio y formato son los que publica cada organizador; confirma siempre en su web antes de inscribirte.</p>
              <RaceList races={races} pageUrl={url} showRegion={city.kind === "comunidad"} />
            </>
          ) : (
            <>
              <p>
                Ahora mismo no hay ninguna carrera híbrida con fecha publicada en {city.name}. Las organizaciones suelen anunciar la temporada con pocos meses de margen,
                así que vuelve a mirar o guarda la página. Mientras tanto, estas son las más cercanas:
              </p>
              {nearbyRaces.length
                ? <RaceList races={nearbyRaces} pageUrl={url} showRegion />
                : <p>Tampoco hay fechas en las zonas de alrededor. Tienes todas las de España ({totalSpain}) en el <a href="/calendario">calendario completo</a>.</p>}
            </>
          )}

          <h2 id="entrenar">Dónde entrenar en {city.name}</h2>
          {centers.length ? (
            <>
              <p>
                {centersTotal} {centersTotal === 1 ? "centro" : "centros"} de nuestro directorio con material de CrossFit, HYROX u OCR.
                Llama antes de ir: no todos tienen sled o SkiErg.
              </p>
              <ul className="center-list">
                {centers.map((c, i) => (
                  <li key={i}>
                    <span className="center-name">{c.nombre}</span>
                    <span className="center-meta">{[c.tipo, c.ciudad, c.direccion].filter(Boolean).join(" · ")}</span>
                    {c.web && <a href={c.web.startsWith("http") ? c.web : `https://${c.web}`} target="_blank" rel="nofollow noopener noreferrer">Web</a>}
                  </li>
                ))}
              </ul>
              {centersTotal > centers.length && <p><a href="/centros-entrenamiento">Ver los {centersTotal} centros en el directorio →</a></p>}
            </>
          ) : (
            <p>Aún no tenemos centros registrados aquí. Busca por código postal en el <a href="/centros-entrenamiento">directorio de centros</a> o escríbenos si quieres que añadamos el tuyo.</p>
          )}

          <h2 id="cerca">Carreras híbridas cerca de {city.name}</h2>
          <ul className="city-links city-links--inline">
            {nearby.map(n => (
              <li key={n.slug}>
                <a href={`/carreras-hibridas/${n.slug}`}>{n.name}<span className="city-count">{n.count ? `${n.count} ${n.count === 1 ? "carrera" : "carreras"}` : "sin fechas"}</span></a>
              </li>
            ))}
          </ul>
          <p>
            Si es tu primera, empieza por la guía <a href="/que-es-una-carrera-hibrida">qué es una carrera híbrida</a>: formatos, las 8 estaciones de HYROX y cómo prepararla.
            Y para el material, los rankings de <a href="/productos/zapatillas-hyrox">zapatillas HYROX</a> y <a href="/productos/zapatillas-trail">zapatillas de trail para OCR</a>.
          </p>
          <p>
            Para preparar tu carrera: <a href="/blog/carreras-hibridas-principiantes-primera-prueba">cómo elegir tu primera prueba</a>,{" "}
            <a href="/blog/que-es-hyrox">qué es HYROX y cómo inscribirte</a> y el <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan de entrenamiento de 12 semanas</a>.
          </p>

          <h2 id="faq">Preguntas frecuentes sobre carreras híbridas en {city.name}</h2>
          <div className="faq-plain">
            {faqs.map((f, i) => (
              <details key={i} className="faq-d" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </article>
    </PageShell>
  );
}
