import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Error del servidor | Hybrid Race Hub</title>
        <meta name="description" content="Ha ocurrido un error inesperado. Vuelve al calendario de carreras OCR y HYROX en España." />
        <meta name="robots" content="noindex" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
        a { color: inherit; text-decoration: none; }

        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .error-code { font-family: var(--font-display); font-size: clamp(80px, 20vw, 160px); font-weight: 900; color: var(--text); line-height: 1; margin-bottom: 0.5rem; }
        .error-title { font-family: var(--font-display); font-size: clamp(22px, 4vw, 36px); font-weight: 800; text-transform: uppercase; color: var(--text); margin-bottom: 1rem; }
        .error-sub { font-family: var(--font-body); font-size: 16px; color: var(--muted); max-width: 480px; line-height: 1.65; margin-bottom: 2.5rem; }
        .links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .link-primary { background: var(--text); color: var(--bg); font-family: var(--font-display); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 12px 24px; border-radius: var(--radius); transition: opacity .15s; }
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
        <div className="error-code">500</div>
        <h1 className="error-title">Algo ha ido mal</h1>
        <p className="error-sub">
          Ha ocurrido un error en el servidor. Ya estamos en ello. Mientras tanto, el calendario sigue activo.
        </p>
        <div className="links">
          <Link href="/" className="link-primary">Volver al inicio →</Link>
          <Link href="/calendario" className="link-ghost">Calendario</Link>
        </div>
      </div>
    </>
  );
}
