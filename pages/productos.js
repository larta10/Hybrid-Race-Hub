import Head from "next/head";
import Link from "next/link";

const PRODUCTS = [
  {
    id: 1,
    category: "Zapatillas Trail / OCR",
    name: "Salomon Speedcross 6",
    desc: "El clásico de la OCR. Suela agresiva con chevrones que clavan en barro, drenaje rápido y ajuste seguro. Perfecta para Spartan, Farinato y cualquier carrera de obstáculos.",
    price: "desde ~120 €",
    asin: "B0CGJHZGPV",
    emoji: "👟",
  },
  {
    id: 2,
    category: "Zapatillas Trail / OCR",
    name: "New Balance Fresh Foam X Hierro v8",
    desc: "La opción más cómoda para debutantes. Amortiguación generosa con suela Vibram de alta tracción. Ideal para carreras Open donde el tiempo no es lo primero.",
    price: "desde ~85 €",
    asin: "B0CXK38JZN",
    emoji: "👟",
  },
  {
    id: 3,
    category: "Zapatillas HYROX / Funcional",
    name: "Nike Metcon 9",
    desc: "La reina de HYROX. Suela plana estable para sled y wall balls, con amortiguación suficiente para los 8 km de carrera. La más vista en el podio.",
    price: "desde ~130 €",
    asin: "B0CZF9KMPZ",
    emoji: "👟",
  },
  {
    id: 4,
    category: "Zapatillas HYROX / Funcional",
    name: "Reebok Nano X4",
    desc: "Alternativa directa a la Metcon con un punto más de amortiguación. Ideal para atletas que hacen muchas sandbag lunges y farmer's carry. Precio generalmente más competitivo.",
    price: "desde ~110 €",
    asin: "B0DHPWRSM5",
    emoji: "👟",
  },
  {
    id: 5,
    category: "Guantes / Protección",
    name: "Mechanix Wear FastFit",
    desc: "El guante no oficial de la élite OCR. Fino como una segunda piel, material resistente al barro y cierre de velcro para ajuste rápido. El más visto en la salida de Spartan Elite.",
    price: "desde ~18 €",
    asin: "B08CPC6ZLZ",
    emoji: "🧤",
  },
  {
    id: 6,
    category: "Guantes / Protección",
    name: "Calleras Unbroken Grips 2.0",
    desc: "Para obstáculos de cuerda y barra, el cuero doble es insustituible. Protege las palmas del barro y las rozaduras, manteniendo el agarre. El complemento perfecto del corredor de obstáculos.",
    price: "desde ~18 €",
    asin: "B072YJCWRT",
    emoji: "🧤",
  },
  {
    id: 7,
    category: "Hidratación",
    name: "Salomon Active Skin 8",
    desc: "El chaleco de hidratación favorito del mid-distance. 8 L de capacidad, botellas frontales de acceso inmediato, sin rebotes. Funciona igual de bien en OCR que en trail running.",
    price: "desde ~90 €",
    asin: "B0B4VZLHRN",
    emoji: "🎒",
  },
  {
    id: 8,
    category: "Compresión",
    name: "2XU Core Compression Tights",
    desc: "Mallas de compresión graduada que protegen de arañazos en alambradas y muros, y ayudan a la recuperación muscular. Imprescindibles para OCR con obstáculos de suelo.",
    price: "desde ~55 €",
    asin: "B01IFKR5FY",
    emoji: "🩱",
  },
  {
    id: 9,
    category: "Tecnología / GPS",
    name: "Garmin Forerunner 265",
    desc: "El reloj GPS con mejor relación calidad/precio para atletas de HYROX y OCR. Pantalla AMOLED, GPS multibanda, HRV y hasta 13 días de batería. El ecosistema Garmin Connect es el más completo del mercado.",
    price: "desde ~350 €",
    asin: "B0BS1T9J4Y",
    emoji: "⌚",
  },
  {
    id: 10,
    category: "Tecnología / GPS",
    name: "COROS PACE 3",
    desc: "La mejor alternativa por debajo de 250 €. GPS multibanda, 38 h de batería con GPS activo, frecuencia cardíaca óptica precisa. Para atletas que no necesitan todos los análisis avanzados de Garmin.",
    price: "desde ~200 €",
    asin: "B0CFQQ9FDL",
    emoji: "⌚",
  },
  {
    id: 11,
    category: "Recuperación",
    name: "Theragun Prime (5ª Gen)",
    desc: "La pistola de masaje percusiva de referencia. Penetra en el músculo profundo para acelerar la recuperación tras competición. Con app Therabody y Bluetooth para rutinas guiadas.",
    price: "desde ~250 €",
    asin: "B0C4M811HS",
    emoji: "💆",
  },
  {
    id: 12,
    category: "Recuperación",
    name: "TriggerPoint GRID Foam Roller",
    desc: "El rodillo de espuma de alta densidad más recomendado por fisioterapeutas deportivos. Superficie multi-densidad que replica la presión de una mano de masajista. El mejor ROI en recuperación.",
    price: "desde ~35 €",
    asin: "B0040EGNIU",
    emoji: "🔵",
  },
];

