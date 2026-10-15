import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import RaceList from "../components/RaceList";
import { SITE_URL, SITE_NAME } from "../lib/site";
import { fetchUpcomingRaces, seasonLabel, modalityLabel, priceNumber, dateParts, raceEventSchema } from "../lib/races-server";
import { CITY_BY_SLUG, raceMatchesCity } from "../lib/hybrid-cities";

// Fecha de la última revisión del texto (no del calendario, que se actualiza a diario)
const CONTENT_UPDATED = "2026-10-14";
const PATH = "/que-es-una-carrera-hibrida";

export async function getStaticProps() {
  const races = await fetchUpcomingRaces();
  const madrid = races.filter(r => raceMatchesCity(r, CITY_BY_SLUG.madrid)).slice(0, 5);
  const counts = {};
  races.forEach(r => { const k = modalityLabel(r); counts[k] = (counts[k] || 0) + 1; });
  const priced = races
    .map(r => ({ nombre: r.nombre, precio: r.precio, n: priceNumber(r.precio), mod: modalityLabel(r) }))
    .filter(r => r.n != null);
  return {
    props: {
      upcoming: races.slice(0, 8),
      total: races.length,
      madrid,
      counts,
      priced,
      season: seasonLabel(),
    },
    revalidate: 86400,
  };
}

function faqData({ madrid, priced, total }) {
  const faqs = [
    {
      q: "¿Qué es una carrera híbrida?",
      a: "Una carrera híbrida es una competición que mezcla carrera a pie con trabajo de fuerza o con obstáculos. Las más conocidas en España son HYROX (8 km de carrera alternados con 8 estaciones de ejercicio funcional), las carreras de obstáculos u OCR como Spartan Race, y formatos como DEKA. En inglés se llaman hybrid races.",
    },
    {
      q: "¿Qué diferencia hay entre HYROX y una carrera OCR?",
      a: "HYROX se corre en un recinto cubierto y siempre tiene el mismo formato, así que los tiempos se pueden comparar entre ciudades. Una OCR se corre al aire libre, cada recorrido es distinto y los obstáculos (muros, cuerdas, barro, cargas) cambian de una prueba a otra.",
    },
    {
      q: "¿Hay carreras híbridas para principiantes?",
      a: "Sí. En HYROX la categoría Open y el formato por parejas (Doubles) están pensados para gente que entrena con regularidad pero no compite a alto nivel. En OCR, las distancias cortas como la Spartan Sprint (unos 5 km) son la puerta de entrada habitual. Con 8-12 semanas de preparación específica es suficiente para terminar con buenas sensaciones.",
    },
    {
      q: "¿Dónde hay carreras híbridas en Madrid?",
      a: madrid.length
        ? `Ahora mismo tenemos ${madrid.length === 1 ? "esta carrera" : `estas ${madrid.length} carreras`} en Madrid en el calendario: ${madrid.map(r => `${r.nombre} (${dateParts(r.fecha_iso)?.long})`).join("; ")}. La lista completa y actualizada está en la página de carreras híbridas en Madrid.`
        : "En este momento no hay carreras futuras en Madrid en nuestro calendario. Las nuevas fechas aparecen en la página de carreras híbridas en Madrid en cuanto los organizadores las publican.",
    },
  ];
  if (priced.length) {
    const min = Math.min(...priced.map(p => p.n));
    const max = Math.max(...priced.map(p => p.n));
    faqs.push({
      q: "¿Cuánto cuesta inscribirse en una carrera híbrida?",
      a: `Depende de la prueba y de cuándo te inscribas. En las carreras de nuestro calendario con precio publicado, la inscripción va desde ${min} € hasta ${max === min ? `${max} €` : `${max} €`} (${priced.slice(0, 4).map(p => `${p.nombre}: ${p.precio}`).join("; ")}). Los precios suelen subir por tramos a medida que se acerca la fecha, así que compensa apuntarse pronto.`,
    });
  }
  faqs.push(
    {
      q: "¿Cuánto se tarda en terminar una HYROX?",
      a: "Como referencia, la mayoría de participantes de la categoría Open termina entre 1 hora y 1 hora y media; por debajo de 1 hora ya es un tiempo muy sólido. Con nuestra calculadora HYROX puedes estimar tu tiempo según tu ritmo por kilómetro y por estación.",
    },
    {
      q: "¿Se puede hacer HYROX por parejas o en equipo?",
      a: "Sí. En Doubles corréis los 8 km juntos y os repartís el trabajo de las estaciones como queráis. En Relay sois cuatro y cada uno hace dos kilómetros y dos estaciones. Muchas OCR también tienen formato por parejas o equipos.",
    },
    {
      q: "¿Qué zapatillas uso para una carrera híbrida?",
      a: "Para HYROX, una zapatilla estable con algo de amortiguación, que agarre bien en moqueta y no se hunda en el sled push. Para OCR, zapatilla de trail con tacos profundos que drene el agua. Tienes las dos comparativas en nuestros rankings de zapatillas HYROX y de zapatillas de trail para OCR.",
    },
  );
  return faqs.slice(0, 8);
}

