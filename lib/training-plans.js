/* ─────────────────────────────────────────────────────────────────────────
   Training Plan Generator — Hybrid Race Hub
   Generates personalised multi-week training plans based on user answers.
───────────────────────────────────────────────────────────────────────── */

export const SESSION_TYPE_META = {
  strength:  { label: "Fuerza",       color: "#34D399", bg: "rgba(52,211,153,0.13)" },
  cardio:    { label: "Cardio",       color: "#60A5FA", bg: "rgba(96,165,250,0.13)" },
  skill:     { label: "Técnica",      color: "#FB923C", bg: "rgba(251,146,60,0.13)" },
  mixed:     { label: "Mixto",        color: "#C084FC", bg: "rgba(192,132,252,0.13)" },
  recovery:  { label: "Recuperación", color: "#FACC15", bg: "rgba(250,204,21,0.10)" },
  rest:      { label: "Descanso",     color: "#5D5F6B", bg: "rgba(93,95,107,0.10)"  },
};

export const PHASE_META = {
  base:        { label: "Base",        color: "#60A5FA", desc: "Construimos la base aeróbica y de fuerza general" },
  desarrollo:  { label: "Desarrollo",  color: "#34D399", desc: "Incrementamos volumen e incorporamos trabajo específico" },
  intensidad:  { label: "Intensidad",  color: "#FB923C", desc: "Simulaciones de carrera y picos de rendimiento" },
  descarga:    { label: "Descarga",    color: "#FACC15", desc: "Reducimos volumen para llegar fresco al evento" },
  mantenimiento:{ label: "Mantenimiento", color: "#C084FC", desc: "Mantenemos forma y construimos base sólida" },
};

/* ─── SESSION LIBRARY ─────────────────────────────────────────────────── */

