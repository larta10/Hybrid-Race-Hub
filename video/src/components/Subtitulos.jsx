import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, F, SAFE, H } from "../theme.js";

/**
 * Subtítulos palabra a palabra a partir de words.json (tiempos de Whisper alineados con el texto
 * original). Líneas de 2-4 palabras en Barlow Condensed ExtraBold; la palabra que suena se resalta
 * (escala 1,08 y subrayado naranja: el naranja solo aquí).
 */
const MAX_PALABRAS = 4;
const MAX_CARACTERES = 20;

/** Agrupa las palabras en líneas cortas sin cruzar de una escena a otra y cortando en la puntuación */
export function lineas(palabras) {
  const out = [];
  let cur = [];
  const cerrar = () => cur.length && (out.push(cur), (cur = []));
  palabras.forEach((p, i) => {
    if (cur.length && cur[0].seg !== p.seg) cerrar();
    const largo = cur.reduce((a, x) => a + x.w.length + 1, 0) + p.w.length;
    if (cur.length >= MAX_PALABRAS || (cur.length >= 2 && largo > MAX_CARACTERES)) cerrar();
    cur.push({ ...p, i });
    if (/[.,;:?!…]$/.test(p.w) && cur.length >= 2) cerrar();
  });
  cerrar();
  // Una línea de una sola palabra se une a la anterior si caben
  return out.reduce((acc, l) => {
    const prev = acc[acc.length - 1];
    if (l.length === 1 && prev && prev[0].seg === l[0].seg && prev.length < MAX_PALABRAS) prev.push(...l);
    else acc.push(l);
    return acc;
  }, []);
}

/**
 * posicionY(t) decide la altura (fracción de la pantalla) en cada momento para no tapar gráficas,
 * tarjetas ni anillos de músculo. Por defecto, entre el 58 % y el 72 % (centro en el 65 %).
 */
export function Subtitulos({ palabras, posicionY }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ls = React.useMemo(() => lineas(palabras), [palabras]);
  const idx = ls.findIndex((l, k) => t >= l[0].desde - 0.05 && t < (ls[k + 1] ? Math.min(ls[k + 1][0].desde - 0.05, l[l.length - 1].hasta + 0.6) : l[l.length - 1].hasta + 0.6));
  if (idx < 0) return null;
  const l = ls[idx];
  const entra = interpolate(t, [l[0].desde - 0.05, l[0].desde + 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = (posicionY ? posicionY(t) : 0.65) * H;
  const size = l.reduce((a, x) => a + x.w.length + 1, 0) > 16 ? 74 : 82;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: y,
          transform: `translateY(-50%) translateY(${(1 - entra) * 10}px)`,
          opacity: entra,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: size * 0.36,
          fontFamily: F.titular,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.05,
          textTransform: "uppercase",
          color: C.hueso,
          textShadow: "0 0 3px rgba(0,0,0,0.9), 0 3px 14px rgba(0,0,0,0.75)",
          WebkitTextStroke: "1.5px rgba(11,12,15,0.55)",
          textAlign: "center",
        }}
      >
        {l.map((p) => {
          const activa = t >= p.desde - 0.02 && t < Math.max(p.hasta, p.desde + 0.12);
          return (
            <span key={p.i} style={{ display: "inline-block", position: "relative", transform: `scale(${activa ? 1.08 : 1})`, transition: "none" }}>
              {p.w.replace(/[¿¡]/g, (m) => m)}
              <span
                style={{
                  position: "absolute",
                  left: "4%",
                  right: "4%",
                  bottom: -6,
                  height: 7,
                  borderRadius: 4,
                  background: C.naranja,
                  opacity: activa ? 1 : 0,
                }}
              />
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
