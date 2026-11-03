/* Textos de estado y precio para las tarjetas de carrera (mismos valores que la tabla races). */
import { priceNumber } from "./races-server";

/** Estado de inscripción → { label, kind: "open" | "last" | "closed" } */
export function raceStatus(r) {
  const e = String(r.estado || "").toLowerCase();
  if (!e) return null;
  if (/abiert/.test(e)) return { label: "Inscripción abierta", kind: "open" };
  if (/[uú]ltimas/.test(e)) return { label: "Últimas plazas", kind: "last" };
  if (/agotad/.test(e)) return { label: "Agotado", kind: "closed" };
  if (/cerrad/.test(e)) return { label: "Inscripción cerrada", kind: "closed" };
  if (/pr[oó]xim/.test(e)) return { label: "Aún no abierta", kind: "closed" };
  if (/pendiente|fecha/.test(e)) return { label: "Por confirmar", kind: "closed" };
  return null;
}

/** "Desde 50€" → "Desde 50 €"; sin cifra o "Consultar" → null */
export function racePrice(r) {
  const n = priceNumber(r.precio);
  if (n == null) return null;
  const amount = Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",");
  return /por equipo/i.test(r.precio || "") ? `${amount} € por equipo` : `Desde ${amount} €`;
}

const normW = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Título de la ficha: "Nombre Ciudad Año" sin repetir lo que ya lleva el nombre ("HYROX Madrid 2027"). */
export function raceDisplayName(r) {
  const year = String(r.fecha_iso || "").slice(0, 4);
  let name = String(r.nombre || "").replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  const has = s => normW(s).split(/[^a-z0-9]+/).some(w => w.length >= 4 && normW(name).includes(w));
  // El año va siempre al final, detrás de la ciudad: "Strong Race Otoño Palma 2026"
  if (year) name = name.replace(new RegExp(`\\s*\\b${year}\\b`), "").replace(/\s+[-–—]\s*$/, "").trim();
  if (r.municipio && !has(r.municipio) && !has(r.provincia)) name = `${name} ${r.municipio}`;
  return year ? `${name} ${year}` : name;
}
