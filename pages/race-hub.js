import Head from "next/head";
import { SiteFooter, CookieBanner, SiteNav } from "../lib/shared";

import { SITE_URL } from "../lib/site";
const PROGRAMS = [
  {
    title: "HYROX Foundations",
    anchor: "hyrox-foundations",
    text: "Base de entrenamiento para principiantes: técnica, resistencia y consistencia.",
    detail: "Base de entrenamiento para principiantes: técnica, resistencia y consistencia. Incluye micro-bloques semanales y pruebas de progreso.",
    body: [
      "HYROX Foundations es el punto de partida ideal si vas a debutar en una competición HYROX o vienes del running/CrossFit sin experiencia específica. El bloque se construye alrededor de tres pilares: técnica correcta en las ocho estaciones (SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, RowErg, Farmers Carry, Sandbag Lunges y Wall Balls), resistencia aeróbica de base y consistencia semanal.",
      "El programa está diseñado para 6 a 8 semanas con 3-4 sesiones semanales de 45-60 minutos: dos días de fuerza básica (sentadilla, peso muerto, remo, press), un día de running Z2 (40-50 min a ritmo conversacional) y una sesión mixta con dos estaciones técnicas. Cada dos semanas se realiza una prueba de progreso (por ejemplo, 4 rondas de 500m remo + 20 wall balls) para calibrar el ritmo objetivo en carrera y evitar lesiones por sobrecarga.",
      "Al terminar el bloque tendrás la técnica limpia en todas las estaciones, un umbral aeróbico suficiente para completar los 8x1km sin colapsar y las bases para saltar al Plan de 6 Semanas o directamente a competición de nivel introductorio.",
    ],
  },
  {
    title: "Plan de 6 Semanas",
    anchor: "plan-6-semanas",
    text: "Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo.",
    detail: "Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo. Enfoque en mejorar tiempos y consistencia.",
    body: [
      "El Plan de 6 Semanas es la preparación estándar para atletas intermedios que ya han completado un HYROX y quieren bajar su marca. Estructura clásica de bloques: dos semanas de acumulación con volumen alto y peso moderado, dos semanas de intensificación con menos volumen y más carga (85-90% RM en fuerza principal), una semana de peak y una semana de descarga previa al evento.",
      "Cada semana incluye 4-5 sesiones: dos entrenamientos de fuerza (empuje/tirón + tren inferior) con progresión lineal, dos sesiones específicas HYROX simulando bloques de 4 estaciones + running a ritmo objetivo, y un rodaje largo de 60-80 minutos para consolidar base aeróbica. A mitad del ciclo se realiza un test de umbral (5km cronometrado + 100 wall balls) que sirve para recalibrar ritmos.",
      "Este programa asume acceso a box con SkiErg, RowErg, sled y wall ball. Si entrenas en gimnasio estándar, usa sustitutos como assault bike, kettlebell swings pesados y goblet squats. La consistencia manda: perder más de dos sesiones por semana rompe la progresión.",
    ],
  },
  {
    title: "Guías de Preparación",
    anchor: "guias-preparacion",
    text: "Estrategias de pacing, recuperación y nutrición para competición HYROX.",
    detail: "Guías de pacing, recuperación y nutrición para competición HYROX. Incluye ejemplos de plan de entrenamiento y test de umbral.",
    body: [
      "Las guías cubren los tres factores que más impactan tu marca el día de la carrera fuera del entrenamiento puro: pacing, nutrición y recuperación. En pacing la regla básica es salir un 5-10% más lento del ritmo objetivo en los primeros 1000m, gestionar el sled push/pull sin ir a fallo (parar a los 15m y respirar 3s es más rápido que colapsar) y guardar reservas para los wall balls finales, donde se pierde más tiempo relativo.",
      "En nutrición: hidratos altos las 48h previas (7-10 g/kg), última comida sólida 3 horas antes con 100-120 g de carbohidratos de bajo residuo, y 30-60 g de gel o bebida isotónica 20 minutos antes de salir. Durante la carrera solo agua y, si superas los 80 minutos, un gel a la mitad. Cafeína 3 mg/kg 45 minutos antes tiene evidencia sólida.",
      "En recuperación pre-competición: dormir 8h las dos noches previas (la crítica es la penúltima), descarga real la semana previa (–40% volumen, mantener intensidad puntual), y un rodaje de activación 15 min el día antes con 3 aceleraciones cortas. Evita masajes profundos, saunas prolongadas o cualquier estímulo nuevo en los 5 días previos.",
    ],
  },
  {
    title: "HYROX Avanzado",
    anchor: "hyrox-avanzado",
    text: "Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia.",
    detail: "Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia. Fases de carga y descarga para picos.",
    body: [
      "HYROX Avanzado está dirigido a atletas con marca sub-70 min individual masculino o sub-80 min femenino que buscan competir por podium en su categoría. El programa trabaja con periodización ondulante en microciclos de 3 semanas de carga + 1 de descarga, con dos sesiones diarias en los picos: mañana de calidad (VO2max, series cortas de sled o umbral) y tarde de fuerza específica o técnica.",
      "El foco en velocidad incluye bloques de 8x400m a ritmo mejor que carrera con descanso 90s, series 4x1000m a ritmo objetivo con 200m de recuperación activa, y trabajo pliométrico (box jumps 4x5, saltos horizontales) para transferir potencia a los burpee broad jumps. La fuerza mantiene barras principales al 80-90% para preservar economía sin sacrificar velocidad.",
      "Se incluyen simulacros completos cada 3 semanas: HYROX real cronometrado en formato de entrenamiento (sin descanso entre estaciones) con analítica post-sesión de tiempo por segmento. El objetivo es identificar la estación limitante y dedicarle una sesión semanal específica hasta cerrar la brecha.",
    ],
  },
  {
    title: "HYROX Endurance",
    anchor: "hyrox-endurance",
    text: "Sesiones de resistencia larga y bloques de aerobic capacity.",
    detail: "Sesiones de resistencia larga y bloques de capacidad aeróbica para sostener ritmo en distancias largas.",
    body: [
      "HYROX Endurance está diseñado para atletas con perfil de resistencia (fondistas, triatletas, ultra-runners) que quieren competir en formato doble HYROX, relays largos o simplemente elevar su umbral aeróbico como base para todos los demás programas. El bloque tiene una duración recomendada de 8 a 12 semanas.",
      "La estructura semanal se apoya en el 80/20 clásico del endurance: cuatro sesiones a intensidad baja (Zona 2, 60-80 min corriendo o remando) y una-dos sesiones de umbral o VO2max (por ejemplo, 6x5 min al 95% FCM con 2 min de trote). Un día largo semanal de 90-120 min alterna running con estaciones aeróbicas (SkiErg, remo) para adaptar la musculatura implicada en HYROX real.",
      "El objetivo métrico es mover el umbral ventilatorio al menos 8-10% arriba en 8 semanas, medido con test de campo (30 min a máximo esfuerzo controlado en pista o remo). Este programa combina especialmente bien con Foundations como base previa al Plan de 6 Semanas si tu punto débil es la capacidad aeróbica.",
    ],
  },
];

