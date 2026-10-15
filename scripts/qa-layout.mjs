// QA automático de layout responsive.
// Recorre las rutas principales en 7 anchos y falla si algo se sale del viewport.
//
//   npm run qa:layout                       -> build + next start en :3100 y revisa
//   npm run qa:layout -- --no-build         -> reutiliza el build existente
//   npm run qa:layout -- https://hybridracehub.com   -> revisa una URL ya desplegada
//   npm run qa:layout -- --no-shots         -> sin capturas (más rápido)
//
// Usa el Chromium de Playwright si está instalado y, si no, el Chrome del sistema.
import { chromium } from "@playwright/test";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const urlArg = args.find(a => /^https?:\/\//.test(a));
const NO_BUILD = args.includes("--no-build");
const NO_SHOTS = args.includes("--no-shots");
const PORT = 3100;
const BASE = (urlArg || `http://localhost:${PORT}`).replace(/\/$/, "");
const WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920];
const HEIGHT = 900;
const ROUTES = [
  "/",
  "/calendario",
  "/centros-entrenamiento",
  "/calculadora",
  "/calculadora-hyrox",
  "/blog",
  "/blog/categoria/entrenamiento",
  "/blog/hyrox-vs-ocr-diferencias",
  "/blog/equipamiento-ocr-guia-compra-2026",
  "/blog/plan-entrenamiento-hyrox-12-semanas",
  "/blog/que-es-el-hyatlon",
  "/blog/que-es-hurbax",
  "/blog/mejores-podcasts-hyrox-deporte-hibrido",
  "/productos",
  "/productos/relojes",
  "/carreras-hibridas/madrid",
  "/que-es-una-carrera-hibrida",
  "/sobre-nosotros",
  "/plan-entrenamiento",
  "/esta-pagina-no-existe-qa",
];
const SHOTS = "qa-screenshots";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function startServer() {
  if (!NO_BUILD) {
    console.log("› npm run build");
    const b = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true });
    if (b.status !== 0) { console.error("El build ha fallado."); process.exit(1); }
  }
  console.log(`› next start -p ${PORT}`);
  const srv = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(BASE + "/"); if (r.ok) return srv; } catch {}
    await sleep(500);
  }
  srv.kill(); throw new Error("El servidor no arrancó en :" + PORT);
}

async function launch() {
  try { return await chromium.launch(); }
  catch { return await chromium.launch({ channel: "chrome" }); }
}

// Se ejecuta en la página: devuelve desbordamiento del documento y elementos que se salen por la derecha
function inspect() {
  const vw = window.innerWidth;
  const out = { scrollWidth: document.documentElement.scrollWidth, vw, offenders: [] };
  const scrollsX = el => { const o = getComputedStyle(el).overflowX; return o === "auto" || o === "scroll"; };
  const inScroller = el => { for (let p = el; p && p !== document.body; p = p.parentElement) if (scrollsX(p)) return true; return false; };
  const inFixedOffscreen = (el, r) => {
    if (r.left < vw) return false; // empieza dentro: no es un panel fuera de pantalla
    for (let p = el; p; p = p.parentElement) { const pos = getComputedStyle(p).position; if (pos === "fixed") return true; }
    return false;
  };
  const sel = el => {
    if (el.id) return `#${el.id}`;
    let s = el.tagName.toLowerCase();
    const cls = [...el.classList].slice(0, 2).join(".");
    if (cls) s += "." + cls;
    const parent = el.parentElement;
    if (parent && parent !== document.body) {
      const pc = [...parent.classList].slice(0, 1).join(".");
      s = (parent.id ? `#${parent.id}` : parent.tagName.toLowerCase() + (pc ? "." + pc : "")) + " > " + s;
    }
    return s;
  };
  const flagged = new Set();
  for (const el of document.body.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "BR"].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= vw + 1) continue;
    // sr-only y similares (clip a 1px)
    if (r.width <= 1 && r.height <= 1) continue;
    if (inScroller(el)) continue;
    if (inFixedOffscreen(el, r)) continue;
    // Solo el elemento más externo: si el padre ya se sale, el hijo no aporta
    if (el.parentElement && flagged.has(el.parentElement)) { flagged.add(el); continue; }
    flagged.add(el);
    out.offenders.push({ sel: sel(el), px: Math.round(r.right - vw) });
  }
  return out;
}

const srv = urlArg ? null : await startServer();
if (!NO_SHOTS) mkdirSync(SHOTS, { recursive: true });
const browser = await launch();
const failures = [];
let checks = 0;
try {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: HEIGHT }, deviceScaleFactor: 1 });
    // Cookie banner aceptado para que no tape contenido en las capturas
    await ctx.addInitScript(() => { try { localStorage.setItem("hrh_cookies_ok", "1"); } catch {} });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      checks++;
      try {
        await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
      } catch { await page.waitForTimeout(1500); }
      await page.waitForTimeout(400);
      const res = await page.evaluate(inspect);
      const name = (route === "/" ? "home" : route.replace(/^\//, "").replace(/[\/]/g, "_")) + `-${width}`;
      if (!NO_SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
      const problems = [];
      if (res.scrollWidth > res.vw) problems.push(`scroll horizontal: documento ${res.scrollWidth}px > viewport ${res.vw}px`);
      for (const o of res.offenders.slice(0, 12)) problems.push(`${o.sel} se sale ${o.px}px`);
      if (res.offenders.length > 12) problems.push(`… y ${res.offenders.length - 12} elementos más`);
      if (problems.length) failures.push({ route, width, problems });
      process.stdout.write(problems.length ? "✗" : "·");
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv?.kill();
}

console.log(`\n\n${checks} combinaciones ruta × ancho revisadas en ${BASE}`);
if (!failures.length) { console.log("✓ 0 fallos: nada se sale del viewport."); process.exit(0); }
console.log(`✗ ${failures.length} combinaciones con fallos:\n`);
for (const f of failures) {
  console.log(`${f.route} @ ${f.width}px`);
  f.problems.forEach(p => console.log(`   - ${p}`));
}
process.exit(1);
