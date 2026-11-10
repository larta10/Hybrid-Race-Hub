// Biblioteca de poses del monigote de técnica (vista lateral, mirando a la derecha).
// JS puro: lo usan Monigote.jsx y el validador (scripts/instagram/lib/reels.mjs).
//
// Ángulos articulares en grados (por pierna/brazo: número para los dos lados o [derecho, izquierdo]):
//   tronco  inclinación del tronco respecto a la vertical (+ hacia delante, − hacia atrás)
//   curva   espalda redondeada (0 = neutra; 0,05-0,08 = muy redonda), solo para el "así no"
//   cabeza  inclinación extra de la cabeza (+ hacia delante)
//   cadera  flexión de cadera: el muslo respecto a la prolongación del tronco (+ muslo hacia delante)
//   rodilla flexión de rodilla (0 = estirada)
//   tobillo dorsiflexión (0 = pie a 90° de la tibia; − = de puntillas)
//   hombro  flexión de hombro: el brazo respecto al tronco (0 = colgando, 90 = al frente, 180 = arriba)
//   codo    flexión de codo (0 = estirado)
// Apoyo: "suelo" (el punto más bajo de pies y manos toca el suelo), "asiento" (cadera sobre el carro del remo)
// o "libre" (cadera a la altura fija `y`, por ejemplo colgado de la cuerda). `dx`/`dy` desplazan el cuerpo.
//
// Longitudes en fracción de la altura del atleta (1 = 1,75 m aprox.).

export const L = { tronco: 0.3, cuello: 0.045, cabeza: 0.06, muslo: 0.245, tibia: 0.245, pie: 0.075, talon: 0.02, brazo: 0.17, antebrazo: 0.155 };

const R = Math.PI / 180;
/** Vector unitario para un ángulo medido desde la vertical hacia abajo (+ hacia delante = +x) */
const dir = (a) => [Math.sin(a * R), Math.cos(a * R)];
const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
const lado = (v, i) => (Array.isArray(v) ? v[i] : v ?? 0);

/** Puntos del esqueleto (unidades de altura, y hacia abajo) para una pose ya interpolada */
export function esqueleto(p, apoyo = "suelo") {
  const t = p.tronco || 0;
  const cadera = [0, 0];
  const arriba = [Math.sin(t * R), -Math.cos(t * R)];
  const hombro = add(cadera, arriba, L.tronco);
  const ca = (p.cabeza || 0) + t;
  const cuello = add(hombro, [Math.sin(ca * R), -Math.cos(ca * R)], L.cuello);
  const cabeza = add(cuello, [Math.sin(ca * R), -Math.cos(ca * R)], L.cabeza);
  const piernas = [0, 1].map((i) => {
    const am = -t + lado(p.cadera, i);
    const rodilla = add(cadera, dir(am), L.muslo);
    const at = am - lado(p.rodilla, i);
    const tobillo = add(rodilla, dir(at), L.tibia);
    const ap = at + 90 + lado(p.tobillo, i);
    const punta = add(tobillo, dir(ap), L.pie - L.talon);
    const talon = add(tobillo, dir(ap), -L.talon);
    return { rodilla, tobillo, punta, talon };
  });
  const brazos = [0, 1].map((i) => {
    const ab = -t + lado(p.hombro, i);
    const codo = add(hombro, dir(ab), L.brazo);
    const mano = add(codo, dir(ab + lado(p.codo, i)), L.antebrazo);
    return { codo, mano };
  });
  const pts = { cadera, hombro, cuello, cabeza, piernas, brazos };
  // Colocación: el punto más bajo en el suelo (y = 0), o la cadera en el asiento / a una altura fija
  let oy;
  if (apoyo === "suelo") {
    const ys = [...piernas.flatMap((l) => [l.punta[1], l.talon[1], l.rodilla[1]]), ...brazos.map((b) => b.mano[1])];
    oy = -Math.max(...ys);
  } else oy = apoyo === "asiento" ? -0.2 : -(p.y ?? 0.6);
  return mover(pts, p.dx || 0, oy - (p.dy || 0));
}

