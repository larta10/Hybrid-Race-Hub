import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, F, SAFE, SPRING, palabras } from "../theme.js";

const SOMBRA = "0 2px 18px rgba(0,0,0,0.55)";

/** Palabra que entra desde abajo dentro de una máscara (sin rebote) */
function Palabra({ w, sufijo, destacado, retraso, size, peso = 800 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - retraso, fps, config: SPRING, durationInFrames: 14 });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08, marginBottom: -size * 0.08, verticalAlign: "top" }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 105}%)`,
          opacity: interpolate(p, [0, 0.4, 1], [0, 1, 1]),
          color: destacado ? C.naranja : C.hueso,
          fontWeight: peso,
        }}
      >
        {w}
        {sufijo && <span style={{ color: C.hueso }}>{sufijo}</span>}
      </span>
    </span>
  );
}

/** Tamaño que hace caber la palabra más larga en el ancho seguro */
function tamano(texto, max, factor = 0.5) {
  const larga = Math.max(...palabras(texto).map((p) => p.w.length), 4);
  return Math.min(max, Math.floor(SAFE.width / (larga * factor)));
}

/** Gancho (0-2 s): titular enorme palabra a palabra sobre el clip más potente */
export function Gancho({ texto, duracion }) {
  const frame = useCurrentFrame();
  const ws = palabras(texto.toUpperCase());
  const size = tamano(texto, 168, 0.52);
  const paso = Math.max(2, Math.min(5, Math.floor(20 / ws.length)));
  const salida = interpolate(frame, [duracion - 5, duracion], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: SAFE.top + 260,
          fontFamily: F.titular,
          fontSize: size,
          lineHeight: 0.92,
          letterSpacing: -1,
          textShadow: SOMBRA,
          opacity: salida,
          display: "flex",
          flexWrap: "wrap",
          columnGap: size * 0.22,
        }}
      >
        {ws.map((p, i) => (
          <Palabra key={i} {...p} retraso={i * paso} size={size} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

/**
 * TextoCinetico: una frase corta por pantalla (máx. 7 palabras), en el tercio inferior
 * de la zona segura para no tapar al atleta. Entra palabra a palabra y sale con un fundido.
 */
export function TextoCinetico({ texto, duracion, posicion = "abajo" }) {
  const frame = useCurrentFrame();
  const ws = palabras(texto.toUpperCase());
  const size = tamano(texto, 104, 0.5);
  const salida = interpolate(frame, [duracion - 5, duracion], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pos = posicion === "arriba" ? { top: SAFE.top + 120 } : { bottom: 1920 - SAFE.bottom + 70 };
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          ...pos,
          fontFamily: F.titular,
          fontSize: size,
          lineHeight: 0.98,
          textShadow: SOMBRA,
          opacity: salida,
          transform: `translateY(${(1 - salida) * -16}px)`,
          display: "flex",
          flexWrap: "wrap",
          columnGap: size * 0.22,
        }}
      >
        {ws.map((p, i) => (
          <Palabra key={i} {...p} retraso={i * 2} size={size} peso={700} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** Chip discreto de fuente: "Fuente: Autor et al., año, Revista" */
export function FuenteChip({ texto, top }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        maxWidth: SAFE.width,
        top: top ?? SAFE.top + 40,
        opacity: o,
        fontFamily: F.texto,
        fontWeight: 500,
        fontSize: 27,
        color: C.hueso,
        background: "rgba(11,12,15,0.72)",
        border: `1px solid ${C.linea}`,
        borderRadius: 999,
        padding: "10px 22px",
      }}
    >
      Fuente: {texto}
    </div>
  );
}

/** Barra de progreso fina arriba y marca discreta */
export function Marca({ progreso, mostrarMarca = true }) {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 34, left: 40, right: 40, height: 5, borderRadius: 3, background: "rgba(242,240,235,0.16)" }}>
        <div style={{ width: `${progreso * 100}%`, height: "100%", borderRadius: 3, background: C.hueso, opacity: 0.85 }} />
      </div>
      {mostrarMarca && (
        <div style={{ position: "absolute", top: SAFE.top - 6, left: SAFE.left, fontFamily: F.titular, fontWeight: 600, fontSize: 28, letterSpacing: 7, color: C.hueso, opacity: 0.72 }}>
          HYBRID RACE HUB
        </div>
      )}
    </AbsoluteFill>
  );
}
