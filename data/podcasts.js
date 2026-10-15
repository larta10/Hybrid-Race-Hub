/**
 * Podcasts de HYROX, OCR y deporte híbrido verificados el 15-10-2026:
 * - existencia, nombre exacto y autor: API pública de Apple Podcasts (itunes.apple.com/lookup)
 * - presentadores: descripción oficial del feed RSS de cada podcast
 * - episodios recomendados: título y fecha exactos del feed
 * - Spotify: página de show comprobada (título "… | Podcast on Spotify")
 * Si un podcast no tiene spotifyId es porque no se encontró su ficha en Spotify.
 */
export const PODCASTS_CHECKED = "2026-10-15";

export const PODCASTS = [
  // ── En español ──────────────────────────────────────────────────────────
  {
    id: "run-lift-repeat",
    name: "RUN, LIFT, REPEAT",
    lang: "ES",
    hosts: "Sin Meridiano Films (México)",
    level: "Todos",
    idealFor: "Quien quiere un podcast 100 % de HYROX en español",
    about: "Se presenta como el primer podcast de América Latina dedicado solo a HYROX. Mezcla análisis de carreras (Acapulco, el Mundial de Estocolmo), entrevistas con atletas y episodios técnicos sobre cómo entrenar. El acento es mexicano, pero el contenido sirve igual para quien compite en Madrid o Barcelona.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "¿Fuerza o resistencia? Cómo entrenar para HYROX. Parte 1", date: "2026-08-12", why: "Plantea el dilema que tiene todo el que empieza: cuánto peso meter y cuánto correr. Buen punto de partida antes de montar tu semana.", url: "https://podcasts.apple.com/es/podcast/fuerza-o-resistencia-c%C3%B3mo-entrenar-para-hyrox-parte-1/id1808483679?i=1000783036277" },
      { title: "El secreto en HYROX no es correr rápido, es cerrar más fuerte. Pt. 2", date: "2026-08-19", why: "La segunda parte baja al ritmo de carrera: por qué los últimos kilómetros deciden tu tiempo.", url: "https://podcasts.apple.com/es/podcast/el-secreto-en-hyrox-no-es-correr-r%C3%A1pido-es-cerrar/id1808483679?i=1000784436257" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/run-lift-repeat/id1808483679",
    spotifyId: null,
  },
  {
    id: "rendimiento-evolutivo",
    name: "Rendimiento Evolutivo",
    lang: "ES",
    hosts: "Manu Sola Arjona",
    level: "Intermedio y avanzado",
    idealFor: "Corredores y ciclistas que llegan a HYROX y quieren entender la fisiología",
    about: "Podcast de entrenamiento de resistencia con mucho fondo científico: carga, métricas, psicología y nutrición. No es un podcast de HYROX, pero tiene un episodio monográfico muy bueno y casi todo lo que cuenta sobre carga y recuperación se aplica a una carrera híbrida.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "276. Entrenamiento de Hyrox explicado por Antonio Fernández (Planeta Híbrido)", date: "2025-09-22", why: "Un entrenador de HYROX explica cómo se estructura la preparación y en qué se diferencia del CrossFit o de una Spartan.", url: "https://podcasts.apple.com/es/podcast/276-entrenamiento-de-hyrox-explicado-por-antonio/id1792840479?i=1000727833556" },
      { title: "El error de tomarse en serio las métricas de los relojes inteligentes. Ep 312", date: "2026-10-05", why: "Útil si vives pendiente del reloj: qué datos sirven para decidir y cuáles son ruido.", url: "https://podcasts.apple.com/es/podcast/el-error-de-tomarse-en-serio-las-m%C3%A9tricas-de/id1792840479?i=1000793241604" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/rendimiento-evolutivo/id1792840479",
    spotifyId: "0bjX2FQsUBe0TBswS4p7S1",
  },
  {
    id: "vida-de-elite",
    name: "Vida de élite",
    lang: "ES",
    hosts: "Pedro Marín",
    level: "Todos",
    idealFor: "Quien aprende mejor escuchando a atletas que ya compiten",
    about: "Entrevistas largas con deportistas y con el equipo que tienen detrás: entrenadores, nutricionistas, fisios. Tiene varios episodios con atletas y entrenadores españoles de HYROX.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "#44 Entrevista a Pelayo Menéndez | Hyrox: El Deporte Que Está Captando A Todos Los Corredores", date: "2025-04-10", why: "El paso de Ironman a HYROX contado por un atleta español de élite, con zapatillas, suplementos y errores típicos.", url: "https://podcasts.apple.com/es/podcast/44-entrevista-a-pelayo-men%C3%A9ndez-hyrox-el-deporte/id1734037999?i=1000703009176" },
      { title: "#66 Entrenador de HYROX | Principales errores al entrenar HYROX y cómo empezar a correr desde 0", date: "2025-12-22", why: "Pensado para quien todavía no corre: cómo empezar sin lesionarte y qué fallos se repiten en los principiantes.", url: "https://podcasts.apple.com/es/podcast/66-entrenador-de-hyrox-principales-errores-al/id1734037999?i=1000742356069" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/vida-de-%C3%A9lite/id1734037999",
    spotifyId: "1aWDbg9GMoHQJG2H7gmOxy",
  },
  {
    id: "los-otros-de-77-feet",
    name: "Los Otros de 77 Feet Podcast",
    lang: "ES",
    hosts: "Adri (GoPrimal), Guille Paysse y Edu Garriga",
    level: "Todos",
    idealFor: "Estar al día de la actualidad de HYROX, CrossFit y el fitness competitivo",
    about: "Tertulia semanal sobre la actualidad del fitness competitivo en España: HYROX, CrossFit, ATHX, marcas y polémicas. Menos técnico que los demás y más de opinión, pero es el que mejor te pone al día en una hora.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "[EP99 PODCAST] Batalla Hyrox vs ATHX ¿Quién ganará?", date: "2026-09-17", why: "Para entender qué es ATHX y por qué se habla tanto de la competencia entre formatos híbridos.", url: "https://podcasts.apple.com/es/podcast/ep99-podcast-batalla-hyrox-vs-athx-qui%C3%A9n-ganar%C3%A1/id1582827960?i=1000790391742" },
      { title: "[EP85 PODCAST] ¿Hyrox superará a CrossFit? Google Trends, Enhanced Games y péptidos", date: "2026-04-30", why: "Repaso con datos de cómo ha crecido HYROX frente al CrossFit.", url: "https://podcasts.apple.com/es/podcast/ep85-podcast-hyrox-superar%C3%A1-a-crossfit-google/id1582827960?i=1000764907276" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/los-otros-de-77-feet-podcast/id1582827960",
    spotifyId: "1XnyJEiwtExCL8p5nLeuSK",
  },
  {
    id: "radio-fitness-revolucionario",
    name: "Radio Fitness Revolucionario",
    lang: "ES",
    hosts: "Marcos Vázquez",
    level: "Principiante e intermedio",
    idealFor: "Nutrición, fuerza y salud con base científica para cualquier atleta",
    about: "Podcast de salud y entrenamiento con más de 290 episodios. Trata nutrición, fuerza y hábitos con invitados expertos. No es específico de carreras híbridas, pero tiene un episodio dedicado a la ciencia de HYROX.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "La Ciencia de HYROX, Creatina y Propósito, con el Dr. Jorge Gutiérrez-Hellín (Ep. 487)", date: "2026-08-18", why: "Qué exige HYROX al cuerpo explicado por un investigador, con un bloque sobre creatina.", url: "https://podcasts.apple.com/es/podcast/la-ciencia-de-hyrox-creatina-y-prop%C3%B3sito-con-el/id881260378?i=1000784504729" },
      { title: "Riesgos Ashwagandha, No Respondedores al Ejercicio, Gafas de Sol, Entrenamiento Híbrido, Soja", date: "2025-06-11", why: "Episodio de preguntas con un bloque sobre si combinar fuerza y resistencia te hace perder ganancias.", url: "https://podcasts.apple.com/es/podcast/riesgos-ashwagandha-no-respondedores-al-ejercicio-gafas/id881260378?i=1000712439725" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/radio-fitness-revolucionario/id881260378",
    spotifyId: "24yb6nRi4StqHhxCzGMTc8",
  },
  {
    id: "la-hoguera",
    name: "La Hoguera",
    lang: "ES",
    hosts: "Víctor Téllez",
    level: "Principiante e intermedio",
    idealFor: "Quien viene del trail o la calistenia y quiere entrenar de forma híbrida",
    about: "Víctor Téllez, entrenador, habla con especialistas en entrenamiento, nutrición y psicología. Tiene episodios concretos sobre entrenamiento híbrido y sobre OCR. En Spotify aparece como «La Hoguera 2.0».",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "137 - ¿Funciona el ENTRENAMIENTO HÍBRIDO? Esto dice la CIENCIA. Con Rubén Espinosa", date: "2025-02-16", why: "Lo que dice la investigación sobre combinar fuerza y resistencia sin que una frene a la otra.", url: "https://podcasts.apple.com/es/podcast/137-funciona-el-entrenamiento-h%C3%ADbrido-esto-dice-la/id1630531042?i=1000692804404" },
      { title: "198 - 5 Habilidades Físicas que Todo Ser Humano Debería Tener según Experto en OCR con 15 Años de Experiencia", date: "2026-05-10", why: "Un atleta de carreras de obstáculos explica qué capacidades trabajar antes de tu primera OCR.", url: "https://podcasts.apple.com/es/podcast/198-5-habilidades-f%C3%ADsicas-que-todo-ser-humano-deber%C3%ADa/id1630531042?i=1000767070868" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/la-hoguera/id1630531042",
    spotifyId: "4skkKnx4X3tgxgevd5Ipto",
  },

  // ── En inglés ───────────────────────────────────────────────────────────
  {
    id: "rox-lyfe",
    name: "Rox Lyfe - The HYROX Podcast",
    lang: "EN",
    hosts: "Greg Williams, comentarista de HYROX",
    level: "Intermedio y avanzado",
    idealFor: "Escuchar a campeones del mundo y atletas Elite 15",
    about: "Lo presenta el comentarista de las carreras HYROX y lleva más de 200 episodios. Entrevistas semanales con atletas de élite, entrenadores y gente de la organización. Ideal para entender cómo entrenan los que bajan de una hora.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "Dylan Scott - 2026 HYROX World Champion on Mindset, Race Strategy and Training", date: "2026-07-02", why: "El campeón del mundo de 2026 cuenta cómo planteó la carrera y cómo entrena.", url: "https://podcasts.apple.com/es/podcast/dylan-scott-2026-hyrox-world-champion-on-mindset-race/id1648250425?i=1000775103767" },
      { title: "Pelayo Menendez Fernandez on HYROX Injury Recovery, Race Strategy and Training", date: "2026-07-09", why: "Un atleta español de élite, en inglés, sobre volver de una lesión y la estrategia de carrera.", url: "https://podcasts.apple.com/es/podcast/pelayo-menendez-fernandez-on-hyrox-injury-recovery/id1648250425?i=1000776067762" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/rox-lyfe-the-hyrox-podcast/id1648250425",
    spotifyId: "6ziKYhLRbaH7c8qiSWmLTX",
  },
  {
    id: "hybrid-coaching-podcast",
    name: "Hybrid Coaching Podcast - HYROX Coaching",
    lang: "EN",
    hosts: "Anthony Peressini y Lauren Weeks",
    level: "Intermedio y avanzado",
    idealFor: "Entrenadores y atletas que quieren la parte científica",
    about: "Lauren Weeks, tres veces campeona del mundo de HYROX, y su marido y entrenador Anthony Peressini hablan de cómo entrenan a atletas de HYROX y DEKA: umbral, tirada larga, transiciones, calor. El más técnico de la lista.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "HCP #105 - Should you start with strength or Endurance training each day, & Farmer Carry progression", date: "2026-08-09", why: "Responde a una duda muy común: si haces fuerza y carrera el mismo día, qué va primero.", url: "https://podcasts.apple.com/es/podcast/hcp-105-should-you-start-with-strength-or-endurance/id1744964349?i=1000781234342" },
      { title: "HCP #109 - The Long run for Hybrid and Hyrox. Upcoming race in Salt Lake City.", date: "2026-09-14", why: "Cuánto y cómo meter la tirada larga si tu objetivo es HYROX y no un maratón.", url: "https://podcasts.apple.com/es/podcast/hcp-109-the-long-run-for-hybrid-and-hyrox-upcoming/id1744964349?i=1000789548500" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/hybrid-coaching-podcast-hyrox-coaching/id1744964349",
    spotifyId: "6qRPwW8T15oZpod4jSahc0",
  },
  {
    id: "trainhybrd",
    name: "TrainHybrd Podcast",
    lang: "EN",
    hosts: "Ben y Jackson",
    level: "Principiante e intermedio",
    idealFor: "Tu primera HYROX contada por atletas populares",
    about: "Dos atletas que compiten en HYROX y hablan sin rodeos de entrenamiento, zapatillas, nutrición y viajes a carreras. Tono cercano y muchos episodios pensados para principiantes.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "079: Hyrox for Beginners - Training, Strategy, Shoes, Nutrition and more!", date: "2026-02-24", why: "Un episodio completo para quien se acaba de inscribir: entrenamiento, estrategia, calzado y comida.", url: "https://podcasts.apple.com/es/podcast/079-hyrox-for-beginners-training-strategy-shoes-nutrition/id1740661599?i=1000751126000" },
      { title: "094: 10 Rules for Your First HYROX", date: "2026-08-04", why: "Diez reglas concretas para no reventar en la primera carrera.", url: "https://podcasts.apple.com/es/podcast/094-10-rules-for-your-first-hyrox/id1740661599?i=1000779800993" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/trainhybrd-podcast-hyrox-hybrid-training-running-endurance/id1740661599",
    spotifyId: "2WqsWZSk6BS00nZVU3fV3X",
  },
  {
    id: "hyrox-heroes",
    name: "HYROX HEROES the PODCAST",
    lang: "EN",
    hosts: "Hybrid Heroes (equipo de entrenadores)",
    level: "Principiante e intermedio",
    idealFor: "Ritmo, estrategia y errores de entrenamiento",
    about: "Episodios prácticos de un entrenador que también compite: pacing, puesta a punto, carrera a pie y mentalidad. Va directo a lo que se puede aplicar esa misma semana.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "The Number 1 Skill Every HYROXER Needs To Master. Let's Talk PACING", date: "2026-02-12", why: "El ritmo es donde más tiempo pierde la gente. Este episodio explica cómo repartir el esfuerzo.", url: "https://podcasts.apple.com/es/podcast/the-number-1-skill-every-hyroxer-needs-to-master-lets/id1768434617?i=1000750284599" },
      { title: "10 HYROX Training Mistakes That Are Holding You Back", date: "2026-10-13", why: "Lista de errores de entrenamiento que puedes revisar contra tu propio plan.", url: "https://podcasts.apple.com/es/podcast/10-hyrox-training-mistakes-that-are-holding-you-back/id1768434617?i=1000796190361" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/hyrox-heroes-the-podcast/id1768434617",
    spotifyId: "2YEolYY5IeRECgJWxqVdxi",
  },
  {
    id: "ukocr",
    name: "UKOCR",
    lang: "EN",
    hosts: "Obstacle Racing Media (Reino Unido)",
    level: "Todos",
    idealFor: "Carreras de obstáculos: Spartan, Tough Mudder y OCR europea",
    about: "Se presenta como el podcast número 1 de carreras de obstáculos en Reino Unido. Previas y crónicas de carreras, entrevistas con atletas y noticias de la escena OCR europea, incluidos los mundiales.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "Who's Hot – Episode 104: The world champs 2026 Preview", date: "2026-08-03", why: "Repaso de los favoritos y del formato de los mundiales de OCR.", url: "https://podcasts.apple.com/es/podcast/whos-hot-episode-104-the-world-champs-2026-preview/id1551477554?i=1000779624290" },
      { title: "UKOCR Q&A: British Obstacle Sports – The Big Questions", date: "2026-10-05", why: "Cómo se organizan las carreras de obstáculos como deporte federado, algo que también está pasando en España.", url: "https://podcasts.apple.com/es/podcast/ukocr-q-a-british-obstacle-sports-the-big-questions/id1551477554?i=1000793180007" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/ukocr/id1551477554",
    spotifyId: "2lkfnDXUDkJGIaNKchr2za",
  },
  {
    id: "sevan-podcast",
    name: "The Sevan Podcast",
    lang: "EN",
    hosts: "Sevan Matossian",
    level: "Intermedio y avanzado",
    idealFor: "CrossFit de competición y entrevistas con campeones de HYROX",
    about: "El podcast con más seguimiento del CrossFit de competición: directos, entrevistas y polémica. En 2026 ha entrevistado a los dos campeones del mundo de HYROX. Episodios largos, para escuchar mientras haces una tirada suave.",
    lastEpisodeYear: 2026,
    episodes: [
      { title: "Dylan Scott l Hyrox World Champion", date: "2026-08-01", why: "El campeón del mundo de HYROX visto desde el lado del CrossFit.", url: "https://podcasts.apple.com/es/podcast/dylan-scott-l-hyrox-world-champion/id1507430571?i=1000779367191" },
      { title: "Alyssa McElheny | 2026 HYROX WORLD CHAMPION", date: "2026-08-22", why: "La campeona del mundo de 2026 cuenta su camino hasta el título.", url: "https://podcasts.apple.com/es/podcast/alyssa-mcelheny-2026-hyrox-world-champion/id1507430571?i=1000785150077" },
    ],
    apple: "https://podcasts.apple.com/es/podcast/the-sevan-podcast/id1507430571",
    spotifyId: "2Dv27LkPWYuivAYnqY0J0n",
  },
];

export const spotifyShowUrl = p => (p.spotifyId ? `https://open.spotify.com/show/${p.spotifyId}` : `https://open.spotify.com/search/${encodeURIComponent(p.name)}/podcasts`);
