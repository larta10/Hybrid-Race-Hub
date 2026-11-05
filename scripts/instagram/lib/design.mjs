// Sistema visual v2: cada slide se compone como un SVG (1080x1350) a partir del JSON del post.
// Texto con Barlow / Barlow Condensed (resvg carga los TTF de instagram/fonts), gráficas e ilustraciones
// generadas en SVG a partir de datos. Nada de imágenes externas.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fit, measure, ellipsize, missingGlyphs } from "./text.mjs";
import { ROOT, SITE } from "./config.mjs";

export const W = 1080;
export const H = 1350;
const X = 72; // margen lateral
const CW = W - 2 * X; // 936
const TOP = 150; // inicio del contenido
const BOTTOM = 1220; // fin del contenido (después: pie)

export const C = {
  bg: "#0B0C0F",
  grid: "#111317",
  text: "#F2F0EB",
  muted: "#8E8E93",
  accent: "#FB923C",
  card: "#14161B",
  border: "#22252C",
  steel: "#6B8CAE",
  axis: "#3A3D45",
};
// Paleta de datos: hueso, acero y naranja (el naranja solo para el dato clave)
const SERIES = [C.text, C.steel];

export const PILAR_LABEL = {
  estaciones: "Estaciones",
  entrenamiento: "Entrenamiento",
  errores: "Errores y mitos",
  ocr: "OCR",
  nutricion: "Nutrición y recuperación",
  producto: "Material",
  comunidad: "Comunidad",
  calendario: "Calendario",
};

export const CHART_TYPES = ["grafica_linea", "grafica_area", "grafica_barras", "barras_agrupadas", "comparativa", "donut", "porcentaje", "linea_temporal", "tabla", "dato_grande"];
export const VISUAL_TYPES = [...CHART_TYPES, "ilustracion", "correcto_incorrecto"];
export const SVG_DIR = path.join(ROOT, "instagram/assets/svg");

const FAM = {
  "cond-600": ['Barlow Condensed', 600],
  "cond-700": ['Barlow Condensed', 700],
  "cond-800": ['Barlow Condensed', 800],
  "body-400": ["Barlow", 400],
  "body-500": ["Barlow", 500],
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const r1 = (n) => Math.round(n * 10) / 10;
const NF = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
export const fmt = (v) => (typeof v === "number" ? NF.format(v).replace("-", "−") : String(v));

// ---------- Texto ----------

/** Texto de una línea. anchor: start | middle | end */
function t(str, x, y, { font = "body-400", size = 30, color = C.text, ls = 0, anchor = "start", opacity } = {}) {
  const [fam, wt] = FAM[font];
  return `<text x="${r1(x)}" y="${r1(y)}" font-family="${fam}" font-weight="${wt}" font-size="${size}"${ls ? ` letter-spacing="${ls}"` : ""} fill="${color}"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${opacity ? ` opacity="${opacity}"` : ""}>${esc(str)}</text>`;
}

/**
 * Bloque de texto ajustado con fit(). Devuelve { svg, height, overflow, size }.
 * La palabra entre *asteriscos* va en naranja.
 */
function block(text, x, y, opts, issues, label) {
  const { color = C.text, anchor = "start", ...fo } = opts;
  const f = fit(text, { lineHeight: 1.2, ...fo });
  if (f.overflow) issues.push(`${label} no cabe`);
  const miss = missingGlyphs(String(text).replace(/\*/g, ""), fo.font);
  if (miss.length) issues.push(`${label}: caracteres sin glifo en la fuente: ${miss.join(" ")}`);
  const [fam, wt] = FAM[fo.font];
  const lh = f.size * f.lineHeight;
  // la línea base queda a ~0.8 del alto de la línea
  const lines = f.lines.map((line, i) => {
    const by = y + i * lh + f.size * 0.86 + (lh - f.size) / 2;
    const spans = [];
    line.forEach((tk, j) => {
      const sep = j < line.length - 1 ? " " : "";
      if (!tk.parts) spans.push(`<tspan>${esc(tk.text + sep)}</tspan>`);
      else {
        tk.parts.forEach((p) => spans.push(p.hi ? `<tspan fill="${C.accent}">${esc(p.text)}</tspan>` : `<tspan>${esc(p.text)}</tspan>`));
        if (sep) spans.push(`<tspan>${sep}</tspan>`);
      }
    });
    const ax = anchor === "middle" ? ` text-anchor="middle"` : anchor === "end" ? ` text-anchor="end"` : "";
    return `<text x="${r1(x)}" y="${r1(by)}" font-family="${fam}" font-weight="${wt}" font-size="${f.size}"${f.letterSpacing ? ` letter-spacing="${f.letterSpacing}"` : ""} fill="${color}" xml:space="preserve"${ax}>${spans.join("")}</text>`;
  });
  return { svg: lines.join(""), height: f.lines.length * lh, overflow: f.overflow, size: f.size, lines: f.lines.length };
}

// ---------- Piezas comunes ----------

const rect = (x, y, w, h, { fill = C.card, stroke = C.border, rx = 20, sw = 2 } = {}) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}/>`;
const card = (x, y, w, h) => rect(x + 1, y + 1, w - 2, h - 2);
const lineEl = (x1, y1, x2, y2, color = C.axis, w = 2, extra = "") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${color}" stroke-width="${w}" ${extra}/>`;

function kicker(text, y = 92) {
  return t(text.toUpperCase(), X, y, { font: "cond-600", size: 26, color: C.muted, ls: 5 });
}

/** Etiqueta de procedencia de los datos, arriba a la derecha de la tarjeta */
function dataTag(kind, xRight, y) {
  const label = kind === "estudio" ? "DATOS DEL ESTUDIO" : "EJEMPLO ILUSTRATIVO";
  const size = 19;
  const w = measure(label, "cond-600", size, 2.5) + 46;
  const x = xRight - w;
  const dot = kind === "estudio" ? `<circle cx="${r1(x + 20)}" cy="${r1(y + 18)}" r="5" fill="${C.accent}"/>` : `<circle cx="${r1(x + 20)}" cy="${r1(y + 18)}" r="5" fill="none" stroke="${C.muted}" stroke-width="2"/>`;
  return rect(x, y, w, 36, { fill: C.bg, stroke: C.border, rx: 18 }) + dot + t(label, x + 34, y + 25, { font: "cond-600", size, color: kind === "estudio" ? C.text : C.muted, ls: 2.5 });
}

