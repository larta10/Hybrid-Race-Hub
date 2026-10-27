import Head from "next/head";
import SiteHeader from "../../components/SiteHeader";
import GuideCallout from "../../components/GuideCallout";
import Link from "next/link";
import Image from "next/image";
import { RANKINGS, RANKINGS_UPDATED, resolveRanking } from "../../lib/rankings";
import AffiliateLink from "../../components/AffiliateLink";
import { dateParts } from "../../lib/races-server";
import ProductImage from "../../components/ProductImage";

import { SITE_URL } from "../../lib/site";
export async function getStaticPaths() {
  return {
    paths: RANKINGS.map(r => ({ params: { categoria: r.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const raw = RANKINGS.find(r => r.slug === params.categoria);
  if (!raw) return { notFound: true };
  const ranking = resolveRanking(raw);
  // Imágenes locales en /public/products/: <slug-del-nombre>.webp o <asin>.webp
  const fs = require("fs");
  const path = require("path");
  const dir = path.join(process.cwd(), "public", "products");
  const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const products = ranking.products.map(p => {
    const local = [p.id, slugify(p.name), p.product.asin].filter(Boolean).map(n => `${n}.webp`).find(f => fs.existsSync(path.join(dir, f)));
    return { ...p, img: local ? `/products/${local}` : (p.product.imagenLocal || null) };
  });
  return { props: { ranking: JSON.parse(JSON.stringify({ ...ranking, products })) } };
}

export default function ProductoCategoria({ ranking }) {
  const productSchemas = [{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": ranking.title,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "numberOfItems": ranking.products.length,
    "itemListElement": ranking.products.map(product => ({
      "@type": "ListItem",
      "position": product.rank,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.desc,
        "brand": { "@type": "Brand", "name": product.brand || product.name.split(" ")[0] },
      },
    })),
  }];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Productos", "item": `${SITE_URL}/productos` },
      { "@type": "ListItem", "position": 3, "name": ranking.title, "item": `${SITE_URL}/productos/${ranking.slug}` },
    ],
  };

  return (
    <>
      <Head>
        <title>{ranking.metaTitle}</title>
        <meta name="description" content={ranking.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/productos/${ranking.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/productos/${ranking.slug}`} />
        <meta property="og:title" content={ranking.metaTitle} />
        <meta property="og:description" content={ranking.metaDesc} />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ranking.metaTitle} />
        <meta name="twitter:description" content={ranking.metaDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(productSchemas)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        a { color: inherit; text-decoration: none; }
        .topbar { background: var(--bg); border-bottom: 1px solid var(--border); height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-logo-img { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; display: block; }
        .brand-name { font-family: var(--font-display); font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); }
        .brand-sub { font-family: var(--font-mono); font-size:14px; font-weight: 500; letter-spacing:0.01em; color: var(--muted); }
        .topbar-nav { display: flex; gap: 4px; }
        .topbar-nav a { font-family: var(--font-mono); font-size:14px; font-weight: 500; letter-spacing:0.01em; color: var(--muted); padding: 6px 12px; border-radius: var(--radius-sm); border: 0.5px solid transparent; transition: color .15s, border-color .15s; }
        .topbar-nav a:hover { color: var(--text); border-color: var(--border2); }
        .topbar-nav a.active { color: var(--text); border-color: transparent; border-radius: 0; box-shadow: inset 0 -2px 0 var(--accent); }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size:14px; font-weight: 500; letter-spacing:0.01em; color: var(--muted2); padding: 1rem 2rem 0; max-width: 1100px; margin: 0 auto; }
        .breadcrumb a:hover { color: var(--text); }
        .breadcrumb-sep { color: var(--hint); }

        .page-hero { background: var(--bg); border-bottom: 1px solid var(--border); padding: var(--s6) 2rem var(--s5); }
        .page-hero-inner { max-width: 1100px; margin: 0 auto; }
        .page-eyebrow { font-family: var(--font-mono); font-size:14px; font-weight: 600; letter-spacing:0.01em; color: var(--text-muted); margin-bottom: var(--s2); }
        .page-title { font-family: var(--font-display); font-size: clamp(36px, 5vw, 48px); font-weight: 800; letter-spacing: -0.01em; line-height: 1; color: var(--text); margin-bottom: var(--s2); }
        .page-sub { font-family: var(--font-body); font-size: 17px; color: var(--text-muted); max-width: 62ch; line-height: 1.6; }
        .affiliate-notice { display: inline-block; font-family: var(--font-mono); font-size:14px; color: var(--muted2); letter-spacing:0.01em; margin-top: 10px; }

        .page-body { max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 4rem; }
        .ranking-intro { font-family: var(--font-body); font-size: 17px; color: var(--text-muted); line-height: 1.6; margin-bottom: var(--s5); max-width: 70ch; }
        .ranking-intro p { margin-bottom: 0.75rem; }

        .legal-text { font-family: var(--font-mono); font-size:14px; color: var(--muted2); letter-spacing:0.01em; line-height: 1.6; margin-top: 2rem; padding-top: 1.5rem; border-top: 0.5px solid var(--border); }

        @media (max-width: 720px) {
          .topbar { padding: 0 1rem; }
          .page-hero { padding: 2rem 1rem 1.5rem; }
          .page-body { padding: 1rem 1rem 3rem; }
        }
      `}</style>

      <SiteHeader activePath="/productos" />

      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 2rem 0" }}>
        <Link href="/">Inicio</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/productos">Productos</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{ranking.title}</span>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Ranking · {RANKINGS_UPDATED.slice(0, 4)} · {ranking.eyebrow}</p>
          <h1 className="page-title">{ranking.title}</h1>
          <p className="page-sub">{ranking.metaDesc}</p>
          <p className="ranking-updated">Última revisión: <time dateTime={RANKINGS_UPDATED}>{dateParts(RANKINGS_UPDATED).long}</time></p>
          <span className="affiliate-notice">
            Como afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="page-body">
        {/* Respuesta directa (formato citable) */}
        <section className="quick-answer" aria-labelledby="respuesta-rapida">
          <h2 id="respuesta-rapida" className="quick-answer-title">¿Cuál elegir? Respuesta rápida</h2>
          <p>
            <strong>Nuestra primera opción es {ranking.products[0].name}</strong>.{" "}
            {ranking.conclusion}
          </p>
          <ol className="quick-answer-list">
            {ranking.products.slice(0, 3).map(p => (
              <li key={p.rank}><strong>{p.name}</strong> · {p.pros[0]}</li>
            ))}
          </ol>
        </section>

        <div className="ranking-intro">
          {ranking.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Tabla */}
        <div className="comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>{ranking.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ranking.table.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fichas */}
        <ol className="products-list">
          {ranking.products.map(product => (
            <li key={product.rank} className={`product-row${product.rank === 1 ? " product-row--top" : ""}`}>
              <div className="product-rank" aria-label={`Puesto ${product.rank}`}>{String(product.rank).padStart(2, "0")}</div>
              <div className="product-main">
                {product.brand && <p className="product-brand">{product.brand}</p>}
                <h2 className="product-name">{product.name}</h2>
                <p className="product-desc">{product.desc}</p>
                <div className="product-pcs">
                  <div className="product-pc pros">
                    <div className="product-pc-label">A favor</div>
                    <div className="product-pc-list">
                      {product.pros.map((p, i) => <div key={i} className="product-pc-item">{p}</div>)}
                    </div>
                  </div>
                  <div className="product-pc cons">
                    <div className="product-pc-label">En contra</div>
                    <div className="product-pc-list">
                      {product.cons.map((c, i) => <div key={i} className="product-pc-item">{c}</div>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-side">
                <div className={`product-img-wrap${product.img ? "" : " product-img-wrap--ph"}`}>
                  <ProductImage
                    src={product.img || null}
                    name={product.name}
                    category={ranking.slug}
                    width={220}
                    height={220}
                    className="product-img"
                  />
                </div>
                <AffiliateLink product={product.product} position={product.rank} className="product-cta">
                  Ver precio en Amazon
                </AffiliateLink>
              </div>
            </li>
          ))}
        </ol>

        {/* Conclusión */}
        <div className="ranking-conclusion">
          <div className="ranking-conclusion-label">Recomendación según perfil</div>
          <p>{ranking.conclusion}</p>
        </div>

        {/* Enlazado interno */}
        <GuideCallout context="ranking" />

        <div className="ranking-bottom" style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/calendario" className="btn-line ranking-more">
            Ver carreras →
          </Link>
          <Link href="/blog" className="btn-line ranking-more">
            Leer el blog →
          </Link>
          <Link href="/productos" className="btn-line ranking-more">
            ← Ver todos los rankings
          </Link>
        </div>

        <p className="legal-text">
          Como afiliado de Amazon, Hybrid Race Hub obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios indicados son orientativos y pueden variar.
        </p>
      </div>
    </>
  );
}
