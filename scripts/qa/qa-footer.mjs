// QA del pie: capturas, altura del <footer>, scroll horizontal, centrado, alineación de columnas y contraste (axe).
//   node scripts/qa/qa-footer.mjs antes|despues [http://localhost:3100]
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const TAG = process.argv[2] || "antes";
const BASE = (process.argv[3] || "http://localhost:3100").replace(/\/$/, "");
const ROUTES = { home: "/", ficha: "/carreras/hyrox-madrid-2027" };
const SIZES = [[360, 800], [390, 844], [768, 1024], [1440, 900]];
const DIR = "audit-screenshots/footer";
mkdirSync(DIR, { recursive: true });
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const out = [];
for (const [name, path] of Object.entries(ROUTES)) for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  // Banner de cookies ya respondido para que no tape el pie en las capturas
  await ctx.addInitScript(() => { try { localStorage.setItem("hrh_consent", JSON.stringify({ a: false, p: false, v: 1, t: "qa" })); } catch {} });
  const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: "networkidle" });
  const m = await p.evaluate(() => {
    const f = document.querySelector("footer");
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const inner = f.querySelector(".ft-inner, .sf-inner");
    const ir = inner?.getBoundingClientRect();
    const cols = [...f.querySelectorAll(".ft-col")].map(c => Math.round(c.getBoundingClientRect().top));
    return {
      height: Math.round(r.height), overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      centered: ir ? Math.abs((ir.left) - (window.innerWidth - ir.right)) <= 2 : null,
      colTops: cols, links: f.querySelectorAll("a[href]").length,
    };
  });
  await p.locator("footer").scrollIntoViewIfNeeded();
  await p.locator("footer").screenshot({ path: `${DIR}/${TAG}-${name}-${w}x${h}.png` });
  let contrast = null;
  if (w === 390 || w === 1440) {
    const ax = await new AxeBuilder({ page: p }).include("footer").withRules(["color-contrast"]).analyze();
    contrast = ax.violations.reduce((n, v) => n + v.nodes.length, 0);
  }
  const row = { tag: TAG, page: name, size: `${w}x${h}`, ...m, screens: m ? +(m.height / h).toFixed(2) : null, contrastViolations: contrast };
  out.push(row);
  console.log(`${TAG} ${name} ${w}x${h}: pie ${m?.height}px (${row.screens} pantallas), ${m?.links} enlaces, scroll-x ${m?.overflowX}, centrado ${m?.centered}, columnas a ${JSON.stringify(m?.colTops)}, contraste ${contrast ?? "-"}`);
  await ctx.close();
}
await browser.close();
writeFileSync(`docs/seo/data/qa-footer-${TAG}.json`, JSON.stringify(out, null, 1));
