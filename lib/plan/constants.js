/**
 * Datos fijos del generador de planes. Módulo puro: sin React, sin red y sin fechas del sistema.
 * Las dosis de carrera salen del reglamento público de cada formato (HYROX Open individual y DEKA FIT);
 * los pesos no se repiten aquí porque cambian por categoría: están en /blog/que-es-hyrox.
 */
export const PRUEBAS = [
  { id: "hyrox", label: "HYROX individual", sub: "8 km en tramos de 1 km y 8 estaciones", family: "hyrox", short: "HYROX" },
  { id: "hyrox_dobles", label: "HYROX dobles", sub: "Corréis los dos; las estaciones se reparten", family: "hyrox", short: "HYROX dobles" },
  { id: "hyrox_relevos", label: "HYROX relevos", sub: "Equipo de 4: dos tramos cada uno", family: "hyrox", short: "HYROX relevos" },
  { id: "ocr_sprint", label: "OCR sprint", sub: "Unos 5 km con obstáculos", family: "ocr", short: "OCR sprint" },
  { id: "ocr_media", label: "OCR 10-12 km", sub: "Distancia media con desnivel", family: "ocr", short: "OCR de 10-12 km" },
  { id: "ocr_larga", label: "OCR 20 km o más", sub: "Larga distancia: manda el fondo", family: "ocr", short: "OCR de 20 km" },
  { id: "deka", label: "DEKA", sub: "10 zonas con carrera entre ellas", family: "deka", short: "DEKA" },
  { id: "hibrida", label: "Otra híbrida", sub: "Carrera y estaciones: HURBAX, Hyatlón…", family: "hibrida", short: "carrera híbrida" },
];
export const PRUEBA_BY_ID = Object.fromEntries(PRUEBAS.map(p => [p.id, p]));

export const NIVELES = [
  { id: "principiante", label: "Empiezo", sub: "Menos de 6 meses entrenando con regularidad" },
  { id: "intermedio", label: "Entreno con regularidad", sub: "Más de 6 meses; corro y hago fuerza" },
  { id: "avanzado", label: "Ya he competido", sub: "Más de 2 años y quiero bajar tiempo" },
];
export const NIVEL_LABEL = { principiante: "principiante", intermedio: "intermedio", avanzado: "avanzado" };

export const MATERIALES = [
  { id: "completo", label: "Gimnasio completo", sub: "Con trineo, remo y SkiErg" },
  { id: "basico", label: "Gimnasio básico", sub: "Pesas, poleas y cinta; sin trineo ni SkiErg" },
  { id: "casa", label: "En casa o en el parque", sub: "Una mancuerna o kettlebell, banda y mochila" },
];
export const MATERIAL_LABEL = { completo: "gimnasio completo", basico: "gimnasio básico", casa: "en casa" };

export const DIAS = [3, 4, 5, 6];
export const MINUTOS = [45, 60, 75, 90];

/** Estaciones en orden de carrera. race = dosis de carrera; unit: m | rep | cal */
export const STATIONS = {
  hyrox: [
    { id: "ski", name: "SkiErg", race: 1000, unit: "m" },
    { id: "sled_push", name: "Empuje de trineo", race: 50, unit: "m" },
    { id: "sled_pull", name: "Arrastre de trineo", race: 50, unit: "m" },
    { id: "bbj", name: "Burpee broad jumps", race: 80, unit: "m" },
    { id: "remo", name: "Remo", race: 1000, unit: "m" },
    { id: "farmers", name: "Farmers carry", race: 200, unit: "m" },
    { id: "lunges", name: "Zancadas con saco", race: 100, unit: "m" },
    { id: "wallballs", name: "Wall balls", race: 100, unit: "rep" },
  ],
  // DEKA FIT: 10 zonas con 500 m de carrera antes de cada una
  deka: [
    { id: "ram_lunges", name: "Zancadas atrás con RAM", race: 30, unit: "rep" },
    { id: "remo", name: "Remo", race: 500, unit: "m" },
    { id: "box", name: "Saltos o pasos sobre el cajón", race: 20, unit: "rep" },
    { id: "situp", name: "Sit-up lanzando balón", race: 25, unit: "rep" },
    { id: "ski", name: "SkiErg", race: 500, unit: "m" },
    { id: "farmers", name: "Farmers carry", race: 100, unit: "m" },
    { id: "bike", name: "Air bike", race: 25, unit: "cal" },
    { id: "wallover", name: "Balón por encima del muro", race: 20, unit: "rep" },
    { id: "tank", name: "Empuje y arrastre del tank", race: 100, unit: "m" },
    { id: "ram_burpees", name: "Burpees con RAM", race: 20, unit: "rep" },
  ],
};
STATIONS.hibrida = STATIONS.hyrox;

/** Habilidades de una carrera de obstáculos (no llevan dosis fija: cada recorrido es distinto). */
export const OCR_SKILLS = [
  { id: "agarre", name: "Suspensión y agarre" },
  { id: "trepa", name: "Trepa de cuerda y muros" },
  { id: "cargas", name: "Transporte de cargas" },
  { id: "burpees", name: "Burpees de penalización" },
  { id: "cuestas", name: "Cuestas y desnivel" },
];

export const familyOf = pruebaId => PRUEBA_BY_ID[pruebaId]?.family || "hyrox";

/** Opciones de "estaciones débiles" según la prueba (siempre con la carrera al final). */
export function weakOptions(pruebaId) {
  const fam = familyOf(pruebaId);
  const list = fam === "ocr" ? OCR_SKILLS : STATIONS[fam];
  return [...list.map(s => ({ id: s.id, label: s.name })), { id: "carrera", label: "La carrera" }];
}

export const PHASE_LABEL = { base: "Base", construccion: "Construcción", especifico: "Específico", taper: "Taper" };
export const PHASE_DESC = {
  base: "Kilómetros fáciles, técnica de estaciones y fuerza con repeticiones altas.",
  construccion: "Sube la intensidad: ritmo de umbral, más carga en fuerza y correr justo después de cada estación.",
  especifico: "Sesiones que se parecen a la carrera: series al ritmo objetivo y simulaciones parciales.",
  taper: "Menos volumen y la misma chispa para llegar descansado.",
};
