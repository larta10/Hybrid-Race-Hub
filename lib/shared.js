import { openConsentSettings } from "./consent";

/* ─── Supabase ─────────────────────────────────────────────────────────────── */
export const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

/* ─── Datos ───────────────────────────────────────────────────────────────── */
export const NICHE_PARENTS = ["ocr", "funcional"];

export const CCAA = [
  "Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria",
  "Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Madrid","Melilla","Murcia","Navarra","País Vasco",
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
/* Envía un evento a GTM (dataLayer). Ver AUDITORIA.md → "GTM — cómo crear activadores" */
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/* ─── Iconos ──────────────────────────────────────────────────────────────── */
export const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

export const EnvelopeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

/* ─── SiteFooter ───────────────────────────────────────────────────────────── */
export function SiteFooter() {
  const cityLinks = [
    { href: "/carreras-hibridas/madrid",     label: "Madrid"     },
    { href: "/carreras-hibridas/barcelona",  label: "Barcelona"  },
    { href: "/carreras-hibridas/valencia",   label: "Valencia"   },
    { href: "/carreras-hibridas/sevilla",    label: "Sevilla"    },
    { href: "/carreras-hibridas/bilbao",     label: "Bilbao"     },
    { href: "/carreras-hibridas/malaga",     label: "Málaga"     },
    { href: "/carreras-hibridas/zaragoza",   label: "Zaragoza"   },
    { href: "/carreras-hibridas/valladolid", label: "Valladolid" },
    { href: "/carreras-hibridas/asturias",   label: "Asturias"   },
    { href: "/carreras-hibridas/murcia",     label: "Murcia"     },
    { href: "/carreras-hibridas/galicia",    label: "Galicia"    },
    { href: "/carreras-hibridas/andalucia",  label: "Andalucía"  },
    { href: "/carreras-hibridas/cataluna",   label: "Cataluña"   },
  ];
  const productLinks = [
    { href: "/productos/relojes",           label: "Relojes GPS"          },
    { href: "/productos/zapatillas-hyrox",  label: "Zapatillas HYROX"     },
    { href: "/productos/zapatillas-trail",  label: "Zapatillas Trail"     },
    { href: "/productos/zapatillas-crossfit", label: "Zapatillas CrossFit" },
    { href: "/productos/pulsometros",       label: "Pulsómetros"          },
    { href: "/productos/ropa",              label: "Ropa técnica"         },
  ];
  const linkStyle = {
    fontFamily: "var(--font-mono, monospace)", fontSize: 12, fontWeight: 500,
    letterSpacing: "0.01em",
    color: "var(--muted, var(--text-muted))", textDecoration: "none",
    transition: "color .15s",
  };
  const headStyle = {
    fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600,
    letterSpacing: "0.01em",
    color: "var(--muted2, var(--muted2))", marginBottom: 10,
  };
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <div className="sf-top">
          <div className="sf-brand">
            <div className="brand-logo" style={{width:34,height:34,fontSize:17}}>H</div>
            <div>
              <div className="brand-name" style={{fontSize:15}}>Hybrid Race Hub</div>
              <div className="brand-sub">OCR · HYROX · Functional</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <a href="mailto:hola@hybridracehub.com" className="sf-ig">
              <EnvelopeIcon size={15}/><span>hola@hybridracehub.com</span>
            </a>
            <a href="https://www.instagram.com/hybridracehub_spain" target="_blank" rel="noreferrer" className="sf-ig">
              <InstagramIcon size={15}/><span>@hybridracehub_spain</span>
            </a>
          </div>
        </div>
        <div className="sf-divider"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"1.5rem 2rem",padding:"1.25rem 0"}}>
          <div>
            <p style={headStyle}>Carreras híbridas por ciudad</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              {cityLinks.map(l=>(
                <li key={l.href}><a href={l.href} className="sf-link" style={linkStyle}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p style={headStyle}>Rankings de productos</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              {productLinks.map(l=>(
                <li key={l.href}><a href={l.href} className="sf-link" style={linkStyle}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p style={headStyle}>Secciones</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              <li><a href="/que-es-una-carrera-hibrida" className="sf-link" style={linkStyle}>Qué es una carrera híbrida</a></li>
              <li><a href="/calendario" className="sf-link" style={linkStyle}>Calendario</a></li>
              <li><a href="/blog" className="sf-link" style={linkStyle}>Blog</a></li>
              <li><a href="/productos" className="sf-link" style={linkStyle}>Productos</a></li>
              <li><a href="/centros-entrenamiento" className="sf-link" style={linkStyle}>Centros</a></li>
              <li><a href="/plan-entrenamiento" className="sf-link" style={linkStyle}>Plan entreno</a></li>
              <li><a href="/calculadora-hyrox" className="sf-link" style={linkStyle}>Calculadora</a></li>
              <li><a href="/race-hub#training-programs" className="sf-link" style={linkStyle}>Programas HYROX</a></li>
              <li><a href="/contacto-organizadores" className="sf-link" style={linkStyle}>Organizadores</a></li>
              <li><a href="/sobre-nosotros" className="sf-link" style={linkStyle}>Sobre nosotros</a></li>
            </ul>
          </div>
        </div>
        <div className="sf-divider"/>
        <div className="sf-legal-block">
          <p className="sf-legal-text" style={{borderLeft:"2px solid rgba(20,22,26,0.1)",paddingLeft:"10px",marginBottom:"12px",color:"var(--muted2)"}}>
            Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.
          </p>
          <p className="sf-legal-head">Aviso Legal · Privacidad · Cookies</p>
          <p className="sf-legal-text">
            <strong>Responsable del tratamiento:</strong> Hybrid Race Hub ·{" "}
            <strong>Finalidad:</strong> gestión de consultas de organizadores y envío de alertas de nuevas carreras ·{" "}
            <strong>Base legal:</strong> consentimiento del interesado (Art. 6.1.a RGPD) ·{" "}
            <strong>Destinatarios:</strong> no se ceden datos a terceros ·{" "}
            <strong>Derechos:</strong> acceso, rectificación, supresión, portabilidad y oposición dirigiéndose a{" "}
            <a href="mailto:hola@hybridracehub.com" style={{color:"var(--muted)"}}>hola@hybridracehub.com</a>
          </p>
          <p className="sf-legal-text">
            Usamos cookies técnicas y, solo si las aceptas, cookies de analítica (Google Analytics) y de publicidad (Google Ads).
            Los datos personales se tratan conforme al RGPD y la LOPDGDD.{" "}
            <a href="/politica-cookies" style={{color:"var(--muted)"}}>Política de cookies</a>
            {" · "}
            <button type="button" className="sf-consent-link" onClick={openConsentSettings}>Configurar cookies</button>
          </p>
        </div>
        <p className="sf-copy">© {new Date().getFullYear()} Hybrid Race Hub · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

/* ─── CookieBanner ─────────────────────────────────────────────────────────── */
/* El aviso de cookies se pinta una sola vez desde pages/_app.js (components/ConsentBanner.js).
   Se mantiene este export vacío para no tocar las páginas que lo incluían. */
export function CookieBanner() {
  return null;
}
