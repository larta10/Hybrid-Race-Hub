import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, F, W, H, SAFE } from "../theme.js";
import { POSES, esqueleto, poseEn, anguloEn, L } from "../poses.js";

/**
 * Monigote de técnica: figura articulada estilo diagrama de biomecánica (líneas blancas de grosor
 * uniforme, articulaciones en círculos pequeños, cabeza sin cara, suelo fino, fondo oscuro con rejilla).
 * Solo para escenas de técnica ("tecnica" en el guion), nunca en el gancho ni como protagonista.
 *
 * tecnica = { pose: "wall_ball", comparar: true|false, marcas: [{tipo:"angulo", articulacion:"rodilla"},
 *             {tipo:"espalda"}, {tipo:"trayectoria"}, {tipo:"texto", texto:"..."}] }
 */
export const ROJO = "#C0605A"; // rojo apagado
export const VERDE = "#6FA27A"; // verde apagado
const FONDO = "#0E1014";
const MUESTRAS = 36;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const manosMedia = (s) => [(s.brazos[0].mano[0] + s.brazos[1].mano[0]) / 2, (s.brazos[0].mano[1] + s.brazos[1].mano[1]) / 2];
const DIANA = [0.45, -1.5]; // diana del wall ball (estilizada: más baja que los 3,05 m reales para que la figura se vea grande)

function colocar(def, p) {
  const apoyo = def.apoyo || "suelo";
  let s = esqueleto(p, apoyo);
  // En el remo los pies van fijos en el reposapiés: se mueve el carro, no la máquina
  if (apoyo === "asiento") {
    const dx = 0.42 - s.piernas[0].tobillo[0];
    s = esqueleto({ ...p, dx: (p.dx || 0) + dx }, apoyo);
  }
  return s;
}

/** Posición del balón: en las manos (0) → diana (1) */
function balonEn(def, s, p) {
  if (def.implemento !== "balon") return null;
  const m = manosMedia(s);
  const b = p.balon || 0;
  const base = [m[0] + 0.02, m[1] - 0.02];
  const x = base[0] + (DIANA[0] - base[0]) * b;
  const y = base[1] + (DIANA[1] - base[1]) * b - Math.sin(Math.PI * b) * 0.06;
  return [x, y];
}

/** Caja que ocupan todas las fases (para escalar sin que nada se salga del panel) */
function caja(def, frames) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = 0;
  const pt = ([x, y], r = 0) => {
    x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r);
  };
  for (let k = 0; k < MUESTRAS; k++) {
    const p = poseEn(frames, k / MUESTRAS);
    const s = colocar(def, p);
    [s.cadera, s.hombro, s.cabeza, ...s.piernas.flatMap((l) => [l.rodilla, l.punta, l.talon]), ...s.brazos.flatMap((b) => [b.codo, b.mano])].forEach((q) => pt(q, 0.07));
    const b = balonEn(def, s, p);
    if (b) pt(b, 0.08);
  }
  if (def.diana) pt(DIANA, 0.12);
  if (def.implemento === "trineo") pt([x1 + 0.3, 0]);
  if (def.implemento === "cuerda_trineo") pt([x1 + 0.45, 0]);
  if (def.implemento === "remo") { pt([-0.75, 0]); pt([1.05, -0.4]); }
  if (def.implemento === "skierg") pt([0.55, -1.65]);
  if (def.implemento === "cuerda") pt([0, -1.62]);
  return { x0: x0 - 0.1, x1: x1 + 0.1, y0: y0 - 0.06, y1 };
}

