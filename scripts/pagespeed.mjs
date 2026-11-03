// PageSpeed Insights (API pública v5) para las URLs clave, móvil y escritorio.
// Guarda datos de campo (CrUX) si existen y de laboratorio: LCP, INP/TBT, CLS, puntuación.
//   node scripts/pagespeed.mjs docs/seo/data/pagespeed-antes.json
import { writeFileSync } from "node:fs";
const OUT = process.argv[2] || "pagespeed.json";
const URLS = (process.argv[3] || [
  "https://hybridracehub.com/",
  "https://hybridracehub.com/centros-entrenamiento",
  "https://hybridracehub.com/que-es-una-carrera-hibrida",
  "https://hybridracehub.com/carreras-hibridas/andalucia",
  "https://hybridracehub.com/blog/calendario-hyrox-espana-2026-2027",
  "https://hybridracehub.com/productos/zapatillas-hyrox",
].join(",")).split(",");
const res = [];
async function run(url, strategy) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance`);
    const j = await r.json();
    if (j.lighthouseResult) {
      const a = j.lighthouseResult.audits, f = j.loadingExperience?.metrics || {}, o = j.originLoadingExperience?.metrics || {};
      const fm = m => m ? { p75: m.percentile, cat: m.category } : null;
      return {
        url, strategy, score: Math.round(j.lighthouseResult.categories.performance.score * 100),
        lab: { lcp: a["largest-contentful-paint"].numericValue, cls: a["cumulative-layout-shift"].numericValue, tbt: a["total-blocking-time"].numericValue, fcp: a["first-contentful-paint"].numericValue },
        lcpElement: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet || null,
        field: j.loadingExperience?.origin_fallback ? null : { lcp: fm(f.LARGEST_CONTENTFUL_PAINT_MS), inp: fm(f.INTERACTION_TO_NEXT_PAINT), cls: fm(f.CUMULATIVE_LAYOUT_SHIFT_SCORE) },
        origin: Object.keys(o).length ? { lcp: fm(o.LARGEST_CONTENTFUL_PAINT_MS), inp: fm(o.INTERACTION_TO_NEXT_PAINT), cls: fm(o.CUMULATIVE_LAYOUT_SHIFT_SCORE) } : null,
      };
    }
    await new Promise(r => setTimeout(r, 5000));
    if (i === 2) return { url, strategy, error: j.error?.message || "sin resultado" };
  }
}
for (const u of URLS) for (const s of ["mobile", "desktop"]) { const x = await run(u, s); res.push(x); console.log(JSON.stringify(x)); }
writeFileSync(OUT, JSON.stringify(res, null, 1));
