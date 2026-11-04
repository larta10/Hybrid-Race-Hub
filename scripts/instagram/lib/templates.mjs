// Plantillas de slide (1080x1350) como árbol de elementos para satori.
// Estética editorial: fondo casi negro, retícula tenue, naranja solo en detalles.
import { fit, measure, ellipsize, FONT } from "./text.mjs";
import { SITE } from "./config.mjs";

export const W = 1080;
export const H = 1350;
const M = 96;
const CW = W - 2 * M; // 888
const TOP = 186; // bajo la cabecera
const CH = H - TOP - 186; // 978: alto útil entre cabecera y pie

export const C = {
  bg: "#0B0C0F",
  grid: "#16181D",
  text: "#F2F0EB",
  muted: "#8E8E93",
  accent: "#FB923C",
  rule: "#2A2C33",
};

export const PILARES = {
  estaciones: "Estaciones",
  entrenamiento: "Entrenamiento",
  errores: "Errores y mitos",
  ocr: "OCR",
  nutricion: "Nutrición y recuperación",
  producto: "Material",
  comunidad: "Comunidad",
  calendario: "Calendario",
};

const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.flat().filter((c) => c !== null && c !== undefined && c !== false) },
});

const font = (key) => ({ fontFamily: FONT[key].family, fontWeight: FONT[key].weight });

/** Pinta un bloque ya ajustado por fit(): una fila por línea, palabra destacada en naranja */
function textBlock(f, color, extra = {}) {
  const space = measure(" ", f.font, f.size, f.letterSpacing);
  return h(
    "div",
    { flexDirection: "column", ...extra },
    f.lines.map((line) =>
      h(
        "div",
        { height: f.size * f.lineHeight, alignItems: "center", ...font(f.font), fontSize: f.size, letterSpacing: f.letterSpacing, color, whiteSpace: "nowrap" },
        line.map((t, i) => {
          const mr = i < line.length - 1 ? space : 0;
          if (!t.parts) return h("span", { color, marginRight: mr }, t.text);
          return h("span", { marginRight: mr }, t.parts.map((p) => h("span", { color: p.hi ? C.accent : color }, p.text)));
        }),
      ),
    ),
  );
}

const accentLine = (width = 120) => h("div", { width, height: 6, backgroundColor: C.accent });
const gap = (n) => h("div", { height: n, flexShrink: 0 });

function grid() {
  const lines = [];
  for (let x = 90; x < W; x += 90) lines.push(h("div", { position: "absolute", left: x, top: 0, width: 1, height: H, backgroundColor: C.grid }));
  for (let y = 90; y < H; y += 90) lines.push(h("div", { position: "absolute", left: 0, top: y, width: W, height: 1, backgroundColor: C.grid }));
  return lines;
}

const arrow = () => ({
  type: "svg",
  props: {
    width: 44,
    height: 20,
    viewBox: "0 0 44 20",
    children: [{ type: "path", props: { d: "M0 10 H40 M31 2 L41 10 L31 18", stroke: C.text, strokeWidth: 3, fill: "none" } }],
  },
});

const bookmark = () => ({
  type: "svg",
  props: {
    width: 64,
    height: 84,
    viewBox: "0 0 64 84",
    children: [{ type: "path", props: { d: "M4 4 H60 V80 L32 58 L4 80 Z", stroke: C.text, strokeWidth: 5, fill: "none", strokeLinejoin: "miter" } }],
  },
});

