import Image from "next/image";
import { PODCASTS } from "../../data/podcasts";
import PodcastCard from "./PodcastCard";
import RaceList from "../RaceList";
import { raceStatus } from "../../lib/race-ui";
import { raceEndDate } from "../../lib/races-server";
import { rangoFechas } from "../../lib/dates";

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

/** Tabla de sedes (fecha, ciudad, estado de inscripción y ficha) a partir de las carreras del artículo */
function RaceTable({ races }) {
  if (!races?.length) return <p className="races-empty">Ahora mismo no hay sedes con fecha confirmada en nuestro calendario.</p>;
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Sedes y fechas">
      <table>
        <thead><tr><th>Fechas</th><th>Ciudad</th><th>Inscripción</th><th>Ficha</th></tr></thead>
        <tbody>
          {races.map(r => {
            const st = raceStatus(r);
            return (
              <tr key={r.slug || r.id}>
                <td><time dateTime={r.fecha_iso}>{rangoFechas(r.fecha_iso, raceEndDate(r))}</time></td>
                <td>{r.municipio || r.ubicacion}{r.provincia && r.provincia !== r.municipio ? ` (${r.provincia})` : ""}</td>
                <td><span className={`st st--${st.kind}`}>{st.label}</span></td>
                <td>{r.slug ? <a href={`/carreras/${r.slug}`}>{r.nombre}</a> : r.nombre}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
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
export default function ArticleBody({ html, faq, races = null, pageUrl, className = "art-content" }) {
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
          case "race-table": return <RaceTable key={i} races={races} />;
          case "races": return races?.length
            ? <RaceList key={i} races={races} pageUrl={pageUrl} compact />
            : <p key={i} className="races-empty">Ahora mismo no hay pruebas con fecha confirmada en nuestro calendario. En cuanto el organizador publique las nuevas fechas, aparecerán aquí.</p>;
          case "img": return (
            <figure key={i} className="art-figure">
              <div className="art-figure-img">
                <Image src={attrs.src} alt={attrs.alt || ""} fill quality={60} sizes="(min-width: 760px) 720px, 100vw" style={{ objectFit: "cover" }} />
              </div>
              {attrs.credit && <figcaption className="art-credit">{attrs.credit}</figcaption>}
            </figure>
          );
          default: return null;
        }
      })}
    </article>
  );
}