function mover(o, dx, dy) {
  if (Array.isArray(o) && typeof o[0] === "number") return [o[0] + dx, o[1] + dy];
  if (Array.isArray(o)) return o.map((x) => mover(x, dx, dy));
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mover(v, dx, dy)]));
}

// ---------- Interpolación ----------
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mezcla = (a, b, k) => {
  if (Array.isArray(a) || Array.isArray(b)) return [0, 1].map((i) => lado(a, i) + (lado(b, i) - lado(a, i)) * k);
  return (a ?? 0) + ((b ?? 0) - (a ?? 0)) * k;
};
const CLAVES = ["tronco", "curva", "cabeza", "cadera", "rodilla", "tobillo", "hombro", "codo", "dx", "dy", "y"];

/** Pose en la fase f (0-1) de una secuencia de keyframes [{t, ...ángulos}] que vuelve al primero */
export function poseEn(frames, f) {
  const fr = [...frames, { ...frames[0], t: 1 }];
  const x = ((f % 1) + 1) % 1;
  let k = 0;
  while (k < fr.length - 2 && x >= fr[k + 1].t) k++;
  const a = fr[k];
  const b = fr[k + 1];
  const u = easeInOut(Math.min(1, Math.max(0, (x - a.t) / Math.max(1e-6, b.t - a.t))));
  const out = {};
  for (const c of CLAVES) if (a[c] !== undefined || b[c] !== undefined) out[c] = mezcla(a[c], b[c], u);
  // Datos no interpolables (implemento suelto, etc.): los del keyframe de partida
  out.balon = a.balon && b.balon !== undefined ? mezcla(a.balon, b.balon, u) : a.balon ?? null;
  return out;
}

/** Ángulo (0-180) en el vértice b del segmento a-b-c, en grados */
export function anguloEn(a, b, c) {
  const v1 = [a[0] - b[0], a[1] - b[1]];
  const v2 = [c[0] - b[0], c[1] - b[1]];
  const d = Math.hypot(...v1) * Math.hypot(...v2) || 1;
  return Math.round(Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / d))) / R);
}

// ---------- Ciclos de piernas y brazos ----------
/** Zancada: [derecha, izquierda] en contrafase. Los ángulos del ciclo son del muslo respecto a la vertical;
 *  se les suma la inclinación del tronco para obtener la flexión de cadera */
const zancada = (fase, { amp = 1, tronco = 0 } = {}) => {
  const ciclo = [
    { cadera: 35, rodilla: 50, tobillo: 5 },
    { cadera: 10, rodilla: 20, tobillo: 5 },
    { cadera: -18, rodilla: 15, tobillo: -25 },
    { cadera: -5, rodilla: 95, tobillo: -10 },
  ];
  const der = ciclo[fase % 4];
  const izq = ciclo[(fase + 2) % 4];
  return {
    cadera: [der.cadera * amp + tronco, izq.cadera * amp + tronco],
    rodilla: [der.rodilla * amp, izq.rodilla * amp],
    tobillo: [der.tobillo, izq.tobillo],
  };
};

