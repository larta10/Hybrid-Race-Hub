// Resume un JSON de crawl-site.mjs: problemas por URL, duplicados, huérfanas, finas, sitemap.
import { readFileSync } from "node:fs";
const { rows, sitemap } = JSON.parse(readFileSync(process.argv[2], "utf8"));
const idx = rows.filter(r => r.indexable);
const dup = k => { const m = {}; idx.forEach(r => r[k] && (m[r[k]] ||= []).push(r.path)); return Object.entries(m).filter(([, v]) => v.length > 1); };
const linked = new Set(rows.filter(r => r.inCount > 0).map(r => r.path));
const res = {
  total: rows.length, indexables: idx.length,
  noIndexables: rows.filter(r => !r.indexable).map(r => `${r.path} [${r.status}${r.redirects?.length ? " →" + r.finalPath : ""}${/noindex/.test(r.robots || "") ? " noindex" : ""}]`),
  redirectChains: rows.filter(r => (r.redirects || []).length > 1).map(r => r.path + " " + JSON.stringify(r.redirects)),
  redirects: rows.filter(r => (r.redirects || []).length).map(r => `${r.path} → ${r.finalPath} (${r.redirects.map(x => x.status).join(",")}) desde ${r.inFrom.slice(0, 3).join(", ")}`),
  non200: rows.filter(r => r.status !== 200).map(r => `${r.path} ${r.status} desde ${r.inFrom.slice(0,3).join(", ")}`),
  dupTitles: dup("title"), dupDescs: dup("desc"),
  h1Issues: idx.filter(r => r.h1s.length !== 1).map(r => `${r.path}: ${r.h1s.length} H1`),
  dupH1: Object.entries(idx.reduce((m, r) => { r.h1s[0] && (m[r.h1s[0]] ||= []).push(r.path); return m; }, {})).filter(([, v]) => v.length > 1),
  orphans: idx.filter(r => r.inCount === 0 && r.path !== "/").map(r => r.path),
  thin: idx.filter(r => r.words < 250).map(r => `${r.path} (${r.words})`),
  longTitles: idx.filter(r => r.titleLen > 60 || r.titleLen < 25).map(r => `${r.path} (${r.titleLen}) ${r.title}`),
  badDesc: idx.filter(r => r.descLen < 120 || r.descLen > 160).map(r => `${r.path} (${r.descLen})`),
  deep: idx.filter(r => r.depth > 3).map(r => `${r.path} (${r.depth})`),
  smNotLinked: sitemap.filter(p => !linked.has(p) && p !== "/"),
  linkedNotInSm: idx.filter(r => !r.inSitemap && r.inCount > 0).map(r => r.path),
  smNotIndexable: rows.filter(r => r.inSitemap && !r.indexable).map(r => r.path),
  robots: [...new Set(rows.map(r => r.robots))],
};
console.log(JSON.stringify(res, null, 1));
