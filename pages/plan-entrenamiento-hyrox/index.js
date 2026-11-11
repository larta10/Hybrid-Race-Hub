/* Página pilar del plan de entrenamiento: generador arriba y guía debajo.
   Formato, estaciones y reglas según hyrox.com (los mismos datos verificados de /blog/que-es-hyrox). */
import PlanLanding from "../../components/plan/PlanLanding";

const PATH = "/plan-entrenamiento-hyrox";

const FAQS = [
  { q: "¿El plan es gratis de verdad?", a: "Sí. No hay registro, ni pago, ni versión recortada: respondes nueve preguntas, ves el plan completo y lo descargas en PDF o en Excel. Si quieres, te lo enviamos por correo, pero no guardamos tu dirección." },
  { q: "¿Cuántas semanas hacen falta para preparar una HYROX?", a: "Si ya corres y haces algo de fuerza, entre 8 y 12 semanas dan para llegar bien. Si empiezas de cero, mejor 12 a 16. Con menos de 4 semanas no hay tiempo de mejorar la forma y el plan se convierte en una puesta a punto: ensayar estaciones, fijar el ritmo y llegar descansado." },
  { q: "¿Cuántos días por semana hay que entrenar?", a: "Con 3 días se puede terminar una HYROX; con 4 se prepara bien, porque caben una sesión de fuerza, una de carrera rápida, una tirada larga y una de estaciones con carrera. El quinto y el sexto día son rodajes fáciles y un segundo día de fuerza: suman, pero solo si los recuperas." },
  { q: "¿Puedo seguir el plan sin trineo ni SkiErg?", a: "Sí. Al elegir gimnasio básico o entrenar en casa, el plan cambia cada estación por un sustituto: empuje o arrastre de disco en lugar del trineo, jalón de polea o banda en lugar del SkiErg y thrusters en lugar de wall balls. Aun así, intenta probar el trineo real dos o tres veces antes de la carrera." },
  { q: "¿Qué pasa si me salto una semana?", a: "No la recuperes haciendo doble. Si has perdido una semana, retoma el plan donde toca por fecha y baja un punto la intensidad los primeros días. Si has perdido dos o más, vuelve a generar el plan: se recalcula con las semanas que quedan." },
  { q: "¿Sirve para dobles, relevos, DEKA o una carrera de obstáculos?", a: "Sí. En la primera pregunta eliges la prueba y el plan cambia las sesiones: reparto de estaciones en dobles, tramos más rápidos en relevos, las diez zonas en DEKA y agarre, cuestas y cargas en una carrera de obstáculos." },
];

