// Comprueba el aviso de cookies y Consent Mode v2 con GTM real.
//   node scripts/check-consent.mjs [http://localhost:3000]
// 1) aparece en la primera visita  2) consent default 'denied' antes de GTM  3) sin cookies _ga antes de elegir
// 4) Aceptar lanza consent update + evento consent_update  5) no reaparece al recargar  6) el pie lo reabre
import { chromium } from "@playwright/test";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const results = [];
const ok = (name, cond, extra = "") => results.push(`${cond ? "✓" : "✗"} ${name}${extra ? ` (${extra})` : ""}`);

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const banner = page.locator(".consent");
ok("El aviso aparece en la primera visita", await banner.isVisible());
const box = await banner.boundingBox();
ok("El aviso ocupa como mucho el 40 % de la pantalla", box && box.height <= 844 * 0.4 + 1, box ? `${Math.round(box.height)} px` : "");
const btns = await page.locator(".consent-btn").evaluateAll(els => els.map(e => { const s = getComputedStyle(e); return `${e.offsetWidth}x${e.offsetHeight}|${s.backgroundColor}|${s.color}|${s.fontWeight}`; }));
ok("Aceptar, Rechazar y Configurar con la misma prominencia", btns.length === 3 && new Set(btns.map(b => b.split("|").slice(1).join("|"))).size === 1, btns.join(" / "));
const defaults = await page.evaluate(() => (window.dataLayer || []).filter(e => e && e[0] === "consent").map(e => [e[1], JSON.stringify(e[2])]));
ok("Consent default 'denied' en el dataLayer", defaults[0]?.[0] === "default" && /"analytics_storage":"denied"/.test(defaults[0][1]), defaults[0]?.[1]);
const gtmIndex = await page.evaluate(() => (window.dataLayer || []).findIndex(e => e && e.event === "gtm.js"));
ok("El default va antes que GTM", gtmIndex > 0, `gtm.js en posición ${gtmIndex}`);
let cookies = (await ctx.cookies()).map(c => c.name);
ok("Sin cookies _ga antes de elegir", !cookies.some(n => n.startsWith("_ga")), cookies.join(",") || "ninguna");

await page.locator(".consent-btn", { hasText: "Aceptar" }).click();
await page.waitForTimeout(1500);
const dl = await page.evaluate(() => (window.dataLayer || []).map(e => (e && e[0] === "consent" ? `consent:${e[1]}` : e && e.event)).filter(Boolean));
ok("Aceptar lanza consent update", dl.includes("consent:update"));
ok("Aceptar lanza el evento consent_update", dl.includes("consent_update"));
cookies = (await ctx.cookies()).map(c => c.name);
ok("Se guarda la cookie propia hrh_consent", cookies.includes("hrh_consent"));

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok("No reaparece tras elegir", !(await banner.isVisible()));
const upd = await page.evaluate(() => (window.dataLayer || []).filter(e => e && e[0] === "consent").map(e => e[1]));
ok("Al recargar se aplica la elección guardada", upd.includes("update"), upd.join(","));

await page.locator(".sf-consent-link").first().click();
await page.waitForTimeout(500);
ok("«Configurar cookies» del pie reabre el aviso", await banner.isVisible());

// Rechazar en un contexto limpio: sin cookies _ga
const ctx2 = await browser.newContext();
const p2 = await ctx2.newPage();
await p2.goto(`${BASE}/`, { waitUntil: "networkidle" });
await p2.locator(".consent-btn", { hasText: "Rechazar" }).click();
await p2.waitForTimeout(2000);
const c2 = (await ctx2.cookies()).map(c => c.name);
ok("Rechazar no crea cookies _ga", !c2.some(n => n.startsWith("_ga")), c2.join(","));

await browser.close();
console.log(results.join("\n"));
process.exit(results.some(r => r.startsWith("✗")) ? 1 : 0);
