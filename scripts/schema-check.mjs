// Valida la estructura del JSON-LD de las URLs de un crawl (crawl-site.mjs) o de una lista de rutas.
//   node scripts/schema-check.mjs docs/seo/data/crawl-prod-antes.json [/ruta,/ruta]
import { readFileSync } from "node:fs";
const { rows } = JSON.parse(readFileSync(process.argv[2], "utf8"));
const only = process.argv[3] ? process.argv[3].split(",") : null;
const REQ = {
  SportsEvent: ["name", "startDate", "location", "eventStatus", "eventAttendanceMode"],
  Event: ["name", "startDate", "location"],
  FAQPage: ["mainEntity"], BreadcrumbList: ["itemListElement"],
  Article: ["headline", "datePublished", "author", "image"], BlogPosting: ["headline", "datePublished", "author", "image"],
  ItemList: ["itemListElement"], Organization: ["name", "url"],
};
const RECO = { SportsEvent: ["endDate", "offers", "organizer", "image", "description"], Article: ["dateModified", "publisher"], BlogPosting: ["dateModified", "publisher"], Organization: ["logo"] };
const out = [];
for (const r of rows.filter(r => r.ld?.length && (!only || only.includes(r.path)))) {
  const nodes = [];
  const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") { if (o["@type"]) nodes.push(o); Object.values(o).forEach(v => typeof v === "object" && walk(v)); } };
  for (const s of r.ld) { try { walk(JSON.parse(s)); } catch (e) { out.push({ path: r.path, type: "JSON", issue: "JSON inválido" }); } }
  const types = {};
  for (const n of nodes) {
    const t = [].concat(n["@type"])[0];
    types[t] = (types[t] || 0) + 1;
    for (const k of REQ[t] || []) if (n[k] == null) out.push({ path: r.path, type: t, issue: `falta ${k}` });
    for (const k of RECO[t] || []) if (n[k] == null) out.push({ path: r.path, type: t, issue: `recomendado: ${k}`, reco: true });
    if (/Event$/.test(t) && n.startDate && !/T\d\d:\d\d.*([+-]\d\d:\d\d|Z)$/.test(n.startDate)) out.push({ path: r.path, type: t, issue: "startDate sin hora ni zona", reco: true });
    if (t === "FAQPage") for (const q of n.mainEntity || []) if (!q.acceptedAnswer?.text) out.push({ path: r.path, type: t, issue: "pregunta sin respuesta" });
    if (t === "BreadcrumbList") (n.itemListElement || []).forEach((it, i) => { if (it.position !== i + 1 || !it.item || !it.name) out.push({ path: r.path, type: t, issue: `elemento ${i + 1} incompleto` }); });
    if (t === "Product" && (n.aggregateRating || n.review)) out.push({ path: r.path, type: t, issue: "Product con valoraciones" });
  }
  out.push({ path: r.path, types });
}
console.log(JSON.stringify(out, null, 0).replace(/},{/g, "},\n{"));