export default function RaceHub() {
  return (
    <>
      <Head>
        <title>Plan de Entrenamiento HYROX — Programas Fundamentos a Elite | Hybrid Race Hub</title>
        <meta name="description" content="5 programas de entrenamiento HYROX estructurados: desde fundamentos hasta nivel avanzado. Guías de pacing, bloques de fuerza y planes de competición para España 2026." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/race-hub`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/race-hub`} />
        <meta property="og:title" content="Plan de Entrenamiento HYROX — Programas Fundamentos a Elite | Hybrid Race Hub" />
        <meta property="og:description" content="5 programas de entrenamiento HYROX estructurados: desde fundamentos hasta nivel avanzado. Guías de pacing, bloques de fuerza y planes de competición." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Programas de Entrenamiento HYROX",
            "description": "Programas estructurados de entrenamiento HYROX para todos los niveles",
            "url": `${SITE_URL}/race-hub`,
            "numberOfItems": PROGRAMS.length,
            "itemListElement": PROGRAMS.map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": p.title,
              "description": p.detail,
              "url": `${SITE_URL}/race-hub#${p.anchor}`,
            })),
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Cómo prepararse para HYROX: Plan de entrenamiento completo",
            "description": "Guía paso a paso para preparar una competición HYROX, desde fundamentos hasta nivel avanzado",
            "totalTime": "P12W",
            "step": PROGRAMS.map((p, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "name": p.title,
              "text": (p.body && p.body[0]) || p.detail,
              "url": `${SITE_URL}/race-hub#${p.anchor}`,
            })),
          })}}
        />
      </Head>

      <header className="hero" style={{ paddingBottom: "1rem" }}>
        <div className="hero-inner">
          <div className="brand">
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div className="brand-logo">H</div>
              <div>
                <div className="brand-name">Hybrid Race Hub</div>
                <div className="brand-sub"><span>OCR · HYROX · Functional</span></div>
              </div>
            </a>
          </div>
          <SiteNav activePath="/race-hub" />
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
        <section id="training-programs" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Programas HYROX
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Entrenamiento estructurado para HYROX, desde fundamentos hasta planes de competición.
            Selecciona un programa y empieza a entrenar con guías y bloques de ejercicios diseñados para mejorar tu rendimiento.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
            {PROGRAMS.map((p) => (
              <article key={p.anchor} style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
                <a href={`#${p.anchor}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, textTransform: "uppercase", color: "var(--text)" }}>{p.title}</div>
                </a>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{p.text}</p>
                <a href={`#${p.anchor}`} className="btn-primary" style={{ display: "inline-flex", marginTop: 4, fontSize: 12, padding: "8px 16px" }}>Detalles</a>
              </article>
            ))}
          </div>
        </section>

        {PROGRAMS.map((p) => (
          <section key={p.anchor} id={p.anchor} style={{ padding: "2rem 0", borderTop: "0.5px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{p.title}</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1rem" }}>{p.detail}</p>
            {p.body && p.body.map((para, i) => (
              <p key={i} style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.9rem", fontSize: 15 }}>{para}</p>
            ))}
          </section>
        ))}
      </main>

      <SiteFooter />
      <CookieBanner />
    </>
  );
}
