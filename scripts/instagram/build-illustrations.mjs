// Genera la biblioteca de ilustraciones de instagram/assets/svg/ a partir de poses definidas a mano.
// Estilo "manual técnico": maniquí de cápsulas con contorno hueso de 6 px, interior del color del fondo,
// equipamiento en trazo de 6 px y acento naranja mínimo (guías). Cada parte del cuerpo va en una zona
// con clase z-<zona> para que el renderer pueda resaltarla (p. ej. glúteos en naranja).
// Uso: node scripts/instagram/build-illustrations.mjs
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import path from "node:path";
import { ROOT } from "./lib/config.mjs";

const OUT = path.join(ROOT, "instagram/assets/svg");
const HUESO = "#F2F0EB";
const FONDO = "#0B0C0F"; // marcador: el renderer lo sustituye por el color de la superficie
const NARANJA = "#FB923C";
const LEJOS = "#9A9894"; // contorno de las extremidades del lado lejano
const SW = 6; // grosor de trazo
const GROUND = 540;

const r1 = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${r1(x)},${r1(y)}`;
const rad = (d) => (d * Math.PI) / 180;
/** Punto a distancia len desde p en dirección a (0 = abajo, 90 = adelante/derecha, 180 = arriba) */
const go = (p, a, len) => [p[0] + Math.sin(rad(a)) * len, p[1] + Math.cos(rad(a)) * len];

// Grosores del maniquí (interior); el contorno añade SW a cada lado
const WID = { torso: 62, cuello: 24, brazo: 26, antebrazo: 22, muslo: 38, pierna: 28, pie: 16, mano: 22, gluteo: 50 };
const LEN = { muslo: 100, pierna: 94, torso: 140, brazo: 74, antebrazo: 68, cuello: 18, pie: 30 };

/**
 * Pose lateral (mirando a la derecha). Ángulos absolutos en grados (0 = abajo, 90 = adelante).
 * lean: inclinación del tronco (0 = vertical, + hacia delante); curva: joroba (px, + = espalda redonda).
 * legs/arms: [cercano, lejano] con { a: muslo/brazo, b: pierna/antebrazo, pie }.
 */
function figure(p) {
  const hip = p.hip || [300, 340];
  const lean = p.lean ?? 0;
  const top = go(hip, 180 - lean, LEN.torso);
  const mid0 = [(hip[0] + top[0]) / 2, (hip[1] + top[1]) / 2];
  // la joroba empuja el centro del tronco hacia la espalda (perpendicular, hacia atrás/arriba)
  const back = -90 - lean; // dirección hacia la espalda
  const curva = p.curva || 0;
  const mid = go(mid0, back, curva);
  const neck = go(top, 180 - lean - (p.cabeza ?? 0), LEN.cuello);
  const head = go(neck, 180 - lean - (p.cabeza ?? 0), 34);
  const leg = (l) => {
    const knee = go(hip, l.a, LEN.muslo);
    const ankle = go(knee, l.b, LEN.pierna);
    const toe = go(ankle, l.pie ?? 90, LEN.pie);
    return { knee, ankle, toe };
  };
  const shoulder = go(top, back + 180, 6); // un poco por delante del eje
  const arm = (a) => {
    if (a.to) {
      // cinemática inversa de 2 segmentos: el codo se dobla hacia abajo (bend = 1) o hacia arriba (-1)
      const [dx, dy] = [a.to[0] - shoulder[0], a.to[1] - shoulder[1]];
      const d = Math.min(Math.hypot(dx, dy), LEN.brazo + LEN.antebrazo - 1);
      const base = Math.atan2(dy, dx);
      const k = Math.acos((LEN.brazo ** 2 + d ** 2 - LEN.antebrazo ** 2) / (2 * LEN.brazo * d));
      const t = base + (a.bend ?? 1) * k;
      const elbow = [shoulder[0] + Math.cos(t) * LEN.brazo, shoulder[1] + Math.sin(t) * LEN.brazo];
      const ux = (a.to[0] - elbow[0]) / Math.hypot(a.to[0] - elbow[0], a.to[1] - elbow[1]);
      const uy = (a.to[1] - elbow[1]) / Math.hypot(a.to[0] - elbow[0], a.to[1] - elbow[1]);
      const wrist = [elbow[0] + ux * LEN.antebrazo, elbow[1] + uy * LEN.antebrazo];
      return { elbow, wrist, hand: [wrist[0] + ux * 10, wrist[1] + uy * 10] };
    }
    const elbow = go(shoulder, a.a, LEN.brazo);
    const wrist = go(elbow, a.b, LEN.antebrazo);
    const hand = go(wrist, a.b, 10);
    return { elbow, wrist, hand };
  };
  const [ln, lf] = p.legs.map(leg);
  const [an, af] = p.arms.map(arm);
  const glute = go(hip, back, 14);
  return { hip, top, mid, neck, head, shoulder, glute, ln, lf, an, af, lean };
}

/** Desplaza todos los puntos para que el pie más bajo toque el suelo (si ground = true) */
function grounded(f, dy0 = null) {
  const feet = [f.ln.ankle, f.ln.toe, f.lf.ankle, f.lf.toe];
  const maxY = Math.max(...feet.map((q) => q[1]));
  const dy = dy0 ?? GROUND - WID.pie / 2 - SW - maxY;
  const mv = (q) => [q[0], q[1] + dy];
  const walk = (o) => (Array.isArray(o) && typeof o[0] === "number" ? mv(o) : typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)])) : o);
  return walk(f);
}

const seg = (pts, w, zona) => ({ pts, w, zona });

/** Capa = varias cápsulas fusionadas: primero los contornos, después los interiores */
function layer(segs, extraOuter = "", extraInner = "", ink = HUESO) {
  const outer = segs
    .map((s) => (s.pts.length === 1 ? `<circle cx="${r1(s.pts[0][0])}" cy="${r1(s.pts[0][1])}" r="${r1(s.w / 2 + SW)}" fill="${ink}"/>` : `<polyline points="${s.pts.map(pt).join(" ")}" stroke="${ink}" stroke-width="${s.w + 2 * SW}"/>`))
    .join("");
  const inner = segs
    .map((s) =>
      s.pts.length === 1
        ? `<circle class="z-${s.zona}" cx="${r1(s.pts[0][0])}" cy="${r1(s.pts[0][1])}" r="${r1(s.w / 2)}" fill="${FONDO}"/>`
        : `<polyline class="z-${s.zona}" points="${s.pts.map(pt).join(" ")}" stroke="${FONDO}" stroke-width="${s.w}"/>`,
    )
    .join("");
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${extraOuter}${outer}${inner}${extraInner}</g>`;
}

