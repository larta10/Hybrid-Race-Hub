/**
 * Modalidades de carrera híbrida: cómo se reconoce cada una en la tabla races, su guía,
 * su hub de fechas y el ranking de material que le corresponde.
 * Los textos salen de las guías ya verificadas del sitio (que-es-una-carrera-hibrida, blog).
 *
 * hub: página con las fechas de la modalidad. HYROX no tiene /calendario/hyrox: su hub es el
 * artículo del calendario HYROX. El resto solo se publica si hay MIN_HUB_RACES carreras futuras.
 */
export const MIN_HUB_RACES = 3;

const txt = r => `${r.nombre || ""} ${r.modalidad || ""}`;

export const MODALITIES = [
  {
    slug: "hyrox", name: "HYROX",
    test: r => /\bhyrox\b/i.test(r.nombre || "") || (/^hyrox$/i.test(r.modalidad || "")),
    hub: "/blog/calendario-hyrox-espana-2026-2027", hubLabel: "Calendario HYROX España 2026-2027", fixedHub: true,
    guide: { href: "/blog/que-es-hyrox", label: "Qué es HYROX" },
    ranking: { href: "/productos/zapatillas-hyrox", label: "Mejores zapatillas para HYROX" },
    about: "HYROX son 8 km de carrera en tramos de 1 km y, tras cada uno, una estación de fuerza: SkiErg, sled push, sled pull, burpee broad jumps, remo, farmers carry, sandbag lunges y wall balls. Se corre en pabellón, con el mismo recorrido y los mismos pesos en todas las sedes.",
  },
  {
    slug: "deka", name: "DEKA",
    test: r => /\bdeka\b/i.test(txt(r)),
    hub: "/calendario/deka", hubLabel: "Calendario DEKA",
    guide: { href: "/que-es-una-carrera-hibrida#tipos", label: "Qué es DEKA" },
    ranking: { href: "/productos/zapatillas-hyrox", label: "Zapatillas para HYROX y DEKA" },
    about: "DEKA es el formato de carrera híbrida de la organización Spartan: 10 zonas de trabajo funcional. En DEKA FIT se corren 500 metros entre zona y zona; DEKA MILE es más corto e intenso y DEKA STRONG elimina la carrera.",
  },
  {
    slug: "spartan", name: "Spartan Race",
    test: r => r.modalidad_id === "ocr-spartan" || /spartan/i.test(r.nombre || ""),
    hub: "/calendario/spartan", hubLabel: "Calendario Spartan Race",
    guide: { href: "/blog/primera-carrera-obstaculos-guia", label: "Cómo preparar tu primera carrera de obstáculos" },
    ranking: { href: "/productos/zapatillas-trail", label: "Zapatillas de trail para OCR" },
    about: "Spartan Race es la marca de carreras de obstáculos más extendida. Tiene tres distancias principales: Sprint (unos 5 km), Super (unos 10 km) y Beast (unos 21 km). Si fallas un obstáculo, la penalización habitual son 30 burpees.",
  },
  {
    slug: "ocr", name: "OCR",
    test: r => r.modalidad_parent === "ocr",
    hub: "/calendario/ocr", hubLabel: "Calendario de carreras de obstáculos",
    guide: { href: "/blog/primera-carrera-obstaculos-guia", label: "Cómo preparar tu primera carrera de obstáculos" },
    ranking: { href: "/productos/zapatillas-trail", label: "Zapatillas de trail para OCR" },
    about: "Una OCR (Obstacle Course Racing) es una carrera al aire libre, normalmente con desnivel, barro y agua, en la que hay que superar muros, cuerdas, arrastres, cargas y pasos de equilibrio. Cada recorrido es distinto: importa más adaptarse al terreno que el ritmo por kilómetro.",
  },
  {
    slug: "hurbax", name: "HURBAX",
    test: r => r.modalidad_id === "func-hurbax" || /hurbax/i.test(txt(r)),
    hub: "/calendario/hurbax", hubLabel: "Calendario HURBAX",
    guide: { href: "/blog/que-es-hurbax", label: "Qué es HURBAX" },
    ranking: { href: "/productos/zapatillas-hyrox", label: "Zapatillas para pruebas híbridas" },
    about: "HURBAX es un circuito español al aire libre: 1 km de carrera y una estación, cinco veces, en individual, parejas o equipos de cuatro, con ranking nacional por puntos y una final.",
  },
  {
    slug: "hyatlon", name: "Hyatlón",
    test: r => r.modalidad_id === "func-hyatlon" || /hyatl[oó]n/i.test(txt(r)),
    hub: "/calendario/hyatlon", hubLabel: "Calendario Hyatlón",
    guide: { href: "/blog/que-es-el-hyatlon", label: "Qué es el Hyatlón" },
    ranking: { href: "/productos/zapatillas-hyrox", label: "Zapatillas para pruebas híbridas" },
    about: "El Hyatlón es la carrera híbrida de la Federación Española de Triatlón: tramos de 1 km de carrera alternados con estaciones en recinto cerrado, en formato H6 (6 estaciones) o H8 (8 estaciones).",
  },
  {
    slug: "hybrid-day", name: "Hybrid Day",
    test: r => /hybrid day/i.test(txt(r)),
    hub: "/calendario/hybrid-day", hubLabel: "Calendario Hybrid Day",
    guide: { href: "/que-es-una-carrera-hibrida#tipos", label: "Qué es Hybrid Day" },
    ranking: { href: "/productos/zapatillas-hyrox", label: "Zapatillas para pruebas híbridas" },
    about: "Hybrid Day es un circuito de competiciones híbridas con el esquema de 8 tramos de 1 km de carrera y 8 estaciones, en individual, parejas y relevos, en recintos feriales de Portugal y España.",
  },
];

export const MODALITY_BY_SLUG = Object.fromEntries(MODALITIES.map(m => [m.slug, m]));

// Para competiciones de box o fitness funcional que no encajan en ninguna marca
const GENERIC = {
  slug: null, name: "Carrera híbrida", hub: "/calendario", hubLabel: "Calendario de carreras híbridas",
  guide: { href: "/que-es-una-carrera-hibrida", label: "Qué es una carrera híbrida" },
  ranking: { href: "/productos/zapatillas-crossfit", label: "Zapatillas de entrenamiento funcional" },
  about: "Es una competición de fitness funcional: mezcla carrera, fuerza y ejercicios gimnásticos con un formato propio del organizador. Revisa en su web el reglamento, las categorías y los pesos antes de inscribirte.",
};

/** Modalidad más específica de una carrera (HYROX, DEKA, Spartan… antes que OCR genérica). */
export function modalityOf(r) {
  return MODALITIES.find(m => m.test(r)) || GENERIC;
}

/** Modalidades con hub publicable: HYROX siempre (artículo fijo); el resto con ≥ MIN_HUB_RACES carreras futuras. */
export function hubModalities(upcoming) {
  return MODALITIES.map(m => ({ ...m, count: upcoming.filter(r => m.test(r)).length }))
    .filter(m => m.fixedHub || m.count >= MIN_HUB_RACES);
}
