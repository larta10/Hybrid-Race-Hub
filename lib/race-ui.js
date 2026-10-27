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
