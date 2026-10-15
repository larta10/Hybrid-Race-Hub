import { PODCASTS } from "../../data/podcasts";
import PodcastCard from "./PodcastCard";

/** Tabla resumen de podcasts */
function PodcastTable() {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabla resumen de podcasts">
      <table>
        <thead><tr><th>Podcast</th><th>Idioma</th><th>Nivel</th><th>Ideal para</th></tr></thead>
        <tbody>
          {PODCASTS.map(p => (
            <tr key={p.id}>
              <td><a href={`#${p.id}`}>{p.name}</a></td>
              <td>{p.lang}</td>
              <td>{p.level}</td>
              <td>{p.idealFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PodcastList({ lang }) {
  const list = PODCASTS.filter(p => p.lang === lang);
  const offset = lang === "EN" ? PODCASTS.filter(p => p.lang === "ES").length : 0;
  return <div className="pod-list">{list.map((p, i) => <PodcastCard key={p.id} podcast={p} index={offset + i + 1} />)}</div>;
}

function Faq({ faq }) {
  if (!faq?.length) return null;
  return (
    <div className="faq-list">
      {faq.map((f, i) => (
        <details key={i} className="faq-item" open={i === 0}>
          <summary><h3>{f.q}</h3></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * Pinta el HTML del artículo y sustituye los marcadores <div data-block="..."></div>
 * por componentes React (tabla y fichas de podcasts, FAQ…).
 */
export default function ArticleBody({ html, faq, className = "art-content" }) {
  const parts = html.split(/(<div data-block="[a-z-]+"(?: data-[a-z]+="[^"]*")*><\/div>)/);
  return (
    <article className={className}>
      {parts.map((part, i) => {
        const m = part.match(/^<div data-block="([a-z-]+)"((?: data-[a-z]+="[^"]*")*)><\/div>$/);
        if (!m) return part.trim() ? <div key={i} className="art-html" dangerouslySetInnerHTML={{ __html: part }} /> : null;
        const attrs = Object.fromEntries([...m[2].matchAll(/data-([a-z]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
        switch (m[1]) {
          case "podcast-table": return <PodcastTable key={i} />;
          case "podcasts": return <PodcastList key={i} lang={attrs.lang} />;
          case "faq": return <Faq key={i} faq={faq} />;
          default: return null;
        }
      })}
    </article>
  );
}