function legSegs(l, hip) {
  return [seg([hip, l.knee], WID.muslo, "cuadriceps"), seg([l.knee, l.ankle], WID.pierna, "gemelos"), seg([l.ankle, l.toe], WID.pie, "pies")];
}
function armSegs(a, sh) {
  return [seg([sh, a.elbow], WID.brazo, "brazos"), seg([a.elbow, a.wrist], WID.antebrazo, "antebrazos"), seg([a.hand], WID.mano, "manos")];
}

/** SVG del maniquí por capas: brazo lejano, pierna lejana, cuerpo, pierna cercana, brazo cercano */
function drawFigure(f, { between = "", front = "" } = {}) {
  const body = [
    seg([f.glute], WID.gluteo, "gluteos"),
    seg([f.hip, f.mid], WID.torso, "core"),
    seg([f.mid, f.top], WID.torso, "espalda"),
    seg([f.top, f.neck], WID.cuello, "cuello"),
    seg([f.head], 56, "cabeza"),
  ];
  return [layer(armSegs(f.af, f.shoulder), "", "", LEJOS), layer(legSegs(f.lf, f.hip), "", "", LEJOS), between, layer(body), layer(legSegs(f.ln, f.hip)), layer(armSegs(f.an, f.shoulder)), front].join("\n");
}

