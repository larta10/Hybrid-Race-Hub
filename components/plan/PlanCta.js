/* Banner discreto del plan gratis para otras páginas (home y calendario). */
import s from "./plan.module.css";

export default function PlanCta({
  title = "Prepara tu carrera con un plan gratis",
  text = "Pon la fecha y tu nivel y te damos las semanas que faltan, sesión a sesión. Sin registro, en PDF o Excel.",
  href = "/plan-entrenamiento-hyrox",
  cta = "Crear mi plan",
  as: Tag = "aside",
}) {
  return (
    <Tag className={s.cta} aria-label="Plan de entrenamiento gratis">
      <p className={s.ctaTitle}>{title}</p>
      <p className={s.ctaText}>{text}</p>
      <a className="btn-solid" href={href}>{cta}</a>
    </Tag>
  );
}
