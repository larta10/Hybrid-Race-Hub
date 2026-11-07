// Pistas de instagram/music/ (catálogo en pistas.json) y rotación para no repetir en días seguidos.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { MUSIC_DIR } from "./common.mjs";

export function catalog() {
  const f = path.join(MUSIC_DIR, "pistas.json");
  if (!existsSync(f)) return [];
  return JSON.parse(readFileSync(f, "utf8"))
    .filter((t) => t.activa !== false && existsSync(path.join(MUSIC_DIR, t.archivo)))
    .map((t) => ({ ...t, path: path.join(MUSIC_DIR, t.archivo) }));
}

const dayNumber = (iso) => Math.floor(Date.parse(`${iso}T12:00:00Z`) / 86400000);
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());

/**
 * "auto": rota por día (día n → pista n mod N), así dos días seguidos nunca llevan la misma
 * pista si hay al menos dos. Un nombre de archivo concreto fuerza esa pista.
 * Las pistas con licencia de terceros van antes que las de reserva generadas.
 */
export function pickTrack(musica = "auto", fecha) {
  const all = catalog();
  if (!all.length) return null;
  if (musica && musica !== "auto") {
    const t = all.find((x) => x.archivo === musica);
    if (t) return t;
  }
  const externas = all.filter((t) => !t.reserva);
  const lista = externas.length >= 2 ? externas : all;
  return lista[dayNumber(fecha || today()) % lista.length];
}