const CATEGORY_COLORS = {
  "Zapatillas Trail / OCR":     { color: "#FB923C", bg: "rgba(251,146,60,0.14)" },
  "Zapatillas HYROX / Funcional": { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  "Guantes / Protección":       { color: "#34D399", bg: "rgba(52,211,153,0.14)" },
  "Hidratación":                { color: "#60A5FA", bg: "rgba(96,165,250,0.14)" },
  "Compresión":                 { color: "#C084FC", bg: "rgba(192,132,252,0.14)" },
  "Tecnología / GPS":           { color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  "Recuperación":               { color: "#34D399", bg: "rgba(52,211,153,0.14)" },
};

export default function Productos() {
  const categories = [...new Set(PRODUCTS.map((p) => p.category))];

  return (
    <>
      <Head>
        <title>Productos Recomendados — Hybrid Race Hub | OCR, HYROX y Fitness Híbrido</title>
        <meta name="description" content="Los mejores productos para OCR, HYROX y running híbrido: zapatillas trail, guantes, GPS, hidratación y recuperación. Selección honesta con precios en Amazon España." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://hybridracehub.com/productos" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/productos" />
        <meta property="og:title" content="Productos Recomendados — Hybrid Race Hub" />
        <meta property="og:description" content="Los mejores productos para OCR, HYROX y running híbrido: zapatillas trail, guantes, GPS, hidratación y recuperación." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/logo.svg" />
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
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
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
        .topbar-nav a.active { color: var(--accent-mid); border-color: rgba(251,146,60,0.3); }

        /* ── HERO ── */
        .page-hero {
          background: var(--bg); border-bottom: 1px solid var(--border);
          padding: 3rem 2rem 2.5rem;
        }
        .page-hero-inner { max-width: 1100px; margin: 0 auto; }
        .page-eyebrow {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-mid);
          margin-bottom: 10px;
        }
        .page-title {
          font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 0.95; color: var(--text); margin-bottom: 14px;
        }
        .page-sub {
          font-family: var(--font-body); font-size: 15px; color: var(--muted);
          max-width: 560px; line-height: 1.65;
        }
        .affiliate-notice {
          margin-top: 1.25rem;
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2);
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-sm); padding: 8px 14px;
          display: inline-block;
        }

        /* ── CONTENT ── */
        .page-body { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

        .category-section { margin-bottom: 3rem; }
        .category-heading {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 1.25rem;
        }
        .category-label {
          font-family: var(--font-display); font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 3px 10px; border-radius: 999px;
        }
        .category-line {
          flex: 1; height: 0.5px; background: var(--border);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .product-card {
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex; flex-direction: column;
          transition: border-color .15s, box-shadow .15s, transform .15s;
          overflow: hidden;
        }
        .product-card:hover {
          border-color: var(--border2);
          box-shadow: 0 8px 28px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }

        .product-emoji {
          background: var(--surface2);
          display: flex; align-items: center; justify-content: center;
          font-size: 52px; padding: 1.5rem 1rem;
          border-bottom: 0.5px solid var(--border);
          user-select: none;
        }

        .product-body {
          padding: 1.25rem; flex: 1;
          display: flex; flex-direction: column; gap: 8px;
        }

        .product-name {
          font-family: var(--font-display); font-size: 19px; font-weight: 800;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
          line-height: 1.15;
        }
        .product-desc {
          font-family: var(--font-body); font-size: 13px; color: var(--muted);
          line-height: 1.6; flex: 1;
        }
        .product-price {
          font-family: var(--font-mono); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-mid);
        }

        .product-cta {
          display: block;
          background: var(--accent); color: #08090C;
          font-family: var(--font-display); font-size: 13px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          text-align: center; padding: 10px 16px;
          border-top: 0.5px solid var(--border);
          transition: background .15s, opacity .15s;
        }
        .product-cta:hover { opacity: 0.88; }

        /* ── FOOTER LEGAL ── */
        .legal-footer {
          border-top: 0.5px solid var(--border); padding: 2rem;
          max-width: 1100px; margin: 0 auto;
        }
        .legal-text {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2);
          line-height: 1.6;
        }

        @media (max-width: 720px) {
          .topbar { padding: 0 1rem; }
          .page-hero { padding: 2rem 1rem 1.5rem; }
          .page-body { padding: 1.5rem 1rem 3rem; }
          .products-grid { grid-template-columns: 1fr; }
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
          <Link href="/productos" className="active">Productos</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Equipamiento</p>
          <h1 className="page-title">Productos<br/>Recomendados</h1>
          <p className="page-sub">
            Selección honesta de zapatillas, guantes, hidratación, GPS y recuperación
            para OCR y HYROX — solo lo que vale la pena, con precio en Amazon España.
          </p>
          <span className="affiliate-notice">
            Como afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
          </span>
        </div>
      </div>

      {/* Products by category */}
      <div className="page-body">
        {categories.map((cat) => {
          const catProducts = PRODUCTS.filter((p) => p.category === cat);
          const colors = CATEGORY_COLORS[cat] || { color: "var(--accent)", bg: "var(--accent-bg)" };
          return (
            <div key={cat} className="category-section">
              <div className="category-heading">
                <span
                  className="category-label"
                  style={{ background: colors.bg, color: colors.color }}
                >
                  {cat}
                </span>
                <div className="category-line" />
              </div>

              <div className="products-grid">
                {catProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-emoji">{product.emoji}</div>
                    <div className="product-body">
                      <p className="product-name">{product.name}</p>
                      <p className="product-desc">{product.desc}</p>
                      <p className="product-price">{product.price}</p>
                    </div>
                    <a
                      href={`https://www.amazon.es/dp/${product.asin}?tag=hybridracehub-21`}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="product-cta"
                    >
                      Ver en Amazon →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="legal-footer">
          <p className="legal-text">
            Como afiliado de Amazon, Hybrid Race Hub obtiene ingresos por las compras adscritas
            que cumplen los requisitos aplicables. Los precios indicados son orientativos y pueden
            variar. Los enlaces llevan a Amazon.es donde podrás ver el precio actualizado,
            disponibilidad y opiniones de otros compradores.
          </p>
        </div>
      </div>
    </>
  );
}
