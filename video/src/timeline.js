// Línea de tiempo de un Reel a partir de su guion (instagram/reels/*.json).
// JS puro: lo usan la composición de Remotion, el render y el validador.
export const FPS = 30;
export const DUR_CONCLUSION = 3;
export const DUR_APLICACION = 4.5;
export const DUR_CIERRE = 2;

/** Fotograma del pulso de la música más cercano (los cambios caen en el ritmo) */
export function snapper(bpm, offset = 0) {
  if (!bpm) return (f) => Math.round(f);
  const beat = (FPS * 60) / bpm;
  const off = offset * FPS;
  return (f) => Math.round(off + Math.round((f - off) / beat) * beat);
}

/**
 * Segmentos [{tipo, desde, hasta, escena?, items?}] en fotogramas.
 * Escenas del guion → conclusión → qué hacer → tarjeta final.
 */
export function buildTimeline(reel, music = {}) {
  const snap = snapper(music.bpm, music.offset);
  const segs = [];
  let t = 0; // segundos acumulados (sin redondear, para no arrastrar error)
  const push = (tipo, dur, extra) => {
    const desde = segs.length ? segs[segs.length - 1].hasta : 0;
    t += dur;
    const hasta = Math.max(desde + 12, snap(t * FPS));
    segs.push({ tipo, desde, hasta, ...extra });
  };
  (reel.escenas || []).forEach((escena, i) => push(i === 0 ? "gancho" : escena.grafica ? "grafica" : "texto", escena.duracion, { escena, i }));
  push("conclusion", DUR_CONCLUSION, { lineas: reel.conclusion });
  push("aplicacion", DUR_APLICACION, { puntos: reel.aplicacion });
  push("cierre", DUR_CIERRE, {});

  // Reparto de las frases de cada escena, también en el ritmo
  for (const s of segs) {
    const textos = s.escena?.texto || [];
    if (!textos.length || s.tipo === "gancho") continue;
    const len = s.hasta - s.desde;
    s.items = textos.map((texto, k) => {
      const desde = k === 0 ? s.desde : Math.min(s.hasta - 12, snap(s.desde + (len * k) / textos.length));
      return { texto, desde };
    });
    s.items.forEach((it, k) => (it.hasta = k + 1 < s.items.length ? s.items[k + 1].desde : s.hasta));
  }
  return segs;
}

export const totalFrames = (segs) => segs[segs.length - 1].hasta;

/** Duración teórica del guion en segundos (sin ajustar al ritmo) */
export const scriptSeconds = (reel) => (reel.escenas || []).reduce((a, e) => a + e.duracion, 0) + DUR_CONCLUSION + DUR_APLICACION + DUR_CIERRE;

// ---------- Calendario dinámico (lunes) ----------
export function buildCalendarTimeline(n, music = {}) {
  const snap = snapper(music.bpm, music.offset);
  const lista = Math.max(8, 3 + n * 0.75);
  const plan = [["gancho", 2], ["lista", lista], ["conclusion", 3], ["cierre", DUR_CIERRE]];
  let t = 0;
  const segs = [];
  for (const [tipo, d] of plan) {
    const desde = segs.length ? segs[segs.length - 1].hasta : 0;
    t += d;
    segs.push({ tipo, desde, hasta: snap(t * FPS) });
  }
  return segs;
}
