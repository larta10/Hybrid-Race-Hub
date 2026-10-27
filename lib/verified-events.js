/**
 * Eventos que todavía no están en la tabla races de Supabase pero se han
 * comprobado a mano en la web oficial del organizador. Cada uno lleva la URL
 * de la fuente y la fecha de la comprobación. Se ocultan solos cuando pasa la fecha.
 *
 * Cuando el evento se dé de alta en Supabase, bórralo de aquí para no duplicarlo.
 */
export const VERIFIED_EVENTS = [
  {
    id: "verified-hybrid-day-vigo-2026",
    nombre: "Hybrid Day Vigo 2026",
    modalidad: "Hybrid Day",
    modalidad_id: "func-fitness",
    modalidad_parent: "funcional",
    fecha_iso: "2026-12-12",
    fecha_fin_iso: "2026-12-13",
    ubicacion: "IFEVI – Instituto Ferial de Vigo",
    municipio: "Vigo",
    provincia: "Pontevedra",
    comunidad: "Galicia",
    formato: "Individual, parejas y relevos",
    distancia: "8 km + 8 estaciones",
    precio: null,
    url: "https://hybrid-day.com/hybrid-day-vigo-2026/",
    fuente: "hybrid-day.com",
    verificado: "2026-10-27",
  },
];

export function upcomingVerifiedEvents(todayIso) {
  return VERIFIED_EVENTS.filter(e => (e.fecha_fin_iso || e.fecha_iso) >= todayIso);
}
