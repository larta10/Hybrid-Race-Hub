// QA de la auditoría de noviembre: 6 plantillas a 390x844 y 1440x900.
// Sin scroll horizontal, objetivos táctiles ≥ 44 px (enlaces y botones visibles fuera de párrafos) y banner de cookies.
//   node scripts/qa/qa-nov.mjs [https://hybridracehub.com] [salida.json]
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const OUT = process.argv[3] || "qa-nov.json";
const ROUTES = ["/", "/carreras-hibridas/madrid", "/carreras/hyrox-madrid-2027", "/calendario/2026/noviembre", "/productos/zapatillas-hyrox", "/centros-entrenamiento/madrid"];
const SIZES = [[390, 844], [1440, 900]];
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const res = [];
mkdirSync("qa-screenshots/nov", { recursive: true });
for (const [w, h] of SIZES) for (const r of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const resp = await p.goto(BASE + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const banner = await p.locator(".consent").isVisible().catch(() => false);
  const bannerBox = banner ? await p.locator(".consent").boundingBox() : null;
  const m = await p.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - doc.clientWidth;
    // Táctiles: enlaces y botones visibles que no están dentro de un párrafo o celda de texto (los enlaces en línea están exentos, WCAG 2.5.8)
    const small = [...document.querySelectorAll("a[href], button, select, input:not([type=hidden])")].filter(el => {
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      if (!b.width || !b.height || cs.visibility === "hidden" || cs.display === "none") return false;
      if (el.closest("p, td, li.rc-year-head, .crumbs, dd, figcaption, summary, .consent-text")) return false;
      // Enlace estirado de la tarjeta de carrera: el área pulsable es toda la tarjeta (::after con inset 0)
      if (el.classList.contains("rc-open")) { const card = el.closest(".rc"); return card ? card.getBoundingClientRect().height < 44 - 0.5 : true; }
      if (el.closest(".consent") && el.tagName === "A") return false;
      return b.height < 44 - 0.5;
    }).map(el => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} "${(el.textContent || "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`);
    return { overflow, small: [...new Set(small)].slice(0, 8), smallCount: small.length };
  });
  // Aceptar el banner y comprobar que se cierra
  let closes = null;
  if (banner) { await p.locator(".consent-btn", { hasText: "Rechazar" }).click().catch(() => {}); await p.waitForTimeout(400); closes = !(await p.locator(".consent").isVisible().catch(() => false)); }
  await p.screenshot({ path: `qa-screenshots/nov/${w}${r.replace(/\//g, "_") || "_home"}.png` });
  res.push({ route: r, size: `${w}x${h}`, status: resp?.status(), overflow: m.overflow, smallTargets: m.smallCount, examples: m.small, banner, bannerHeight: bannerBox && Math.round(bannerBox.height), bannerCloses: closes });
  console.log(`${w} ${r} · HTTP ${resp?.status()} · scroll-x ${m.overflow}px · táctiles<44: ${m.smallCount} · banner ${banner ? `${Math.round(bannerBox.height)}px, se cierra: ${closes}` : "no"}`);
  if (m.smallCount) console.log("   ", m.small.join(" | "));
  await ctx.close();
}
await browser.close();
writeFileSync(OUT, JSON.stringify(res, null, 1));