// ---------- Elementos de equipamiento (trazo hueso de 6 px) ----------
const line = (a, b, extra = "") => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke="${HUESO}" stroke-width="${SW}" stroke-linecap="round" ${extra}/>`;
const path_ = (d, extra = "") => `<path d="${d}" fill="none" stroke="${HUESO}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const rect = (x, y, w, h, rx = 8, extra = "") => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" ${extra}/>`;
const circle = (c, r, extra = "") => `<circle cx="${r1(c[0])}" cy="${r1(c[1])}" r="${r1(r)}" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" ${extra}/>`;
// El suelo se ajusta al ancho del dibujo en svg(): aquí solo se deja una marca
const ground = () => "<!--SUELO-->";
const groundLine = (x1, x2) => `<line x1="${r1(x1)}" y1="${GROUND}" x2="${r1(x2)}" y2="${GROUND}" stroke="${HUESO}" stroke-width="${SW}" stroke-linecap="round" opacity=".45"/>`;
/** Guía naranja discontinua (ángulo de espalda, trayectoria...) */
const guide = (pts, extra = "") => `<polyline class="guia" points="${pts.map(pt).join(" ")}" fill="none" stroke="${NARANJA}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const guidePath = (d) => `<path class="guia" d="${d}" fill="none" stroke="${NARANJA}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>`;
/** Línea de espalda recta o curva para mostrar postura */
const spineGuide = (f, off = 52) => {
  const back = -90 - f.lean;
  const a = go(f.hip, back, off - 6);
  const m = go(f.mid, back, off);
  const b = go(f.top, back, off - 6);
  return `<path class="guia" d="M${pt(go(a, -f.lean, 22))} Q${pt([2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2])} ${pt(go(b, 180 - f.lean, 22))}" fill="none" stroke="${NARANJA}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>`;
};

const FONT_FILES = readdirSync(path.join(ROOT, "instagram/fonts")).map((f) => path.join(ROOT, "instagram/fonts", f));
/** Escribe el SVG con el viewBox recortado al contenido (+ margen), para que llene bien cualquier caja */
function svg(name, body, pad = 14) {
  const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">\n${body}\n</svg>\n`;
  const bb = new Resvg(full, { font: { fontFiles: FONT_FILES, loadSystemFonts: false } }).getBBox();
  const vb = bb ? [bb.x - pad, bb.y - pad, bb.width + 2 * pad, bb.height + 2 * pad].map((n) => Math.round(n)).join(" ") : "0 0 600 600";
  writeFileSync(path.join(OUT, `${name}.svg`), full.replace('viewBox="0 0 600 600"', `viewBox="${vb}"`));
}

// ---------- Trineo ----------
function sled(x, { poles = true, poleTop = 300, w = 150 } = {}) {
  const y = GROUND - 12;
  const base = path_(`M${x - 18} ${y + 6} L${x} ${y - 6} H${x + w} V${y + 6} H${x - 6}`);
  const box = rect(x + 14, y - 74, w - 28, 66, 6);
  const plates = `${circle([x + w / 2, y - 112], 36)}${circle([x + w / 2, y - 112], 8)}`;
  const pole = poles ? line([x + 12, y - 8], [x + 12, poleTop]) + line([x + 12, poleTop], [x - 8, poleTop]) : "";
  return base + box + plates + pole;
}

// ================= ESTACIONES =================
mkdirSync(OUT, { recursive: true });

// --- Sled push correcto: tronco a ~50º, espalda neutra, brazos extendidos, cadera baja
{
  let f = figure({ hip: [220, 360], lean: 52, legs: [{ a: 50, b: -18, pie: 95 }, { a: -10, b: -40, pie: 80 }], arms: [{ a: 120, b: 112 }, { a: 116, b: 108 }] });
  f = grounded(f);
  const hx = f.an.hand[0] + 4;
  svg("sled-push-correcto", [ground(), sled(hx, { poleTop: f.an.hand[1] - 10 }), drawFigure(f), spineGuide(f)].join("\n"));
}
// --- Sled push incorrecto: cadera alta, piernas rectas, espalda redonda
{
  let f = figure({ hip: [215, 330], lean: 78, curva: 22, cabeza: -20, legs: [{ a: 25, b: 5, pie: 92 }, { a: -14, b: -24, pie: 85 }], arms: [{ a: 150, b: 150 }, { a: 146, b: 146 }] });
  f = grounded(f);
  svg("sled-push-incorrecto", [ground(), sled(f.an.hand[0] + 4, { poleTop: f.an.hand[1] - 10 }), drawFigure(f), spineGuide(f)].join("\n"));
}
// --- Sled pull correcto: mirando al trineo (a la derecha), cadera baja, tronco hacia atrás, brazos tirando
{
  let f = figure({ hip: [250, 380], lean: -18, legs: [{ a: 40, b: -6, pie: 90 }, { a: -20, b: -2, pie: 90 }], arms: [{ a: 60, b: 92 }, { a: 72, b: 100 }] });
  f = grounded(f);
  const rope = `<path d="M${pt(f.an.hand)} Q 420 ${GROUND - 30} 470 ${GROUND - 42}" fill="none" stroke="${HUESO}" stroke-width="${SW}" stroke-linecap="round"/>`;
  const pile = path_(`M${r1(f.an.hand[0] - 20)} ${r1(f.an.hand[1] + 10)} q -40 60 -10 110 q 30 30 -20 50`);
  svg("sled-pull-correcto", [ground(), sled(470, { poles: false, w: 110 }), rope, pile, drawFigure(f), spineGuide(f)].join("\n"));
}
// --- Sled pull incorrecto: piernas rectas, espalda redonda, tira solo con brazos
{
  let f = figure({ hip: [250, 340], lean: 34, curva: 22, cabeza: -10, legs: [{ a: 8, b: 4, pie: 90 }, { a: -10, b: -6, pie: 90 }], arms: [{ a: 30, b: 120 }, { a: 40, b: 130 }] });
  f = grounded(f);
  const rope = `<path d="M${pt(f.an.hand)} Q 420 ${GROUND - 30} 470 ${GROUND - 42}" fill="none" stroke="${HUESO}" stroke-width="${SW}" stroke-linecap="round"/>`;
  svg("sled-pull-incorrecto", [ground(), sled(470, { poles: false, w: 110 }), rope, drawFigure(f), spineGuide(f)].join("\n"));
}

