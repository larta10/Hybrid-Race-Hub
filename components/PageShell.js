/* Cabecera + pie comunes para las páginas editoriales nuevas. */
import Image from "next/image";
import { SiteNav, SiteFooter, CookieBanner } from "../lib/shared";

export default function PageShell({ activePath, children }) {
  return (
    <>
      <header className="hero page-shell-head">
        <div className="hero-inner">
          <div className="brand">
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
              <Image src="/logo-icon.svg" className="brand-logo-img" alt="" width={40} height={40} priority />
              <div>
                <div className="brand-name">Hybrid Race Hub</div>
                <div className="brand-sub"><span>OCR · HYROX · Functional</span></div>
              </div>
            </a>
          </div>
          <SiteNav activePath={activePath} />
        </div>
      </header>
      <main id="contenido">{children}</main>
      <SiteFooter />
      <CookieBanner />
    </>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Migas de pan">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="crumbs-sep" aria-hidden="true">/</span>}
          {it.href ? <a href={it.href}>{it.name}</a> : <span aria-current="page">{it.name}</span>}
        </span>
      ))}
    </nav>
  );
}
