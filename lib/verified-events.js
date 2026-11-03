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
    estado: "Abierta",
    url: "https://hybrid-day.com/hybrid-day-vigo-2026/",
    fuente: "hybrid-day.com",
    verificado: "2026-10-27",
  },
  {
    id: "verified-hyatlon-h6-gran-canaria-2026",
    nombre: "Hyatlón H6 Gran Canaria 2026",
    modalidad: "Hyatlón",
    modalidad_id: "func-hyatlon",
    modalidad_parent: "funcional",
    fecha_iso: "2026-11-14",
    fecha_fin_iso: "2026-11-15",
    ubicacion: "Plaza de la Música - ExpoDeca",
    municipio: "Las Palmas de Gran Canaria",
    provincia: "Las Palmas",
    comunidad: "Canarias",
    formato: "Individual (sábado), dobles y relevos (domingo)",
    distancia: "H6: 6 tramos de 1 km + 6 estaciones",
    precio: "Desde 79€",
    estado: "Abierta",
    url: "https://hyatlon.org/event/gran-canaria",
    fuente: "hyatlon.org",
    verificado: "2026-11-03",
  },
  {
    id: "verified-hyatlon-h8-zaragoza-2026",
    nombre: "Hyatlón H8 Zaragoza 2026",
    modalidad: "Hyatlón",
    modalidad_id: "func-hyatlon",
    modalidad_parent: "funcional",
    fecha_iso: "2026-11-28",
    fecha_fin_iso: "2026-11-29",
    ubicacion: "Pabellón 4, Feria de Zaragoza",
    municipio: "Zaragoza",
    provincia: "Zaragoza",
    comunidad: "Aragón",
    formato: "Individual (sábado), dobles y relevos (domingo)",
    distancia: "H8: 8 tramos de 1 km + 8 estaciones",
    precio: "Desde 89€",
    estado: "Abierta",
    url: "https://hyatlon.org/event/zaragoza",
    fuente: "hyatlon.org",
    verificado: "2026-11-03",
  },
  // Las tres siguientes, verificadas el 27-10-2026 (docs/datos/verificacion-carreras-2026-10.md)
  {
    id: "verified-hybrid-games-valencia-2027",
    nombre: "The Hybrid Games Valencia 2027",
    modalidad: "Functional Fitness", modalidad_id: "func-fitness", modalidad_parent: "funcional",
    fecha_iso: "2027-05-22", fecha_fin_iso: "2027-05-23",
    ubicacion: "Tinglados, La Marina de Valencia", municipio: "Valencia", provincia: "Valencia", comunidad: "Comunidad Valenciana",
    formato: "Singles, Doubles y Team Relay", distancia: null, precio: "Desde 85€", estado: "Abierta",
    notas: "IV edición. 22 y 23 de mayo. Singles 85 €, Doubles 160 €, Team Relay 230 €.",
    url: "https://thehybridgames.fit/", fuente: "thehybridgames.fit", verificado: "2026-10-27",
  },
  {
    id: "verified-survivor-madrid-2027",
    nombre: "Survivor Race Madrid 2027",
    modalidad: "OCR", modalidad_id: "ocr-general", modalidad_parent: "ocr",
    fecha_iso: "2027-06-05", fecha_fin_iso: "2027-06-06",
    ubicacion: "Colmenar Viejo", municipio: "Colmenar Viejo", provincia: "Madrid", comunidad: "Madrid",
    formato: "Individual", distancia: "3, 6 y 10 km", precio: "Desde 51€", estado: "Abierta",
    notas: "5 y 6 de junio. De 15 a 25 obstáculos según la distancia. Descuento del 10 % para grupos.",
    url: "https://survivor-race.com/carreras/survivor-madrid/", fuente: "survivor-race.com", verificado: "2026-10-27",
  },
  {
    id: "verified-survivor-barcelona-2027",
    nombre: "Survivor Race Barcelona 2027",
    modalidad: "OCR", modalidad_id: "ocr-general", modalidad_parent: "ocr",
    fecha_iso: "2027-06-19", fecha_fin_iso: "2027-06-20",
    ubicacion: "Castellar del Vallès", municipio: "Castellar del Vallès", provincia: "Barcelona", comunidad: "Cataluña",
    formato: "Individual", distancia: "3, 6 y 10 km", precio: "Desde 51€", estado: "Abierta",
    notas: "19 y 20 de junio. De 15 a 25 obstáculos según la distancia. Descuento del 10 % para grupos.",
    url: "https://survivor-race.com/carreras/survivor-barcelona/", fuente: "survivor-race.com", verificado: "2026-10-27",
  },
];

/**
 * Eventos verificados que aún no están en Supabase. Si ya existe una carrera con la misma
 * fecha y municipio (o el mismo nombre) en `supabaseRaces`, no se devuelve: así no se duplica
 * cuando se aplique docs/datos/cambios-races-2026-10-27.sql.
 */
export function upcomingVerifiedEvents(todayIso, supabaseRaces = []) {
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  return VERIFIED_EVENTS.filter(e => (e.fecha_fin_iso || e.fecha_iso) >= todayIso)
    .filter(e => !supabaseRaces.some(r =>
      norm(r.nombre) === norm(e.nombre) ||
      (r.fecha_iso === e.fecha_iso && norm(r.municipio) === norm(e.municipio))));
}