function Implemento({ def, s, p, k, col, ancho }) {
  const P = (q) => [q[0] * k, q[1] * k];
  const m = manosMedia(s);
  const st = { stroke: col, strokeWidth: ancho * 0.7, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (def.implemento) {
    case "balon": {
      const b = balonEn(def, s, p);
      return <circle cx={b[0] * k} cy={b[1] * k} r={0.07 * k} {...st} fill={FONDO} strokeWidth={ancho * 0.8} />;
    }
    case "trineo": {
      const [hx, hy] = P(m);
      const base = 0.13 * k;
      return (
        <g {...st}>
          <line x1={hx} y1={hy} x2={hx} y2={-base} />
          <rect x={hx - 0.04 * k} y={-base} width={0.42 * k} height={base} rx={4} fill={FONDO} />
          <rect x={hx + 0.06 * k} y={-base - 0.09 * k} width={0.22 * k} height={0.09 * k} fill={FONDO} />
        </g>
      );
    }
    case "cuerda_trineo": {
      const [hx, hy] = P(m);
      const sx = (m[0] + 0.75) * k;
      return (
        <g {...st}>
          <path d={`M ${hx} ${hy} Q ${(hx + sx) / 2} ${hy * 0.25} ${sx} ${-0.05 * k}`} strokeDasharray={`${ancho * 0.8} ${ancho * 0.6}`} />
          <rect x={sx} y={-0.13 * k} width={0.34 * k} height={0.13 * k} rx={4} fill={FONDO} />
        </g>
      );
    }
    case "saco": {
      const [x, y] = P(s.hombro);
      return <rect x={x - 0.13 * k} y={y - 0.06 * k} width={0.26 * k} height={0.09 * k} rx={0.04 * k} {...st} fill={FONDO} transform={`rotate(${-(p.tronco || 0) * 0.3} ${x} ${y})`} />;
    }
    case "pesas":
      return (
        <g {...st}>
          {s.brazos.map((b, i) => {
            const [x, y] = P(b.mano);
            return (
              <g key={i} opacity={i ? 0.55 : 1}>
                <path d={`M ${x - 0.03 * k} ${y + 0.035 * k} Q ${x} ${y - 0.02 * k} ${x + 0.03 * k} ${y + 0.035 * k}`} />
                <circle cx={x} cy={y + 0.09 * k} r={0.055 * k} fill={FONDO} />
              </g>
            );
          })}
        </g>
      );
    case "remo": {
      const [hx, hy] = P(m);
      const [cx, cy] = P(s.cadera);
      const [tx, ty] = P(s.piernas[0].tobillo);
      return (
        <g {...st}>
          <line x1={-0.75 * k} y1={-0.17 * k} x2={0.95 * k} y2={-0.17 * k} />
          <line x1={-0.65 * k} y1={-0.17 * k} x2={-0.65 * k} y2={0} />
          <line x1={0.85 * k} y1={-0.17 * k} x2={0.85 * k} y2={0} />
          <rect x={cx - 0.08 * k} y={cy} width={0.16 * k} height={0.035 * k} rx={3} fill={FONDO} />
          <line x1={tx + 0.05 * k} y1={ty - 0.1 * k} x2={tx - 0.02 * k} y2={ty + 0.05 * k} />
          <circle cx={0.88 * k} cy={-0.3 * k} r={0.11 * k} fill={FONDO} />
          <line x1={0.8 * k} y1={-0.3 * k} x2={hx} y2={hy} strokeWidth={ancho * 0.35} />
          <line x1={hx} y1={hy - 0.04 * k} x2={hx} y2={hy + 0.04 * k} />
        </g>
      );
    }
    case "skierg": {
      const top = [0.45 * k, -1.6 * k];
      return (
        <g {...st}>
          <line x1={top[0]} y1={top[1]} x2={top[0]} y2={0} />
          <line x1={top[0] - 0.12 * k} y1={0} x2={top[0] + 0.14 * k} y2={0} />
          {s.brazos.map((b, i) => {
            const [x, y] = P(b.mano);
            return <line key={i} x1={top[0] - 0.03 * k} y1={top[1] + 0.05 * k} x2={x} y2={y} strokeWidth={ancho * 0.3} opacity={i ? 0.55 : 1} />;
          })}
        </g>
      );
    }
    case "cuerda": {
      const x = s.brazos[0].mano[0] * k;
      return <line x1={x} y1={-1.62 * k} x2={x} y2={0} stroke={col} strokeWidth={ancho * 0.55} opacity={0.75} />;
    }
    default:
      return null;
  }
}

function Arco({ c, a, b, k, color, texto, ancho }) {
  // Arco en el vértice c entre las direcciones a y b, con la etiqueta en grados
  const r = 0.09 * k;
  const ang = (q) => Math.atan2(q[1] - c[1], q[0] - c[0]);
  let a1 = ang(a), a2 = ang(b);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const p1 = [c[0] * k + r * Math.cos(a1), c[1] * k + r * Math.sin(a1)];
  const p2 = [c[0] * k + r * Math.cos(a1 + d), c[1] * k + r * Math.sin(a1 + d)];
  const mid = a1 + d / 2;
  const lx = c[0] * k + (r + 0.075 * k) * Math.cos(mid);
  const ly = c[1] * k + (r + 0.075 * k) * Math.sin(mid);
  return (
    <g>
      <path d={`M ${p1[0]} ${p1[1]} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2[0]} ${p2[1]}`} stroke={color} strokeWidth={ancho * 0.45} fill="none" />
      <text x={lx} y={ly} fill={color} fontFamily={F.titular} fontWeight={700} fontSize={0.075 * k} textAnchor="middle" dominantBaseline="middle" style={{ paintOrder: "stroke", stroke: FONDO, strokeWidth: 6 }}>
        {texto}
      </text>
    </g>
  );
}

function Marcas({ def, frames, marcas, s, p, k, color, ancho }) {
  const out = [];
  marcas.forEach((m, i) => {
    if (m.tipo === "angulo") {
      const j = m.articulacion;
      const pi = s.piernas[0];
      const br = s.brazos[0];
      if (j === "rodilla") out.push(<Arco key={i} c={pi.rodilla} a={s.cadera} b={pi.tobillo} k={k} color={color} ancho={ancho} texto={`${anguloEn(s.cadera, pi.rodilla, pi.tobillo)}°`} />);
      if (j === "cadera") out.push(<Arco key={i} c={s.cadera} a={s.hombro} b={pi.rodilla} k={k} color={color} ancho={ancho} texto={`${anguloEn(s.hombro, s.cadera, pi.rodilla)}°`} />);
      if (j === "codo") out.push(<Arco key={i} c={br.codo} a={s.hombro} b={br.mano} k={k} color={color} ancho={ancho} texto={`${anguloEn(s.hombro, br.codo, br.mano)}°`} />);
      if (j === "tronco") {
        const vert = [s.cadera[0], s.cadera[1] - 0.2];
        out.push(<line key={`${i}v`} x1={s.cadera[0] * k} y1={s.cadera[1] * k} x2={vert[0] * k} y2={(s.cadera[1] - 0.24) * k} stroke={color} strokeWidth={ancho * 0.3} strokeDasharray="6 8" />);
        out.push(<Arco key={i} c={s.cadera} a={vert} b={s.hombro} k={k} color={color} ancho={ancho} texto={`${Math.round(Math.abs(p.tronco || 0))}°`} />);
      }
    }
    if (m.tipo === "espalda") {
      // Línea de alineación de la espalda: de la cadera al hombro, prolongada
      const u = sub(s.hombro, s.cadera);
      const a = [s.cadera[0] - u[0] * 0.15, s.cadera[1] - u[1] * 0.15];
      const b = [s.hombro[0] + u[0] * 0.35, s.hombro[1] + u[1] * 0.35];
      const n = Math.hypot(...u) || 1;
      const off = [(u[1] / n) * 0.05, (-u[0] / n) * 0.05];
      out.push(<line key={i} x1={(a[0] + off[0]) * k} y1={(a[1] + off[1]) * k} x2={(b[0] + off[0]) * k} y2={(b[1] + off[1]) * k} stroke={color} strokeWidth={ancho * 0.4} strokeDasharray="14 10" opacity={0.9} />);
    }
    if (m.tipo === "trayectoria") {
      // Recorrido del balón (wall ball) o de la mano a lo largo de la repetición, con punta de flecha
      const pts = [];
      for (let q = 0; q <= 24; q++) {
        const pp = poseEn(frames, 0.18 + (q / 24) * 0.42);
        const ss = colocar(def, pp);
        pts.push(balonEn(def, ss, pp) || ss.brazos[0].mano);
      }
      const d = pts.map((q, z) => `${z ? "L" : "M"} ${q[0] * k} ${q[1] * k}`).join(" ");
      const [pa, pb] = [pts[pts.length - 2], pts[pts.length - 1]];
      const ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]);
      const h = 0.05 * k;
      const tip = [pb[0] * k, pb[1] * k];
      out.push(
        <g key={i}>
          <path d={d} stroke={color} strokeWidth={ancho * 0.35} fill="none" strokeDasharray="10 9" />
          <path d={`M ${tip[0]} ${tip[1]} L ${tip[0] - h * Math.cos(ang - 0.45)} ${tip[1] - h * Math.sin(ang - 0.45)} M ${tip[0]} ${tip[1]} L ${tip[0] - h * Math.cos(ang + 0.45)} ${tip[1] - h * Math.sin(ang + 0.45)}`} stroke={color} strokeWidth={ancho * 0.45} fill="none" strokeLinecap="round" />
        </g>
      );
    }
  });
  return <>{out}</>;
}

