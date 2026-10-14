/* Lista editorial de carreras (render en servidor). Datos reales de Supabase. */
import { dateParts, modalityLabel } from "../lib/races-server";
import { downloadIcs, whatsappUrl, onWhatsappShare } from "../lib/race-actions";

export default function RaceList({ races, pageUrl, showRegion = true, compact = false }) {
  if (!races || races.length === 0) return null;
  return (
    <ol className={`rl${compact ? " rl--compact" : ""}`}>
      {races.map(r => {
        const dp = dateParts(r.fecha_iso);
        const place = [r.ubicacion || r.municipio, showRegion && r.comunidad && !String(r.ubicacion || "").includes(r.comunidad) ? r.comunidad : null].filter(Boolean).join(" · ");
        return (
          <li key={r.id || `${r.nombre}-${r.fecha_iso}`} className="rl-item">
            <time className="rl-date" dateTime={r.fecha_iso}>
              <span className="rl-day">{dp?.d}</span>
              <span className="rl-mon">{dp?.m} {dp?.y}</span>
            </time>
            <div className="rl-main">
              <span className="rl-tag">{modalityLabel(r)}</span>
              <h3 className="rl-name">{r.nombre}</h3>
              {place && <p className="rl-place">{place}</p>}
              <p className="rl-meta">
                {[r.formato, r.distancia, r.precio].filter(Boolean).join(" · ") || "Formato y precio: consulta la web oficial"}
              </p>
            </div>
            <div className="rl-actions">
              {r.url
                ? <a className="rl-btn rl-btn--main" href={r.url} target="_blank" rel="nofollow noopener noreferrer">Web oficial</a>
                : <span className="rl-btn rl-btn--off">Sin web oficial</span>}
              <button type="button" className="rl-btn" onClick={() => downloadIcs(r, pageUrl)}>Añadir a mi calendario</button>
              <a className="rl-btn" href={whatsappUrl(r, pageUrl)} target="_blank" rel="noopener noreferrer" onClick={() => onWhatsappShare(r)}>Compartir por WhatsApp</a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
