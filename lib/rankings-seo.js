/**
 * Capa de intención de compra de los rankings (auditoría 11/2026): title, H1, intro, criterios, FAQ
 * y una línea "para quién" por producto. No añade datos técnicos nuevos: los "para quién" salen de
 * las descripciones ya publicadas en lib/rankings.js. Sin notas numéricas (no hay método publicado).
 */
export const RANKINGS_SEO_UPDATED = "2026-11-03";

export const RANKINGS_SEO = {
  "zapatillas-hyrox": {
    metaTitle: "Mejores zapatillas para HYROX 2026: comparativa",
    h1: "Mejores zapatillas para HYROX 2026: comparativa",
    intro: [
      "En una HYROX corres 8 km, pero lo que decide la zapatilla son los 50 metros de sled push sobre moqueta y las 100 wall balls del final. Una de running muy blanda se hunde al empujar el trineo; una de halterofilia pura te castiga los gemelos en el kilómetro seis. Lo que buscamos es el punto medio: suela que agarre en moqueta, una base estable para las zancadas y las wall balls y la amortiguación justa para no acabar con los pies destrozados. Abajo están las que elegiríamos según si tu punto fuerte es correr o la fuerza.",
    ],
    criteria: [
      ["Agarre en moqueta", "El sled push y el sled pull se hacen sobre moqueta: la suela tiene que morder sin resbalar."],
      ["Estabilidad", "Base ancha y drop bajo para las sandbag lunges, el farmers carry y las wall balls."],
      ["Amortiguación suficiente", "Son 8 km de carrera en suelo de pabellón; con una zapatilla de gimnasio pura se notan."],
      ["Peso", "Cuanto más ligera, mejor se lleva el último kilómetro, siempre que no pierda estabilidad."],
    ],
    faq: [
      { q: "¿Puedo correr una HYROX con zapatillas de running normales?", a: "Sí, mucha gente lo hace en su primera carrera. El problema aparece en el trineo y en las zancadas: una zapatilla muy blanda o con mucho drop se hunde y resbala en la moqueta. Si vas a comprar una para HYROX, busca una híbrida con base estable." },
      { q: "¿Son lo mismo unas zapatillas de CrossFit que unas de HYROX?", a: "Se parecen, pero no son iguales. Las de CrossFit priorizan la estabilidad para levantar peso y aguantan peor 8 km de carrera. Las que mejor funcionan en HYROX combinan una base estable con algo más de amortiguación." },
      { q: "¿Cuánto tengo que gastarme?", a: "No hace falta el modelo más caro. Lo importante es que agarre en moqueta y que la hayas usado en entrenamientos con carrera y estaciones antes del día de la prueba. Compra con tiempo para estrenarlas en el box, no en la carrera." },
    ],
    forWho: {
      "nike-metcon-9": "Para quien quiere una sola zapatilla para el box y la carrera.",
      "reebok-nano-x4": "Para quien viene del CrossFit y busca algo más de amortiguación en el talón.",
      "new-balance-fuelcell-supercomp-trainer": "Para corredores que controlan bien las estaciones y quieren ganar tiempo en los 8 km.",
      "on-cloudsurfer": "Para quien prioriza la comodidad corriendo por encima de la estabilidad en las estaciones.",
      "saucony-kinvara-pro": "Para corredores ligeros que quieren una zapatilla rápida para los tramos de carrera.",
    },
  },
  "zapatillas-trail": {
    metaTitle: "Mejores zapatillas de trail para OCR 2026: comparativa",
    h1: "Mejores zapatillas de trail para OCR y carreras de obstáculos 2026",
    intro: [
      "En una carrera de obstáculos la zapatilla trabaja más que en cualquier trail: barro hasta el tobillo, zanjas con agua, muros de madera y bajadas sueltas, a veces en el mismo kilómetro. Lo primero que miramos es el taco de la suela, porque es lo que te deja subir una rampa embarrada sin agarrarte a la cuerda. Después, que drene rápido al salir del agua y que proteja el pie de las piedras. La versión con membrana impermeable ayuda en invierno con barro, pero en pruebas con mucha agua tarda más en vaciarse. Estas son las que llevaríamos según el tipo de carrera.",
    ],
    criteria: [
      ["Taco de la suela", "Tacos profundos y separados para que el barro no se quede pegado."],
      ["Drenaje", "En carreras con agua, una malla que suelte el agua rápido pesa menos que una membrana empapada."],
      ["Protección", "Puntera y placa contra piedras para recorridos de montaña."],
      ["Sujeción", "Que el pie no baile dentro en bajadas y al saltar obstáculos."],
    ],
    faq: [
      { q: "¿Gore-Tex sí o no para una OCR?", a: "Depende de la carrera. En pruebas de otoño e invierno con barro y poca agua profunda, la membrana mantiene el pie más seco. Si hay zanjas o ríos donde te metes entero, una zapatilla sin membrana y con buen drenaje se vacía antes y pesa menos." },
      { q: "¿Sirven unas zapatillas de asfalto para una OCR corta?", a: "Para una OCR urbana o de 5 km en terreno seco pueden valer, pero en barro patinan. Si la carrera es de montaña o en otoño, una de trail con taco marcado marca la diferencia en las rampas y en las bajadas." },
      { q: "¿Las uso solo para competir?", a: "No. Conviene haber hecho varias salidas con ellas, mejor con barro o agua, para saber cómo drenan y si rozan. Estrenar zapatillas en una OCR es la forma más rápida de acabar con ampollas." },
    ],
    forWho: {
      "salomon-speedcross-6-gtx": "Para OCR de invierno con mucho barro y poca agua profunda.",
      "salomon-xa-pro-3d-v9-gtx": "Para recorridos de montaña donde importa más la estabilidad que el taco.",
      "hoka-speedgoat-6-gtx": "Para carreras largas en las que la amortiguación pesa más que el agarre extremo.",
      "brooks-cascadia-17-gtx": "Para quien busca protección y durabilidad en terreno de piedra.",
      "inov-8-mudclaw-g-260": "Para las carreras más embarradas, cuando el taco es lo único que importa.",
    },
  },
  "zapatillas-crossfit": {
    metaTitle: "Mejores zapatillas de CrossFit 2026: comparativa",
    h1: "Mejores zapatillas de CrossFit y entrenamiento funcional 2026",
    intro: [
      "En el box la zapatilla tiene que hacer de todo en la misma sesión: sentadillas y cargadas con la base firme, saltos al cajón, subidas a la cuerda y algún tramo corto de carrera. Si preparas una HYROX o un DEKA, además, vas a empujar trineo y hacer wall balls a la semana. Por eso miramos sobre todo la estabilidad del talón, la protección lateral para la cuerda y que la puntera no se destroce al primer mes de burpees. Estas son las que usaríamos para entrenar, de la más polivalente a la más especializada en levantamiento.",
    ],
    criteria: [
      ["Estabilidad del talón", "Base firme y poco amortiguada para levantar sin que el pie se hunda."],
      ["Protección para la cuerda", "Refuerzo en el lateral y el arco para las subidas a la cuerda."],
      ["Flexibilidad delantera", "Para burpees, saltos y carreras cortas sin que la zapatilla luche contra el pie."],
      ["Durabilidad", "La puntera y la suela sufren con burpees y arrastres."],
    ],
    faq: [
      { q: "¿Necesito zapatillas de halterofilia además de las de CrossFit?", a: "Solo si haces mucho levantamiento olímpico pesado. Para un entrenamiento funcional normal, unas de CrossFit con buena base son suficientes. Las de halterofilia, con tacón elevado y rígido, son específicas para arrancadas y cargadas." },
      { q: "¿Puedo correr con zapatillas de CrossFit?", a: "Tramos cortos, sí. Para series largas o para los 8 km de una HYROX, la mayoría se queda corta de amortiguación. Si compites en HYROX, mira el ranking de zapatillas para HYROX." },
      { q: "¿Cada cuánto se cambian?", a: "Cuando la suela pierde agarre o la base deja de ser estable, normalmente por desgaste en la puntera y en el talón. Revisa la suela cada pocos meses si entrenas cuatro o cinco días a la semana." },
    ],
    forWho: {
      "nike-metcon-9": "Para quien quiere una zapatilla polivalente para el box y alguna carrera.",
      "reebok-nano-x4": "Para quien entrena variado y quiere algo más de comodidad en el talón.",
      "nobull-trainer-plus": "Para quien busca una zapatilla de box duradera y sencilla.",
      "under-armour-tribase-reign-6": "Para quien prioriza la estabilidad en los levantamientos.",
      "inov-8-fastlift-360": "Para quien hace mucho levantamiento olímpico y necesita tacón.",
    },
  },
  relojes: {
    metaTitle: "Mejores relojes GPS para HYROX y OCR 2026: comparativa",
    h1: "Mejores relojes GPS para HYROX y OCR 2026: comparativa",
    intro: [
      "Un reloj no te hace más rápido, pero te dice si estás entrenando lo que crees. En HYROX sirve para controlar el ritmo de cada kilómetro y no fundirte antes de las wall balls; en una OCR de montaña, para no perderte y saber cuánto queda. Lo que más miramos es el GPS en zonas difíciles, bajo árboles o entre edificios, la batería para tiradas largas y las métricas de carga y recuperación, que son las que te avisan de cuándo bajar el ritmo. Aquí están los que elegiríamos, del más completo al de mejor precio.",
    ],
    criteria: [
      ["GPS multibanda", "Más preciso bajo árboles, en montaña y entre edificios."],
      ["Autonomía con GPS", "Para tiradas largas y carreras de montaña sin quedarte sin batería."],
      ["Métricas de carga y recuperación", "Variabilidad de la frecuencia cardiaca, carga semanal y tiempo de recuperación."],
      ["Mapas", "Útiles para entrenar por montaña y en OCR largas."],
    ],
    faq: [
      { q: "¿Mide bien el reloj el ritmo dentro de un pabellón de HYROX?", a: "Dentro de un recinto cubierto el GPS pierde precisión, así que el ritmo instantáneo puede bailar. Lo más útil es usar la vuelta manual en cada kilómetro y guiarte por el tiempo y el pulso, no por el ritmo que marca el GPS." },
      { q: "¿Necesito un pulsómetro de pecho además del reloj?", a: "No es imprescindible. El sensor óptico del reloj funciona bien corriendo, pero en ejercicios de fuerza y con mucho movimiento de muñeca, como las wall balls o el remo, una banda de pecho es más fiable." },
      { q: "¿Merece la pena el modelo más caro?", a: "Solo si vas a usar los mapas, la batería extra o los materiales más resistentes. Para entrenar HYROX y OCR cortas, un reloj de gama media con GPS multibanda y buenas métricas de carga es suficiente." },
    ],
    forWho: {
      "garmin-forerunner-965": "Para quien quiere el reloj de entrenamiento más completo para OCR y HYROX.",
      "garmin-fenix-8": "Para quien compite en condiciones duras y quiere materiales más resistentes.",
      "suunto-race": "Para OCR de montaña y quien planifica rutas a menudo.",
      "polar-vantage-v3": "Para quien entrena mucho volumen y quiere las métricas fisiológicas más finas.",
      "coros-pace-3": "Para quien busca la mejor relación calidad-precio.",
      "apple-watch-ultra-2": "Para quien ya está en el ecosistema de Apple y usa sus apps de salud.",
    },
  },
  pulsometros: {
    metaTitle: "Mejores pulsómetros para HYROX y OCR 2026: comparativa",
    h1: "Mejores pulsómetros y bandas de pecho para HYROX y OCR 2026",
    intro: [
      "El pulso es la mejor forma de saber si vas a llegar entero al final de una HYROX: si en el tercer kilómetro ya estás en zona roja, las zancadas van a ser muy largas. El problema es que el sensor del reloj se lía con el movimiento de muñeca de las wall balls, el remo o el farmers carry. Una banda de pecho o un sensor de brazo da datos limpios en las estaciones, que es justo donde más interesa medir. Estos son los que usaríamos, según si entrenas en sala, corres en montaña o quieres algo que no se note.",
    ],
    criteria: [
      ["Precisión en movimiento", "Que no pierda la señal en remo, wall balls o arrastres."],
      ["Conectividad", "Bluetooth y ANT+ para conectarlo a la vez al reloj, al remo o a la app."],
      ["Memoria interna", "Para entrenar sin reloj o en deportes donde no se puede llevar."],
      ["Comodidad", "Que no roce en sesiones largas ni se mueva al correr."],
    ],
    faq: [
      { q: "¿Banda de pecho o sensor de brazo?", a: "La banda de pecho es la referencia en precisión y la mejor para intervalos y estaciones de fuerza. El sensor de brazo es más cómodo y también funciona bien; es buena opción si la banda te roza o te molesta." },
      { q: "¿Para qué sirve si el reloj ya mide el pulso?", a: "El sensor óptico de muñeca falla más en ejercicios con mucho movimiento de brazos o cuando aprietas el agarre. En HYROX, con remo, wall balls y farmers carry, la diferencia se nota." },
      { q: "¿Se puede usar en la carrera?", a: "Sí, no hay ninguna norma que lo prohíba en HYROX ni en las OCR habituales. Pruébalo antes en un entrenamiento largo para comprobar que no roza." },
    ],
    forWho: {
      "garmin-hrm-pro-plus": "Para quien tiene reloj Garmin y quiere métricas de carrera además del pulso.",
      "polar-h10": "Para quien busca la banda de pecho de referencia en precisión.",
      "wahoo-tickr-x": "Para quien entrena con apps y máquinas y quiere conectarlo a todo.",
      "polar-verity-sense": "Para quien no soporta la banda de pecho y prefiere el brazo.",
      "garmin-hrm-fit": "Para mujeres que quieren un sensor que se engancha al sujetador deportivo.",
    },
  },
  ropa: {
    metaTitle: "Mejor ropa para HYROX y OCR 2026: mallas y shorts",
    h1: "Mejor ropa para HYROX y OCR 2026: mallas, shorts y calcetines",
    intro: [
      "La ropa no se nota hasta que molesta: un short que se sube en las zancadas, unas mallas que pesan el doble al salir del agua o una costura que roza a partir del kilómetro cinco. Para HYROX buscamos prendas que dejen mover la cadera en las lunges y no se enganchen al trineo; para OCR, tejidos que sequen rápido, que no acumulen barro y que aguanten arrastrarse por el suelo. Ninguna prenda te va a dar tiempo, pero una mala elección te lo puede quitar. Estas son las que llevaríamos.",
    ],
    criteria: [
      ["Libertad de movimiento", "Para zancadas, burpees y saltos sin que la prenda tire."],
      ["Secado y peso mojado", "En OCR, lo que no seca rápido pesa más en cada obstáculo con agua."],
      ["Costuras y roces", "Costuras planas y cintura que no se mueva en carreras largas."],
      ["Bolsillos", "Útiles para geles o llaves en entrenamientos largos."],
    ],
    faq: [
      { q: "¿Mallas o pantalón corto para una OCR?", a: "Las mallas largas protegen de arañazos y del roce en los arrastres, pero pesan más mojadas. En carreras con mucho agua o en verano, muchos prefieren un short con mallas cortas debajo." },
      { q: "¿Qué ropa se lleva en HYROX?", a: "Lo que uses para entrenar en el box: short o mallas cortas y camiseta técnica o top. Se suda mucho en el pabellón, así que conviene ropa ligera que no se pegue." },
      { q: "¿Sirve la compresión?", a: "Hay quien se siente más cómodo con mallas de compresión, sobre todo en carreras largas. No hace milagros: elige por comodidad y por que no te roce." },
    ],
    forWho: {
      "2xu-core-compression-tights": "Para quien quiere compresión en sesiones y carreras largas.",
      "compressport-trail-shorts": "Para trail y OCR donde se agradecen bolsillos.",
      "saysky-combat-tights": "Para quien busca unas mallas resistentes para entrenar a diario.",
      "salomon-cross-shorts": "Para quien prefiere un short ligero y versátil.",
      "hoka-performance-shorts": "Para quien quiere un short de running cómodo para los tramos de carrera.",
    },
  },
};
