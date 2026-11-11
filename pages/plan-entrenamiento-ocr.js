/* Plan de entrenamiento para carreras de obstáculos (OCR): generador con la prueba ya puesta y guía propia.
   Distancias de Spartan según lib/modalities.js (Sprint ~5 km, Super ~10 km, Beast ~21 km). */
import PlanLanding from "../components/plan/PlanLanding";

const FAQS = [
  { q: "¿Cuánto hay que entrenar para una carrera de obstáculos?", a: "Para una de 5 km, 8 semanas con tres días bastan si ya haces algo de deporte. Para 10 o 12 km, cuenta con 10 a 12 semanas. Para 20 km o más, de 12 a 16 y una tirada larga semanal que llegue a las dos horas y media." },
  { q: "¿Puedo preparar una OCR sin gimnasio?", a: "Sí, es la prueba que mejor se prepara en la calle. Hace falta un sitio donde colgarse (una barra de parque sirve), una mochila que puedas cargar y cuestas. El plan tiene una opción para entrenar en casa o en el parque y adapta cada sesión." },
  { q: "¿Qué es más importante, correr o la fuerza?", a: "Correr, y más cuanto más larga es la carrera. Pero lo que deja a la gente parada en un obstáculo es casi siempre el agarre. Por eso el plan mete colgarse y transportar cargas todas las semanas, aunque sean pocos minutos." },
  { q: "¿Sirve para una Spartan Race?", a: "Sí. Elige OCR sprint para una Sprint de unos 5 km, OCR 10-12 km para una Super y OCR 20 km o más para una Beast. Las sesiones de simulación incluyen burpees porque en Spartan es la penalización habitual cuando fallas un obstáculo." },
];

