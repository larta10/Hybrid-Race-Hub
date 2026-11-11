/* Lista de carreras: el HTML sale del servidor (SEO) y cada tarjeta, entera, enlaza a la ficha de la carrera
   (/carreras/<slug>), que es donde están la inscripción oficial, el .ics y compartir. */
import { dateParts, modalityLabel } from "../lib/races-server";
import { raceStatus, racePrice } from "../lib/race-ui";
import { raceSlug } from "../lib/race-slug";
import { planHrefForRace } from "../lib/plan/from-race.js";

export function RaceCard({ race: r, showRegion = true, today = null }) {
  const dp = dateParts(r.fecha_iso);
  const status = raceStatus(r);
  const price = racePrice(r);
  const city = r.municipio || r.ubicacion;
  const slug = r.slug || raceSlug(r);
  // El plan solo se ofrece si la carrera no ha pasado
  const upcoming = !today || (r.fecha_iso || "") >= today;
  const place = [city, showRegion && r.comunidad && r.comunidad !== city ? r.comunidad : null].filter(Boolean).join(" · ");
  return (
    <li className="rc">
      <time className="rc-date" dateTime={r.fecha_iso}>
        <span className="rc-day">{dp?.d}</span>
        <span className="rc-mon">{dp?.m}{dp?.y && <span className="rc-year"> {dp.y}</span>}</span>
      </time>
      <div className="rc-main">
        <h3 className="rc-name"><a className="rc-open" href={`/carreras/${slug}`}>{r.nombre}</a></h3>
        {place && <p className="rc-place">{place}</p>}
        <p className="rc-tags">
          <span className="rl-tag">{modalityLabel(r)}</span>
          {price && <span className="rc-price">{price}</span>}
          <span className={`st st--${status.kind}`}>{status.label}</span>
        </p>
        {upcoming && r.fecha_iso && (
          <a className="rc-plan" href={planHrefForRace({ ...r, slug })} aria-label={`Plan de entrenamiento gratis para ${r.nombre}`}>Prepárala: plan gratis</a>
        )}
      </div>
      <span className="rc-chev" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
      </span>
    </li>
  );
}

export default function RaceList({ races, showRegion = true, compact = false, groupByYear = false, today = null }) {
  if (!races || races.length === 0) return null;
  let lastYear = null;
  const items = [];
  races.forEach((r, i) => {
    const y = (r.fecha_iso || "").slice(0, 4);
    if (groupByYear && y && y !== lastYear) items.push(<li key={`y${y}`} className="rc-year-head"><h2 id={`carreras-${y}`}>Carreras de {y}</h2></li>);
    lastYear = y;
    items.push(<RaceCard key={r.id || `${r.nombre}-${r.fecha_iso}-${i}`} race={r} showRegion={showRegion} today={today} />);
  });
  return <ol className={`rcl${compact ? " rcl--compact" : ""}`}>{items}</ol>;
}
