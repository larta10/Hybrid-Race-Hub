/* Ficha de cada carrera: /carreras/<nombre-ciudad-año>. Datos de Supabase (más los eventos comprobados a mano),
   regenerada cada hora. Las carreras pasadas siguen vivas con aviso y, a los 60 días, llevan noindex. */
import Head from "next/head";
import { useState } from "react";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import Related from "../../components/Related";
import { SITE_URL, pageTitle, fitDesc, breadcrumbLd, ROBOTS_INDEX, ROBOTS_NOINDEX } from "../../lib/site";
import { fetchAllRaces, todayISO, raceEndDate, raceEventSchema, raceOrganizer, modalityLabel } from "../../lib/races-server";
import { raceStatus, racePrice, raceDisplayName } from "../../lib/race-ui";
import { fechaLarga, rangoFechas } from "../../lib/dates";
import { modalityOf, hubModalities } from "../../lib/modalities";
import { HYBRID_CITIES, raceMatchesCity } from "../../lib/hybrid-cities";
import { CENTER_CITIES, CENTER_CITY_BY_SLUG } from "../../lib/center-cities";
import { downloadIcs, onOrganizerClick } from "../../lib/race-actions";
import { relatedForRace } from "../../lib/related";

const NOINDEX_AFTER_DAYS = 60;
const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export async function getStaticPaths() {
  const all = await fetchAllRaces();
  const from = addDays(todayISO(), -NOINDEX_AFTER_DAYS);
  // Se generan en el build las futuras y las recientes; el resto, la primera vez que alguien las pide
  return { paths: all.filter(r => (raceEndDate(r) || "") >= from).map(r => ({ params: { slug: r.slug } })), fallback: "blocking" };
}

/** Región de la ficha: la página de ciudad si existe; si no, la de la comunidad */
function regionsFor(r) {
  const m = HYBRID_CITIES.filter(c => raceMatchesCity(r, c));
  return [...m.filter(c => c.kind === "ciudad"), ...m.filter(c => c.kind === "comunidad")].map(c => ({ slug: c.slug, name: c.name, en: c.en || `en ${c.name}` }));
}

const lite = r => ({
  slug: r.slug, nombre: r.nombre, fecha_iso: r.fecha_iso, municipio: r.municipio || null, provincia: r.provincia || null,
  comunidad: r.comunidad || null, modalidad: r.modalidad || null, modalidad_id: r.modalidad_id || null, modalidad_parent: r.modalidad_parent || null,
  precio: r.precio || null, estado: r.estado || null, ubicacion: r.ubicacion || null, id: r.id,
});

export async function getStaticProps({ params }) {
  const all = await fetchAllRaces();
  const race = all.find(r => r.slug === params.slug);
  if (!race) return { notFound: true, revalidate: 3600 };
  const today = todayISO();
  const end = raceEndDate(race);
  const past = end < today;
  const modRaw = modalityOf(race);
  // El hub de la modalidad solo se enlaza si existe (HYROX siempre; el resto con 3 o más carreras futuras)
  const hubOk = hubModalities(all.filter(r => raceEndDate(r) >= today)).some(m => m.slug === modRaw.slug);
  const mod = hubOk ? modRaw : { ...modRaw, hub: "/calendario", hubLabel: "Calendario de carreras híbridas" };
  const upcoming = all.filter(r => raceEndDate(r) >= today && r.slug !== race.slug).sort((a, b) => a.fecha_iso.localeCompare(b.fecha_iso));
  const regions = regionsFor(race);
  const sameMod = upcoming.filter(r => modalityOf(r).slug === mod.slug).slice(0, 4);
  const regionCity = regions[0] ? HYBRID_CITIES.find(c => c.slug === regions[0].slug) : null;
  const sameRegion = regionCity ? upcoming.filter(r => raceMatchesCity(r, regionCity) && !sameMod.includes(r)).slice(0, 4) : [];
  // Próxima edición: misma modalidad y mismo municipio, o mismo nombre sin el año
  const base = s => String(s || "").replace(/\b20\d\d\b|\([^)]*\)/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const nextEdition = past ? upcoming.find(r => base(r.nombre) === base(race.nombre) || (modalityOf(r).slug === mod.slug && r.municipio && r.municipio === race.municipio)) : null;
  // Centros para prepararla: ciudades de la misma provincia
  const centerCities = CENTER_CITIES.filter(c => race.provincia && c.province === race.provincia).slice(0, 4);
  const topCity = centerCities[0] ? CENTER_CITY_BY_SLUG[centerCities[0].slug] : null;
  const centers = topCity ? topCity.centers.slice(0, 5).map(c => ({ nombre: c.nombre, tipo: c.tipo || null })) : [];
  const verified = race.verificado || null;
  const updated = String(race.updated_at || race.created_at || "").slice(0, 10) || null;
  return {
    props: {
      race: { ...lite(race), url: race.url || null, formato: race.formato || null, distancia: race.distancia || null, notas: race.notas || null, fecha_fin_iso: end, fuente: race.fuente || null },
      past,
      noindex: addDays(end, NOINDEX_AFTER_DAYS) < today,
      schema: past ? null : raceEventSchema(race, SITE_URL),
      organizer: raceOrganizer(race),
      mod: { slug: mod.slug, name: mod.name, about: mod.about, guide: mod.guide, ranking: mod.ranking, hub: mod.hub, hubLabel: mod.hubLabel },
      regions,
      sameMod: sameMod.map(lite),
      sameRegion: sameRegion.map(lite),
      nextEdition: nextEdition ? lite(nextEdition) : null,
      centerCities: centerCities.map(c => ({ slug: c.slug, name: c.name, count: c.count })),
      centers,
      verified, updated,
      related: relatedForRace({ race, mod, regions, centerCities, todayIso: today }),
      generated: today,
    },
    revalidate: 3600,
  };
}

