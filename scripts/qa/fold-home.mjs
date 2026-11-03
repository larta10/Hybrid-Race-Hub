// Posición del listado de próximas carreras en la home a 390x844 (primer pantallazo móvil).
import { chromium } from "@playwright/test";
const b = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(process.argv[2] || "https://hybridracehub.com/", { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const q = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.height)]; };
  return { hero: q(".hero--home"), heroBody: q(".hero-body"), next: q(".home-next"), firstCard: q(".home-next .rc"), consent: q(".consent"), h2: q("#proximas") };
});
console.log(JSON.stringify(r));
await b.close();
