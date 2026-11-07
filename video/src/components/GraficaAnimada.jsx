import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F, SAFE, fmt, easeOut, easeInOut, clamp01 } from "../theme.js";

// Todas las gráficas salen de los datos del guion. Etiqueta "DATOS DEL ESTUDIO" o
// "EJEMPLO ILUSTRATIVO" y la fuente al pie.
const IW = SAFE.width - 96; // ancho interior de la tarjeta (772)
const decimales = (v) => (Number.isInteger(v) ? 0 : String(v).split(".")[1]?.length || 0);

function useProgreso(retraso = 8, dur = 26) {
  const frame = useCurrentFrame();
  return easeOut(clamp01((frame - retraso) / dur));
}

function Num({ valor, p, prefijo = "", sufijo = "" }) {
  const v = valor * p;
  return (
    <>
      {prefijo}
      {fmt(v, decimales(valor))}
      {sufijo}
    </>
  );
}

function Barras({ g }) {
  const frame = useCurrentFrame();
  const max = g.max || Math.max(...g.barras.map((b) => Math.abs(b.valor))) * 1.08;
  const unidad = g.sufijo ?? (g.unidad ? ` ${g.unidad}` : "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: g.barras.length > 4 ? 22 : 34 }}>
      {g.barras.map((b, i) => {
        const p = easeOut(clamp01((frame - 8 - i * 6) / 24));
        const color = b.destacar ? C.naranja : b.referencia ? "rgba(242,240,235,0.0)" : C.acero;
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontFamily: F.texto, fontWeight: 500, fontSize: 34, color: b.referencia ? C.suave : C.hueso }}>{b.etiqueta}</span>
              <span style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 56, color: b.destacar ? C.naranja : C.hueso }}>
                {b.prefijo && <span style={{ fontSize: 36, fontWeight: 600, marginRight: 10 }}>{b.prefijo}</span>}
                <Num valor={b.valor} p={p} sufijo={unidad} />
              </span>
            </div>
            <div style={{ height: 30, background: "rgba(242,240,235,0.08)", borderRadius: 6 }}>
              <div
                style={{
                  width: `${(Math.abs(b.valor) / max) * 100 * p}%`,
                  height: "100%",
                  borderRadius: 6,
                  background: color,
                  border: b.referencia ? `3px dashed ${C.suave}` : "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Agrupadas({ g }) {
  const frame = useCurrentFrame();
  const max = g.max || Math.max(...g.grupos.flatMap((x) => x.valores)) * 1.1;
  const colores = [C.acero, "rgba(242,240,235,0.55)"];
  const [dg, ds] = g.destacar || [-1, -1];
  return (
    <div>
      <div style={{ display: "flex", gap: 30, marginBottom: 26 }}>
        {g.series.map((s, i) => (
          <span key={i} style={{ fontFamily: F.texto, fontSize: 30, color: C.suave, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: 4, background: colores[i] }} />
            {s}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {g.grupos.map((gr, i) => (
          <div key={i}>
            <div style={{ fontFamily: F.titular, fontWeight: 700, fontSize: 40, color: C.hueso, marginBottom: 8, textTransform: "uppercase" }}>{gr.etiqueta}</div>
            {gr.valores.map((v, s) => {
              const p = easeOut(clamp01((frame - 8 - i * 6 - s * 3) / 24));
              const dest = i === dg && s === ds;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 26, background: "rgba(242,240,235,0.06)", borderRadius: 5 }}>
                    <div style={{ width: `${(v / max) * 100 * p}%`, height: "100%", borderRadius: 5, background: dest ? C.naranja : colores[s] }} />
                  </div>
                  <span style={{ width: 150, textAlign: "right", fontFamily: F.titular, fontWeight: 800, fontSize: 44, color: dest ? C.naranja : C.hueso }}>
                    <Num valor={v} p={p} sufijo={g.sufijo || ""} />
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Linea({ g, area }) {
  const frame = useCurrentFrame();
  const w = IW;
  const h = 480;
  const pad = { l: 92, r: 30, t: 30, b: 60 };
  const serie = g.series[0].valores;
  const ymin = g.y?.min ?? Math.min(0, ...serie);
  const ymax = g.y?.max ?? Math.max(...serie) * 1.1;
  const X = (i) => pad.l + (i * (w - pad.l - pad.r)) / (serie.length - 1);
  const Y = (v) => pad.t + ((ymax - v) / (ymax - ymin)) * (h - pad.t - pad.b);
  const pts = serie.map((v, i) => [X(i), Y(v)]);
  let largo = 0;
  for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const p = easeInOut(clamp01((frame - 8) / 40));
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const base = Y(Math.max(ymin, Math.min(ymax, 0)));
  const dArea = `${d} L${pts.at(-1)[0]},${base} L${pts[0][0]},${base} Z`;
  const marcas = g.y?.marcas || [ymin, (ymin + ymax) / 2, ymax];
  const suf = g.y?.sufijo || "";
  const fin = pts.at(-1);
  const idxDest = g.destacar_punto ?? serie.length - 1;
  const pd = pts[idxDest];
  const vis = clamp01((frame - 8 - 40 * (idxDest / (serie.length - 1))) / 6);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.acero} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.acero} stopOpacity="0.04" />
        </linearGradient>
        <clipPath id="revela">
          <rect x="0" y="0" width={pad.l + (w - pad.l) * p} height={h} />
        </clipPath>
      </defs>
      {marcas.map((m, i) => (
        <g key={i}>
          <line x1={pad.l} x2={w - pad.r} y1={Y(m)} y2={Y(m)} stroke={C.linea} strokeWidth={2} />
          <text x={pad.l - 16} y={Y(m) + 10} textAnchor="end" fill={C.suave} style={{ fontFamily: F.texto, fontSize: 26 }}>
            {fmt(m)}
            {suf}
          </text>
        </g>
      ))}
      {g.x.map((lx, i) => (
        <text key={i} x={X(i)} y={h - 14} textAnchor="middle" fill={C.suave} style={{ fontFamily: F.texto, fontSize: 25 }}>
          {lx}
        </text>
      ))}
      {area && <path d={dArea} fill="url(#relleno)" clipPath="url(#revela)" />}
      <path d={d} fill="none" stroke={C.hueso} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} />
      <circle cx={pd[0]} cy={pd[1]} r={13 * vis} fill={C.naranja} />
      <text x={Math.min(pd[0], w - 60)} y={pd[1] - 30} textAnchor="middle" fill={C.naranja} opacity={vis} style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 50 }}>
        {fmt(serie[idxDest])}
        {suf}
      </text>
      {fin && null}
    </svg>
  );
}

function Contador({ g }) {
  const p = useProgreso(6, 30);
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ fontFamily: F.titular, fontWeight: 800, fontSize: g.grande === false ? 150 : 230, lineHeight: 0.9, color: C.naranja, whiteSpace: "nowrap" }}>
        {g.texto_cifra ? (
          <span style={{ opacity: p }}>{g.texto_cifra}</span>
        ) : (
          <Num valor={g.valor} p={p} prefijo={g.prefijo || ""} sufijo={g.sufijo || ""} />
        )}
        {g.unidad && <span style={{ fontSize: 72, color: C.hueso, marginLeft: 18 }}>{g.unidad}</span>}
      </div>
      {g.texto && <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: 40, lineHeight: 1.25, color: C.hueso, marginTop: 30 }}>{g.texto}</div>}
    </div>
  );
}

