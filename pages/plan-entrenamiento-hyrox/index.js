/* Página pilar del plan de entrenamiento: generador arriba y guía debajo. */
import PlanLanding from "../../components/plan/PlanLanding";

const PATH = "/plan-entrenamiento-hyrox";

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
    />
  );
}
