// Render de un post: satori (SVG) → resvg (PNG) → sharp (JPEG calidad 90, sRGB).
// Uso directo: node scripts/instagram/render.mjs <id-del-post>  → instagram-preview/<id>/
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { buildSlide, W, H } from "./lib/templates.mjs";
import { SATORI_FONTS } from "./lib/text.mjs";
import { PREVIEW_DIR } from "./lib/config.mjs";
import { loadPosts } from "./lib/posts.mjs";

/** Problemas de maquetación (texto que no cabe) sin renderizar */
export function layoutIssues(post) {
  const total = post.slides.length;
  return post.slides.flatMap((s, i) => buildSlide(s, { index: i + 1, total, pilar: post.pilar }).issues.map((m) => `slide ${i + 1}: ${m}`));
}

export async function renderSlide(slide, ctx) {
  const { element, issues } = buildSlide(slide, ctx);
  if (!element) throw new Error(issues.join("; "));
  const svg = await satori(element, { width: W, height: H, fonts: SATORI_FONTS });
  const png = new Resvg(svg, { fitTo: { mode: "original" }, font: { loadSystemFonts: false } }).render().asPng();
  const jpeg = await sharp(png).toColourspace("srgb").withIccProfile("srgb").jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toBuffer();
  return { jpeg, issues };
}

/** Devuelve un Buffer JPEG por slide */
export async function renderPost(post) {
  const total = post.slides.length;
  const out = [];
  for (let i = 0; i < total; i++) {
    const { jpeg, issues } = await renderSlide(post.slides[i], { index: i + 1, total, pilar: post.pilar });
    if (issues.length) console.warn(`  [${post.id}] slide ${i + 1}: ${issues.join("; ")}`);
    out.push(jpeg);
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
