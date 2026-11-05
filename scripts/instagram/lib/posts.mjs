// Carga de posts (instagram/posts/*.json), validación y post dinámico de calendario.
// Esquema v2: carruseles de 7-10 slides con gráficas/ilustraciones y fuentes verificadas.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { POSTS_DIR } from "./config.mjs";
import { CHART_TYPES, VISUAL_TYPES, SLIDE_TYPES, svgZones } from "./design.mjs";

export const PILARES = ["estaciones", "entrenamiento", "errores", "ocr", "nutricion", "producto", "comunidad"];
export const AFFILIATE_NOTICE = "Como afiliado de Amazon, gano con las compras que cumplen los requisitos.";

/** Posts activos: solo los .json de la raíz de instagram/posts (se ignoran _legacy/ y _publicados/) */
export function loadPosts() {
  return readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".json") && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort()
    .map((f) => ({ ...JSON.parse(readFileSync(path.join(POSTS_DIR, f), "utf8")), __file: f }));
}

/** Caption final tal y como se publica */
export const fullCaption = (post) => `${post.caption.trim()}\n\n${post.hashtags.join(" ")}`;

const BANNED = [/descubre/i, /sum[eé]rgete/i, /desbloquea/i, /apasionante mundo/i, /la clave del [eé]xito/i, /vamos all[aá]/i, /—/, /la ciencia (demuestra|ha demostrado)/i];
const EMOJI = /\p{Extended_Pictographic}/gu;

// Límites de caracteres por campo (sin contar los asteriscos del destacado)
const LIM = {
  "portada.titulo": 48,
  "portada.subtitulo": 110,
  "contexto.titulo": 50,
  "contexto.texto": 300,
  "grafica.titulo": 50,
  "grafica.texto": 140,
  "grafica.lectura": 140,
  "conclusion.linea": 26,
  "conclusion.texto": 150,
  "aplicacion.punto": 120,
  "ilustracion.titulo": 50,
  "ilustracion.texto": 200,
  "ci.texto": 110,
  "cta.titulo": 40,
  "cta.texto": 80,
};
const len = (v) => String(v ?? "").replace(/\*/g, "").length;
const DOI = /^10\.\d{4,9}\/\S+$/;
const surname = (autores) => String(autores).trim().split(/[ ,]/)[0].toLowerCase();