const LIB = {

  /* ══ OCR SPRINT / PRO ══════════════════════════════════════════════════ */
  ocr: {
    strength: {
      principiante: [
        {
          title: "Fuerza para Obstáculos I",
          focus: "Construye la base de agarre y tren superior",
          warmup: ["5 min trote suave", "10 círculos de brazos", "10 sentadillas peso corporal"],
          main: [
            "Dominadas asistidas (banda) — 3 × 6-8 reps",
            "Flexiones — 3 × 10-12 reps",
            "Remo con banda / TRX — 3 × 12 reps",
            "Farmer carry 20 m — 3 series",
            "Dead hang — 3 × 20 s",
          ],
          cooldown: ["Estiramiento antebrazos y hombros 2 min", "Foam roller espalda alta 2 min"],
        },
        {
          title: "Tren Inferior + Core",
          focus: "Potencia en piernas y estabilidad",
          warmup: ["400 m trote", "10 estocadas", "10 peso muerto rumano sin peso"],
          main: [
            "Sentadilla goblet con KB/peso — 3 × 12",
            "Peso muerto con mancuerna — 3 × 10",
            "Hip thrust — 3 × 12",
            "Plancha frontal — 3 × 30-40 s",
            "Mountain climbers — 3 × 20 reps",
          ],
          cooldown: ["Estiramiento cuádriceps e isquios", "Pigeon pose 90 s por lado"],
        },
      ],
      intermedio: [
        {
          title: "Fuerza OCR — Día de Jalar",
          focus: "Dominadas y tirones específicos de carrera",
          warmup: ["600 m trote", "Band pull-apart 15 reps", "Dislocaciones de hombro 10 reps"],
          main: [
            "Dominadas pronadas — 4 × 6-8 reps",
            "Dominadas supinas — 3 × 6 reps",
            "Remo barra o Pendlay — 4 × 8",
            "Farmer carry con KB 25 m — 4 series",
            "L-sit o dead hang + knee raise — 3 × 8",
          ],
          cooldown: ["Estiramiento dorsales y bíceps", "Rotaciones de hombro con banda"],
        },
        {
          title: "Potencia + Empuje",
          focus: "Fuerza explosiva para trepar y saltar",
          warmup: ["5 min remo suave", "10 saltos al cajón pequeño", "10 flexiones archer"],
          main: [
            "Press banca o press militar — 4 × 6",
            "Push press — 3 × 8",
            "Box jumps — 4 × 6",
            "Sandbag carry 30 m — 4 series",
            "Burpees con salto — 3 × 8",
          ],
          cooldown: ["Foam roller pecho y tríceps", "Estiramiento completo de cadera"],
        },
      ],
      avanzado: [
        {
          title: "Fuerza Máxima OCR",
          focus: "Pesos altos, calidad de movimiento",
          warmup: ["800 m trote", "10 kipping pull-ups suaves", "Movilidad hombros 5 min"],
          main: [
            "Dominadas lastradas — 5 × 5 reps",
            "Remo Pendlay pesado — 5 × 5",
            "Rope climb × 5 ascensos (o sustituto)",
            "Farmer carry pesado 40 m — 5 series",
            "Ring row explosivo — 3 × 8",
          ],
          cooldown: ["Estiramiento profundo espalda", "Movilidad de muñecas 3 min"],
        },
      ],
    },

    cardio: {
      principiante: [
        {
          title: "Carrera Continua Base",
          focus: "Construir base aeróbica sin lesiones",
          warmup: ["5 min caminata rápida", "Estiramientos dinámicos de cadera"],
          main: [
            "25-35 min carrera continua a ritmo conversacional (puedes hablar)",
            "Ritmo objetivo: zona 2 — 60-70% FC máx",
            "Terreno: llano o ligera pendiente",
          ],
          cooldown: ["5 min caminata", "Estiramiento de gemelos y cuádriceps"],
          note: "Si no puedes correr seguido, alterna 5 min corriendo / 2 min caminando.",
        },
        {
          title: "Intervals de Iniciación",
          focus: "Velocidad y adaptación cardiovascular",
          warmup: ["10 min trote suave", "Skipping y taloneo 2×30 m"],
          main: [
            "6 × 200 m a ritmo rápido-controlado",
            "Recuperación: 90 s caminando entre series",
            "Finalizar con 10 min trote suave",
          ],
          cooldown: ["Foam roller piernas", "Estiramiento completo 5 min"],
        },
      ],
      intermedio: [
        {
          title: "Tempo Run",
          focus: "Umbral anaeróbico — resistencia de carrera",
          warmup: ["15 min trote suave", "Aceleraciones graduales 3×100m"],
          main: [
            "20 min a ritmo tempo (80-85% FC máx — puedes hablar una frase)",
            "Alterna: 5 min intenso / 2 min suave × 4 series",
          ],
          cooldown: ["10 min trote suave", "Estiramiento completo"],
        },
        {
          title: "Trail con Obstáculos Naturales",
          focus: "Running en terreno irregular + obstáculos",
          warmup: ["10 min trote en llano"],
          main: [
            "40-50 min carrera en trail o parque con desnivel",
            "Cada 5 min: 10 sentadillas búlgaras o 5 saltos a pared/banco",
            "Incluye 3 series de sprint cuesta arriba × 30 m",
          ],
          cooldown: ["Estiramiento dinámico completo"],
          note: "Si no hay trail, parque con colinas o cinta inclinada sirve.",
        },
      ],
      avanzado: [
        {
          title: "Intervals de Alta Intensidad (HIIT OCR)",
          focus: "Velocidad y resistencia específica OCR",
          warmup: ["15 min trote progresivo"],
          main: [
            "10 × 400 m a ritmo 5K o más rápido",
            "Recuperación: 90 s trote suave",
            "Terminar con 2 km a ritmo moderado",
          ],
          cooldown: ["10 min trote", "Foam roller completo"],
        },
      ],
    },

    skill: {
      principiante: [
        {
          title: "Técnica de Obstáculos Básica",
          focus: "Aprende los movimientos fundamentales OCR",
          warmup: ["400 m trote", "10 flexiones", "10 sentadillas"],
          main: [
            "Práctica de reptado bajo obstáculos — 5 × 10 m",
            "Escalada de pared (baja / con ayuda) — 8-10 intentos",
            "Paso de barreras de altura media — 10 repeticiones",
            "Arrastre de peso / sandbag — 3 × 20 m",
            "Equilibrio en viga o bordillo — 3 × 20 m",
          ],
          cooldown: ["Movilidad de muñecas y tobillos"],
          note: "Si no tienes acceso a obstáculos reales, practica en un parque infantil o calistenia.",
        },
      ],
      intermedio: [
        {
          title: "Circuito Específico OCR",
          focus: "Combinación carrera + obstáculos en fatiga",
          warmup: ["1 km trote"],
          main: [
            "5 rondas de: 400 m sprint + 5 dominadas + 10 burpees + 20 m farmer carry",
            "Recuperación: 3 min entre rondas",
            "Tempo objetivo: mantener misma intensidad en cada ronda",
          ],
          cooldown: ["Estiramiento completo 10 min"],
          note: "Tiempo objetivo total: bajo 40 min.",
        },
      ],
      avanzado: [
        {
          title: "Simulación OCR Parcial",
          focus: "Simular condiciones de carrera real",
          warmup: ["2 km carrera suave"],
          main: [
            "4-5 km corriendo con obstáculos cada km:",
            "Km 1: 10 burpees + farmer carry 30 m",
            "Km 2: 6 dominadas + escalada pared",
            "Km 3: 20 m monkey bars o anillas",
            "Km 4: Sandbag carry 50 m + 10 box jumps",
            "Km 5: Sprint final + 5 dominadas",
          ],
          cooldown: ["Bañera de agua fría o duchas frías", "Foam roller y estiramientos"],
        },
      ],
    },

    recovery: {
      all: [
        {
          title: "Recuperación Activa",
          focus: "Acelerar la recuperación muscular",
          warmup: [],
          main: [
            "20-30 min caminata o ciclismo suave",
            "Yoga o movilidad completa — 20 min",
            "Foam roller piernas y espalda — 10 min",
          ],
          cooldown: [],
          note: "Si tienes agujetas fuertes, hoy no es día de descanso total: el movimiento suave ayuda.",
        },
      ],
    },
  },

  /* ══ HYROX ════════════════════════════════════════════════════════════ */
  hyrox: {
    strength: {
      principiante: [
        {
          title: "Fuerza Funcional HYROX I",
          focus: "Construye la base para empujar y tirar",
          warmup: ["5 min bicicleta o remo suave", "10 sentadillas goblet", "10 shoulder press sin peso"],
          main: [
            "Goblet squat KB/mancuerna — 3 × 12",
            "Press militar con mancuernas — 3 × 10",
            "Hip thrust — 3 × 15",
            "Remo con banda o TRX — 3 × 12",
            "Plancha lateral — 2 × 30 s por lado",
          ],
          cooldown: ["Estiramiento completo de cadera y hombros"],
        },
      ],
      intermedio: [
        {
          title: "Fuerza HYROX — Piernas y Empuje",
          focus: "Fuerza para sled push/pull y wall balls",
          warmup: ["10 min bicicleta", "2 × 10 sentadillas búlgaras"],
          main: [
            "Sentadilla frontal — 4 × 8",
            "Empuje de trineo (o peso en suelo) — 4 × 20 m",
            "Wall balls — 4 × 15 reps",
            "Estocadas andando con KB — 3 × 10 por pierna",
            "Good morning — 3 × 12",
          ],
          cooldown: ["Estiramientos de cuádriceps e isquios profundos"],
        },
      ],
      avanzado: [
        {
          title: "Fuerza + Resistencia HYROX",
          focus: "Alta densidad de trabajo para simular fatiga de carrera",
          warmup: ["1 km trote + 5 min remo"],
          main: [
            "Sled push 4 × 25 m (carga media-alta)",
            "Sled pull 4 × 25 m",
            "Wall balls 4 × 20 @ 6/9 kg",
            "Sandbag lunges 4 × 10 por pierna",
            "Farmer carry KB pesado 4 × 30 m",
          ],
          cooldown: ["Foam roller completo + movilidad de cadera"],
        },
      ],
    },

    cardio: {
      principiante: [
        {
          title: "Intervals de Carrera HYROX",
          focus: "Acostumbrarse a correr en fatiga",
          warmup: ["10 min trote suave"],
          main: [
            "5 × 1 km a ritmo moderado-fuerte",
            "Recuperación: 2 min caminando entre series",
            "Objetivo: mantener mismo ritmo en todas las series",
          ],
          cooldown: ["5 min trote suave + estiramiento"],
          note: "En HYROX correrás 8 km totales (1 km entre estaciones). Este entrenamiento simula esa demanda.",
        },
      ],
      intermedio: [
        {
          title: "Brick Run HYROX",
          focus: "Combinar esfuerzo funcional con carrera",
          warmup: ["10 min trote + 5 min remo suave"],
          main: [
            "4 rondas: 1 km a ritmo fuerte + 1 min de SkiErg/remo intenso",
            "O si no hay máquina: 1 km + 15 burpees",
            "Recuperación: 90 s entre rondas",
          ],
          cooldown: ["Estiramiento completo 10 min"],
        },
      ],
      avanzado: [
        {
          title: "Simulación Parcial HYROX",
          focus: "Entrenar el ritmo de carrera real de HYROX",
          warmup: ["2 km trote + activación dinámica"],
          main: [
            "4 × (1 km al ritmo objetivo de carrera + 1 estación HYROX al 80%)",
            "Estaciones rotativas: SkiErg → Remo → Wall Balls → Burpee Broad Jump",
            "Recuperación: 2 min entre rondas",
          ],
          cooldown: ["Baño frío o contraste + foam roller"],
        },
      ],
    },

    skill: {
      principiante: [
        {
          title: "Estaciones HYROX — Aprendizaje",
          focus: "Aprender la técnica de cada estación",
          warmup: ["800 m trote suave", "Activación dinámica 5 min"],
          main: [
            "SkiErg (o simulación con banda): técnica 3 × 1 min suave",
            "Sled push (o peso en carretilla): aprendizaje de postura, 5 × 10 m",
            "Rowing: técnica de remada 3 × 2 min",
            "Burpee broad jump: 3 × 8 reps con técnica correcta",
            "Wall balls: aprende el squat-throw, 3 × 10 @ 4-6 kg",
          ],
          cooldown: ["Movilidad de hombros y cadera"],
          note: "Hoy el objetivo es técnica, NO intensidad. Ve despacio y bien.",
        },
      ],
      intermedio: [
        {
          title: "Estaciones HYROX — Fuerza Específica",
          focus: "Aumentar eficiencia en cada estación",
          warmup: ["1 km trote + 5 min remo"],
          main: [
            "SkiErg: 3 × 3 min a ritmo medio",
            "Farmer carry: 4 × 25 m con carga objetiva (24/16 kg)",
            "Sandbag lunges: 4 × 10 m @ 10-20 kg",
            "Wall balls: 4 × 20 @ 6-9 kg",
            "Burpee broad jump: 4 × 10 reps",
          ],
          cooldown: ["Estiramiento completo + foam roller piernas"],
        },
      ],
      avanzado: [
        {
          title: "HYROX Completo (Mini-Race)",
          focus: "Simulación de carrera completa reducida",
          warmup: ["2 km trote + 5 min activación"],
          main: [
            "8 rondas de: 500 m carrera + 1 estación HYROX al 90%",
            "Estaciones en orden: SkiErg → Sled Push → Sled Pull → Burpee BJ → Remo → Farmer Carry → Sandbag Lunges → Wall Balls",
            "Objetivo: cronometrar y anotar tiempos por estación",
          ],
          cooldown: ["Recuperación completa: 20 min stretching"],
          note: "Usa la calculadora HYROX de la web para evaluar tu tiempo.",
        },
      ],
    },

    recovery: {
      all: [
        {
          title: "Movilidad HYROX",
          focus: "Prevención de lesiones y recuperación",
          warmup: [],
          main: [
            "15 min yoga o estiramientos dirigidos a hombros, cadera y rodillas",
            "Foam roller completo: piernas, espalda, glúteos — 15 min",
            "10 min caminata o ciclismo suavísimo",
          ],
          cooldown: [],
        },
      ],
    },
  },

  /* ══ CROSSFIT / OPEN ══════════════════════════════════════════════════ */
  crossfit: {
    strength: {
      principiante: [
        {
          title: "Fuerza Básica CrossFit",
          focus: "Técnica en los movimientos fundamentales",
          warmup: ["400 m trote", "PVC pass-through 10 reps", "10 sentadillas goblet"],
          main: [
            "Sentadilla trasera — técnica + 3 × 10 @ peso moderado",
            "Press strict — 3 × 8",
            "Peso muerto — 3 × 8 @ técnica perfecta",
            "Ring row / remo — 3 × 10",
          ],
          cooldown: ["Movilidad de tobillo y cadera profunda"],
          note: "Hoy el peso es secundario. La técnica lo es todo.",
        },
      ],
      intermedio: [
        {
          title: "Fuerza CrossFit — Ciclo 5/3/1",
          focus: "Progresión de fuerza maximal",
          warmup: ["10 min bicicleta + activación específica"],
          main: [
            "Sentadilla: 5×65%, 3×75%, 1+×85% de tu 1RM",
            "Press militar: 5×65%, 3×75%, 1+×85%",
            "Dominadas lastradas: 3 × 5-6 reps",
            "WOD accesorio: 3 rondas de 10 Knees-to-Elbows + 15 GHD sit-ups",
          ],
          cooldown: ["Estiramiento completo + movilidad de hombros"],
        },
      ],
      avanzado: [
        {
          title: "Fuerza Olímpica + Accesorio",
          focus: "Halterofilia y fuerza funcional",
          warmup: ["10 min remo + movilidad específica"],
          main: [
            "Power clean: trabajo hasta 90% × 3 reps",
            "Back squat pesado: 5 × 3",
            "Strict press: 5 × 3",
            "Metcon accesorio: 5 min AMRAP — 5 muscle-ups + 10 pistols",
          ],
          cooldown: ["Foam roller y movilidad de 15 min"],
        },
      ],
    },

    cardio: {
      principiante: [
        {
          title: "MetCon Iniciación",
          focus: "Tu primer WOD de metabolismo energético",
          warmup: ["5 min remo suave", "Círculos de cadera + hombros"],
          main: [
            "WOD: 3 rondas de —",
            "· 400 m carrera",
            "· 15 air squats",
            "· 10 flexiones",
            "· 10 sit-ups",
            "Tiempo objetivo: bajo 18-20 min",
          ],
          cooldown: ["Estiramiento completo 10 min"],
          note: "Si es demasiado, reduce las rondas a 2. Si es poco, añade una.",
        },
      ],
      intermedio: [
        {
          title: "Benchmark WOD",
          focus: "Tests estándar CrossFit para medir progreso",
          warmup: ["10 min bicicleta + activación dinámica"],
          main: [
            "\"Cindy\" (20 min AMRAP):",
            "· 5 Pull-ups",
            "· 10 Push-ups",
            "· 15 Air Squats",
            "Anota tus rondas completas. Objetivo intermedio: 12-18 rondas.",
          ],
          cooldown: ["Estiramiento completo + foam roller"],
        },
      ],
      avanzado: [
        {
          title: "MetCon de Alta Intensidad",
          focus: "Preparación para el Open",
          warmup: ["15 min activación progresiva"],
          main: [
            "\"Fran\": 21-15-9 de Thrusters (43/30 kg) y Pull-ups. Objetivo: sub 5 min.",
            "Descanso 10 min",
            "EMOM 10 min: 2 muscle-ups o 5 pull-ups C2B",
          ],
          cooldown: ["Recuperación completa: 20 min stretching"],
        },
      ],
    },

    skill: {
      principiante: [
        {
          title: "Habilidades Gimnásticas Básicas",
          focus: "Pull-ups, push-ups y core",
          warmup: ["400 m trote + círculos de brazos"],
          main: [
            "Kipping practice (en barra): 3 × 10 balanceos",
            "Dominadas negativas (baja lento 5 s): 3 × 5",
            "Handstand hold contra pared: 3 × 20 s",
            "Box dips: 3 × 12",
            "L-sit: 3 × 10-15 s",
          ],
          cooldown: ["Estiramiento de hombros y muñecas"],
        },
      ],
      intermedio: [
        {
          title: "Movimientos de Halterofilia",
          focus: "Clean, snatch y jerk con técnica",
          warmup: ["PVC work 10 min + power snatch ligero"],
          main: [
            "Power snatch: build to 80% × 3 reps (3 series)",
            "Hang clean: 4 × 3 @ 75%",
            "Push jerk: 4 × 4 @ 75%",
            "EMOM 8 min: 2 clean & jerk @ 65%",
          ],
          cooldown: ["Movilidad de hombros y tobillo profunda"],
        },
      ],
      avanzado: [
        {
          title: "Competición Open — Skills Avanzadas",
          focus: "Movimientos del Open: muscle-ups, DU, C2B",
          warmup: ["15 min activación progresiva"],
          main: [
            "Ring muscle-ups: 5 × 3 (o bar MU alternativo)",
            "Double-unders: 5 × 50 sin pausa",
            "Chest-to-bar pull-ups: 4 × 8",
            "TTB (toes-to-bar): 4 × 10",
            "HSPU kipping: 3 × max reps",
          ],
          cooldown: ["Estiramientos de hombros y cadera"],
        },
      ],
    },

    recovery: {
      all: [
        {
          title: "Movilidad + Recuperación",
          focus: "Mantener rango de movimiento y recuperarse",
          warmup: [],
          main: [
            "Shoulder CARS (Controlled Articular Rotations): 3 × 10 por lado",
            "Hip 90/90 stretch: 2 min por lado",
            "Pigeon pose: 90 s por lado",
            "Foam roller: cuádriceps, isquios, IT band",
            "20 min yoga o movilidad en vídeo",
          ],
          cooldown: [],
        },
      ],
    },
  },

  /* ══ GENERAL FUNCIONAL ════════════════════════════════════════════════ */
  general: {
    strength: {
      principiante: [
        {
          title: "Fuerza Funcional Total",
          focus: "Los movimientos básicos del fitness funcional",
          warmup: ["5 min bicicleta o caminata rápida", "10 sentadillas + 10 flexiones + 10 abdominales"],
          main: [
            "Sentadilla con peso corporal o goblet — 3 × 12",
            "Flexiones (adaptadas a tu nivel) — 3 × 8-15",
            "Remo con banda — 3 × 12",
            "Peso muerto con mancuernas — 3 × 10",
            "Plancha — 3 × 25-40 s",
          ],
          cooldown: ["Estiramiento completo 5 min"],
          note: "Elige el peso con el que puedes hacer todos los reps con buena técnica.",
        },
      ],
      intermedio: [
        {
          title: "Circuito Funcional Intermedio",
          focus: "Fuerza y resistencia combinadas",
          warmup: ["10 min bicicleta"],
          main: [
            "4 rondas de circuito (sin descanso entre ejercicios):",
            "· 10 KB swings",
            "· 8 press militar",
            "· 10 goblet squat",
            "· 8 remo KB",
            "· 6 burpees",
            "Descansa 2 min entre rondas",
          ],
          cooldown: ["Foam roller y estiramientos"],
        },
      ],
      avanzado: [
        {
          title: "Fuerza + Potencia",
          focus: "Fuerza máxima y potencia explosiva",
          warmup: ["10 min activación progresiva"],
          main: [
            "Back squat pesado: 5 × 5",
            "Deadlift: 4 × 4",
            "Weighted pull-ups: 4 × 5",
            "Box jumps: 4 × 6",
            "Farmers carry pesado: 4 × 30 m",
          ],
          cooldown: ["Movilidad completa 15 min"],
        },
      ],
    },

    cardio: {
      principiante: [
        {
          title: "Cardio Suave",
          focus: "Base aeróbica sin impacto",
          warmup: ["Estiramientos dinámicos 5 min"],
          main: [
            "30-40 min de cardio a elección: bicicleta, caminata rápida, elíptica, natación",
            "Intensidad: zona 2 — puedes hablar sin problema",
          ],
          cooldown: ["Estiramiento completo"],
        },
      ],
      intermedio: [
        {
          title: "Intervalos Funcionales",
          focus: "Mejorar potencia aeróbica",
          warmup: ["10 min cardio suave"],
          main: [
            "8 × 30 s al máximo + 90 s recuperación",
            "Elige: sprint, bicicleta, remo o SkiErg",
            "Finaliza con 10 min cardio suave",
          ],
          cooldown: ["Estiramientos 10 min"],
        },
      ],
      avanzado: [
        {
          title: "Resistencia + Potencia",
          focus: "Capacidad aeróbica avanzada",
          warmup: ["15 min cardio progresivo"],
          main: [
            "3 km tempo (85% FC máx) + 5 min descanso",
            "6 × 400 m sprint con 1 min recuperación",
          ],
          cooldown: ["Trote 10 min + estiramientos"],
        },
      ],
    },

    skill: {
      principiante: [
        {
          title: "Coordinación y Movilidad",
          focus: "Mejorar el control corporal",
          warmup: ["5 min caminata"],
          main: [
            "Comba o saltar sin comba — 3 × 2 min",
            "Equilibrio unipodal — 3 × 30 s por pierna",
            "Bear crawl — 3 × 10 m",
            "Rueda de movilidad o yoga 20 min",
          ],
          cooldown: ["Estiramiento suave"],
        },
      ],
      intermedio: [
        {
          title: "Skills Funcionales",
          focus: "Movimientos atléticos variados",
          warmup: ["10 min activación"],
          main: [
            "Double-unders o jump rope avanzada: 5 × 30 s",
            "Handstand hold: 5 × 15-20 s",
            "Pistol squat progresión: 3 × 5 por pierna",
            "Turkish get-up: 3 × 3 por lado",
          ],
          cooldown: ["Movilidad 10 min"],
        },
      ],
      avanzado: [
        {
          title: "Entrenamiento Atlético Completo",
          focus: "Trabajo de alta habilidad motora",
          warmup: ["15 min activación"],
          main: [
            "Sprint technique: 6 × 40 m con foco técnico",
            "Plyometría: 4 × 6 depth jumps",
            "Agilidad: 5 × T-test o ladder drill",
          ],
          cooldown: ["Foam roller + estiramiento completo"],
        },
      ],
    },

    recovery: {
      all: [
        {
          title: "Descanso Activo",
          focus: "Regeneración y bienestar",
          warmup: [],
          main: [
            "20-30 min paseo o ciclismo muy suave",
            "15 min yoga o stretching dirigido",
            "Baño de contraste si es posible",
          ],
          cooldown: [],
        },
      ],
    },
  },
};

