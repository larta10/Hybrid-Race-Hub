// Guiones de Reel (instagram/reels/*.json): carga, validación y estado de preparación.
// Sin dependencias de Remotion: lo usan publish.mjs y validate.mjs desde la raíz.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./config.mjs";
import { PILARES, fullCaption } from "./posts.mjs";
import { scriptSeconds } from "../../../video/src/timeline.js";

export const REELS_DIR = path.join(ROOT, "instagram/reels");
const GRAFICAS = ["barras", "agrupadas", "linea", "area", "contador", "comparativa", "donut"];
const BANNED = [/descubre/i, /sum[eé]rgete/i, /desbloquea/i, /apasionante mundo/i, /la clave del [eé]xito/i, /vamos all[aá]/i, /—/, /la ciencia (demuestra|ha demostrado)/i];
const EMOJI = /\p{Extended_Pictographic}/gu;
const words = (t) => String(t).replace(/\*/g, "").split(/\s+/).filter(Boolean).length;
const surname = (autores) => String(autores).trim().split(/[ ,]/)[0].toLowerCase();

export function loadReels() {
  if (!existsSync(REELS_DIR)) return [];
  return readdirSync(REELS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
    .map((f) => ({ ...JSON.parse(readFileSync(path.join(REELS_DIR, f), "utf8")), __file: f }));
}

export const loadCalendarClips = () => {
  const f = path.join(REELS_DIR, "_calendario.json");
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
};

const clipOk = (c) => Boolean(c?.sin_clip || (c?.fuente && c?.id && c?.archivo && c?.revisado === true));
const slots = (r) => [...(r.escenas || []).map((e) => e.clip), ...(r.clip_final ? [r.clip_final] : [])];

/**
 * Un reel se publica solo si todos sus clips están revisados a ojo y el control de calidad
 * del vídeo final está hecho (qa_ok). Si no, ese día sale el carrusel del mismo tema.
 */
export function reelReady(r) {
  const pendientes = slots(r).filter((c) => !clipOk(c)).length;
  const motivos = [];
  if (pendientes) motivos.push(`${pendientes} clip(s) sin elegir o sin revisar`);
  if (r.qa_ok !== true) motivos.push("control de calidad del vídeo pendiente (qa_ok)");
  return { listo: motivos.length === 0, motivos };
}

export function calendarReady() {
  const cal = loadCalendarClips();
  if (!cal) return { listo: false, motivos: ["falta instagram/reels/_calendario.json"] };
  const pendientes = cal.escenas.filter((e) => !clipOk(e.clip)).length;
  const motivos = pendientes ? [`${pendientes} clip(s) de competición sin revisar`] : [];
  if (cal.qa_ok !== true) motivos.push("control de calidad del vídeo pendiente (qa_ok)");
  return { listo: motivos.length === 0, motivos };
}

/** Errores del guion (lista vacía si es válido). post: el carrusel de origen, para cruzar fuentes */
export function validateReel(r, post) {
  const e = [];
  const req = (c, m) => !c && e.push(m);
  req(/^r\d{3}-[a-z0-9-]+$/.test(r.id || ""), "id inválido (formato r101-slug)");
  req(!r.__file || r.__file === `${r.id}.json`, `el archivo debe llamarse ${r.id}.json`);
  req(PILARES.includes(r.pilar), `pilar inválido: ${r.pilar}`);
  req(post, `no existe el carrusel ${r.post_carrusel_id}`);
  if (post) {
    req(post.pilar === r.pilar, "el pilar debe coincidir con el del carrusel");
    req(r.id === `r${post.id}`, "el id debe ser r + id del carrusel");
  }
  const seg = scriptSeconds(r);
  req(seg >= 20 && seg <= 40, `duración ${seg} s fuera de 20-40 s`);
  req(Math.abs((r.duracion_objetivo || 0) - seg) <= 1, `duracion_objetivo (${r.duracion_objetivo}) no cuadra con las escenas (${seg} s)`);
  req(typeof r.gancho === "string" && words(r.gancho) <= 7, "gancho vacío o de más de 7 palabras");
  req(Array.isArray(r.escenas) && r.escenas.length >= 4 && r.escenas.length <= 7, "entre 4 y 7 escenas (gancho, problema y 2-4 de explicación)");
  req(Array.isArray(r.conclusion) && r.conclusion.length === 2, "conclusión: 2 líneas");
  req(Array.isArray(r.aplicacion) && r.aplicacion.length === 3, "aplicación: 3 puntos");
  (r.aplicacion || []).forEach((p, i) => req(words(p) <= 8, `aplicación ${i + 1}: más de 8 palabras`));
  req(typeof r.portada_segundo === "number" && r.portada_segundo >= 0 && r.portada_segundo < seg, "portada_segundo fuera del vídeo");

  const fuentes = post?.fuentes || [];
  const apellidos = fuentes.map((f) => surname(f.autores));
  const checkFuente = (txt, donde, ilustrativo = false) => {
    if (ilustrativo) return req(/^(Elaboración propia|Esquema basado en|Ejemplo basado en)/.test(txt || ""), `${donde}: un ejemplo ilustrativo cita "Elaboración propia", "Esquema basado en…" o "Ejemplo basado en…"`);
    const f = String(txt || "").toLowerCase();
    req(apellidos.some((a) => a && f.includes(a)) && fuentes.some((x) => f.includes(String(x.anio))), `${donde}: la fuente "${txt}" no es una de las fuentes verificadas del carrusel`);
  };

  (r.escenas || []).forEach((s, i) => {
    const n = `escena ${i + 1}`;
    req(typeof s.duracion === "number" && s.duracion >= 1.5 && s.duracion <= 5, `${n}: duración entre 1,5 y 5 s`);
    if (i === 0) req(s.duracion <= 2 && !s.grafica, `${n}: el gancho dura como mucho 2 s y no lleva gráfica`);
    req(s.clip && typeof s.clip.query === "string", `${n}: falta clip.query`);
    const textos = s.texto || [];
    textos.forEach((t, k) => req(words(t) <= 7, `${n}: la frase ${k + 1} tiene más de 7 palabras`));
    // Una gráfica son dos cambios: entra la tarjeta y después se construyen los datos
    const cambios = textos.length + (s.grafica ? 2 : 0);
    if (i > 0) req(cambios >= 1 && s.duracion / cambios <= 3, `${n}: necesita un cambio visual cada 3 s como mucho`);
    if (s.grafica) {
      const g = s.grafica;
      req(GRAFICAS.includes(g.tipo), `${n}: tipo de gráfica inválido (${g.tipo})`);
      req(["estudio", "ilustrativo"].includes(g.etiqueta), `${n}: etiqueta "estudio" o "ilustrativo"`);
      req(g.titulo, `${n}: gráfica sin título`);
      req(textos.length <= 1, `${n}: con gráfica, como mucho 1 frase`);
      req(s.duracion >= 3.5, `${n}: una gráfica necesita al menos 3,5 s (la fuente visible 2,5 s o más)`);
      checkFuente(g.fuente, n, g.etiqueta === "ilustrativo");
      if (g.tipo === "barras") req(Array.isArray(g.barras) && g.barras.length >= 2 && g.barras.length <= 5, `${n}: 2-5 barras`);
      if (g.tipo === "agrupadas") req(g.series?.length === 2 && g.grupos?.every((x) => x.valores?.length === 2), `${n}: 2 series y 2 valores por grupo`);
      if (g.tipo === "linea" || g.tipo === "area") req(g.series?.[0]?.valores?.length === g.x?.length, `${n}: un valor por cada x`);
      if (g.tipo === "comparativa") req(g.a && g.b && typeof g.a.valor === "number" && typeof g.b.valor === "number", `${n}: faltan a/b`);
      if (g.tipo === "donut") req(g.valor >= 0 && g.valor <= 100, `${n}: donut entre 0 y 100`);
      if (g.tipo === "contador") req(typeof g.valor === "number" || g.texto_cifra, `${n}: contador sin valor`);
    }
    if (s.fuente) {
      req(s.duracion >= 2.5, `${n}: la fuente debe verse al menos 2,5 s`);
      checkFuente(s.fuente, n);
    }
    for (const m of s.musculo || []) {
      req(m.nombre, `${n}: músculo sin nombre`);
      if (m.clip) {
        req(m.clip === `${s.clip?.fuente}-${s.clip?.id}`, `${n}: el músculo ${m.nombre} se colocó para otro clip`);
        req(typeof m.x === "number" && typeof m.y === "number" && m.x >= 0 && m.x <= 1 && m.y >= 0 && m.y <= 1, `${n}: coordenadas de ${m.nombre} entre 0 y 1`);
      }
    }
    const all = JSON.stringify(s);
    req(!EMOJI.test(all), `${n}: sin emojis en el vídeo`);
    EMOJI.lastIndex = 0;
    for (const b of BANNED) req(!b.test(all), `${n}: expresión prohibida ${b}`);
  });

  // Caption: mismas reglas que los carruseles + crédito del vídeo
  const cap = r.caption;
  req(typeof cap === "string" && cap.length > 0, "caption vacío");
  if (typeof cap === "string") {
    req(fullCaption(r).length <= 2200, `caption + hashtags > 2200 caracteres (${fullCaption(r).length})`);
    req(cap.split("\n")[0].length < 125, "la primera línea del caption debe tener < 125 caracteres");
    req((cap.match(EMOJI) || []).length <= 2, "máximo 2 emojis en el caption");
    req(cap.includes("Más en hybridracehub.com (enlace en la bio)"), 'falta "Más en hybridracehub.com (enlace en la bio)"');
    req(/\?/.test(cap), "el caption debe incluir una pregunta");
    req(/\nVídeo: Pixabay\s*$/.test(cap), 'el caption debe terminar con "Vídeo: Pixabay" (la música CC BY se añade al publicar)');
    req(!/carrusel|desliza/i.test(cap), "el caption habla de carrusel o de deslizar");
    if (fuentes.length) {
      req(/\nFuentes?:/.test(cap), 'falta el bloque "Fuentes:"');
      for (const f of fuentes) req(cap.includes(String(f.anio)) && cap.toLowerCase().includes(surname(f.autores)), `caption: falta la fuente ${f.autores} (${f.anio})`);
    }
    for (const b of BANNED) req(!b.test(cap), `caption: expresión prohibida ${b}`);
  }
  req(Array.isArray(r.hashtags) && r.hashtags.length >= 3 && r.hashtags.length <= 5, "entre 3 y 5 hashtags");
  return e;
}