// --- Wall ball: pared con diana a la derecha
function wallTarget(x = 520) {
  return line([x, GROUND], [x, 170], 'opacity=".45"') + `<circle cx="${x - 2}" cy="215" r="24" fill="none" stroke="${NARANJA}" stroke-width="5"/>`;
}
{
  // correcto: sentadilla profunda, pecho arriba, balón pegado al pecho
  const base = { hip: [250, 420], lean: 26, legs: [{ a: 100, b: -22, pie: 90 }, { a: 96, b: -24, pie: 90 }] };
  const f0 = figure({ ...base, arms: [{ a: 0, b: 0 }, { a: 0, b: 0 }] });
  const c = go(go(f0.top, 90 - base.lean, 64), 0, 18);
  let f = grounded(figure({ ...base, arms: [{ to: [c[0] - 6, c[1] + 30], bend: 1 }, { to: [c[0] + 4, c[1] + 32], bend: 1 }] }));
  const dy = f.hip[1] - f0.hip[1];
  const ball = circle([c[0], c[1] + dy], 38);
  svg("wall-ball-correcto", [ground(), wallTarget(), drawFigure(f, { front: ball + layer(armSegs(f.an, f.shoulder)) }), spineGuide(f)].join("\n"));
}
{
  // incorrecto: talones arriba, tronco caído, balón lejos del cuerpo
  let f = figure({ hip: [250, 400], lean: 60, curva: 18, cabeza: -15, legs: [{ a: 86, b: 20, pie: 60 }, { a: 80, b: 14, pie: 58 }], arms: [{ a: 70, b: 110 }, { a: 76, b: 118 }] });
  f = grounded(f);
  const ball = circle([f.an.hand[0] + 34, f.an.hand[1] - 4], 40);
  svg("wall-ball-incorrecto", [ground(), wallTarget(), drawFigure(f, { front: ball }), spineGuide(f)].join("\n"));
}

// --- Sandbag lunges: saco sobre los hombros
const sandbag = (f) => {
  const c = go(f.top, -90 - f.lean, 4);
  return `<rect x="${r1(c[0] - 60)}" y="${r1(c[1] - 34)}" width="120" height="56" rx="26" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" transform="rotate(${r1(-f.lean * 0.6)} ${r1(c[0])} ${r1(c[1] - 12)})"/>`;
};
{
  let f = figure({ hip: [290, 380], lean: 4, legs: [{ a: 84, b: 0, pie: 90 }, { a: -40, b: -92, pie: 140 }], arms: [{ a: 160, b: 30 }, { a: 165, b: 40 }] });
  f = grounded(f);
  svg("sandbag-lunge-correcto", [ground(), drawFigure(f, { between: sandbag(f) }), guide([[f.ln.knee[0], f.ln.knee[1] - 30], [f.ln.knee[0], GROUND - 10]]), spineGuide(f)].join("\n"));
}
{
  let f = figure({ hip: [290, 360], lean: 40, curva: 20, cabeza: -15, legs: [{ a: 50, b: -12, pie: 90 }, { a: -24, b: -50, pie: 100 }], arms: [{ a: 150, b: 40 }, { a: 155, b: 46 }] });
  f = grounded(f);
  svg("sandbag-lunge-incorrecto", [ground(), drawFigure(f, { between: sandbag(f) }), spineGuide(f)].join("\n"));
}

