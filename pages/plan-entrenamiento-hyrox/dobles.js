/* Plan HYROX para dobles: generador con la prueba ya puesta y guía de cómo entrenar en pareja.
   Formato de dobles según /blog/que-es-hyrox: los dos corren los 8 km y las estaciones se reparten. */
import PlanLanding from "../../components/plan/PlanLanding";
import PartnerBuscarPareja from "../../components/PartnerBuscarPareja";

const FAQS = [
  { q: "¿En dobles se corre la mitad?", a: "No. Los dos corréis juntos los ocho kilómetros. Lo que se reparte es el trabajo de las estaciones: mientras uno empuja, rema o lanza, el otro descansa, y os podéis turnar las veces que queráis." },
  { q: "¿Cómo repartimos las estaciones?", a: "Por puntos fuertes y en bloques cortos. Quien mejor empuja lleva más metros de trineo; quien mejor rema, más metros de remo. En las largas, como el SkiErg o las wall balls, funcionan mejor muchos turnos cortos que dos largos: cambiad antes de que el ritmo caiga." },
  { q: "¿Y si uno corre mucho más rápido que el otro?", a: "El ritmo de carrera lo pone quien corre más despacio, así que conviene que el plan de carrera lo siga sobre todo esa persona. Quien corre más rápido puede compensar haciendo más parte de las estaciones, que es donde su descanso extra rinde." },
  { q: "¿Tenemos que entrenar siempre juntos?", a: "No. Cada uno puede seguir su plan por separado. Lo que sí conviene hacer juntos son las simulaciones de la fase específica, tres o cuatro sesiones, para ensayar los cambios y saber quién empieza cada estación." },
];

