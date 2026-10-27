// Auditoría de enlaces e imágenes: rastrea el sitio desde la home siguiendo
// enlaces internos y revisa enlaces internos, externos, Amazon e <img>.
//
//   node scripts/audit-links.mjs                         -> http://localhost:3000
//   node scripts/audit-links.mjs https://hybridracehub.com
//   node scripts/audit-links.mjs http://localhost:3000 --no-external
//
// Deja el resultado en audit-report-<host>.json (ignorado en git) y un resumen por consola.
// Amazon responde 503 a los bots: no se comprueba su estado, solo tag, rel y target.
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:\/\//.test(a)) || "http://localhost:3000").replace(/\/$/, "");
const CHECK_EXTERNAL = !args.includes("--no-external");
const ORIGIN = new URL(BASE).origin;
const SITE_HOSTS = new Set([new URL(BASE).host, "hybridracehub.com", "www.hybridracehub.com"]);
const AMAZON_TAG = "hybridracehub-21";
const UA = "Mozilla/5.0 (compatible; HRH-audit/1.0; +https://hybridracehub.com)";
const MAX_PAGES = 600;

const pages = new Map();      // path -> { status, links: [], imgs: [] }
const queue = ["/", "/sitemap.xml"];
const seen = new Set(queue);
const internalStatus = new Map(); // path -> status
const externals = new Map();  // url -> Set(pages)
const amazonIssues = [];
const imgIssues = [];

const decode = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3] ?? "") : null;
};

function normInternal(href, from) {
  let u;
  try { u = new URL(href, ORIGIN + from); } catch { return null; }
  if (!SITE_HOSTS.has(u.host)) return null;
  if (!/^https?:$/.test(u.protocol)) return null;
  return u.pathname + (u.search || "");
}

async function get(url, method = "GET") {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA, "Accept-Language": "es-ES,es;q=0.9" } });
    return r;
  } finally { clearTimeout(t); }
}

async function crawlPage(path) {
  let r;
  try { r = await get(ORIGIN + path); } catch (e) { internalStatus.set(path, "ERR " + e.message); return; }
  internalStatus.set(path, r.status);
  const type = r.headers.get("content-type") || "";
  if (!r.ok) return;
  const body = await r.text();
  if (path === "/sitemap.xml") {
    for (const m of body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const p = normInternal(m[1], "/");
      if (p && !seen.has(p)) { seen.add(p); queue.push(p); }
    }
    return;
  }
  if (!type.includes("text/html")) return;
  const info = { links: [], imgs: [] };
  pages.set(path, info);

  for (const m of body.matchAll(/<a\s[^>]*>/gi)) {
    const tag = m[0];
    const href = attr(tag, "href");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript|whatsapp):/i.test(href)) continue;
    let abs;
    try { abs = new URL(href, ORIGIN + path); } catch { continue; }
    if (/(^|\.)amazon\.[a-z.]+$|(^|\.)amzn\.to$/i.test(abs.host)) {
      const rel = (attr(tag, "rel") || "").split(/\s+/);
      const problems = [];
      if (abs.host !== "amzn.to" && abs.searchParams.get("tag") !== AMAZON_TAG) problems.push("tag");
      for (const need of ["sponsored", "nofollow", "noopener"]) if (!rel.includes(need)) problems.push("rel:" + need);
      if (attr(tag, "target") !== "_blank") problems.push("target");
      if (problems.length) amazonIssues.push({ page: path, href: abs.href, problems });
      continue;
    }
    const p = normInternal(href, path);
    if (p != null) {
      const clean = p.split("#")[0];
      info.links.push(clean);
      if (!seen.has(clean) && seen.size < MAX_PAGES && !clean.startsWith("/api/") && !clean.startsWith("/_next/")) { seen.add(clean); queue.push(clean); }
    } else if (/^https?:$/.test(abs.protocol)) {
      abs.hash = "";
      const key = abs.href;
      if (!externals.has(key)) externals.set(key, new Set());
      externals.get(key).add(path);
    }
  }

  for (const m of body.matchAll(/<img\s[^>]*>/gi)) {
    const tag = m[0];
    const src = attr(tag, "src") || "";
    const alt = attr(tag, "alt");
    const w = attr(tag, "width"), h = attr(tag, "height");
    const fill = /data-nimg="fill"/.test(tag) || /position:\s*absolute/.test(attr(tag, "style") || "");
    info.imgs.push(src);
    const problems = [];
    if (alt == null) problems.push("sin alt");
    else if (/^(image|imagen|foto|photo|img|picture)$/i.test(alt.trim())) problems.push("alt genérico");
    if (!fill && (!w || !h)) problems.push("sin width/height");
    if (problems.length) imgIssues.push({ page: path, src: src.slice(0, 160), problems });
  }
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

