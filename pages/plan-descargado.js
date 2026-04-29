import Head from "next/head";

export default function PlanDescargado() {
  return (
    <>
      <Head>
        <title>¡Plan enviado! — Hybrid Race Hub</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style>{`
        :root{--bg:#08090C;--surface:#13151C;--surface2:#1A1D26;--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.16);--text:#F5F5F7;--muted:#8C8E9A;--muted2:#5D5F6B;--accent:#FB923C;--font-display:"Barlow Condensed","Arial Narrow",sans-serif;--font-body:"Inter",-apple-system,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,monospace;--radius:12px;--radius-sm:8px;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:var(--font-body);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1.5rem;}
        .page{max-width:520px;width:100%;text-align:center;}
        .check-wrap{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(251,146,60,.12);border:1.5px solid rgba(251,146,60,.35);margin:0 auto 2rem;}
        .eyebrow{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:.75rem;}
        h1{font-family:var(--font-display);font-size:clamp(30px,7vw,48px);font-weight:800;text-transform:uppercase;letter-spacing:-.01em;line-height:1.1;margin-bottom:1rem;}
        .desc{font-size:15px;color:var(--muted);line-height:1.7;margin-bottom:.6rem;}
        .desc strong{color:var(--text);}
        .spam-note{font-family:var(--font-mono);font-size:11px;color:var(--muted2);margin-bottom:2.5rem;}
        .steps{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:1.5rem;text-align:left;margin-bottom:2rem;}
        .steps-title{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:1rem;}
        .step-item{display:flex;gap:.75rem;align-items:flex-start;margin-bottom:.75rem;}
        .step-item:last-child{margin-bottom:0;}
        .step-num{font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--accent);background:rgba(251,146,60,.12);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
        .step-text{font-size:13px;color:var(--muted);line-height:1.5;}
        .step-text strong{color:var(--text);}
        .btn-home{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:var(--accent);color:#08090C;border-radius:var(--radius-sm);font-family:var(--font-display);font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;text-decoration:none;transition:transform .15s,box-shadow .15s;}
        .btn-home:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(251,146,60,.35);text-decoration:none;}
        .secondary-link{display:block;margin-top:1rem;font-family:var(--font-mono);font-size:11px;color:var(--muted2);text-decoration:none;letter-spacing:.06em;}
        .secondary-link:hover{color:var(--accent);}
      `}</style>

      <div className="page">
        <div className="check-wrap">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,17 13,24 26,10" />
          </svg>
        </div>

        <p className="eyebrow">Pago completado</p>
        <h1>¡Listo! Tu Excel<br/>está de camino.</h1>
        <p className="desc">
          Recibirás el archivo en tu correo en los próximos minutos.<br/>
          <strong>Revisa también la carpeta de spam</strong> si no lo encuentras.
        </p>
        <p className="spam-note">Si llega a spam, márcalo como "No es spam" para futuros mensajes.</p>

        <div className="steps">
          <p className="steps-title">Cómo usar tu plan Excel</p>
          <div className="step-item">
            <span className="step-num">1</span>
            <p className="step-text">Abre la hoja <strong>Portada</strong> para ver el resumen completo de tu plan y las semanas disponibles.</p>
          </div>
          <div className="step-item">
            <span className="step-num">2</span>
            <p className="step-text">Cada semana tiene su propia hoja. Rellena <strong>Peso real</strong> y <strong>RPE</strong> tras cada sesión.</p>
          </div>
          <div className="step-item">
            <span className="step-num">3</span>
            <p className="step-text">Usa la hoja <strong>Mi Progreso</strong> para hacer un seguimiento semanal de tu evolución y peso corporal.</p>
          </div>
        </div>

        <a href="/" className="btn-home">Volver al inicio →</a>
        <a href="/plan-entrenamiento" className="secondary-link">Crear otro plan</a>
      </div>
    </>
  );
}
