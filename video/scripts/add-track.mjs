// Añade una pista descargada (p. ej. de Pixabay Music) al catálogo de los Reels:
// la normaliza a -14 LUFS, la guarda en instagram/music/ y la registra en pistas.json.
//
//   node scripts/add-track.mjs <archivo.mp3> "<título>" "<autor>" "<url de la pista>" [bpm]
//
// Después, añade la fila correspondiente a instagram/music/LICENCIAS.md.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { MUSIC_DIR, ffmpeg, mediaDuration } from "./lib/common.mjs";

const [file, titulo, autor, url, bpm] = process.argv.slice(2);
if (!file || !titulo || !autor || !url) {
  console.log('Uso: node scripts/add-track.mjs <archivo.mp3> "<título>" "<autor>" "<url>" [bpm]');
  process.exit(1);
}
if (!/^https:\/\/pixabay\.com\/music\//.test(url)) console.warn("Aviso: la URL no es de Pixabay Music. Comprueba que la licencia permite uso comercial en redes.");
const slug = titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const archivo = `${slug}.m4a`;
const dest = path.join(MUSIC_DIR, archivo);
ffmpeg(["-i", path.resolve(file), "-vn", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "2", "-c:a", "aac", "-b:a", "160k", dest]);
const dur = mediaDuration(dest);
if (dur < 40) console.warn(`Aviso: dura ${dur.toFixed(0)} s; un Reel puede llegar a 40 s.`);

const cat = path.join(MUSIC_DIR, "pistas.json");
const list = existsSync(cat) ? JSON.parse(readFileSync(cat, "utf8")) : [];
const fila = { archivo, titulo, autor, url, licencia: "Pixabay Content License (uso comercial permitido, sin atribución obligatoria)", bpm: bpm ? Number(bpm) : null, offset: 0, reserva: false };
const i = list.findIndex((t) => t.archivo === archivo);
if (i >= 0) list[i] = fila;
else list.unshift(fila);
writeFileSync(cat, JSON.stringify(list, null, 2) + "\n");
console.log(`${dest} (${dur.toFixed(0)} s) añadida al catálogo. Con 2 o más pistas de Pixabay, las de reserva dejan de usarse.`);
