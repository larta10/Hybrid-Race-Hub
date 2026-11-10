import { openConsentSettings } from "./consent";
import { useEffect } from "react";
import { trackPartnerClick } from "./partners";
import { FOOTER_REGIONS, FOOTER_CENTER_CITIES, FOOTER_RESOURCES, FOOTER_RANKINGS, FOOTER_PROJECT, footerMonths } from "./footer-links";

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
/* Pie (rediseño 11/2026): marca + 3 grupos de enlaces + "Dónde entrenar" + barra legal.
   En móvil los grupos son acordeones <details> nativos, cerrados; desde 640 px se abren
   (CSS ::details-content donde existe y, si no, se marca `open` al cargar). */
function FooterGroup({ id, title, links, extra }) {
  return (
    <details className="ft-col" aria-labelledby={`ft-${id}`}>
      <summary className="ft-sum"><span id={`ft-${id}`} className="ft-head">{title}</span><span className="ft-chev" aria-hidden="true" /></summary>
      <nav aria-label={`Pie de página: ${title}`}>
        <ul className="ft-list">
          {links.map(([href, label]) => {
            // Enlaces externos (proyectos amigos): pestaña nueva y evento partner_outbound_click
            const ext = /^https?:/.test(href);
            return <li key={href}>{ext
              ? <a href={href} className="ft-link" target="_blank" rel="noopener" data-partner="buscarparejahibrida" onClick={() => trackPartnerClick("footer")}>{label}</a>
              : <a href={href} className="ft-link">{label}</a>}</li>;
          })}
        </ul>
        {extra}
      </nav>
    </details>
  );
}

export function SiteFooter() {
  // Desde 640 px los grupos van siempre abiertos (en móvil son acordeones cerrados)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => document.querySelectorAll("details.ft-col").forEach(d => { d.open = mq.matches; });
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const calendar = [
    ["/calendario", "Calendario completo"],
    ...footerMonths(),
    ...FOOTER_REGIONS.map(([slug, name]) => [`/carreras-hibridas/${slug}`, `Carreras híbridas en ${name}`]),
  ];
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-grid">
          <div className="ft-brand">
            <a href="/" className="ft-logo" aria-label="Hybrid Race Hub, inicio">
              <img src="/logo-icon.svg" alt="" width="30" height="30" className="logo-light" />
              <img src="/logo-icon-light.svg" alt="" width="30" height="30" className="logo-dark" />
              <span className="ft-wordmark">Hybrid Race Hub</span>
            </a>
            <p className="ft-tagline">El calendario de carreras híbridas y de obstáculos en España: fechas comprobadas con cada organizador, dónde entrenar y qué material usar.</p>
            <ul className="ft-contact">
              <li><a href="https://www.instagram.com/hybridracehub_spain" target="_blank" rel="noopener noreferrer" className="ft-link ft-icon-link"><InstagramIcon size={16} /><span>@hybridracehub_spain</span></a></li>
              <li><a href="mailto:hola@hybridracehub.com" className="ft-link ft-icon-link"><EnvelopeIcon size={16} /><span>hola@hybridracehub.com</span></a></li>
            </ul>
          </div>
          <FooterGroup id="calendario" title="Calendario" links={calendar}
            extra={<a href="/carreras-hibridas" className="ft-link ft-more">Todas las regiones →</a>} />
          <FooterGroup id="recursos" title="Recursos" links={[...FOOTER_RESOURCES, ["/productos", "Guías de material"], ...FOOTER_RANKINGS]} />
          <FooterGroup id="proyecto" title="Proyecto" links={FOOTER_PROJECT} />
        </div>

        <nav className="ft-train" aria-label="Pie de página: dónde entrenar">
          <p className="ft-head">Dónde entrenar HYROX y OCR</p>
          <ul className="ft-cities">
            {FOOTER_CENTER_CITIES.map(([slug, name]) => <li key={slug}><a href={`/centros-entrenamiento/${slug}`} className="ft-link">Entrenar en {name}</a></li>)}
            <li><a href="/centros-entrenamiento#por-ciudad" className="ft-link ft-more">Todas las ciudades →</a></li>
          </ul>
        </nav>

        <div className="ft-bottom">
          <p className="ft-copy">© {new Date().getFullYear()} Hybrid Race Hub</p>
          <nav aria-label="Pie de página: legal">
            <ul className="ft-legal">
              <li><a href="/aviso-legal" className="ft-link">Aviso legal</a></li>
              <li><a href="/privacidad" className="ft-link">Privacidad</a></li>
              <li><a href="/politica-cookies" className="ft-link">Cookies</a></li>
              <li><button type="button" className="ft-link ft-btn" onClick={openConsentSettings}>Configurar cookies</button></li>
            </ul>
          </nav>
        </div>
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
