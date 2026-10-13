import { useState, useEffect } from "react";
import Head from "next/head";
import { SUPABASE_URL, ANON_KEY } from "../lib/shared";

const CATEGORIES = ["Todos", "Rankings", "Guías OCR", "Equipamiento", "Noticias"];

export default function Comunidad() {
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
      }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch(`${SUPABASE_URL}/rest/v1/recommended_products?select=*&active=eq.true&order=created_at.desc`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
      }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    ]).then(([arts, prods]) => {
      setArticles(Array.isArray(arts) ? arts : []);
      setProducts(Array.isArray(prods) ? prods : []);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const filtered = category === "Todos" ? articles : articles.filter(a => a.category === category);

  return (
    <>
      <Head>
        <title>Comunidad OCR y HYROX — Artículos y Guías | Hybrid Race Hub</title>
        <meta name="description" content="Artículos, guías y recomendaciones sobre carreras OCR, HYROX y equipamiento híbrido en España. Todo lo que necesitas saber para tu próxima carrera." />
        <meta name="keywords" content="comunidad OCR, artículos HYROX, guías entrenamiento híbrido, equipamiento OCR España" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.hybridracehub.com/comunidad" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Comunidad Hybrid Race Hub",
            "description": "Artículos, guías y recomendaciones sobre carreras OCR, HYROX y equipamiento híbrido en España",
            "url": "https://www.hybridracehub.com/comunidad",
            "publisher": {
              "@type": "Organization",
              "name": "Hybrid Race Hub",
              "url": "https://www.hybridracehub.com",
            },
          }) }}
        />
      </Head>

      <style>{`
        :root {
          --bg: #08090C;
          --bg2: #0F1015;
          --surface: #13151C;
          --surface2: #1A1D26;
          --border: rgba(255,255,255,0.08);
          --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7;
          --muted: #8C8E9A;
          --accent: #FB923C;
          --accent-bg: rgba(251,146,60,0.14);
          --accent-mid: #FDBA74;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius: 12px;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }

        .comunidad-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          margin-bottom: 2rem;
        }
        .back-link:hover { color: var(--accent); text-decoration: none; }

        .comunidad-header { text-align: center; padding: 3rem 0 2rem; }
        .comunidad-eyebrow {
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent);
          margin-bottom: 1rem;
        }
        .comunidad-title {
          font-family: var(--font-display); font-size: clamp(42px, 8vw, 72px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .cat-filters {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
          margin: 2rem 0 3rem;
        }
        .cat-chip {
          padding: 8px 16px; border-radius: 999px;
          font-family: var(--font-body); font-size: 13px; font-weight: 500;
          background: var(--surface2); color: var(--muted);
          border: 0.5px solid var(--border); cursor: pointer;
          transition: all 0.15s;
        }
        .cat-chip:hover { border-color: var(--border2); color: var(--text); }
        .cat-chip--on {
          background: var(--accent-bg); color: var(--accent-mid);
          border-color: var(--accent);
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
          transition: transform 0.2s, border-color 0.2s;
        }
        .article-card:hover {
          transform: translateY(-4px); border-color: var(--border2);
        }
        .article-image {
          width: 100%; height: 180px;
          background: var(--surface2); object-fit: cover;
        }
        .article-content { padding: 1.25rem; }
        .article-cat {
          font-family: var(--font-mono); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent);
          margin-bottom: 8px;
        }
        .article-title {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.02em;
          margin-bottom: 8px; line-height: 1.2;
        }
        .article-excerpt {
          font-size: 13px; color: var(--muted); line-height: 1.6;
          margin-bottom: 1rem;
        }
        .article-date {
          font-family: var(--font-mono); font-size: 10px;
          text-transform: uppercase; color: var(--muted);
        }

        .products-section { padding: 2rem 0; }
        .products-title {
          font-family: var(--font-display); font-size: 28px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin-bottom: 2rem; text-align: center;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .product-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 1rem;
          transition: border-color 0.15s;
        }
        .product-card:hover { border-color: var(--border2); }
        .product-image {
          width: 100%; height: 140px;
          background: var(--surface2); border-radius: 8px;
          margin-bottom: 1rem; object-fit: cover;
        }
        .product-name {
          font-family: var(--font-display); font-size: 16px; font-weight: 700;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .product-desc {
          font-size: 12px; color: var(--muted); line-height: 1.5;
          margin-bottom: 8px;
        }
        .product-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .product-price {
          font-family: var(--font-display); font-size: 18px; font-weight: 700;
          color: var(--accent);
        }
        .product-btn {
          padding: 8px 14px; background: var(--accent); color: #08090C;
          font-family: var(--font-display); font-size: 11px; font-weight: 700;
          text-transform: uppercase; border: none; border-radius: 6px;
          cursor: pointer; transition: transform 0.15s;
        }
        .product-btn:hover { transform: translateY(-1px); }

        .empty { text-align: center; padding: 4rem; color: var(--muted); }

        @media (max-width: 640px) {
          .comunidad-page { padding: 1rem; }
          .articles-grid { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: 1fr; }
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
          <div className="empty">No se han podido cargar los artículos. Inténtalo de nuevo en unos minutos.</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No hay artículos en esta categoría</div>
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

        {products.length > 0 && (
          <section className="products-section">
            <h2 className="products-title">Productos recomendados</h2>
            <div className="products-grid">
              {products.map(prod => (
                <div key={prod.id} className="product-card">
                  {prod.image_url && (
                    <img src={prod.image_url} alt={prod.name} className="product-image" loading="lazy" />
                  )}
                  <h4 className="product-name">{prod.name}</h4>
                  <p className="product-desc">{prod.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{prod.price_approx}</span>
                    <a href={prod.product_url} target="_blank" rel="noreferrer" className="product-btn">
                      Ver producto
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
