/* Lista de carreras: el HTML sale del servidor (SEO) y cada tarjeta, entera, abre la ficha con las acciones. */
import { useState } from "react";
import dynamic from "next/dynamic";
import { dateParts, modalityLabel } from "../lib/races-server";
import { raceStatus, racePrice } from "../lib/race-ui";

// La ficha solo hace falta al pulsar una tarjeta: se carga aparte
const RaceDetail = dynamic(() => import("./RaceDetail"), { ssr: false });

export function RaceCard({ race: r, onOpen, showRegion = true }) {
  const dp = dateParts(r.fecha_iso);
  const status = raceStatus(r);
  const price = racePrice(r);
  const city = r.municipio || r.ubicacion;
  const place = [city, showRegion && r.comunidad && r.comunidad !== city ? r.comunidad : null].filter(Boolean).join(" · ");
  return (
    <li className="rc">
      <time className="rc-date" dateTime={r.fecha_iso}>
        <span className="rc-day">{dp?.d}</span>
        <span className="rc-mon">{dp?.m}{dp?.y && <span className="rc-year"> {dp.y}</span>}</span>
      </time>
      <div className="rc-main">
        <h3 className="rc-name"><button type="button" className="rc-open" onClick={() => onOpen(r)}>{r.nombre}</button></h3>
        {place && <p className="rc-place">{place}</p>}
        <p className="rc-tags">
          <span className="rl-tag">{modalityLabel(r)}</span>
          {price && <span className="rc-price">{price}</span>}
          {status && <span className={`st st--${status.kind}`}>{status.label}</span>}
        </p>
      </div>
      <span className="rc-chev" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
      </span>
    </li>
  );
}

export default function RaceList({ races, pageUrl, showRegion = true, compact = false, groupByYear = false }) {
  const [open, setOpen] = useState(null);
  if (!races || races.length === 0) return null;
  let lastYear = null;
  const items = [];
  races.forEach((r, i) => {
    const y = (r.fecha_iso || "").slice(0, 4);
    if (groupByYear && y && y !== lastYear) items.push(<li key={`y${y}`} className="rc-year-head"><h2 id={`carreras-${y}`}>Carreras de {y}</h2></li>);
    lastYear = y;
    items.push(<RaceCard key={r.id || `${r.nombre}-${r.fecha_iso}-${i}`} race={r} onOpen={setOpen} showRegion={showRegion} />);
  });
  return (
    <>
      <ol className={`rcl${compact ? " rcl--compact" : ""}`}>{items}</ol>
      {open && <RaceDetail race={open} pageUrl={pageUrl} onClose={() => setOpen(null)} />}
    </>
  );
}