function sourceLine(text, y, issues) {
  const s = /^fuente/i.test(text) ? text : `Fuente: ${text}`;
  const size = 22;
  const out = ellipsize(s, "body-400", size, CW);
  if (out !== s) issues.push("fuente demasiado larga para una línea");
  return t(out, X, y + 22, { font: "body-400", size, color: C.muted });
}

/** Fondo, retícula tenue, pie con barra de progreso segmentada, marca e indicador n/N */
function frame(content, { index, total, pilar, surface = C.bg }) {
  const grid = [];
  for (let x = 90; x < W; x += 90) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${C.grid}" stroke-width="1"/>`);
  for (let y = 90; y < H; y += 90) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>`);
  const gapS = 8;
  const segW = (CW - gapS * (total - 1)) / total;
  const segs = Array.from({ length: total }, (_, i) => {
    const color = i + 1 === index ? C.accent : i + 1 < index ? C.text : C.border;
    return `<rect x="${r1(X + i * (segW + gapS))}" y="1258" width="${r1(segW)}" height="4" rx="2" fill="${color}"/>`;
  });
  const brand = `<text x="${X}" y="1306" font-family="Barlow Condensed" font-weight="600" font-size="24" letter-spacing="4" fill="${C.text}" xml:space="preserve">HYBRID RACE HUB<tspan fill="${C.muted}" letter-spacing="1"> · ${SITE}</tspan></text>`;
  const n = t(`${index}/${total}`, W - X, 1306, { font: "cond-600", size: 24, color: C.muted, ls: 3, anchor: "end" });
  const label = kicker(PILAR_LABEL[pilar] || "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${surface}"/>${grid.join("")}${label}${content}${segs.join("")}${brand}${n}</svg>`;
}

// ---------- Ilustraciones ----------

const svgCache = new Map();
function loadSvg(name) {
  if (!svgCache.has(name)) {
    const file = path.join(SVG_DIR, `${name}.svg`);
    if (!existsSync(file)) return null;
    const raw = readFileSync(file, "utf8");
    const vb = raw.match(/viewBox="([^"]+)"/)[1];
    const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    svgCache.set(name, { vb, inner });
  }
  return svgCache.get(name);
}

/** Zonas resaltables de una ilustración (clases z-*) */
export function svgZones(name) {
  const s = loadSvg(name);
  if (!s) return null;
  return [...new Set([...s.inner.matchAll(/class="z-([a-z0-9-]+)"/g)].map((m) => m[1]))];
}