/* ─── PLAN GENERATOR ──────────────────────────────────────────────────── */

function getSession(objective, type, level) {
  const objKey = objective.startsWith("ocr") ? "ocr" : objective;
  const lib = LIB[objKey] || LIB.general;
  const typeLib = lib[type] || lib.strength;
  const levelLib = typeLib[level] || typeLib.principiante || typeLib.all || [];
  // rotate through available sessions
  return levelLib;
}

function getRecovery(objective) {
  const objKey = objective.startsWith("ocr") ? "ocr" : objective;
  const lib = LIB[objKey] || LIB.general;
  return (lib.recovery?.all || LIB.general.recovery.all)[0];
}

// Intensity multipliers per phase
const PHASE_VOL = { base: 0.7, desarrollo: 0.85, intensidad: 1.0, descarga: 0.55, mantenimiento: 0.8 };

function buildDaySchedule(objective, level, daysPerWeek, phase, sessionPool) {
  // Assign session types based on days and phase
  const dayPlans = [];
  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Templates per days/week
  const templates = {
    3: ["strength", "rest", "cardio", "rest", "skill", "rest", "rest"],
    4: ["strength", "cardio", "rest", "skill", "strength", "rest", "rest"],
    5: ["strength", "cardio", "skill", "strength", "cardio", "rest", "rest"],
    6: ["strength", "cardio", "skill", "strength", "cardio", "mixed", "rest"],
  };

  const template = templates[Math.min(6, Math.max(3, daysPerWeek))];

  const counters = { strength: 0, cardio: 0, skill: 0, mixed: 0 };

  weekDays.forEach((day, i) => {
    const type = template[i];
    if (type === "rest") {
      dayPlans.push({ day, type: "rest", session: { title: "Descanso", focus: "Recuperación total", main: ["Prioriza el sueño (7-9 h)", "Alimentación adecuada", "Hidratación y movilidad suave si apetece"], warmup: [], cooldown: [] } });
      return;
    }

    const sessions = getSession(objective, type === "mixed" ? "skill" : type, level);
    const session = sessions[counters[type] % sessions.length] || sessions[0];
    counters[type]++;

    dayPlans.push({ day, type, session: { ...session } });
  });

  return dayPlans;
}

