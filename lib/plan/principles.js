/**
 * "Por qué está hecho así": los principios del plan con su referencia.
 * Todas las referencias se comprobaron el 11-11-2026 (PubMed, Frontiers y JSTOR). No añadas ninguna sin comprobarla.
 */
export const PRINCIPLES = [
  {
    id: "especificidad",
    title: "La carrera manda",
    text: "En una simulación de HYROX con deportistas aficionados, correr ocupó 51 de los 86 minutos y quienes terminaron antes eran los que tenían más capacidad aeróbica y más volumen de entrenamiento de resistencia. Los autores la describen como una prueba sobre todo de resistencia, con una exigencia de fuerza máxima entre moderada y baja. Por eso aquí hay más días de carrera que de pesas y las estaciones se entrenan pegadas a un kilómetro. El estudio es pequeño (11 personas), así que tómalo como pista y no como ley.",
    ref: { authors: "Brandt T, Ebel C, Lebahn C, Schmidt A.", year: 2025, title: "Acute physiological responses and performance determinants in Hyrox – a new running-focused high intensity functional fitness trend", journal: "Frontiers in Physiology, 16:1519240", url: "https://doi.org/10.3389/fphys.2025.1519240" },
  },
  {
    id: "intensidad",
    title: "Casi todo fácil, poco muy duro",
    text: "Los deportistas de resistencia que mejor rinden hacen alrededor del 80 % de sus sesiones a baja intensidad y reservan lo duro para uno o dos días. En el plan eso se traduce en rodajes a ritmo de conversación y una sola sesión de calidad de carrera por semana. Ir a medio gas todos los días cansa mucho y mejora poco.",
    ref: { authors: "Seiler S.", year: 2010, title: "What is best practice for training intensity and duration distribution in endurance athletes?", journal: "International Journal of Sports Physiology and Performance, 5(3):276-291", url: "https://pubmed.ncbi.nlm.nih.gov/20861519/" },
  },
  {
    id: "fuerza",
    title: "La fuerza hace que correr cueste menos",
    text: "En corredores de media y larga distancia, dos o tres sesiones de fuerza por semana mejoran la economía de carrera entre un 2 y un 8 % sin subir el peso corporal. Por eso la fuerza se queda todo el plan, con pocas repeticiones y margen, y sube de carga poco a poco: cada semana un poco más y, cada tres o cuatro, una de descarga.",
    ref: { authors: "Blagrove RC, Howatson G, Hayes PR.", year: 2018, title: "Effects of strength training on the physiological determinants of middle- and long-distance running performance: a systematic review", journal: "Sports Medicine, 48(5):1117-1149", url: "https://pubmed.ncbi.nlm.nih.gov/29249083/" },
  },
  {
    id: "progresion",
    title: "Subir poco a poco y parar a tiempo",
    text: "El cuerpo se adapta a lo que le pides y deja de mejorar si siempre le pides lo mismo. La recomendación clásica es aumentar la carga en pasos pequeños cuando el trabajo actual se queda corto. Aquí son un 2,5 % por semana de carga, con un tope, y los pesos se dan como orientación: el RPE decide.",
    ref: { authors: "American College of Sports Medicine.", year: 2009, title: "Progression models in resistance training for healthy adults (position stand)", journal: "Medicine & Science in Sports & Exercise, 41(3):687-708", url: "https://pubmed.ncbi.nlm.nih.gov/19204579/" },
  },
  {
    id: "taper",
    title: "Las últimas semanas se quita volumen, no intensidad",
    text: "Un metaanálisis de 27 estudios encontró que lo que mejor funciona antes de competir es bajar el volumen entre un 41 y un 60 % durante unas dos semanas, sin tocar la intensidad ni el número de sesiones. Por eso el final del plan tiene sesiones más cortas pero con ritmo de carrera, y no descanso total.",
    ref: { authors: "Bosquet L, Montpetit J, Arvisais D, Mujika I.", year: 2007, title: "Effects of tapering on performance: a meta-analysis", journal: "Medicine & Science in Sports & Exercise, 39(8):1358-1365", url: "https://pubmed.ncbi.nlm.nih.gov/17762369/" },
  },
];

/** Referencia de la fórmula con la que se calculan los ritmos. */
export const PACE_REF = { authors: "Riegel PS.", year: 1981, title: "Athletic records and human endurance", journal: "American Scientist, 69(3):285-290", url: "https://www.jstor.org/stable/27850427" };

export const refText = r => `${r.authors} (${r.year}). ${r.title}. ${r.journal}.`;

export const HEALTH_NOTICE = "Este plan es orientativo y no sustituye a un entrenador ni a un médico. Si tienes una lesión, una enfermedad, llevas mucho tiempo sin hacer deporte o notas dolor en el pecho, mareo o un dolor que no es el cansancio normal, para y consulta antes de seguir.";

export const RPE_LEGEND = "RPE es el esfuerzo que notas, de 1 a 10: 3-4 es fácil y puedes hablar; 7-8 es duro pero lo aguantas; 9-10 es casi tu límite.";