function Comparativa({ g }) {
  const frame = useCurrentFrame();
  const lados = [g.a, g.b];
  const max = Math.max(g.a.valor, g.b.valor) * 1.05;
  const dif = easeOut(clamp01((frame - 40) / 12));
  return (
    <div>
      {lados.map((x, i) => {
        const p = easeOut(clamp01((frame - 8 - i * 10) / 26));
        const dest = g.destacar === (i ? "b" : "a");
        return (
          <div key={i} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: F.titular, fontWeight: 700, fontSize: 46, color: C.hueso, textTransform: "uppercase" }}>{x.etiqueta}</span>
              <span style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 96, color: dest ? C.naranja : C.hueso, lineHeight: 1 }}>
                <Num valor={x.valor} p={p} />
                <span style={{ fontSize: 46, marginLeft: 8 }}>{x.unidad}</span>
              </span>
            </div>
            <div style={{ height: 34, marginTop: 12, background: "rgba(242,240,235,0.08)", borderRadius: 6 }}>
              <div style={{ width: `${(x.valor / max) * 100 * p}%`, height: "100%", borderRadius: 6, background: dest ? C.naranja : C.acero }} />
            </div>
            {x.nota && <div style={{ fontFamily: F.texto, fontSize: 30, color: C.suave, marginTop: 10 }}>{x.nota}</div>}
          </div>
        );
      })}
      {g.diferencia && (
        <div style={{ display: "inline-block", opacity: dif, transform: `scale(${0.9 + 0.1 * dif})`, transformOrigin: "left center", border: `3px solid ${C.naranja}`, color: C.naranja, borderRadius: 999, padding: "8px 26px", fontFamily: F.titular, fontWeight: 800, fontSize: 52 }}>{g.diferencia}</div>
      )}
    </div>
  );
}