// --- Farmers carry: un peso en cada mano
const kb = (h) => `${path_(`M${r1(h[0] - 14)} ${r1(h[1] + 6)} v -14 h 28 v 14`)}${rect(h[0] - 36, h[1] + 6, 72, 64, 14)}`;
{
  let f = figure({ hip: [290, 340], lean: 0, legs: [{ a: 14, b: 2, pie: 90 }, { a: -12, b: -10, pie: 90 }], arms: [{ a: 4, b: 0 }, { a: -4, b: -2 }] });
  f = grounded(f);
  svg("farmers-carry-correcto", [ground(), kb(f.af.hand), drawFigure(f, { front: kb(f.an.hand) }), spineGuide(f, 48)].join("\n"));
}
{
  let f = figure({ hip: [290, 344], lean: 14, curva: 18, cabeza: -24, legs: [{ a: 12, b: 0, pie: 90 }, { a: -10, b: -8, pie: 90 }], arms: [{ a: 24, b: 16 }, { a: 18, b: 12 }] });
  f = grounded(f);
  svg("farmers-carry-incorrecto", [ground(), kb(f.af.hand), drawFigure(f, { front: kb(f.an.hand) }), spineGuide(f, 48)].join("\n"));
}

// --- Burpee broad jump: correcto = aterrizaje con rodillas y cadera flexionadas; incorrecto = piernas rectas
{
  let f = figure({ hip: [330, 400], lean: 40, legs: [{ a: 80, b: -10, pie: 90 }, { a: 74, b: -14, pie: 90 }], arms: [{ a: 70, b: 80 }, { a: 64, b: 76 }] });
  f = grounded(f);
  const arc = guidePath(`M80 ${GROUND - 20} Q 200 ${GROUND - 260} ${r1(f.ln.toe[0] - 40)} ${GROUND - 40}`);
  svg("burpee-broad-jump-correcto", [ground(), arc, drawFigure(f)].join("\n"));
}
{
  let f = figure({ hip: [330, 330], lean: -6, legs: [{ a: 16, b: 14, pie: 90 }, { a: 8, b: 6, pie: 90 }], arms: [{ a: -30, b: -20 }, { a: -24, b: -14 }] });
  f = grounded(f);
  const arc = guidePath(`M80 ${GROUND - 20} Q 200 ${GROUND - 260} ${r1(f.ln.toe[0] - 50)} ${GROUND - 40}`);
  svg("burpee-broad-jump-incorrecto", [ground(), arc, drawFigure(f)].join("\n"));
}

// --- SkiErg: máquina a la derecha, tirador con brazos abajo y cadera atrás
function skierg(x = 470) {
  return rect(x, 60, 56, 400, 12) + line([x - 30, GROUND - 4], [x + 90, GROUND - 4]) + line([x + 28, 460], [x + 28, GROUND - 6]) + circle([x + 28, 120], 22);
}
{
  let f = figure({ hip: [290, 380], lean: 46, legs: [{ a: 46, b: -12, pie: 90 }, { a: 38, b: -16, pie: 90 }], arms: [{ a: 40, b: 30 }, { a: 46, b: 36 }] });
  f = grounded(f);
  const cord = line(f.an.hand, [470, 150]);
  svg("skierg-correcto", [ground(), skierg(), cord, drawFigure(f), spineGuide(f)].join("\n"));
}
{
  let f = figure({ hip: [300, 340], lean: 8, legs: [{ a: 6, b: 2, pie: 90 }, { a: -4, b: -4, pie: 90 }], arms: [{ a: 30, b: 100 }, { a: 36, b: 106 }] });
  f = grounded(f);
  const cord = line(f.an.hand, [470, 150]);
  svg("skierg-incorrecto", [ground(), skierg(), cord, drawFigure(f), spineGuide(f)].join("\n"));
}

