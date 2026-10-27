// Artículo: calendario HYROX España 2026-2027.
// Sustituye al previsto "Hybrid Day 2027": a 27-10-2026 hybrid-day.com solo publica una sede futura
// (Vigo, 12-13/12/2026) y ninguna de 2027, así que no hay datos suficientes para ese artículo.
// Sedes HYROX: tabla races de Supabase (enlaces a hyrox.es). El bloque data-block="races" se
// rellena en cada regeneración con las fechas vigentes, así que no caduca.
// Hyatlón: hyatlon.org (27-10-2026). Hybrid Day: hybrid-day.com/eventos (27-10-2026).
export default {
  slug: "calendario-hyrox-espana-2026-2027",
  title: "Calendario HYROX España 2026-2027: sedes, fechas y alternativas",
  metaTitle: "Calendario HYROX España 2026-2027: sedes y fechas",
  h1: "Calendario HYROX España 2026-2027: sedes, fechas y alternativas",
  category: "Carreras",
  date: "2026-10-27",
  updated: "2026-10-27",
  racesFilter: { modalidadId: "solo-por-nombre", name: "^HYROX" },
  cover: "https://images.unsplash.com/photo-1757147517580-90c214fc28f3?w=1200&q=80",
  imageAlt: "Público tras las vallas viendo pasar a una atleta durante una competición HYROX en un gran pabellón de hierro y cristal",
  excerpt: "Las sedes de HYROX en España para la temporada 2026-2027 con sus fechas, cómo elegir sede y categoría, y qué otras carreras con el mismo formato (Hybrid Day, Hyatlón, DEKA) tienes si no te cuadra ninguna.",
  description: "Sedes y fechas de HYROX en España en la temporada 2026-2027: Barcelona, Bilbao, Madrid y Málaga. Cómo elegir sede y qué alternativas tienes con fechas.",
  faq: [
    { q: "¿Cuántas HYROX hay en España en la temporada 2026-2027?", a: "A 27 de octubre de 2026 hay cuatro sedes con fecha en nuestro calendario: Barcelona (L'Hospitalet de Llobregat), Bilbao (Barakaldo), Madrid y Málaga. La lista de arriba se actualiza sola si HYROX añade o cambia fechas." },
    { q: "¿Dónde me inscribo en una HYROX?", a: "En la web oficial, hyrox.es, que enlaza a la tienda de entradas. Evita reventas de terceros. Cada carrera de nuestro calendario lleva el enlace directo a su ficha oficial." },
    { q: "¿Hay Hybrid Day en 2027?", a: "A 27 de octubre de 2026, la web oficial de Hybrid Day no ha publicado sedes para 2027. La próxima prueba anunciada es Vigo, en el IFEVI, el 12 y 13 de diciembre de 2026. Cuando salgan las fechas de 2027 las añadiremos al calendario." },
    { q: "¿Qué alternativas hay a HYROX con el mismo formato?", a: "Hybrid Day usa el mismo esquema de 8 km y 8 estaciones, y el Hyatlón H8 de la Federación Española de Triatlón también repite las ocho estaciones. Si prefieres algo más corto, tienes el Hyatlón H6 y los DEKA FIT." },
    { q: "¿Qué categoría elijo si es mi primera HYROX?", a: "Open si vas solo, o Doubles si vas con alguien: en parejas corréis juntos los 8 km y os repartís las estaciones, y es la forma más llevadera de debutar." },
  ],
  content: `
<p><strong>A 27 de octubre de 2026, HYROX tiene cuatro sedes con fecha en España para la temporada 2026-2027: Barcelona (L'Hospitalet de Llobregat) en noviembre de 2026, Bilbao (Barakaldo) en febrero de 2027, Madrid en marzo de 2027 y Málaga en abril de 2027.</strong> Abajo tienes la lista con fechas, que se actualiza sola desde nuestro calendario, y las carreras con un formato parecido por si ninguna sede te cuadra.</p>

<p>Si todavía no tienes claro qué es exactamente una HYROX, lee primero <a href="/blog/que-es-hyrox">qué es HYROX</a>: 8 tramos de 1 km de carrera con una estación después de cada uno, siempre en el mismo orden. Y si te preguntas si HYROX y "carrera híbrida" son lo mismo, lo explicamos en <a href="/blog/hyrox-vs-carrera-hibrida-diferencias">HYROX vs carrera híbrida</a>.</p>

<h2>Sedes y fechas de HYROX en España</h2>
<p>Estas son las HYROX con fecha confirmada en nuestro calendario, ordenadas por fecha. Cada una enlaza a su ficha en la web oficial, que es donde se compra el dorsal y se consulta el horario de cada categoría:</p>
<div data-block="races"></div>
<p>Las grandes sedes de HYROX duran varios días y cada categoría compite en una jornada y una franja concretas. El horario provisional lo publica la organización en la ficha de cada evento en hyrox.es. Si una fecha cambia o se añade una sede nueva, la lista de arriba se actualiza en menos de una hora.</p>

<h2>Cómo elegir sede</h2>
<p>Con cuatro sedes repartidas entre noviembre y abril, la elección suele ser más logística que deportiva. Lo que conviene mirar:</p>
<ul>
  <li><strong>Semanas de preparación que te quedan.</strong> Si empiezas de cero, cuenta con unas 12 semanas. Desde finales de octubre, Barcelona en noviembre llega pronto para un debutante; Madrid en marzo o Málaga en abril dan margen de sobra para seguir el <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan HYROX de 12 semanas</a>.</li>
  <li><strong>Desplazamiento.</strong> Una HYROX se compite en una franja de pocas horas, pero si hay que viajar, súmale hotel y el cansancio del trayecto. Correr cerca de casa tiene ventaja.</li>
  <li><strong>Con quién vas.</strong> Si vais en pareja o en grupo de box, poneos de acuerdo pronto: en Doubles y Relay necesitáis cuadrar fecha y categoría entre todos.</li>
  <li><strong>Tu objetivo.</strong> Para buscar marca, elige la sede que te deje llegar con un bloque de entrenamiento completo, sin pillar las semanas de más trabajo o de vacaciones.</li>
</ul>

<h2>Qué categoría elegir</h2>
<ul>
  <li><strong>Open</strong>: la de la mayoría, con los pesos más ligeros en el trineo y en las wall balls. Es donde empezar si vas solo.</li>
  <li><strong>Pro</strong>: mismos kilómetros, más carga. Para quien ya ha hecho alguna y busca marca.</li>
  <li><strong>Doubles</strong>: dos personas corren juntas los 8 km y se reparten el trabajo de las estaciones. Es la forma más llevadera de debutar.</li>
  <li><strong>Relay</strong>: equipo de cuatro, cada uno hace 2 km y 2 estaciones. Ideal para un grupo de box.</li>
</ul>
<p>Los pesos exactos de cada categoría están en <a href="/blog/que-es-hyrox">la guía de HYROX</a>. Para saber qué tiempo puedes hacer, mete tus parciales en la <a href="/calculadora-hyrox">calculadora HYROX</a>.</p>

<h2>Alternativas con el mismo formato: Hybrid Day e Hyatlón</h2>
<p>Si ninguna sede de HYROX te encaja, hay otras competiciones que usan un esquema muy parecido y para las que sirve exactamente la misma preparación.</p>
<h3>Hybrid Day</h3>
<p>Competición organizada desde Portugal que se celebra en Portugal y en España con 8 tramos de 1 km de carrera y 8 estaciones: SkiErg, sled push, sled pull, burpee broad jumps, remo, farmers carry, sandbag lunges y wall balls. En 2026 ha pasado por Valencia (Feria Valencia, 9 de mayo) y Torremolinos (10 de octubre). La próxima sede que anuncia su web oficial es <strong>Vigo, en el IFEVI, el 12 y 13 de diciembre de 2026</strong>, con categorías individuales, por parejas y relevos.</p>
<p>Si buscas <strong>Hybrid Day 2027</strong>: a fecha de este artículo, la organización todavía no ha publicado sedes ni fechas para 2027. En cuanto lo haga, las añadiremos al <a href="/calendario">calendario</a> y a las páginas de cada zona.</p>
<h3>Hyatlón</h3>
<p>La carrera híbrida oficial de la Federación Española de Triatlón. Su formato H8 repite las ocho estaciones de HYROX y el H6 quita dos estaciones y dos kilómetros. Según hyatlon.org, las próximas pruebas son <strong>Gran Canaria (H6, 14 de noviembre de 2026)</strong> y <strong>Zaragoza (H8, 28 de noviembre de 2026)</strong>. Tienes todo el detalle en <a href="/blog/que-es-el-hyatlon">qué es el Hyatlón</a>.</p>

<h2>Si prefieres algo más corto: DEKA</h2>
<p>DEKA es el formato de estaciones de la organización Spartan: en DEKA FIT haces 10 zonas de trabajo con 500 metros de carrera entre una y otra. Es más corto que una HYROX y en 2027 hay DEKA en muchas ciudades: Torremolinos, Toledo, Barcelona, Valencia, Ibiza, Vigo y Madrid, entre otras. Todas las fechas, con precio y enlace de inscripción, están en el <a href="/calendario">calendario de carreras híbridas</a>.</p>

<h2>Calendario de la temporada por zonas</h2>
<p>Si quieres ver todo lo que hay cerca de casa, no solo HYROX, entra en tu zona:</p>
<ul>
  <li><a href="/carreras-hibridas/madrid">Carreras híbridas en Madrid</a>: HYROX, DEKA, Spartan y competiciones de box.</li>
  <li><a href="/carreras-hibridas/cataluna">Carreras híbridas en Cataluña</a>: HYROX en L'Hospitalet, DEKA en Barcelona y OCR en Girona.</li>
  <li><a href="/carreras-hibridas/andalucia">Carreras híbridas en Andalucía</a>: HYROX y DEKA en Málaga, y OCR por toda la comunidad.</li>
  <li><a href="/carreras-hibridas/bilbao">Carreras híbridas en Bilbao</a>: HYROX en Barakaldo y OCR en Bizkaia.</li>
  <li><a href="/carreras-hibridas/galicia">Carreras híbridas en Galicia</a>: Hybrid Day y DEKA en Vigo.</li>
</ul>

<h2>Cómo llegar bien a tu HYROX</h2>
<p>Con 10-12 semanas y tres o cuatro sesiones por semana se llega con buenas sensaciones a la primera. Lo que más rinde:</p>
<ol>
  <li><strong>Corre cansado</strong>: series de 1 km justo después de remo, trineo o wall balls. Es lo que vas a vivir el día de la carrera.</li>
  <li><strong>Entrena las estaciones con peso real</strong> al menos cada dos semanas, sobre todo trineo y zancadas con saco. Si no tienes trineo en tu gimnasio, busca un box en el <a href="/centros-entrenamiento">directorio de centros</a>.</li>
  <li><strong>Practica las transiciones</strong>: el tiempo que pasas entre carrera y estación también cuenta.</li>
  <li><strong>Descarga la última semana</strong>: menos volumen, algo de intensidad corta y dormir bien.</li>
</ol>
<p>Y para el material, empieza por las zapatillas: tienes el <a href="/productos/zapatillas-hyrox">ranking de zapatillas para HYROX</a> con lo que mejor funciona sobre moqueta y en el trineo.</p>

<h2>Preguntas frecuentes</h2>
<div data-block="faq"></div>
`,
};
