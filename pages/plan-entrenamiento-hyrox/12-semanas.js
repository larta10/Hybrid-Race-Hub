/* Plan HYROX de 12 semanas: generador con el bloque de 12 semanas ya elegido y el reparto explicado.
   La tabla fija sesión a sesión sigue en /blog/plan-entrenamiento-hyrox-12-semanas (intención distinta: leer un plan cerrado). */
import PlanLanding from "../../components/plan/PlanLanding";

const FAQS = [
  { q: "¿Por qué 12 semanas y no 8 o 16?", a: "Porque es lo mínimo en lo que caben las cuatro fases enteras, dos semanas de descarga y dos de taper. Con 8 semanas se recorta la base; con 16 se alarga, que viene bien si empiezas de cero, pero no cambia la estructura." },
  { q: "¿Cuándo tengo que empezar?", a: "Doce semanas antes del día de la carrera. Si pones la fecha en el generador, lo calcula solo y cada sesión sale con su día. Si faltan más de doce semanas, el plan se alarga; no hace falta esperar." },
  { q: "¿Qué pasa si no tengo fecha de carrera?", a: "El bloque funciona igual. En lugar de la carrera, la semana 12 acaba con un test: una simulación a ritmo controlado para medir dónde estás. Con esos tiempos puedes generar el siguiente plan ya con fecha." },
  { q: "¿En qué se diferencia de la tabla del blog?", a: "La tabla del blog es un plan fijo de cuatro días para una primera HYROX, pensado para leerlo y seguirlo tal cual. El generador hace el mismo recorrido de 12 semanas con tus días, tus ritmos, tu material y tus fechas." },
];