/** Inserta una ilustración en una caja, resaltando zonas en naranja y adaptando el interior a la superficie */
function illustration(name, x, y, w, h, { resaltar = [], surface = C.card } = {}, issues = []) {
  const s = loadSvg(name);
  if (!s) {
    issues.push(`ilustración inexistente: ${name}`);
    return "";
  }
  const zones = svgZones(name);
  let inner = s.inner;
  for (const z of resaltar) {
    if (!zones.includes(z)) issues.push(`la ilustración ${name} no tiene la zona "${z}" (zonas: ${zones.join(", ")})`);
    inner = inner.replace(new RegExp(`<(\\w+) class="z-${z}"([^>]*)>`, "g"), (m, tag, attrs) => {
      const a = attrs.replace(/stroke="#0B0C0F"/g, `stroke="${C.accent}"`).replace(/fill="#0B0C0F"/g, `fill="${C.accent}" fill-opacity="0.9"`);
      return `<${tag} class="z-${z}"${a}>`;
    });
  }
  inner = inner.replace(/#0B0C0F/g, surface);
  return `<svg x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" viewBox="${s.vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

/** Símbolos ✓ / ✗ dibujados (las fuentes no los incluyen) */
function mark(ok, cx, cy, r = 34) {
  const ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ok ? C.text : C.accent}"/>`;
  const k = r * 0.42;
  const p = ok ? `<path d="M${r1(cx - k)} ${r1(cy + 1)} L${r1(cx - k * 0.25)} ${r1(cy + k * 0.75)} L${r1(cx + k)} ${r1(cy - k * 0.7)}" fill="none" stroke="${C.bg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M${r1(cx - k * 0.8)} ${r1(cy - k * 0.8)} L${r1(cx + k * 0.8)} ${r1(cy + k * 0.8)} M${r1(cx + k * 0.8)} ${r1(cy - k * 0.8)} L${r1(cx - k * 0.8)} ${r1(cy + k * 0.8)}" stroke="${C.bg}" stroke-width="7" stroke-linecap="round"/>`;
  return ring + p;
}

// ---------- Cabecera de slide de contenido ----------

/** Título (+ texto opcional) arriba. Devuelve { svg, y } con la y donde empieza lo siguiente */
function heading(s, issues, { maxTitle = 220, maxText = 200, titleMax = 76, textMax = 34 } = {}) {
  let y = TOP;
  let out = "";
  if (s.titulo) {
    const b = block(s.titulo, X, y, { font: "cond-800", max: titleMax, min: 52, maxWidth: CW, maxHeight: maxTitle, lineHeight: 1.02, upper: true }, issues, "titulo");
    out += b.svg;
    y += b.height + 22;
  }
  if (s.texto) {
    const b = block(s.texto, X, y, { font: "body-400", max: textMax, min: 26, maxWidth: CW, maxHeight: maxText, lineHeight: 1.32, color: C.muted }, issues, "texto");
    out += b.svg;
    y += b.height + 10;
  }
  return { svg: out, y: y + 26 };
}

/**
 * Tarjeta de gráfica con etiqueta de procedencia, fuente al pie y lectura opcional debajo.
 * draw(x, y, w, h) devuelve el SVG del interior.
 */
function chartSlide(s, issues, draw, { minCard = 420, maxCard = Infinity } = {}) {
  const head = heading(s, issues);
  let lectura = null;
  const srcH = 40;
  let bottom = BOTTOM - srcH;
  if (s.lectura) {
    const tmp = fit(s.lectura, { font: "body-500", max: 32, min: 26, maxWidth: CW - 40, maxHeight: 170, lineHeight: 1.3 });
    const lh = tmp.lines.length * tmp.size * 1.3;
    bottom -= lh + 28;
    lectura = { y: bottom + srcH + 24, h: lh };
  }
  const ch = Math.min(bottom - head.y, maxCard);
  // si la tarjeta es más baja que el hueco, se centra en vertical
  const cy = head.y + Math.max(0, (bottom - head.y - ch) / 2 - 20);
  if (lectura) lectura.y = cy + ch + srcH + 24;
  if (ch < minCard) issues.push(`la gráfica queda demasiado baja (${Math.round(ch)} px): acorta título o texto`);
  let out = head.svg + card(X, cy, CW, ch) + dataTag(s.etiqueta, X + CW - 24, cy + 24);
  if (s.unidad_eje) out += t(s.unidad_eje.toUpperCase(), X + 32, cy + 49, { font: "cond-600", size: 20, color: C.muted, ls: 2.5 });
  out += draw(X + 40, cy + 84, CW - 80, ch - 84 - 36);
  out += sourceLine(s.fuente || "", cy + ch + 10, issues);
  if (lectura) {
    out += `<rect x="${X}" y="${r1(lectura.y)}" width="6" height="${r1(lectura.h)}" fill="${C.accent}"/>`;
    out += block(s.lectura, X + 30, lectura.y, { font: "body-500", max: 32, min: 26, maxWidth: CW - 40, maxHeight: 170, lineHeight: 1.3 }, issues, "lectura").svg;
  }
  return out;
}

// ---------- Escalas ----------
function niceTicks(min, max, n = 5) {
  const span = max - min || 1;
  const raw = span / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((k) => span / k <= n) || 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

// ---------- Gráfica de líneas / área ----------
function lineChart(s, issues, area = false) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const series = s.series || [];
    const labels = s.x || [];
    const all = series.flatMap((se) => se.valores);
    const yMin = s.y?.min ?? Math.min(0, ...all);
    const yMax = s.y?.max ?? Math.max(...all);
    const ticks = s.y?.marcas || niceTicks(yMin, yMax, 4);
    const t0 = Math.min(...ticks);
    const t1 = Math.max(...ticks);
    const legendH = series.length > 1 ? 50 : 0;
    const axisW = Math.max(...ticks.map((v) => measure(fmt(v), "body-400", 22))) + 18;
    const px = x + axisW;
    const pw = w - axisW - 20;
    const py = y + legendH + 26;
    const ph = h - legendH - 26 - 56;
    const sx = (i) => px + (labels.length === 1 ? pw / 2 : (i * pw) / (labels.length - 1));
    const sy = (v) => py + ph - ((v - t0) / (t1 - t0)) * ph;
    let out = "";
    for (const v of ticks) {
      out += lineEl(px, sy(v), px + pw, sy(v), C.border, 2);
      out += t(fmt(v), px - 14, sy(v) + 8, { size: 22, color: C.muted, anchor: "end" });
    }
    labels.forEach((l, i) => (out += t(String(l), sx(i), py + ph + 40, { font: "cond-600", size: 24, color: C.muted, anchor: "middle", ls: 1 })));
    if (series.length > 1) {
      let lx = x;
      series.forEach((se, k) => {
        out += `<rect x="${r1(lx)}" y="${r1(y + 8)}" width="28" height="6" rx="3" fill="${SERIES[k]}"/>`;
        out += t(se.nombre, lx + 40, y + 20, { font: "body-500", size: 24, color: C.text });
        lx += 40 + measure(se.nombre, "body-500", 24) + 44;
      });
    }
    const unit = s.y?.sufijo || "";
    series.forEach((se, k) => {
      const color = SERIES[k];
      const pts = se.valores.map((v, i) => [sx(i), sy(v)]);
      if (area) {
        const d = `M${r1(pts[0][0])} ${r1(sy(t0))} ` + pts.map((p) => `L${r1(p[0])} ${r1(p[1])}`).join(" ") + ` L${r1(pts.at(-1)[0])} ${r1(sy(t0))} Z`;
        out += `<path d="${d}" fill="${color}" fill-opacity="${k === 0 ? 0.12 : 0.18}"/>`;
      }
      out += `<polyline points="${pts.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ")}" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
      pts.forEach((p, i) => {
        const hi = s.destacar && s.destacar.serie === k && s.destacar.indice === i;
        out += `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${hi ? 11 : 8}" fill="${hi ? C.accent : color}" stroke="${C.card}" stroke-width="3"/>`;
        if (s.etiquetar !== false) {
          // la serie más alta en ese punto lleva la etiqueta encima; la otra, debajo
          const other = series[1 - k]?.valores[i];
          const below = other !== undefined && se.valores[i] < other;
          const ly = below ? p[1] + 38 : p[1] - 20;
          out += t(fmt(se.valores[i]) + unit, p[0], ly, { font: "cond-700", size: 26, color: hi ? C.accent : C.text, anchor: "middle" });
        }
      });
    });
    if (s.destacar?.texto) {
      const se = series[s.destacar.serie];
      const p = [sx(s.destacar.indice), sy(se.valores[s.destacar.indice])];
      const tw = measure(s.destacar.texto, "body-500", 22) + 28;
      const bx = Math.min(Math.max(p[0] - tw / 2, px), px + pw - tw);
      const by = p[1] + 56 > py + ph - 10 ? p[1] - 110 : p[1] + 56;
      out += lineEl(p[0], p[1] + (by > p[1] ? 14 : -14), p[0], by > p[1] ? by : by + 40, C.accent, 2);
      out += rect(bx, by, tw, 40, { fill: C.bg, stroke: C.accent, rx: 8 }) + t(s.destacar.texto, bx + 14, by + 28, { font: "body-500", size: 22, color: C.text });
    }
    return out;
  });
}

