// Genera las imágenes Open Graph del blog como PNG estáticos en public/og/blog/<slug>.png,
// para que las tarjetas y la imagen destacada no dependan de generar la imagen en cada visita.
//
// Uso: con la web arrancada en local (npm run build && npx next start -p 3100):
//   node scripts/gen-og.mjs [http://localhost:3100]
// Usa la ruta /og (pages/api/og.js). Solo regenera las imágenes cuyo título o categoría ha cambiado.
// Después, haz commit de public/og/blog/.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { posts } from "../lib/posts.js";

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const OUT = "public/og/blog";
mkdirSync(OUT, { recursive: true });

let n = 0;
for (const p of posts) {
  const title = (p.h1 || p.title).slice(0, 120);
  const cat = p.category || "Blog";
  const file = `${OUT}/${p.slug}.png`;
  const sigFile = `${OUT}/${p.slug}.txt`;
  const sig = `${title}|${cat}`;
  if (existsSync(file) && existsSync(sigFile) && readFileSync(sigFile, "utf8") === sig) continue;
  const res = await fetch(`${BASE}/og?${new URLSearchParams({ title, cat })}`);
  if (!res.ok) throw new Error(`/og devolvió ${res.status} para ${p.slug}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  writeFileSync(sigFile, sig);
  n++;
}
console.log(`Imágenes OG del blog: ${n} generadas, ${posts.length - n} sin cambios.`);