export default function PlanHyroxDobles() {
  return (
    <PlanLanding
      path="/plan-entrenamiento-hyrox/dobles"
      title="Plan HYROX dobles: cómo entrenar en pareja, gratis"
      description="Plan de entrenamiento para HYROX dobles, gratis: los dos corréis los 8 km y os repartís las estaciones. Sesiones para ensayar cambios, ritmo y reparto."
      h1="Plan HYROX para dobles"
      lead="En dobles corréis los dos los 8 km y os repartís las estaciones. El plan entrena eso: correr al ritmo de la pareja y cambiar rápido."
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento HYROX", href: "/plan-entrenamiento-hyrox" }, { name: "Dobles" }]}
      presets={{ prueba: "hyrox_dobles" }}
      published="2026-11-11"
      updated="2026-11-11"
      faqs={FAQS}
    >
      <p className="guide-lead">
        Dobles es la forma más habitual de estrenarse en HYROX, y tiene truco: parece media carrera y no lo es. La carrera se hace entera y lo que se
        divide es la fuerza. Por eso un plan de dobles se parece mucho a uno individual, con tres diferencias que el generador de arriba ya tiene en cuenta.
      </p>

      <h2 id="diferencias">Qué cambia respecto a individual</h2>
      <ul>
        <li><strong>La carrera pesa todavía más.</strong> Las estaciones duran la mitad para cada uno, pero los 8 km son los mismos. La proporción de carrera sube, y con ella lo que importa correr bien.</li>
        <li><strong>Las estaciones se hacen más rápido.</strong> Trabajas en bloques cortos con descanso entre medias, así que cada bloque va más fuerte que si lo hicieras solo. El plan mete ese formato en las sesiones de estaciones: turnos de 10 a 15 repeticiones o de 250 metros.</li>
        <li><strong>Los cambios cuentan.</strong> Pasar la cuerda del trineo, soltar el balón, levantarse del remo: cada relevo mal hecho son segundos. Se ensaya en las simulaciones.</li>
      </ul>

      <h2 id="reparto">Cómo repartir cada estación</h2>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Estación</th><th>Cómo suele funcionar</th></tr></thead>
          <tbody>
            <tr><td>SkiErg, 1.000 m</td><td>Turnos de 200 a 250 m. Cambiar no cuesta casi nada y el ritmo se mantiene alto.</td></tr>
            <tr><td>Empuje de trineo, 50 m</td><td>Un largo cada uno. Quien empuje mejor puede llevarse más largos.</td></tr>
            <tr><td>Arrastre de trineo, 50 m</td><td>Un largo cada uno. El que descansa ordena la cuerda.</td></tr>
            <tr><td>Burpee broad jumps, 80 m</td><td>Tramos de 10 a 20 m. Es donde más se nota quién va más fresco.</td></tr>
            <tr><td>Remo, 1.000 m</td><td>Dos o cuatro turnos. Subir y bajar del remo cuesta unos segundos: no cambiéis demasiado.</td></tr>
            <tr><td>Farmers carry, 200 m</td><td>Dos o cuatro tramos. Cambio en movimiento, sin dejar las pesas en el suelo si podéis.</td></tr>
            <tr><td>Zancadas con saco, 100 m</td><td>Tramos de 20 a 25 m, pasando el saco de hombros a hombros.</td></tr>
            <tr><td>Wall balls, 100 repeticiones</td><td>Bloques de 10 a 15. Decididlos antes y no los cambiéis en carrera.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Es un punto de partida, no una regla: probadlo en entrenamiento y ajustad. Los pesos de dobles son los de la categoría Open; los tienes en{" "}
        <a href="/blog/que-es-hyrox">qué es HYROX</a>.
      </p>

      <h2 id="ritmo">El ritmo lo pone quien corre más despacio</h2>
      <p>
        En carrera no os podéis separar, así que el ritmo de los ocho kilómetros es el del más lento de los dos. Dos consecuencias para el plan:
      </p>
      <ul>
        <li><strong>Generad el plan con la marca de 5 km de quien corre más despacio</strong> si vais a entrenar juntos. Los ritmos de carrera con fatiga saldrán ajustados a la pareja.</li>
        <li><strong>Quien corre más rápido llega más descansado a cada estación.</strong> Tiene sentido que haga el primer turno y algo más de la mitad del trabajo.</li>
      </ul>
      <p>
        Si cada uno entrena por su cuenta, que cada uno genere su plan con su marca y sus días, y quedad para las simulaciones.
      </p>

      <h2 id="juntos">Qué sesiones hacer juntos</h2>
      <ol>
        <li><strong>Las simulaciones parciales de la fase específica.</strong> Son tres o cuatro sábados. Corred juntos el kilómetro y haced la estación con el reparto que queráis probar.</li>
        <li><strong>Una sesión de cambios.</strong> Diez minutos solo de relevos en trineo, saco y balón, sin cansancio. Parece una tontería hasta que se cae el balón en carrera.</li>
        <li><strong>La sesión de afinar de la última semana.</strong> Dos rondas cortas a ritmo de carrera para repasar quién empieza cada estación.</li>
      </ol>
      <p>
        El resto (fuerza, series, rodajes) se puede hacer por separado sin perder nada.
      </p>

      <PartnerBuscarPareja variant="compacta" placement="plan_dobles" />

      <h2 id="mas">Para seguir</h2>
      <p>
        Si dudáis entre dobles, relevos o individual, en{" "}
        <a href="/blog/formato-individual-parejas-mixtas-equipo">individual, parejas, mixtas o equipo</a> está cómo funciona cada formato. Si para uno de los dos
        es la primera carrera, mirad el <a href="/plan-entrenamiento-hyrox/principiantes">plan para principiantes</a>. La explicación de las fases y de cada
        estación está en la página del <a href="/plan-entrenamiento-hyrox">plan de entrenamiento HYROX</a>, y las fechas, en el{" "}
        <a href="/blog/calendario-hyrox-espana-2026-2027">calendario HYROX de España</a>.
      </p>
    </PlanLanding>
  );
}
