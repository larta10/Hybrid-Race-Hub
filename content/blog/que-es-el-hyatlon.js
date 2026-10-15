// Guía: Hyatlón. Datos verificados el 15-10-2026 en hyatlon.org (formatos, modalidades, sedes)
// y en triatlon.org (aprobación por la FETRI y papel de World Triathlon).
export default {
  slug: "que-es-el-hyatlon",
  title: "Qué es el Hyatlón: formatos H6 y H8, estaciones y calendario",
  metaTitle: "Qué es el Hyatlón: formatos H6 y H8, estaciones, diferencias con HYROX y calendario",
  h1: "Qué es el Hyatlón: formatos H6 y H8, estaciones y próximas pruebas",
  category: "Carreras",
  date: "2026-10-15",
  updated: "2026-10-15",
  // Bloque dinámico de próximas pruebas (Supabase)
  racesFilter: { modalidadId: "func-hyatlon", name: "hyatl[oó]n" },
  excerpt: "El Hyatlón es la carrera híbrida oficial de la Federación Española de Triatlón: tramos de 1 km de carrera alternados con estaciones funcionales, en dos formatos, H6 y H8. Te explicamos estaciones, modalidades, diferencias con HYROX y próximas pruebas.",
  description: "Qué es el Hyatlón, la carrera híbrida oficial de la FETRI: formatos H6 y H8 con sus estaciones, modalidades (individual, dobles, relevos y ParaHyatlón), diferencias con HYROX y próximas pruebas en España.",
  faq: [
    { q: "¿Qué es el Hyatlón?", a: "Es una modalidad de carrera híbrida de la Federación Española de Triatlón (FETRI) que alterna tramos de 1 km de carrera con estaciones de ejercicio funcional, en recinto cerrado. Tiene dos formatos: H6, con 6 estaciones, y H8, con 8." },
    { q: "¿Quién organiza el Hyatlón?", a: "La FETRI, que lo aprobó como nueva especialidad en marzo de 2026 tras una Asamblea General Extraordinaria y lo desarrolla junto a World Triathlon. La web oficial es hyatlon.org." },
    { q: "¿En qué se diferencia el Hyatlón de HYROX?", a: "El H8 usa las mismas ocho estaciones que HYROX y en el mismo orden. La diferencia está en quién lo organiza (una federación deportiva frente a una empresa privada), en que existe el formato corto H6 y en que hay modalidad ParaHyatlón para deportistas con discapacidad." },
    { q: "¿Qué estaciones tiene el H6?", a: "SkiErg 1.000 m, sled push 50 m, burpee broad jump 80 m, remo 1.000 m, zancadas con saco 100 m y 100 wall balls, cada una después de 1 km de carrera, más un tramo final de carrera hasta meta." },
    { q: "¿Puedo hacer Hyatlón si nunca he hecho HYROX?", a: "Sí. El H6 es un buen formato para debutar: tiene dos estaciones y dos kilómetros menos que el H8. Hay modalidad individual, dobles y relevos." },
  ],
  content: `
<p><strong>El Hyatlón es la carrera híbrida oficial de la Federación Española de Triatlón (FETRI): alternas tramos de 1 km de carrera con estaciones de ejercicio funcional (SkiErg, trineo, burpees, remo, zancadas, wall balls) en un recinto cerrado.</strong> Tiene dos formatos: el <strong>H6</strong>, con 6 estaciones, y el <strong>H8</strong>, con 8. Se compite en individual, dobles, relevos y ParaHyatlón, y en 2026 se ha estrenado con un circuito de cuatro sedes en España.</p>

<p>Si vienes de HYROX, el H8 te va a resultar muy familiar. Si no has hecho nunca una carrera híbrida, el H6 es una puerta de entrada más corta. Abajo tienes el origen, los formatos con sus estaciones, las diferencias con HYROX y las próximas pruebas, sacadas de nuestro calendario. Si quieres el contexto general de estas pruebas, empieza por la <a href="/que-es-una-carrera-hibrida">guía de carreras híbridas</a>.</p>

<h2>¿De dónde sale el Hyatlón?</h2>
<p>La FETRI aprobó el Hyatlón como nueva especialidad deportiva en marzo de 2026, tras una Asamblea General Extraordinaria, según anunció la propia federación en su web (<a href="https://triatlon.org/noticias/el-triatlon-rompe-sus-limites-la-fetri-lanza-el-hyatlon-la-nueva-disciplina-que-conecta-resistencia-y-fitness/" target="_blank" rel="noopener">triatlon.org</a>). La disciplina se desarrolla junto a World Triathlon: su presidente, Antonio Arimany, explicó en ese anuncio que se desarrollará en España conforme a la normativa de World Triathlon y de HYROX. Hoy la web oficial, <a href="https://hyatlon.org/" target="_blank" rel="noopener">hyatlon.org</a>, la presenta como el deporte híbrido oficial de la Federación Española de Triatlón.</p>
<p>Que lo organice una federación tiene consecuencias prácticas: un reglamento técnico propio, un calendario oficial y una vía para que los clubes de triatlón, muy extendidos por toda España, se sumen a las carreras híbridas.</p>

<h2>¿Cómo son los formatos H6 y H8?</h2>
<p>Los dos siguen la misma lógica: 1 km de carrera, una estación, y así hasta completar todas, con un último tramo de carrera hasta meta. Estas son las estaciones que publica la web oficial:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Orden</th><th>H6 (6 estaciones)</th><th>H8 (8 estaciones)</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SkiErg 1.000 m</td><td>SkiErg 1.000 m</td></tr>
    <tr><td>2</td><td>Sled push 50 m</td><td>Sled push 50 m</td></tr>
    <tr><td>3</td><td>Burpee broad jump 80 m</td><td>Sled pull 50 m</td></tr>
    <tr><td>4</td><td>Remo 1.000 m</td><td>Burpee broad jump 80 m</td></tr>
    <tr><td>5</td><td>Sandbag lunges 100 m</td><td>Remo 1.000 m</td></tr>
    <tr><td>6</td><td>Wall balls 100 repeticiones</td><td>Farmers carry 200 m</td></tr>
    <tr><td>7</td><td></td><td>Sandbag lunges 100 m</td></tr>
    <tr><td>8</td><td></td><td>Wall balls 100 repeticiones</td></tr>
    <tr><td>Carrera</td><td>6 tramos de 1 km + tramo final</td><td>8 tramos de 1 km + tramo final</td></tr>
  </tbody>
</table></div>
<p>El H6 quita el sled pull y el farmers carry y dos kilómetros de carrera. Los pesos de cada estación dependen de la categoría y se publican en la pestaña de categorías de cada prueba en hyatlon.org; revísalos antes de entrenar con carga.</p>

<h2>¿Qué modalidades hay?</h2>
<ul>
  <li><strong>Individual:</strong> recorres todo el formato tú solo.</li>
  <li><strong>Dobles:</strong> por parejas, compitiendo juntos durante todo el recorrido.</li>
  <li><strong>Relevos:</strong> por equipos, pensada para clubes, gimnasios, empresas o grupos de amigos.</li>
  <li><strong>ParaHyatlón:</strong> modalidad inclusiva para deportistas con discapacidad.</li>
</ul>
<p>En las pruebas de 2026 la individual se disputa el sábado y los dobles y relevos el domingo.</p>

<h2>Hyatlón frente a HYROX</h2>
<div class="table-wrap"><table>
  <thead><tr><th></th><th>Hyatlón</th><th>HYROX</th></tr></thead>
  <tbody>
    <tr><td>Quién lo organiza</td><td>Federación Española de Triatlón, con World Triathlon</td><td>Empresa privada con licencias por país</td></tr>
    <tr><td>Formatos</td><td>H6 (6 estaciones) y H8 (8 estaciones)</td><td>Un único formato de 8 estaciones</td></tr>
    <tr><td>Estaciones</td><td>Las mismas que HYROX en el H8; el H6 quita sled pull y farmers carry</td><td>SkiErg, sled push, sled pull, burpees, remo, farmers carry, zancadas, wall balls</td></tr>
    <tr><td>Carrera</td><td>Tramos de 1 km y un tramo final hasta meta</td><td>8 tramos de 1 km</td></tr>
    <tr><td>Modalidades</td><td>Individual, dobles, relevos y ParaHyatlón</td><td>Open, Pro, Doubles y Relay</td></tr>
    <tr><td>Dónde</td><td>Recintos cerrados</td><td>Pabellones y recintos feriales</td></tr>
    <tr><td>Sedes en España</td><td>Circuito propio desde 2026</td><td>Varias por temporada (Valencia, Barcelona, Bilbao, Madrid, Málaga en la 2026/27)</td></tr>
  </tbody>
</table></div>
<p>Si quieres el detalle de HYROX, con pesos oficiales y cómo inscribirte, lo tienes en <a href="/blog/que-es-hyrox">qué es HYROX</a>. Y si te interesa otro circuito híbrido español, mira <a href="/blog/que-es-hurbax">qué es HURBAX</a>, que se corre al aire libre con 5 km y 5 estaciones.</p>

<h2>¿Dónde se ha celebrado y dónde viene?</h2>
<p>El primer circuito de Hyatlón ha tenido cuatro sedes en 2026, todas anunciadas en la web oficial:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Sede</th><th>Fechas</th><th>Formato</th><th>Recinto</th></tr></thead>
  <tbody>
    <tr><td>Madrid</td><td>10 de octubre de 2026</td><td>H6</td><td>Centro Deportivo Municipal Gallur</td></tr>
    <tr><td>La Nucía (Alicante)</td><td>24 y 25 de octubre de 2026</td><td>H6</td><td>La Nucía Combat Sports Center</td></tr>
    <tr><td>Las Palmas de Gran Canaria</td><td>14 y 15 de noviembre de 2026</td><td>H6</td><td>Plaza de la Música - ExpoDeca</td></tr>
    <tr><td>Zaragoza</td><td>28 y 29 de noviembre de 2026</td><td>H8</td><td>Pabellón 4, Feria de Zaragoza</td></tr>
  </tbody>
</table></div>
<p>Zaragoza cierra la temporada 2026 con el formato completo H8. Cuando se anuncie el calendario de 2027 lo añadiremos al <a href="/calendario?modalidad=func-hyatlon">calendario filtrado por Hyatlón</a>. Mientras tanto, tienes carreras híbridas cerca de algunas sedes en <a href="/carreras-hibridas/madrid">Madrid</a>, <a href="/carreras-hibridas/comunidad-valenciana">la Comunitat Valenciana</a> y <a href="/carreras-hibridas/canarias">Canarias</a>.</p>

<h2>Próximas pruebas de Hyatlón</h2>
<div data-block="races"></div>

<h2>¿Cómo preparar un Hyatlón?</h2>
<p>Como el H8 replica las estaciones de HYROX, la preparación es la misma; el H6 pide algo menos de volumen. Lo básico:</p>
<ol>
  <li><strong>Corre tres veces por semana:</strong> series de 1 km a ritmo de carrera, un rodaje largo suave y una sesión combinada.</li>
  <li><strong>Encadena carrera y estación:</strong> 1 km corriendo y directamente a remo, zancadas o wall balls, para acostumbrarte a cambiar de esfuerzo.</li>
  <li><strong>Practica las wall balls y las zancadas con saco:</strong> llegan al final de los dos formatos y es donde más tiempo se pierde.</li>
  <li><strong>Prueba el trineo</strong> al menos dos o tres veces si tu gimnasio lo tiene.</li>
</ol>
<p>Tienes un plan completo semana a semana en el <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan de entrenamiento de 12 semanas</a>, que sirve tal cual para el H8 y, quitando volumen, para el H6. Y si buscas dónde entrenar con trineo y SkiErg, mira el <a href="/centros-entrenamiento">directorio de centros</a>.</p>

<h2>Preguntas frecuentes</h2>
<div data-block="faq"></div>
`,
};