// ---------- Barras ----------
function barChart(s, issues) {
  const horiz = s.orientacion === "horizontal";
  return chartSlide(s, issues, (x, y, w, h) => {
    const bars = s.barras || [];
    const max = s.max ?? Math.max(...bars.map((b) => b.valor)) * 1.12;
    const unit = s.sufijo || "";
    let out = "";
    if (horiz) {
      const n = bars.length;
      const rowH = Math.min(150, h / n);
      const labW = Math.min(300, Math.max(...bars.map((b) => measure(b.etiqueta, "body-500", 26))) + 24);
      const bw = w - labW - 120;
      bars.forEach((b, i) => {
        const cy = y + i * rowH + rowH / 2 + (h - rowH * n) / 2;
        const len = Math.max(6, (b.valor / max) * bw);
        const color = b.destacar ? C.accent : i % 2 === 0 || s.monocromo ? C.text : C.steel;
        const lf = fit(b.etiqueta, { font: "body-500", max: 26, min: 20, maxWidth: labW - 20, maxHeight: 64, lineHeight: 1.15 });
        out += block(b.etiqueta, x, cy - (lf.lines.length * lf.size * 1.15) / 2, { font: "body-500", max: 26, min: 20, maxWidth: labW - 20, maxHeight: 64, lineHeight: 1.15, color: C.text }, issues, "etiqueta").svg;
        out += `<rect x="${r1(x + labW)}" y="${r1(cy - 28)}" width="${r1(len)}" height="56" rx="4" fill="${b.destacar ? C.accent : s.monocromo === false ? color : C.steel}"/>`;
        out += t(fmt(b.valor) + unit, x + labW + len + 16, cy + 14, { font: "cond-700", size: 40, color: b.destacar ? C.accent : C.text });
      });
      return out;
    }
    const n = bars.length;
    const labH = 74;
    const ph = h - labH - 50;
    const py = y + 50;
    const slot = w / n;
    const bw = Math.min(150, slot * 0.58);
    out += lineEl(x, py + ph, x + w, py + ph, C.axis, 2);
    bars.forEach((b, i) => {
      const cx = x + slot * i + slot / 2;
      const bh = Math.max(6, (b.valor / max) * ph);
      const d = `M${r1(cx - bw / 2)} ${r1(py + ph)} V${r1(py + ph - bh + 6)} Q${r1(cx - bw / 2)} ${r1(py + ph - bh)} ${r1(cx - bw / 2 + 6)} ${r1(py + ph - bh)} H${r1(cx + bw / 2 - 6)} Q${r1(cx + bw / 2)} ${r1(py + ph - bh)} ${r1(cx + bw / 2)} ${r1(py + ph - bh + 6)} V${r1(py + ph)} Z`;
      // referencia: barra hueca con trazo discontinuo (umbral, valor de partida...)
      out += b.referencia ? `<path d="${d}" fill="none" stroke="${C.text}" stroke-width="3" stroke-dasharray="10 8"/>` : `<path d="${d}" fill="${b.destacar ? C.accent : C.steel}"/>`;
      out += t(fmt(b.valor) + unit, cx, py + ph - bh - 16, { font: "cond-700", size: n > 5 ? 32 : 40, color: b.destacar ? C.accent : C.text, anchor: "middle" });
      out += block(b.etiqueta, cx, py + ph + 14, { font: "body-500", max: 24, min: 18, maxWidth: slot - 12, maxHeight: labH, lineHeight: 1.15, color: C.text, anchor: "middle" }, issues, "etiqueta").svg;
    });
    return out;
  });
}

function groupedBars(s, issues) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const groups = s.grupos || [];
    const names = s.series || [];
    const all = groups.flatMap((g) => g.valores);
    const max = s.max ?? Math.max(...all) * 1.15;
    const unit = s.sufijo || "";
    const legendH = 50;
    const labH = 70;
    const py = y + legendH + 40;
    const ph = h - legendH - 40 - labH;
    const slot = w / groups.length;
    const gap = 8;
    const bw = Math.min(110, (slot * 0.72 - gap) / names.length);
    let out = "";
    let lx = x;
    names.forEach((nm, k) => {
      out += `<rect x="${r1(lx)}" y="${r1(y + 6)}" width="22" height="22" rx="4" fill="${SERIES[k]}"/>`;
      out += t(nm, lx + 34, y + 25, { font: "body-500", size: 24 });
      lx += 34 + measure(nm, "body-500", 24) + 40;
    });
    out += lineEl(x, py + ph, x + w, py + ph, C.axis, 2);
    groups.forEach((g, i) => {
      const gx = x + slot * i + slot / 2 - (bw * names.length + gap * (names.length - 1)) / 2;
      g.valores.forEach((v, k) => {
        const hi = Array.isArray(s.destacar) && s.destacar[0] === i && s.destacar[1] === k;
        const bh = Math.max(6, (v / max) * ph);
        const bx = gx + k * (bw + gap);
        out += `<rect x="${r1(bx)}" y="${r1(py + ph - bh)}" width="${r1(bw)}" height="${r1(bh)}" rx="4" fill="${hi ? C.accent : SERIES[k]}"/>`;
        out += t(fmt(v) + unit, bx + bw / 2, py + ph - bh - 12, { font: "cond-700", size: 28, color: hi ? C.accent : C.text, anchor: "middle" });
      });
      out += block(g.etiqueta, x + slot * i + slot / 2, py + ph + 14, { font: "body-500", max: 24, min: 18, maxWidth: slot - 10, maxHeight: labH - 10, lineHeight: 1.15, anchor: "middle" }, issues, "etiqueta").svg;
    });
    return out;
  });
}

