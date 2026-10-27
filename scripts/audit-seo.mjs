// Auditoría SEO on-page de todas las URLs del sitemap (más las noindex conocidas):
// title, description, H1, canonical, robots, OG/Twitter, JSON-LD válido y tipos.
//
//   node scripts/audit-seo.mjs                      -> http://localhost:3000
//   node scripts/audit-seo.mjs https://hybridracehub.com
import { writeFileSync } from "node:fs";

const BASE = (process.argv.find(a => /^https?:\/\//.test(a)) || "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://hybridracehub.com";
const EXTRA = ["/calendario", "/calculadora", "/centros-deportivos", "/comunidad", "/race-hub", "/no-existe-404"];

const decode = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, re) => { const m = html.match(re); return m ? decode(m[1]) : null; };

const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const paths = [...new Set([...[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname), ...EXTRA])];

const rows = [];
for (const p of paths) {
  const r = await fetch(BASE + p);
  const html = await r.text();
  const title = meta(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = meta(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = meta(html, /<link rel="canonical" href="([^"]*)"/i);
  const robots = meta(html, /<meta name="robots" content="([^"]*)"/i);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const ogImg = meta(html, /<meta property="og:image" content="([^"]*)"/i);
  const tw = /<meta name="twitter:card"/i.test(html);
  const types = []; const ldErrors = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") { if (o["@type"]) types.push(o["@type"]); if (o["@graph"]) walk(o["@graph"]); } };
      walk(j);
    } catch (e) { ldErrors.push(e.message.slice(0, 60)); }
  }
  const issues = [];
  if (r.status !== 200 && p !== "/no-existe-404") issues.push(`HTTP ${r.status}`);
  if (!title) issues.push("sin title"); else if (title.length > 60) issues.push(`title ${title.length}c`);
  if (!desc) issues.push("sin description"); else if (desc.length < 140 || desc.length > 155) issues.push(`desc ${desc.length}c`);
  if (h1 !== 1) issues.push(`${h1} H1`);
  const noindex = /noindex/.test(robots || "");
  if (!noindex) {
    if (!canonical) issues.push("sin canonical");
    else if (!canonical.startsWith(SITE + "/") || canonical !== SITE + p && !(p === "/" && canonical === SITE + "/")) issues.push(`canonical ${canonical}`);
    if (!ogImg) issues.push("sin og:image");
    if (!tw) issues.push("sin twitter:card");
    if (p !== "/" && !types.includes("BreadcrumbList")) issues.push("sin BreadcrumbList");
  }
  if (ldErrors.length) issues.push("JSON-LD inválido");
  rows.push({ path: p, status: r.status, title, titleLen: title?.length, desc, descLen: desc?.length, h1, canonical, robots, types: [...new Set(types)], issues, inSitemap: sm.includes(SITE + p + "<") || (p === "/" && sm.includes(SITE + "/<")) });
}

// Duplicados
const dup = (k) => { const m = {}; rows.forEach(r => { if (r[k] && !/noindex/.test(r.robots || "")) (m[r[k]] ||= []).push(r.path); }); return Object.entries(m).filter(([, v]) => v.length > 1); };
const dupTitles = dup("title"), dupDescs = dup("desc");
for (const [, v] of dupTitles) v.forEach(p => rows.find(r => r.path === p).issues.push("title duplicado"));
for (const [, v] of dupDescs) v.forEach(p => rows.find(r => r.path === p).issues.push("desc duplicada"));
// noindex dentro del sitemap
rows.filter(r => r.inSitemap && /noindex/.test(r.robots || "")).forEach(r => r.issues.push("noindex en sitemap"));

writeFileSync(`audit-seo-${new URL(BASE).host.replace(/[:.]/g, "_")}.json`, JSON.stringify(rows, null, 2));
const bad = rows.filter(r => r.issues.length);
console.log(`URLs revisadas: ${rows.length} · con incidencias: ${bad.length}`);
for (const r of rows) console.log(`${r.issues.length ? "✗" : "✓"} ${r.path}  [${r.types.join(",")}]  ${r.issues.join(" · ")}`);
