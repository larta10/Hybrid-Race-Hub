/* Colaboración con Buscar Pareja Híbrida. Dos variantes:
   - "compacta": fichas de carreras con categoría de parejas, dobles, relevos o equipos.
   - "destacada": apartado "Proyectos amigos" (calendario y home). */
import { BUSCAR_PAREJA, trackPartnerClick } from "../lib/partners";

function PartnerLink({ href, placement, className, children, ariaLabel }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      data-partner={BUSCAR_PAREJA.id}
      aria-label={ariaLabel}
      onClick={() => trackPartnerClick(placement)}
    >
      {children}
    </a>
  );
}

export default function PartnerBuscarPareja({ variant = "compacta", placement }) {
  if (variant === "destacada") {
    const where = placement || "proyectos_amigos";
    return (
      <section className="partner partner--destacada" aria-labelledby="proyectos-amigos">
        <p className="section-label">Colaboración</p>
        <h2 id="proyectos-amigos" className="partner-title">Proyectos amigos</h2>
        <p className="partner-sub">Nosotros te ayudamos a encontrar la carrera. Ellos, con quién correrla.</p>
        <div className="partner-card">
          <h3 className="partner-name">{BUSCAR_PAREJA.name}</h3>
          <p className="partner-text">
            Una web gratuita para encontrar pareja de dobles o equipo de relevos para HYROX, DEKA y otras carreras híbridas.
            Eliges competición y categoría y ves quién busca pareja, con su ritmo y su nivel. La creó Monica después de
            quedarse sin pareja para competir.
          </p>
          <div className="partner-links">
            <PartnerLink href={BUSCAR_PAREJA.url} placement={`${where}_web`} className="btn-line partner-btn">
              Buscar pareja →
            </PartnerLink>
            <PartnerLink href={BUSCAR_PAREJA.instagram} placement={`${where}_instagram`} className="partner-ig"
              ariaLabel={`${BUSCAR_PAREJA.handle} en Instagram`}>
              {BUSCAR_PAREJA.handle}
            </PartnerLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside className="partner partner--compacta" aria-labelledby="falta-pareja">
      <h2 id="falta-pareja" className="partner-title-sm">¿Te falta pareja o equipo?</h2>
      <p className="partner-text">
        Si buscas compañero o compañera para esta carrera, en Buscar Pareja Híbrida puedes ver quién busca pareja para tu
        competición y categoría, con su ritmo y su nivel. Es gratis.
      </p>
      <PartnerLink href={BUSCAR_PAREJA.url} placement={placement || "ficha_carrera"} className="btn-line partner-btn">
        Buscar pareja →
      </PartnerLink>
    </aside>
  );
}
