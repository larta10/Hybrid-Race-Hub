// Inserta las carreras de 2027 de data/import-2027-*.json en Supabase.
// SOLO inserta filas nuevas: no actualiza ni borra nada.
//
// Uso (PowerShell):  $env:SUPABASE_SERVICE_KEY="..."; node scripts/insert-races-2027.mjs
// Uso (Git Bash):    SUPABASE_SERVICE_KEY=... node scripts/insert-races-2027.mjs
// Añade --dry-run para ver qué haría sin escribir.
//
// La clave service_role NO se guarda en el repo: se pasa solo por variable de entorno.
import { readFileSync } from "node:fs";

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
const DRY = process.argv.includes("--dry-run");
const FILE = process.argv.find(a => a.endsWith(".json")) || "data/import-2027-2026-10-14.json";
const BATCH = 5;

if (!KEY && !DRY) {
  console.error("Falta SUPABASE_SERVICE_KEY (Supabase > Project Settings > API > service_role).");
  process.exit(1);
}

// Para leer (deduplicar) basta la clave pública anon de lib/shared.js
const ANON = readFileSync("lib/shared.js", "utf8").match(/ANON_KEY\s*=\s*"([^"]+)"/)[1];
const READ_KEY = KEY || ANON;
const headers = { apikey: READ_KEY, Authorization: `Bearer ${READ_KEY}`, "Content-Type": "application/json" };
const races = JSON.parse(readFileSync(FILE, "utf8")).races.map(({ _fuente, ...r }) => r);

// Serie = primeras palabras del nombre sin año ni sufijos (p. ej. "DEKA", "HYROX", "Desafío de Guerreros")
const series = n => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/\b20\d\d\b/g, "").split(/\s+/).slice(0, 2).join(" ");

async function exists(r) {
  const q = new URLSearchParams({ select: "id,nombre,fecha_iso,municipio,ubicacion", fecha_iso: `eq.${r.fecha_iso}` });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/races?${q}`, { headers });
  if (!res.ok) throw new Error(`SELECT ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  const city = (r.municipio || "").toLowerCase();
  return rows.find(x => series(x.nombre) === series(r.nombre) &&
    ((x.municipio || "").toLowerCase() === city || (x.ubicacion || "").toLowerCase().includes(city)));
}

const toInsert = [];
for (const r of races) {
  const dup = await exists(r);
  if (dup) console.log(`OMITIDA (ya existe id ${dup.id}): ${r.nombre} ${r.fecha_iso}`);
  else toInsert.push(r);
}
console.log(`${toInsert.length} de ${races.length} carreras para insertar.`);
if (DRY) { toInsert.forEach(r => console.log(" ·", r.fecha_iso, r.nombre)); process.exit(0); }

let ok = 0;
for (let i = 0; i < toInsert.length; i += BATCH) {
  const lote = toInsert.slice(i, i + BATCH);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/races`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(lote),
  });
  if (!res.ok) { console.error(`Lote ${i / BATCH + 1} falló: ${res.status} ${await res.text()}`); process.exit(1); }
  const inserted = await res.json();
  // Verificación con SELECT posterior
  const ids = inserted.map(x => x.id).join(",");
  const check = await (await fetch(`${SUPABASE_URL}/rest/v1/races?select=id,nombre,fecha_iso&id=in.(${ids})`, { headers })).json();
  if (check.length !== lote.length) { console.error(`Lote ${i / BATCH + 1}: insertadas ${lote.length}, verificadas ${check.length}`); process.exit(1); }
  check.forEach(x => console.log(`  ✓ ${x.id} ${x.fecha_iso} ${x.nombre}`));
  ok += check.length;
}
console.log(`Hecho: ${ok} carreras insertadas y verificadas.`);
