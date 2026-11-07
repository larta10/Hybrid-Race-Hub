// Importa pistas de Openverse (api.openverse.org) por id: solo CC0 o CC BY (nunca NC ni ND).
// Descarga, normaliza a -14 LUFS, salta la intro tranquila y registra la pista en
// instagram/music/pistas.json con su texto de atribución. Después regenera LICENCIAS.md.
//
//   node scripts/fetch-music.mjs <openverse_id> [<openverse_id>…]
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { MUSIC_DIR, FFMPEG, ffmpeg, mediaDuration, mkdirp, CACHE } from "./lib/common.mjs";

const UA = { "User-Agent": "HybridRaceHub-reels/1.0" };
const OK = /^(cc0|by)$/;
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\.(wav|mp3|m4a)$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

/** Primer segundo en que la pista llega al 70 % de su energía típica (para saltar intros suaves) */
function inicioConEnergia(file) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", file, "-af", "astats=metadata=1:reset=44100,ametadata=print:key=lavfi.astats.Overall.RMS_level", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const rms = [...(r.stderr || "").matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === "-inf" ? -120 : Number(m[1])));
  if (rms.length < 10) return 0;
  const orden = [...rms].sort((a, b) => a - b);
  const mediana = orden[Math.floor(orden.length / 2)];
  const i = rms.findIndex((v) => v >= mediana - 3);
  return Math.max(0, i);
}

const catPath = path.join(MUSIC_DIR, "pistas.json");
const cat = existsSync(catPath) ? JSON.parse(readFileSync(catPath, "utf8")) : [];
mkdirp(path.join(CACHE, "musica"));

for (const id of process.argv.slice(2)) {
  const r = await fetch(`https://api.openverse.org/v1/audio/${id}/`, { headers: UA });
  if (!r.ok) throw new Error(`Openverse ${r.status} para ${id}`);
  const a = await r.json();
  if (!OK.test(a.license)) throw new Error(`${a.title}: licencia ${a.license} no permitida (solo CC0 o CC BY)`);
  const orig = path.join(CACHE, "musica", `${id}.${a.filetype?.replace("mp32", "mp3") || "mp3"}`);
  if (!existsSync(orig)) {
    const f = await fetch(a.url, { headers: UA, redirect: "follow" });
    if (!f.ok) throw new Error(`Descarga ${f.status}: ${a.title}`);
    writeFileSync(orig, Buffer.from(await f.arrayBuffer()));
  }
  const archivo = `${a.license === "cc0" ? "cc0" : "ccby"}-${slug(a.title)}.m4a`;
  const dest = path.join(MUSIC_DIR, archivo);
  ffmpeg(["-i", orig, "-vn", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "2", "-c:a", "aac", "-b:a", "160k", dest]);
  const dur = mediaDuration(dest);
  let inicio = inicioConEnergia(dest);
  if (dur - inicio < 42) inicio = Math.max(0, Math.floor(dur - 42));
  const licencia = a.license === "cc0" ? "CC0 1.0 (dominio público)" : `CC BY ${a.license_version}`;
  const fila = {
    archivo,
    titulo: a.title,
    autor: a.creator,
    url: a.foreign_landing_url,
    openverse_id: id,
    fuente: a.source,
    licencia,
    licencia_url: a.license_url,
    // Solo las CC BY obligan a citar: el publicador añade "Música: …" al caption
    atribucion: a.license === "cc0" ? null : `${a.title} – ${a.creator} (CC BY)`,
    atribucion_completa: a.attribution,
    etiquetas: (a.tags || []).map((t) => t.name).join(", "),
    duracion: Math.round(dur),
    inicio,
    bpm: null,
    offset: 0,
    reserva: false,
  };
  const i = cat.findIndex((t) => t.openverse_id === id);
  if (i >= 0) cat[i] = fila;
  else cat.push(fila);
  console.log(`${archivo}: ${Math.round(dur)} s, empieza en ${inicio} s · ${licencia} · ${a.title} – ${a.creator}`);
}

// Con 4 o más pistas buenas, fuera las de reserva generadas
const buenas = cat.filter((t) => !t.reserva);
let final = cat;
if (buenas.length >= 4) {
  for (const t of cat.filter((x) => x.reserva)) rmSync(path.join(MUSIC_DIR, t.archivo), { force: true });
  final = buenas;
}
writeFileSync(catPath, JSON.stringify(final, null, 2) + "\n");

// LICENCIAS.md a partir del catálogo
const filas = final.map((t) => `| ${t.archivo} | ${t.titulo} | ${t.autor} | ${t.url || "—"} | ${t.licencia} | ${t.atribucion ? `Música: ${t.atribucion}` : "No hace falta (CC0)"} |`);
writeFileSync(
  path.join(MUSIC_DIR, "LICENCIAS.md"),
  `# Música de los Reels

Pistas de Openverse (https://openverse.org) con licencias que permiten uso comercial: primero CC0
(dominio público, sin atribución) y después CC BY (uso comercial permitido citando al autor).
Nunca NC (no comercial) ni ND (sin obras derivadas). Catálogo en \`pistas.json\`.

- Normalizadas a unos -14 LUFS (loudnorm de ffmpeg); suenan bajas bajo el texto, con fundido de entrada y salida.
- Cada pista empieza en su campo \`inicio\` para saltar intros tranquilas.
- Rotación diaria: dos días seguidos nunca llevan la misma pista.
- Las CC BY añaden solas al caption del reel la línea "Música: Título – Autor (CC BY)".
- Se eligieron por sus etiquetas (instrumental, energética, deporte) y descartando las marcadas
  como "vocal". Si alguna resulta tener voz al escucharla, pon \`"activa": false\` en \`pistas.json\`.

Importar más: \`node scripts/fetch-music.mjs <id de Openverse>\` (desde \`video/\`).

| Archivo | Título | Autor | URL | Licencia | Texto de atribución |
|---|---|---|---|---|---|
${filas.join("\n")}

Texto de atribución completo de cada pista (CC BY) en el campo \`atribucion_completa\` de \`pistas.json\`.
`,
);
console.log(`${final.length} pistas en el catálogo`);