export default function PlanHyrox() {
  return (
    <PlanLanding
      path={PATH}
      title="Plan de entrenamiento HYROX gratis, a tu fecha"
      description="Plan de entrenamiento HYROX gratis: dinos la fecha de tu carrera, tu nivel y tu material y te damos las semanas que faltan, sesión a sesión. PDF y Excel."
      h1="Plan de entrenamiento HYROX gratis"
      lead="Dinos qué carrera preparas y cuándo es. Te damos las semanas que faltan, sesión a sesión, con tus ritmos y tu material."
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento HYROX" }]}
      presets={{ prueba: "hyrox" }}
      published="2026-11-11"
      updated="2026-11-11"
      faqs={FAQS}
    >
      <p className="guide-lead">
        Un plan de HYROX que funciona tiene cuatro cosas: más carrera que pesas, estaciones entrenadas justo antes de correr, fuerza que sube poco a poco
        y dos últimas semanas más suaves. El generador de arriba monta eso con tu fecha, tu nivel, los días que tienes y el material de tu gimnasio.
      </p>

      <nav className="guide-toc" aria-label="En esta página">
        <ol>
          <li><a href="#como-funciona">Cómo funciona el generador</a></li>
          <li><a href="#estructura">Cómo se estructura un plan de HYROX</a></li>
          <li><a href="#semana-tipo">Una semana tipo</a></li>
          <li><a href="#estaciones">Las 8 estaciones y sus errores</a></li>
          <li><a href="#semanas">Con 6, 8 o 12 semanas</a></li>
          <li><a href="#material">Sin trineo ni SkiErg</a></li>
          <li><a href="#otros-planes">Otros planes</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>

      <h2 id="como-funciona">Cómo funciona el generador</h2>
      <p>
        Son nueve preguntas, una por pantalla: la prueba, la fecha, tu nivel, tu marca en 5 km (o tu ritmo cómodo), los días por semana, lo que dura cada
        sesión, el material, las estaciones que peor llevas y tu edad y peso. Tardas un minuto.
      </p>
      <p>
        Con la fecha, el plan se cuenta <strong>hacia atrás desde el día de la carrera</strong>: si faltan nueve semanas, tiene nueve, y la última acaba en la
        línea de salida. Si aún no tienes fecha, te da un bloque de doce semanas que termina con un test. Y si vienes desde la ficha de una carrera
        del <a href="/calendario">calendario</a>, la prueba y la fecha ya llegan puestas.
      </p>
      <p>
        El plan se abre en una página con su propio enlace. No hace falta cuenta: guarda el enlace o compártelo y el plan se vuelve a montar igual.
        También lo puedes bajar en PDF, con una semana por página, o en Excel, con columnas para apuntar el peso real y cómo te has sentido.
      </p>

      <h2 id="estructura">Cómo se estructura un plan de HYROX</h2>
      <p>
        Una HYROX son 8 km de carrera en tramos de 1 km y una estación después de cada tramo. La carrera ocupa más de la mitad del tiempo, así que el plan
        se construye alrededor de ella y pasa por cuatro fases:
      </p>
      <ul>
        <li><strong>Base.</strong> Kilómetros fáciles, técnica de cada estación sin reloj y fuerza con repeticiones altas. El objetivo es poder entrenar más después sin romperte.</li>
        <li><strong>Construcción.</strong> Entra el ritmo de umbral (el que aguantas alrededor de una hora), sube la carga en fuerza y empiezas a correr justo después de cada estación.</li>
        <li><strong>Específico.</strong> Series de 1 km al ritmo objetivo y simulaciones parciales: cuatro, seis u ocho estaciones seguidas con su kilómetro.</li>
        <li><strong>Taper.</strong> Una o dos semanas con la mitad de volumen y la misma intensidad, para llegar descansado sin perder chispa.</li>
      </ul>
      <p>
        Cada tres o cuatro semanas hay una <strong>semana de descarga</strong>: mismo esquema y menos volumen. Es donde el cuerpo asimila lo entrenado, y saltársela
        es la forma más rápida de llegar cansado a la fase que más importa.
      </p>
      <p>
        La intensidad se reparte de forma desigual a propósito: casi todo fácil y poco muy duro. Los rodajes van a un ritmo en el que puedes hablar, y solo hay una
        sesión de carrera rápida por semana. En el plan generado tienes el porqué de cada decisión con su estudio.
      </p>

      <h2 id="semana-tipo">Una semana tipo</h2>
      <p>Así queda una semana con cuatro días y sesiones de una hora, en la fase de construcción:</p>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Día</th><th>Sesión</th><th>Qué se hace</th><th>Esfuerzo</th></tr></thead>
          <tbody>
            <tr><td>Lunes</td><td>Fuerza general</td><td>Sentadilla, peso muerto, press y remo: 4 series de 6</td><td>RPE 7-8</td></tr>
            <tr><td>Martes</td><td>Umbral</td><td>3 bloques de 8 minutos a ritmo de umbral, con 2 minutos de trote</td><td>RPE 7-8</td></tr>
            <tr><td>Jueves</td><td>Tirada larga</td><td>40 a 50 minutos a ritmo fácil y 4 rectas al final</td><td>RPE 3-4</td></tr>
            <tr><td>Sábado</td><td>Correr con fatiga</td><td>1 km a ritmo de carrera y una estación, de 3 a 5 veces</td><td>RPE 7-8</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Con tres días, la fuerza y la técnica de estaciones comparten sesión. Con cinco o seis se añaden un rodaje fácil, un segundo día de fuerza y una tirada
        larga el domingo. El RPE es el esfuerzo que notas del 1 al 10: sirve para ajustar el día que duermes mal o que el gimnasio está a 30 grados.
      </p>

      <h2 id="estaciones">Las 8 estaciones y el error más frecuente en cada una</h2>
      <p>
        Las distancias son las mismas en todas las sedes; los pesos cambian según la categoría y están en <a href="/blog/que-es-hyrox">qué es HYROX</a>.
        Esto es lo que más tiempo cuesta en cada estación:
      </p>
      <ol>
        <li><strong>SkiErg, 1.000 m.</strong> Tirar solo con los brazos. La fuerza sale de doblar la cadera y dejar caer el peso del cuerpo; los brazos acompañan. Es la primera estación: si sales de ella sin aire, lo pagas en siete kilómetros.</li>
        <li><strong>Empuje de trineo (sled push), 50 m.</strong> Empujar erguido y con los codos doblados. Brazos estirados, cuerpo inclinado y pasos cortos. Parar del todo sale caro, porque arrancar el trineo es lo que más cuesta.</li>
        <li><strong>Arrastre de trineo (sled pull), 50 m.</strong> Tirar de la cuerda solo con los brazos. Échate hacia atrás y usa el peso del cuerpo y las piernas; deja la cuerda ordenada detrás de ti para no pisarla.</li>
        <li><strong>Burpee broad jumps, 80 m.</strong> Buscar el salto más largo en cada repetición. Saltos medianos y un ritmo que no cambie cansan menos y acaban antes.</li>
        <li><strong>Remo, 1.000 m.</strong> Remar a muchas paladas con poca pierna. Empuja con las piernas y deja que el ritmo de paladas baje. Aquí se ganan pocos segundos y se pueden perder las piernas para lo que queda.</li>
        <li><strong>Farmers carry, 200 m.</strong> Soltar las pesas muchas veces. Cada parada son segundos y un agarre que ya no vuelve igual: pasos cortos y rápidos y, si hay que parar, una sola vez.</li>
        <li><strong>Zancadas con saco, 100 m.</strong> No tocar el suelo con la rodilla de atrás, que es lo que pide el reglamento para dar el paso por bueno. Tronco alto y paso constante; llegan con las piernas de siete kilómetros.</li>
        <li><strong>Wall balls, 100 repeticiones.</strong> Empezar con una serie enorme y acabar parado. Decide los bloques antes de la carrera (por ejemplo, de 10 a 20) y descansa siempre lo mismo. Si no bajas lo suficiente o no das en la diana, la repetición no cuenta.</li>
      </ol>
      <p>
        En el generador puedes marcar las estaciones que peor llevas: salen todas las semanas, al final del día de fuerza y dentro de la sesión de estaciones.
      </p>

      <h2 id="semanas">Cómo ajustar el plan con 6, 8 o 12 semanas</h2>
      <p>No es el mismo plan recortado. Con menos semanas se reduce sobre todo la base, y lo específico y el taper se mantienen:</p>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Semanas</th><th>Base</th><th>Construcción</th><th>Específico</th><th>Taper</th><th>Descargas</th></tr></thead>
          <tbody>
            <tr><td>6</td><td>2</td><td>1</td><td>2</td><td>1</td><td>Ninguna: no hay hueco</td></tr>
            <tr><td>8</td><td>3</td><td>2</td><td>2</td><td>1</td><td>Semana 4</td></tr>
            <tr><td>12</td><td>4</td><td>3</td><td>3</td><td>2</td><td>Semanas 4 y 8</td></tr>
          </tbody>
        </table>
      </div>
      <ul>
        <li><strong>Con 6 semanas</strong> solo compensa si ya corres y haces fuerza. El plan va casi directo a correr con fatiga y a las simulaciones.</li>
        <li><strong>Con 8 semanas</strong> hay tiempo para una base corta y una descarga a mitad de plan. Es lo justo para una primera HYROX si no partes de cero.</li>
        <li><strong>Con 12 semanas</strong> entran las cuatro fases completas, dos descargas y dos semanas de taper. Tienes el reparto explicado en el <a href="/plan-entrenamiento-hyrox/12-semanas">plan HYROX de 12 semanas</a>.</li>
        <li><strong>Con menos de 4 semanas</strong> el generador te lo dice claro: no da para mejorar la forma. Te prepara una puesta a punto de una a tres semanas.</li>
        <li><strong>Con más de 24 semanas</strong> el plan cubre las últimas 24 y te dice qué día empieza.</li>
      </ul>

      <h2 id="material">Si no tienes trineo ni SkiErg</h2>
      <p>
        La mayoría de gimnasios no tiene trineo, y casi ninguno tiene la moqueta de competición. El plan no te deja sin entrenar la estación: la cambia por algo que
        trabaja lo mismo con lo que hay.
      </p>
      <ul>
        <li><strong>Trineo:</strong> empuje y arrastre de un disco por el suelo; en casa, zancadas con mochila cargada.</li>
        <li><strong>SkiErg:</strong> jalón de polea alta con cuerda, de pie y doblando la cadera; en casa, el mismo gesto con una banda.</li>
        <li><strong>Remo:</strong> bici o elíptica fuerte; en casa, swings con kettlebell o mancuerna.</li>
        <li><strong>Wall balls:</strong> thrusters con mancuernas ligeras o con una mochila.</li>
      </ul>
      <p>
        Los sustitutos mantienen el esfuerzo, pero el gesto no es igual. Si puedes, busca un centro con material de carrera en el{" "}
        <a href="/centros-entrenamiento">directorio de centros</a> y haz allí al menos las simulaciones de la fase específica.
      </p>

      <h2 id="otros-planes">Otros planes</h2>
      <ul>
        <li><a href="/plan-entrenamiento-hyrox/principiantes">Plan HYROX para principiantes</a>: qué necesitas antes de empezar y qué cambia si es tu primera carrera.</li>
        <li><a href="/plan-entrenamiento-hyrox/12-semanas">Plan HYROX de 12 semanas</a>: el reparto semana a semana del bloque más habitual.</li>
        <li><a href="/plan-entrenamiento-hyrox/dobles">Plan HYROX para dobles</a>: cómo entrenar con tu pareja y repartir las estaciones.</li>
        <li><a href="/plan-entrenamiento-ocr">Plan de entrenamiento para carreras de obstáculos</a>: agarre, cuestas y cargas para una OCR o una Spartan.</li>
      </ul>
      <p>
        Cuando tengas tiempos de tus simulaciones, pásalos por la <a href="/calculadora-hyrox">calculadora HYROX</a> para estimar tu marca. Y si todavía no has
        elegido carrera, en el <a href="/blog/calendario-hyrox-espana-2026-2027">calendario HYROX de España</a> están las sedes con fecha.
      </p>
    </PlanLanding>
  );
}
