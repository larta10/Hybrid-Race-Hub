// Busca carreras duplicadas (misma carrera, ciudad y fecha) en home, regiones, fichas, calendario mensual y sitemap,
// y comprueba los estados canónicos y que las "por confirmar" no salen en el Event schema.
//   node scripts/qa/check-duplicates.mjs [http://localhost:3100]
const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const get = async p => (await fetch(BASE + p)).text();
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\b20\d\d\b|\([^)]*\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const out = [];
let fails = 0;
const report = (name, dups) => { out.push(`${dups.length ? "✗" : "✓"} ${name}${dups.length ? ": " + dups.join(" | ") : ""}`); if (dups.length) fails++; };

// Tarjetas de una página: (fecha + nombre) repetidos
function cards(html) {
  return [...html.matchAll(/<li class="rc">[\s\S]*?dateTime="([^"]+)"[\s\S]*?class="rc-open" href="([^"]+)">([^<]+)<\/a>[\s\S]*?<\/li>/g)].map(m => ({ date: m[1], href: m[2], name: m[3] }));
}
const dupsOf = (list, key) => { const seen = new Map(); const d = []; for (const x of list) { const k = key(x); if (seen.has(k)) d.push(`${x.name} (${x.date})`); seen.set(k, 1); } return d; };

const sm = await get("/sitemap.xml");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
report("sitemap: URLs repetidas", locs.filter((u, i) => locs.indexOf(u) !== i));
const fichas = locs.filter(u => u.includes("/carreras/")).map(u => u.split("/carreras/")[1]);
// Fichas que son la misma carrera con otro slug (mismo nombre base y año)
const base = fichas.map(s => s.replace(/-\d+$/, ""));
report("sitemap: fichas con el mismo slug base", base.filter((u, i) => base.indexOf(u) !== i));

const pages = ["/", "/calendario", ...locs.filter(u => /\/carreras-hibridas\/|\/calendario\/20\d\d\/|\/calendario\/[a-z]+$/.test(u)).map(u => new URL(u).pathname)];
for (const p of pages) {
  const c = cards(await get(p));
  report(`${p} (${c.length} tarjetas): misma carrera repetida`, [
    ...dupsOf(c, x => x.href),
    ...dupsOf(c, x => `${x.date}|${norm(x.name)}`),
  ]);
}

// Fichas: estado canónico y schema
const BADGES = ["Inscripción abierta", "Agotado", "Inscripción cerrada", "Aún no abierta", "Por confirmar"];
let pending = 0, pendingWithEvent = 0, pendingWithButton = 0, badBadge = 0;
for (const s of fichas) {
  const h = await get(`/carreras/${s}`);
  const badge = (h.match(/<span class="st st--[a-z]+">([^<]+)<\/span>/) || [])[1];
  if (!BADGES.includes(badge)) badBadge++;
  if (badge === "Por confirmar") {
    pending++;
    if (/"@type":"SportsEvent"/.test(h)) pendingWithEvent++;
    if (/class="btn-solid"[^>]*>Inscribirme/.test(h)) pendingWithButton++;
  }
}
report(`fichas (${fichas.length}): badge fuera de los 5 estados`, badBadge ? [`${badBadge} fichas`] : []);
report(`fichas por confirmar (${pending}): con SportsEvent`, pendingWithEvent ? [`${pendingWithEvent}`] : []);
report(`fichas por confirmar (${pending}): con botón de inscripción destacado`, pendingWithButton ? [`${pendingWithButton}`] : []);
console.log(out.join("\n"));
process.exit(fails ? 1 : 0);