// --- Remo: carril en el suelo, asiento, reposapiés a la derecha
function rower() {
  return path_(`M60 ${GROUND - 40} H500`) + line([80, GROUND - 40], [80, GROUND - 4]) + line([470, GROUND - 40], [490, GROUND - 4]) + rect(470, GROUND - 160, 80, 120, 20) + line([440, GROUND - 120], [470, GROUND - 110]);
}
{
  // correcto: final de la palada, tronco ligeramente atrás, mango a las costillas bajas
  let f = figure({ hip: [200, 470], lean: -18, legs: [{ a: 88, b: 92, pie: 170 }, { a: 86, b: 90, pie: 170 }], arms: [{ a: 20, b: 96 }, { a: 26, b: 100 }] });
  const ny = f;
  const seat = rect(f.hip[0] - 40, f.hip[1] + 20, 80, 20, 6);
  svg("remo-correcto", [ground(), rower(), seat, line(f.an.hand, [470, GROUND - 120]), drawFigure(ny), spineGuide(ny)].join("\n"));
}
{
  // incorrecto: echado muy atrás, tirando hacia el cuello
  let f = figure({ hip: [200, 470], lean: -42, curva: 12, legs: [{ a: 88, b: 92, pie: 170 }, { a: 86, b: 90, pie: 170 }], arms: [{ a: 80, b: 170 }, { a: 86, b: 176 }] });
  const seat = rect(f.hip[0] - 40, f.hip[1] + 20, 80, 20, 6);
  svg("remo-incorrecto", [ground(), rower(), seat, line(f.an.hand, [470, GROUND - 120]), drawFigure(f), spineGuide(f)].join("\n"));
}

// --- Corredor
{
  let f = figure({ hip: [290, 330], lean: 10, legs: [{ a: 50, b: -40, pie: 90 }, { a: -30, b: -90, pie: 150 }], arms: [{ a: -40, b: 70 }, { a: 50, b: 150 }] });
  f = grounded(f);
  svg("corredor", [ground(), drawFigure(f)].join("\n"));
}

// ================= CUERPO HUMANO (frontal y dorsal) =================
function frontBody(cx, back = false) {
  // Mapa muscular de línea: cada zona es una forma cerrada (clase z-<zona>) que el renderer puede rellenar.
  const z = (zona, d, mirror = true) => {
    const p = `<path class="z-${zona}" d="${d}" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    return mirror ? `<g transform="translate(${cx} 0)">${p}</g><g transform="translate(${cx} 0) scale(-1 1)">${p}</g>` : `<g transform="translate(${cx} 0)">${p}</g>`;
  };
  const hint = (d) => `<g transform="translate(${cx} 0)"><path d="${d}" fill="none" stroke="${HUESO}" stroke-width="4" stroke-linecap="round" opacity=".45"/></g>`;
  const parts = [
    `<ellipse class="z-cabeza" cx="${cx}" cy="70" rx="30" ry="36" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}"/>`,
    z("cuello", "M-14 104 L14 104 L16 126 L-16 126 Z", false),
    z("hombros", "M44 128 Q88 122 100 172 Q82 170 62 160 Q54 140 44 128 Z"),
    back ? z("espalda", "M4 132 L42 130 Q58 150 62 178 Q54 214 40 236 L4 240 Z") : z("pecho", "M4 134 L44 131 Q62 150 60 186 Q32 198 4 190 Z"),
    back ? z("lumbares", "M-36 244 L36 244 L36 288 L-36 288 Z", false) : z("core", "M-36 198 L36 198 L32 286 L-32 286 Z", false),
    back ? z("gluteos", "M2 294 L40 292 Q54 316 46 340 Q24 352 2 342 Z") : z("cadera", "M-40 292 L40 292 L46 322 L0 342 L-46 322 Z", false),
    z(back ? "triceps" : "biceps", "M64 168 L98 178 Q104 210 100 242 L74 244 Q64 206 64 168 Z"),
    z("codos", "M70 240 L102 238 Q106 245 102 252 L72 254 Q68 247 70 240 Z"),
    z("antebrazos", "M74 252 L102 250 Q112 286 112 320 L92 324 Q78 290 74 252 Z"),
    z("manos", "M90 332 L114 328 Q122 346 112 362 Q98 366 92 352 Z"),
    z(back ? "isquios" : "cuadriceps", "M6 350 L48 334 Q62 384 56 440 L18 444 Q6 396 6 350 Z"),
    z("rodillas", "M14 444 L56 440 Q60 448 56 456 L16 458 Q12 450 14 444 Z"),
    z("gemelos", "M18 454 L54 452 Q60 496 48 538 L26 538 Q14 496 18 454 Z"),
    z("pies", "M24 546 L50 546 L64 562 L22 562 Z"),
    back ? hint("M0 140 V 284") : hint("M0 214 V 276 M-30 226 H30 M-30 252 H30"),
  ];
  return parts.join("");
}
svg("cuerpo-zonas", [frontBody(160), frontBody(440, true), `<text x="160" y="596" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="26" letter-spacing="4" fill="#8E8E93">DELANTE</text><text x="440" y="596" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="26" letter-spacing="4" fill="#8E8E93">DETRÁS</text>`].join("\n"));