export function generatePlan(answers) {
  const { objective, level, daysPerWeek, horizon, equipment, weaknesses } = answers;
  const weeks = horizon?.weeks || 8;

  // Determine phases
  let phases;
  if (weeks <= 4) {
    phases = [
      { start: 1, end: 2, phase: "base" },
      { start: 3, end: weeks - 1, phase: "intensidad" },
      { start: weeks, end: weeks, phase: "descarga" },
    ];
  } else if (weeks <= 8) {
    phases = [
      { start: 1, end: 2, phase: "base" },
      { start: 3, end: 5, phase: "desarrollo" },
      { start: 6, end: 7, phase: "intensidad" },
      { start: 8, end: 8, phase: "descarga" },
    ];
  } else if (weeks <= 12) {
    phases = [
      { start: 1, end: 3, phase: "base" },
      { start: 4, end: 7, phase: "desarrollo" },
      { start: 8, end: 10, phase: "intensidad" },
      { start: 11, end: 11, phase: "descarga" },
      { start: 12, end: 12, phase: "descarga" },
    ];
  } else {
    phases = [
      { start: 1, end: 4, phase: "base" },
      { start: 5, end: 8, phase: "desarrollo" },
      { start: 9, end: 12, phase: "desarrollo" },
      { start: 13, end: 15, phase: "intensidad" },
      { start: 16, end: 16, phase: "descarga" },
    ];
  }

  function getPhase(weekNum) {
    for (const p of phases) {
      if (weekNum >= p.start && weekNum <= p.end) return p.phase;
    }
    return "base";
  }

  // Week tips personalised by weaknesses
  const weaknessTips = {
    strength:  "Esta semana, enfócate en añadir 2,5-5 kg a tus ejercicios de fuerza principal.",
    endurance: "Añade 5-10 min a tus sesiones de cardio o aumenta 1 km en tu carrera larga.",
    speed:     "En la carrera de hoy, incluye 4-6 aceleraciones de 60-80 m al final del calentamiento.",
    obstacles: "Busca practicar al menos 1 obstáculo nuevo o aumenta la dificultad del que ya haces.",
    mobility:  "Haz 10 min de movilidad de cadera y hombros antes de dormir cada noche esta semana.",
    power:     "Antes de tu sesión principal, haz 3×5 saltos al cajón como activación neurológica.",
  };

  const activeTips = weaknesses?.length
    ? weaknesses.map((w) => weaknessTips[w]).filter(Boolean)
    : [];

  const objectiveNames = {
    ocr_sprint: "OCR Sprint", ocr_pro: "OCR Pro", ocr_ultra: "OCR Ultra",
    hyrox: "HYROX", crossfit: "CrossFit Open", general: "Fitness Funcional",
  };

  const levelNames = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };

  const plan = {
    title: `Plan ${objectiveNames[objective] || objective} — ${weeks} Semanas`,
    subtitle: `Nivel ${levelNames[level] || level} · ${daysPerWeek} días/semana`,
    objective,
    level,
    daysPerWeek,
    weeks: [],
  };

  for (let w = 1; w <= weeks; w++) {
    const phase = getPhase(w);
    const phaseMeta = PHASE_META[phase];
    const days = buildDaySchedule(objective, level, daysPerWeek, phase, null);

    const isLastWeek = w === weeks;
    const weekTip = activeTips.length ? activeTips[(w - 1) % activeTips.length] : phaseMeta.desc;

    plan.weeks.push({
      number: w,
      phase,
      phaseLabel: phaseMeta.label,
      phaseColor: phaseMeta.color,
      tip: isLastWeek ? "Semana de carrera: descansa bien, hidratación óptima, no entrenes fuerte." : weekTip,
      days,
    });
  }

  return plan;
}
