/* Plan HYROX para principiantes: generador con el nivel ya puesto y guía propia. */
import PlanLanding from "../../components/plan/PlanLanding";

const FAQS = [
  { q: "¿Puedo hacer una HYROX sin haber competido nunca?", a: "Sí. Para la categoría Open no hay que clasificarse ni acreditar ninguna marca, y las estaciones no piden técnica difícil. Lo que sí hace falta es poder correr: si aguantas 30 minutos seguidos a ritmo suave, con un plan de 10 a 12 semanas llegas a la meta." },
  { q: "¿Cuánto se tarda en terminar una primera HYROX?", a: "Depende mucho de cómo corras. En un estudio con deportistas aficionados que simularon la prueba, la media fue de 86 minutos. Para una primera carrera es más útil ponerse como objetivo no parar en las estaciones que perseguir un tiempo." },
  { q: "¿Es mejor empezar en individual o en dobles?", a: "En dobles corréis los dos los 8 km, pero las estaciones se reparten, así que el trabajo de fuerza es la mitad. Si la carrera no te preocupa y las estaciones sí, dobles es una buena primera vez. Si quieres saber de lo que eres capaz tú solo, individual Open." },
  { q: "¿Y si no puedo correr 5 km seguidos?", a: "Empieza por ahí antes del plan: cuatro semanas alternando correr y andar, tres días por semana, hasta llegar a 30 minutos. Luego genera el plan. Dentro del plan, los rodajes de nivel principiante ya permiten alternar 4 minutos corriendo y 1 andando." },
];

export default function PlanHyroxPrincipiantes() {
  return (
    <PlanLanding
      path="/plan-entrenamiento-hyrox/principiantes"
      title="Plan HYROX para principiantes: empieza desde tu nivel"
      description="Plan de entrenamiento HYROX para principiantes, gratis: 3 o 4 días por semana, descargas frecuentes y estaciones a media dosis. Con tu fecha y tu material."
      h1="Plan HYROX para principiantes"
      lead="Tu primera HYROX, con un plan que empieza donde estás tú: menos dosis en las estaciones, más descanso y ritmos por sensaciones si no tienes marca."
      crumbs={[{ name: "Inicio", href: "/" }, { name: "Plan de entrenamiento HYROX", href: "/plan-entrenamiento-hyrox" }, { name: "Principiantes" }]}
      presets={{ prueba: "hyrox", nivel: "principiante" }}
      published="2026-11-11"
      updated="2026-11-11"
      faqs={FAQS}
    >
      <p className="guide-lead">
        La mayoría de la gente que se apunta a su primera HYROX no viene de competir: viene del gimnasio, de salir a correr o de las dos cosas a medias.
        Este plan está pensado para eso. El generador de arriba ya tiene marcado el nivel principiante; pon tu fecha y lo demás.
      </p>

      <h2 id="antes">Qué necesitas antes de empezar</h2>
      <ul>
        <li><strong>Correr 30 minutos seguidos</strong>, aunque sea despacio. Si todavía no llegas, dedica cuatro semanas a conseguirlo alternando correr y andar.</li>
        <li><strong>Saber hacer una sentadilla y una zancada</strong> sin dolor. No hace falta levantar mucho; hace falta moverse bien.</li>
        <li><strong>Tres días libres a la semana.</strong> Con tres se termina. Con cuatro se llega mejor.</li>
        <li><strong>Una revisión médica si llevas tiempo parado</strong> o tienes algún problema de corazón, tensión o articulaciones. Es una hora larga de esfuerzo alto.</li>
      </ul>

      <h2 id="que-cambia">Qué cambia en el plan de principiante</h2>
      <p>No es el plan de los demás con menos peso. Cambian cinco cosas:</p>
      <ul>
        <li><strong>Descarga cada tres semanas</strong> en lugar de cada cuatro. Quien empieza tarda más en recuperar, sobre todo tendones y articulaciones.</li>
        <li><strong>Estaciones a media dosis.</strong> Las primeras semanas haces el 40 % de la distancia de carrera en cada estación, sin reloj. La dosis completa llega al final, y no en todas.</li>
        <li><strong>Bloques de umbral de 5 minutos</strong> en vez de 8. Mismo ritmo, menos tiempo seguido.</li>
        <li><strong>Rodajes que admiten andar.</strong> Cuatro minutos corriendo y uno andando cuenta igual que un rodaje continuo.</li>
        <li><strong>Pesos de partida bajos.</strong> Los kilos orientativos salen de tu peso corporal y suben un 2,5 % por semana. Si un día pesan, se bajan: manda el esfuerzo que notas.</li>
      </ul>

      <h2 id="dias">Tres o cuatro días: cómo queda la semana</h2>
      <div className="table-wrap">
        <table className="guide-table">
          <thead><tr><th>Día</th><th>Con 3 días</th><th>Con 4 días</th></tr></thead>
          <tbody>
            <tr><td>Lunes</td><td>Fuerza y técnica de dos estaciones</td><td>Fuerza general</td></tr>
            <tr><td>Martes</td><td>Descanso</td><td>Carrera con cambios de ritmo</td></tr>
            <tr><td>Miércoles</td><td>Carrera con cambios de ritmo</td><td>Descanso</td></tr>
            <tr><td>Jueves</td><td>Descanso</td><td>Tirada larga a ritmo fácil</td></tr>
            <tr><td>Sábado</td><td>Estaciones con carrera</td><td>Estaciones con carrera</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Si dudas entre tres y cuatro, elige los que puedas cumplir en una semana mala. Un plan de tres días que se hace entero vale más que uno de cinco que se
        cumple a medias. Seis días no son buena idea el primer año: el generador te avisa si lo eliges.
      </p>

      <h2 id="errores">Los errores de la primera vez</h2>
      <ol>
        <li><strong>Entrenar solo las estaciones.</strong> Son lo vistoso, pero la carrera es más de la mitad del tiempo. Quien llega corriendo bien, llega.</li>
        <li><strong>Hacer todos los días a tope.</strong> Los rodajes fáciles tienen que ser fáciles de verdad. Si no puedes hablar, vas rápido.</li>
        <li><strong>Saltarse la descarga porque te encuentras bien.</strong> Te encuentras bien precisamente porque aún no has acumulado cansancio. Respétala.</li>
        <li><strong>No probar nunca el trineo.</strong> Si tu gimnasio no tiene, busca un centro en el <a href="/centros-entrenamiento">directorio</a> y ve dos o tres veces antes de la carrera.</li>
        <li><strong>Salir rápido el día de la carrera.</strong> El primer kilómetro, más lento de lo que te pide el cuerpo. Quedan siete.</li>
      </ol>

      <h2 id="siguiente">Antes de inscribirte</h2>
      <p>
        Si aún no tienes claro el formato, lee <a href="/blog/que-es-hyrox">qué es HYROX</a>, con las estaciones y los pesos de cada categoría, y{" "}
        <a href="/blog/carreras-hibridas-principiantes-primera-prueba">cómo elegir tu primera carrera híbrida</a>. Las sedes y fechas están en el{" "}
        <a href="/blog/calendario-hyrox-espana-2026-2027">calendario HYROX de España</a>: cuenta al menos diez semanas desde hoy. Y si vais a ir dos, mira
        el <a href="/plan-entrenamiento-hyrox/dobles">plan para dobles</a>. La guía completa del plan está en la página del{" "}
        <a href="/plan-entrenamiento-hyrox">plan de entrenamiento HYROX</a>.
      </p>
    </PlanLanding>
  );
}
