import Head from "next/head";
import Link from "next/link";
import { getPostBySlug, getAllSlugs, posts } from "../../lib/posts";

const CATEGORY_COLORS = {
  "Guías":        { color: "var(--hyrox)",   bg: "rgba(250,204,21,0.12)" },
  "Eventos":      { color: "var(--ocr)",     bg: "rgba(251,146,60,0.14)" },
  "Equipamiento": { color: "var(--green)",   bg: "var(--green-bg)"       },
};

export async function getStaticPaths() {
  return { paths: getAllSlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post } };
}

export default function BlogPost({ post }) {
  const colors = CATEGORY_COLORS[post.category] || { color: "var(--accent)", bg: "var(--accent-bg)" };
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <>
      <Head>
        <title>{post.title} — Hybrid Race Hub Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #08090C; --bg2: #0F1015; --surface: #13151C; --surface2: #1A1D26;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7; --muted: #8C8E9A; --muted2: #5D5F6B; --hint: #272932;
          --ocr: #FB923C; --ocr-bg: rgba(251,146,60,0.14);
          --hyrox: #FACC15; --hyrox-bg: rgba(250,204,21,0.12);
          --accent: #FB923C; --accent-bg: rgba(251,146,60,0.14); --accent-mid: #FDBA74;
          --green: #34D399; --green-bg: rgba(52,211,153,0.14);
          --red: #F87171;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius: 12px; --radius-sm: 8px; --radius-lg: 16px;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        a { color: inherit; text-decoration: none; }

        /* ── NAV ── */
        .topbar {
          background: var(--bg); border-bottom: 1px solid var(--border);
          height: 64px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 2rem;
        }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-logo {
          width: 36px; height: 36px;
          clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
          background: linear-gradient(135deg, var(--ocr) 0%, var(--hyrox) 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 18px; font-weight: 900;
          color: #08090C; flex-shrink: 0;
        }
        .brand-name {
          font-family: var(--font-display); font-size: 17px; font-weight: 800;
          text-transform: uppercase; letter-spacing: -0.01em;
        }
        .brand-sub {
          font-family: var(--font-mono); font-size: 9px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted);
        }
        .topbar-nav { display: flex; gap: 4px; }
        .topbar-nav a {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          padding: 6px 12px; border-radius: var(--radius-sm);
          border: 0.5px solid transparent; transition: color .15s, border-color .15s;
        }
        .topbar-nav a:hover { color: var(--text); border-color: var(--border2); }

        /* ── ARTICLE HERO ── */
        .art-hero {
          background: var(--bg); border-bottom: 1px solid var(--border);
          padding: 3rem 2rem 2.5rem;
        }
        .art-hero-inner { max-width: 760px; margin: 0 auto; }
        .breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2);
          margin-bottom: 1.5rem;
        }
        .breadcrumb a:hover { color: var(--text); }
        .breadcrumb-sep { color: var(--hint); }
        .art-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .cat-tag {
          font-family: var(--font-display); font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 9px; border-radius: 999px;
        }
        .meta-info {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2);
        }
        .art-title {
          font-family: var(--font-display); font-size: clamp(30px, 5vw, 52px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 1.05; color: var(--text); margin-bottom: 14px;
        }
        .art-excerpt {
          font-family: var(--font-body); font-size: 16px; color: var(--muted);
          line-height: 1.65; max-width: 600px;
        }

        /* ── ARTICLE BODY ── */
        .art-body-wrap { max-width: 760px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }
        .art-content {
          font-family: var(--font-body); font-size: 16px; color: var(--muted);
          line-height: 1.75;
        }
        .art-content p { margin-bottom: 1.2rem; }
        .art-content h2 {
          font-family: var(--font-display); font-size: 28px; font-weight: 800;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
          margin: 2rem 0 .75rem;
        }
        .art-content h3 {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
          margin: 1.5rem 0 .5rem;
        }
        .art-content ul, .art-content ol { padding-left: 1.4rem; margin-bottom: 1.2rem; }
        .art-content li { margin-bottom: .4rem; }
        .art-content strong { color: var(--text); font-weight: 600; }
        .art-content em { color: var(--muted2); }
        .art-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .art-content a:hover { color: var(--accent-mid); }
        .art-content table {
          width: 100%; border-collapse: collapse;
          margin: 1.5rem 0; font-size: 14px;
          border: 0.5px solid var(--border); border-radius: var(--radius); overflow: hidden;
        }
        .art-content th {
          background: var(--surface2); color: var(--text);
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 10px 14px; border-bottom: 0.5px solid var(--border2); text-align: left;
        }
        .art-content td {
          padding: 10px 14px; border-bottom: 0.5px solid var(--border); color: var(--muted);
        }
        .art-content tr:last-child td { border-bottom: none; }
        .art-content hr { border: none; border-top: 0.5px solid var(--border); margin: 2rem 0; }

        /* ── RELATED ── */
        .related-section { margin-top: 3rem; padding-top: 2rem; border-top: 0.5px solid var(--border); }
        .related-title {
          font-family: var(--font-display); font-size: 18px; font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
          margin-bottom: 1rem;
        }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .related-card {
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius); padding: 1.25rem;
          transition: border-color .15s;
        }
        .related-card:hover { border-color: var(--border2); }
        .related-card-title {
          font-family: var(--font-display); font-size: 17px; font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
          margin: 8px 0 6px; line-height: 1.2;
        }
        .related-card-excerpt {
          font-family: var(--font-body); font-size: 12px; color: var(--muted); line-height: 1.55;
        }

        /* ── BACK ── */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          border: 0.5px solid var(--border); border-radius: 999px;
          padding: 6px 14px; margin-top: 2.5rem;
          transition: color .15s, border-color .15s;
        }
        .back-link:hover { color: var(--text); border-color: var(--border2); }

        @media (max-width: 720px) {
          .topbar { padding: 0 1rem; }
          .art-hero { padding: 2rem 1rem 1.5rem; }
          .art-body-wrap { padding: 1.5rem 1rem 3rem; }
        }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          <div className="brand-logo">H</div>
          <div>
            <div className="brand-name">Hybrid Race Hub</div>
            <div className="brand-sub">OCR · HYROX · Functional</div>
          </div>
        </Link>
        <nav className="topbar-nav">
          <Link href="/">Calendario</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>

      {/* Article hero */}
      <div className="art-hero">
        <div className="art-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/blog">Blog</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{post.category}</span>
          </div>
          <div className="art-meta">
            <span className="cat-tag" style={{ background: colors.bg, color: colors.color }}>
              {post.category}
            </span>
            <span className="meta-info">{post.date}</span>
            <span className="meta-info">·</span>
            <span className="meta-info">{post.readTime} lectura</span>
          </div>
          <h1 className="art-title">{post.title}</h1>
          <p className="art-excerpt">{post.excerpt}</p>
        </div>
      </div>

      {/* Article body */}
      <div className="art-body-wrap">
        <article
          className="art-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related posts */}
        {related.length > 0 && (
          <div className="related-section">
            <p className="related-title">También te puede interesar</p>
            <div className="related-grid">
              {related.map((r) => {
                const rc = CATEGORY_COLORS[r.category] || { color: "var(--accent)", bg: "var(--accent-bg)" };
                return (
                  <Link key={r.slug} href={`/blog/${r.slug}`}>
                    <div className="related-card">
                      <span className="cat-tag" style={{ background: rc.bg, color: rc.color }}>{r.category}</span>
                      <p className="related-card-title">{r.title}</p>
                      <p className="related-card-excerpt">{r.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <Link href="/blog" className="back-link">← Volver al blog</Link>
      </div>
    </>
  );
}
