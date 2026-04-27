import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import centrosJson from "../lib/centros-entrenamiento.json";

const CCAA_LIST = [...new Set(centrosJson.map((c) => c.ccaa).filter(Boolean))].sort();

export default function CentrosEntrenamiento() {
  const [search, setSearch] = useState("");
  const [activeCCAA, setActiveCCAA] = useState(null);

  const filtered = useMemo(() => {
    let result = centrosJson;
    if (activeCCAA) result = result.filter((c) => c.ccaa === activeCCAA);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.ciudad.toLowerCase().includes(q) ||
          c.codigo_postal.includes(q) ||
          c.direccion.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCCAA]);

  const grouped = useMemo(() => {
    if (search.trim()) return null;
    const g = {};
    filtered.forEach((c) => {
      const key = c.ccaa || "Otras";
      if (!g[key]) g[key] = [];
      g[key].push(c);
    });
    return g;
  }, [filtered, search]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Boxes CrossFit en España — Directorio",
    description: "Directorio completo de boxes CrossFit en España con más de 356 centros.",
    numberOfItems: centrosJson.length,
    itemListElement: centrosJson.slice(0, 50).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: c.nombre,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.direccion,
          addressLocality: c.ciudad,
          postalCode: c.codigo_postal,
          addressRegion: c.ccaa,
          addressCountry: "ES",
        },
        url: c.web,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Boxes CrossFit en España — Directorio de 356 centros | Hybrid Race Hub</title>
        <meta
          name="description"
          content="Directorio completo de boxes CrossFit en España. Más de 356 centros con dirección, ciudad y enlace directo. Encuentra el box más cercano para preparar tu próxima carrera híbrida."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:title" content="Boxes CrossFit en España — Directorio de 356 centros" />
        <meta property="og:description" content="Directorio completo de boxes CrossFit en España. Más de 356 centros con dirección y ubicación." />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boxes CrossFit en España — Directorio de 356 centros" />
        <meta name="twitter:description" content="Directorio completo de boxes CrossFit en España." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#08090C; --bg2:#0F1015; --surface:#13151C; --surface2:#1A1D26;
          --border:rgba(255,255,255,0.08); --border2:rgba(255,255,255,0.16);
          --text:#F5F5F7; --muted:#8C8E9A; --muted2:#5D5F6B;
          --accent:#FB923C; --accent-bg:rgba(251,146,60,0.14); --accent-mid:#FDBA74;
          --font-display:"Barlow Condensed","Arial Narrow",sans-serif;
          --font-body:"Inter",-apple-system,sans-serif;
          --font-mono:"JetBrains Mono",ui-monospace,monospace;
          --radius:12px; --radius-sm:8px; --radius-lg:16px;
        }
        body { background:var(--bg); color:var(--text); font-family:var(--font-body); }
        a { color:inherit; text-decoration:none; }

        .topbar { background:var(--bg); border-bottom:1px solid var(--border); height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 2rem; }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand-logo { width:34px; height:34px; clip-path:polygon(15% 0,100% 0,85% 100%,0 100%); background:linear-gradient(135deg,#FB923C 0%,#FACC15 100%); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:900; color:#08090C; }
        .brand-name { font-family:var(--font-display); font-size:17px; font-weight:800; text-transform:uppercase; color:var(--text); }
        .brand-sub { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }
        .topbar-nav { display:flex; gap:4px; }
        .topbar-nav a { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); padding:6px 12px; border-radius:var(--radius-sm); border:0.5px solid transparent; transition:color .15s,border-color .15s; }
        .topbar-nav a:hover { color:var(--text); border-color:var(--border2); }
        .topbar-nav a.active { color:var(--accent-mid); border-color:rgba(251,146,60,0.3); }

        .page-hero { background:var(--bg); border-bottom:1px solid var(--border); padding:3rem 2rem 2.5rem; }
        .page-hero-inner { max-width:1100px; margin:0 auto; }
        .page-eyebrow { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--accent-mid); margin-bottom:10px; }
        .page-title { font-family:var(--font-display); font-size:clamp(44px,7vw,80px); font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:0.95; color:var(--text); margin-bottom:14px; }
        .page-sub { font-family:var(--font-body); font-size:15px; color:var(--muted); max-width:640px; line-height:1.65; }
        .stats-bar { display:flex; gap:2rem; flex-wrap:wrap; margin-top:1.5rem; }
        .stat-item { display:flex; flex-direction:column; gap:2px; }
        .stat-val { font-family:var(--font-display); font-size:32px; font-weight:800; color:var(--accent); line-height:1; }
        .stat-lbl { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }

        .search-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:1rem 2rem; }
        .search-bar-inner { max-width:1100px; margin:0 auto; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .search-input-wrap { position:relative; flex:1; min-width:200px; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted2); pointer-events:none; }
        .search-input { width:100%; background:var(--surface2); border:0.5px solid var(--border2); border-radius:var(--radius-sm); padding:10px 12px 10px 36px; font-family:var(--font-body); font-size:14px; color:var(--text); outline:none; transition:border-color .15s; }
        .search-input::placeholder { color:var(--muted2); }
        .search-input:focus { border-color:rgba(251,146,60,0.4); }
        .result-count { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); white-space:nowrap; }

        .filters-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:.75rem 2rem; display:flex; gap:6px; flex-wrap:wrap; align-items:center; overflow-x:auto; }
        .filter-chip { font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; padding:5px 12px; border-radius:999px; border:0.5px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; white-space:nowrap; transition:all .15s; }
        .filter-chip:hover { border-color:var(--border2); color:var(--text); }
        .filter-chip--on { background:var(--accent-bg); color:var(--accent-mid); border-color:rgba(251,146,60,0.4); }

        .centros-body { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .ccaa-section { margin-bottom:3rem; }
        .ccaa-title { font-family:var(--font-display); font-size:20px; font-weight:800; text-transform:uppercase; letter-spacing:0.02em; color:var(--text); margin-bottom:1rem; display:flex; align-items:center; gap:10px; }
        .ccaa-title::after { content:""; flex:1; height:0.5px; background:var(--border); }
        .ccaa-count { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted2); }
        .centros-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }

        .centro-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius); padding:1.1rem; display:flex; flex-direction:column; gap:8px; transition:transform .15s,border-color .15s,box-shadow .15s; }
        .centro-card:hover { transform:translateY(-2px); border-color:var(--border2); box-shadow:0 6px 24px rgba(0,0,0,0.35); }
        .centro-nombre { font-family:var(--font-display); font-size:17px; font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:1.15; color:var(--text); }
        .centro-loc { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
        .centro-ciudad { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--accent-mid); }
        .centro-cp { font-family:var(--font-mono); font-size:10px; font-weight:500; color:var(--muted2); }
        .centro-dir { font-family:var(--font-body); font-size:12px; color:var(--muted); line-height:1.5; flex:1; }
        .centro-links { display:flex; gap:6px; flex-wrap:wrap; padding-top:8px; border-top:0.5px solid var(--border); }
        .centro-link { display:inline-flex; align-items:center; gap:4px; font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; padding:4px 10px; border-radius:999px; border:0.5px solid var(--border); color:var(--muted); transition:color .15s,border-color .15s; }
        .centro-link:hover { color:var(--accent); border-color:rgba(251,146,60,0.3); }
        .centro-link--primary { color:var(--accent-mid); border-color:rgba(253,186,116,0.25); }
        .centro-link--primary:hover { border-color:var(--accent-mid); }

        .no-results { text-align:center; padding:4rem 2rem; color:var(--muted); font-family:var(--font-body); font-size:14px; }
        .no-results strong { display:block; font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text); text-transform:uppercase; margin-bottom:8px; }

        .cta-block { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:2rem; text-align:center; margin-top:3rem; }
        .cta-block-title { font-family:var(--font-display); font-size:28px; font-weight:800; text-transform:uppercase; color:var(--text); margin-bottom:8px; }
        .cta-block-sub { font-family:var(--font-body); font-size:14px; color:var(--muted); margin-bottom:1.25rem; line-height:1.6; }
        .cta-btn { display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#08090C; font-family:var(--font-display); font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; padding:12px 24px; border-radius:var(--radius-sm); transition:transform .12s,box-shadow .12s; }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(251,146,60,0.4); }

        .bottom-links { margin-top:2rem; display:flex; gap:.75rem; flex-wrap:wrap; justify-content:center; }
        .bottom-link { display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; border-radius:999px; padding:6px 14px; }
        .bottom-link--accent { color:var(--accent); border:0.5px solid rgba(251,146,60,0.3); }
        .bottom-link--muted { color:var(--muted); border:0.5px solid rgba(255,255,255,0.08); }

        @media (max-width:720px) {
          .topbar { padding:0 1rem; }
          .page-hero { padding:2rem 1rem 1.5rem; }
          .centros-body { padding:1.5rem 1rem 3rem; }
          .search-bar { padding:.75rem 1rem; }
          .filters-bar { padding:.5rem 1rem; }
          .centros-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="topbar">
        <Link href="/" className="brand">
          <div className="brand-logo">H</div>
          <div>
            <div className="brand-name">Hybrid Race Hub</div>
            <div className="brand-sub">OCR · HYROX · Functional</div>
          </div>
        </Link>
        <nav className="topbar-nav">
          <Link href="/">Inicio</Link>
          <Link href="/calendario">Calendario</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/calculadora-hyrox">Calculadora</Link>
          <Link href="/centros-entrenamiento" className="active">Centros</Link>
        </nav>
      </div>

      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Directorio nacional</p>
          <h1 className="page-title">Boxes CrossFit<br />en España</h1>
          <p className="page-sub">
            Directorio completo de boxes CrossFit en España. Busca por ciudad o código
            postal y encuentra dónde entrenar para tu próxima carrera híbrida.
          </p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-val">{centrosJson.length}</span>
              <span className="stat-lbl">Boxes</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{CCAA_LIST.length}</span>
              <span className="stat-lbl">CCAA</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{[...new Set(centrosJson.map((c) => c.ciudad).filter(Boolean))].length}</span>
              <span className="stat-lbl">Ciudades</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-bar-inner">
          <div className="search-input-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="search-input"
              placeholder="Ciudad, código postal o nombre del box..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar boxes CrossFit"
            />
          </div>
          <span className="result-count">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="filters-bar">
        <button
          className={`filter-chip${!activeCCAA ? " filter-chip--on" : ""}`}
          onClick={() => setActiveCCAA(null)}
        >
          Todas las CCAA
        </button>
        {CCAA_LIST.map((ccaa) => (
          <button
            key={ccaa}
            className={`filter-chip${activeCCAA === ccaa ? " filter-chip--on" : ""}`}
            onClick={() => setActiveCCAA(activeCCAA === ccaa ? null : ccaa)}
          >
            {ccaa}
          </button>
        ))}
      </div>

      <div className="centros-body">
        {filtered.length === 0 && (
          <div className="no-results">
            <strong>Sin resultados</strong>
            No encontramos boxes para &quot;{search}&quot;
          </div>
        )}

        {grouped
          ? Object.entries(grouped)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([ccaa, boxes]) => (
                <section key={ccaa} className="ccaa-section">
                  <h2 className="ccaa-title">
                    {ccaa}
                    <span className="ccaa-count">{boxes.length} box{boxes.length !== 1 ? "es" : ""}</span>
                  </h2>
                  <div className="centros-grid">
                    {boxes.map((centro) => (
                      <CentroCard key={centro.id} centro={centro} />
                    ))}
                  </div>
                </section>
              ))
          : filtered.length > 0 && (
              <div className="centros-grid">
                {filtered.map((centro) => (
                  <CentroCard key={centro.id} centro={centro} />
                ))}
              </div>
            )}

        <div className="cta-block">
          <p className="cta-block-title">¿Tu box no aparece?</p>
          <p className="cta-block-sub">
            Si tu centro no está en el directorio o quieres ampliar la información,
            escríbenos. El listado es gratuito.
          </p>
          <a href="/contacto-organizadores" className="cta-btn">
            Añadir mi box →
          </a>
        </div>

        <div className="bottom-links">
          <Link href="/calendario" className="bottom-link bottom-link--accent">
            Calendario de eventos →
          </Link>
          <Link href="/calculadora-hyrox" className="bottom-link bottom-link--muted">
            Calculadora HYROX →
          </Link>
          <Link href="/blog" className="bottom-link bottom-link--muted">
            Blog y guías →
          </Link>
        </div>
      </div>
    </>
  );
}

function CentroCard({ centro }) {
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(
    [centro.nombre, centro.direccion, centro.ciudad].filter(Boolean).join(" ")
  )}`;

  return (
    <article className="centro-card">
      <h3 className="centro-nombre">{centro.nombre}</h3>
      {(centro.ciudad || centro.codigo_postal) && (
        <div className="centro-loc">
          {centro.ciudad && <span className="centro-ciudad">{centro.ciudad}</span>}
          {centro.codigo_postal && <span className="centro-cp">{centro.codigo_postal}</span>}
        </div>
      )}
      {centro.direccion && <p className="centro-dir">{centro.direccion}</p>}
      <div className="centro-links">
        <a
          href={centro.web}
          target="_blank"
          rel="noreferrer noopener"
          className="centro-link centro-link--primary"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Ver ficha
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="centro-link"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Mapa
        </a>
      </div>
    </article>
  );
}
