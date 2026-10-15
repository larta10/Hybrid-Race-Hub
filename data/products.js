/**
 * Productos recomendados: ÚNICA fuente de verdad para enlaces de Amazon.
 * Los enlaces se construyen SIEMPRE con buildAmazonUrl (lib/affiliate.js).
 *
 * - asin: ASIN de amazon.es (10 caracteres). Opcional.
 * - asinDisponible: false si /dp/<ASIN> dio 404 en amazon.es o es otro modelo → se enlaza a la búsqueda.
 * - searchQuery: obligatoria; se usa cuando no hay ASIN válido.
 * - Nada de precios: Amazon no permite mostrarlos escritos a mano (solo con su API).
 *
 * Verificación de ASIN: 2026-10-15 (ver docs/informe-enlaces-afiliado.md).
 */
export const PRODUCTS = [
  {
    "id": "garmin-forerunner-965",
    "nombre": "Garmin Forerunner 965",
    "marca": "Garmin",
    "categoria": "Relojes GPS",
    "asin": "B0CFQ1NQPG",
    "asinDisponible": false,
    "searchQuery": "Garmin Forerunner 965",
    "descripcionCorta": "La referencia de los atletas de OCR y triatlón.",
    "pros": [
      "GPS multibanda más preciso del mercado para trail",
      "Métricas de carga y recuperación muy avanzadas",
      "Mapas topo integrados — navegación sin teléfono"
    ],
    "contras": [
      "Precio elevado",
      "Pantalla AMOLED afecta autonomía vs modelos anteriores"
    ],
    "imagenLocal": null,
    "destacado": true
  },
  {
    "id": "garmin-fenix-8",
    "nombre": "Garmin Fenix 8",
    "marca": "Garmin",
    "categoria": "Relojes GPS",
    "asin": "B0D1PZBYF2",
    "asinDisponible": false,
    "searchQuery": "Garmin Fenix 8",
    "descripcionCorta": "El tope de gama de Garmin.",
    "pros": [
      "Materiales de construcción premium",
      "Altavoz/micrófono para responder llamadas",
      "Compatible con todas las aplicaciones Garmin"
    ],
    "contras": [
      "El más caro del ranking",
      "Muy similar al FR965 en métricas deportivas"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "suunto-race",
    "nombre": "Suunto Race",
    "marca": "Suunto",
    "categoria": "Relojes GPS",
    "asin": "B0C6T5BD9H",
    "asinDisponible": false,
    "searchQuery": "Suunto Race",
    "descripcionCorta": "Suunto ha vuelto con fuerza con el Race.",
    "pros": [
      "40 h GPS multibanda — autonomía líder en su precio",
      "Pantalla AMOLED excelente bajo sol directo",
      "Diseño más compacto y ligero que el Fenix"
    ],
    "contras": [
      "Ecosistema de datos menos completo que Garmin",
      "Menos métricas avanzadas de recuperación"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "polar-vantage-v3",
    "nombre": "Polar Vantage V3",
    "marca": "Polar",
    "categoria": "Relojes GPS",
    "asin": "B0CFMXF3NH",
    "asinDisponible": false,
    "searchQuery": "Polar Vantage V3",
    "descripcionCorta": "Polar sigue siendo el rey de las métricas fisiológicas.",
    "pros": [
      "Mejor sensor óptico de FC del mercado",
      "HRV nocturno más fiable",
      "43 h de autonomía GPS — líder absoluto"
    ],
    "contras": [
      "Mapas menos intuitivos que Garmin/Suunto",
      "Ecosistema de apps limitado"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "coros-pace-3",
    "nombre": "COROS PACE 3",
    "marca": "COROS",
    "categoria": "Relojes GPS",
    "asin": "B0CFQQ9FDL",
    "asinDisponible": true,
    "searchQuery": "COROS PACE 3",
    "descripcionCorta": "La mejor relación calidad/precio por debajo de 250 €.",
    "pros": [
      "Precio muy competitivo",
      "38 h GPS multibanda — excepcional para su precio",
      "Ligero (39 g) — ideal para running rápido"
    ],
    "contras": [
      "Métricas avanzadas menos desarrolladas que Garmin",
      "Ecosistema de apps más limitado"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "apple-watch-ultra-2",
    "nombre": "Apple Watch Ultra 2",
    "marca": "Apple",
    "categoria": "Relojes GPS",
    "asin": "B0CHX8B914",
    "asinDisponible": true,
    "searchQuery": "Apple Watch Ultra 2",
    "descripcionCorta": "El más caro y el más potente tecnológicamente, pero no el mejor para rendimiento deportivo puro.",
    "pros": [
      "Integración total ecosistema Apple/iPhone",
      "Titanio de aviación — muy robusto",
      "GPS de doble chip muy preciso"
    ],
    "contras": [
      "El más caro del ranking",
      "Ecosistema de entrenamiento deportivo inferior a Garmin",
      "Autonomía limitada frente a su precio"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "salomon-speedcross-6-gtx",
    "nombre": "Salomon Speedcross 6 GTX",
    "marca": "Salomon",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0CGJHZGPV",
    "asinDisponible": false,
    "searchQuery": "Salomon Speedcross 6 GTX",
    "descripcionCorta": "La referencia del OCR con impermeabilidad.",
    "pros": [
      "Agarre en barro sin competencia en su gama",
      "Gore-Tex ExtendedComfort — impermeabilidad real en prolongado",
      "Sistema Quicklace rápido y seguro en carrera"
    ],
    "contras": [
      "Más pesada que la versión sin GTX",
      "Drenaje más lento si se llena de agua"
    ],
    "imagenLocal": null,
    "destacado": true
  },
  {
    "id": "salomon-xa-pro-3d-v9-gtx",
    "nombre": "Salomon XA Pro 3D v9 GTX",
    "marca": "Salomon",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0C9THPXGB",
    "asinDisponible": false,
    "searchQuery": "Salomon XA Pro 3D v9 GTX",
    "descripcionCorta": "Más versátil que la Speedcross — la suela Contagrip MA está diseñada para una gama más amplia de terrenos (no solo barro) y el sistema 3D Advanced Chassis protege el pie de impactos en roca.",
    "pros": [
      "Más versátil en terreno mixto que la Speedcross",
      "Protección lateral excelente para rocas y raíces",
      "Diseño más conservador — sirve también para trail recreativo"
    ],
    "contras": [
      "Menos agarre específico en barro profundo que la Speedcross",
      "Más pesada que otras opciones de la gama"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "hoka-speedgoat-6-gtx",
    "nombre": "Hoka Speedgoat 6 GTX",
    "marca": "Hoka",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0CS5LBMHV",
    "asinDisponible": false,
    "searchQuery": "Hoka Speedgoat 6 GTX",
    "descripcionCorta": "Si tu punto fuerte es el running y los obstáculos no son tu preocupación principal, la Speedgoat 6 GTX te da el amortiguamiento más generoso del ranking.",
    "pros": [
      "Amortiguamiento líder — ideal para OCR de larga distancia",
      "Vibram Megagrip — agarre excepcional en roca mojada",
      "Muy estable en descensos técnicos"
    ],
    "contras": [
      "La más cara del ranking",
      "Menos drenaje que zapatillas trail sin GTX"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "brooks-cascadia-17-gtx",
    "nombre": "Brooks Cascadia 17 GTX",
    "marca": "Brooks",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0CPN3B9PP",
    "asinDisponible": false,
    "searchQuery": "Brooks Cascadia 17 GTX",
    "descripcionCorta": "La Cascadia lleva décadas siendo referente en trail y la versión 17 mantiene ese equilibrio entre protección, agarre y confort.",
    "pros": [
      "Horma amplia — cómoda en distancias largas",
      "Muy resistente y duradera",
      "Buen equilibrio protección/peso"
    ],
    "contras": [
      "Agarre en barro menos agresivo que la Speedcross",
      "La versión GTX es significativamente más cara que la estándar"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "inov-8-mudclaw-g-260",
    "nombre": "Inov-8 Mudclaw G 260",
    "marca": "Inov-8",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B07DWRBMQL",
    "asinDisponible": false,
    "searchQuery": "Inov-8 Mudclaw G 260",
    "descripcionCorta": "La única del ranking sin Gore-Tex — pero la incluimos porque su agarre en barro es tan excepcional que merece mención especial.",
    "pros": [
      "El mejor agarre en barro del mercado — sin discusión",
      "Más ligera que las GTX (260 g)",
      "Drenaje superior cuando hay agua"
    ],
    "contras": [
      "Sin impermeabilidad",
      "Clavos muy agresivos — incómodos en roca y asfalto"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "nike-metcon-9",
    "nombre": "Nike Metcon 9",
    "marca": "Nike",
    "categoria": "Zapatillas HYROX",
    "asin": "B0CZF9KMPZ",
    "asinDisponible": true,
    "searchQuery": "Nike Metcon 9",
    "descripcionCorta": "La reina indiscutida de HYROX.",
    "pros": [
      "La más versátil entre running y trabajo funcional",
      "Muy estable en sled push y ejercicios de fuerza",
      "La más probada en competición HYROX"
    ],
    "contras": [
      "No es la más rápida en la parte de running puro",
      "Precio elevado para su nivel de amortiguamiento"
    ],
    "imagenLocal": null,
    "destacado": true
  },
  {
    "id": "reebok-nano-x4",
    "nombre": "Reebok Nano X4",
    "marca": "Reebok",
    "categoria": "Zapatillas HYROX",
    "asin": "B0DHPWRSM5",
    "asinDisponible": true,
    "searchQuery": "Reebok Nano X4",
    "descripcionCorta": "La alternativa directa a la Metcon con un punto más de amortiguamiento en el talón — ventaja real en las sandbag lunges de 100 m y el farmer's carry de 200 m.",
    "pros": [
      "Más amortiguamiento que la Metcon — mejor en ejercicios de impacto",
      "Precio más competitivo",
      "Muy durable — aguanta mucho entrenamiento"
    ],
    "contras": [
      "Ligeramente más pesada que la Metcon 9",
      "Suela un poco menos plana en los ejercicios de halterofilia"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "new-balance-fuelcell-supercomp-trainer",
    "nombre": "New Balance FuelCell SuperComp Trainer",
    "marca": "New Balance",
    "categoria": "Zapatillas HYROX",
    "asin": "B0BHR41ML4",
    "asinDisponible": false,
    "searchQuery": "New Balance FuelCell SuperComp Trainer",
    "descripcionCorta": "Si tu punto fuerte es el running y los ejercicios los controlas bien, la FuelCell SC Trainer te da una ventaja real en los km de carrera.",
    "pros": [
      "Placa de carbono — ventaja en running",
      "Ligera (250 g) — reduce fatiga en carrera",
      "Buen equilibrio running/gym"
    ],
    "contras": [
      "La más cara del ranking",
      "La placa de carbono puede ser incómoda en ejercicios muy estáticos"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "on-cloudsurfer",
    "nombre": "On Cloudsurfer",
    "marca": "On",
    "categoria": "Zapatillas HYROX",
    "asin": "B0B9VB86FQ",
    "asinDisponible": false,
    "searchQuery": "On Cloudsurfer",
    "descripcionCorta": "On ha entrado con fuerza en el mundo HYROX.",
    "pros": [
      "Excelente en running — entre las más cómodas del ranking",
      "Diseño premium",
      "Buena respuesta en ejercicios de impacto (burpee broad jump)"
    ],
    "contras": [
      "La más cara de las de running dominante",
      "Menos estable que la Metcon en sled push"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "saucony-kinvara-pro",
    "nombre": "Saucony Kinvara Pro",
    "marca": "Saucony",
    "categoria": "Zapatillas HYROX",
    "asin": "B0BJVWJGXB",
    "asinDisponible": false,
    "searchQuery": "Saucony Kinvara Pro",
    "descripcionCorta": "La más ligera del ranking (220 g) y la más orientada al running puro.",
    "pros": [
      "La más ligera del ranking",
      "Muy propulsiva en running",
      "Precio competitivo para su nivel"
    ],
    "contras": [
      "La menos estable en ejercicios de fuerza",
      "No recomendable si el sled push o los wall balls son tu punto débil"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "nobull-trainer-plus",
    "nombre": "NoBull Trainer+",
    "marca": "NoBull",
    "categoria": "Zapatillas CrossFit",
    "asin": "B08JQLW47K",
    "asinDisponible": false,
    "searchQuery": "NoBull Trainer+",
    "descripcionCorta": "La favorita de la comunidad CrossFit independiente.",
    "pros": [
      "SuperFabric — el más resistente en rope climb",
      "Diseño más discreto y versátil para uso diario",
      "Muy buena estabilidad lateral"
    ],
    "contras": [
      "Running dentro del WOD es su punto débil",
      "Menos conocida — difícil de encontrar en tiendas físicas en España"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "under-armour-tribase-reign-6",
    "nombre": "Under Armour TriBase Reign 6",
    "marca": "Under Armour",
    "categoria": "Zapatillas CrossFit",
    "asin": "B0CLDM2H9F",
    "asinDisponible": false,
    "searchQuery": "Under Armour TriBase Reign 6",
    "descripcionCorta": "La opción de mejor precio del ranking.",
    "pros": [
      "La mejor relación calidad/precio del ranking",
      "Sistema TriBase — buena distribución de carga en levantamientos",
      "Buena para sentadilla y peso muerto"
    ],
    "contras": [
      "Menos durable que Metcon/Nano en rope climb intenso",
      "Opciones de talla limitadas en España"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "inov-8-fastlift-360",
    "nombre": "Inov-8 FastLift 360",
    "marca": "Inov-8",
    "categoria": "Zapatillas CrossFit",
    "asin": "B07MR2R97N",
    "asinDisponible": false,
    "searchQuery": "Inov-8 FastLift 360",
    "descripcionCorta": "La más especializada en levantamiento de potencia del ranking.",
    "pros": [
      "Tacón específico para sentadilla olímpica y cargadas",
      "Grafeno en suela — agarre excepcional en plataformas",
      "Muy buena para WODs con carga pesada"
    ],
    "contras": [
      "Rope climb no es su punto fuerte",
      "Menos versatilidad para WODs mixtos con running"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "garmin-hrm-pro-plus",
    "nombre": "Garmin HRM-Pro Plus",
    "marca": "Garmin",
    "categoria": "Pulsómetros",
    "asin": "B0B3PNFK9H",
    "asinDisponible": true,
    "searchQuery": "Garmin HRM-Pro Plus",
    "descripcionCorta": "El referente para atletas de triatlón y HYROX.",
    "pros": [
      "Métricas de running dinámico — nivel élite",
      "Compatible con todo el ecosistema Garmin",
      "Memoria interna — funciona sin reloj"
    ],
    "contras": [
      "El más caro del ranking",
      "Algunas métricas avanzadas solo funcionan con relojes Garmin"
    ],
    "imagenLocal": null,
    "destacado": true
  },
  {
    "id": "polar-h10",
    "nombre": "Polar H10",
    "marca": "Polar",
    "categoria": "Pulsómetros",
    "asin": "B07WHLR63Y",
    "asinDisponible": false,
    "searchQuery": "Polar H10",
    "descripcionCorta": "El estándar de oro en precisión de FC de pecho.",
    "pros": [
      "Precisión de FC líder según estudios independientes",
      "Muy buena sujeción — no se mueve en OCR con barro",
      "Precio muy competitivo para su nivel"
    ],
    "contras": [
      "Memoria solo de 1 sesión (no acumula historial)",
      "Sin métricas adicionales de running"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "wahoo-tickr-x",
    "nombre": "Wahoo TICKR X",
    "marca": "Wahoo",
    "categoria": "Pulsómetros",
    "asin": "B07T64LZMB",
    "asinDisponible": false,
    "searchQuery": "Wahoo TICKR X",
    "descripcionCorta": "El favorito de los ciclistas y triatletas que también compiten en HYROX.",
    "pros": [
      "Métricas de running + fuerza — el más completo por su precio",
      "Compatibilidad universal con todas las apps",
      "Memoria interna extendida"
    ],
    "contras": [
      "Métricas de running menos precisas que el HRM-Pro Plus",
      "La app Wahoo requiere configuración inicial"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "polar-verity-sense",
    "nombre": "Polar Verity Sense",
    "marca": "Polar",
    "categoria": "Pulsómetros",
    "asin": "B08T1WV9BJ",
    "asinDisponible": false,
    "searchQuery": "Polar Verity Sense",
    "descripcionCorta": "El único sensor óptico de brazo del ranking — se lleva en el antebrazo o la sien, no en el pecho.",
    "pros": [
      "Sensor de brazo — más cómodo que el pecho para algunos deportes",
      "Muy buena precisión para sensor óptico",
      "Apto para natación (inmersión)"
    ],
    "contras": [
      "Precio elevado para un sensor óptico",
      "Puede desplazarse en movimientos de brazos muy intensos"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "garmin-hrm-fit",
    "nombre": "Garmin HRM-Fit",
    "marca": "Garmin",
    "categoria": "Pulsómetros",
    "asin": "B09XL58BSY",
    "asinDisponible": false,
    "searchQuery": "Garmin HRM-Fit",
    "descripcionCorta": "Diseñado específicamente para mujeres — se engancha al sujetador deportivo sin necesidad de banda de pecho adicional.",
    "pros": [
      "Sin banda — máxima comodidad para atletas femeninas",
      "Compatible con todos los relojes Garmin",
      "Buena precisión de FC"
    ],
    "contras": [
      "Solo para atletas femeninas",
      "Sin memoria interna ni métricas adicionales"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "2xu-core-compression-tights",
    "nombre": "2XU Core Compression Tights",
    "marca": "2XU",
    "categoria": "Ropa técnica",
    "asin": "B01IFKR5FY",
    "asinDisponible": true,
    "searchQuery": "2XU Core Compression Tights",
    "descripcionCorta": "El estándar de compresión para OCR.",
    "pros": [
      "Compresión graduada real — no solo estética",
      "Resistencia al barro excepcional",
      "Protección de piel en obstáculos con alambre y madera"
    ],
    "contras": [
      "Sin bolsillos — necesitas cinturón o chaleco para geles",
      "Precio elevado para malla de compresión básica"
    ],
    "imagenLocal": null,
    "destacado": true
  },
  {
    "id": "compressport-trail-shorts",
    "nombre": "Compressport Trail shorts",
    "marca": "Compressport",
    "categoria": "Ropa técnica",
    "asin": "B0B9VR9NKS",
    "asinDisponible": false,
    "searchQuery": "Compressport Trail shorts",
    "descripcionCorta": "El short de trail más completo del ranking.",
    "pros": [
      "4 bolsillos — el más completo para carreras autosuficientes",
      "Malla interior integrada — sin roces ni arrastres",
      "Tejido que no retiene barro"
    ],
    "contras": [
      "El más caro del ranking",
      "El short interior puede ser incómodo para algunos atletas"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "saysky-combat-tights",
    "nombre": "Saysky Combat Tights",
    "marca": "Saysky",
    "categoria": "Ropa técnica",
    "asin": "B07YQW6KGH",
    "asinDisponible": false,
    "searchQuery": "Saysky Combat Tights",
    "descripcionCorta": "La opción premium para atletas que no quieren comprometer en nada.",
    "pros": [
      "Calidad de materiales premium",
      "Bolsillos integrados bien posicionados",
      "Muy buena gestión de la humedad"
    ],
    "contras": [
      "El más caro del ranking",
      "La marca es menos conocida — difícil de encontrar en España"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "salomon-cross-shorts",
    "nombre": "Salomon Cross shorts",
    "marca": "Salomon",
    "categoria": "Ropa técnica",
    "asin": "B0B4L8B75Z",
    "asinDisponible": false,
    "searchQuery": "Salomon Cross shorts",
    "descripcionCorta": "El short ligero de Salomon para trail y OCR.",
    "pros": [
      "Libertad de movimiento total",
      "Secado muy rápido",
      "Precio muy competitivo"
    ],
    "contras": [
      "Compresión baja — no aporta recuperación muscular",
      "Sin malla interior en algunos modelos"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "hoka-performance-shorts",
    "nombre": "Hoka Performance shorts",
    "marca": "Hoka",
    "categoria": "Ropa técnica",
    "asin": "B0C9THXXT2",
    "asinDisponible": false,
    "searchQuery": "Hoka Performance shorts",
    "descripcionCorta": "El short más ligero y asequible del ranking.",
    "pros": [
      "El más asequible del ranking",
      "Muy ligero — apenas se nota en carrera",
      "Buena relación calidad/precio"
    ],
    "contras": [
      "Compresión casi inexistente",
      "Menos bolsillos que la competencia"
    ],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "inov-8-x-talon-212-v2",
    "nombre": "Inov-8 X-Talon 212 v2",
    "marca": "Inov-8",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0949LMWH8",
    "asinDisponible": true,
    "searchQuery": "Inov-8 X-Talon 212 v2",
    "descripcionCorta": "Zapatilla de OCR con tacos para barro y drenaje rápido.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "salomon-speedcross-6",
    "nombre": "Salomon Speedcross 6",
    "marca": "Salomon",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0CGJHZGPV",
    "asinDisponible": true,
    "searchQuery": "Salomon Speedcross 6",
    "descripcionCorta": "Zapatilla de trail con suela agresiva, versátil para OCR con mucho tramo corriendo.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "new-balance-fresh-foam-x-hierro-v8",
    "nombre": "New Balance Fresh Foam X Hierro v8",
    "marca": "New Balance",
    "categoria": "Zapatillas trail y OCR",
    "asin": "B0CXK38JZN",
    "asinDisponible": true,
    "searchQuery": "New Balance Fresh Foam X Hierro v8",
    "descripcionCorta": "Zapatilla de trail cómoda y amortiguada para debutar.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "mechanix-wear-fastfit",
    "nombre": "Mechanix Wear FastFit",
    "marca": "Mechanix Wear",
    "categoria": "Guantes y calleras",
    "asin": "B08CPC6ZLZ",
    "asinDisponible": true,
    "searchQuery": "Mechanix Wear FastFit",
    "descripcionCorta": "Guantes finos que protegen las manos sin quitar tacto en barras y cuerdas.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "unbroken-grips-2-0",
    "nombre": "Unbroken Grips 2.0",
    "marca": "Unbroken",
    "categoria": "Guantes y calleras",
    "asin": "B072YJCWRT",
    "asinDisponible": true,
    "searchQuery": "Unbroken Grips 2.0",
    "descripcionCorta": "Calleras de cuero para barras, anillas y cuerda.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "cep-the-run-compression-socks",
    "nombre": "CEP The Run Compression Socks",
    "marca": "CEP",
    "categoria": "Ropa técnica",
    "asin": "B0B59J2YR9",
    "asinDisponible": true,
    "searchQuery": "CEP The Run Compression Socks",
    "descripcionCorta": "Calcetines largos de compresión que protegen la tibia en arrastres.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "salomon-active-skin-8",
    "nombre": "Salomon Active Skin 8",
    "marca": "Salomon",
    "categoria": "Hidratación",
    "asin": "B0B4VZLHRN",
    "asinDisponible": true,
    "searchQuery": "Salomon Active Skin 8",
    "descripcionCorta": "Chaleco de hidratación de 8 litros para OCR largas y trail.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "garmin-forerunner-265",
    "nombre": "Garmin Forerunner 265",
    "marca": "Garmin",
    "categoria": "Relojes GPS",
    "asin": "B0BS1T9J4Y",
    "asinDisponible": true,
    "searchQuery": "Garmin Forerunner 265",
    "descripcionCorta": "Reloj GPS con pantalla AMOLED y métricas de entrenamiento completas.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "asics-gel-kayano-31",
    "nombre": "ASICS Gel-Kayano 31",
    "marca": "ASICS",
    "categoria": "Zapatillas HYROX",
    "asin": "B0CYT531C3",
    "asinDisponible": true,
    "searchQuery": "ASICS Gel-Kayano 31",
    "descripcionCorta": "Zapatilla de running con estabilidad para quien prioriza los kilómetros.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "on-cloudboom-echo",
    "nombre": "On Cloudboom Echo",
    "marca": "On",
    "categoria": "Zapatillas HYROX",
    "asin": "B0B9HRSP53",
    "asinDisponible": true,
    "searchQuery": "On Cloudboom Echo",
    "descripcionCorta": "Zapatilla de competición con placa de carbono para correr rápido.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "nobull-canvas-trainer",
    "nombre": "NOBULL Canvas Trainer",
    "marca": "NOBULL",
    "categoria": "Zapatillas CrossFit",
    "asin": "B08JQLW47K",
    "asinDisponible": true,
    "searchQuery": "NOBULL Canvas Trainer",
    "descripcionCorta": "Zapatilla de entrenamiento con suela plana y parte superior resistente.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "theragun-prime",
    "nombre": "Theragun Prime",
    "marca": "Therabody",
    "categoria": "Recuperación",
    "asin": "B0C4M811HS",
    "asinDisponible": true,
    "searchQuery": "Theragun Prime",
    "descripcionCorta": "Pistola de masaje de percusión para recuperar entre sesiones.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "hyperice-hypervolt-go-2",
    "nombre": "Hyperice Hypervolt Go 2",
    "marca": "Hyperice",
    "categoria": "Recuperación",
    "asin": "B0CDMX8QBZ",
    "asinDisponible": true,
    "searchQuery": "Hyperice Hypervolt Go 2",
    "descripcionCorta": "Pistola de masaje compacta y silenciosa.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "id": "triggerpoint-grid-foam-roller",
    "nombre": "TriggerPoint GRID Foam Roller",
    "marca": "TriggerPoint",
    "categoria": "Recuperación",
    "asin": "B0040EGNIU",
    "asinDisponible": true,
    "searchQuery": "TriggerPoint GRID Foam Roller",
    "descripcionCorta": "Rodillo de espuma firme para liberar tensión muscular.",
    "pros": [],
    "contras": [],
    "imagenLocal": null,
    "destacado": false
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "auriculares-deportivos-conduccion-osea",
    "nombre": "Auriculares de conducción ósea",
    "marca": null,
    "categoria": "Auriculares",
    "searchQuery": "auriculares conduccion osea deporte",
    "descripcionCorta": "Dejan el oído libre para oír el entorno mientras corres.",
    "pros": [
      "Oyes el tráfico y a tu entrenador",
      "No se mueven al saltar o remar"
    ],
    "contras": [
      "Calidad de sonido inferior a los intrauditivos",
      "Se escuchan peor en gimnasios con mucho ruido"
    ]
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "auriculares-deportivos-gancho",
    "nombre": "Auriculares deportivos con gancho",
    "marca": null,
    "categoria": "Auriculares",
    "searchQuery": "auriculares deportivos inalambricos gancho",
    "descripcionCorta": "Intrauditivos con gancho que no se caen en burpees ni en el remo.",
    "pros": [
      "Sujeción firme en movimientos bruscos",
      "Mejor aislamiento que la conducción ósea"
    ],
    "contras": [
      "Aíslan del entorno al correr por la calle",
      "Hay que limpiarlos a menudo por el sudor"
    ]
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "cuerda-para-saltar-speed-rope",
    "nombre": "Comba de velocidad (speed rope)",
    "marca": null,
    "categoria": "Entrenamiento en casa",
    "searchQuery": "comba crossfit speed rope",
    "descripcionCorta": "Comba ligera con rodamientos para dobles y trabajo cardiovascular.",
    "pros": [
      "Barata y ocupa nada",
      "Sirve para calentar y para intervalos"
    ],
    "contras": [
      "El cable fino se desgasta en suelo rugoso"
    ]
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "kettlebell-16-kg",
    "nombre": "Kettlebell de 16 kg",
    "marca": null,
    "categoria": "Entrenamiento en casa",
    "searchQuery": "kettlebell 16 kg hierro fundido",
    "descripcionCorta": "Kettlebell de hierro para farmer carry, swings y zancadas con carga.",
    "pros": [
      "Un solo peso cubre muchos ejercicios de HYROX",
      "Dura toda la vida"
    ],
    "contras": [
      "Si progresas te faltará una segunda más pesada"
    ]
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "chaleco-lastrado",
    "nombre": "Chaleco lastrado ajustable",
    "marca": null,
    "categoria": "Entrenamiento en casa",
    "searchQuery": "chaleco lastrado ajustable",
    "descripcionCorta": "Chaleco con placas para zancadas y carrera con carga.",
    "pros": [
      "Simula el cansancio de las wall balls y zancadas",
      "Ajustable en peso"
    ],
    "contras": [
      "Molesta en carreras largas si no se ajusta bien"
    ]
  },
  {
    "asin": null,
    "asinDisponible": false,
    "imagenLocal": null,
    "destacado": false,
    "id": "balon-medicinal-wall-ball",
    "nombre": "Balón medicinal para wall balls",
    "marca": null,
    "categoria": "Entrenamiento en casa",
    "searchQuery": "wall ball balon medicinal 6 kg",
    "descripcionCorta": "Balón blando de 4, 6 o 9 kg para practicar la estación de wall balls.",
    "pros": [
      "Es la estación que más tiempo hace perder",
      "Practicarla en casa ahorra minutos"
    ],
    "contras": [
      "Necesitas una pared alta y resistente"
    ]
  }
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