/** Lista de errores del post (vacía si es válido) */
export function validatePost(p) {
  const e = [];
  const req = (cond, msg) => !cond && e.push(msg);
  const lim = (v, key, where) => req(len(v) <= LIM[key], `${where}: ${key} > ${LIM[key]} caracteres (${len(v)})`);
  req(typeof p.id === "string" && /^[0-9]{3}-[a-z0-9-]+$/.test(p.id), "id inválido (formato 001-slug)");
  req(p.__file === undefined || p.__file === `${p.id}.json`, `el archivo debe llamarse ${p.id}.json`);
  req(PILARES.includes(p.pilar), `pilar inválido: ${p.pilar}`);
  req(typeof p.titulo_interno === "string" && p.titulo_interno.trim(), "falta titulo_interno (título corto para PROGRESO.md)");
  req(Array.isArray(p.slides) && p.slides.length >= 7 && p.slides.length <= 10, "debe tener entre 7 y 10 slides");
  if (!Array.isArray(p.slides)) return e;
  const tipos = p.slides.map((s) => s.tipo);
  req(tipos[0] === "portada", "la primera slide debe ser portada");
  req(tipos.at(-1) === "cta", "la última slide debe ser cta");
  req(tipos.some((t) => VISUAL_TYPES.includes(t)), "debe tener al menos una gráfica o ilustración");
  req(tipos.includes("conclusion"), "falta la slide de conclusión");
  req(tipos.includes("aplicacion"), "falta la slide de aplicación práctica");

  // ---- Fuentes ----
  req(p.fuentes === undefined || Array.isArray(p.fuentes), "fuentes debe ser una lista");
  const fuentes = Array.isArray(p.fuentes) ? p.fuentes : [];
  fuentes.forEach((f, i) => {
    const n = `fuente ${i + 1}`;
    for (const k of ["autores", "titulo", "revista", "que_dice", "limitaciones"]) req(typeof f[k] === "string" && f[k].trim(), `${n}: falta ${k}`);
    req(Number.isInteger(f.anio) && f.anio > 1950 && f.anio <= 2026, `${n}: anio inválido`);
    req(f.verificado === true, `${n}: verificado debe ser true (si no está comprobada, no se cita)`);
    req((f.doi && DOI.test(f.doi)) || (f.pmid && /^\d{6,9}$/.test(String(f.pmid))), `${n}: necesita un doi (10.xxxx/...) o un pmid válido`);
  });
  const citaEstudio = p.slides.some((s) => s.etiqueta === "estudio") || fuentes.length > 0;
  if (citaEstudio) {
    req(fuentes.some((f) => f.verificado === true && (f.doi || f.pmid)), "cita un estudio pero no tiene ninguna fuente verificada con doi o pmid");
    req(tipos.includes("referencias"), "cita estudios: falta la slide de referencias");
  }
  req(!tipos.includes("referencias") || fuentes.length > 0, "slide de referencias sin fuentes");
  const apellidos = fuentes.map((f) => surname(f.autores));

  p.slides.forEach((s, i) => {
    const n = `slide ${i + 1} (${s.tipo})`;
    req(SLIDE_TYPES.includes(s.tipo) && s.tipo !== "calendario", `${n}: tipo inválido`);
    if (s.tipo === "portada") {
      req(s.titulo, `${n}: falta titulo`);
      lim(s.titulo, "portada.titulo", n);
      lim(s.subtitulo, "portada.subtitulo", n);
    }
    if (s.tipo === "contexto") {
      req(s.titulo && s.texto, `${n}: falta titulo o texto`);
      lim(s.titulo, "contexto.titulo", n);
      lim(s.texto, "contexto.texto", n);
    }
    if (CHART_TYPES.includes(s.tipo)) {
      req(s.titulo, `${n}: falta titulo`);
      lim(s.titulo, "grafica.titulo", n);
      lim(s.texto, "grafica.texto", n);
      lim(s.lectura, "grafica.lectura", n);
      req(["estudio", "ilustrativo"].includes(s.etiqueta), `${n}: etiqueta debe ser "estudio" o "ilustrativo"`);
      req(typeof s.fuente === "string" && s.fuente.trim(), `${n}: falta la línea de fuente`);
      if (s.etiqueta === "estudio" && s.fuente) {
        const f = s.fuente.toLowerCase();
        req(apellidos.some((a) => a && f.includes(a)), `${n}: la fuente "${s.fuente}" no corresponde a ninguna fuente del post`);
        req(fuentes.some((x) => f.includes(String(x.anio))), `${n}: la fuente debe incluir el año del estudio`);
      }
      if (s.etiqueta === "ilustrativo") req(/^(Elaboración propia|Esquema basado en|Ejemplo basado en)/.test(s.fuente || ""), `${n}: la fuente de un ejemplo ilustrativo empieza por "Elaboración propia", "Esquema basado en" o "Ejemplo basado en"`);
    }
    if (s.tipo === "grafica_linea" || s.tipo === "grafica_area") {
      req(Array.isArray(s.series) && s.series.length >= 1 && s.series.length <= 2, `${n}: 1 o 2 series`);
      req((s.x || []).length >= 2 && s.x.length <= 10, `${n}: entre 2 y 10 puntos en x`);
      req((s.series || []).every((se) => se.nombre && Array.isArray(se.valores) && se.valores.length === (s.x || []).length && se.valores.every((v) => typeof v === "number")), `${n}: cada serie necesita nombre y un valor numérico por cada x`);
    }
    if (s.tipo === "grafica_barras") req(Array.isArray(s.barras) && s.barras.length >= 2 && s.barras.length <= 8 && s.barras.every((b) => b.etiqueta && typeof b.valor === "number"), `${n}: 2-8 barras con etiqueta y valor`);
    if (s.tipo === "barras_agrupadas") req(Array.isArray(s.grupos) && s.grupos.length >= 2 && s.grupos.length <= 5 && Array.isArray(s.series) && s.series.length === 2 && s.grupos.every((g) => g.valores?.length === 2), `${n}: 2-5 grupos con 2 valores y 2 series`);
    if (s.tipo === "comparativa") req(s.a && s.b && s.a.valor !== undefined && s.b.valor !== undefined, `${n}: faltan a/b con valor`);
    if (s.tipo === "donut" || s.tipo === "porcentaje") req(typeof s.valor === "number" && s.valor >= 0 && s.valor <= 100, `${n}: valor entre 0 y 100`);
    if (s.tipo === "linea_temporal") req(Array.isArray(s.fases) && s.fases.length >= 2 && s.fases.length <= 6, `${n}: 2-6 fases`);
    if (s.tipo === "tabla") {
      req(Array.isArray(s.columnas) && s.columnas.length >= 2 && s.columnas.length <= 3, `${n}: 2-3 columnas`);
      req(Array.isArray(s.filas) && s.filas.length >= 1 && s.filas.length <= 5 && s.filas.every((r) => r.length === s.columnas.length), `${n}: 1-5 filas con una celda por columna`);
    }
    if (s.tipo === "dato_grande") req(s.cifra && s.texto, `${n}: falta cifra o texto`);
    if (s.tipo === "conclusion") {
      req(Array.isArray(s.lineas) && s.lineas.length >= 1 && s.lineas.length <= 3, `${n}: 1-3 líneas`);
      (s.lineas || []).forEach((l) => lim(l, "conclusion.linea", n));
      lim(s.texto, "conclusion.texto", n);
    }
    if (s.tipo === "aplicacion") {
      req(Array.isArray(s.puntos) && s.puntos.length === 3, `${n}: exactamente 3 puntos`);
      (s.puntos || []).forEach((x) => lim(x, "aplicacion.punto", n));
    }
    if (s.tipo === "ilustracion") {
      req(s.svg && s.titulo, `${n}: falta svg o titulo`);
      lim(s.titulo, "ilustracion.titulo", n);
      lim(s.texto, "ilustracion.texto", n);
    }
    if (s.tipo === "correcto_incorrecto") {
      req(s.titulo && s.correcto?.svg && s.incorrecto?.svg, `${n}: falta titulo o las dos ilustraciones`);
      lim(s.correcto?.texto, "ci.texto", n);
      lim(s.incorrecto?.texto, "ci.texto", n);
    }
    for (const name of [s.svg, s.correcto?.svg, s.incorrecto?.svg].filter(Boolean)) req(svgZones(name), `${n}: no existe la ilustración ${name}.svg`);
    if (s.tipo === "cta") {
      req(s.titulo && s.texto, `${n}: cta sin titulo/texto`);
      lim(s.titulo, "cta.titulo", n);
      lim(s.texto, "cta.texto", n);
    }
    const textos = [s.titulo, s.subtitulo, s.texto, ...(s.lineas || [])].filter(Boolean).join(" ");
    const marks = textos.match(/\*[^*]+\*/g) || [];
    req(marks.length <= 1, `${n}: más de una palabra destacada`);
    req(marks.every((m) => !/\s/.test(m.slice(1, -1))), `${n}: el destacado debe ser una sola palabra`);
    const all = JSON.stringify(s);
    req(!EMOJI.test(all), `${n}: sin emojis en las imágenes`);
    EMOJI.lastIndex = 0;
    for (const b of BANNED) req(!b.test(all), `${n}: expresión prohibida ${b}`);
  });

  req(Array.isArray(p.alt_text) && p.alt_text.length === p.slides.length && p.alt_text.every((a) => a && a.length <= 1000), "alt_text: uno por slide (≤ 1000 caracteres)");
  req(typeof p.caption === "string" && p.caption.length > 0, "caption vacío");
  if (typeof p.caption === "string") {
    req(fullCaption(p).length <= 2200, `caption + hashtags > 2200 caracteres (${fullCaption(p).length})`);
    req(p.caption.split("\n")[0].length < 125, "la primera línea del caption debe tener < 125 caracteres");
    req((p.caption.match(EMOJI) || []).length <= 2, "máximo 2 emojis en el caption");
    req(p.caption.includes("Más en hybridracehub.com (enlace en la bio)"), 'el caption debe incluir "Más en hybridracehub.com (enlace en la bio)"');
    req(/\?/.test(p.caption), "el caption debe incluir una pregunta");
    if (fuentes.length) {
      req(/\nFuentes?:/.test(p.caption), 'el caption debe incluir el bloque "Fuentes:"');
      for (const f of fuentes) req(p.caption.includes(String(f.anio)) && p.caption.toLowerCase().includes(surname(f.autores)), `caption: falta la fuente ${f.autores} (${f.anio})`);
    }
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
      { tipo: "portada", titulo: "Próximas carreras *híbridas*", subtitulo: `${rango}. Lo que viene en las próximas tres semanas.`, cifra: String(races.length), cifra_texto: races.length === 1 ? "carrera en el calendario" : "carreras en el calendario" },
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
