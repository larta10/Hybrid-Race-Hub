import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, F, SAFE, SPRING, partes, easeOut, clamp01 } from "../theme.js";

function Destacado({ texto }) {
  return partes(texto).map((p, i) => (
    <span key={i} style={{ color: p.destacado ? C.naranja : "inherit" }}>
      {p.t}
    </span>
  ));
}

/** Conclusión: bloque oscuro de 2 líneas que se abre de izquierda a derecha */
export function Conclusion({ lineas, duracion }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abre = easeOut(clamp01(frame / 12));
  const salida = interpolate(frame, [duracion - 5, duracion], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Tamaño según la palabra más larga: las líneas pueden partirse, las palabras no
  const larga = Math.max(6, ...lineas.flatMap((l) => l.replace(/\*/g, "").split(/\s+/)).map((w) => w.length));
  const size = Math.min(132, Math.floor((SAFE.width - 96) / (larga * 0.52)));
  return (
    <AbsoluteFill style={{ justifyContent: "center", opacity: salida }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left - 24,
          width: SAFE.width + 48,
          top: 700,
          padding: "56px 48px",
          background: "rgba(11,12,15,0.9)",
          borderLeft: `8px solid ${C.acero}`,
          clipPath: `inset(0 ${(1 - abre) * 100}% 0 0)`,
        }}
      >
        {lineas.map((l, i) => {
          const p = spring({ frame: frame - 8 - i * 5, fps, config: SPRING, durationInFrames: 16 });
          return (
            <div key={i} style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontFamily: F.titular,
                  fontWeight: 800,
                  fontSize: size,
                  lineHeight: 1.0,
                  color: C.hueso,
                  textTransform: "uppercase",
                  transform: `translateY(${(1 - p) * 100}%)`,
                }}
              >
                <Destacado texto={l} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** "Qué hacer": 3 puntos rápidos que entran uno detrás de otro */
export function Aplicacion({ puntos, duracion }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = Math.floor((duracion - 20) / 3);
  const salida = interpolate(frame, [duracion - 5, duracion], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: salida }}>
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.width, top: 520 }}>
        <div style={{ fontFamily: F.titular, fontWeight: 700, fontSize: 56, letterSpacing: 8, color: C.acero, marginBottom: 34, opacity: clamp01(frame / 8) }}>QUÉ HACER</div>
        {puntos.map((t, i) => {
          const p = spring({ frame: frame - 4 - i * paso, fps, config: SPRING, durationInFrames: 16 });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 26,
                alignItems: "flex-start",
                background: C.tarjeta,
                borderRadius: 22,
                padding: "34px 34px",
                marginBottom: 24,
                opacity: p,
                transform: `translateX(${(1 - p) * -40}px)`,
              }}
            >
              <div style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 76, lineHeight: 0.9, color: C.acero, minWidth: 44 }}>{i + 1}</div>
              <div style={{ fontFamily: F.titular, fontWeight: 600, fontSize: 58, lineHeight: 1.08, color: C.hueso }}>
                <Destacado texto={t} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/** Tarjeta final de 2 s */
export function TarjetaFinal({ titulo = "Guárdalo", duracion }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: SPRING, durationInFrames: 18 });
  const p2 = spring({ frame: frame - 6, fps, config: SPRING, durationInFrames: 18 });
  return (
    <AbsoluteFill style={{ background: `rgba(11,12,15,${0.55 + 0.35 * p})` }}>
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.width, top: 720 }}>
        <div style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 150, lineHeight: 0.95, color: C.hueso, textTransform: "uppercase", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>{titulo}</div>
        <div style={{ width: 120 * p2, height: 6, background: C.acero, margin: "36px 0" }} />
        <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: C.hueso, opacity: p2 }}>
          Más en <span style={{ fontWeight: 600 }}>hybridracehub.com</span>
          <br />
          <span style={{ color: C.suave }}>(enlace en la bio)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
