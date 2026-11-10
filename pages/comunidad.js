import { useState, useEffect } from "react";
import Head from "next/head";
import { SUPABASE_URL, ANON_KEY } from "../lib/shared";

import { SITE_URL, breadcrumbLd } from "../lib/site";
const CATEGORIES = ["Todos", "Guías OCR", "Equipamiento", "Noticias"];

export default function Comunidad() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
      }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(arts => {
      setArticles(Array.isArray(arts) ? arts : []);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const filtered = category === "Todos" ? articles : articles.filter(a => a.category === category);

  return (
    <>
      <Head>
        <title>Comunidad OCR y HYROX: artículos y guías | Hybrid Race Hub</title>
        <meta name="description" content="Artículos de la comunidad sobre carreras OCR, HYROX y material híbrido en España: crónicas, consejos de entrenamiento y recomendaciones para tu carrera." />
        <meta name="keywords" content="comunidad OCR, artículos HYROX, guías entrenamiento híbrido, equipamiento OCR España" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/comunidad`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Comunidad Hybrid Race Hub",
            "description": "Artículos, guías y recomendaciones sobre carreras OCR, HYROX y equipamiento híbrido en España",
            "url": `${SITE_URL}/comunidad`,
            "publisher": {
              "@type": "Organization",
              "name": "Hybrid Race Hub",
              "url": `${SITE_URL}`,
            },
          }) }}
        />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "Inicio", href: "/" }, { name: "Comunidad" }], `${SITE_URL}/comunidad`)) }} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100svh; }
        a { color: var(--text); text-decoration: none; }
        a:hover { text-decoration: underline; }

        .comunidad-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size:14px; font-weight: 500;
          letter-spacing:0.01em; color: var(--muted);
          margin-bottom: 2rem;
        }
        .back-link:hover { color: var(--text); text-decoration: none; }

        .comunidad-header { text-align: center; padding: 3rem 0 2rem; }
        .comunidad-eyebrow {
          font-family: var(--font-mono); font-size:14px; font-weight: 500;
          letter-spacing:0.01em; color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .comunidad-title {
          font-family: var(--font-display); font-size: clamp(42px, 8vw, 72px);
          font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .cat-filters {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
          margin: 2rem 0 3rem;
        }
        .cat-chip {
          padding: 8px 16px; border-radius: 2px;
          font-family: var(--font-body); font-size:14px; font-weight: 500;
          background: var(--surface2); color: var(--muted);
          border: 0.5px solid var(--border); cursor: pointer;
          transition: all 0.15s;
        }
        .cat-chip:hover { border-color: var(--border2); color: var(--text); }
        .cat-chip--on {
          background: var(--surface2); color: var(--accent-mid);
          border-color: var(--text);
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        .article-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden;
          transition: border-color .15s, background-color .15s, color .15s;
        }
        .article-card:hover { border-color: var(--border2);
        }
        .article-image {
          width: 100%; height: 180px;
          background: var(--surface2); object-fit: cover;
        }
        .article-content { padding: 1.25rem; }
        .article-cat {
          font-family: var(--font-mono); font-size:14px; font-weight: 600;
          letter-spacing:0.01em; color: var(--text-muted);
          margin-bottom: 8px;
        }
        .article-title {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 8px; line-height: 1.2;
        }
        .article-excerpt {
          font-size:14px; color: var(--muted); line-height: 1.6;
          margin-bottom: 1rem;
        }
        .article-date {
          font-family: var(--font-mono); font-size:14px;
          color: var(--muted);
        }

        .empty { text-align: center; padding: 4rem; color: var(--muted); }

        @media (max-width: 640px) {
          .comunidad-page { padding: 1rem; }
          .articles-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="comunidad-page">
        <a href="/" className="back-link">← Volver al calendario</a>

        <header className="comunidad-header">
          <p className="comunidad-eyebrow">Comunidad</p>
          <h1 className="comunidad-title">Artículos y guías</h1>
        </header>

        <div className="cat-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip${category === cat ? ' cat-chip--on' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty">Cargando...</div>
        ) : error ? (
          <div className="empty">No hemos podido cargar los artículos. Prueba otra vez en unos minutos.</div>
        ) : filtered.length === 0 ? (
          <div className="empty">Todavía no hay artículos en esta categoría.</div>
        ) : (
          <div className="articles-grid">
            {filtered.map(art => (
              <a key={art.id} href={`/comunidad/${art.slug}`} className="article-card">
                {art.cover_image_url && (
                  <img src={art.cover_image_url} alt={art.title} className="article-image" loading="lazy" />
                )}
                <div className="article-content">
                  <p className="article-cat">{art.category}</p>
                  <h3 className="article-title">{art.title}</h3>
                  <p className="article-excerpt">{art.excerpt}</p>
                  <p className="article-date">
                    {new Date(art.published_at).toLocaleDateString("es-ES", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