// ---------- Biblioteca ----------
// Cada pose: nombre, ciclo (s por repetición), apoyo, implemento, frames (así sí) y error (así no, opcional).
// marcas: las que se muestran por defecto si el guion no indica otras.
export const POSES = {
  wall_ball: {
    nombre: "Wall ball",
    ciclo: 2.4,
    implemento: "balon",
    diana: true,
    frames: [
      // Sentadilla profunda con el balón pegado al pecho
      { t: 0, tronco: 28, cadera: 112, rodilla: 118, tobillo: 32, hombro: 35, codo: 125, balon: 0 },
      // Extensión explosiva: piernas lanzan, brazos acompañan
      { t: 0.38, tronco: 4, cadera: 4, rodilla: 4, tobillo: -12, hombro: 120, codo: 60, balon: 0 },
      { t: 0.5, tronco: 2, cadera: 0, rodilla: 0, tobillo: -18, hombro: 170, codo: 8, balon: 0.6 },
      // El balón sube a la diana y vuelve; se recibe y se baja a la sentadilla
      { t: 0.68, tronco: 2, cadera: 0, rodilla: 2, tobillo: 0, hombro: 150, codo: 30, balon: 1 },
      { t: 0.84, tronco: 10, cadera: 40, rodilla: 45, tobillo: 15, hombro: 70, codo: 100, balon: 0 },
    ],
    error: [
      // Talones arriba, balón lejos del pecho y sentadilla corta: lanzan los hombros
      { t: 0, tronco: 42, cadera: 95, rodilla: 70, tobillo: -22, hombro: 75, codo: 25, balon: 0 },
      { t: 0.38, tronco: 18, cadera: 25, rodilla: 30, tobillo: -25, hombro: 110, codo: 20, balon: 0 },
      { t: 0.5, tronco: 10, cadera: 8, rodilla: 10, tobillo: -25, hombro: 165, codo: 10, balon: 0.6 },
      { t: 0.68, tronco: 10, cadera: 10, rodilla: 12, tobillo: -15, hombro: 140, codo: 30, balon: 1 },
      { t: 0.84, tronco: 30, cadera: 60, rodilla: 45, tobillo: -20, hombro: 80, codo: 30, balon: 0 },
    ],
    marcas: [{ tipo: "angulo", articulacion: "rodilla" }, { tipo: "trayectoria" }],
  },

  sled_push: {
    nombre: "Sled push",
    ciclo: 1.1,
    implemento: "trineo",
    suelo_movil: true,
    frames: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: 45, hombro: 128, codo: 18, ...zancada(k, { amp: 1.25, tronco: 45 }) })),
    error: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: 68, curva: 0.07, cabeza: 20, hombro: 95, codo: 70, ...zancada(k, { amp: 0.45, tronco: 68 }), rodilla: [8, 12] })),
    marcas: [{ tipo: "angulo", articulacion: "tronco" }, { tipo: "espalda" }],
  },

  sled_pull: {
    nombre: "Sled pull",
    ciclo: 1.2,
    implemento: "cuerda_trineo",
    frames: [
      // Cadera baja, peso atrás; mano sobre mano
      { t: 0, tronco: -18, cadera: 75, rodilla: 85, tobillo: 30, hombro: [85, 35], codo: [5, 95] },
      { t: 0.5, tronco: -18, cadera: 75, rodilla: 85, tobillo: 30, hombro: [35, 85], codo: [95, 5] },
    ],
    error: [
      // De pie y tirando solo con los brazos
      { t: 0, tronco: 12, curva: 0.05, cadera: 10, rodilla: 8, tobillo: 0, hombro: [80, 30], codo: [10, 110] },
      { t: 0.5, tronco: 12, curva: 0.05, cadera: 10, rodilla: 8, tobillo: 0, hombro: [30, 80], codo: [110, 10] },
    ],
    marcas: [{ tipo: "angulo", articulacion: "rodilla" }, { tipo: "espalda" }],
  },

  sandbag_lunge: {
    nombre: "Sandbag lunges",
    ciclo: 2.2,
    implemento: "saco",
    frames: [
      // Arriba: piernas abiertas, tronco vertical
      { t: 0, tronco: 0, cadera: [32, -18], rodilla: [8, 10], tobillo: [0, -35], hombro: 165, codo: 150 },
      // Abajo: rodilla delantera a 90°, la de atrás casi roza el suelo
      { t: 0.5, tronco: 2, cadera: [92, -14], rodilla: [92, 100], tobillo: [6, -40], hombro: 165, codo: 150 },
    ],
    error: [
      { t: 0, tronco: 25, curva: 0.05, cadera: [55, -18], rodilla: [10, 10], tobillo: [0, -35], hombro: 160, codo: 150 },
      { t: 0.5, tronco: 35, curva: 0.06, cadera: [120, -10], rodilla: [70, 60], tobillo: [-10, -40], hombro: 160, codo: 150 },
    ],
    marcas: [{ tipo: "angulo", articulacion: "rodilla" }, { tipo: "espalda" }],
  },

  farmers_carry: {
    nombre: "Farmers carry",
    ciclo: 1.0,
    implemento: "pesas",
    frames: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: 0, cabeza: 0, hombro: [4, -4], codo: 0, ...zancada(k, { amp: 0.42 }) })),
    error: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: 14, curva: 0.06, cabeza: 22, hombro: [14, 10], codo: 0, ...zancada(k, { amp: 0.42, tronco: 14 }) })),
    marcas: [{ tipo: "espalda" }],
  },

  remo: {
    nombre: "Remo",
    ciclo: 2.4,
    implemento: "remo",
    apoyo: "asiento",
    frames: [
      // Catch: tibias verticales, brazos largos, tronco algo adelante
      { t: 0, tronco: 28, cadera: 150, rodilla: 140, tobillo: 25, hombro: 118, codo: 0 },
      // Drive: empujan las piernas, brazos aún largos
      { t: 0.22, tronco: 18, cadera: 118, rodilla: 70, tobillo: 0, hombro: 105, codo: 0 },
      // Finish: piernas estiradas, tronco atrás, manos al esternón
      { t: 0.42, tronco: -18, cadera: 72, rodilla: 4, tobillo: -15, hombro: -45, codo: 125 },
      // Recovery: brazos, tronco y después piernas
      { t: 0.62, tronco: 18, cadera: 100, rodilla: 6, tobillo: -15, hombro: 100, codo: 0 },
    ],
    error: [
      // Espalda redonda y tirando de brazos antes de que acaben las piernas
      { t: 0, tronco: 48, curva: 0.07, cabeza: 15, cadera: 165, rodilla: 145, tobillo: 25, hombro: 105, codo: 0 },
      { t: 0.22, tronco: 40, curva: 0.07, cadera: 140, rodilla: 90, tobillo: 10, hombro: 50, codo: 90 },
      { t: 0.42, tronco: 5, curva: 0.05, cadera: 85, rodilla: 4, tobillo: -15, hombro: -30, codo: 120 },
      { t: 0.62, tronco: 30, curva: 0.06, cadera: 110, rodilla: 30, tobillo: -5, hombro: 95, codo: 10 },
    ],
    marcas: [{ tipo: "espalda" }, { tipo: "angulo", articulacion: "rodilla" }],
  },

  ski_erg: {
    nombre: "SkiErg",
    ciclo: 1.6,
    implemento: "skierg",
    frames: [
      // Arriba: brazos altos, de puntillas suave
      { t: 0, tronco: 2, cadera: 4, rodilla: 8, tobillo: -6, hombro: 168, codo: 15 },
      // Tirón: bisagra de cadera, manos a los muslos
      { t: 0.4, tronco: 48, cadera: 62, rodilla: 32, tobillo: 18, hombro: 18, codo: 12 },
    ],
    error: [
      // Solo brazos: el tronco no se mueve y se hunde con las rodillas
      { t: 0, tronco: 4, cadera: 4, rodilla: 8, tobillo: -6, hombro: 168, codo: 15 },
      { t: 0.4, tronco: 10, cadera: 45, rodilla: 70, tobillo: 30, hombro: 25, codo: 60 },
    ],
    marcas: [{ tipo: "angulo", articulacion: "cadera" }, { tipo: "trayectoria" }],
  },

  burpee_broad_jump: {
    nombre: "Burpee broad jump",
    ciclo: 3.2,
    implemento: null,
    frames: [
      { t: 0, tronco: 2, cadera: 0, rodilla: 2, tobillo: 0, hombro: 10, codo: 10, dx: 0 },
      // Al suelo: manos apoyadas y plancha
      { t: 0.14, tronco: 60, cadera: 110, rodilla: 110, tobillo: 30, hombro: 60, codo: 5, dx: 0 },
      { t: 0.26, tronco: 88, cadera: 2, rodilla: 0, tobillo: -10, hombro: 88, codo: 5, dx: -0.15 },
      // Pies a las manos y carga del salto
      { t: 0.42, tronco: 45, cadera: 115, rodilla: 115, tobillo: 35, hombro: -35, codo: 10, dx: 0 },
      // Vuelo hacia delante
      { t: 0.58, tronco: 15, cadera: 30, rodilla: 30, tobillo: -15, hombro: 150, codo: 10, dx: 0.35, dy: 0.18 },
      // Aterrizaje amortiguado: cadera y rodillas flexionadas
      { t: 0.74, tronco: 38, cadera: 100, rodilla: 100, tobillo: 30, hombro: 45, codo: 20, dx: 0.7 },
      { t: 0.9, tronco: 4, cadera: 2, rodilla: 4, tobillo: 0, hombro: 10, codo: 10, dx: 0.7 },
    ],
    error: [
      { t: 0, tronco: 2, cadera: 0, rodilla: 2, tobillo: 0, hombro: 10, codo: 10, dx: 0 },
      { t: 0.14, tronco: 60, cadera: 110, rodilla: 110, tobillo: 30, hombro: 60, codo: 5, dx: 0 },
      { t: 0.26, tronco: 88, curva: 0.04, cadera: -12, rodilla: 0, tobillo: -10, hombro: 88, codo: 5, dx: -0.15 },
      { t: 0.42, tronco: 30, cadera: 60, rodilla: 50, tobillo: 10, hombro: 0, codo: 10, dx: 0 },
      { t: 0.58, tronco: 10, cadera: 15, rodilla: 10, tobillo: -15, hombro: 120, codo: 10, dx: 0.3, dy: 0.12 },
      // Aterrizaje con las piernas rectas
      { t: 0.74, tronco: 12, cadera: 12, rodilla: 6, tobillo: 5, hombro: 60, codo: 20, dx: 0.6 },
      { t: 0.9, tronco: 4, cadera: 2, rodilla: 4, tobillo: 0, hombro: 10, codo: 10, dx: 0.6 },
    ],
    marcas: [{ tipo: "angulo", articulacion: "rodilla" }],
  },

  carrera: {
    nombre: "Postura de carrera",
    ciclo: 0.75,
    implemento: null,
    suelo_movil: true,
    frames: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: 8, cabeza: -6, hombro: [[35, -10, -35, -10][k], [-35, -10, 35, -10][k]], codo: 85, ...zancada(k, { tronco: 8 }) })),
    error: [0, 1, 2, 3].map((k) => ({ t: k / 4, tronco: -6, cabeza: 6, hombro: [[45, 0, -20, 0][k], [-20, 0, 45, 0][k]], codo: 40, ...zancada(k), cadera: [[55, 20, -10, 0][k], [-10, 0, 55, 20][k]], rodilla: [[8, 15, 15, 90][k], [15, 90, 8, 15][k]] })),
    marcas: [{ tipo: "angulo", articulacion: "tronco" }],
  },

  cuerda: {
    nombre: "Subida de cuerda",
    ciclo: 2.6,
    implemento: "cuerda",
    apoyo: "libre",
    frames: [
      // Colgado: agarre alto y brazos largos
      { t: 0, tronco: -4, cadera: 5, rodilla: 5, tobillo: -20, hombro: 172, codo: 5, y: 0.75 },
      // Rodillas al pecho
      { t: 0.3, tronco: -8, cadera: 105, rodilla: 115, tobillo: 10, hombro: 170, codo: 30, y: 0.68 },
      // Bloqueo: un pie pisa la cuerda sobre el otro y las piernas se estiran: subes
      { t: 0.6, tronco: -2, cadera: 20, rodilla: 10, tobillo: 0, hombro: 175, codo: 95, y: 0.95 },
      // Manos más arriba y repetir
      { t: 0.85, tronco: -4, cadera: 15, rodilla: 10, tobillo: 0, hombro: 175, codo: 10, y: 0.85 },
    ],
    error: [
      // A pulso: las piernas cuelgan y suben solo los brazos
      { t: 0, tronco: -4, cadera: 5, rodilla: 10, tobillo: -25, hombro: 172, codo: 5, y: 0.75 },
      { t: 0.4, tronco: -4, cadera: 15, rodilla: 25, tobillo: -25, hombro: 160, codo: 120, y: 0.95 },
      { t: 0.7, tronco: -4, cadera: 10, rodilla: 20, tobillo: -25, hombro: 172, codo: 20, y: 0.82 },
    ],
    marcas: [{ tipo: "angulo", articulacion: "rodilla" }],
  },
};

export const nombresPoses = () => Object.keys(POSES);
