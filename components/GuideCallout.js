/* Enlace contextual a la guía pilar (artículos y rankings). */
export default function GuideCallout({ context = "default" }) {
  const lead = context === "ranking"
    ? "¿Aún no sabes qué carrera vas a hacer? Antes de comprar material, mira qué pide cada formato."
    : "¿Es tu primera carrera híbrida? Aquí tienes los formatos, las 8 estaciones de HYROX y cómo prepararte.";
  return (
    <aside className="guide-callout">
      <p className="section-label">GUÍA</p>
      <p className="guide-callout-text">{lead}</p>
      <a href="/que-es-una-carrera-hibrida" className="step-link">Qué es una carrera híbrida →</a>
      <ul className="guide-callout-more">
        {context === "ranking" ? (
          <>
            <li><a href="/blog/material-hyrox-carreras-obstaculos">Material para HYROX y OCR: lo que de verdad necesitas</a></li>
            <li><a href="/blog/que-es-hyrox">Qué es HYROX: estaciones y pesos oficiales</a></li>
          </>
        ) : (
          <>
            <li><a href="/blog/carreras-hibridas-principiantes-primera-prueba">Cómo elegir tu primera carrera híbrida</a></li>
            <li><a href="/blog/plan-entrenamiento-hyrox-12-semanas">Plan de entrenamiento HYROX de 12 semanas</a></li>
          </>
        )}
      </ul>
    </aside>
  );
}
