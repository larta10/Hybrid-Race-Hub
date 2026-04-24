import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOizdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

function parseMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${SUPABASE_URL}/rest/v1/articles?slug=eq.${slug}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setArticle(data[0]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: "#08090C", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#8C8E9A" }}>
        Cargando...
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ background: "#08090C", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <a href="/comunidad" style={{ color: "#FB923C", textDecoration: "underline" }}>← Volver a Comunidad</a>
        <h1 style={{ color: "#F5F5F7", fontFamily: "Barlow Condensed, sans-serif" }}>Artículo no encontrado</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} — Hybrid Race Hub</title>
        <meta name="description" content={article.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root {
          --bg: #08090C;
          --surface: #13151C;
          --border: rgba(255,255,255,0.08);
          --text: #F5F5F7;
          --muted: #8C8E9A;
          --accent: #FB923C;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

        .article-page { max-width: 720px; margin: 0 auto; padding: 2rem; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          margin-bottom: 2rem;
        }
        .back-link:hover { color: var(--accent); text-decoration: none; }

        .article-header { margin-bottom: 2rem; }
        .article-cat {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent);
          margin-bottom: 12px;
        }
        .article-title {
          font-family: var(--font-display); font-size: clamp(32px, 6vw, 48px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 1.1; margin-bottom: 1rem;
        }
        .article-meta {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--muted);
        }

        .article-cover {
          width: 100%; max-height: 400px;
          object-fit: cover; border-radius: 12px;
          margin-bottom: 2rem;
        }

        .article-body {
          font-size: 16px; line-height: 1.8; color: var(--text);
        }
        .article-body h1, .article-body h2, .article-body h3 {
          font-family: var(--font-display); font-weight: 700;
          text-transform: uppercase; margin: 2rem 0 1rem;
          color: var(--text);
        }
        .article-body h2 { font-size: 24px; }
        .article-body h3 { font-size: 18px; }
        .article-body p { margin-bottom: 1rem; }
        .article-body strong { color: var(--text); }
        .article-body ul, .article-body ol { margin: 1rem 0 1rem 1.5rem; }
        .article-body li { margin-bottom: 0.5rem; }

        .article-footer {
          margin-top: 3rem; padding-top: 2rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; background: var(--accent); color: #08090C;
          font-family: var(--font-display); font-size: 14px; font-weight: 700;
          text-transform: uppercase; border: none; border-radius: 8px;
          cursor: pointer; text-decoration: none;
        }

        @media (max-width: 640px) {
          .article-page { padding: 1rem; }
        }
      `}</style>

      <div className="article-page">
        <a href="/comunidad" className="back-link">← Volver a Comunidad</a>

        <header className="article-header">
          <p className="article-cat">{article.category}</p>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-meta">
            {new Date(article.published_at).toLocaleDateString("es-ES", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </p>
        </header>

        {article.cover_image_url && (
          <img src={article.cover_image_url} alt={article.title} className="article-cover" />
        )}

        <div 
          className="article-body"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
        />

        <div className="article-footer">
          <a href="/comunidad" className="back-btn">← Más artículos</a>
        </div>
      </div>
    </>
  );
}