export default function PlanHyrox12Semanas() {
  return (
    <PlanLanding
      path="/plan-entrenamiento-hyrox/12-semanas"
      title="Plan HYROX de 12 semanas a tu medida, gratis"
      description="Plan HYROX de 12 semanas gratis y a tu medida: 4 de base, 3 de construcción, 3 específicas y 2 de taper, con tus días, tus ritmos y tu material."
      h1="Plan HYROX de 12 semanas"
      lead="Doce semanas repartidas en base, construcción, específico y taper. Elige tus días y tu material; si ya tienes fecha, ponla y el plan acaba el día de la carrera."
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento HYROX", href: "/plan-entrenamiento-hyrox" }, { name: "12 semanas" }]}
      presets={{ prueba: "hyrox", sinFecha: true }}
      published="2026-11-11"
      updated="2026-11-11"
      faqs={FAQS}
    >
      <p className="guide-lead">
        Doce semanas es el bloque más usado para preparar una HYROX porque da para todo sin alargarse: cuatro semanas de base, tres de construcción, tres
        específicas y dos de taper. El generador de arriba ya tiene elegido el bloque de 12 semanas; en el segundo paso puedes cambiarlo por tu fecha.
      </p>

      <h2 id="reparto">El reparto semana a semana</h2>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Semana</th><th>Fase</th><th>Volumen</th><th>Lo que manda</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Base</td><td>70 %</td><td>Rodajes fáciles y técnica de estaciones sin reloj</td></tr>
            <tr><td>2</td><td>Base</td><td>73 %</td><td>Fuerza a 3 series de 10 con margen</td></tr>
            <tr><td>3</td><td>Base</td><td>77 %</td><td>Cambios de ritmo en la carrera</td></tr>
            <tr><td>4</td><td>Base · descarga</td><td>48 %</td><td>Mismo esquema, menos de todo</td></tr>
            <tr><td>5</td><td>Construcción</td><td>83 %</td><td>Primeros bloques a ritmo de umbral</td></tr>
            <tr><td>6</td><td>Construcción</td><td>87 %</td><td>Fuerza a 4 series de 6; correr tras cada estación</td></tr>
            <tr><td>7</td><td>Construcción</td><td>90 %</td><td>Más rondas de carrera con fatiga</td></tr>
            <tr><td>8</td><td>Específico · descarga</td><td>56 %</td><td>Respiro antes del tramo más duro</td></tr>
            <tr><td>9</td><td>Específico</td><td>97 %</td><td>Series de 1 km y simulación de la primera mitad</td></tr>
            <tr><td>10</td><td>Específico</td><td>100 %</td><td>Simulación de la segunda mitad: la semana más cargada</td></tr>
            <tr><td>11</td><td>Taper</td><td>70 %</td><td>Menos volumen, mismo ritmo</td></tr>
            <tr><td>12</td><td>Taper · carrera</td><td>45 %</td><td>Dos sesiones cortas y la carrera</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        El volumen es el porcentaje respecto a la semana más cargada, la 10. Si eliges sesiones de 60 minutos, la primera semana son de unos 40 y solo llegas
        a la hora entera al final de la fase específica. Si eres principiante o tienes 50 años o más, las descargas caen en las semanas 3 y 6.
      </p>

      <h2 id="bloques">Qué se busca en cada bloque</h2>
      <h3>Semanas 1 a 4: base</h3>
      <p>
        Acostumbrar al cuerpo a entrenar cuatro días. Los rodajes son a ritmo de conversación, la fuerza va con repeticiones altas y las estaciones se practican
        a media dosis, mirando la postura y la respiración. Si esta fase te parece fácil, va bien.
      </p>
      <h3>Semanas 5 a 7: construcción</h3>
      <p>
        Sube la intensidad. En la carrera entran bloques de 8 minutos a ritmo de umbral; en la fuerza, menos repeticiones y más kilos; y la sesión del sábado
        pasa a ser un kilómetro a ritmo de carrera seguido de una estación, varias veces. Es la primera vez que corres con las piernas cargadas.
      </p>
      <h3>Semanas 8 a 10: específico</h3>
      <p>
        Después de una descarga, las sesiones se parecen a la carrera: series de 1 km cerca de tu ritmo de 5 km y simulaciones parciales, una semana con las
        cuatro primeras estaciones y otra con las cuatro últimas. Aquí ves qué estación te obliga a frenar y aún estás a tiempo de trabajarla.
      </p>
      <h3>Semanas 11 y 12: taper</h3>
      <p>
        El volumen baja a la mitad y la intensidad se queda. En la última semana hay dos sesiones cortas con ritmo de carrera y, si quieres, un trote suave
        el día antes. Nada nuevo esa semana: ni zapatillas, ni comida, ni ejercicios.
      </p>

      <h2 id="ajustes">Si te sobran o te faltan semanas</h2>
      <ul>
        <li><strong>Faltan entre 13 y 24 semanas:</strong> pon la fecha y el plan se alarga solo, sobre todo en la base. No esperes a que falten doce.</li>
        <li><strong>Faltan entre 8 y 11:</strong> se recorta la base y el taper puede quedarse en una semana. Sigue siendo un plan completo.</li>
        <li><strong>Faltan entre 4 y 7:</strong> sirve si ya entrenas. El plan va casi directo a lo específico.</li>
        <li><strong>Pierdes una semana a mitad:</strong> no la recuperes. Sigue por donde toca por fecha y baja un punto el esfuerzo los primeros días.</li>
      </ul>

      <h2 id="tabla-fija">Si prefieres una tabla fija</h2>
      <p>
        Hay quien quiere leer el plan entero antes de empezar. Para eso está el artículo del{" "}
        <a href="/blog/plan-entrenamiento-hyrox-12-semanas">plan HYROX de 12 semanas para tu primera carrera</a>: una tabla cerrada de cuatro días, con las
        series de cada martes y el combinado de cada jueves. Si es tu primera vez, mira también el{" "}
        <a href="/plan-entrenamiento-hyrox/principiantes">plan para principiantes</a>; y la explicación completa de las fases y las estaciones está en la
        página del <a href="/plan-entrenamiento-hyrox">plan de entrenamiento HYROX</a>. Para elegir fecha, el{" "}
        <a href="/blog/calendario-hyrox-espana-2026-2027">calendario HYROX de España</a>.
      </p>
    </PlanLanding>
  );
}
