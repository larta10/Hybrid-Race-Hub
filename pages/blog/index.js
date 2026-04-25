import Head from "next/head";
import Link from "next/link";
import { articles } from "../../data/articles";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog — Hybrid Race Hub</title>
        <meta
          name="description"
          content="Guías, comparativas y consejos para atletas híbridos. OCR, HYROX y CrossFit en España."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_LINK} rel="stylesheet" />
      </Head>

      <style>{`
        .blog-nav {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .blog-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .blog-brand-logo {
          width: 36px;
          height: 36px;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
          background: linear-gradient(135deg, var(--ocr) 0%, var(--hyrox) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 900;
          color: #08090C;
        }
        .blog-brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
        }
        .blog-nav-back {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-decoration: none;
          border: 0.5px solid var(--border);
          border-radius: 8px;
          padding: 6px 14px;
          transition: color .15s, border-color .15s;
        }
        .blog-nav-back:hover { color: var(--text); border-color: var(--border2); }

        .blog-hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 3.5rem 2rem 3rem;
          text-align: center;
        }
        .blog-hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-mid);
          margin-bottom: 12px;
        }
        .blog-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 0.95;
          margin-bottom: 16px;
        }
        .blog-hero-sub {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--muted);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .blog-grid-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }
        .blog-section-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        /* Article card */
        .article-card {
          background: var(--surface);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform .15s, border-color .15s, box-shadow .15s;
        }
        .article-card:hover {
          transform: scale(1.02);
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(251,146,60,0.12);
        }
        .article-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--hint);
        }
        .article-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .3s;
        }
        .article-card:hover .article-img { transform: scale(1.04); }
        .article-category {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--accent-bg);
          color: var(--accent-mid);
          border: 0.5px solid rgba(251,146,60,0.3);
          padding: 3px 10px;
          border-radius: 999px;
        }

        .article-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 8px;
        }
        .article-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.1;
          color: var(--text);
        }
        .article-excerpt {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-meta {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted2);
          margin-top: 4px;
          display: flex;
          gap: 10px;
        }
        .article-read-more {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--accent-mid);
          margin-top: 4px;
        }

        .blog-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 1.5rem 2rem;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--hint);
        }
        .blog-footer a {
          color: var(--muted);
          text-decoration: none;
          transition: color .15s;
        }
        .blog-footer a:hover { color: var(--text); }

        @media (max-width: 720px) {
          .blog-hero { padding: 2rem 1rem 2rem; }
          .blog-grid-wrap { padding: 2rem 1rem; }
          .blog-nav { padding: 0 1rem; }
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="blog-nav">
        <Link href="/" className="blog-brand">
          <div className="blog-brand-logo">H</div>
          <span className="blog-brand-name">Hybrid Race Hub</span>
        </Link>
        <Link href="/" className="blog-nav-back">← Volver al calendario</Link>
      </nav>

      {/* Hero */}
      <div className="blog-hero">
        <p className="blog-hero-eyebrow">Comunidad · Blog</p>
        <h1 className="blog-hero-title">Guías & Artículos</h1>
        <p className="blog-hero-sub">
          Recursos para atletas híbridos: OCR, HYROX, CrossFit y entrenamiento funcional en España.
        </p>
      </div>

      {/* Grid */}
      <div className="blog-grid-wrap">
        <p className="blog-section-label">{articles.length} artículos publicados</p>
        <div className="blog-grid">
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="article-card">
              <div className="article-img-wrap">
                <img
                  src={a.cover}
                  alt={a.coverAlt}
                  className="article-img"
                  loading="lazy"
                />
                <span className="article-category">{a.category}</span>
              </div>
              <div className="article-body">
                <h2 className="article-title">{a.title}</h2>
                <p className="article-excerpt">{a.excerpt}</p>
                <div className="article-meta">
                  <span>{a.date}</span>
                  <span>·</span>
                  <span>{a.readTime} lectura</span>
                </div>
                <span className="article-read-more">Leer artículo →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="blog-footer">
        © 2026 <a href="/">Hybrid Race Hub</a> · OCR · HYROX · Functional
      </footer>
    </>
  );
}
