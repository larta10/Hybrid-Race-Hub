// Capturas del rediseño: node scripts/screenshots.mjs <carpeta> [base] [anchos separados por comas]
//   node scripts/screenshots.mjs antes            -> audit-screenshots/antes, 390x844 y 1440x900
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [label = "run", baseArg, widthsArg] = process.argv.slice(2);
const BASE = (baseArg || "http://localhost:3000").replace(/\/$/, "");
const SIZES = { 360: 800, 390: 844, 1440: 900 };
const widths = (widthsArg || "390,1440").split(",").map(Number);
export const PAGES = [
  "/", "/que-es-una-carrera-hibrida", "/centros-entrenamiento", "/centros-entrenamiento/madrid",
  "/carreras-hibridas/andalucia", "/carreras-hibridas/galicia", "/blog/que-es-hyrox", "/productos/zapatillas-hyrox",
];
const dir = `audit-screenshots/${label}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: SIZES[w] || 900 }, deviceScaleFactor: w < 500 ? 2 : 1, isMobile: w < 500, hasTouch: w < 500 });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("hrh_consent", JSON.stringify({ a: false, p: false, v: 1, t: "qa" })); } catch {}
    try { localStorage.setItem("hrh_cookies_ok", "1"); } catch {}
  });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(400);
    const name = (p === "/" ? "home" : p.slice(1).replace(/\//g, "_")) + `-${w}`;
    await page.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
    await page.screenshot({ path: `${dir}/${name}-full.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(`Capturas en ${dir}`);
