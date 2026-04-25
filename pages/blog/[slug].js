import Head from "next/head";
import Link from "next/link";
import { articles } from "../../data/articles";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

export async function getStaticPaths() {
  return {
    paths: articles.map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = articles.find((a) => a.slug === params.slug) || null;
  return { props: { article } };
}

export default function ArticlePage({ article }) {
  if (!article) return null;

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <Head>
        <title>{article.title} — Hybrid Race Hub</title>
        <meta name="description" content={article.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.cover} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_LINK} rel="stylesheet" />
      </Head>

      <style>{`
        .art-nav {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .art-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .art-brand-logo {
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
        .art-brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
        }
        .art-nav-back {
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
        .art-nav-back:hover { color: var(--text); border-color: var(--border2); }

        /* Hero image 16:9 */
        .art-hero-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--surface);
          max-height: 520px;
        }
        .art-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .art-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(8,9,12,0.7) 100%);
        }

        /* Article layout */
        .art-wrap {
          max-width: 760px;
          margin: 0 auto;
          padding: 3rem 2rem 4rem;
        }

        .art-category {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-mid);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .art-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.95;
          color: var(--text);
          margin-bottom: 1rem;
        }
        .art-excerpt {
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--muted);
          line-height: 1.65;
          margin-bottom: 1.5rem;
          max-width: 620px;
        }
        .art-meta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted2);
          padding-bottom: 2rem;
          border-bottom: 0.5px solid var(--border);
          margin-bottom: 2.5rem;
        }
        .art-meta-sep { color: var(--hint); }

        /* Prose content */
        .art-content { font-family: var(--font-body); font-size: 16px; color: var(--muted); line-height: 1.75; }
        .art-content p { margin-bottom: 1.25rem; }
        .art-content h2 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          margin: 2.5rem 0 1rem;
        }
        .art-content h3 {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text);
          margin: 2rem 0 0.75rem;
        }
        .art-content strong { color: var(--text); font-weight: 600; }
        .art-content ul, .art-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .art-content li { color: var(--muted); }
        .art-content a { color: var(--accent-mid); text-decoration: none; }
        .art-content a:hover { text-decoration: underline; }

        /* Related articles */
        .art-related {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
        }
        .art-related-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--muted);
          margin-bottom: 1.25rem;
          padding-top: 2rem;
          border-top: 0.5px solid var(--border);
        }
        .art-related-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .art-related-card {
          background: var(--surface);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          transition: border-color .15s, transform .15s;
        }
        .art-related-card:hover { border-color: var(--accent); transform: scale(1.02); }
        .art-related-img-wrap {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--hint);
        }
        .art-related-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .art-related-body { padding: 12px; }
        .art-related-cat {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-mid);
          margin-bottom: 4px;
        }
        .art-related-title {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 1.15;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .art-footer {
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
        .art-footer a { color: var(--muted); text-decoration: none; }
        .art-footer a:hover { color: var(--text); }

        @media (max-width: 720px) {
          .art-nav { padding: 0 1rem; }
          .art-wrap { padding: 2rem 1rem 3rem; }
          .art-related { padding: 0 1rem 3rem; }
          .art-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="art-nav">
        <Link href="/" className="art-brand">
          <div className="art-brand-logo">H</div>
          <span className="art-brand-name">Hybrid Race Hub</span>
        </Link>
        <Link href="/blog" className="art-nav-back">← Blog</Link>
      </nav>

      {/* Hero image 16:9 */}
      <div className="art-hero-img-wrap">
        <img src={article.cover} alt={article.coverAlt} className="art-hero-img" />
        <div className="art-hero-overlay" />
      </div>

      {/* Article content */}
      <article className="art-wrap">
        <div className="art-category">
          <span>{article.category}</span>
          <span className="art-meta-sep">·</span>
          <span>{article.readTime} lectura</span>
        </div>
        <h1 className="art-title">{article.title}</h1>
        <p className="art-excerpt">{article.excerpt}</p>
        <div className="art-meta-row">
          <span>{article.author}</span>
          <span className="art-meta-sep">·</span>
          <span>{article.date}</span>
        </div>
        <div
          className="art-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="art-related">
          <p className="art-related-label">También te puede interesar</p>
          <div className="art-related-grid">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="art-related-card">
                <div className="art-related-img-wrap">
                  <img src={r.cover} alt={r.coverAlt} className="art-related-img" loading="lazy" />
                </div>
                <div className="art-related-body">
                  <p className="art-related-cat">{r.category}</p>
                  <p className="art-related-title">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="art-footer">
        © 2026 <a href="/">Hybrid Race Hub</a> · <a href="/blog">Blog</a>
      </footer>
    </>
  );
}
