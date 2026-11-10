import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C } from "../theme.js";

// Tratamiento de color común: ligera desaturación, contraste alto, viñeta y capa oscura.
// Igual para todos los clips, para que todos los Reels parezcan de la misma marca.
const FILTRO = "saturate(0.72) contrast(1.18) brightness(0.94)";

function Capas({ oscuro = 0.4 }) {
  return (
    <>
      <AbsoluteFill style={{ background: `rgba(11, 12, 15, ${oscuro})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.62) 100%)" }} />
      {/* Degradados arriba y abajo para que el texto y los botones de Instagram se lean */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,12,15,0.55) 0%, rgba(11,12,15,0) 18%, rgba(11,12,15,0) 55%, rgba(11,12,15,0.7) 100%)" }} />
    </>
  );
}

/** Clip real de stock (Pixabay), recortado a 9:16 alrededor del atleta, con un leve acercamiento */
export function Clip({ src, inicio = 0, recorte = {}, duracion, oscuro = 0.4, desenfoque = 0, ritmo = 1, punch = 1, entrada = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // punch: acercamiento fijo del plano (1,1 = punch-in del 10 %); entrada: transición corta de zoom (fotogramas)
  const trans = entrada ? interpolate(frame, [0, entrada], [1.07, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) }) : 1;
  const zoom = (recorte.zoom || 1) * punch * trans * interpolate(frame, [0, duracion || 90], [1, 1.05], { extrapolateRight: "clamp" });
  const cx = recorte.centro_x ?? 0.5;
  const cy = recorte.centro_y ?? 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: C.tinta, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={Math.round(inicio * fps)}
        playbackRate={ritmo}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${cx * 100}% ${cy * 100}%`,
          transform: `scale(${zoom})`,
          transformOrigin: `${cx * 100}% ${cy * 100}%`,
          filter: `${FILTRO}${desenfoque ? ` blur(${desenfoque}px)` : ""}`,
        }}
      />
      <Capas oscuro={oscuro} />
    </AbsoluteFill>
  );
}

/**
 * Fondo de reserva cuando no hay un clip revisado: luz difusa en movimiento lento y grano.
 * Sin personas ni siluetas: el humano solo aparece en vídeo real.
 */
export function FondoAbstracto({ semilla = 0 }) {
  const frame = useCurrentFrame();
  const a = (semilla * 137) % 360;
  const x1 = 30 + 18 * Math.sin((frame / 160) + a);
  const y1 = 30 + 12 * Math.cos((frame / 190) + a);
  const x2 = 70 + 15 * Math.cos((frame / 210) + a);
  const y2 = 72 + 10 * Math.sin((frame / 170) + a);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E1014", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at ${x1}% ${y1}%, rgba(107,140,174,0.30) 0%, rgba(107,140,174,0) 42%)`,
            `radial-gradient(circle at ${x2}% ${y2}%, rgba(107,140,174,0.16) 0%, rgba(107,140,174,0) 38%)`,
            `radial-gradient(circle at 85% 12%, rgba(251,146,60,0.06) 0%, rgba(251,146,60,0) 30%)`,
          ].join(","),
        }}
      />
      {/* Líneas de luz muy tenues, como focos de un pabellón desenfocados */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(115deg, rgba(242,240,235,0.018) 0px, rgba(242,240,235,0.018) 2px, transparent 2px, transparent 140px)", transform: `translateX(${(frame * 0.4) % 140}px)` }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id={`grano-${semilla}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2) % 50} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grano-${semilla})`} />
      </svg>
      <Capas oscuro={0.15} />
    </AbsoluteFill>
  );
}

/**
 * Planos de una escena: corta cada ~2 s (entre 1,5 y 2,5 s). Alterna los clips de la escena (clip + cortes) y,
 * cuando repite clip, sigue desde donde iba con un punch-in del 10 %. Cada corte entra con un zoom de 5 fotogramas.
 * srcs: [{src, seg}] con seg = segundos útiles del recorte (para no ir nunca más rápido que el original).
 */
export const PLANO_S = 2.1;
export function planos(dur, n) {
  const fps = 30;
  const k = Math.max(1, Math.min(Math.floor(dur / (1.5 * fps)) || 1, Math.round(dur / (PLANO_S * fps)) || 1));
  const cortes = Array.from({ length: k + 1 }, (_, j) => Math.round((dur * j) / k));
  const usado = new Array(n).fill(0);
  const vez = new Array(n).fill(0);
  return cortes.slice(0, -1).map((desde, j) => {
    const c = j % n;
    const p = { desde, hasta: cortes[j + 1], clip: c, inicio: usado[c], punch: vez[c] % 2 ? 1.1 : 1, entrada: j ? 5 : 0 };
    usado[c] += (cortes[j + 1] - desde) / fps;
    vez[c]++;
    return p;
  });
}

export function Planos({ srcs, duracion, semilla, oscuro, desenfoque, sinCortes = false }) {
  // sinCortes: escenas con anillos de músculo colocados a mano sobre el clip (un corte o un punch-in los movería)
  const lista = React.useMemo(() => (sinCortes ? [{ desde: 0, hasta: duracion, clip: 0, inicio: 0, punch: 1, entrada: 0 }] : planos(duracion, srcs.length)), [duracion, srcs.length, sinCortes]);
  if (!srcs.length) return <FondoAbstracto semilla={semilla} />;
  return (
    <AbsoluteFill>
      {lista.map((p, k) => {
        const s = srcs[p.clip];
        // Si el tramo del clip se queda corto, va algo más lento (nunca más rápido)
        const necesita = lista.filter((q) => q.clip === p.clip).reduce((a, q) => a + (q.hasta - q.desde) / 30, 0);
        const ritmo = s.seg ? Math.min(1, s.seg / necesita) : 1;
        return (
          <Sequence key={k} from={p.desde} durationInFrames={p.hasta - p.desde} layout="none">
            <Clip src={s.src} inicio={p.inicio * ritmo} duracion={p.hasta - p.desde} oscuro={oscuro} desenfoque={desenfoque} ritmo={ritmo} punch={p.punch} entrada={p.entrada} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

/** src: copia vertical 1080x1920 ya recortada al tramo usado (ver scripts/lib/clips.mjs) */
export function Fondo({ src, duracion, semilla, oscuro, desenfoque, clipSeg }) {
  // Si la escena dura más que el clip recortado (por la voz), el clip va algo más lento, nunca más rápido
  const ritmo = clipSeg && duracion ? Math.min(1, clipSeg / (duracion / 30)) : 1;
  if (src) return <Clip src={src} inicio={0} duracion={duracion} oscuro={oscuro} desenfoque={desenfoque} ritmo={ritmo} />;
  return <FondoAbstracto semilla={semilla} />;
}
