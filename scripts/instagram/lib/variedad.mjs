// Reglas de variedad del metraje de los Reels (las comprueba npm run ig:validate y las usa fetch-clips).
// JS puro y sin dependencias: lo importan la raíz (validate) y video/scripts (fetch-clips).
export const VENTANA = 30; // ningún clip se repite en los 30 reels siguientes de la cola
export const MIN_CLIPS = 5; // clips distintos por reel (escenas + fondo final)
export const MIN_VISUAL = 0.8; // escenas con vídeo real o monigote de técnica

export const claveClip = (c) => (c && !c.sin_clip && c.fuente && c.id ? `${c.fuente}-${c.id}` : null);
/** En cola: ni publicado ni descartado (los que salieron como carrusel no se publicarán como reel) */
export const enCola = (r) => !r.publicado && !r.descartado;
export const conVisual = (e) => Boolean(claveClip(e.clip) || e.tecnica);
export const soloTexto = (e) => !conVisual(e) && !e.grafica;

/** Claves de todos los clips del reel (escenas y fondo final), con repeticiones */
export const clipsDe = (r) => [...(r.escenas || []).flatMap((e) => [e.clip, ...(e.cortes || [])]), r.clip_final].map(claveClip).filter(Boolean);

/** Errores de variedad de un reel solo (sin mirar la cola) */
export function variedadReel(r) {
  const e = [];
  const esc = r.escenas || [];
  const vis = esc.filter(conVisual).length;
  if (vis / Math.max(1, esc.length) < MIN_VISUAL) e.push(`variedad: ${vis} de ${esc.length} escenas con vídeo real o monigote (mínimo ${Math.round(MIN_VISUAL * 100)} %)`);
  esc.forEach((s, i) => i > 0 && soloTexto(s) && soloTexto(esc[i - 1]) && e.push(`variedad: escenas ${i} y ${i + 1} seguidas de solo texto`));
  const ks = clipsDe(r);
  const rep = [...new Set(ks.filter((k, i) => ks.indexOf(k) !== i))];
  if (rep.length) e.push(`variedad: clip repetido dentro del reel (${rep.join(", ")})`);
  if (new Set(ks).size < MIN_CLIPS) e.push(`variedad: ${new Set(ks).size} clips distintos (mínimo ${MIN_CLIPS})`);
  return e;
}

/**
 * Errores por reel (Map id → [errores]). reels: todos los r###, en cualquier orden.
 * Solo cuentan los que siguen en cola, ordenados por número.
 */
export function variedadCola(reels) {
  const cola = reels.filter(enCola).sort((a, b) => a.id.localeCompare(b.id));
  const out = new Map(cola.map((r) => [r.id, variedadReel(r)]));
  cola.forEach((r, i) => {
    const mios = new Set(clipsDe(r));
    for (const s of cola.slice(i + 1, i + 1 + VENTANA)) {
      const comunes = clipsDe(s).filter((k) => mios.has(k));
      if (comunes.length) out.get(s.id).push(`variedad: repite ${[...new Set(comunes)].join(", ")} de ${r.id} (ventana de ${VENTANA} reels)`);
    }
  });
  return out;
}

/** Clips ocupados por otros reels de la cola (para no proponerlos como candidatos) */
export function clipsOcupados(reels, idPropio) {
  return new Set(reels.filter((r) => enCola(r) && r.id !== idPropio).flatMap(clipsDe));
}
