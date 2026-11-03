// Tabla Markdown a partir de uno o dos JSON de lighthouse-run.mjs (antes / después).
//   node scripts/lighthouse-table.mjs antes.json [despues.json]
import { readFileSync } from "node:fs";
const [a, b] = process.argv.slice(2).map(f => JSON.parse(readFileSync(f, "utf8")));
const key = r => `${r.url}|${r.strategy}`;
const B = b ? Object.fromEntries(b.map(r => [key(r), r])) : {};
const s = ms => (ms / 1000).toFixed(1).replace(".", ",") + " s";
const cell = (x, y, f) => y ? `${f(x)} → ${f(y)}` : f(x);
console.log(`| URL | Disp. | Puntuación | LCP | TBT (≈INP) | CLS | Elemento LCP |\n|---|---|---|---|---|---|---|`);
for (const r of a) {
  if (r.error) { console.log(`| ${r.url} | ${r.strategy} | error | | | | |`); continue; }
  const n = B[key(r)];
  const el = (r.lcpElement || "").match(/^<(\w+)[^>]*?(class="([^"]+)")?/);
  console.log(`| ${r.url.replace("https://hybridracehub.com", "") || "/"} | ${r.strategy === "mobile" ? "móvil" : "escritorio"} | ${cell(r.score, n?.score, x => x)} | ${cell(r.lcp, n?.lcp, s)} | ${cell(r.tbt, n?.tbt, x => x + " ms")} | ${cell(r.cls, n?.cls, x => String(x).replace(".", ","))} | ${el ? `\`${el[1]}${el[3] ? "." + el[3].split(" ")[0] : ""}\`` : ""} |`);
}
