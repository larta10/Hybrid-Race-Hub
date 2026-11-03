// Rastreo SEO completo desde la home siguiendo enlaces internos.
// Por URL: estado HTTP, redirecciones, canonical, robots, title, description, H1,
// palabras de contenido (sin cabecera, nav ni pie), enlaces internos entrantes/salientes
// y profundidad en clics. Compara con sitemap.xml.
//
//   node scripts/crawl-site.mjs                         -> https://hybridracehub.com
//   node scripts/crawl-site.mjs http://localhost:3000 out.json
import { writeFileSync } from "node:fs";

const BASE = (process.argv[2] || "https://hybridracehub.com").replace(/\/$/, "");
const OUT = process.argv[3] || "crawl-report.json";
const HOST = new URL(BASE).host;
const SKIP = /^\/(api|_next|og)(\/|$)|\.(png|jpe?g|webp|avif|svg|ico|pdf|xml|txt|json|webmanifest|ics|xlsx)$/i;

const decode = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const pick = (html, re) => { const m = html.match(re); return m ? decode(m[1]).trim() : null; };

function normPath(href, from) {
  try {
    const u = new URL(decode(href), BASE + from);
    if (u.host !== HOST && u.host !== "hybridracehub.com" && u.host !== "www.hybridracehub.com") return null;
    let p = decodeURI(u.pathname).replace(/\/+$/, "") || "/";
    return p;
  } catch { return null; }
}

function words(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<header class="sh"[\s\S]*?<\/header>/gi, " ").replace(/<footer class="site-footer"[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav class="(sh-|crumbs)[^"]*"[\s\S]*?<\/nav>/gi, " ").replace(/<[^>]+>/g, " ");
  return decode(body).split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length;
}

async function get(path) {
  const chain = [];
  let url = BASE + encodeURI(path);
  for (let i = 0; i < 6; i++) {
    const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "HRH-audit/1.0" } });
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) {
      chain.push({ status: r.status, to: r.headers.get("location") });
      url = new URL(r.headers.get("location"), url).href;
      continue;
    }
    return { status: r.status, chain, finalUrl: url, xrobots: r.headers.get("x-robots-tag"), html: (r.headers.get("content-type") || "").includes("html") ? await r.text() : "" };
  }
  return { status: 0, chain, finalUrl: url, html: "" };
}

const pages = new Map();
const inlinks = new Map();
const queue = [{ path: "/", depth: 0 }];
const seen = new Set(["/"]);
let smPaths = [];
try {
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  smPaths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decodeURI(new URL(m[1]).pathname).replace(/\/+$/, "") || "/");
} catch {}

async function worker() {
  while (queue.length) {
    const { path, depth } = queue.shift();
    let res;
    try { res = await get(path); } catch (e) { pages.set(path, { path, status: "ERR " + e.message, depth }); continue; }
    const h = res.html;
    const robots = pick(h, /<meta name="robots" content="([^"]*)"/i) || res.xrobots || null;
    const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => decode(m[1].replace(/<[^>]+>/g, "")).trim());
    const out = new Set();
    for (const m of h.matchAll(/<a\b[^>]*\bhref="([^"#][^"]*|#[^"]*)"[^>]*>/gi)) {
      if (m[1].startsWith("#") || /^(mailto|tel|javascript):/i.test(m[1])) continue;
      const p = normPath(m[1], path);
      if (!p || SKIP.test(p)) continue;
      out.add(p);
    }
    const finalPath = normPath(res.finalUrl, "/");
    const title = pick(h, /<title[^>]*>([^<]*)<\/title>/i);
    const desc = pick(h, /<meta name="description" content="([^"]*)"/i);
    pages.set(path, {
      path, depth, status: res.status, redirects: res.chain, finalPath,
      canonical: pick(h, /<link rel="canonical" href="([^"]*)"/i), robots,
      title, titleLen: title?.length || 0, desc, descLen: desc?.length || 0,
      h1s, words: words(h), out: [...out],
      ld: [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]),
    });
    for (const p of out) {
      if (p === path) continue;
      if (!inlinks.has(p)) inlinks.set(p, new Set());
      inlinks.get(p).add(path);
      if (!seen.has(p)) { seen.add(p); queue.push({ path: p, depth: depth + 1 }); }
    }
  }
}
// Arranque en serie hasta tener cola, luego en paralelo
await Promise.all(Array.from({ length: 6 }, worker));
// URLs del sitemap no alcanzadas por enlaces: se descargan igualmente para su ficha
for (const p of smPaths) if (!pages.has(p)) { queue.push({ path: p, depth: null }); seen.add(p); }
await Promise.all(Array.from({ length: 6 }, worker));

const rows = [...pages.values()].map(r => {
  const inc = [...(inlinks.get(r.path) || [])].filter(x => x !== r.path);
  const indexable = r.status === 200 && !(r.redirects || []).length && !/noindex/i.test(r.robots || "") &&
    (!r.canonical || (decodeURI(new URL(r.canonical).pathname).replace(/\/+$/, "") || "/") === r.path);
  return { ...r, inCount: inc.length, inFrom: inc, outCount: (r.out || []).length, indexable, inSitemap: smPaths.includes(r.path) };
});
writeFileSync(OUT, JSON.stringify({ base: BASE, date: new Date().toISOString(), sitemap: smPaths, rows }, null, 1));
console.log(`${rows.length} URLs rastreadas, ${rows.filter(r => r.indexable).length} indexables, sitemap ${smPaths.length} -> ${OUT}`);