// ---------- Comparativa A vs B ----------
function comparativa(s, issues) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const colW = (w - 120) / 2;
    // bloque centrado verticalmente: etiqueta (60) + cifra (~150) + nota (~110)
    const cTop = y + Math.max(80, (h - 330) / 2 + 40);
    const labelY = cTop - 76;
    const side = (o, cx, hi) => {
      const val = fmt(o.valor);
      let size = 150;
      while (size > 70 && measure(val, "cond-800", size) + measure(o.unidad || "", "cond-700", size * 0.32) + 10 > colW) size -= 6;
      const vw = measure(val, "cond-800", size);
      const uw = o.unidad ? measure(o.unidad, "cond-700", size * 0.32) + 10 : 0;
      const sx = cx - (vw + uw) / 2;
      const top = cTop;
      let out = block(o.etiqueta, cx, labelY, { font: "cond-700", max: 34, min: 24, maxWidth: colW, maxHeight: 90, lineHeight: 1.05, upper: true, color: hi ? C.accent : C.muted, ls: 1, anchor: "middle" }, issues, "comparativa.etiqueta").svg;
      out += t(val, sx, top + size * 0.9, { font: "cond-800", size, color: hi ? C.accent : C.text });
      if (o.unidad) out += t(o.unidad, sx + vw + 10, top + size * 0.9, { font: "cond-700", size: Math.round(size * 0.32), color: C.muted });
      if (o.nota) out += block(o.nota, cx, top + size + 24, { font: "body-400", max: 28, min: 20, maxWidth: colW - 10, maxHeight: h - (top - y) - size - 30, lineHeight: 1.28, color: C.muted, anchor: "middle" }, issues, "comparativa.nota").svg;
      return out;
    };
    const mid = x + w / 2;
    let out = side(s.a, x + colW / 2, s.destacar === "a") + side(s.b, x + w - colW / 2, s.destacar === "b");
    out += lineEl(mid, labelY, mid, cTop + 20, C.border, 2) + lineEl(mid, cTop + 190, mid, Math.min(y + h - 10, cTop + 330), C.border, 2);
    const sym = s.simbolo || "→";
    const cy = cTop + 70;
    out += `<circle cx="${r1(mid)}" cy="${r1(cy)}" r="40" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>`;
    if (sym === "→") out += `<path d="M${r1(mid - 18)} ${r1(cy)} H${r1(mid + 16)} M${r1(mid + 4)} ${r1(cy - 12)} L${r1(mid + 17)} ${r1(cy)} L${r1(mid + 4)} ${r1(cy + 12)}" fill="none" stroke="${C.text}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    else out += t(sym, mid, cy + 16, { font: "cond-800", size: 48, color: C.text, anchor: "middle" });
    if (s.diferencia) {
      const dw = measure(s.diferencia, "cond-800", 34) + 36;
      out += rect(mid - dw / 2, cy + 56, dw, 50, { fill: C.accent, stroke: null, rx: 25 }) + t(s.diferencia, mid, cy + 93, { font: "cond-800", size: 34, color: C.bg, anchor: "middle" });
    }
    return out;
 }, { maxCard: 560 });
}

// ---------- Donut / porcentaje ----------
function donut(s, issues) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const r = Math.min(w, h - 60) / 2 - 30;
    const cx = x + w / 2;
    const cy = y + r + 20;
    const v = Math.max(0, Math.min(100, s.valor));
    const a = (v / 100) * 2 * Math.PI;
    const ex = cx + Math.sin(a) * r;
    const ey = cy - Math.cos(a) * r;
    let out = `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="none" stroke="${C.border}" stroke-width="44"/>`;
    out += v >= 100 ? `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="none" stroke="${C.accent}" stroke-width="44"/>` : `<path d="M${r1(cx)} ${r1(cy - r)} A${r1(r)} ${r1(r)} 0 ${v > 50 ? 1 : 0} 1 ${r1(ex)} ${r1(ey)}" fill="none" stroke="${C.accent}" stroke-width="44" stroke-linecap="butt"/>`;
    const val = `${fmt(s.valor)}`;
    const size = Math.min(170, r * 0.85);
    const vw = measure(val, "cond-800", size);
    const pw = measure("%", "cond-700", size * 0.45);
    out += t(val, cx - (vw + pw) / 2, cy + size * 0.3, { font: "cond-800", size: Math.round(size), color: C.text });
    out += t("%", cx - (vw + pw) / 2 + vw + 4, cy + size * 0.3, { font: "cond-700", size: Math.round(size * 0.45), color: C.accent });
    if (s.etiqueta_centro) out += block(s.etiqueta_centro, cx, cy + size * 0.42, { font: "cond-600", max: 26, min: 20, maxWidth: r * 1.3, maxHeight: 70, lineHeight: 1.1, upper: true, color: C.muted, ls: 2, anchor: "middle" }, issues, "donut.etiqueta").svg;
    return out;
  });
}

// ---------- Línea temporal ----------
function timeline(s, issues) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const fases = s.fases || [];
    const n = fases.length;
    const rowH = h / n;
    const lx = x + 150;
    let out = lineEl(lx, y + rowH / 2, lx, y + h - rowH / 2, C.border, 4);
    fases.forEach((f, i) => {
      const cy = y + i * rowH + rowH / 2;
      out += block(f.etiqueta, x, cy - 20, { font: "cond-700", max: 30, min: 20, maxWidth: 124, maxHeight: 70, lineHeight: 1.05, upper: true, color: f.destacar ? C.accent : C.muted, ls: 1 }, issues, "fase.etiqueta").svg;
      out += `<circle cx="${lx}" cy="${r1(cy)}" r="${f.destacar ? 14 : 11}" fill="${f.destacar ? C.accent : C.card}" stroke="${f.destacar ? C.accent : C.text}" stroke-width="4"/>`;
      const tx = lx + 40;
      const tw = x + w - tx;
      const tb = block(f.titulo, tx, 0, { font: "cond-700", max: 38, min: 26, maxWidth: tw, maxHeight: 50, lineHeight: 1.05, upper: true }, [], "");
      const bb = f.texto ? fit(f.texto, { font: "body-400", max: 26, min: 20, maxWidth: tw, maxHeight: rowH - tb.height - 18, lineHeight: 1.25 }) : null;
      const total = tb.height + (bb ? 8 + bb.lines.length * bb.size * 1.25 : 0);
      const ty = cy - total / 2;
      out += block(f.titulo, tx, ty, { font: "cond-700", max: 38, min: 26, maxWidth: tw, maxHeight: 50, lineHeight: 1.05, upper: true, color: f.destacar ? C.accent : C.text }, issues, "fase.titulo").svg;
      if (f.texto) out += block(f.texto, tx, ty + tb.height + 8, { font: "body-400", max: 26, min: 20, maxWidth: tw, maxHeight: rowH - tb.height - 18, lineHeight: 1.25, color: C.muted }, issues, "fase.texto").svg;
    });
    return out;
  });
}

// ---------- Tabla ----------
function tabla(s, issues) {
  return chartSlide(s, issues, (x, y, w, h) => {
    const cols = s.columnas || [];
    const rows = s.filas || [];
    const widths = s.anchos || (cols.length === 3 ? [0.4, 0.3, 0.3] : cols.map(() => 1 / cols.length));
    const headH = 56;
    const rowH = Math.min(150, (h - headH) / Math.max(rows.length, 1));
    let out = "";
    let cx = x;
    cols.forEach((c, j) => {
      out += t(c.toUpperCase(), cx, y + 30, { font: "cond-600", size: 22, color: C.muted, ls: 2 });
      cx += widths[j] * w;
    });
    out += lineEl(x, y + headH - 6, x + w, y + headH - 6, C.axis, 2);
    rows.forEach((r, i) => {
      const ry = y + headH + i * rowH;
      const hi = s.destacar_fila === i;
      if (hi) out += rect(x - 16, ry + 4, w + 32, rowH - 8, { fill: C.bg, stroke: C.accent, rx: 12 });
      let cx2 = x;
      r.forEach((cell, j) => {
        const first = j === 0;
        const b = fit(String(cell), { font: first ? "cond-700" : "body-500", max: first ? 34 : 30, min: 20, maxWidth: widths[j] * w - 20, maxHeight: rowH - 20, lineHeight: 1.15, upper: first });
        out += block(String(cell), cx2, ry + (rowH - b.lines.length * b.size * 1.15) / 2, { font: first ? "cond-700" : "body-500", max: first ? 34 : 30, min: 20, maxWidth: widths[j] * w - 20, maxHeight: rowH - 20, lineHeight: 1.15, upper: first, color: hi && !first ? C.accent : C.text }, issues, "tabla.celda").svg;
        cx2 += widths[j] * w;
      });
      if (i < rows.length - 1 && !hi && s.destacar_fila !== i + 1) out += lineEl(x, ry + rowH, x + w, ry + rowH, C.border, 2);
    });
    return out;
  });
}

// ---------- Dato grande ----------
function datoGrande(s, issues) {
  return chartSlide(
    { ...s, texto: undefined },
    issues,
    (x, y, w, h) => {
      const val = s.cifra;
      let size = 300;
      const uw = (sz) => (s.unidad ? measure(s.unidad, "cond-700", sz * 0.3) + 16 : 0);
      while (size > 120 && measure(val, "cond-800", size) + uw(size) > w) size -= 10;
      const vw = measure(val, "cond-800", size);
      const top = y + 20;
      let out = t(val, x, top + size * 0.82, { font: "cond-800", size, color: C.accent });
      if (s.unidad) out += t(s.unidad, x + vw + 16, top + size * 0.82, { font: "cond-700", size: Math.round(size * 0.3), color: C.text });
      out += lineEl(x, top + size * 0.82 + 40, x + 120, top + size * 0.82 + 40, C.border, 4);
      if (s.texto) out += block(s.texto, x, top + size * 0.82 + 74, { font: "body-500", max: 40, min: 28, maxWidth: w, maxHeight: h - size * 0.82 - 100, lineHeight: 1.3 }, issues, "dato.texto").svg;
      return out;
    },
    { minCard: 600 },
  );
}

// ---------- Conclusión ----------
function conclusion(s, issues) {
  const lines = s.lineas || [];
  const ch = 600;
  const cy = Math.round((TOP + BOTTOM) / 2 - ch / 2 + 30);
  let out = rect(X, cy, CW, ch, { fill: "#08090B", stroke: C.border, rx: 20 }) + `<rect x="${X}" y="${cy + 60}" width="8" height="${ch - 120}" fill="${C.accent}"/>`;
  out += t((s.etiqueta || "Conclusión").toUpperCase(), X + 56, cy + 80, { font: "cond-600", size: 26, color: C.accent, ls: 5 });
  // tamaño común para todas las líneas (la más larga manda)
  let size = 128;
  while (size > 56 && lines.some((l) => measure(l.replace(/\*/g, "").toUpperCase(), "cond-800", size) > CW - 112)) size -= 4;
  const totalH = lines.length * size * 1.02;
  let y = cy + 120 + (ch - 120 - 60 - totalH - (s.texto ? 0 : 0)) / 2 - (s.texto ? 60 : 0);
  lines.forEach((l) => {
    out += block(l, X + 56, y, { font: "cond-800", max: size, min: size, maxWidth: CW - 112, maxHeight: size * 1.1, lineHeight: 1.02, upper: true }, issues, "conclusion.linea").svg;
    y += size * 1.02;
  });
  if (s.texto) out += block(s.texto, X + 56, y + 36, { font: "body-400", max: 32, min: 26, maxWidth: CW - 112, maxHeight: cy + ch - y - 70, lineHeight: 1.3, color: C.muted }, issues, "conclusion.texto").svg;
  if (s.titulo) out += block(s.titulo, X, TOP, { font: "cond-800", max: 64, min: 48, maxWidth: CW, maxHeight: 150, lineHeight: 1.02, upper: true }, issues, "titulo").svg;
  return out;
}

// ---------- Aplicación práctica ----------
function aplicacion(s, issues) {
  const head = heading({ titulo: s.titulo || "Qué hacer en tu entreno" }, issues, { titleMax: 84 });
  const pts = s.puntos || [];
  const avail = BOTTOM - head.y;
  const rowH = Math.min(260, avail / pts.length);
  let out = head.svg;
  pts.forEach((p, i) => {
    const y = head.y + i * rowH;
    out += lineEl(X, y, X + CW, y, C.border, 2);
    out += t(String(i + 1).padStart(2, "0"), X, y + 92, { font: "cond-800", size: 88, color: C.accent });
    out += block(p, X + 150, y + 30, { font: "body-500", max: 38, min: 28, maxWidth: CW - 150, maxHeight: rowH - 54, lineHeight: 1.3 }, issues, `aplicacion.punto ${i + 1}`).svg;
  });
  return out;
}

// ---------- Referencias ----------
function referencias(s, issues, ctx) {
  const fuentes = ctx.fuentes || [];
  const head = heading({ titulo: s.titulo || "Fuentes" }, issues, { titleMax: 84 });
  let out = head.svg;
  let y = head.y + 10;
  const avail = BOTTOM - y;
  const each = avail / Math.max(fuentes.length, 1);
  fuentes.forEach((f, i) => {
    const id = f.doi ? `doi.org/${f.doi}` : f.pmid ? `PMID ${f.pmid}` : f.url || "";
    const head2 = `${f.autores} (${f.anio})`;
    out += t(String(i + 1).padStart(2, "0"), X, y + 34, { font: "cond-800", size: 34, color: C.accent });
    const a = block(head2, X + 70, y, { font: "body-500", max: 28, min: 22, maxWidth: CW - 70, maxHeight: 80, lineHeight: 1.28 }, issues, "referencia.autores");
    out += a.svg;
    const b = block(`${f.titulo}. ${f.revista}.`, X + 70, y + a.height + 4, { font: "body-400", max: 26, min: 20, maxWidth: CW - 70, maxHeight: Math.max(60, each - a.height - 60), lineHeight: 1.28, color: C.muted }, issues, "referencia.titulo");
    out += b.svg;
    out += t(id, X + 70, y + a.height + b.height + 34, { font: "body-500", size: 22, color: C.steel });
    y += Math.min(each, a.height + b.height + 74);
  });
  if (!fuentes.length) issues.push("referencias sin fuentes en el post");
  return out;
}

// ---------- Portada ----------
function portada(s, issues) {
  let out = "";
  const title = fit(s.titulo, { font: "cond-800", max: 150, min: 84, maxWidth: CW, maxHeight: 320, lineHeight: 0.98, upper: true, maxLines: 2 });
  const sub = s.subtitulo ? fit(s.subtitulo, { font: "body-500", max: 38, min: 30, maxWidth: CW, maxHeight: 160, lineHeight: 1.32 }) : null;
  const subH = sub ? sub.lines.length * sub.size * 1.32 + 36 : 0;
  const titleH = title.lines.length * title.size * 0.98;
  const tY = BOTTOM - 20 - subH - titleH;
  const artTop = TOP + 10;
  const artBottom = tY - 70;
  if (s.svg) {
    out += illustration(s.svg, X, artTop, CW, artBottom - artTop, { resaltar: s.resaltar, surface: C.bg }, issues);
  } else if (s.cifra) {
    let size = 340;
    while (size > 140 && measure(s.cifra, "cond-800", size) > CW) size -= 10;
    out += t(s.cifra, X - 6, artBottom - 40, { font: "cond-800", size, color: C.accent });
    if (s.cifra_texto) out += t(s.cifra_texto.toUpperCase(), X, artBottom + 4, { font: "cond-600", size: 28, color: C.muted, ls: 4 });
  }
  out += `<rect x="${X}" y="${r1(tY - 44)}" width="120" height="6" fill="${C.accent}"/>`;
  out += block(s.titulo, X, tY, { font: "cond-800", max: 150, min: 84, maxWidth: CW, maxHeight: 320, lineHeight: 0.98, upper: true, maxLines: 2 }, issues, "portada.titulo").svg;
  if (s.subtitulo) out += block(s.subtitulo, X, tY + titleH + 36, { font: "body-500", max: 38, min: 30, maxWidth: CW, maxHeight: 160, lineHeight: 1.32, color: C.muted }, issues, "portada.subtitulo").svg;
  // "DESLIZA" arriba a la derecha
  out += t("DESLIZA", W - X - 64, 92, { font: "cond-600", size: 26, color: C.text, ls: 5, anchor: "end" });
  out += `<path d="M${W - X - 50} 83 H${W - X - 6} M${W - X - 18} 73 L${W - X - 6} 83 L${W - X - 18} 93" fill="none" stroke="${C.text}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  return out;
}

