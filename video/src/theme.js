// Identidad visual de los Reels. Mismos colores y tipografías que los carruseles.
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  hueso: "#F2F0EB",
  acero: "#6B8CAE",
  naranja: "#FB923C", // solo para el dato clave
  tinta: "#0B0C0F",
  tarjeta: "rgba(11, 12, 15, 0.85)",
  linea: "rgba(242, 240, 235, 0.18)",
  suave: "rgba(242, 240, 235, 0.68)",
};

export const F = {
  titular: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  texto: "'Barlow', Arial, sans-serif",
};

// Zona segura de Instagram: nada importante en el 10 % superior, el 18 % inferior
// ni en los 140 px de la derecha (botones de me gusta, comentar, compartir).
export const SAFE = {
  top: Math.round(H * 0.1), // 192
  bottom: Math.round(H * 0.82), // 1574
  left: 72,
  right: W - 140, // 940
};
SAFE.width = SAFE.right - SAFE.left; // 868
SAFE.height = SAFE.bottom - SAFE.top;

// Curvas suaves (sin rebotes): ease-out exponencial y spring muy amortiguado
export const SPRING = { damping: 200, stiffness: 120, mass: 0.9 };
export const easeOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (t) => Math.max(0, Math.min(1, t));

/** Número en formato español: 16.13 → "16,13" */
export function fmt(n, decimales = null) {
  const d = decimales ?? (Number.isInteger(n) ? 0 : String(n).split(".")[1]?.length || 0);
  const s = Number(n).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: Math.abs(n) >= 10000 });
  return s.replace("-", "−").replace(/^−(0(,0+)?)$/, "$1"); // signo menos tipográfico y sin "−0"
}

/** Divide "texto con *dato*" en trozos {t, destacado} */
export function partes(texto) {
  return String(texto)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((t) => (t.startsWith("*") && t.endsWith("*") ? { t: t.slice(1, -1), destacado: true } : { t, destacado: false }));
}

/** Palabras con su marca de destacado (para animar palabra a palabra) */
export function palabras(texto) {
  const out = [];
  let finConEspacio = true;
  for (const p of partes(texto)) {
    // Un signo pegado al trozo anterior ("*fuerza*?") va con esa palabra, sin destacar
    const pegado = !finConEspacio && !/^\s/.test(p.t) && out.length > 0;
    finConEspacio = /\s$/.test(p.t);
    p.t.split(/\s+/).filter(Boolean).forEach((w, i) => {
      if (i === 0 && pegado) out[out.length - 1].sufijo = (out[out.length - 1].sufijo || "") + w;
      else out.push({ w, destacado: p.destacado });
    });
  }
  return out;
}
