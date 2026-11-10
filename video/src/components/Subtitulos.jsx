import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, F, SAFE, H } from "../theme.js";

/**
 * Subtítulos palabra a palabra a partir de words.json (alineación por frase, ver video/scripts/narrar.py).
 * - Bloques de 1-3 palabras (máx. 16 caracteres) que nunca cruzan de una frase a otra.
 * - El bloque cambia exactamente cuando empieza a sonar la primera palabra del siguiente; ninguno sigue en
 *   pantalla después de que acabe su frase.
 * - La palabra que suena pasa de blanco hueso al acento sobrio (C.acento) con un pequeño "pop" (spring de 4
 *   fotogramas); las demás quedan al 85 % de opacidad. Las *palabras clave* del guion salen más grandes.
 */
export const MAX_PALABRAS = 3;
export const MAX_CARACTERES = 16;
const limpia = (w) => w.replace(/\*/g, "");
const clave = (w) => /\*/.test(w);

/** Agrupa las palabras en bloques cortos, sin cruzar frases y cortando en la puntuación */
export function bloques(palabras) {
  const out = [];
  let cur = [];
  const grupo = (p) => (p.frase !== undefined ? `f${p.frase}` : `s${p.seg}`);
  const cerrar = () => cur.length && (out.push(cur), (cur = []));
  palabras.forEach((p, i) => {
    if (cur.length && grupo(cur[0]) !== grupo(p)) cerrar();
    const largo = cur.reduce((a, x) => a + limpia(x.w).length + 1, 0) + limpia(p.w).length;
    if (cur.length >= MAX_PALABRAS || (cur.length && largo > MAX_CARACTERES)) cerrar();
    cur.push({ ...p, i });
    if (/[.,;:?!…]\*?$/.test(p.w)) cerrar();
  });
  cerrar();
  return out;
}

/** Fin de cada frase (para no dejar un bloque en pantalla cuando la frase ya ha terminado) */
function finesDeFrase(palabras, frases) {
  const fin = {};
  if (frases?.length) frases.forEach((f, k) => (fin[`f${k}`] = f.hasta));
  for (const p of palabras) {
    const g = p.frase !== undefined ? `f${p.frase}` : `s${p.seg}`;
    if (fin[g] === undefined || (!frases?.length && p.hasta > fin[g])) fin[g] = Math.max(fin[g] ?? 0, p.hasta);
  }
  return fin;
}

/**
 * posicionY(t) decide la altura (fracción de la pantalla) en cada momento para no tapar gráficas,
 * tarjetas, monigote ni anillos de músculo. Por defecto, al 65 %.
 */
export function Subtitulos({ palabras, frases, posicionY }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bs = React.useMemo(() => bloques(palabras), [palabras]);
  const fin = React.useMemo(() => finesDeFrase(palabras, frases), [palabras, frases]);
  const idx = bs.findIndex((b, k) => {
    const g = b[0].frase !== undefined ? `f${b[0].frase}` : `s${b[0].seg}`;
    const hasta = Math.min(bs[k + 1] ? bs[k + 1][0].desde : Infinity, fin[g] ?? b[b.length - 1].hasta);
    return t >= b[0].desde && t < hasta;
  });
  if (idx < 0) return null;
  const b = bs[idx];
  const fy = posicionY ? posicionY(t) : 0.65;
  if (fy == null) return null;
  const y = fy * H;
  const largo = b.reduce((a, x) => a + limpia(x.w).length + 1, 0);
  const size = largo > 13 ? 76 : 86;
  // Palabra activa: la última que ha empezado a sonar dentro del bloque
  const activa = b.reduce((acc, x, j) => (t >= x.desde ? j : acc), 0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: y,
          transform: "translateY(-50%)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "center",
          columnGap: size * 0.32,
          fontFamily: F.titular,
          fontWeight: 800,
          lineHeight: 1.05,
          textTransform: "uppercase",
          textShadow: "0 0 3px rgba(0,0,0,0.9), 0 3px 14px rgba(0,0,0,0.75)",
          WebkitTextStroke: "1.5px rgba(11,12,15,0.55)",
          textAlign: "center",
        }}
      >
        {b.map((p, k) => {
          const on = k === activa;
          const f0 = Math.round(p.desde * fps);
          // Pop: entra al 114 % y se asienta en el 104 % en 4 fotogramas
          const pop = on ? spring({ frame: frame - f0, fps, durationInFrames: 4, config: { damping: 14, stiffness: 320, mass: 0.5 } }) : 1;
          const escala = on ? 1.14 - 0.1 * pop : 1;
          return (
            <span
              key={p.i}
              style={{
                display: "inline-block",
                fontSize: clave(p.w) ? size * 1.22 : size,
                color: on ? C.acento : C.hueso,
                opacity: on ? 1 : 0.85,
                transform: `scale(${escala})`,
              }}
            >
              {limpia(p.w)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
