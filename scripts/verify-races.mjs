// Verifica las carreras futuras de Supabase: responde la URL y qué dice la página sobre la inscripción.
// Solo lectura. Uso: node scripts/verify-races.mjs [salida.json]
import { readFileSync, writeFileSync } from "node:fs";

const U = "https://ssyljhtganuaanczxeep.supabase.co";
const K = readFileSync("lib/shared.js", "utf8").match(/ANON_KEY =\s*"([^"]+)"/)[1];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());

const SIGNALS = [
  ["agotado", /agotad[oa]s?|sold ?out|completo|no quedan plazas|plazas agotadas/i],
  ["cerrado", /inscripci[oó]n(es)? cerrad|inscripciones finalizad|registration closed/i],
  ["cancelado", /cancelad[oa]|suspendid[oa]|aplazad[oa]/i],
  ["proximamente", /pr[oó]ximamente|coming soon|abrir[aá]n|abren el|apertura de inscripciones/i],
  ["abierto", /inscr[ií]bete|inscripciones abiertas|inscribirme|comprar entradas?|buy tickets?|register now|reg[ií]strate|compra tu (dorsal|entrada)|book now|tickets/i],
];

const r = await fetch(`${U}/rest/v1/races?select=id,nombre,fecha_iso,url,estado,modalidad_parent,comunidad,municipio&modalidad_parent=in.(ocr,funcional)&fecha_iso=gte.${today}&order=fecha_iso.asc`, { headers: { apikey: K, Authorization: `Bearer ${K}` } });
const races = await r.json();
const out = [];
for (const race of races) {
  const res = { id: race.id, nombre: race.nombre, fecha_iso: race.fecha_iso, estado: race.estado, url: race.url };
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 25000);
    const p = await fetch(race.url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA, "Accept-Language": "es-ES,es;q=0.9" } });
    clearTimeout(t);
    res.status = p.status; res.final = p.url;
    const text = (await p.text()).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    res.signals = SIGNALS.filter(([, re]) => re.test(text)).map(([k]) => k);
    // Fragmentos con el año de la carrera para revisar a mano
    const y = race.fecha_iso.slice(0, 4);
    res.snippets = [...text.matchAll(new RegExp(`[^.]{0,90}(${y}|inscrip|agotad|sold out|pr[oó]ximamente)[^.]{0,90}`, "gi"))].slice(0, 5).map(m => m[0].trim());
  } catch (e) { res.status = "ERR " + (e.cause?.code || e.name); }
  out.push(res);
  console.log(`${res.id}\t${res.fecha_iso}\t${res.status}\t${(res.signals || []).join(",")}\t${race.estado}\t${race.nombre}`);
}
writeFileSync(process.argv[2] || "audit-report-races.json", JSON.stringify(out, null, 2));
