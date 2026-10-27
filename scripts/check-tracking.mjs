// Comprueba que los eventos de medición llegan al dataLayer (sin GTM: se bloquea googletagmanager.com).
//   node scripts/check-tracking.mjs [http://localhost:3000]
import { chromium } from "@playwright/test";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const ctx = await browser.newContext();
await ctx.route(/googletagmanager\.com|amazon\.|hyrox\.es|spartan\.com|carrerasocr|hybrid-day/, r => r.abort());
await ctx.addInitScript(() => { try { localStorage.setItem("hrh_cookies_ok", "1"); } catch {} });
const page = await ctx.newPage();
const events = async () => page.evaluate(() => (window.dataLayer || []).filter(e => e && e.event).map(e => ({ ...e })));
const results = [];
const check = (name, list, ev) => { const hit = list.filter(e => e.event === ev).pop(); results.push([name, ev, hit ? JSON.stringify(Object.fromEntries(Object.entries(hit).filter(([k]) => k !== "gtm.uniqueEventId"))) : "NO LLEGA"]); };

// affiliate_click en un ranking
await page.goto(`${BASE}/productos/relojes`, { waitUntil: "domcontentloaded" });
await page.locator("a[data-aff]").first().click({ modifiers: [], noWaitAfter: true }).catch(() => {});
await page.waitForTimeout(500);
check("Ranking relojes", await events(), "affiliate_click");

// race_outbound_click + region_view en una región
await page.goto(`${BASE}/carreras-hibridas/madrid`, { waitUntil: "networkidle" });
check("Región Madrid", await events(), "region_view");
await page.locator(".rl-btn--main").first().click({ noWaitAfter: true }).catch(() => {});
await page.waitForTimeout(500);
check("Región Madrid", await events(), "race_outbound_click");

// search_used en el calendario y en centros
await page.goto(`${BASE}/calendario`, { waitUntil: "networkidle" });
await page.locator("input[type=search], input[type=text]").first().fill("hyrox");
await page.waitForTimeout(1600);
check("Calendario", await events(), "search_used");
await page.goto(`${BASE}/centros-entrenamiento`, { waitUntil: "networkidle" });
await page.locator("input[type=search]").first().fill("valencia");
await page.waitForTimeout(1600);
check("Centros", await events(), "search_used");

// contact_form_submit (se intercepta la API para no enviar correos)
await ctx.route("**/api/contact", r => r.fulfill({ status: 200, contentType: "application/json", body: "{\"ok\":true}" }));
await page.goto(`${BASE}/contacto-organizadores`, { waitUntil: "networkidle" });
const form = page.locator("form").first();
for (const input of await form.locator("input[required], textarea[required], select[required]").all()) {
  const type = await input.getAttribute("type");
  const tag = await input.evaluate(e => e.tagName);
  if (tag === "SELECT") await input.selectOption({ index: 1 }).catch(() => {});
  else if (type === "checkbox") await input.check().catch(() => {});
  else if (type === "email") await input.fill("prueba@example.com");
  else if (type === "date") await input.fill("2027-05-01");
  else if (type === "url") await input.fill("https://example.com");
  else await input.fill("Prueba de medición");
}
await form.locator("button[type=submit]").first().click().catch(() => {});
await page.waitForTimeout(1200);
check("Organizadores", await events(), "contact_form_submit");

await browser.close();
for (const r of results) console.log(r.join("  |  "));
process.exit(results.some(r => r[2] === "NO LLEGA") ? 1 : 0);
