// Carga de posts (instagram/posts/*.json), validación y post dinámico de calendario.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { POSTS_DIR } from "./config.mjs";

export const PILARES = ["estaciones", "entrenamiento", "errores", "ocr", "nutricion", "producto", "comunidad"];
export const AFFILIATE_NOTICE = "Como afiliado de Amazon, gano con las compras que cumplen los requisitos.";
export const CTA_TITULO = "Guárdalo para tu próximo entreno";
export const CTA_TEXTO = "Más guías en hybridracehub.com · enlace en la bio";

export function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => ({ ...JSON.parse(readFileSync(path.join(POSTS_DIR, f), "utf8")), __file: f }));
}

/** Caption final tal y como se publica */
export const fullCaption = (post) => `${post.caption.trim()}\n\n${post.hashtags.join(" ")}`;

const BANNED = [/descubre/i, /sum[eé]rgete/i, /desbloquea/i, /apasionante mundo/i, /la clave del [eé]xito/i, /vamos all[aá]/i, /—/];
const EMOJI = /\p{Extended_Pictographic}/gu;

/** Lista de errores del post (vacía si es válido) */
export function validatePost(p) {
  const e = [];
  const req = (cond, msg) => !cond && e.push(msg);
  req(typeof p.id === "string" && /^[0-9]{3}-[a-z0-9-]+$/.test(p.id), "id inválido (formato 001-slug)");
  req(p.__file === undefined || p.__file === `${p.id}.json`, `el archivo debe llamarse ${p.id}.json`);
  req(PILARES.includes(p.pilar), `pilar inválido: ${p.pilar}`);
  req(Array.isArray(p.slides) && p.slides.length >= 5 && p.slides.length <= 8, "debe tener entre 5 y 8 slides");
  if (!Array.isArray(p.slides)) return e;
  req(p.slides[0]?.tipo === "portada", "la primera slide debe ser portada");
  req(p.slides.at(-1)?.tipo === "cta", "la última slide debe ser cta");
  p.slides.forEach((s, i) => {
    const n = `slide ${i + 1}`;
    req(["portada", "punto", "cita", "cta"].includes(s.tipo), `${n}: tipo inválido ${s.tipo}`);
    if (s.tipo === "portada") {
      req(s.titulo && s.titulo.replace(/\*/g, "").length <= 60, `${n}: portada.titulo vacío o > 60 caracteres`);
    }
    if (s.tipo === "punto") {
      req(/^\d{2}$/.test(s.numero || ""), `${n}: punto.numero debe ser "01".."99"`);
      req(s.titulo, `${n}: punto.titulo vacío`);
      req(s.texto && s.texto.replace(/\*/g, "").length <= 260, `${n}: punto.texto vacío o > 260 caracteres`);
    }
    if (s.tipo === "cita") req(s.texto, `${n}: cita.texto vacío`);
    if (s.tipo === "cta") req(s.titulo && s.texto, `${n}: cta sin titulo/texto`);
    const all = [s.titulo, s.subtitulo, s.texto].filter(Boolean).join(" ");
    const marks = all.match(/\*[^*]+\*/g) || [];
    req(marks.length <= 1, `${n}: más de una palabra destacada`);
    req(marks.every((m) => !/\s/.test(m.slice(1, -1))), `${n}: el destacado debe ser una sola palabra`);
    req(!EMOJI.test(all), `${n}: sin emojis en las imágenes`);
    EMOJI.lastIndex = 0;
    for (const b of BANNED) req(!b.test(all), `${n}: expresión prohibida ${b}`);
  });
  req(Array.isArray(p.alt_text) && p.alt_text.length === p.slides.length && p.alt_text.every((a) => a && a.length <= 1000), "alt_text: uno por slide");
  req(typeof p.caption === "string" && p.caption.length > 0, "caption vacío");
  if (typeof p.caption === "string") {
    req(fullCaption(p).length <= 2000, `caption + hashtags > 2000 caracteres (${fullCaption(p).length})`);
    req(p.caption.split("\n")[0].length < 125, "la primera línea del caption debe tener < 125 caracteres");
    req((p.caption.match(EMOJI) || []).length <= 2, "máximo 2 emojis en el caption");
    req(/hybridracehub\.com/.test(p.caption), "el caption debe mencionar hybridracehub.com");
    req(/\?/.test(p.caption), "el caption debe incluir una pregunta");
    for (const b of BANNED) req(!b.test(p.caption), `caption: expresión prohibida ${b}`);
    if (p.pilar === "producto") req(p.caption.includes(AFFILIATE_NOTICE), "producto: falta el aviso de afiliado");
  }
  req(Array.isArray(p.hashtags) && p.hashtags.length >= 3 && p.hashtags.length <= 5, "entre 3 y 5 hashtags");
  req((p.hashtags || []).every((h) => /^#[\p{L}\p{N}_]+$/u.test(h)), "hashtags mal formados");
  req(!p.url_destino || /^\/[a-z0-9\-/]*$/.test(p.url_destino), "url_destino debe ser una ruta /…");
  return e;
}

// ---------- Calendario dinámico ----------

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const ciudadDe = (r) => r.municipio || (r.ubicacion ? r.ubicacion.split(",").pop().trim() : null) || r.provincia || "";
const dm = (iso) => {
  const [, m, d] = iso.split("-").map(Number);
  return { d, m: m - 1 };
};

/** Post de calendario a partir de las carreras (ya filtradas y ordenadas, 2-7) */
export function buildCalendarPost(races, todayISO, toISO) {
  const a = dm(todayISO);
  const b = dm(toISO);
  const rango = a.m === b.m ? `Del ${a.d} al ${b.d} de ${MESES_LARGO[b.m]}` : `Del ${a.d} de ${MESES_LARGO[a.m]} al ${b.d} de ${MESES_LARGO[b.m]}`;
  const carreras = races.map((r) => {
    const { d, m } = dm(r.fecha_iso);
    return { dia: String(d).padStart(2, "0"), mes: MESES[m], nombre: r.nombre, ciudad: ciudadDe(r), modalidad: r.modalidad || "" };
  });
  const lines = races.map((r) => {
    const { d, m } = dm(r.fecha_iso);
    return `${d} ${MESES[m].toLowerCase()} · ${r.nombre} · ${ciudadDe(r)}`;
  });
  return {
    id: `calendario-${todayISO}`,
    pilar: "calendario",
    slides: [
      { tipo: "portada", titulo: "Próximas carreras híbridas", subtitulo: `${rango}. Lo que viene en las próximas tres semanas.` },
      { tipo: "calendario", titulo: "Próximas carreras", subtitulo: rango, carreras },
      { tipo: "cta", titulo: "¿Ya tienes dorsal?", texto: "Calendario completo en hybridracehub.com · enlace en la bio" },
    ],
    alt_text: [
      "Portada: próximas carreras híbridas de las tres próximas semanas.",
      `Lista de ${races.length} carreras: ${lines.join("; ")}.`,
      "Cierre: calendario completo en hybridracehub.com.",
    ],
    caption: [
      "Lo que viene en las próximas tres semanas.",
      "",
      ...lines,
      "",
      "Fechas sacadas de nuestro calendario. Confirma siempre en la web oficial antes de inscribirte.",
      "",
      "¿A cuál vas? Cuéntalo en comentarios.",
      "",
      "Calendario completo en hybridracehub.com (enlace en la bio)",
    ].join("\n"),
    hashtags: ["#carrerashibridas", "#hyroxspain", "#ocrspain", "#calendariocarreras"],
  };
}