// ---------- Contexto (texto) ----------
function contexto(s, issues) {
  let out = "";
  let y = TOP + 20;
  const hasArt = !!s.svg;
  const title = block(s.titulo, X, y, { font: "cond-800", max: 96, min: 60, maxWidth: CW, maxHeight: 300, lineHeight: 1.0, upper: true }, issues, "contexto.titulo");
  out += title.svg;
  y += title.height + 34;
  out += `<rect x="${X}" y="${r1(y)}" width="120" height="4" fill="${C.border}"/>`;
  y += 40;
  const textMaxH = hasArt ? 330 : BOTTOM - y;
  const body = block(s.texto, X, y, { font: "body-400", max: 42, min: 30, maxWidth: CW, maxHeight: textMaxH, lineHeight: 1.36 }, issues, "contexto.texto");
  out += body.svg;
  y += body.height + 40;
  if (hasArt) {
    const h = BOTTOM - y;
    if (h < 300) issues.push("contexto: poco espacio para la ilustración");
    out += card(X, y, CW, h) + illustration(s.svg, X + 40, y + 30, CW - 80, h - 60, { resaltar: s.resaltar, surface: C.card }, issues);
  }
  return out;
}

// ---------- Ilustración ----------
function ilustracion(s, issues) {
  const head = heading({ titulo: s.titulo }, issues);
  let textH = 0;
  let tb = null;
  if (s.texto) {
    tb = fit(s.texto, { font: "body-400", max: 34, min: 26, maxWidth: CW, maxHeight: 230, lineHeight: 1.32 });
    textH = tb.lines.length * tb.size * 1.32 + 36;
  }
  const cy = head.y;
  const ch = BOTTOM - textH - cy;
  let out = head.svg + card(X, cy, CW, ch);
  if (s.etiqueta) out += dataTag(s.etiqueta, X + CW - 24, cy + 24);
  const off = s.etiqueta || s.leyenda ? 84 : 40;
  out += illustration(s.svg, X + 50, cy + off, CW - 100, ch - off - 36, { resaltar: s.resaltar, surface: C.card }, issues);
  if (s.leyenda) {
    // pequeña leyenda del resaltado
    out += `<rect x="${X + 32}" y="${r1(cy + 34)}" width="22" height="22" rx="4" fill="${C.accent}"/>` + t(s.leyenda, X + 66, cy + 53, { font: "body-500", size: 24, color: C.text });
  }
  if (s.texto) out += block(s.texto, X, cy + ch + 34, { font: "body-400", max: 34, min: 26, maxWidth: CW, maxHeight: 230, lineHeight: 1.32 }, issues, "ilustracion.texto").svg;
  return out;
}

