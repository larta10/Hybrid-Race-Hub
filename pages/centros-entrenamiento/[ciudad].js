import Head from "next/head";
import { useEffect } from "react";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import { SITE_URL, SITE_NAME, fitDesc, breadcrumbLd } from "../../lib/site";
import { fechaLarga } from "../../lib/dates";
import { fetchUpcomingRaces, todayISO, dateParts } from "../../lib/races-server";
import { upcomingVerifiedEvents } from "../../lib/verified-events";
import { HYBRID_CITIES } from "../../lib/hybrid-cities";
import { CENTER_CITIES, CENTER_CITY_BY_SLUG } from "../../lib/center-cities";
import { trackRegionView } from "../../lib/track";

// Frases propias de las ciudades con más búsquedas. El resto de la intro sale de los datos.
const CITY_NOTES = {
  madrid: "En Madrid casi todos los barrios tienen algún box, pero los que tienen trineo con pista larga y SkiErg son menos de los que parece: si preparas HYROX, pregunta por esas dos cosas antes de apuntarte.",
  barcelona: "Barcelona es la ciudad con más centros del directorio, y la HYROX de la temporada se corre al lado, en L'Hospitalet de Llobregat. Si vas a competir allí, entrena el trineo sobre moqueta: es el suelo que vas a encontrar.",
  valencia: "En Valencia se puede entrenar al aire libre casi todo el año; el cauce del Turia es el sitio de siempre para meter los kilómetros entre estación y estación.",
  sevilla: "En Sevilla el calor manda de junio a septiembre: si preparas una carrera de primavera u otoño, mira que el box tenga buena ventilación o turnos a primera hora.",
  "pozuelo-de-alarcon": "Pozuelo tiene pocos centros, pero a veinte minutos tienes toda la oferta de Madrid capital y de Las Rozas, que también aparecen en el directorio.",
  reus: "Reus comparte zona con Tarragona y Valls: entre las tres ciudades es más fácil encontrar trineo y remo sin tener que ir hasta Barcelona.",
  palma: "Para entrenar en montaña desde Palma, la Serra de Tramuntana queda a media hora en coche: piedra, desnivel y senderos técnicos, justo lo que pide una OCR.",
  murcia: "En Murcia el clima seco permite entrenar fuera casi todo el año. Para las estaciones con peso, busca box con trineo: no todos lo tienen.",
  alicante: "La provincia de Alicante es de las que más carreras híbridas tiene en el calendario, entre DEKA y carreras de obstáculos, así que puedes encadenar varias sin salir de casa.",
  malaga: "En la provincia de Málaga hay HYROX y DEKA en el calendario de 2027, además de competiciones de box, así que se puede competir sin salir de la Costa del Sol.",
  zaragoza: "Zaragoza acoge el Hyatlón H8 de la Federación Española de Triatlón a final de noviembre de 2026, en la Feria de Zaragoza.",
  bilbao: "Desde Bilbao, la HYROX de la temporada queda a un paso, en Barakaldo, y los montes de alrededor, como el Pagasarri, dan desnivel de sobra para preparar una OCR.",
  vigo: "Vigo es la ciudad gallega con más actividad híbrida: el IFEVI acoge el Hybrid Day de diciembre de 2026 y el DEKA de junio de 2027.",
};

