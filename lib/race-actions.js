/* Acciones de una carrera en el navegador: .ics y compartir por WhatsApp. */
import { track } from "./shared";
import { SITE_URL } from "./site";

const pad = n => String(n).padStart(2, "0");
const esc = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Genera el texto de un .ics de día completo para la carrera. */
export function buildIcs(race, pageUrl) {
  const [y, m, d] = race.fecha_iso.split("-").map(Number);
  const start = `${y}${pad(m)}${pad(d)}`;
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  const end = `${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`;
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const place = race.ubicacion || race.municipio || race.provincia || race.comunidad || "";
  const desc = [
    race.modalidad && `Modalidad: ${race.modalidad}`,
    race.formato && `Formato: ${race.formato}`,
    race.precio && `Precio: ${race.precio}`,
    race.url && `Inscripción: ${race.url}`,
    `Más carreras: ${pageUrl || SITE_URL + "/calendario"}`,
  ].filter(Boolean).join("\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hybrid Race Hub//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:race-${race.id || start}-${start}@hybridracehub.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${esc(race.nombre)}`,
    place && `LOCATION:${esc(place)}`,
    `DESCRIPTION:${esc(desc)}`,
    race.url && `URL:${race.url}`,
    "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", `DESCRIPTION:${esc(race.nombre)} en una semana`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export function downloadIcs(race, pageUrl) {
  const blob = new Blob([buildIcs(race, pageUrl)], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(race.nombre || "carrera").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  track("ics_download", { race_name: race.nombre, race_date: race.fecha_iso });
}

export function whatsappUrl(race, pageUrl) {
  const place = race.ubicacion || race.municipio || race.provincia || "";
  const fecha = race.fecha || race.fecha_iso;
  const text = `${race.nombre} · ${fecha}${place ? ` · ${place}` : ""}\n¿Te apuntas? Lo he visto aquí: ${pageUrl || SITE_URL + "/calendario"}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function onWhatsappShare(race) {
  track("whatsapp_share", { race_name: race.nombre, race_date: race.fecha_iso });
}