// ================= OBJETOS =================
// Corazón con pulsaciones
svg(
  "corazon",
  [
    `<path d="M300 470 C 210 400 120 330 120 240 C 120 170 170 130 225 130 C 262 130 288 150 300 180 C 312 150 338 130 375 130 C 430 130 480 170 480 240 C 480 330 390 400 300 470 Z" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" stroke-linejoin="round" class="z-corazon"/>`,
    `<polyline class="guia" points="60,300 190,300 225,300 250,230 280,380 310,260 335,300 540,300" fill="none" stroke="${NARANJA}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join("\n"),
);
// Depósito de glucógeno (tanque con niveles). Zonas: nivel-1..nivel-4 (de abajo arriba)
{
  const parts = [`<rect x="190" y="90" width="220" height="430" rx="34" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}"/>`, rect(260, 56, 80, 34, 8)];
  for (let i = 0; i < 4; i++) {
    const y = 506 - (i + 1) * 100;
    parts.push(`<rect class="z-nivel-${i + 1}" x="210" y="${y + 4}" width="180" height="88" rx="16" fill="${FONDO}" stroke="${HUESO}" stroke-width="4" opacity=".9"/>`);
  }
  parts.push(`<text x="300" y="580" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="28" letter-spacing="4" fill="#8E8E93">GLUCÓGENO</text>`);
  svg("deposito-glucogeno", parts.join("\n"));
}
// Cronómetro
svg(
  "cronometro",
  [
    rect(270, 50, 60, 36, 8),
    line([300, 86], [300, 116]),
    line([420, 130], [446, 104]),
    `<circle cx="300" cy="330" r="210" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" class="z-esfera"/>`,
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      const r0 = i % 3 === 0 ? 168 : 182;
      return `<line x1="${r1(300 + Math.sin(a) * r0)}" y1="${r1(330 - Math.cos(a) * r0)}" x2="${r1(300 + Math.sin(a) * 196)}" y2="${r1(330 - Math.cos(a) * 196)}" stroke="${HUESO}" stroke-width="${i % 3 === 0 ? 6 : 4}" stroke-linecap="round"/>`;
    }),
    `<path class="z-tramo" d="M300 330 L300 150 A180 180 0 0 1 455.9 420 Z" fill="${NARANJA}" fill-opacity=".18" stroke="none"/>`,
    `<line x1="300" y1="330" x2="${r1(300 + Math.sin((120 * Math.PI) / 180) * 150)}" y2="${r1(330 - Math.cos((120 * Math.PI) / 180) * 150)}" stroke="${NARANJA}" stroke-width="8" stroke-linecap="round" class="guia"/>`,
    `<circle cx="300" cy="330" r="12" fill="${HUESO}"/>`,
  ].join("\n"),
);
// Plato: tres sectores (z-carbohidratos, z-proteina, z-verdura) + cubiertos
svg(
  "plato",
  [
    `<circle cx="300" cy="300" r="205" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}"/>`,
    `<path class="z-carbohidratos" d="M300 300 L300 130 A170 170 0 0 1 447.2 385 Z" fill="${FONDO}" stroke="${HUESO}" stroke-width="4"/>`,
    `<path class="z-proteina" d="M300 300 L447.2 385 A170 170 0 0 1 152.8 385 Z" fill="${FONDO}" stroke="${HUESO}" stroke-width="4"/>`,
    `<path class="z-verdura" d="M300 300 L152.8 385 A170 170 0 0 1 300 130 Z" fill="${FONDO}" stroke="${HUESO}" stroke-width="4"/>`,
    path_("M50 140 V 250 M32 140 V 200 Q 50 222 68 200 V 140 M50 250 V 480"),
    path_("M550 140 Q 512 220 534 300 H 550 V 480"),
  ].join("\n"),
);
// Cama / sueño
svg(
  "cama",
  [
    path_(`M60 200 V ${GROUND} M60 400 H540 V ${GROUND} M60 330 H540 V 400`),
    `<rect x="80" y="290" width="120" height="44" rx="20" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}"/>`,
    `<path d="M200 330 Q 230 270 320 285 L 540 300 V 332 H 200 Z" fill="${FONDO}" stroke="${HUESO}" stroke-width="${SW}" stroke-linejoin="round" class="z-manta"/>`,
    circle([180, 268], 30),
    `<g class="guia" fill="none" stroke="${NARANJA}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M300 200 h34 l-34 40 h34"/><path d="M360 140 h44 l-44 52 h44"/><path d="M432 70 h56 l-56 66 h56"/></g>`,
  ].join("\n"),
);

