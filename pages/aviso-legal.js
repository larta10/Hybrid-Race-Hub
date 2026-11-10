/* Aviso legal (LSSI-CE). Solo datos conocidos: falta añadir NIF y domicilio del titular (tarea de Pablo). */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_EMAIL, pageTitle, breadcrumbLd, ROBOTS_INDEX } from "../lib/site";
import { fechaLarga } from "../lib/dates";

const UPDATED = "2026-11-10";

export default function AvisoLegal() {
  const url = `${SITE_URL}/aviso-legal`;
  const title = "Aviso legal";
  const desc = "Titular de hybridracehub.com, condiciones de uso de la web, responsabilidad sobre los datos de las carreras, enlaces externos y propiedad intelectual.";
  const crumbs = [{ name: "Inicio", href: "/" }, { name: title }];
  return (
    <PageShell>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
      </Head>
      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Legal</p>
          <h1 className="guide-title">{title}</h1>
          <p className="guide-updated">Actualizado: <time dateTime={UPDATED}>{fechaLarga(UPDATED)}</time></p>
        </div>
        <div className="guide-body">
          <h2 id="titular">Titular</h2>
          <p>Hybrid Race Hub, titular del sitio web hybridracehub.com. Contacto: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p>

          <h2 id="objeto">Qué es esta web</h2>
          <p>Un calendario y una guía de carreras híbridas y de obstáculos en España, con fichas de carreras, centros donde entrenar y comparativas de material. No vendemos dorsales: la inscripción se hace siempre en la web del organizador.</p>

          <h2 id="responsabilidad">Responsabilidad sobre los datos de las carreras</h2>
          <p>
            Comprobamos cada carrera con la web oficial del organizador (<a href="/como-verificamos-las-carreras">así lo hacemos</a>), pero fechas,
            precios y plazas los decide el organizador y pueden cambiar. Confírmalos en su web antes de pagar.
          </p>

          <h2 id="enlaces">Enlaces externos</h2>
          <p>
            Enlazamos a webs de organizadores, centros y proyectos que no controlamos. No tenemos enlaces de afiliado ni cobramos por recomendar productos:
            cuando citamos un modelo es porque nos parece útil, no porque nos paguen por ello.
          </p>

          <h2 id="propiedad">Propiedad intelectual</h2>
          <p>Los textos, el diseño y el logotipo de Hybrid Race Hub son nuestros. Las marcas de carreras y productos que se citan pertenecen a sus titulares y se mencionan solo para identificarlos.</p>

          <h2 id="datos">Datos personales y cookies</h2>
          <p>Ver la <a href="/privacidad">política de privacidad</a> y la <a href="/politica-cookies">política de cookies</a>.</p>
        </div>
      </article>
    </PageShell>
  );
}
