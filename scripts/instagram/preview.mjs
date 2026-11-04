// Renderiza TODOS los posts + un calendario de ejemplo en instagram-preview/ con un index.html
// (hoja de contactos con las slides y el caption de cada post). Uso: npm run ig:preview
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PREVIEW_DIR } from "./lib/config.mjs";
import { loadPosts, buildCalendarPost, fullCaption } from "./lib/posts.mjs";
import { renderToDir } from "./render.mjs";

const only = process.argv[2]; // opcional: filtra por texto en el id
rmSync(PREVIEW_DIR, { recursive: true, force: true });
mkdirSync(PREVIEW_DIR, { recursive: true });

// Calendario de ejemplo con carreras ficticias de muestra (solo para la vista previa, no se publica)
const sample = buildCalendarPost(
  [
    { fecha_iso: "2026-11-07", nombre: "Carrera de ejemplo uno", municipio: "Madrid", modalidad: "OCR" },
    { fecha_iso: "2026-11-08", nombre: "Ejemplo de carrera con un nombre bastante largo para probar el recorte", municipio: "Sant Miquel de Campmajor", modalidad: "OCR" },
    { fecha_iso: "2026-11-11", nombre: "Ejemplo tres", municipio: "L'Hospitalet de Llobregat", modalidad: "HYROX" },
    { fecha_iso: "2026-11-14", nombre: "Ejemplo cuatro", municipio: "Las Palmas de Gran Canaria", modalidad: "Functional Fitness" },
    { fecha_iso: "2026-11-21", nombre: "Ejemplo cinco", municipio: "Santa Cruz de Tenerife", modalidad: "DEKA FIT" },
    { fecha_iso: "2026-11-22", nombre: "Ejemplo seis", municipio: "Redován", modalidad: "OCR" },
    { fecha_iso: "2026-11-24", nombre: "Ejemplo siete", municipio: "Bilbao", modalidad: "OCR" },
  ],
  "2026-11-04",
  "2026-11-25",
);
sample.id = "000-calendario-ejemplo";

const posts = [sample, ...loadPosts()].filter((p) => !only || p.id.includes(only));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const cards = [];

for (const p of posts) {
  process.stdout.write(`${p.id} `);
  const files = await renderToDir(p);
  const imgs = files.map((f, i) => `<img loading="lazy" src="${esc(path.relative(PREVIEW_DIR, f).replace(/\\/g, "/"))}" alt="${esc(p.alt_text?.[i] || "")}">`).join("");
  cards.push(`<section><h2>${esc(p.id)} <small>${esc(p.pilar)}${p.url_destino ? ` · ${esc(p.url_destino)}` : ""}</small></h2><div class="strip">${imgs}</div><pre>${esc(fullCaption(p))}</pre></section>`);
}

writeFileSync(
  path.join(PREVIEW_DIR, "index.html"),
  `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instagram · vista previa</title>
<style>
body{margin:0;padding:24px;background:#111;color:#eee;font:15px/1.5 system-ui,sans-serif}
h1{font-size:20px}section{margin:0 0 40px;border-top:1px solid #333;padding-top:16px}
h2{font-size:16px;margin:0 0 10px}small{color:#999;font-weight:400}
.strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px}.strip img{height:340px;border-radius:4px}
pre{white-space:pre-wrap;background:#1a1a1a;padding:12px;border-radius:6px;max-width:720px;color:#ccc}
</style>
<h1>Instagram · ${posts.length} posts</h1>
${cards.join("\n")}
</html>`,
);
console.log(`\n\nAbre ${path.join(PREVIEW_DIR, "index.html")}`);