export async function getStaticPaths() {
  return { paths: CENTER_CITIES.map(c => ({ params: { ciudad: c.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const city = CENTER_CITY_BY_SLUG[params.ciudad];
  if (!city) return { notFound: true };
  const today = todayISO();
  const fromDb = await fetchUpcomingRaces();
  const all = [...fromDb, ...upcomingVerifiedEvents(today, fromDb)].sort((a, b) => a.fecha_iso.localeCompare(b.fecha_iso));
  const inProvince = city.province ? all.filter(r => r.provincia === city.province) : [];
  const inCcaa = city.ccaa ? all.filter(r => !inProvince.includes(r) && city.ccaa.includes(r.comunidad || "—")) : [];
  // Página de carreras de la zona: primero la ciudad, si no la comunidad
  const region =
    HYBRID_CITIES.find(h => h.kind === "ciudad" && (h.match.provincias || []).includes(city.province)) ||
    HYBRID_CITIES.find(h => h.cp.includes(city.cp)) || null;
  const pick = r => ({ nombre: r.nombre, fecha_iso: r.fecha_iso, municipio: r.municipio || null, url: r.url || null, modalidad: r.modalidad || null });
  const centers = city.centers.map(c => ({
    nombre: c.nombre, tipo: c.tipo || null, direccion: c.direccion || null, cp: c.codigo_postal || null,
    telefono: c.telefono || null, web: c.web || null, lat: c.lat ?? null, lng: c.lng ?? null,
  }));
  const types = {};
  centers.forEach(c => { if (c.tipo) types[c.tipo] = (types[c.tipo] || 0) + 1; });
  const others = CENTER_CITIES.filter(c => c.slug !== city.slug && (c.cp === city.cp || (city.ccaa && c.ccaa === city.ccaa))).slice(0, 8)
    .map(c => ({ slug: c.slug, name: c.name, count: c.count }));
  return {
    props: {
      city: { slug: city.slug, name: city.name, fullName: city.fullName, province: city.province, ccaa: city.ccaa },
      centers, types,
      provinceRaces: inProvince.slice(0, 6).map(pick),
      provinceCount: inProvince.length,
      ccaaRaces: inProvince.length ? [] : inCcaa.slice(0, 3).map(pick),
      region: region ? { slug: region.slug, name: region.name } : null,
      others,
      generated: today,
    },
    revalidate: 3600,
  };
}

function cityTitle(name) {
  const base = `Dónde entrenar HYROX en ${name}`;
  return [`${base}: gimnasios y boxes | ${SITE_NAME}`, `${base}: gimnasios y boxes`, `${base} | ${SITE_NAME}`, base].find(t => t.length <= 60);
}

const joinEs = arr => (arr.length > 1 ? `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}` : arr.join(""));

function intro({ city, centers, types, provinceRaces, provinceCount, ccaaRaces }) {
  const n = centers.length;
  const typeList = Object.entries(types).sort((a, b) => b[1] - a[1]).map(([t, k]) => `${k} de ${t === "Multidisciplinar" ? "entrenamiento multidisciplinar" : t === "Funcional" ? "entrenamiento funcional" : t}`);
  const parts = [];
  parts.push(`Tenemos ${n} centros en ${city.fullName} donde se puede preparar una HYROX o una carrera de obstáculos${typeList.length ? `: ${joinEs(typeList)}` : ""}.`);
  if (provinceRaces.length) {
    const r = provinceRaces[0];
    parts.push(`La próxima carrera híbrida en la provincia de ${city.province} es ${r.nombre}, el ${fechaLarga(r.fecha_iso)}${r.municipio && r.municipio !== city.fullName ? ` en ${r.municipio}` : ""}${provinceCount > 1 ? `, y hay ${provinceCount - 1} más en el calendario` : ""}.`);
  } else if (ccaaRaces.length) {
    parts.push(`En la provincia de ${city.province} no hay ahora carreras con fecha, pero en ${city.ccaa} tienes ${ccaaRaces.map(r => `${r.nombre} (${fechaLarga(r.fecha_iso)})`).join(" y ")}.`);
  } else {
    parts.push(`Ahora mismo no hay carreras híbridas con fecha en la provincia de ${city.province || city.fullName}; tienes todas las de España en el calendario.`);
  }
  return parts.join(" ");
}

export default function CentrosCiudad(props) {
  const { city, centers, provinceRaces, ccaaRaces, region, others, generated } = props;
  const path = `/centros-entrenamiento/${city.slug}`;
  const url = `${SITE_URL}${path}`;
  const title = cityTitle(city.name);
  const h1 = `Dónde entrenar HYROX en ${city.name}: gimnasios y boxes`;
  const lead = intro(props);
  const desc = fitDesc([
    `${centers.length} gimnasios y boxes para entrenar HYROX y OCR en ${city.fullName}, con dirección, web y teléfono.${provinceRaces[0] ? ` Próxima carrera cerca: ${provinceRaces[0].nombre}.` : ""}`,
    `${centers.length} gimnasios y boxes para entrenar HYROX y carreras de obstáculos en ${city.fullName}, con dirección, web y teléfono, y las próximas carreras cerca.`,
    `${centers.length} gimnasios y boxes para entrenar HYROX y carreras de obstáculos en ${city.fullName}, con dirección, web, teléfono y las carreras híbridas más cercanas.`,
    `${centers.length} gimnasios y boxes para entrenar HYROX y OCR en ${city.fullName}, con dirección, web, teléfono y las carreras híbridas más cercanas en el calendario.`,
    `${centers.length} gimnasios y boxes para entrenar HYROX y carreras de obstáculos en ${city.fullName}, con dirección, web y teléfono, y las carreras más cercanas.`,
    `${centers.length} gimnasios y boxes para entrenar HYROX y OCR en ${city.fullName}, con dirección, web y teléfono, y las carreras híbridas más cercanas.`,
    `Dónde entrenar HYROX y OCR en ${city.fullName}: ${centers.length} gimnasios y boxes con dirección, web y teléfono, y las próximas carreras cerca de ti.`,
    `Dónde entrenar HYROX y OCR en ${city.fullName}: ${centers.length} gimnasios y boxes con dirección, web y teléfono, y las próximas carreras.`,
    `Gimnasios y boxes para entrenar HYROX y OCR en ${city.fullName}, con dirección, web y teléfono.`,
  ]);
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Centros de entrenamiento", href: "/centros-entrenamiento" }, { name: city.name }];

  useEffect(() => { trackRegionView(`centros:${city.slug}`); }, [city.slug]);

  const schema = [
    breadcrumbLd(crumbs, url),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Centros para entrenar HYROX y OCR en ${city.fullName}`,
      "numberOfItems": centers.length,
      "itemListElement": centers.map((c, i) => ({
        "@type": "ListItem", "position": i + 1,
        "item": {
          "@type": "SportsActivityLocation",
          "name": c.nombre,
          "address": {
            "@type": "PostalAddress",
            ...(c.direccion ? { "streetAddress": c.direccion.replace(/<[^>]+>/g, " ").trim() } : {}),
            "addressLocality": city.fullName,
            ...(c.cp ? { "postalCode": c.cp } : {}),
            ...(city.province ? { "addressRegion": city.province } : {}),
            "addressCountry": "ES",
          },
          ...(c.telefono ? { "telephone": c.telefono } : {}),
          ...(c.web ? { "url": c.web.startsWith("http") ? c.web : `https://${c.web}` } : {}),
          ...(c.lat != null && c.lng != null ? { "geo": { "@type": "GeoCoordinates", "latitude": c.lat, "longitude": c.lng } } : {}),
        },
      })),
    },
  ];

  return (
    <PageShell activePath="/centros-entrenamiento">
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <article className="guide city-page">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Centros de entrenamiento · {city.province || city.fullName}</p>
          <h1 className="guide-title">{h1}</h1>
          <p className="guide-updated">{centers.length} centros · Actualizado: <time dateTime={generated}>{fechaLarga(generated)}</time></p>
        </div>

        <div className="guide-body">
          <p className="guide-lead">{lead}</p>
          {CITY_NOTES[city.slug] && <p>{CITY_NOTES[city.slug]}</p>}
          <p>
            Antes de ir, llama: lo que más cuesta encontrar es trineo con pista suficiente, SkiErg y remo, que son tres de las ocho estaciones de HYROX.
            Si vas a una carrera de obstáculos, pregunta también por rig con cuerda y barras para trabajar el agarre.
          </p>

          <h2 id="centros">Gimnasios y boxes en {city.fullName}</h2>
          <ul className="center-list">
            {centers.map((c, i) => (
              <li key={i}>
                <span className="center-name">{c.nombre}</span>
                <span className="center-meta">{[c.tipo, c.direccion && c.direccion.replace(/<[^>]+>/g, " "), c.cp].filter(Boolean).join(" · ")}</span>
                {c.web && <a href={c.web.startsWith("http") ? c.web : `https://${c.web}`} target="_blank" rel="nofollow noopener noreferrer">Web</a>}
                {c.telefono && <a href={`tel:${c.telefono.replace(/[\s-]/g, "")}`}>Llamar</a>}
              </li>
            ))}
          </ul>
          <p>¿Falta tu centro o hay un dato mal? <a href="/contacto-organizadores">Escríbenos</a> y lo corregimos.</p>

          <h2 id="carreras">Carreras híbridas cerca de {city.name}</h2>
          {provinceRaces.length > 0 ? (
            <ul className="plain-list">
              {provinceRaces.map((r, i) => (
                <li key={i}><strong>{r.nombre}</strong> · {dateParts(r.fecha_iso)?.long}{r.municipio ? ` · ${r.municipio}` : ""}</li>
              ))}
            </ul>
          ) : ccaaRaces.length > 0 ? (
            <ul className="plain-list">
              {ccaaRaces.map((r, i) => (
                <li key={i}><strong>{r.nombre}</strong> · {dateParts(r.fecha_iso)?.long}{r.municipio ? ` · ${r.municipio}` : ""}</li>
              ))}
            </ul>
          ) : (
            <p>No hay carreras con fecha en la zona ahora mismo.</p>
          )}
          <p>
            {region
              ? <>Fechas, precios e inscripción en <a href={`/carreras-hibridas/${region.slug}`}>carreras híbridas en {region.name}</a> y en el <a href="/calendario">calendario de España</a>.</>
              : <>Fechas, precios e inscripción en el <a href="/calendario">calendario de carreras híbridas de España</a>.</>}
            {" "}Para preparar la primera, mira el <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan HYROX de 12 semanas</a>.
          </p>

          {others.length > 0 && (
            <>
              <h2 id="otras">Otras ciudades cerca</h2>
              <ul className="city-links city-links--inline">
                {others.map(o => (
                  <li key={o.slug}><a href={`/centros-entrenamiento/${o.slug}`}>{o.name}<span className="city-count">{o.count} centros</span></a></li>
                ))}
              </ul>
            </>
          )}
          <p><a href="/centros-entrenamiento">Ver el directorio completo de centros en España →</a></p>
        </div>
      </article>
    </PageShell>
  );
}
