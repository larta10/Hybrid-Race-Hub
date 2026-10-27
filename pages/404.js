import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const REGIONS = [
  ["madrid", "Madrid"], ["cataluna", "Cataluña"], ["andalucia", "Andalucía"], ["comunidad-valenciana", "Comunidad Valenciana"],
  ["canarias", "Canarias"], ["baleares", "Baleares"], ["galicia", "Galicia"], ["bilbao", "Bilbao"],
];

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página no encontrada | Hybrid Race Hub</title>
        <meta name="description" content="Esta página no existe o la hemos movido. Desde aquí puedes ir al calendario de carreras híbridas, a las carreras por comunidad o a las guías del blog." />
        <meta name="robots" content="noindex" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
        a { color: inherit; text-decoration: none; }

        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .error-code { font-family: var(--font-display); font-size: clamp(80px, 20vw, 160px); font-weight: 900; color: var(--text); line-height: 1; margin-bottom: 0.5rem; }
        .error-title { font-family: var(--font-display); font-size: clamp(22px, 4vw, 36px); font-weight: 800; color: var(--text); margin-bottom: 1rem; }
        .error-sub { font-family: var(--font-body); font-size: 16px; color: var(--muted); max-width: 480px; line-height: 1.65; margin-bottom: 2.5rem; }
        .links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .link-primary { background: var(--text); color: var(--bg); font-family: var(--font-display); font-size: 14px; font-weight: 800; letter-spacing:0.01em; padding: 12px 24px; border-radius: var(--radius); transition: opacity .15s; }
        .link-primary:hover { opacity: 0.88; }
        .link-ghost { border: 0.5px solid var(--border2); color: var(--muted); font-family: var(--font-display); font-size: 14px; font-weight: 700; letter-spacing:0.01em; padding: 12px 24px; border-radius: var(--radius); transition: color .15s, border-color .15s; }
        .link-ghost:hover { color: var(--text); border-color: rgba(20,22,26,0.3); }
        .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 3rem; }
        .brand-name { font-family: var(--font-display); font-size: 16px; font-weight: 800; }
        .regions { margin-top: 2.5rem; max-width: 560px; }
        .regions-title { font-size: 14px; color: var(--muted); margin-bottom: .75rem; }
        .regions ul { list-style: none; display: flex; flex-wrap: wrap; gap: 4px 16px; justify-content: center; }
        .regions a { display: inline-flex; align-items: center; min-height: 44px; font-size: 15px; color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="page">
        <Link href="/" className="brand">
          <Image src="/logo-icon.svg" alt="" width={32} height={32} />
          <span className="brand-name">Hybrid Race Hub</span>
        </Link>
        <div className="error-code">404</div>
        <h1 className="error-title">Página no encontrada</h1>
        <p className="error-sub">
          Esta página no existe o la hemos movido. Las carreras siguen en el calendario.
        </p>
        <div className="links">
          <Link href="/calendario" className="link-primary">Ver calendario →</Link>
          <Link href="/productos" className="link-ghost">Rankings</Link>
          <Link href="/blog" className="link-ghost">Blog</Link>
          <Link href="/centros-entrenamiento" className="link-ghost">Centros</Link>
        </div>
        <nav className="regions" aria-label="Carreras por zona">
          <p className="regions-title">Carreras híbridas por zona</p>
          <ul>
            {REGIONS.map(([slug, name]) => (
              <li key={slug}><Link href={`/carreras-hibridas/${slug}`}>{name}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
