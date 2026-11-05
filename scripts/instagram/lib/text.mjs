// Fuentes y medición de texto. El salto de línea lo calculamos nosotros (no satori):
// así sabemos exactamente cuántas líneas ocupa cada bloque y el texto nunca desborda.
import { readFileSync } from "node:fs";
import path from "node:path";
import opentype from "@shuding/opentype.js";
import { FONTS_DIR } from "./config.mjs";

const FILES = {
  "cond-600": ["Barlow Condensed", 600, "BarlowCondensed-SemiBold.ttf"],
  "cond-700": ["Barlow Condensed", 700, "BarlowCondensed-Bold.ttf"],
  "cond-800": ["Barlow Condensed", 800, "BarlowCondensed-ExtraBold.ttf"],
  "body-400": ["Barlow", 400, "Barlow-Regular.ttf"],
  "body-500": ["Barlow", 500, "Barlow-Medium.ttf"],
};

const parsed = {};
export const SATORI_FONTS = Object.entries(FILES).map(([key, [name, weight, file]]) => {
  const buf = readFileSync(path.join(FONTS_DIR, file));
  parsed[key] = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
  return { name, weight, style: "normal", data: buf };
});

export const FONT = Object.fromEntries(Object.entries(FILES).map(([k, [name, weight]]) => [k, { family: name, weight }]));

/** Caracteres del texto que no existen en la fuente (se verían como un cuadro) */
export function missingGlyphs(text, fontKey) {
  const f = parsed[fontKey];
  return [...new Set([...String(text)].filter((ch) => ch.trim() && f.charToGlyphIndex(ch) === 0))];
}

/** Ancho en px de un texto con una fuente, tamaño y espaciado de letras dados */
export function measure(text, fontKey, size, letterSpacing = 0) {
  const f = parsed[fontKey];
  return (f.getAdvanceWidth(text, size, { kerning: true }) || 0) + letterSpacing * [...text].length;
}

/**
 * Tokeniza un texto con *palabra* destacada (como mucho una por slide).
 * Devuelve [{ text, hi }] por palabra.
 */
export function tokens(text, upper = false) {
  const out = [];
  // La puntuación pegada al destacado (*palabra*.) va en la misma palabra, sin color
  const re = /(\S*?)\*([^*]+)\*(\S*)|(\S+)/g;
  const up = (s) => (upper ? s.toUpperCase() : s);
  let m;
  while ((m = re.exec(text))) {
    if (m[2] !== undefined) out.push({ text: up(m[1] + m[2] + m[3]), parts: [{ text: up(m[1]), hi: false }, { text: up(m[2]), hi: true }, { text: up(m[3]), hi: false }].filter((p) => p.text) });
    else out.push({ text: up(m[4]), hi: false });
  }
  return out;
}

/** Reparte palabras en líneas que caben en maxWidth. null si alguna palabra no cabe sola. */
export function wrap(toks, fontKey, size, maxWidth, letterSpacing = 0) {
  const space = measure(" ", fontKey, size, letterSpacing);
  const lines = [];
  let line = [];
  let width = 0;
  for (const t of toks) {
    const w = measure(t.text, fontKey, size, letterSpacing);
    if (w > maxWidth) return null;
    const next = line.length ? width + space + w : w;
    if (next > maxWidth && line.length) {
      lines.push(line);
      line = [t];
      width = w;
    } else {
      line.push(t);
      width = next;
    }
  }
  if (line.length) lines.push(line);
  // Evita una palabra sola en la última línea: baja una palabra de la penúltima si cabe
  const n = lines.length;
  if (n > 1 && lines[n - 1].length === 1 && lines[n - 2].length > 2) {
    const moved = [lines[n - 2].at(-1), ...lines[n - 1]];
    if (measure(moved.map((t) => t.text).join(" "), fontKey, size, letterSpacing) <= maxWidth) {
      lines[n - 2] = lines[n - 2].slice(0, -1);
      lines[n - 1] = moved;
    }
  }
  return lines;
}

/**
 * Mayor tamaño (de max a min, en pasos de 2 px) con el que el texto cabe en la caja.
 * Si ni al mínimo cabe, devuelve overflow: true (validate.mjs lo marca como error).
 */
export function fit(text, opts) {
  // " · " separa frases que van cada una en su propia línea
  const parts = String(text).split(" · ").map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  if (parts.length === 1) return fitOne(text, opts);
  const { max, min } = opts;
  for (let size = max; size >= min; size -= 2) {
    const fs = parts.map((p) => fitOne(p, { ...opts, max: size, min: size, maxHeight: Infinity }));
    const lines = fs.flatMap((f) => f.lines);
    const height = lines.length * size * opts.lineHeight;
    if (fs.every((f) => !f.overflow) && height <= opts.maxHeight) return { ...fs[0], lines, height };
  }
  const fs = parts.map((p) => fitOne(p, { ...opts, max: min, maxHeight: Infinity }));
  const lines = fs.flatMap((f) => f.lines);
  return { ...fs[0], lines, height: lines.length * min * opts.lineHeight, overflow: true };
}

function fitOne(text, { font, max, min, maxWidth, maxHeight, lineHeight, upper = false, letterSpacing = 0, maxLines = 99 }) {
  const toks = tokens(text, upper);
  for (let size = max; size >= min; size -= 2) {
    const ls = typeof letterSpacing === "function" ? letterSpacing(size) : letterSpacing;
    const lines = wrap(toks, font, size, maxWidth, ls);
    if (!lines) continue;
    const height = lines.length * size * lineHeight;
    if (height <= maxHeight && lines.length <= maxLines) return { size, lines, height, lineHeight, font, letterSpacing: ls, overflow: false };
  }
  const ls = typeof letterSpacing === "function" ? letterSpacing(min) : letterSpacing;
  const lines = wrap(toks, font, min, maxWidth, ls) || toks.map((t) => [t]);
  return { size: min, lines, height: lines.length * min * lineHeight, lineHeight, font, letterSpacing: ls, overflow: true };
}

/** Recorta con "…" para que quepa en una línea */
export function ellipsize(text, fontKey, size, maxWidth, letterSpacing = 0) {
  if (measure(text, fontKey, size, letterSpacing) <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && measure(t.trimEnd() + "…", fontKey, size, letterSpacing) > maxWidth) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}
