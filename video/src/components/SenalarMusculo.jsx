import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, SAFE, W, H, easeOut, clamp01 } from "../theme.js";

/**
 * Señala un músculo sobre el atleta REAL del clip: anillo pulsante + línea guía + etiqueta.
 * Coordenadas normalizadas (0-1) sobre el fotograma 1080x1920 ya recortado, colocadas a mano
 * para un clip concreto (pexels_id). Los keyframes [{t, x, y}] (t en segundos desde el inicio
 * de la escena) permiten seguir el movimiento.
 */
function posicion(m, seg) {
  const ks = [...(m.keyframes || [])].sort((a, b) => a.t - b.t);
  if (!ks.length) return { x: m.x, y: m.y };
  const all = ks[0].t > 0 ? [{ t: 0, x: m.x, y: m.y }, ...ks] : ks;
  const ts = all.map((k) => k.t);
  if (all.length === 1) return { x: all[0].x, y: all[0].y };
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  return { x: interpolate(seg, ts, all.map((k) => k.x), opt), y: interpolate(seg, ts, all.map((k) => k.y), opt) };
}

function Marcador({ m, indice }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - (m.desde ?? 0.3) * fps - indice * 8;
  if (local < 0) return null;
  const { x, y } = posicion(m, frame / fps);
  const px = x * W;
  const py = y * H;
  const r = m.radio || 46;
  const aparece = easeOut(clamp01(local / 10));
  const pulso = (local % 30) / 30; // un latido por segundo
  // La etiqueta va al lado con más espacio, siempre dentro de la zona segura
  const lado = m.lado || (px > (SAFE.left + SAFE.right) / 2 ? "izq" : "der");
  const lx = lado === "izq" ? Math.max(SAFE.left, px - r - 300) : Math.min(SAFE.right - 300, px + r + 40);
  const ly = Math.min(SAFE.bottom - 80, Math.max(SAFE.top + 60, py - 110));
  const ax = lado === "izq" ? lx + 300 : lx; // anclaje de la línea en la etiqueta
  const ay = ly + 32;
  const ex = px + (lado === "izq" ? -r : r);
  const linea = easeOut(clamp01((local - 6) / 10));
  const etiqueta = easeOut(clamp01((local - 12) / 10));
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={px} cy={py} r={r * (1 + 0.55 * pulso)} fill="none" stroke={C.naranja} strokeWidth={3} opacity={(1 - pulso) * 0.7 * aparece} />
        <circle cx={px} cy={py} r={r * aparece} fill="rgba(251,146,60,0.12)" stroke={C.naranja} strokeWidth={5} />
        <circle cx={px} cy={py} r={7 * aparece} fill={C.naranja} />
        <line x1={ex} y1={py} x2={ex + (ax - ex) * linea} y2={py + (ay - py) * linea} stroke={C.hueso} strokeWidth={3} opacity={0.9} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          width: 300,
          textAlign: lado === "izq" ? "right" : "left",
          opacity: etiqueta,
          transform: `translateY(${(1 - etiqueta) * 10}px)`,
        }}
      >
        <span style={{ display: "inline-block", background: C.tarjeta, color: C.hueso, fontFamily: F.titular, fontWeight: 700, fontSize: 40, padding: "8px 18px", borderRadius: 10, textTransform: "uppercase", letterSpacing: 1 }}>{m.nombre}</span>
      </div>
    </>
  );
}

export function SenalarMusculo({ musculos }) {
  return (
    <AbsoluteFill>
      {musculos.map((m, i) => (
        <Marcador key={i} m={m} indice={i} />
      ))}
    </AbsoluteFill>
  );
}
