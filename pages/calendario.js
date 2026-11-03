import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import RaceList from "../components/RaceList";
import { Breadcrumbs } from "../components/PageShell";
import { trackSearch } from "../lib/track";
import { SITE_URL, breadcrumbLd, pageTitle, ROBOTS_INDEX } from "../lib/site";
import { track, SiteFooter } from "../lib/shared";
import { fetchUpcomingRaces, fetchAllRaces, raceEndDate, seasonLabel, modalityLabel, todayISO } from "../lib/races-server";
import { monthsWithCounts } from "../lib/calendar-months";
import { hubModalities } from "../lib/modalities";
import { HYBRID_CITIES, raceMatchesCity } from "../lib/hybrid-cities";
import { fechaLarga } from "../lib/dates";
import { withOfficialUrl } from "../lib/race-links";

// El HTML sale ya con todas las carreras futuras (ISR cada hora): Google ve el calendario
// sin ejecutar JS y los filtros trabajan en el navegador sobre estos datos, sin más consultas.
export async function getStaticProps() {
  const races = (await fetchUpcomingRaces()).map(withOfficialUrl);
  const today = todayISO();
  const d60 = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);
  // Celebradas en los últimos 60 días: sus fichas siguen indexables y se enlazan desde aquí
  const recent = (await fetchAllRaces()).filter(r => { const e = raceEndDate(r) || ""; return e < today && e >= d60; })
    .sort((a, b) => b.fecha_iso.localeCompare(a.fecha_iso))
    .map(r => ({ slug: r.slug, nombre: r.nombre, fecha_iso: r.fecha_iso, municipio: r.municipio || null }));
  return {
    props: {
      races, season: seasonLabel(), today, recent,
      months: monthsWithCounts(races, today).map(m => ({ key: m.key, href: m.href, label: m.label, n: m.count })),
      hubs: hubModalities(races).map(m => ({ href: m.hub, label: m.fixedHub ? m.hubLabel : `Carreras ${m.name} en España`, n: m.count })),
      regions: HYBRID_CITIES.map(c => ({ slug: c.slug, en: c.en || `en ${c.name}`, n: races.filter(r => raceMatchesCity(r, c)).length })).filter(c => c.n > 0),
    },
    revalidate: 3600,
  };
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MES_CORTO = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
// Enlaces antiguos ?modalidad=<id de subtipo> (desde las guías del blog)
const LEGACY_MOD = { "func-hyatlon": /hyatl/i, "func-hurbax": /hurbax/i, "func-hyrox": /hyrox/i, "ocr-spartan": /spartan/i };
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Chips({ label, options, value, onChange }) {
  return (
    <div className="cal-chips" role="group" aria-label={label}>
      <span className="cal-chips-label">{label}</span>
      <div className="cal-chips-row">
        <button type="button" className={`cchip${!value ? " cchip--on" : ""}`} aria-pressed={!value} onClick={() => onChange("")}>Todas</button>
        {options.map(o => (
          <button key={o.key} type="button" className={`cchip${value === o.key ? " cchip--on" : ""}`} aria-pressed={value === o.key}
            onClick={() => onChange(value === o.key ? "" : o.key)}>
            {o.label}<span className="cchip-n">{o.n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const counts = (races, fn) => races.reduce((m, r) => { const k = fn(r); if (k) m[k] = (m[k] || 0) + 1; return m; }, {});

export default function Calendario({ races = [], season, today, recent = [], months = [], hubs = [], regions = [] }) {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [mod, setMod] = useState("");
  const [mes, setMes] = useState("");
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  // Opciones con su número de carreras (solo las que existen)
  const regionOpts = useMemo(() => Object.entries(counts(races, r => r.comunidad)).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ key: k, label: k, n })), [races]);
  const modOpts = useMemo(() => Object.entries(counts(races, r => modalityLabel(r))).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ key: k, label: k, n })), [races]);
  const mesOpts = useMemo(() => Object.entries(counts(races, r => (r.fecha_iso || "").slice(0, 7))).sort((a, b) => a[0].localeCompare(b[0])).map(([k, n]) => {
    const [y, m] = k.split("-").map(Number);
    return { key: k, label: `${MES_CORTO[m - 1]}${String(y) !== today.slice(0, 4) ? ` ${String(y).slice(2)}` : ""}`, n };
  }), [races, today]);

  // Leer la URL al cargar (?region=&modalidad=&mes=&q=)
  useEffect(() => {
    if (!router.isReady) return;
    const g = k => (typeof router.query[k] === "string" ? router.query[k] : "");
    /* eslint-disable react-hooks/set-state-in-effect -- la query solo existe tras hidratar */
    setRegion(g("region")); setMod(g("modalidad")); setMes(g("mes")); setQ(g("q"));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escribir los filtros en la URL (compartible); el canonical sigue siendo /calendario
  useEffect(() => {
    if (!ready) return;
    const query = {};
    if (region) query.region = region;
    if (mod) query.modalidad = mod;
    if (mes) query.mes = mes;
    if (q.trim()) query.q = q.trim();
    router.replace({ pathname: "/calendario", query }, undefined, { shallow: true, scroll: false });
  }, [region, mod, mes, q, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (q.trim().length >= 2) trackSearch(q, "calendario"); }, [q]);

  const filtered = useMemo(() => {
    const t = norm(q.trim());
    return races.filter(r =>
      (!region || r.comunidad === region) &&
      (!mod || (LEGACY_MOD[mod] ? LEGACY_MOD[mod].test(`${r.nombre} ${r.modalidad}`) : modalityLabel(r) === mod)) &&
      (!mes || (r.fecha_iso || "").startsWith(mes)) &&
      (!t || norm(`${r.nombre} ${r.ubicacion} ${r.municipio} ${r.provincia} ${r.comunidad} ${r.modalidad}`).includes(t)));
  }, [races, region, mod, mes, q]);

  const anyFilter = region || mod || mes || q.trim();
  const set = (fn, type) => v => { if (v) track("calendar_filter", { filter_type: type, filter_value: v }); fn(v); };
  const clear = () => { setRegion(""); setMod(""); setMes(""); setQ(""); };
  const mesLabel = mes ? `${MESES[Number(mes.slice(5, 7)) - 1]} de ${mes.slice(0, 4)}` : "";

  return (
    <>
      <Head>
        <title>{pageTitle(`Calendario de carreras híbridas ${season} por mes`)}</title>
        <meta name="description" content="Todas las carreras híbridas de España en un calendario: HYROX, OCR, Spartan y DEKA. Filtra por comunidad, mes y formato y guarda la fecha en tu agenda." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={`${SITE_URL}/calendario`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/calendario`} />
        <meta property="og:title" content={`Calendario de carreras híbridas en España ${season}`} />
        <meta property="og:description" content={`Todas las carreras HYROX, OCR, Spartan y DEKA en España ${season}. Filtra por comunidad, modalidad y mes.`} />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Calendario de carreras híbridas en España ${season}`} />
        <meta name="twitter:description" content={`Todas las carreras HYROX, OCR, Spartan y DEKA en España ${season}.`} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "Inicio", href: "/" }, { name: "Calendario" }], `${SITE_URL}/calendario`)) }} />
      </Head>

      <SiteHeader activePath="/calendario" />

      <main className="cal" id="contenido">
        <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Calendario" }]} />
        <h1 className="cal-h1">Calendario de carreras híbridas {season}</h1>

        <div className="cal-filters">
          <label className="cal-search">
            <span className="sr-only">Buscar carrera, ciudad o comunidad</span>
            <input type="search" inputMode="search" enterKeyHint="search" autoComplete="off"
              placeholder="Buscar carrera, ciudad o comunidad" value={q} onChange={e => setQ(e.target.value)} />
          </label>
          <Chips label="Región" options={regionOpts} value={region} onChange={set(setRegion, "ccaa")} />
          <Chips label="Modalidad" options={modOpts} value={mod} onChange={set(setMod, "tipo")} />
          <Chips label="Mes" options={mesOpts} value={mes} onChange={set(setMes, "mes")} />
        </div>

        <div className="cal-count" aria-live="polite">
          <p><strong>{filtered.length}</strong> {filtered.length === 1 ? "carrera" : "carreras"}{mesLabel ? ` en ${mesLabel}` : ""}{region ? ` · ${region}` : ""}{mod && !LEGACY_MOD[mod] ? ` · ${mod}` : ""}</p>
          {anyFilter && <button type="button" className="btn-line cal-clear" onClick={clear}>Limpiar filtros</button>}
        </div>

        {filtered.length
          ? <RaceList races={filtered} pageUrl={`${SITE_URL}/calendario`} groupByYear />
          : (
            <div className="cal-empty">
              <p className="cal-empty-title">Ninguna carrera con esos filtros</p>
              <p>Quita la región o el mes. En invierno hay menos carreras de obstáculos y más pruebas en pabellón.</p>
              <button type="button" className="btn-solid" onClick={clear}>Ver todas las carreras</button>
            </div>
          )}

        <section className="cal-more" aria-labelledby="por-mes">
          <h2 id="por-mes">Carreras por mes</h2>
          <nav className="month-nav" aria-label="Calendario por meses">
            {months.map(m => <a key={m.key} href={m.href}>{m.label} ({m.n})</a>)}
          </nav>
          <h2 id="por-modalidad">Por modalidad</h2>
          <ul className="city-links city-links--long">
            {hubs.map(h => <li key={h.href}><a href={h.href}>{h.label} ({h.n})</a></li>)}
          </ul>
          <h2 id="por-zona">Carreras híbridas por zona</h2>
          <ul className="city-links city-links--long">
            {regions.map(r => <li key={r.slug}><a href={`/carreras-hibridas/${r.slug}`}>Carreras híbridas {r.en} ({r.n})</a></li>)}
          </ul>
          {recent.length > 0 && (
            <>
              <h2 id="celebradas">Celebradas en los últimos 60 días</h2>
              <p>Cada ficha tiene el aviso de edición finalizada y, si ya hay fecha, el enlace a la próxima edición.</p>
              <ul className="plain-list">
                {recent.map(r => <li key={r.slug}><a href={`/carreras/${r.slug}`}>{r.nombre}</a> · {fechaLarga(r.fecha_iso)}{r.municipio ? ` · ${r.municipio}` : ""}</li>)}
              </ul>
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
