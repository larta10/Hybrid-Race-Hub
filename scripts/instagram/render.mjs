// Render de un post: SVG (lib/design.mjs) → resvg (PNG, con las fuentes de instagram/fonts) → sharp (JPEG 90, sRGB).
// Uso directo: node scripts/instagram/render.mjs <id-del-post>  → instagram-preview/<id>/
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { buildSlideSvg } from "./lib/design.mjs";
import { FONTS_DIR, PREVIEW_DIR } from "./lib/config.mjs";
import { loadPosts } from "./lib/posts.mjs";

const FONT_FILES = readdirSync(FONTS_DIR)
  .filter((f) => f.endsWith(".ttf"))
  .map((f) => path.join(FONTS_DIR, f));

const ctxOf = (post, i) => ({ index: i + 1, total: post.slides.length, pilar: post.pilar, fuentes: post.fuentes || [] });

/** Problemas de maquetación (texto que no cabe, zonas inexistentes...) sin renderizar */
export function layoutIssues(post) {
  return post.slides.flatMap((s, i) => buildSlideSvg(s, ctxOf(post, i)).issues.map((m) => `slide ${i + 1} (${s.tipo}): ${m}`));
}

export async function renderSvg(svg) {
  const png = new Resvg(svg, { fitTo: { mode: "original" }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Barlow" } }).render().asPng();
  return sharp(png).toColourspace("srgb").withIccProfile("srgb").jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toBuffer();
}

/** Devuelve un Buffer JPEG por slide */
export async function renderPost(post) {
  const out = [];
  for (let i = 0; i < post.slides.length; i++) {
    const { svg, issues } = buildSlideSvg(post.slides[i], ctxOf(post, i));
    if (!svg) throw new Error(issues.join("; "));
    if (issues.length) console.warn(`  [${post.id}] slide ${i + 1}: ${issues.join("; ")}`);
    out.push(await renderSvg(svg));
  }
  return out;
}

export async function renderToDir(post, dir = path.join(PREVIEW_DIR, post.id)) {
  mkdirSync(dir, { recursive: true });
  const images = await renderPost(post);
  images.forEach((buf, i) => writeFileSync(path.join(dir, `${i + 1}.jpg`), buf));
  return images.map((_, i) => path.join(dir, `${i + 1}.jpg`));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const id = process.argv[2];
  const post = loadPosts().find((p) => p.id === id);
  if (!post) {
    console.error(`No existe el post "${id}"`);
    process.exit(1);
  }
  const files = await renderToDir(post);
  console.log(files.join("\n"));
}