function Donut({ g }) {
  const p = useProgreso(8, 34);
  const r = 175;
  const s = 46;
  const L = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={2 * (r + s)} height={2 * (r + s)}>
        <circle cx={r + s} cy={r + s} r={r} fill="none" stroke="rgba(242,240,235,0.1)" strokeWidth={s} />
        <circle cx={r + s} cy={r + s} r={r} fill="none" stroke={C.naranja} strokeWidth={s} strokeDasharray={L} strokeDashoffset={L * (1 - (g.valor / 100) * p)} transform={`rotate(-90 ${r + s} ${r + s})`} />
        <text x={r + s} y={r + s + 38} textAnchor="middle" fill={C.hueso} style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 130 }}>
          {fmt(g.valor * p, 0)} %
        </text>
      </svg>
      {g.etiqueta_centro && <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: 40, color: C.hueso, marginTop: 26, textAlign: "center" }}>{g.etiqueta_centro}</div>}
    </div>
  );
}

const TIPOS = { barras: Barras, agrupadas: Agrupadas, linea: (p) => <Linea {...p} />, area: (p) => <Linea {...p} area />, contador: Contador, comparativa: Comparativa, donut: Donut };
export const TIPOS_GRAFICA = Object.keys(TIPOS);

export function GraficaAnimada({ grafica: g, duracion }) {
  const frame = useCurrentFrame();
  const entra = easeOut(clamp01(frame / 12));
  const salida = interpolate(frame, [duracion - 6, duracion], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Cuerpo = TIPOS[g.tipo];
  const estudio = g.etiqueta === "estudio";
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: g.top ?? 330,
          boxSizing: "border-box",
          padding: 48,
          borderRadius: 30,
          background: C.tarjeta,
          border: `1px solid ${C.linea}`,
          opacity: entra * salida,
          transform: `translateY(${(1 - entra) * 40}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: F.titular,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 4,
            padding: "6px 16px",
            borderRadius: 8,
            background: estudio ? C.acero : "transparent",
            border: estudio ? "none" : `2px solid ${C.suave}`,
            color: estudio ? C.tinta : C.suave,
          }}
        >
          {estudio ? "DATOS DEL ESTUDIO" : "EJEMPLO ILUSTRATIVO"}
        </div>
        <div style={{ fontFamily: F.titular, fontWeight: 800, fontSize: 70, lineHeight: 1, color: C.hueso, margin: "22px 0 10px", textTransform: "uppercase" }}>{g.titulo}</div>
        {g.subtitulo && <div style={{ fontFamily: F.texto, fontSize: 32, lineHeight: 1.25, color: C.suave, marginBottom: 30 }}>{g.subtitulo}</div>}
        <div style={{ marginTop: g.subtitulo ? 0 : 26 }}>{Cuerpo ? <Cuerpo g={g} /> : null}</div>
        <div style={{ fontFamily: F.texto, fontSize: 25, lineHeight: 1.3, color: C.suave, marginTop: 34, borderTop: `1px solid ${C.linea}`, paddingTop: 18 }}>Fuente: {g.fuente}</div>
      </div>
    </AbsoluteFill>
  );
}
