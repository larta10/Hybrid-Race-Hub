// Plan B de scripts/pagespeed.mjs cuando la API pública devuelve 429 (cuota sin clave):
// Lighthouse 12 local (mismo motor de laboratorio que PageSpeed) contra producción, móvil y escritorio.
//   node scripts/lighthouse-run.mjs docs/seo/data/lighthouse-antes.json [url,url]
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const OUT = process.argv[2] || "lighthouse.json";
const URLS = (process.argv[3] || [
  "https://hybridracehub.com/", "https://hybridracehub.com/centros-entrenamiento",
  "https://hybridracehub.com/que-es-una-carrera-hibrida", "https://hybridracehub.com/carreras-hibridas/andalucia",
  "https://hybridracehub.com/blog/calendario-hyrox-espana-2026-2027", "https://hybridracehub.com/productos/zapatillas-hyrox",
].join(",")).split(",");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const dir = mkdtempSync(join(tmpdir(), "lh-"));
const res = [];
for (const url of URLS) for (const strategy of ["mobile", "desktop"]) {
  const f = join(dir, "r.json");
  const args = ["-y", "lighthouse@12.6.1", url, "--only-categories=performance", "--output=json", `--output-path=${f}`, "--quiet",
    "--chrome-flags=--headless=new --no-sandbox", ...(strategy === "desktop" ? ["--preset=desktop"] : [])];
  try {
    execFileSync("npx", args, { stdio: "ignore", shell: true, env: { ...process.env, CHROME_PATH: CHROME }, timeout: 180000 });
    const j = JSON.parse(readFileSync(f, "utf8")), a = j.audits;
    const row = { url, strategy, score: Math.round(j.categories.performance.score * 100),
      lcp: Math.round(a["largest-contentful-paint"].numericValue), tbt: Math.round(a["total-blocking-time"].numericValue),
      cls: +a["cumulative-layout-shift"].numericValue.toFixed(3), fcp: Math.round(a["first-contentful-paint"].numericValue),
      lcpElement: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 160) || null };
    res.push(row); console.log(JSON.stringify(row));
  } catch (e) { res.push({ url, strategy, error: e.message.slice(0, 100) }); console.log("ERR", url, strategy); }
}
writeFileSync(OUT, JSON.stringify(res, null, 1));
