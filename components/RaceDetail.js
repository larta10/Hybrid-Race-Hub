/* Ficha de carrera: hoja inferior en móvil (ventana centrada en escritorio) con barra fija de acciones. */
import { useEffect, useRef, useState } from "react";
import { dateParts, modalityLabel } from "../lib/races-server";
import { downloadIcs, onOrganizerClick } from "../lib/race-actions";
import { guideFor } from "../lib/race-links";
import { raceStatus, racePrice } from "../lib/race-ui";

function track(event, params) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export default function RaceDetail({ race, pageUrl, onClose }) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const dp = dateParts(race.fecha_iso);
  const status = raceStatus(race);
  const price = racePrice(race);
  const place = [race.ubicacion || race.municipio, race.comunidad].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" · ");
  const guide = guideFor(race);
  const url = pageUrl || (typeof window !== "undefined" ? window.location.href : "");

  async function share() {
    const text = `${race.nombre} · ${dp?.long || ""}`;
    track("race_share", { race_name: race.nombre });
    try {
      if (navigator.share) { await navigator.share({ title: race.nombre, text, url: race.url || url }); return; }
    } catch { return; }
    try { await navigator.clipboard.writeText(`${text} ${race.url || url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }

  return (
    <div className="rd-backdrop" onClick={onClose}>
      <div className="rd" role="dialog" aria-modal="true" aria-labelledby="rd-title" onClick={e => e.stopPropagation()}>
        <div className="rd-head">
          <span className="rd-grip" aria-hidden="true" />
          <button ref={closeRef} type="button" className="rd-close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="rd-body">
          <p className="rd-meta"><span className="rl-tag">{modalityLabel(race)}</span>{status && <span className={`st st--${status.kind}`}>{status.label}</span>}</p>
          <h2 id="rd-title" className="rd-title">{race.nombre}</h2>
          <dl className="rd-facts">
            <div><dt>Fecha</dt><dd><time dateTime={race.fecha_iso}>{dp?.long}</time></dd></div>
            {place && <div><dt>Lugar</dt><dd>{place}</dd></div>}
            {race.distancia && <div><dt>Distancia</dt><dd>{race.distancia}</dd></div>}
            {race.formato && <div><dt>Formato</dt><dd>{race.formato}</dd></div>}
            {price && <div><dt>Precio</dt><dd>{price}</dd></div>}
          </dl>
          {race.notas && <p className="rd-notes">{race.notas}</p>}
          {guide && <p className="rd-guide"><a href={guide.href}>{guide.label}: formato y cómo prepararla</a></p>}
          <p className="rd-small">Fecha, precio y plazas los publica el organizador: confírmalos en su web antes de pagar.</p>
        </div>
        <div className="rd-bar">
          {race.url
            ? <a className="btn-solid rd-main" href={race.url} target="_blank" rel="nofollow noopener noreferrer" onClick={() => onOrganizerClick(race)}>Inscribirme</a>
            : <span className="rd-main rd-main--off">Sin web oficial</span>}
          {race.fecha_iso && <button type="button" className="btn-line" onClick={() => downloadIcs(race, url)}>Añadir al calendario</button>}
          <button type="button" className="btn-line" onClick={share}>{copied ? "Enlace copiado" : "Compartir"}</button>
        </div>
      </div>
    </div>
  );
}