console.log(`› Rastreando ${BASE}`);
while (queue.length) {
  const batch = queue.splice(0, 6);
  await Promise.all(batch.map(crawlPage));
}

// Imágenes: comprobar que existen (locales, /_next/image y remotas) y su peso
const allImgs = new Map();
for (const [p, info] of pages) for (const s of info.imgs) {
  if (!s || s.startsWith("data:")) continue;
  let u; try { u = new URL(s, ORIGIN + p); } catch { continue; }
  if (!allImgs.has(u.href)) allImgs.set(u.href, new Set());
  allImgs.get(u.href).add(p);
}
const imgResults = await pool([...allImgs.keys()], 8, async url => {
  try {
    const r = await get(url);
    const buf = r.ok ? await r.arrayBuffer() : null;
    return { url, status: r.status, kb: buf ? Math.round(buf.byteLength / 1024) : null };
  } catch (e) { return { url, status: "ERR " + e.message }; }
});
const brokenImgs = imgResults.filter(x => x.status !== 200).map(x => ({ ...x, pages: [...allImgs.get(x.url)].slice(0, 5) }));
const heavyImgs = imgResults.filter(x => x.kb > 300).map(x => ({ ...x, pages: [...allImgs.get(x.url)].slice(0, 5) }));

// Enlaces internos rotos
const brokenInternal = [];
for (const [p, info] of pages) for (const l of new Set(info.links)) {
  const st = internalStatus.get(l);
  if (st != null && st !== 200) brokenInternal.push({ from: p, to: l, status: st });
}
for (const [p, st] of internalStatus) if (st !== 200 && !brokenInternal.some(b => b.to === p)) brokenInternal.push({ from: "(sitemap)", to: p, status: st });

// Externos
let brokenExternal = [];
if (CHECK_EXTERNAL) {
  const list = [...externals.keys()];
  console.log(`› Comprobando ${list.length} enlaces externos`);
  const res = await pool(list, 8, async url => {
    try {
      let r = await get(url, "HEAD");
      if ([403, 405, 400, 404, 429, 500, 501, 503].includes(r.status)) r = await get(url, "GET");
      return { url, status: r.status, final: r.url !== url ? r.url : undefined };
    } catch (e) { return { url, status: "ERR " + (e.name === "AbortError" ? "timeout" : e.cause?.code || e.message) }; }
  });
  brokenExternal = res.filter(x => x.status !== 200 && !(typeof x.status === "number" && x.status < 400))
    .map(x => ({ ...x, pages: [...externals.get(x.url)].slice(0, 6) }));
}

const report = {
  base: BASE, date: new Date().toISOString(),
  pagesCrawled: pages.size,
  pages: [...pages.keys()].sort(),
  brokenInternal, brokenExternal, amazonIssues, imgIssues, brokenImgs, heavyImgs,
  externalCount: externals.size, imageCount: allImgs.size,
};
const host = new URL(BASE).host.replace(/[:.]/g, "_");
writeFileSync(`audit-report-${host}.json`, JSON.stringify(report, null, 2));

console.log(`Páginas HTML rastreadas: ${pages.size}`);
console.log(`Internos rotos: ${brokenInternal.length}`);
brokenInternal.slice(0, 40).forEach(b => console.log(`  ${b.status}  ${b.to}   (desde ${b.from})`));
console.log(`Externos con error: ${brokenExternal.length} de ${externals.size}`);
brokenExternal.slice(0, 60).forEach(b => console.log(`  ${b.status}  ${b.url}   (en ${b.pages.join(", ")})`));
console.log(`Enlaces Amazon con problemas: ${amazonIssues.length}`);
amazonIssues.slice(0, 20).forEach(a => console.log(`  ${a.problems.join(",")}  ${a.page}  ${a.href.slice(0, 100)}`));
console.log(`Imágenes con problemas de alt/dimensiones: ${imgIssues.length}`);
imgIssues.slice(0, 30).forEach(a => console.log(`  ${a.problems.join(",")}  ${a.page}  ${a.src}`));
console.log(`Imágenes que no cargan: ${brokenImgs.length}`);
brokenImgs.slice(0, 30).forEach(a => console.log(`  ${a.status}  ${a.url.slice(0, 140)}  (${a.pages.join(", ")})`));
console.log(`Imágenes > 300 KB: ${heavyImgs.length}`);
heavyImgs.slice(0, 20).forEach(a => console.log(`  ${a.kb} KB  ${a.url.slice(0, 140)}`));
process.exit(brokenInternal.length ? 1 : 0);