function frame(content, { index, total, pilar, cover }) {
  const label = (PILARES[pilar] || "").toUpperCase();
  return h(
    "div",
    { position: "relative", width: W, height: H, backgroundColor: C.bg },
    grid(),
    // Cabecera
    h(
      "div",
      { position: "absolute", top: M - 6, left: M, width: CW, height: 36, justifyContent: "space-between", alignItems: "center" },
      h("div", { ...font("cond-600"), fontSize: 26, letterSpacing: 6, color: C.text }, "HYBRID RACE HUB"),
      h("div", { ...font("cond-600"), fontSize: 26, letterSpacing: 3, color: C.muted }, `${index}/${total}`),
    ),
    // Contenido
    h("div", { position: "absolute", top: TOP, left: M, width: CW, height: CH, flexDirection: "column" }, content),
    // Pie
    h(
      "div",
      { position: "absolute", bottom: M - 6, left: M, width: CW, height: 36, justifyContent: "space-between", alignItems: "center" },
      h("div", { ...font("body-500"), fontSize: 26, color: C.muted }, SITE),
      cover
        ? h("div", { alignItems: "center", ...font("cond-600"), fontSize: 28, letterSpacing: 5, color: C.text }, h("span", { marginRight: 16 }, "DESLIZA"), arrow())
        : h("div", { ...font("cond-600"), fontSize: 24, letterSpacing: 4, color: C.muted }, label),
    ),
  );
}

// ---------- Plantillas ----------

function portada(s, ctx) {
  const issues = [];
  const kicker = h("div", { ...font("cond-600"), fontSize: 30, letterSpacing: 5, color: C.muted, height: 36, alignItems: "center" }, (PILARES[ctx.pilar] || "").toUpperCase());
  const title = fit(s.titulo, { font: "cond-800", max: 172, min: 80, maxWidth: CW, maxHeight: 600, lineHeight: 1, upper: true });
  if (title.overflow) issues.push("portada.titulo no cabe");
  const used = 36 + 28 + 6 + 48 + title.height + 44;
  const sub = s.subtitulo ? fit(s.subtitulo, { font: "body-500", max: 44, min: 36, maxWidth: CW, maxHeight: Math.min(320, CH - used), lineHeight: 1.35 }) : null;
  if (sub?.overflow) issues.push("portada.subtitulo no cabe");
  const el = h(
    "div",
    { flexDirection: "column", justifyContent: "flex-end", height: CH },
    kicker,
    gap(28),
    accentLine(),
    gap(48),
    textBlock(title, C.text),
    sub && gap(44),
    sub && textBlock(sub, C.muted),
  );
  return { el, issues };
}

function punto(s) {
  const issues = [];
  const numH = 128;
  const title = fit(s.titulo, { font: "cond-800", max: 104, min: 60, maxWidth: CW, maxHeight: 340, lineHeight: 1, upper: true });
  if (title.overflow) issues.push("punto.titulo no cabe");
  const rest = CH - numH - 44 - title.height - 40 - 2 - 40;
  const text = fit(s.texto, { font: "body-400", max: 44, min: 38, maxWidth: CW, maxHeight: rest, lineHeight: 1.35 });
  if (text.overflow) issues.push("punto.texto no cabe");
  const el = h(
    "div",
    { flexDirection: "column", height: CH },
    h("div", { ...font("cond-800"), fontSize: 150, lineHeight: 1, height: numH, color: C.accent, alignItems: "center", marginTop: -8 }, s.numero),
    gap(44),
    textBlock(title, C.text),
    gap(40),
    h("div", { width: 120, height: 2, backgroundColor: C.rule }),
    gap(40),
    textBlock(text, C.text),
  );
  return { el, issues };
}

function cita(s) {
  const issues = [];
  const quote = fit(s.texto, { font: "cond-700", max: 92, min: 52, maxWidth: CW, maxHeight: 560, lineHeight: 1.08 });
  if (quote.overflow) issues.push("cita.texto no cabe");
  const el = h(
    "div",
    { flexDirection: "column", justifyContent: "center", height: CH },
    accentLine(80),
    gap(56),
    textBlock(quote, C.text),
    s.autor ? gap(40) : null,
    s.autor ? h("div", { ...font("body-500"), fontSize: 30, letterSpacing: 3, color: C.muted }, s.autor.toUpperCase()) : null,
  );
  return { el, issues };
}

