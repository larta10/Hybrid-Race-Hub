/* Cabecera + pie comunes para las páginas editoriales nuevas. */
import { SiteFooter, CookieBanner } from "../lib/shared";
import SiteHeader from "./SiteHeader";

export default function PageShell({ activePath, children }) {
  return (
    <>
      <SiteHeader activePath={activePath} />
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
