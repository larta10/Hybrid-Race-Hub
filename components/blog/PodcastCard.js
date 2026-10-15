import { useState } from "react";
import { spotifyShowUrl } from "../../data/podcasts";

function track(event, params) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params, page_path: window.location.pathname });
}

const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = iso => { const [y, m, d] = iso.split("-"); return `${Number(d)} ${MES[Number(m) - 1]} ${y}`; };

/**
 * Ficha de podcast con reproductor "facade": el iframe de Spotify solo se carga
 * cuando el usuario pulsa "Escuchar aquí" (no penaliza LCP ni el rendimiento móvil).
 */
export default function PodcastCard({ podcast: p, index }) {
  const [playing, setPlaying] = useState(false);
  const spotify = spotifyShowUrl(p);
  const onLink = platform => () => track("podcast_click", { platform, podcast_name: p.name });

  return (
    <section className="pod" id={p.id} aria-labelledby={`${p.id}-t`}>
      <header className="pod-head">
        <span className="pod-num" aria-hidden="true">{String(index).padStart(2, "0")}</span>
        <div className="pod-titles">
          <h3 id={`${p.id}-t`} className="pod-name">{p.name}</h3>
          <p className="pod-meta">
            <span className="pod-lang">{p.lang}</span>
            <span>{p.hosts}</span>
            <span>Último episodio: {p.lastEpisodeYear}</span>
          </p>
        </div>
      </header>

      <p className="pod-about">{p.about}</p>
      <p className="pod-for"><strong>Para quién:</strong> {p.idealFor}. Nivel: {p.level.toLowerCase()}.</p>

      <div className="pod-eps">
        <p className="pod-eps-label">Episodios para empezar</p>
        <ul>
          {p.episodes.map(e => (
            <li key={e.url}>
              <a href={e.url} target="_blank" rel="noopener" onClick={onLink("apple_episode")}>{e.title}</a>
              <span className="pod-ep-date"> · {fmt(e.date)}</span>
              <span className="pod-ep-why">{e.why}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pod-player">
        {p.spotifyId && (playing ? (
          <iframe
            title={`Reproductor de Spotify: ${p.name}`}
            src={`https://open.spotify.com/embed/show/${p.spotifyId}?utm_source=generator&theme=0`}
            width="100%" height="152" loading="lazy" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        ) : (
          <button type="button" className="pod-play" onClick={() => { setPlaying(true); track("podcast_play", { platform: "spotify", podcast_name: p.name }); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
            Escuchar aquí
          </button>
        ))}
        <div className="pod-links">
          <a href={spotify} target="_blank" rel="noopener" onClick={onLink("spotify")}>{p.spotifyId ? "Spotify" : "Buscar en Spotify"}</a>
          <a href={p.apple} target="_blank" rel="noopener" onClick={onLink("apple")}>Apple Podcasts</a>
        </div>
      </div>
    </section>
  );
}
