// QA final del rediseño: capturas en 360x800, 390x844 y 1440x900 (audit-screenshots/despues),
// sin scroll horizontal, zonas táctiles ≥ 44 px, texto ≥ 14 px y accesibilidad con axe-core.
//   node scripts/qa-final.mjs [base]
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const PAGES = ["/", "/que-es-una-carrera-hibrida", "/centros-entrenamiento", "/centros-entrenamiento/madrid",
  "/carreras-hibridas/andalucia", "/carreras-hibridas/galicia", "/blog/que-es-hyrox", "/productos/zapatillas-hyrox", "/calendario"];
const VIEWPORTS = [[360, 800], [390, 844], [1440, 900]];
const DIR = "audit-screenshots/despues";
mkdirSync(DIR, { recursive: true });

function inspect() {
  const vis = el => { const s = getComputedStyle(el); if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const small = [];
  for (const el of document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button]")) {
    if (!vis(el)) continue;
    const inline = getComputedStyle(el).display === "inline";
    if (inline && el.closest("p, li, td, dd, figcaption, .crumbs, label")) continue; // enlaces dentro de texto corrido
    if (el.closest(".sr-only")) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 44 && !(el.type === "checkbox" || el.type === "radio")) small.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  const tiny = {};
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const el = w.currentNode.parentElement;
    if (!el || !w.currentNode.textContent.trim() || !vis(el) || el.closest("script,style,noscript,.sr-only")) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 14) { const k = `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ${fs}px`; tiny[k] = (tiny[k] || 0) + 1; }
  }
  return { overflow: document.documentElement.scrollWidth > window.innerWidth ? `${document.documentElement.scrollWidth}>${window.innerWidth}` : null, small, tiny };
}

const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const report = [];
for (const [w, h] of VIEWPORTS) {
  const mobile = w < 500;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => { try { localStorage.setItem("hrh_consent", JSON.stringify({ a: false, p: false, v: 1, t: "qa" })); } catch {} });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(300);
    const name = (p === "/" ? "home" : p.slice(1).replace(/\//g, "_")) + `-${w}`;
    await page.screenshot({ path: `${DIR}/${name}.png` });
    const r = await page.evaluate(inspect);
    let axe = null;
    if (w === 390) {
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      axe = res.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
    }
    report.push({ page: p, viewport: `${w}x${h}`, ...r, axe });
    const crit = (axe || []).filter(v => ["critical", "serious"].includes(v.impact));
    console.log(`${w} ${p}: scrollX=${r.overflow || "no"} táctiles<44=${r.small.length} texto<14=${Object.values(r.tiny).reduce((a, b) => a + b, 0)}${axe ? ` axe(crít/grave)=${crit.map(v => `${v.id}:${v.n}`).join(",") || 0}` : ""}`);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${DIR}/qa-report.json`, JSON.stringify(report, null, 2));