function Figura({ s, p, k, ancho }) {
  const P = (q) => `${q[0] * k} ${q[1] * k}`;
  const curva = p.curva || 0;
  // Tronco: recto o, si la espalda va redonda, curvado hacia atrás
  const u = sub(s.hombro, s.cadera);
  const n = [u[1], -u[0]];
  const mid = [(s.cadera[0] + s.hombro[0]) / 2 + n[0] * curva * 6, (s.cadera[1] + s.hombro[1]) / 2 + n[1] * curva * 6];
  const linea = { stroke: C.hueso, strokeWidth: ancho, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const pierna = (l, op) => <path key={`p${op}`} d={`M ${P(s.cadera)} L ${P(l.rodilla)} L ${P(l.tobillo)} M ${P(l.talon)} L ${P(l.punta)}`} {...linea} opacity={op} />;
  const brazo = (b, op) => <path key={`b${op}`} d={`M ${P(s.hombro)} L ${P(b.codo)} L ${P(b.mano)}`} {...linea} opacity={op} />;
  const art = (q, key, op = 1) => <circle key={key} cx={q[0] * k} cy={q[1] * k} r={ancho * 0.62} fill={FONDO} stroke={C.hueso} strokeWidth={ancho * 0.45} opacity={op} />;
  return (
    <g>
      {/* Lado izquierdo (más lejos de la cámara) atenuado y detrás */}
      {pierna(s.piernas[1], 0.45)}
      {brazo(s.brazos[1], 0.45)}
      <path d={`M ${P(s.cadera)} Q ${mid[0] * k} ${mid[1] * k} ${P(s.hombro)} L ${P(s.cuello)}`} {...linea} />
      <circle cx={s.cabeza[0] * k} cy={s.cabeza[1] * k} r={L.cabeza * 0.95 * k} fill={FONDO} stroke={C.hueso} strokeWidth={ancho} />
      {pierna(s.piernas[0], 1)}
      {brazo(s.brazos[0], 1)}
      {[s.piernas[1].rodilla, s.piernas[1].tobillo, s.brazos[1].codo].map((q, i) => art(q, `a1${i}`, 0.45))}
      {[s.cadera, s.hombro, s.piernas[0].rodilla, s.piernas[0].tobillo, s.brazos[0].codo, s.brazos[0].mano].map((q, i) => art(q, `a0${i}`))}
    </g>
  );
}

/** Un panel: figura animada, implemento, marcas y suelo, escalados a la caja del panel */
function Panel({ def, frames, marcas, x, y, w, h, t, color, etiqueta, entra }) {
  const bx = React.useMemo(() => caja(def, frames), [def, frames]);
  const k = Math.min(w / (bx.x1 - bx.x0), (h - 40) / (bx.y1 - bx.y0));
  const ancho = Math.max(6, Math.min(11, k * 0.016));
  const ox = x + (w - (bx.x1 - bx.x0) * k) / 2 - bx.x0 * k;
  const oy = y + h - 30;
  const fase = t / def.ciclo;
  const p = poseEn(frames, fase);
  const s = colocar(def, p);
  const avance = def.suelo_movil ? ((t * 0.9 * k) % (0.25 * k)) : 0;
  return (
    <g opacity={entra}>
      {etiqueta && (
        <text x={x + 8} y={y + 44} fill={color} fontFamily={F.titular} fontWeight={800} fontSize={58} letterSpacing={1}>
          {etiqueta}
        </text>
      )}
      <g transform={`translate(${ox} ${oy})`}>
        {/* Suelo: línea fina; en las estaciones con desplazamiento, marcas que corren hacia atrás */}
        <line x1={bx.x0 * k - 40} y1={0} x2={bx.x1 * k + 40} y2={0} stroke={C.hueso} strokeOpacity={0.45} strokeWidth={2} />
        {def.suelo_movil &&
          Array.from({ length: 14 }, (_, i) => {
            const xx = bx.x0 * k - 40 + i * 0.25 * k - avance;
            return <line key={i} x1={xx} y1={0} x2={xx - 18} y2={16} stroke={C.hueso} strokeOpacity={0.25} strokeWidth={2} />;
          })}
        {def.diana && (
          <g stroke={C.hueso} strokeOpacity={0.55} fill="none" strokeWidth={3}>
            <line x1={(DIANA[0] + 0.16) * k} y1={(DIANA[1] - 0.3) * k} x2={(DIANA[0] + 0.16) * k} y2={(DIANA[1] + 0.5) * k} />
            <circle cx={DIANA[0] * k} cy={DIANA[1] * k} r={0.1 * k} />
            <circle cx={DIANA[0] * k} cy={DIANA[1] * k} r={0.035 * k} />
          </g>
        )}
        <Implemento def={def} s={s} p={p} k={k} col={C.hueso} ancho={ancho} />
        <Figura s={s} p={p} k={k} ancho={ancho} />
        <Marcas def={def} frames={frames} marcas={marcas} s={s} p={p} k={k} color={color} ancho={ancho} />
      </g>
    </g>
  );
}

export function Monigote({ tecnica }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const def = POSES[tecnica?.pose];
  if (!def) return null;
  const t = frame / fps;
  const marcas = (tecnica.marcas?.length ? tecnica.marcas : def.marcas || []).filter((m) => m.tipo !== "texto");
  const textos = (tecnica.marcas || []).filter((m) => m.tipo === "texto").map((m) => m.texto);
  const entra = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const comparar = Boolean(tecnica.comparar && def.error);
  // Zona de dibujo: dentro de la zona segura y por encima de los subtítulos (que van al 78 %)
  const x = SAFE.left;
  const w = SAFE.width;
  const top = SAFE.top + 20;
  const bottom = Math.round(H * 0.72);
  return (
    <AbsoluteFill style={{ backgroundColor: FONDO }}>
      {/* Rejilla sutil */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(242,240,235,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(242,240,235,0.045) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {comparar ? (
          <>
            <Panel def={def} frames={def.error} marcas={marcas} x={x} y={top} w={w} h={(bottom - top) / 2 - 16} t={t} color={ROJO} etiqueta="✗  Así no" entra={entra} />
            <line x1={x} y1={(top + bottom) / 2} x2={x + w} y2={(top + bottom) / 2} stroke={C.hueso} strokeOpacity={0.15} strokeWidth={2} />
            <Panel def={def} frames={def.frames} marcas={marcas} x={x} y={(top + bottom) / 2 + 16} w={w} h={(bottom - top) / 2 - 16} t={t} color={VERDE} etiqueta="✓  Así sí" entra={interpolate(frame, [6, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </>
        ) : (
          <Panel def={def} frames={def.frames} marcas={marcas} x={x} y={top + (textos.length ? 70 : 0)} w={w} h={bottom - top - (textos.length ? 70 : 0)} t={t} color={VERDE} entra={entra} />
        )}
        {!comparar && textos[0] && (
          <text x={x + 8} y={top + 50} fill={C.hueso} fontFamily={F.titular} fontWeight={800} fontSize={56} opacity={entra}>
            {textos[0]}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
}
