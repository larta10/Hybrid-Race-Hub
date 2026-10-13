import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página no encontrada | Hybrid Race Hub</title>
        <meta name="description" content="Esta página no existe o ha sido movida. Explora el calendario de carreras OCR y HYROX en España, rankings de equipamiento y más." />
        <meta name="robots" content="noindex" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #08090C; --bg2: #0F1015; --surface: #13151C;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7; --muted: #8C8E9A; --muted2: #5D5F6B;
          --accent: #FB923C; --accent-bg: rgba(251,146,60,0.14);
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius: 12px;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
        a { color: inherit; text-decoration: none; }

        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .error-code { font-family: var(--font-display); font-size: clamp(80px, 20vw, 160px); font-weight: 900; color: var(--accent); line-height: 1; margin-bottom: 0.5rem; }
        .error-title { font-family: var(--font-display); font-size: clamp(22px, 4vw, 36px); font-weight: 800; text-transform: uppercase; color: var(--text); margin-bottom: 1rem; }
        .error-sub { font-family: var(--font-body); font-size: 16px; color: var(--muted); max-width: 480px; line-height: 1.65; margin-bottom: 2.5rem; }
        .links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .link-primary { background: var(--accent); color: #08090C; font-family: var(--font-display); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 12px 24px; border-radius: var(--radius); transition: opacity .15s; }
        .link-primary:hover { opacity: 0.88; }
        .link-ghost { border: 0.5px solid var(--border2); color: var(--muted); font-family: var(--font-display); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 12px 24px; border-radius: var(--radius); transition: color .15s, border-color .15s; }
        .link-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.3); }
        .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 3rem; }
        .brand-name { font-family: var(--font-display); font-size: 16px; font-weight: 800; text-transform: uppercase; }
      `}</style>

      <div className="page">
        <Link href="/" className="brand">
          <Image src="/logo-icon.svg" alt="Hybrid Race Hub" width={32} height={32} />
          <span className="brand-name">Hybrid Race Hub</span>
        </Link>
        <div className="error-code">404</div>
        <h1 className="error-title">Página no encontrada</h1>
        <p className="error-sub">
          Esta página no existe o ha sido movida. Pero tu próxima carrera sí existe — búscala en el calendario.
        </p>
        <div className="links">
          <Link href="/calendario" className="link-primary">Ver calendario →</Link>
          <Link href="/productos" className="link-ghost">Rankings</Link>
          <Link href="/blog" className="link-ghost">Blog</Link>
          <Link href="/centros-entrenamiento" className="link-ghost">Centros</Link>
        </div>
      </div>
    </>
  );
}
