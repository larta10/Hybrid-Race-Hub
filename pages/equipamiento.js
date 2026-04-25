import Head from "next/head";
import Link from "next/link";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const PRODUCTS = [
  {
    id: 1,
    name: "Garmin Forerunner 265",
    desc: "GPS multisport con métricas avanzadas de entrenamiento. Monitoriza FC, HRV, carga y recovery. Imprescindible para HYROX y OCR.",
    price: "desde 399€",
    category: "Relojes GPS",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=garmin+forerunner+265&tag=hybridracehub-21",
    badge: "TOP VENTAS",
  },
  {
    id: 2,
    name: "Nike Metcon 9",
    desc: "La referencia en zapatillas para CrossFit y HYROX. Suela plana, soporte lateral y amortiguación justa para carrera y trabajo funcional.",
    price: "desde 120€",
    category: "Zapatillas Functional",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=nike+metcon+9&tag=hybridracehub-21",
  },
  {
    id: 3,
    name: "Inov-8 Mudclaw 300",
    desc: "Zapatilla de trail extremo para OCR. Agarre de picos de acero inigualable en barro, pendientes y agua. La elección de los pros en Spartan.",
    price: "desde 140€",
    category: "OCR / Trail",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=inov8+mudclaw+trail+ocr+zapatillas&tag=hybridracehub-21",
    badge: "PARA OCR",
  },
  {
    id: 4,
    name: "Salomon ADV Skin 12",
    desc: "Chaleco de hidratación ultraligero para trail y OCR de larga distancia. Capacidad 12L, porta soft flasks incluidos, sin rebote.",
    price: "desde 130€",
    category: "Hidratación",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=salomon+adv+skin+chaleco+hidratacion+trail&tag=hybridracehub-21",
  },
  {
    id: 5,
    name: "Guantes CrossFit Carbon Grip",
    desc: "Guantes de agarre para CrossFit, pull-ups y obstáculos de barras en OCR. Protegen las palmas sin limitar la sensación de la barra.",
    price: "desde 22€",
    category: "Guantes",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=guantes+crossfit+grip+pull+ups+carbon&tag=hybridracehub-21",
  },
  {
    id: 6,
    name: "Theragun Prime",
    desc: "Pistola de masaje percusivo para recuperación post-competición. 5 velocidades, 16mm de amplitud y brazo articulado. Alivia agujetas en minutos.",
    price: "desde 249€",
    category: "Recuperación",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=theragun+prime+pistola+masaje+percutivo&tag=hybridracehub-21",
    badge: "RECUPERACIÓN",
  },
  {
    id: 7,
    name: "TRX GO Suspension Trainer",
    desc: "Entrenamiento de fuerza funcional en cualquier lugar. Ideal para complementar el bloque de fuerza de HYROX y OCR cuando no hay gimnasio.",
    price: "desde 130€",
    category: "Entrenamiento",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=trx+go+suspension+trainer+kit+entrenamiento&tag=hybridracehub-21",
  },
  {
    id: 8,
    name: "Kettlebell Ader Sport",
    desc: "Kettlebell de competición en acero con peso marcado por colores. Tamaño uniforme desde 8 hasta 32 kg. Básico para entrenar swing, goblet y farmer's carry.",
    price: "desde 35€",
    category: "Pesas",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80&fit=crop",
    url: "https://www.amazon.es/s?k=kettlebell+competicion+acero+crossfit+hyrox&tag=hybridracehub-21",
    badge: "BÁSICO",
  },
];

export default function Equipamiento() {
  return (
    <>
      <Head>
        <title>Equipamiento Recomendado — Hybrid Race Hub</title>
        <meta
          name="description"
          content="Los mejores productos para atletas híbridos: relojes GPS, zapatillas OCR, equipo CrossFit y HYROX. Selección curada con enlaces a Amazon.es."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_LINK} rel="stylesheet" />
      </Head>

      <style>{`
        .eq-nav {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .eq-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .eq-brand-logo {
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
        .eq-brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
        }
        .eq-nav-back {
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
        .eq-nav-back:hover { color: var(--text); border-color: var(--border2); }

        .eq-hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 3.5rem 2rem 3rem;
          text-align: center;
        }
        .eq-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-mid);
          margin-bottom: 12px;
        }
        .eq-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 0.95;
          margin-bottom: 16px;
        }
        .eq-sub {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--muted);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .eq-disclaimer {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--hint);
          margin-top: 12px;
        }

        .eq-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem 4rem;
        }
        .eq-section-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .eq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        /* Product card */
        .prod-card {
          background: var(--surface);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform .15s, border-color .15s, box-shadow .15s;
        }
        .prod-card:hover {
          transform: scale(1.02);
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(251,146,60,0.12);
        }
        .prod-img-wrap {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--hint);
        }
        .prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .3s;
        }
        .prod-card:hover .prod-img { transform: scale(1.04); }
        .prod-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-family: var(--font-display);
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--accent);
          color: #08090C;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .prod-body {
          padding: 1.1rem 1.1rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .prod-category {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-mid);
        }
        .prod-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 1.1;
        }
        .prod-desc {
          font-family: var(--font-body);
          font-size: 12.5px;
          color: var(--muted);
          line-height: 1.6;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prod-footer {
          padding: 1rem 1.1rem;
          border-top: 0.5px solid var(--border);
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .prod-price {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          color: var(--accent-mid);
        }
        .prod-cta {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: var(--accent);
          color: #08090C;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: transform .12s, box-shadow .12s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .prod-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(251,146,60,0.35);
        }

        .eq-footer {
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
        .eq-footer a { color: var(--muted); text-decoration: none; }
        .eq-footer a:hover { color: var(--text); }

        @media (max-width: 720px) {
          .eq-nav { padding: 0 1rem; }
          .eq-hero { padding: 2rem 1rem; }
          .eq-wrap { padding: 2rem 1rem 3rem; }
          .eq-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <nav className="eq-nav">
        <Link href="/" className="eq-brand">
          <div className="eq-brand-logo">H</div>
          <span className="eq-brand-name">Hybrid Race Hub</span>
        </Link>
        <Link href="/" className="eq-nav-back">← Calendario</Link>
      </nav>

      {/* Hero */}
      <div className="eq-hero">
        <p className="eq-eyebrow">Comunidad · Equipamiento</p>
        <h1 className="eq-title">Equipamiento Recomendado</h1>
        <p className="eq-sub">
          Selección curada de los mejores productos para atletas híbridos. Relojes GPS, zapatillas
          OCR, equipo CrossFit y herramientas de recuperación.
        </p>
        <p className="eq-disclaimer">
          Enlace afiliado Amazon.es — sin coste adicional para ti · tag: hybridracehub-21
        </p>
      </div>

      {/* Product grid */}
      <div className="eq-wrap">
        <p className="eq-section-label">{PRODUCTS.length} productos seleccionados</p>
        <div className="eq-grid">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="prod-card">
              <div className="prod-img-wrap">
                <img src={p.image} alt={p.name} className="prod-img" loading="lazy" />
                {p.badge && <span className="prod-badge">{p.badge}</span>}
              </div>
              <div className="prod-body">
                <span className="prod-category">{p.category}</span>
                <h2 className="prod-name">{p.name}</h2>
                <p className="prod-desc">{p.desc}</p>
              </div>
              <div className="prod-footer">
                <span className="prod-price">{p.price}</span>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="prod-cta">
                  Ver en Amazon →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="eq-footer">
        © 2026 <a href="/">Hybrid Race Hub</a> · Hybrid Race Hub es participante en el Programa de Afiliados de Amazon EU
      </footer>
    </>
  );
}