export default function Guia({ upcoming, total, madrid, counts, priced, season }) {
  const url = `${SITE_URL}${PATH}`;
  const faqs = faqData({ madrid, priced, total });
  const title = `Qué es una carrera híbrida: HYROX, OCR y Spartan explicados (${season}) | ${SITE_NAME}`;
  const desc = "Qué es una carrera híbrida, tipos (HYROX, OCR, Spartan, DEKA), cómo es una prueba HYROX, categorías, cómo prepararte y próximas carreras en España.";
  const updated = dateParts(CONTENT_UPDATED);
  const otherMods = Object.entries(counts).filter(([k]) => !["HYROX", "OCR", "Spartan", "DEKA", "DEKA FIT", "Hyatlón", "HURBAX"].includes(k));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Qué es una carrera híbrida: HYROX, OCR y Spartan explicados",
      "description": desc,
      "datePublished": "2026-10-14",
      "dateModified": CONTENT_UPDATED,
      "inLanguage": "es-ES",
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "image": `${SITE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": SITE_NAME, "url": `${SITE_URL}/sobre-nosotros` },
      "publisher": { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Qué es una carrera híbrida", "item": url },
      ],
    },
    ...(upcoming.length ? [{
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Próximas carreras híbridas en España",
      "itemListElement": upcoming.map((r, i) => ({ "@type": "ListItem", "position": i + 1, "item": raceEventSchema(r, SITE_URL) })).filter(x => x.item),
    }] : []),
  ];

  return (
    <PageShell activePath={PATH}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Qué es una carrera híbrida: HYROX, OCR y Spartan explicados" />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta property="article:modified_time" content={CONTENT_UPDATED} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Qué es una carrera híbrida" }]} />
          <p className="section-label">GUÍA · CARRERAS HÍBRIDAS</p>
          <h1 className="guide-title">Qué es una carrera híbrida</h1>
          <p className="guide-updated">Última actualización: <time dateTime={CONTENT_UPDATED}>{updated.long}</time> · El calendario de abajo se actualiza cada día</p>
        </div>

        <div className="guide-body">
          <p className="guide-lead">
            <strong>Una carrera híbrida es una competición que combina correr con fuerza, ejercicios funcionales u obstáculos dentro de la misma prueba.</strong>{" "}
            No gana el que corre más rápido ni el que más levanta, sino el que mejor aguanta las dos cosas a la vez.
            En España las más conocidas son HYROX, las carreras de obstáculos (OCR) como Spartan Race y formatos como DEKA; en inglés se llaman <em>hybrid races</em>.
          </p>
          <p>
            Hace unos años era un nicho de gente que venía del CrossFit o del trail. Hoy en nuestro calendario hay {total} carreras de este tipo programadas en España
            y casi cada fin de semana hay alguna. Esta guía explica los formatos, cómo es una HYROX por dentro, qué categoría elegir y cómo prepararla sin lesionarte.
          </p>

          <nav className="guide-toc" aria-label="Contenido de la guía">
            <p className="section-label">EN ESTA GUÍA</p>
            <ol>
              <li><a href="#tipos">Tipos de carreras híbridas</a></li>
              <li><a href="#hyrox">Cómo es una prueba HYROX</a></li>
              <li><a href="#comparativa">HYROX vs OCR vs Spartan</a></li>
              <li><a href="#categorias">Categorías</a></li>
              <li><a href="#preparacion">Cómo prepararte</a></li>
              <li><a href="#material">Material recomendado</a></li>
              <li><a href="#proximas">Próximas carreras en España</a></li>
              <li><a href="#faq">Preguntas frecuentes</a></li>
            </ol>
          </nav>

          <h2 id="tipos">Tipos de carreras híbridas</h2>
          <p>Todas mezclan carrera y trabajo de fuerza, pero se parecen poco entre sí. Estas son las que vas a encontrar en España:</p>

          <h3>HYROX</h3>
          <p>
            El formato más estandarizado: 8 kilómetros de carrera divididos en tramos de 1 km, y después de cada uno, una estación de trabajo funcional.
            Se corre en pabellones o recintos feriales, con el mismo recorrido y los mismos pesos en todo el mundo. Por eso tu tiempo en Valencia vale lo mismo que en Londres.
          </p>

          <h3>OCR (carreras de obstáculos)</h3>
          <p>
            OCR viene de <em>Obstacle Course Racing</em>. Son carreras al aire libre, normalmente con desnivel, barro y agua, en las que hay que superar muros, cuerdas,
            arrastres, cargas y pasos de equilibrio. Cada recorrido es distinto, así que aquí importa más adaptarse al terreno que el ritmo por kilómetro.
          </p>

          <h3>Spartan Race</h3>
          <p>
            Es la marca de OCR más extendida. Organiza tres distancias principales: Sprint (unos 5 km), Super (unos 10 km) y Beast (unos 21 km), con más obstáculos cuanto más larga.
            Si fallas un obstáculo, la penalización habitual son 30 burpees. Es la entrada típica al mundo OCR.
          </p>

          <h3>DEKA</h3>
          <p>
            Formato de la organización Spartan con 10 zonas de trabajo funcional. En DEKA FIT se corren 500 metros entre zona y zona; DEKA MILE es más corto e intenso
            y DEKA STRONG elimina la carrera. Es una buena alternativa si te gusta HYROX y quieres algo más corto.
          </p>

          <h3>Hyatlón</h3>
          <p>
            La carrera híbrida oficial de la Federación Española de Triatlón, aprobada en 2026 y desarrollada junto a World Triathlon. Alterna tramos de 1 km con estaciones
            en recinto cerrado, en dos formatos: H6 (6 estaciones) y H8 (las mismas 8 que HYROX). Tiene modalidad individual, dobles, relevos y ParaHyatlón.
            Te lo explicamos en <a href="/blog/que-es-el-hyatlon">qué es el Hyatlón</a>.
          </p>

          <h3>HURBAX</h3>
          <p>
            Circuito español al aire libre con 5 km de carrera y 5 estaciones, en individual, parejas o equipos de cuatro. Funciona como una liga por puntos con ranking
            nacional, clasificación de clubes y una final en Madrid. Más detalles en <a href="/blog/que-es-hurbax">qué es HURBAX</a>.
          </p>

          {otherMods.length > 0 && (
            <>
              <h3>Otras modalidades en el calendario</h3>
              <p>
                Además de las anteriores, ahora mismo hay en nuestro calendario pruebas de{" "}
                {otherMods.map(([k, n], i) => <span key={k}>{i > 0 && (i === otherMods.length - 1 ? " y " : ", ")}{k.toLowerCase()} ({n})</span>)}:
                ligas y competiciones de box que mezclan carrera, fuerza y gimnásticos con formatos propios.
              </p>
            </>
          )}

          <h2 id="hyrox">Cómo es una prueba HYROX</h2>
          <p>
            Una HYROX son <strong>8 km de carrera y 8 estaciones</strong>. Corres 1 km, haces una estación, corres otro kilómetro y así hasta el final. El orden es siempre el mismo:
          </p>
          <div className="table-wrap">
            <table className="guide-table">
              <thead><tr><th>#</th><th>Estación</th><th>Distancia o repeticiones</th><th>Qué castiga</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>SkiErg</td><td>1.000 m</td><td>Hombros, dorsales y pulmones</td></tr>
                <tr><td>2</td><td>Sled Push</td><td>50 m</td><td>Cuádriceps y gemelos</td></tr>
                <tr><td>3</td><td>Sled Pull</td><td>50 m</td><td>Espalda, agarre y piernas</td></tr>
                <tr><td>4</td><td>Burpee Broad Jumps</td><td>80 m</td><td>Todo el cuerpo, ritmo cardiaco</td></tr>
                <tr><td>5</td><td>Remo</td><td>1.000 m</td><td>Piernas y espalda</td></tr>
                <tr><td>6</td><td>Farmers Carry</td><td>200 m</td><td>Agarre y core</td></tr>
                <tr><td>7</td><td>Sandbag Lunges</td><td>100 m</td><td>Glúteos y cuádriceps ya fatigados</td></tr>
                <tr><td>8</td><td>Wall Balls</td><td>100 repeticiones</td><td>Piernas, hombros y cabeza</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Entre estación y carrera atraviesas una zona llamada Roxzone, y ese tiempo también cuenta. Un error típico de la primera HYROX: salir a ritmo de 10K en el primer kilómetro
            y llegar a las sandbag lunges sin piernas. La carrera se gana en la segunda mitad.
          </p>
          <p>
            Para saber qué tiempo puedes hacer, mete tus parciales en la <a href="/calculadora-hyrox">calculadora HYROX</a>: te da el total y en qué rango de categoría estarías.
            Tienes el formato completo, con los pesos oficiales de cada categoría y las sedes en España, en <a href="/blog/que-es-hyrox">qué es HYROX</a>.
          </p>

          <h2 id="comparativa">HYROX vs OCR vs Spartan vs Hyatlón vs HURBAX: ¿en qué se diferencian?</h2>
          <div className="table-wrap">
            <table className="guide-table">
              <thead><tr><th></th><th>HYROX</th><th>OCR</th><th>Spartan Race</th><th>Hyatlón</th><th>HURBAX</th></tr></thead>
              <tbody>
                <tr><td>Dónde</td><td>Recinto cubierto</td><td>Al aire libre</td><td>Al aire libre, montaña o circuito</td><td>Recinto cerrado</td><td>Al aire libre</td></tr>
                <tr><td>Recorrido</td><td>Siempre igual</td><td>Cambia en cada prueba</td><td>Cambia, con obstáculos de la marca</td><td>Fijo según formato (H6 u H8)</td><td>5 tramos de 1 km + 5 estaciones</td></tr>
                <tr><td>Distancia</td><td>8 km + 8 estaciones</td><td>De 3 a más de 20 km</td><td>Sprint ~5 km, Super ~10 km, Beast ~21 km</td><td>6 u 8 tramos de 1 km + tramo final</td><td>5 km + 5 estaciones</td></tr>
                <tr><td>Clave</td><td>Ritmo y fuerza resistencia</td><td>Agarre, técnica y terreno</td><td>Agarre, trepa y gestión de burpees</td><td>Ritmo y fuerza resistencia</td><td>Intensidad y regularidad en la liga</td></tr>
                <tr><td>Penalización</td><td>Repeticiones no válidas</td><td>Según organizador</td><td>30 burpees por obstáculo fallado</td><td>Según reglamento FETRI</td><td>Según reglamento HURBAX</td></tr>
                <tr><td>Zapatilla</td><td>Estable, de asfalto o gym</td><td>Trail con tacos</td><td>Trail con tacos y buen drenaje</td><td>Estable, de asfalto o gym</td><td>Estable, con algo de agarre</td></tr>
                <tr><td>Comparar tiempos</td><td>Sí, entre sedes</td><td>No</td><td>Solo dentro de la misma prueba</td><td>Sí, dentro del mismo formato</td><td>Ranking acumulado por puntos</td></tr>
              </tbody>
            </table>
          </div>
          <p>Si quieres leer la comparación con más detalle, tienes el artículo <a href="/blog/hyrox-vs-ocr-diferencias">HYROX vs OCR: diferencias y cuál encaja contigo</a>.</p>

          <h2 id="categorias">¿Qué categoría elijo?</h2>
          <ul>
            <li><strong>Open:</strong> la categoría de la mayoría. Pesos más ligeros en sled y wall balls. Es donde empezar.</li>
            <li><strong>Pro:</strong> mismos kilómetros, más carga en las estaciones. Para quien ya ha hecho varias y busca marca.</li>
            <li><strong>Doubles:</strong> dos personas corren juntas los 8 km y se reparten las estaciones. Muy buena opción para la primera vez.</li>
            <li><strong>Relay:</strong> equipo de cuatro, cada uno hace 2 km y 2 estaciones. Ideal para un grupo de box.</li>
          </ul>
          <p>
            En OCR la división habitual es entre categoría de grupos de edad (Age Group), Open y Élite. En Élite los obstáculos no se pueden saltar y las penalizaciones son estrictas;
            en Open puedes pedir ayuda y nadie te mira mal. Si dudas entre formatos individuales y por equipos, lee <a href="/blog">nuestras guías en el blog</a>.
          </p>

          <h2 id="preparacion">¿Cómo me preparo para una carrera híbrida?</h2>
          <p>Con tres o cuatro sesiones a la semana y entre 8 y 12 semanas por delante, se llega bien a una primera prueba. Lo que más funciona:</p>
          <ol>
            <li><strong>Corre cansado.</strong> Haz series de 1 km justo después de un bloque de fuerza o de remo. Es lo que vas a vivir el día de la carrera.</li>
            <li><strong>Entrena las estaciones con peso real</strong> al menos una vez cada dos semanas: sled, wall balls y lunges son donde más tiempo se pierde.</li>
            <li><strong>Trabaja el agarre</strong> si vas a una OCR: colgarte de una barra, farmers carry y trepa. Muchos burpees de penalización vienen de unas manos que ya no aguantan.</li>
            <li><strong>Base aeróbica</strong>: un rodaje largo y suave a la semana. La fuerza sin motor no sirve en una prueba de más de una hora.</li>
            <li><strong>Descarga la última semana</strong>: menos volumen, algo de intensidad corta y dormir bien.</li>
          </ol>
          <p>
            Si no quieres pensar la planificación, el <a href="/plan-entrenamiento">generador de planes</a> te prepara las semanas que faltan hasta tu carrera, con cargas y descargas,
            y lo puedes bajar en Excel o PDF. Si prefieres una tabla fija, sigue nuestro <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan HYROX de 12 semanas</a>.
            Para encontrar dónde entrenar con sled y SkiErg, mira el <a href="/centros-entrenamiento">directorio de centros</a>.
          </p>

          <h2 id="material">Material recomendado</h2>
          <p>No hace falta gastar mucho para la primera. Por orden de importancia:</p>
          <ul>
            <li><strong>Zapatillas</strong>: estables para HYROX (<a href="/productos/zapatillas-hyrox">ranking de zapatillas HYROX</a>) o de trail con tacos para OCR (<a href="/productos/zapatillas-trail">ranking de zapatillas trail para OCR</a>).</li>
            <li><strong>Reloj GPS</strong> para controlar ritmos y la carga semanal (<a href="/productos/relojes">ranking de relojes</a>).</li>
            <li><strong>Pulsómetro de pecho</strong> si quieres datos fiables en las estaciones (<a href="/productos/pulsometros">ranking de pulsómetros</a>).</li>
            <li><strong>Ropa</strong> que no roce con barro ni sudor (<a href="/productos/ropa">ranking de ropa técnica</a>).</li>
          </ul>
          <p>Lo tienes todo ordenado por necesidad, con pros y contras, en la guía de <a href="/blog/material-hyrox-carreras-obstaculos">material para HYROX y carreras de obstáculos</a>. Y si todavía dudas qué carrera hacer, lee cómo <a href="/blog/carreras-hibridas-principiantes-primera-prueba">elegir tu primera prueba</a>.</p>

          <h2 id="proximas">Próximas carreras híbridas en España</h2>
          {upcoming.length ? (
            <>
              <p>Estas son las siguientes {upcoming.length} pruebas de nuestro calendario, ordenadas por fecha. Fechas y precios los publica cada organizador: confirma siempre en su web.</p>
              <RaceList races={upcoming} pageUrl={url} compact />
              <p><a href="/calendario" className="step-link">Ver las {total} carreras del calendario →</a></p>
            </>
          ) : (
            <p>No hemos podido cargar el calendario ahora mismo. Lo tienes completo en <a href="/calendario">el calendario de carreras</a>.</p>
          )}
          <p className="guide-cities">
            Por ciudad: <a href="/carreras-hibridas/madrid">Madrid</a> · <a href="/carreras-hibridas/barcelona">Barcelona</a> · <a href="/carreras-hibridas/valencia">Valencia</a> · <a href="/carreras-hibridas/sevilla">Sevilla</a> · <a href="/carreras-hibridas/malaga">Málaga</a> · <a href="/carreras-hibridas/bilbao">Bilbao</a> · <a href="/carreras-hibridas/zaragoza">Zaragoza</a>
          </p>

          <h2 id="faq">Preguntas frecuentes</h2>
          <div className="faq-plain">
            {faqs.map((f, i) => (
              <details key={i} className="faq-d" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </article>
    </PageShell>
  );
}
