/* Cabecera única: 56px, fija arriba, logo + buscador desplegable + menú a pantalla completa. */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MAIN = [
  { href: "/calendario", label: "Calendario" },
  { href: "/centros-entrenamiento", label: "Centros" },
  { href: "/que-es-una-carrera-hibrida", label: "Guía" },
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Rankings" },
];
const REGIONS = [
  ["madrid", "Madrid"], ["cataluna", "Cataluña"], ["andalucia", "Andalucía"], ["comunidad-valenciana", "C. Valenciana"],
  ["canarias", "Canarias"], ["galicia", "Galicia"], ["baleares", "Baleares"], ["bilbao", "Bilbao"],
];
const MORE = [
  { href: "/plan-entrenamiento", label: "Plan de entrenamiento" },
  { href: "/calculadora-hyrox", label: "Calculadora HYROX" },
  { href: "/contacto-organizadores", label: "Publicar una carrera" },
];

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

// Modo claro/oscuro: por defecto el del sistema; la elección se guarda en este navegador
function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("hrh_theme", next); } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "dark" ? "#121416" : "#F5F4F0");
}

export default function SiteHeader({ activePath }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = e => { if (e.key === "Escape") { setMenu(false); setSearch(false); } };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [menu]);
  useEffect(() => { if (search) inputRef.current?.focus(); }, [search]);

  const isActive = href => activePath === href || (href !== "/" && activePath?.startsWith(href));

  return (
    <header className="sh">
      <div className="sh-inner">
        <a href="/" className="sh-brand" aria-label="Hybrid Race Hub, inicio">
          <Image src="/logo-icon.svg" alt="" width={30} height={30} priority className="logo-light" />
          <Image src="/logo-icon-light.svg" alt="" width={30} height={30} className="logo-dark" />
          <span className="sh-name">Hybrid Race Hub</span>
        </a>
        <nav className="sh-nav" aria-label="Navegación principal">
          {MAIN.map(l => <a key={l.href} href={l.href} className={isActive(l.href) ? "is-active" : undefined}>{l.label}</a>)}
        </nav>
        <div className="sh-actions">
          <button type="button" className="sh-icon sh-theme" aria-label="Cambiar entre modo claro y oscuro" onClick={toggleTheme}>
            <svg className="icon-moon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <svg className="icon-sun" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          </button>
          <button type="button" className="sh-icon" aria-label="Buscar carreras" aria-expanded={search} onClick={() => setSearch(s => !s)}>
            {search ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button type="button" className="sh-icon sh-menu-btn" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(true)}>
            <MenuIcon />
          </button>
        </div>
      </div>

      {search && (
        <form className="sh-search" action="/calendario" method="get" role="search">
          <label htmlFor="sh-q" className="sr-only">Buscar en el calendario</label>
          <input id="sh-q" ref={inputRef} type="search" name="q" inputMode="search" enterKeyHint="search" autoComplete="off"
            placeholder="Carrera, ciudad o modalidad" />
          <button type="submit" className="btn-solid">Buscar</button>
        </form>
      )}

      {menu && (
        <div className="sh-sheet" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="sh-sheet-top">
            <span className="sh-name">Menú</span>
            <button type="button" className="sh-icon" aria-label="Cerrar menú" onClick={() => setMenu(false)}><CloseIcon /></button>
          </div>
          <nav className="sh-sheet-nav" aria-label="Menú móvil">
            {MAIN.map(l => <a key={l.href} href={l.href} className={isActive(l.href) ? "is-active" : undefined}>{l.label}</a>)}
          </nav>
          <p className="sh-sheet-label">Carreras por zona</p>
          <ul className="sh-sheet-regions">
            {REGIONS.map(([slug, name]) => <li key={slug}><a href={`/carreras-hibridas/${slug}`}>{name}</a></li>)}
          </ul>
          <ul className="sh-sheet-more">
            {MORE.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </div>
      )}
    </header>
  );
}
