// Auditoría móvil: capturas en 390x844 (iPhone) y 360x800 (Android) y comprobaciones
// de scroll horizontal, zonas táctiles, texto pequeño, tablas que desbordan,
// menú móvil y buscadores.
//
//   node scripts/audit-mobile.mjs before            -> http://localhost:3000, capturas en audit-screenshots/before
//   node scripts/audit-mobile.mjs after https://hybridracehub.com
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const LABEL = args.find(a => !/^https?:/.test(a)) || "run";
const BASE = (args.find(a => /^https?:\/\//.test(a)) || "http://localhost:3000").replace(/\/$/, "");
const DIR = `audit-screenshots/${LABEL}`;
const VIEWPORTS = [{ name: "iphone", width: 390, height: 844 }, { name: "android", width: 360, height: 800 }];
const ROUTES = [
  "/", "/que-es-una-carrera-hibrida", "/centros-entrenamiento",
  "/carreras-hibridas/andalucia", "/carreras-hibridas/cataluna", "/carreras-hibridas/madrid",
  "/blog/que-es-hurbax", "/blog/plan-entrenamiento-hyrox-12-semanas",
  "/productos/zapatillas-hyrox", "/productos/relojes", "/calendario",
  ...args.filter(a => a.startsWith("/")),
];

function inspect() {
  const vw = window.innerWidth;
  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const scrollsX = el => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll") return true; } return false; };
  const label = el => (el.id ? "#" + el.id : el.tagName.toLowerCase() + ([...el.classList].slice(0, 2).map(c => "." + c).join(""))) + ` "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`;
  const out = { scrollWidth: document.documentElement.scrollWidth, vw, smallTargets: [], smallText: {}, tables: [] };

  // Zonas táctiles: botones y enlaces que no son texto dentro de un párrafo
  for (const el of document.querySelectorAll("a[href], button, [role=button], input, select, summary")) {
    if (!visible(el)) continue;
    if (el.closest("p, li p, td, figcaption, .crumbs, .sf-legal-text") && getComputedStyle(el).display === "inline") continue;
    if (el.type === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.height < 44 && r.width < 44 || r.height < 32) out.smallTargets.push(`${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  // Texto < 14px (agrupado por clase)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const el = t.parentElement;
    if (!el || !t.textContent.trim() || !visible(el)) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) { const k = `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} (${fs}px)`; out.smallText[k] = (out.smallText[k] || 0) + 1; }
  }
  for (const t of document.querySelectorAll("table")) {
    if (!visible(t)) continue;
    const r = t.getBoundingClientRect();
    if (r.right > vw + 1 && !scrollsX(t)) out.tables.push(label(t));
  }
  return out;
}

const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
mkdirSync(DIR, { recursive: true });
const report = [];
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem("hrh_consent", JSON.stringify({ a: false, p: false, v: 1, t: "qa" })); } catch {} });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    try { await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 }); } catch { await page.waitForTimeout(1500); }
    await page.waitForTimeout(300);
    const res = await page.evaluate(inspect);
    const name = (route === "/" ? "home" : route.slice(1).replace(/\//g, "_")) + `-${vp.name}`;
    await page.screenshot({ path: `${DIR}/${name}.png`, fullPage: false });
    // Menú móvil: abre y cierra
    let menu = "sin botón";
    const toggle = page.locator(".nav-toggle").first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      const opened = await page.locator(".mobile-nav-overlay").isVisible().catch(() => false);
      if (opened) await page.screenshot({ path: `${DIR}/${name}-menu.png` });
      await page.locator(".mobile-nav-close").click().catch(() => {});
      await page.waitForTimeout(200);
      const closed = !(await page.locator(".mobile-nav-overlay").isVisible().catch(() => false));
      menu = opened && closed ? "ok" : `abre:${opened} cierra:${closed}`;
    }
    // Buscador: escribe un término y comprueba que la lista cambia
    let search = null;
    const input = page.locator("input[type=search], input[type=text][placeholder*='usca'], input[placeholder*='iudad']").first();
    if (await input.isVisible().catch(() => false)) {
      const box = await input.boundingBox();
      await input.fill("madrid");
      await page.waitForTimeout(600);
      search = `visible ${Math.round(box.width)}x${Math.round(box.height)}, escribe ok`;
      await page.screenshot({ path: `${DIR}/${name}-search.png` });
    }
    const entry = { route, viewport: vp.name, horizontalScroll: res.scrollWidth > res.vw ? `${res.scrollWidth}>${res.vw}` : null,
      smallTargets: res.smallTargets, smallText: res.smallText, tablesOverflow: res.tables, menu, search };
    report.push(entry);
    console.log(`${vp.name} ${route}: scrollX=${entry.horizontalScroll || "no"} táctiles<44=${res.smallTargets.length} textos<12px=${Object.values(res.smallText).reduce((a, b) => a + b, 0)} tablas=${res.tables.length} menú=${menu}${search ? " buscador=" + search : ""}`);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${DIR}/report.json`, JSON.stringify(report, null, 2));
