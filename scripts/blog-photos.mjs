// Descarga las fotos de lib/blog-photos.js desde su fuente (Wikimedia Commons o Pixabay) y las deja en
// public/blog/<clave>.webp, recortadas a 1600 × 840 (la proporción de la portada del blog).
//   node scripts/blog-photos.mjs            → solo las que falten
//   node scripts/blog-photos.mjs --force    → todas
// Pixabay necesita PIXABAY_API_KEY en .env.local. Commons no necesita clave.
import fs from "fs";
import path from "path";
import sharp from "sharp";
import dotenv from "dotenv";
import { PHOTOS } from "../lib/blog-photos.js";

dotenv.config({ path: ".env.local" });
const UA = "blog-photos/1.0 (script de descarga de imágenes con licencia libre)";
const OUT = path.join("public", "blog");
const force = process.argv.includes("--force");
fs.mkdirSync(OUT, { recursive: true });

async function commonsUrl(title) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size&iiurlwidth=1920`;
  const j = await (await fetch(api, { headers: { "User-Agent": UA } })).json();
  const info = Object.values(j.query?.pages || {})[0]?.imageinfo?.[0];
  if (!info) throw new Error(`Commons no devuelve ${title}`);
  return info.thumburl || info.url;
}
async function pixabayUrl(id) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error("Falta PIXABAY_API_KEY en .env.local");
  const j = await (await fetch(`https://pixabay.com/api/?key=${key}&id=${id}`)).json();
  const hit = j.hits?.[0];
  if (!hit) throw new Error(`Pixabay no devuelve ${id}`);
  return hit.largeImageURL;
}

let done = 0, skipped = 0;
for (const [key, p] of Object.entries(PHOTOS)) {
  const file = path.join(OUT, `${key}.webp`);
  if (fs.existsSync(file) && !force) { skipped++; continue; }
  try {
    const url = p.source.commons ? await commonsUrl(p.source.commons) : await pixabayUrl(p.source.pixabay);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await sharp(buf).resize(1600, 840, { fit: "cover", position: p.source.position || "centre" }).webp({ quality: 72 }).toFile(file);
    console.log(`ok  ${key}.webp  ${Math.round(out.size / 1024)} KB`);
    done++;
    await new Promise(r => setTimeout(r, 4000));   // Commons corta si se le pide muy seguido
  } catch (e) {
    console.error(`ERROR ${key}: ${e.message}`);
    process.exitCode = 1;
    await new Promise(r => setTimeout(r, 8000));
  }
}
console.log(`${done} descargadas, ${skipped} ya estaban.`);