// ---------- Correcto / incorrecto ----------
function correctoIncorrecto(s, issues) {
  // Dos tarjetas apiladas: ilustración a la izquierda, veredicto y explicación a la derecha
  const head = heading({ titulo: s.titulo }, issues, { titleMax: 70 });
  const gap = 24;
  const ch = (BOTTOM - head.y - gap) / 2;
  const artW = 560;
  const textX = X + artW + 20;
  const textW = X + CW - textX - 32;
  let out = head.svg;
  [
    [s.correcto, true, head.y],
    [s.incorrecto, false, head.y + ch + gap],
  ].forEach(([o, ok, y]) => {
    if (!o) return issues.push(`falta ${ok ? "correcto" : "incorrecto"}`);
    out += rect(X + 1, y + 1, CW - 2, ch - 2, { fill: C.card, stroke: ok ? C.border : C.border });
    out += illustration(o.svg, X + 20, y + 20, artW - 20, ch - 40, { resaltar: o.resaltar, surface: C.card }, issues);
    out += lineEl(textX - 10, y + 40, textX - 10, y + ch - 40, C.border, 2);
    out += mark(ok, textX + 44, y + 76, 32);
    out += t(ok ? "ASÍ" : "ASÍ NO", textX + 92, y + 90, { font: "cond-800", size: 40, color: ok ? C.text : C.accent, ls: 2 });
    out += block(o.texto || "", textX + 14, y + 140, { font: "body-500", max: 30, min: 22, maxWidth: textW, maxHeight: ch - 170, lineHeight: 1.3 }, issues, `${ok ? "correcto" : "incorrecto"}.texto`).svg;
  });
  return out;
}

