import Head from "next/head";
import { SiteFooter, CookieBanner, SiteNav } from "../lib/shared";

const PROGRAMS = [
  { title: "HYROX Foundations", anchor: "hyrox-foundations", text: "Base de entrenamiento para principiantes: técnica, resistencia y consistencia.", detail: "Base de entrenamiento para principiantes: técnica, resistencia y consistencia. Incluye micro-bloques semanales y pruebas de progreso." },
  { title: "Plan de 6 Semanas", anchor: "plan-6-semanas",   text: "Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo.", detail: "Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo. Enfoque en mejorar tiempos y consistencia." },
  { title: "Guías de Preparación", anchor: "guias-preparacion", text: "Estrategias de pacing, recuperación y nutrición para competición HYROX.", detail: "Guías de pacing, recuperación y nutrición para competición HYROX. Incluye ejemplos de plan de entrenamiento y test de umbral." },
  { title: "HYROX Avanzado",    anchor: "hyrox-avanzado",   text: "Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia.", detail: "Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia. Fases de carga y descarga para picos." },
  { title: "HYROX Endurance",   anchor: "hyrox-endurance",  text: "Sesiones de resistencia larga y bloques de aerobic capacity.", detail: "Sesiones de resistencia larga y bloques de capacidad aeróbica para sostener ritmo en distancias largas." },
];

export default function RaceHub() {
  return (
    <>
      <Head>
        <title>Programas HYROX — Hybrid Race Hub</title>
        <meta name="description" content="Programas de entrenamiento HYROX estructurados: desde fundamentos hasta nivel avanzado. Guías de pacing, bloques de fuerza y planes de competición en España." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/race-hub" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/race-hub" />
        <meta property="og:title" content="Programas HYROX — Hybrid Race Hub" />
        <meta property="og:description" content="Programas de entrenamiento HYROX estructurados: desde fundamentos hasta nivel avanzado." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
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
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>{p.title}</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{p.detail}</p>
          </section>
        ))}
      </main>

      <SiteFooter />
      <CookieBanner />
    </>
  );
}