export default function PlanOcr() {
  return (
    <PlanLanding
      path="/plan-entrenamiento-ocr"
      title="Plan de entrenamiento OCR gratis para carreras de obstáculos"
      description="Plan de entrenamiento para carreras de obstáculos (OCR y Spartan), gratis: agarre, cuestas, cargas y tirada larga según la distancia y tu fecha."
      h1="Plan de entrenamiento para carreras de obstáculos"
      lead="Agarre, cuestas, cargas y fondo según la distancia: 5 km, 10-12 km o 20 km y más. Con tu fecha, tus días y lo que tengas para entrenar."
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento OCR" }]}
      presets={{ prueba: "ocr_media" }}
      published="2026-11-11"
      updated="2026-11-11"
      faqs={FAQS}
    >
      <p className="guide-lead">
        Una carrera de obstáculos no se prepara como una HYROX. No hay estaciones fijas ni suelo liso: hay monte, barro, muros y cosas de las que colgarse,
        y cada recorrido es distinto. El plan entrena lo que se repite en todas: correr por terreno, agarrar, cargar y volver a arrancar.
      </p>

      <h2 id="que-entrena">Qué entrena el plan</h2>
      <ul>
        <li><strong>Carrera por terreno.</strong> Cuestas cortas en la base, ritmo de umbral por terreno ondulado después y kilómetros con paradas al final. En cuesta dura se anda: se entrena también.</li>
        <li><strong>Agarre y suspensión.</strong> Colgarse de una barra, pasar barras si tienes dónde, y tirones con toalla. Es lo primero que falla en carrera, sobre todo mojado.</li>
        <li><strong>Trepa y tirón.</strong> Cuerda si tu centro tiene; si no, dominadas, bajadas lentas y remo invertido.</li>
        <li><strong>Transporte de cargas.</strong> Saco, cubo o mochila. Todas las semanas, pocos metros al principio.</li>
        <li><strong>Burpees.</strong> Porque cansan como un obstáculo y porque en muchas carreras son la penalización.</li>
        <li><strong>Fuerza general.</strong> Sentadilla, peso muerto, press y remo, con sobrecarga progresiva y descargas cada tres o cuatro semanas.</li>
      </ul>

      <h2 id="distancias">Qué cambia con la distancia</h2>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Distancia</th><th>Ejemplo</th><th>Tirada larga más larga</th><th>Lo que decide</th></tr></thead>
          <tbody>
            <tr><td>Sprint, unos 5 km</td><td>Spartan Sprint</td><td>60 minutos</td><td>Intensidad y obstáculos: se va rápido todo el rato</td></tr>
            <tr><td>10-12 km</td><td>Spartan Super</td><td>90 minutos</td><td>Equilibrio: fondo suficiente y agarre que aguante al final</td></tr>
            <tr><td>20 km o más</td><td>Spartan Beast</td><td>2 horas y media</td><td>Fondo, comer y beber en carrera, y piernas para las bajadas</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        La tirada larga es la única sesión que puede pasarse del tiempo que elijas por sesión: no hay forma honrada de preparar 20 km con sesiones de 45
        minutos, y el plan te avisa cuando ocurre. Si empiezas, la tirada larga se queda en el 80 % de esas duraciones.
      </p>

      <h2 id="semana">Una semana con cuatro días</h2>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Día</th><th>Sesión</th><th>Qué se hace</th></tr></thead>
          <tbody>
            <tr><td>Lunes</td><td>Fuerza general</td><td>Sentadilla, peso muerto, press, remo y plancha</td></tr>
            <tr><td>Martes</td><td>Carrera de calidad</td><td>Cuestas, umbral o series de 1 km, según la fase</td></tr>
            <tr><td>Jueves</td><td>Obstáculos con carrera</td><td>800 m a ritmo alegre, colgarse y transportar carga, varias rondas</td></tr>
            <tr><td>Sábado</td><td>Tirada larga</td><td>Por monte o parque con desnivel, a ritmo de conversación</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Con tres días, la fuerza y el agarre van juntos el lunes. Con cinco o seis se añaden un segundo día de fuerza, con más tirón, y un rodaje fácil.
      </p>

      <h2 id="casa">Entrenar en casa o en el parque</h2>
      <p>
        Para una OCR hace falta menos material que para casi cualquier otra prueba:
      </p>
      <ul>
        <li><strong>Algo de lo que colgarse:</strong> la barra de un parque de calistenia, una portería o una barra de puerta.</li>
        <li><strong>Una mochila cargada o un par de garrafas</strong> para las cargas, las zancadas y el peso muerto a una pierna.</li>
        <li><strong>Una cuesta.</strong> De 30 a 45 segundos subiendo fuerte es suficiente.</li>
        <li><strong>Una toalla</strong> pasada por la barra para trabajar el agarre de cuerda.</li>
      </ul>
      <p>
        Lo que no se puede imitar en casa son los obstáculos técnicos: anillas, barras giratorias, muros altos. Si tu carrera los tiene y te preocupan, ve dos
        o tres veces a un centro con circuito antes de la prueba; hay varios en el <a href="/centros-entrenamiento">directorio de centros</a>.
      </p>

      <h2 id="errores">Lo que más se paga el día de la carrera</h2>
      <ol>
        <li><strong>Entrenar solo en asfalto.</strong> Las bajadas por terreno suelto castigan piernas que no las han visto nunca.</li>
        <li><strong>Dejar el agarre para el final.</strong> Mejora despacio. Dos minutos colgado repartidos en cada sesión hacen más que una hora el último mes.</li>
        <li><strong>Correr hasta el obstáculo y llegar sin aire.</strong> Baja el ritmo veinte metros antes, respira y entra.</li>
        <li><strong>Estrenar zapatillas.</strong> Para barro hacen falta tacos; mira la guía de <a href="/productos/zapatillas-trail">zapatillas de trail para OCR</a>.</li>
      </ol>

      <h2 id="mas">Para seguir</h2>
      <p>
        Las fechas están en el <a href="/calendario/ocr">calendario de carreras de obstáculos</a>: desde la ficha de cada carrera puedes abrir este plan con la
        fecha ya puesta. Si es la primera, lee <a href="/blog/primera-carrera-obstaculos-guia">cómo preparar tu primera carrera de obstáculos</a>. Y si lo
        tuyo es el pabellón, tienes el <a href="/plan-entrenamiento-hyrox">plan de entrenamiento HYROX</a>.
      </p>
    </PlanLanding>
  );
}