// ================= OCR =================
// Muro: figura colgada del borde con un talón arriba
{
  const wall = rect(330, 90, 140, GROUND - 90, 4);
  let f = figure({ hip: [250, 330], lean: 20, legs: [{ a: 120, b: 40, pie: 120 }, { a: 30, b: 10, pie: 90 }], arms: [{ a: 150, b: 168 }, { a: 140, b: 160 }] });
  const dx = 336 - f.an.hand[0];
  const dy = 92 - f.an.hand[1];
  const mv = (o) => (Array.isArray(o) && typeof o[0] === "number" ? [o[0] + dx, o[1] + dy] : typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mv(v)])) : o);
  f = mv(f);
  svg("ocr-muro", [ground(), wall, drawFigure(f), guidePath(`M${r1(f.ln.ankle[0] - 30)} ${r1(f.ln.ankle[1] + 90)} q 40 -40 ${r1(330 - f.ln.ankle[0] + 40)} -110`)].join("\n"));
}
// Monkey bars: barra horizontal con peldaños, figura colgada
{
  const bars = path_(`M40 60 H560 M80 60 V${GROUND} M520 60 V${GROUND}`) + [140, 210, 280, 350, 420, 490].map((x) => circle([x, 60], 9)).join("");
  let f = figure({ hip: [300, 360], lean: -4, legs: [{ a: 14, b: -6, pie: 70 }, { a: -10, b: -24, pie: 60 }], arms: [{ a: 160, b: 172 }, { a: 196, b: 188 }] });
  const dx = 280 - f.an.hand[0];
  const dy = 68 - f.an.hand[1];
  const mv = (o) => (Array.isArray(o) && typeof o[0] === "number" ? [o[0] + dx, o[1] + dy] : typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mv(v)])) : o);
  f = mv(f);
  svg("ocr-monkey-bars", [ground(), bars, drawFigure(f), guidePath(`M${r1(f.hip[0] - 60)} ${r1(f.hip[1] + 30)} q 60 30 120 0`)].join("\n"));
}
// Cuerda: figura con bloqueo de pies (cuerda entre los pies)
{
  const ropeX = 300;
  let f = figure({ hip: [270, 330], lean: -6, legs: [{ a: 70, b: -10, pie: 100 }, { a: 60, b: -16, pie: 100 }], arms: [{ a: 170, b: 178 }, { a: 168, b: 176 }] });
  const dx = ropeX - f.an.hand[0];
  const mv = (o) => (Array.isArray(o) && typeof o[0] === "number" ? [o[0] + dx, o[1] - 40] : typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mv(v)])) : o);
  f = mv(f);
  const rope = `<path d="M${ropeX} 20 V ${r1(f.ln.ankle[1] - 10)} q 10 30 -6 50 q -14 20 6 40 V ${GROUND}" fill="none" stroke="${HUESO}" stroke-width="12" stroke-linecap="round"/>`;
  svg("ocr-cuerda", [ground(), rope, drawFigure(f), guide([[ropeX + 70, f.ln.ankle[1] - 10], [ropeX + 40, f.ln.ankle[1] + 20]])].join("\n"));
}

console.log(`Ilustraciones generadas en ${OUT}`);
