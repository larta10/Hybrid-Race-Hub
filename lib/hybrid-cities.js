/**
 * Ciudades y comunidades con página propia en /carreras-hibridas/[ciudad].
 * Las carreras y los centros NO están aquí: salen de Supabase (races) y de
 * lib/centros-entrenamiento.json. Aquí solo hay contexto editorial y reglas de cruce.
 *
 * match.provincias  -> campo races.provincia
 * match.comunidades -> campo races.comunidad (para páginas de comunidad o
 *                      comunidades uniprovinciales)
 * match.nombres     -> fallback sobre races.ubicacion / municipio si no hay provincia
 * cp                -> prefijos de código postal para cruzar centros de entrenamiento
 */
export const HYBRID_CITIES = [
  {
    slug: "madrid", name: "Madrid", kind: "ciudad", ccaa: "Comunidad de Madrid", priority: 1,
    match: { provincias: ["Madrid"], comunidades: ["Madrid", "Comunidad de Madrid"], nombres: ["Madrid"] },
    cp: ["28"], nearby: ["valladolid", "zaragoza", "valencia"],
    intro: [
      "Madrid concentra algunos de los eventos de fitness funcional más importantes de España. La capital alberga regularmente ediciones de HYROX, campeonatos de CrossFit y carreras OCR tanto en instalaciones cubiertas como en los espacios naturales que rodean la ciudad. La Sierra de Guadarrama es el escenario natural por excelencia para las pruebas de trail y OCR en la región.",
      "Madrid cuenta con la mayor concentración de boxes y gimnasios de fitness funcional de España. Encontrarás centros afiliados a HYROX en todos los barrios, así como múltiples opciones para entrenamiento específico de OCR. Para el trail, la Sierra de Guadarrama, el Hayedo de Montejo y los parques del norte ofrecen terreno variado para todos los niveles.",
      "Si vives en Madrid, el calendario tiene una ventaja clara: casi todo el país está a menos de cuatro horas en tren. Muchos atletas madrileños combinan una prueba en casa con viajes a Valencia, Zaragoza o Valladolid; abajo tienes esas ciudades enlazadas.",
    ],
  },
  {
    slug: "barcelona", name: "Barcelona", kind: "ciudad", ccaa: "Cataluña", priority: 2,
    match: { provincias: ["Barcelona"], nombres: ["Barcelona", "Hospitalet"] },
    cp: ["08"], nearby: ["cataluna", "zaragoza", "valencia"],
    intro: [
      "Barcelona es uno de los centros de referencia para el deporte funcional y las carreras híbridas en España. La ciudad y su región cuentan con una amplia oferta de eventos OCR y HYROX, así como infraestructuras de entrenamiento de primer nivel. El Parque Natural del Montnegre o el Garraf son escenarios habituales para pruebas de trail y OCR.",
      "El ecosistema deportivo de Barcelona y Cataluña incluye numerosos boxes de CrossFit, gimnasios funcionales y centros afiliados a HYROX distribuidos por toda la ciudad. Para el entrenamiento de trail y OCR, las montañas de Collserola, el Montserrat y el Garraf ofrecen rutas de dificultad variable perfectas para preparar cualquier nivel.",
    ],
  },
  {
    slug: "valencia", name: "Valencia", kind: "ciudad", ccaa: "Comunidad Valenciana", priority: 3,
    match: { provincias: ["Valencia", "València"], nombres: ["Valencia", "València"] },
    cp: ["46"], nearby: ["comunidad-valenciana", "murcia", "barcelona"],
    intro: [
      "Valencia y la Comunidad Valenciana tienen una escena creciente de fitness funcional y carreras híbridas. La ciudad alberga eventos HYROX en sus instalaciones deportivas y las sierras del interior (Mariola, Aitana, Calderona) acogen regularmente pruebas de OCR y trail running con obstáculos. El clima mediterráneo favorece la práctica deportiva durante casi todo el año.",
      "La red de boxes de CrossFit y centros de fitness funcional en Valencia ha crecido significativamente en los últimos años. Para el entrenamiento específico de OCR, los parques naturales del entorno valenciano ofrecen terreno variado: desde la playa hasta el monte. Muchos clubs de trail running locales organizan entrenamientos específicos para carreras de obstáculos.",
    ],
  },
  {
    slug: "sevilla", name: "Sevilla", kind: "ciudad", ccaa: "Andalucía", priority: 4,
    match: { provincias: ["Sevilla"], nombres: ["Sevilla"] },
    cp: ["41"], nearby: ["malaga", "andalucia", "madrid"],
    intro: [
      "Sevilla tiene una escena deportiva de fitness funcional y carreras híbridas en expansión. La capital andaluza acoge eventos de HYROX y CrossFit en sus instalaciones deportivas, mientras que los parques naturales cercanos (Sierra Norte de Sevilla, Doñana) sirven de escenario para pruebas de OCR y trail. El Parque María Luisa y las riberas del Guadalquivir son puntos habituales de entrenamiento.",
      "El tejido de boxes y centros de fitness funcional en Sevilla ha crecido notablemente. Para el entrenamiento de trail y OCR, la Sierra Norte sevillana ofrece rutas de exigencia variable. Las temperaturas extremas del verano hacen que los entrenamientos se concentren en mañanas muy tempranas o en instalaciones climatizadas durante los meses de julio y agosto.",
    ],
  },
  {
    slug: "bilbao", name: "Bilbao", kind: "ciudad", ccaa: "País Vasco", priority: 5,
    match: { provincias: ["Bizkaia", "Vizcaya"], nombres: ["Bilbao", "Bizkaia", "Vizcaya"] },
    cp: ["48"], nearby: ["asturias", "zaragoza", "valladolid"],
    intro: [
      "Bilbao y el País Vasco son uno de los destinos más activos del calendario de carreras híbridas en el norte de España. Desde pruebas OCR en los montes vascos hasta competiciones HYROX en instalaciones cubiertas de Bilbao, la región ofrece una variada oferta para atletas de todos los niveles.",
      "El País Vasco cuenta con una sólida infraestructura de boxes de CrossFit y centros de fitness funcional en el área metropolitana de Bilbao. Los parques y montes de los alrededores (Pagasarri, Gorbea) ofrecen terreno ideal para preparar las partes de trail de las carreras OCR. Para entrenamiento específico de HYROX en Bilbao, busca cajas y gimnasios afiliados a HYROX que ofrecen clases grupales con el equipamiento oficial.",
    ],
  },
  {
    slug: "malaga", name: "Málaga", kind: "ciudad", ccaa: "Andalucía", priority: 6,
    match: { provincias: ["Málaga", "Malaga"], nombres: ["Málaga", "Malaga"] },
    cp: ["29"], nearby: ["sevilla", "andalucia", "murcia"],
    intro: [
      "Málaga y el litoral malagueño son cada vez más protagonistas en el calendario de carreras híbridas andaluzas. La provincia combina perfectamente las pruebas en recintos urbanos con las carreras en la Sierra de las Nieves o el Parque Natural Montes de Málaga. El clima benigno permite competir prácticamente cualquier mes del año.",
      "Málaga cuenta con una comunidad fitness funcional activa con boxes de CrossFit y centros de entrenamiento funcional bien equipados. La sierra ofrece entornos ideales para el entrenamiento de trail y los componentes de fuerza funcional propios del OCR. Muchos centros locales organizan salidas de preparación específica para pruebas híbridas.",
    ],
  },
  {
    slug: "zaragoza", name: "Zaragoza", kind: "ciudad", ccaa: "Aragón", priority: 7,
    match: { provincias: ["Zaragoza"], nombres: ["Zaragoza"] },
    cp: ["50"], nearby: ["barcelona", "bilbao", "madrid"],
    intro: [
      "Zaragoza y Aragón se han consolidado como un punto de referencia para las carreras híbridas en el nordeste español. La ciudad acoge eventos de fitness funcional en sus modernos polideportivos y los Pirineos aragoneses son uno de los escenarios más espectaculares del OCR en España, con pruebas que combinan trail técnico con obstáculos de alta exigencia.",
      "Zaragoza cuenta con una comunidad crossfitter activa con boxes bien equipados en toda la ciudad. Para el entrenamiento específico de OCR y trail, la proximidad de los Pirineos es una ventaja enorme: desde las montañas del Moncayo hasta el Pirineo oscense, los atletas aragoneses tienen acceso a algunos de los mejores terrenos de entrenamiento de España.",
    ],
  },
  {
    slug: "valladolid", name: "Valladolid", kind: "ciudad", ccaa: "Castilla y León", priority: 8,
    match: { provincias: ["Valladolid"], nombres: ["Valladolid"] },
    cp: ["47"], nearby: ["madrid", "asturias", "bilbao"],
    intro: [
      "Valladolid está a una hora de Madrid en AVE, y eso marca cómo compite la gente de aquí: muchos atletas pucelanos preparan la temporada en casa y viajan a las pruebas grandes de Madrid, el norte o la costa. Por eso en esta página verás también las ciudades cercanas.",
      "Para entrenar, la ciudad es llana y fría en invierno: buen sitio para construir base aeróbica en las riberas del Pisuerga y para pasar muchas horas de box. Los pinares de los alrededores, con suelo de arena suelta, son un terreno muy útil para trabajar la fuerza de piernas que pide una OCR o las sandbag lunges de una HYROX.",
    ],
  },
  {
    slug: "asturias", name: "Asturias", kind: "comunidad", ccaa: "Principado de Asturias", priority: 9,
    match: { comunidades: ["Asturias", "Principado de Asturias"], provincias: ["Asturias"], nombres: ["Asturias", "Gijón", "Oviedo", "Avilés"] },
    cp: ["33"], nearby: ["bilbao", "valladolid", "madrid"],
    intro: [
      "Gijón y Oviedo concentran la mayor parte de los boxes y gimnasios funcionales de Asturias, y es ahí donde se mueve la comunidad híbrida de la región. Fuera del área central, la orografía manda: mucho desnivel, lluvia frecuente y barro buena parte del año.",
      "Ese terreno es justo el que pide una carrera de obstáculos. Si entrenas en Asturias, tienes a mano subidas largas, senderos técnicos y suelo blando para acostumbrar tobillos y agarre. Para las pruebas en recinto cubierto, como HYROX, lo habitual es desplazarse a Bilbao, Madrid u otras sedes; abajo las tienes enlazadas.",
    ],
  },
  {
    slug: "murcia", name: "Murcia", kind: "comunidad", ccaa: "Región de Murcia", priority: 10,
    match: { comunidades: ["Murcia", "Región de Murcia"], provincias: ["Murcia"], nombres: ["Murcia", "Cartagena", "Lorca"] },
    cp: ["30"], nearby: ["valencia", "comunidad-valenciana", "andalucia"],
    intro: [
      "Murcia tiene una comunidad de deporte funcional y OCR en crecimiento. La región murciana combina instalaciones deportivas modernas para eventos HYROX y CrossFit con el entorno natural de la Sierra Espuña y el Noroeste murciano para pruebas de OCR. El clima seco y soleado favorece la práctica deportiva al aire libre durante la mayor parte del año.",
      "En Murcia encontrarás boxes de CrossFit y centros de fitness funcional distribuidos por toda la ciudad y su área metropolitana. Para el entrenamiento al aire libre, la Sierra Espuña ofrece rutas técnicas con buen desnivel, perfectas para preparar los componentes de trail de las carreras OCR. La costa del Mar Menor también se utiliza para entrenamientos de resistencia.",
    ],
  },
  {
    slug: "andalucia", name: "Andalucía", kind: "comunidad", ccaa: "Andalucía", priority: 11,
    match: { comunidades: ["Andalucía", "Andalucia"] },
    cp: ["04", "11", "14", "18", "21", "23", "29", "41"], nearby: ["sevilla", "malaga", "murcia"],
    intro: [
      "Andalucía es la comunidad con más kilómetros de calendario: ocho provincias, sierras en casi todas y un invierno suave que permite competir al aire libre cuando en el norte no se puede. Las pruebas se reparten entre la costa, las capitales y pueblos de sierra que montan su propia carrera de obstáculos.",
      "El calor es el factor que hay que planificar. De junio a septiembre casi todo se mueve a primera hora o a recinto cubierto, y la temporada fuerte de OCR suele ir de otoño a primavera. Si buscas algo concreto, entra en las páginas de Sevilla y Málaga, que tienen sus propias listas.",
    ],
  },
  {
    slug: "cataluna", name: "Cataluña", kind: "comunidad", ccaa: "Cataluña", priority: 12,
    match: { comunidades: ["Cataluña", "Catalunya", "Cataluna"] },
    cp: ["08", "17", "25", "43"], nearby: ["barcelona", "zaragoza", "baleares"],
    intro: [
      "Cataluña junta dos mundos: las pruebas en recinto del área de Barcelona, con HYROX como cabeza de cartel, y las carreras de obstáculos de montaña en Girona, Lleida y el interior. Con buena red de tren, es fácil enlazar varias pruebas en una temporada sin coger el coche.",
      "Para entrenar hay de todo: boxes en cualquier ciudad mediana y montaña a una hora de casa, del Montseny al Pirineo. Si vas a una OCR de montaña en Girona o Lleida, entrena bajadas técnicas; es donde más tiempo se pierde y donde más se tuercen tobillos.",
    ],
  },
  {
    slug: "comunidad-valenciana", name: "Comunidad Valenciana", kind: "comunidad", ccaa: "Comunidad Valenciana", priority: 13,
    match: { comunidades: ["Comunidad Valenciana", "Valenciana"] },
    cp: ["03", "12", "46"], nearby: ["valencia", "murcia", "baleares"],
    intro: [
      "La Comunidad Valenciana tiene pruebas en sus tres provincias: recintos feriales y pabellones en las capitales y carreras de obstáculos en la costa y en el interior de Alicante y Castellón. El clima permite competir casi todo el año y eso se nota en un calendario repartido por meses.",
      "Si entrenas aquí, aprovecha la mezcla de playa y sierra: arena para fuerza de piernas, montaña para desnivel. La página de Valencia ciudad tiene su propio listado y centros; aquí verás todo lo de la comunidad junto.",
    ],
  },
  {
    slug: "canarias", name: "Canarias", kind: "comunidad", ccaa: "Canarias", priority: 14,
    match: { comunidades: ["Canarias"] },
    cp: ["35", "38"], nearby: ["andalucia", "sevilla", "madrid"],
    intro: [
      "Canarias compite con ventaja climática: temperaturas suaves todo el año y desniveles fuertes en casi todas las islas. Las pruebas se reparten sobre todo entre Tenerife y Gran Canaria, y suelen mezclar trail volcánico con obstáculos.",
      "El salto entre islas o a la península encarece viajar a pruebas fuera, así que conviene tener muy controlado el calendario local. Para entrenar, el terreno de lava y picón castiga más los pies que la tierra; elige zapatilla con buena suela y protección, tienes el ranking de zapatillas de trail enlazado abajo.",
    ],
  },
  {
    slug: "baleares", name: "Baleares", kind: "comunidad", ccaa: "Illes Balears", priority: 15,
    match: { comunidades: ["Baleares", "Illes Balears", "Islas Baleares"] },
    cp: ["07"], nearby: ["barcelona", "valencia", "cataluna"],
    intro: [
      "En Baleares casi todo pasa en Mallorca: Palma tiene recinto ferial para pruebas tipo HYROX y la isla tiene montaña de sobra para carreras de obstáculos. Menorca e Ibiza tienen menos calendario, pero buena comunidad de box.",
      "La Serra de Tramuntana es un terreno de entrenamiento excelente para OCR: piedra, desnivel y senderos técnicos. Para las pruebas en península, Barcelona y Valencia son los saltos más cómodos en barco o avión.",
    ],
  },
];

export const CITY_BY_SLUG = Object.fromEntries(HYBRID_CITIES.map(c => [c.slug, c]));

const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** ¿Pertenece esta carrera a la ciudad/comunidad? */
export function raceMatchesCity(r, city) {
  const m = city.match || {};
  if (r.provincia && (m.provincias || []).some(p => norm(p) === norm(r.provincia))) return true;
  if (r.comunidad && (m.comunidades || []).some(c => norm(c) === norm(r.comunidad))) return true;
  if (!r.provincia) {
    const txt = norm(`${r.municipio || ""} ${r.ubicacion || ""}`);
    if ((m.nombres || []).some(n => txt.includes(norm(n)))) return true;
  }
  return false;
}

/** ¿Pertenece este centro a la ciudad/comunidad? (por prefijo de código postal o nombre de ciudad) */
export function centerMatchesCity(c, city) {
  const cp = String(c.codigo_postal || "").padStart(5, "0");
  if (c.codigo_postal && city.cp.some(p => cp.startsWith(p))) return true;
  if (!c.codigo_postal) return (city.match.nombres || []).some(n => norm(c.ciudad) === norm(n));
  return false;
}