function MiniList({ races }) {
  return (
    <ul className="plain-list">
      {races.map(r => (
        <li key={r.slug}><a href={`/carreras/${r.slug}`}><strong>{r.nombre}</strong></a> · {fechaLarga(r.fecha_iso)}{r.municipio ? ` · ${r.municipio}` : ""}</li>
      ))}
    </ul>
  );
}

function Actions({ race, url }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const text = `${race.nombre} · ${fechaLarga(race.fecha_iso)}`;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "race_share", race_name: race.nombre });
    try { if (navigator.share) { await navigator.share({ title: race.nombre, text, url }); return; } } catch { return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <div className="race-actions">
      {race.url
        ? <a className="btn-solid" href={race.url} target="_blank" rel="nofollow noopener noreferrer" onClick={() => onOrganizerClick(race)}>Inscribirme en la web oficial</a>
        : <span className="btn-line race-actions-off">Sin web oficial publicada</span>}
      <button type="button" className="btn-line" onClick={() => downloadIcs(race, url)}>Añadir al calendario</button>
      <button type="button" className="btn-line" onClick={share}>{copied ? "Enlace copiado" : "Compartir"}</button>
    </div>
  );
}

export default function Ficha({ race, past, noindex, schema, organizer, mod, regions, sameMod, sameRegion, nextEdition, centerCities, centers, verified, updated, related }) {
  const path = `/carreras/${race.slug}`;
  const url = `${SITE_URL}${path}`;
  const h1 = raceDisplayName(race);
  const status = raceStatus(race);
  const price = racePrice(race);
  const when = rangoFechas(race.fecha_iso, race.fecha_fin_iso);
  const place = [race.ubicacion, race.municipio, race.provincia].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ");
  const region = regions[0] || null;
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Calendario", href: "/calendario" },
    ...(region ? [{ name: region.name, href: `/carreras-hibridas/${region.slug}` }] : []),
    { name: h1 },
  ];
  const desc = fitDesc([
    `${h1}: ${when}${race.municipio ? ` en ${race.municipio}` : ""}. ${modalityLabel(race)}${race.formato ? `, ${race.formato.toLowerCase()}` : ""}${price ? `, ${price.toLowerCase()}` : ""}. Inscripción oficial, cómo prepararla y dónde entrenar.`,
    `${h1}: ${when}${race.municipio ? ` en ${race.municipio}` : ""}. Fecha, sede, precio, estado de la inscripción y enlace oficial, y dónde entrenar cerca.`,
    `${h1}: ${when}. Fecha, sede, precio, inscripción oficial y dónde entrenar.`,
  ]);
  const ld = [breadcrumbLd(crumbs, url), ...(schema ? [{ "@context": "https://schema.org", ...schema }] : [])];
  const ogImg = `${SITE_URL}/og?title=${encodeURIComponent(h1)}&cat=${encodeURIComponent(modalityLabel(race))}`;

  return (
    <PageShell activePath="/calendario">
      <Head>
        <title>{pageTitle(`${h1}: fecha e inscripción`)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>

      <article className="guide race-page">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">{modalityLabel(race)}{race.comunidad ? ` · ${race.comunidad}` : ""}</p>
          <h1 className="guide-title">{h1}</h1>
          <p className="guide-updated">
            {verified
              ? <>Verificado el <time dateTime={verified}>{fechaLarga(verified)}</time>{race.fuente ? ` en ${race.fuente}` : ""}</>
              : updated ? <>Dato actualizado el <time dateTime={updated}>{fechaLarga(updated)}</time></> : null}
            {" · "}<a href="/como-verificamos-las-carreras">Cómo verificamos las carreras</a>
          </p>
        </div>

        <div className="guide-body">
          {past && (
            <p className="race-past" role="status">
              <strong>Edición finalizada.</strong> Esta carrera se celebró {when}.{" "}
              {nextEdition
                ? <>La próxima edición con fecha es <a href={`/carreras/${nextEdition.slug}`}>{nextEdition.nombre}</a>, el {fechaLarga(nextEdition.fecha_iso)}.</>
                : <>Aún no hay fecha de la próxima edición; mira el <a href={mod.hub}>{mod.hubLabel.toLowerCase()}</a>.</>}
            </p>
          )}

          <dl className="race-facts">
            <div><dt>Fecha</dt><dd><time dateTime={race.fecha_iso}>{when.charAt(0).toUpperCase() + when.slice(1)}</time></dd></div>
            {place && <div><dt>Sede</dt><dd>{place}</dd></div>}
            <div><dt>Modalidad</dt><dd>{race.modalidad || modalityLabel(race)}</dd></div>
            {race.formato && <div><dt>Formato</dt><dd>{race.formato}</dd></div>}
            {race.distancia && <div><dt>Distancia</dt><dd>{race.distancia}</dd></div>}
            <div><dt>Precio</dt><dd>{price || "Consultar en la web oficial"}</dd></div>
            <div><dt>Inscripción</dt><dd>{status ? <span className={`st st--${status.kind}`}>{status.label}</span> : "Consultar en la web oficial"}{(verified || updated) && <span className="race-checked"> (comprobado el {fechaLarga(verified || updated)})</span>}</dd></div>
            {organizer && <div><dt>Organiza</dt><dd><a href={organizer.url} target="_blank" rel="nofollow noopener noreferrer">{organizer.name}</a></dd></div>}
          </dl>

          {!past && <Actions race={race} url={url} />}
          {race.notas && <p className="race-notes">{race.notas}</p>}
          <p className="guide-note">Fecha, precio y plazas los publica el organizador y pueden cambiar: confírmalos en su web antes de pagar.</p>

          <h2 id="modalidad">Qué es {mod.slug ? mod.name : "esta prueba"}</h2>
          <p>{mod.about}</p>
          <p><a href={mod.guide.href}>{mod.guide.label}: formato y cómo prepararla →</a></p>

          {(centerCities.length > 0 || centers.length > 0) && (
            <>
              <h2 id="entrenar">Dónde prepararla{race.provincia ? ` en ${race.provincia}` : ""}</h2>
              {centers.length > 0 && (
                <p>
                  En {centerCities[0].name} tienes, entre otros, {centers.map(c => c.nombre).join(", ")}.
                  Llama antes de ir para confirmar que tienen el material que pide la prueba.
                </p>
              )}
              <ul className="city-links city-links--inline">
                {centerCities.map(c => (
                  <li key={c.slug}><a href={`/centros-entrenamiento/${c.slug}`}>Dónde entrenar HYROX en {c.name}<span className="city-count">{c.count} centros</span></a></li>
                ))}
              </ul>
            </>
          )}

          <h2 id="material">Material para esta carrera</h2>
          <p>
            Lo primero que conviene tener resuelto son las zapatillas. Para esta modalidad, mira el ranking de{" "}
            <a href={mod.ranking.href}>{mod.ranking.label.toLowerCase()}</a>; y si es tu primera, la guía de{" "}
            <a href="/blog/material-hyrox-carreras-obstaculos">material para HYROX y carreras de obstáculos</a> ordena por prioridad lo que hace falta y lo que no.
          </p>

          {sameMod.length > 0 && (
            <>
              <h2 id="misma-modalidad">Otras carreras {mod.slug ? mod.name : "parecidas"} con fecha</h2>
              <MiniList races={sameMod} />
              <p><a href={mod.hub}>{mod.hubLabel} →</a></p>
            </>
          )}
          {sameRegion.length > 0 && region && (
            <>
              <h2 id="misma-zona">Más carreras híbridas {region.en}</h2>
              <MiniList races={sameRegion} />
              <p><a href={`/carreras-hibridas/${region.slug}`}>Carreras híbridas {region.en} →</a></p>
            </>
          )}

          <Related links={related} />
        </div>
      </article>
    </PageShell>
  );
}
