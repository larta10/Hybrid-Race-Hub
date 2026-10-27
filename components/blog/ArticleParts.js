import { useState } from "react";
import Link from "next/link";
import { PostCard } from "./BlogListing";

function track(event, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params, page_path: window.location.pathname });
}

/** Índice: desplegable en móvil y tablet, lateral fijo (sticky) a partir de 1280 px. */
export function Toc({ toc, variant }) {
  if (!toc?.length || toc.length < 3) return null;
  const list = (
    <ol className="toc-list">
      {toc.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} onClick={() => track("toc_click", { section: t.text.slice(0, 80), position: i + 1 })}>{t.text}</a>
        </li>
      ))}
    </ol>
  );
  if (variant === "side") {
    return (
      <nav className="toc toc--side" aria-label="Índice del artículo">
        <p className="toc-title">En este artículo</p>
        {list}
      </nav>
    );
  }
  return (
    <details className="toc toc--inline">
      <summary>Índice del artículo</summary>
      <nav aria-label="Índice del artículo">{list}</nav>
    </details>
  );
}

/** Compartir sin scripts de terceros: solo enlaces y portapapeles. */
export function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} ${url}`;
  const copy = async () => {
    track("share_click", { network: "copy_link" });
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <div className="share" role="group" aria-label="Compartir">
      <span className="share-label">Compartir</span>
      <a className="share-btn" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"
        onClick={() => track("share_click", { network: "whatsapp" })}>WhatsApp</a>
      <a className="share-btn" href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"
        onClick={() => track("share_click", { network: "x" })}>X</a>
      <button type="button" className="share-btn" onClick={copy}>{copied ? "Enlace copiado" : "Copiar enlace"}</button>
    </div>
  );
}

export function AuthorBox() {
  return (
    <aside className="author-box" aria-label="Sobre el autor">
      <p className="author-box-label">Quién escribe</p>
      <p className="author-box-name"><Link href="/sobre-nosotros">Equipo de Hybrid Race Hub</Link></p>
      <p className="author-box-text">
        Atletas que compiten en HYROX y carreras de obstáculos en España. Revisamos cada dato con las webs oficiales de los organizadores
        y actualizamos los artículos cuando cambian el reglamento, las fechas o el material.
        Si ves un error, escríbenos a <a href="mailto:hola@hybridracehub.com">hola@hybridracehub.com</a>.
      </p>
    </aside>
  );
}

const CTAS = {
  Material: { title: "Compara antes de comprar", text: "Nuestros rankings comparan zapatillas, relojes, pulsómetros y ropa para HYROX y OCR, con pros y contras de cada modelo.", href: "/productos", cta: "Ver los rankings de material" },
  Entrenamiento: { title: "Calcula tu tiempo de HYROX", text: "Mete tus tiempos de carrera y estaciones y mira dónde estás perdiendo minutos.", href: "/calculadora-hyrox", cta: "Abrir la calculadora HYROX" },
  Carreras: { title: "Elige fecha y ciudad", text: "Todas las carreras híbridas en España con fecha confirmada y enlace a la web oficial.", href: "/calendario", cta: "Ver el calendario" },
  Guías: { title: "¿Lista tu primera carrera?", text: "Busca una HYROX, DEKA, Spartan u OCR cerca de ti en el calendario de carreras híbridas.", href: "/calendario", cta: "Ver el calendario" },
  Podcasts: { title: "De los auriculares a la línea de salida", text: "Cuando tengas claro qué carrera quieres, búscala en el calendario con fecha y ciudad.", href: "/calendario", cta: "Ver el calendario" },
};

export function ArticleCta({ category }) {
  const c = CTAS[category] || CTAS.Guías;
  return (
    <aside className="art-cta">
      <p className="art-cta-title">{c.title}</p>
      <p className="art-cta-text">{c.text}</p>
      <Link href={c.href} className="btn-solid" onClick={() => track("cta_click", { cta: c.href })}>{c.cta}</Link>
    </aside>
  );
}

export function RelatedPosts({ related }) {
  if (!related?.length) return null;
  return (
    <section className="related" aria-labelledby="relacionados">
      <h2 id="relacionados" className="section-title">Sigue leyendo</h2>
      <div className="blog-grid" onClick={e => {
        const a = e.target.closest("a[href^='/blog/']");
        if (a) track("related_click", { target: a.getAttribute("href") });
      }}>
        {related.map(p => <PostCard key={p.slug} post={p} />)}
      </div>
    </section>
  );
}

/* Enlazado fijo al final de cada artículo: calendario, zonas con más carreras y un ranking del tema. */
const RANKING_BY_CATEGORY = {
  Material: { href: "/productos/zapatillas-hyrox", label: "Ranking de zapatillas para HYROX" },
  Entrenamiento: { href: "/productos/relojes", label: "Ranking de relojes GPS para entrenar" },
  Carreras: { href: "/productos/zapatillas-trail", label: "Ranking de zapatillas de trail para OCR" },
  Podcasts: { href: "/productos/pulsometros", label: "Ranking de pulsómetros" },
};
export function ArticleNextSteps({ category }) {
  const ranking = RANKING_BY_CATEGORY[category] || { href: "/productos/zapatillas-hyrox", label: "Ranking de zapatillas para HYROX" };
  return (
    <nav className="art-next" aria-label="Siguientes pasos">
      <p className="art-next-title">Busca tu carrera y prepárala</p>
      <ul>
        <li><Link href="/calendario">Calendario de carreras híbridas en España</Link></li>
        <li><Link href="/carreras-hibridas/madrid">Carreras híbridas en Madrid</Link></li>
        <li><Link href="/carreras-hibridas/cataluna">Carreras híbridas en Cataluña</Link></li>
        <li><Link href="/carreras-hibridas/andalucia">Carreras híbridas en Andalucía</Link></li>
        <li><Link href={ranking.href}>{ranking.label}</Link></li>
      </ul>
    </nav>
  );
}
