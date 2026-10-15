// Artículo: qué es HYROX. Formato y pesos verificados en hyrox.com/the-fitness-race (15-10-2026);
// sedes y fechas de España en hyrox.es (15-10-2026).
export default {
  slug: "que-es-hyrox",
  title: "Qué es HYROX: formato, estaciones, categorías y cómo inscribirte",
  metaTitle: "Qué es HYROX: formato, estaciones, pesos, categorías e inscripción",
  h1: "Qué es HYROX: formato, estaciones, categorías y cómo inscribirte",
  category: "Guías",
  featured: true,
  date: "2026-10-15",
  updated: "2026-10-15",
  excerpt: "HYROX son 8 km de carrera repartidos en 8 tramos de 1 km, con una estación de trabajo funcional después de cada uno. Te contamos las estaciones, los pesos de cada categoría, las sedes en España y cómo inscribirte.",
  description: "Qué es HYROX: 8 x 1 km de carrera y 8 estaciones (SkiErg, trineo, burpees, remo, farmer, zancadas y wall balls). Pesos por categoría, sedes en España y cómo inscribirte.",
  faq: [
    { q: "¿Cuánto se tarda en hacer una HYROX?", a: "Depende mucho del nivel. Los mejores del mundo bajan de una hora en categoría Pro. Un atleta popular que entrena con regularidad suele moverse entre 1 h 15 min y 1 h 45 min, y en una primera carrera es normal pasar de las 2 horas. No hay tiempo de corte que te descalifique por lento." },
    { q: "¿Hace falta clasificarse para correr una HYROX?", a: "No. Según la web oficial de HYROX España, cualquiera puede competir sin clasificación previa. Solo los Campeonatos del Mundo piden plaza, que se consigue con el tiempo en las carreras de la temporada." },
    { q: "¿Qué categoría elijo para mi primera HYROX?", a: "Open individual si quieres medirte tú solo con los pesos estándar, Doubles si prefieres repartir las estaciones con un compañero (los dos corréis los 8 km), y Relay si sois cuatro y cada uno hace 2 km y 2 estaciones. Pro solo tiene sentido si ya has hecho Open con buen tiempo, porque los pesos suben bastante." },
    { q: "¿Qué estación es la más dura de HYROX?", a: "Para la mayoría, las wall balls del final (100 repeticiones con las piernas ya cansadas) y el sled push, que con 152 kg en Open masculino exige mucha fuerza de piernas. Las zancadas con saco también castigan si no las has entrenado." },
    { q: "¿Dónde se celebran las HYROX en España?", a: "En la temporada 2026/27 la web oficial anuncia Valencia (15-18 de octubre de 2026), Barcelona (11-15 de noviembre de 2026), Bilbao (6-7 de febrero de 2027), Madrid (17-21 de marzo de 2027) y Málaga (14-18 de abril de 2027). Las fechas actualizadas están en nuestro calendario." },
  ],
  content: `
<p><strong>HYROX es una carrera de fitness en la que corres 8 km divididos en 8 tramos de 1 km y, después de cada kilómetro, haces una estación de ejercicio funcional: SkiErg, empuje y arrastre de trineo, burpees con salto, remo, farmer carry, zancadas con saco y wall balls.</strong> Todos los participantes hacen exactamente el mismo recorrido y los mismos pesos según su categoría, así que tu tiempo se puede comparar con el de cualquier otra carrera HYROX del mundo.</p>

<p>Se celebra en pabellones y recintos feriales, no en la montaña, y no hace falta clasificarse para participar. En España hay varias sedes por temporada (Valencia, Barcelona, Bilbao, Madrid y Málaga en la 2026/27) y las plazas de las grandes ciudades se agotan con antelación. Abajo tienes el formato completo con los pesos oficiales, las categorías y cómo inscribirte. Si todavía no tienes claro si HYROX es para ti o prefieres una carrera de obstáculos, lee antes nuestra <a href="/que-es-una-carrera-hibrida">guía de carreras híbridas</a>.</p>

<h2>¿Cómo es el formato de una HYROX?</h2>
<p>La estructura no cambia nunca: <strong>1 km corriendo, 1 estación, y así ocho veces</strong>. El orden de las estaciones es siempre el mismo y la carrera termina con las wall balls. Entre la zona de carrera y las estaciones hay un área de transición que se llama Roxzone: el tiempo que pasas ahí cuenta, y mucha gente pierde minutos en ella sin darse cuenta.</p>

<div class="table-wrap"><table>
  <thead><tr><th>Orden</th><th>Estación</th><th>Distancia o repeticiones</th><th>Qué trabaja</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SkiErg</td><td>1.000 m</td><td>Tracción de brazos y core, mucho cardio</td></tr>
    <tr><td>2</td><td>Sled push (empujar el trineo)</td><td>50 m (2 x 25 m)</td><td>Fuerza de piernas y empuje</td></tr>
    <tr><td>3</td><td>Sled pull (arrastrar el trineo con cuerda)</td><td>50 m (2 x 25 m)</td><td>Espalda, brazos y agarre</td></tr>
    <tr><td>4</td><td>Burpee broad jump</td><td>80 m</td><td>Cuerpo entero, potencia de salto</td></tr>
    <tr><td>5</td><td>Remo</td><td>1.000 m</td><td>Cardio y cadena posterior</td></tr>
    <tr><td>6</td><td>Farmers carry</td><td>200 m</td><td>Agarre, trapecio y core</td></tr>
    <tr><td>7</td><td>Sandbag lunges (zancadas con saco)</td><td>100 m</td><td>Piernas y glúteos con fatiga acumulada</td></tr>
    <tr><td>8</td><td>Wall balls</td><td>100 repeticiones</td><td>Sentadilla y lanzamiento, el remate final</td></tr>
  </tbody>
</table></div>

<p>En la modalidad por parejas (Doubles) los dos corréis juntos los 8 km y os repartís las repeticiones de cada estación como queráis. En relevos (Relay), cada uno de los cuatro miembros del equipo hace 2 km de carrera y 2 estaciones.</p>

<h2>¿Qué pesos se usan en cada categoría?</h2>
<p>El SkiErg, los burpees y el remo son iguales para todos. Lo que cambia según la categoría es el peso del trineo (incluye el propio trineo), las kettlebells del farmer carry (el peso es por mano), el saco de las zancadas y el balón de las wall balls. Estos son los pesos que publica HYROX en su web oficial:</p>

<div class="table-wrap"><table>
  <thead><tr><th>Estación</th><th>Open mujeres</th><th>Open hombres</th><th>Pro mujeres</th><th>Pro hombres</th></tr></thead>
  <tbody>
    <tr><td>Sled push</td><td>102 kg</td><td>152 kg</td><td>152 kg</td><td>202 kg</td></tr>
    <tr><td>Sled pull</td><td>78 kg</td><td>103 kg</td><td>103 kg</td><td>153 kg</td></tr>
    <tr><td>Farmers carry</td><td>2 x 16 kg</td><td>2 x 24 kg</td><td>2 x 24 kg</td><td>2 x 32 kg</td></tr>
    <tr><td>Sandbag lunges</td><td>10 kg</td><td>20 kg</td><td>20 kg</td><td>30 kg</td></tr>
    <tr><td>Wall balls</td><td>4 kg</td><td>6 kg</td><td>6 kg</td><td>9 kg</td></tr>
  </tbody>
</table></div>

<p>En Doubles y Relay se usan los pesos de Open: los de mujeres en equipos femeninos, los de hombres en equipos masculinos y, en relevos mixtos, cada uno con los de su categoría. Antes de cada temporada conviene revisar el reglamento en la web oficial de <a href="https://hyrox.com/the-fitness-race/" target="_blank" rel="noopener">HYROX</a>, porque pueden ajustar detalles.</p>

<h2>¿Qué categorías hay y cuál te conviene?</h2>
<ul>
  <li><strong>Open individual.</strong> La categoría estándar y la más numerosa. Es la recomendable para tu primera carrera si vas solo.</li>
  <li><strong>Pro individual.</strong> Mismo recorrido con pesos más altos. Solo merece la pena cuando ya has hecho Open con un tiempo sólido y te sobra fuerza.</li>
  <li><strong>Doubles (parejas).</strong> Femenino, masculino o mixto. Los dos corréis todo y os repartís el trabajo de las estaciones. Es la puerta de entrada más amable: si un día flojeas en el trineo, tu compañero tira.</li>
  <li><strong>Relay (relevos de cuatro).</strong> Femenino, masculino o mixto. Cada uno hace solo 2 km y 2 estaciones, así que es ideal para equipos de un box o de la empresa con niveles muy distintos.</li>
</ul>
<p>Si dudas entre ir solo o acompañado, tenemos una guía específica sobre <a href="/blog/formato-individual-parejas-mixtas-equipo">a qué formato apuntarte</a>.</p>

<h2>¿Cuánto se tarda y qué tiempo es bueno?</h2>
<p>No hay un tiempo de corte que te eche de la carrera por lento, así que terminar es cuestión de ritmo y de no quedarte bloqueado en una estación. Como referencia orientativa: la élite mundial baja de la hora en Pro, un atleta popular que entrena con constancia se mueve entre 1 h 15 min y 1 h 45 min, y en una primera carrera es habitual superar las 2 horas. Para ponerte objetivos con números reales, prueba nuestra <a href="/calculadora-hyrox">calculadora de tiempos HYROX</a>: metes tu ritmo de carrera y tus tiempos por estación y te da un tiempo estimado.</p>

<h2>¿Dónde hay HYROX en España en 2026 y 2027?</h2>
<p>Estas son las sedes de la temporada 2026/27 que anuncia la web oficial de HYROX España:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Ciudad</th><th>Fechas</th><th>Recinto</th></tr></thead>
  <tbody>
    <tr><td>Valencia</td><td>15-18 de octubre de 2026</td><td>Feria Valencia</td></tr>
    <tr><td>Barcelona</td><td>11-15 de noviembre de 2026</td><td>Fira Barcelona Gran Via</td></tr>
    <tr><td>Bilbao</td><td>6-7 de febrero de 2027</td><td>Bilbao Exhibition Centre (Barakaldo)</td></tr>
    <tr><td>Madrid</td><td>17-21 de marzo de 2027</td><td>IFEMA Madrid</td></tr>
    <tr><td>Málaga</td><td>14-18 de abril de 2027</td><td>FYCMA, Palacio de Ferias y Congresos</td></tr>
  </tbody>
</table></div>
<p>Las fechas pueden cambiar y se añaden sedes durante la temporada. Tienes la lista actualizada, junto con DEKA, Spartan y las carreras de obstáculos, en el <a href="/calendario">calendario de carreras híbridas</a>, y por ciudad en <a href="/carreras-hibridas/madrid">carreras híbridas en Madrid</a> o <a href="/carreras-hibridas/barcelona">en Barcelona</a>.</p>

<h2>¿Cómo te inscribes en una HYROX?</h2>
<ol>
  <li><strong>Elige sede y día.</strong> Las carreras grandes duran varios días y cada categoría compite en un día y una franja concretos. El horario provisional suele publicarse en la ficha del evento en hyrox.es.</li>
  <li><strong>Compra el dorsal en la web oficial.</strong> Las inscripciones se hacen desde <a href="https://hyrox.es/" target="_blank" rel="noopener">hyrox.es</a>, que enlaza a la tienda oficial de entradas. Evita reventas de terceros: el dorsal va a tu nombre.</li>
  <li><strong>No esperes al último mes.</strong> En Madrid y Barcelona las plazas de las franjas buenas se acaban pronto y algunas sedes abren lista de espera.</li>
  <li><strong>Revisa la franja horaria.</strong> Unas semanas antes recibirás tu hora de salida. Organiza el viaje y la comida a partir de ella, no al revés.</li>
</ol>

<h2>¿Cómo prepararte para tu primera HYROX?</h2>
<p>Lo que más se nota en la primera carrera no es la fuerza, es correr cansado. Ocho kilómetros parecen pocos, pero cada uno empieza con las pulsaciones altas y las piernas cargadas de la estación anterior. Las claves:</p>
<ul>
  <li><strong>Corre tres veces por semana</strong> como mínimo, con un día de series y un rodaje largo suave.</li>
  <li><strong>Haz sesiones compromised:</strong> 1 km corriendo justo después de una estación, para que el cuerpo aprenda a cambiar de un esfuerzo a otro.</li>
  <li><strong>Practica las wall balls y las zancadas</strong> en volumen, porque llegan al final y es donde más tiempo se pierde.</li>
  <li><strong>Ensaya el trineo</strong> si tu gimnasio tiene uno. Si no, sustitúyelo por empujes de carga pesada y sentadillas.</li>
</ul>
<p>Si quieres un plan concreto semana a semana, tienes nuestro <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan de entrenamiento HYROX de 12 semanas</a>. Y para el calzado, el <a href="/productos/zapatillas-hyrox">ranking de zapatillas para HYROX</a> compara modelos que agarran en el trineo y sirven para correr.</p>

<h2>Estrategia estación por estación</h2>
<p>Lo que sigue son las claves que más tiempo ahorran en cada estación. No hay atajos: hay que entrenarlas, pero saber qué buscar ayuda.</p>
<ul>
  <li><strong>SkiErg (1.000 m):</strong> es la primera estación y llegas fresco, así que la tentación es ir a tope. No lo hagas: tira con la cadera y el core, no solo con los brazos, y deja reserva para el trineo que viene después.</li>
  <li><strong>Sled push (50 m):</strong> brazos estirados, cuerpo inclinado y pasos cortos y continuos. Parar y volver a arrancar cuesta mucho más que empujar despacio sin parar.</li>
  <li><strong>Sled pull (50 m):</strong> cuerda en mano, retrocede caminando y tira con las piernas y la espalda. Recoge la cuerda en el suelo para no tropezar con ella.</li>
  <li><strong>Burpee broad jumps (80 m):</strong> un ritmo constante y respirado vale más que tres burpees rápidos y una pausa. Salta lo justo para avanzar sin aterrizar de golpe.</li>
  <li><strong>Remo (1.000 m):</strong> es buen momento para bajar pulsaciones sin perder mucho tiempo. Empuja con las piernas y mantén una cadencia cómoda.</li>
  <li><strong>Farmers carry (200 m):</strong> camina rápido, hombros abajo y agarre firme. Si tienes que soltar, hazlo antes de que se te abra la mano, no después.</li>
  <li><strong>Sandbag lunges (100 m):</strong> el saco va sobre los hombros y la rodilla de atrás tiene que tocar el suelo en cada zancada. Pasos de longitud media para no cargar tanto los cuádriceps.</li>
  <li><strong>Wall balls (100 repeticiones):</strong> decide antes de la carrera en cuántos bloques las vas a hacer y descansa siempre lo mismo. La técnica importa: si el balón no llega a la marca, la repetición no cuenta.</li>
</ul>
<p>Y entre estación y estación, la Roxzone: entra y sal sin pararte a mirar el reloj. Muchos atletas populares pierden ahí varios minutos sin darse cuenta.</p>

<h2>HYROX frente a otras carreras híbridas</h2>
<p>HYROX es la más estandarizada: siempre igual, siempre en interior. DEKA (de Spartan) tiene un formato parecido con 10 zonas y un total de 5 km de carrera, y las carreras de obstáculos como Spartan o Desafío de Guerreros se corren al aire libre, con barro y obstáculos que cambian en cada sede. Si quieres comparar a fondo, mira <a href="/blog/hyrox-vs-ocr-diferencias">HYROX frente a OCR</a>.</p>

<h2>Preguntas frecuentes</h2>
<div data-block="faq"></div>
`,
};