// ---------- CTA ----------
function cta(s, issues) {
  let out = "";
  const title = fit(s.titulo, { font: "cond-800", max: 132, min: 76, maxWidth: CW, maxHeight: 420, lineHeight: 0.98, upper: true });
  const th = title.lines.length * title.size * 0.98;
  const y = 640 - th / 2;
  out += `<path d="M${X + 4} ${r1(y - 190)} H${X + 60} V${r1(y - 106)} L${X + 32} ${r1(y - 128)} L${X + 4} ${r1(y - 106)} Z" fill="none" stroke="${C.text}" stroke-width="5" stroke-linejoin="round"/>`;
  out += block(s.titulo, X, y - 40, { font: "cond-800", max: 132, min: 76, maxWidth: CW, maxHeight: 420, lineHeight: 0.98, upper: true }, issues, "cta.titulo").svg;
  out += `<rect x="${X}" y="${r1(y + th)}" width="120" height="6" fill="${C.accent}"/>`;
  if (s.texto) out += block(s.texto, X, y + th + 44, { font: "body-500", max: 40, min: 30, maxWidth: CW, maxHeight: 200, lineHeight: 1.32, color: C.muted }, issues, "cta.texto").svg;
  return out;
}

// ---------- Calendario (lunes) ----------
function calendario(s, issues) {
  const races = (s.carreras || []).slice(0, 7);
  const head = heading({ titulo: s.titulo || "Próximas carreras", texto: s.subtitulo }, issues, { titleMax: 96 });
  const y0 = head.y;
  const ch = BOTTOM - y0;
  const rowH = Math.min(150, ch / Math.max(races.length, 1));
  let out = head.svg + card(X, y0, CW, rowH * races.length + 8);
  const dateW = 150;
  const textW = CW - dateW - 70;
  races.forEach((r, i) => {
    const y = y0 + 4 + i * rowH;
    if (i) out += lineEl(X + 28, y, X + CW - 28, y, C.border, 2);
    const daySize = Math.min(72, rowH * 0.52);
    out += t(r.dia, X + 36, y + rowH / 2 + daySize * 0.2, { font: "cond-800", size: Math.round(daySize), color: i === 0 ? C.accent : C.text });
    out += t(r.mes, X + 36 + measure(r.dia, "cond-800", daySize) + 10, y + rowH / 2 + daySize * 0.2, { font: "cond-600", size: 24, color: C.muted, ls: 3 });
    const nameSize = Math.min(40, Math.round(rowH * 0.3));
    const metaSize = Math.min(26, Math.round(rowH * 0.2));
    out += t(ellipsize(r.nombre, "cond-700", nameSize, textW), X + dateW + 40, y + rowH / 2 - 4, { font: "cond-700", size: nameSize, color: C.text });
    out += t(ellipsize([r.ciudad, r.modalidad].filter(Boolean).join(" · "), "body-400", metaSize, textW), X + dateW + 40, y + rowH / 2 + metaSize + 8, { font: "body-400", size: metaSize, color: C.muted });
  });
  return out;
}

const TEMPLATES = {
  portada,
  contexto,
  grafica_linea: (s, i) => lineChart(s, i, false),
  grafica_area: (s, i) => lineChart(s, i, true),
  grafica_barras: barChart,
  barras_agrupadas: groupedBars,
  comparativa,
  donut,
  porcentaje: donut,
  linea_temporal: timeline,
  tabla,
  dato_grande: datoGrande,
  conclusion,
  aplicacion,
  referencias,
  ilustracion,
  correcto_incorrecto: correctoIncorrecto,
  cta,
  calendario,
};
export const SLIDE_TYPES = Object.keys(TEMPLATES);

/** { svg, issues } de una slide */
export function buildSlideSvg(slide, ctx) {
  const tpl = TEMPLATES[slide.tipo];
  if (!tpl) return { svg: null, issues: [`tipo desconocido: ${slide.tipo}`] };
  const issues = [];
  let content = "";
  try {
    content = tpl(slide, issues, ctx);
  } catch (e) {
    issues.push(`error al maquetar: ${e.message}`);
  }
  return { svg: frame(content, ctx), issues };
}
