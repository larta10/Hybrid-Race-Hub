// Comprueba los enlaces de afiliado de Amazon.  npm run qa:links
//
// 1) Código fuente: ninguna URL de Amazon escrita a mano fuera de lib/affiliate.js (buildAmazonUrl).
// 2) data/products.js: todo producto tiene searchQuery y, si tiene ASIN, 10 caracteres alfanuméricos.
// 3) HTML generado (.next tras `npm run build`): toda URL de Amazon es https://www.amazon.es,
//    lleva tag=hybridracehub-21 y rel con "sponsored" y "nofollow".
//
// Sale con código 1 si encuentra cualquier fallo.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const TAG = "hybridracehub-21";
const ROOT = process.cwd();
const SRC_DIRS = ["pages", "components", "lib", "data"];
const ALLOWED_SRC = new Set(["lib/affiliate.js"]);
const URL_RE = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*(?:amazon\.[a-z.]+|amzn\.(?:to|eu))[^\s"'`<>)]*/gi;
const fails = [];

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!["node_modules", "cache"].includes(name)) walk(p, exts, out); }
    else if (exts.some(e => name.endsWith(e))) out.push(p);
  }
  return out;
}
const rel = p => relative(ROOT, p).replace(/\\/g, "/");

// 1) Fuentes
let srcFiles = 0;
for (const d of SRC_DIRS) for (const f of walk(join(ROOT, d), [".js", ".jsx", ".mjs", ".ts", ".tsx", ".json"])) {
  srcFiles++;
  const r = rel(f);
  if (ALLOWED_SRC.has(r)) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(URL_RE)) fails.push(`${r}:${i + 1}  URL de Amazon escrita a mano (usa AffiliateLink / buildAmazonUrl): ${m[0].slice(0, 90)}`);
  });
}

// 2) Catálogo de productos
const prodSrc = readFileSync(join(ROOT, "data/products.js"), "utf8");
const json = prodSrc.slice(prodSrc.indexOf("["), prodSrc.lastIndexOf("];") + 1);
const PRODUCTS = JSON.parse(json);
const ids = new Set();
for (const p of PRODUCTS) {
  if (ids.has(p.id)) fails.push(`data/products.js  id duplicado: ${p.id}`);
  ids.add(p.id);
  if (!p.searchQuery) fails.push(`data/products.js  ${p.id} sin searchQuery`);
  if (p.asin && !/^[A-Z0-9]{10}$/.test(p.asin)) fails.push(`data/products.js  ${p.id} ASIN mal formado: ${p.asin}`);
}
// Referencias a productos inexistentes en los artículos
const postsSrc = readFileSync(join(ROOT, "lib/posts.js"), "utf8");
for (const m of postsSrc.matchAll(/data-product="([^"]+)"/g)) if (!ids.has(m[1])) fails.push(`lib/posts.js  producto desconocido: ${m[1]}`);

// 3) HTML generado
const built = join(ROOT, ".next/server/pages");
let htmlLinks = 0;
if (!existsSync(built)) {
  console.log("Aviso: no hay build (.next). Ejecuta `npm run build` para revisar también el HTML generado.");
} else {
  for (const f of walk(built, [".html"])) {
    const html = readFileSync(f, "utf8");
    for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
      const tag = m[0];
      const href = (tag.match(/href="([^"]+)"/i) || [])[1];
      if (!href || !/amazon\.|amzn\./i.test(href)) continue;
      htmlLinks++;
      const url = href.replace(/&amp;/g, "&");
      const where = rel(f).replace(".next/server/pages/", "");
      let u; try { u = new URL(url); } catch { fails.push(`${where}  URL mal formada: ${url}`); continue; }
      if (u.protocol !== "https:" || u.hostname !== "www.amazon.es") fails.push(`${where}  dominio no permitido (${u.hostname}): ${url}`);
      if (u.searchParams.get("tag") !== TAG) fails.push(`${where}  sin tag ${TAG}: ${url}`);
      if (u.pathname.startsWith("/dp/") && !/^\/dp\/[A-Z0-9]{10}$/.test(u.pathname)) fails.push(`${where}  ASIN inválido: ${url}`);
      const relAttr = (tag.match(/rel="([^"]+)"/i) || [])[1] || "";
      if (!/sponsored/.test(relAttr) || !/nofollow/.test(relAttr)) fails.push(`${where}  rel sin sponsored/nofollow: ${url}`);
    }
  }
}

console.log(`Revisados: ${srcFiles} archivos fuente, ${PRODUCTS.length} productos, ${htmlLinks} enlaces de Amazon en el HTML generado.`);
if (fails.length) {
  console.log(`\n✗ ${fails.length} fallos:`);
  fails.forEach(f => console.log("  - " + f));
  process.exit(1);
}
console.log("✓ 0 fallos en enlaces de afiliado.");