function cta(s) {
  const issues = [];
  const title = fit(s.titulo, { font: "cond-800", max: 150, min: 80, maxWidth: CW, maxHeight: 520, lineHeight: 1, upper: true });
  if (title.overflow) issues.push("cta.titulo no cabe");
  const text = s.texto ? fit(s.texto, { font: "body-500", max: 44, min: 36, maxWidth: CW, maxHeight: 200, lineHeight: 1.35 }) : null;
  if (text?.overflow) issues.push("cta.texto no cabe");
  const el = h(
    "div",
    { flexDirection: "column", justifyContent: "flex-end", height: CH },
    bookmark(),
    gap(56),
    textBlock(title, C.text),
    gap(44),
    accentLine(),
    text && gap(44),
    text && textBlock(text, C.muted),
  );
  return { el, issues };
}

/** s.carreras: [{ dia: "07", mes: "NOV", nombre, ciudad, modalidad }] (2-7) */
function calendario(s) {
  const issues = [];
  const races = (s.carreras || []).slice(0, 7);
  const title = fit(s.titulo || "Próximas carreras", { font: "cond-800", max: 112, min: 72, maxWidth: CW, maxHeight: 210, lineHeight: 1, upper: true, maxLines: 2 });
  if (title.overflow) issues.push("calendario.titulo no cabe");
  const subH = s.subtitulo ? 46 : 0;
  const avail = CH - title.height - 28 - 6 - (subH ? 24 + subH : 0) - 40;
  const rowH = Math.min(156, Math.floor(avail / Math.max(races.length, 1)));
  const daySize = Math.min(84, Math.round(rowH * 0.6));
  const nameSize = Math.min(46, Math.round(rowH * 0.36));
  const metaSize = Math.min(32, Math.round(rowH * 0.26));
  const dateW = 136;
  const textW = CW - dateW - 24;
  const rows = races.map((r) =>
    h(
      "div",
      { height: rowH, borderTop: `1px solid ${C.rule}`, alignItems: "center" },
      h(
        "div",
        { width: dateW, flexDirection: "column", justifyContent: "center" },
        h("div", { ...font("cond-800"), fontSize: daySize, lineHeight: 0.95, color: C.text }, r.dia),
        h("div", { ...font("cond-600"), fontSize: Math.max(22, metaSize - 4), letterSpacing: 4, color: C.muted }, r.mes),
      ),
      h(
        "div",
        { width: textW, marginLeft: 24, flexDirection: "column", justifyContent: "center" },
        h("div", { ...font("cond-700"), fontSize: nameSize, lineHeight: 1.1, color: C.text, whiteSpace: "nowrap" }, ellipsize(r.nombre, "cond-700", nameSize, textW)),
        h("div", { ...font("body-400"), fontSize: metaSize, lineHeight: 1.3, color: C.muted, marginTop: 6, whiteSpace: "nowrap" }, ellipsize([r.ciudad, r.modalidad].filter(Boolean).join(" · "), "body-400", metaSize, textW)),
      ),
    ),
  );
  const el = h(
    "div",
    { flexDirection: "column", height: CH },
    textBlock(title, C.text),
    gap(28),
    accentLine(),
    s.subtitulo ? gap(24) : null,
    s.subtitulo ? h("div", { ...font("body-500"), fontSize: 34, height: subH, alignItems: "center", color: C.muted }, s.subtitulo) : null,
    gap(40),
    h("div", { flexDirection: "column", borderBottom: `1px solid ${C.rule}` }, rows),
  );
  return { el, issues };
}

const TEMPLATES = { portada, punto, cita, cta, calendario };

/** Devuelve { element, issues } de una slide */
export function buildSlide(slide, { index, total, pilar }) {
  const tpl = TEMPLATES[slide.tipo];
  if (!tpl) return { element: null, issues: [`tipo desconocido: ${slide.tipo}`] };
  const { el, issues } = tpl(slide, { pilar });
  return { element: frame(el, { index, total, pilar, cover: slide.tipo === "portada" }), issues };
}
