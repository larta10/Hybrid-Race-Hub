/* Política de privacidad: información completa (capa 2). Incluye el texto que antes iba en el pie. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_EMAIL, pageTitle, breadcrumbLd, ROBOTS_INDEX } from "../lib/site";
import { openConsentSettings } from "../lib/consent";
import { fechaLarga } from "../lib/dates";

const UPDATED = "2026-11-10";

export default function Privacidad() {
  const url = `${SITE_URL}/privacidad`;
  const title = "Política de privacidad";
  const desc = "Qué datos personales trata Hybrid Race Hub, para qué, con qué base legal, quién los recibe, cuánto tiempo se guardan y cómo ejercer tus derechos.";
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
          <p className="guide-lead">
            Solo tratamos los datos que nos mandas cuando escribes desde un formulario o por email. Los datos personales se tratan conforme al
            Reglamento General de Protección de Datos (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).
          </p>

          <h2 id="responsable">Responsable del tratamiento</h2>
          <p>Hybrid Race Hub. Contacto: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p>

          <h2 id="datos">Qué datos tratamos</h2>
          <p>Los que escribes en el formulario de organizadores o en el de contacto de la portada: nombre, email, nombre de la prueba o del centro y el mensaje. No pedimos datos de salud ni de menores.</p>

          <h2 id="finalidad">Finalidad</h2>
          <ul>
            <li>Gestionar las consultas de organizadores y centros: responderte, publicar tu carrera o tu centro y corregir datos.</li>
            <li>Enviarte alertas de nuevas carreras, solo si nos lo pides expresamente.</li>
          </ul>

          <h2 id="base-legal">Base legal</h2>
          <p>Tu consentimiento (artículo 6.1.a del RGPD), que das al enviar el formulario o el email. Puedes retirarlo cuando quieras, sin que afecte a lo tratado antes.</p>

          <h2 id="destinatarios">Destinatarios</h2>
          <p>
            No se ceden datos a terceros. Para que la web funcione usamos proveedores que tratan los datos por encargo nuestro y solo para ese fin:
            Vercel (alojamiento de la web), Resend (envío del email que genera el formulario) y Google (buzón de correo donde lo recibimos).
            Algunos pueden tratar datos fuera del Espacio Económico Europeo, con las garantías que exige el RGPD según sus condiciones de servicio.
          </p>

          <h2 id="conservacion">Cuánto tiempo los guardamos</h2>
          <p>El necesario para atender tu consulta y, si publicamos tu carrera o tu centro, mientras siga publicada. Después se borran, o antes si nos lo pides.</p>

          <h2 id="derechos">Tus derechos</h2>
          <p>
            Puedes pedir acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
            Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
          </p>

          <h2 id="cookies">Cookies</h2>
          <p>
            Usamos cookies técnicas y, solo si las aceptas, cookies de analítica (Google Analytics) y de publicidad (Google Ads y, si se activa, Meta).
            Lo tienes explicado en la <a href="/politica-cookies">política de cookies</a> y puedes cambiar tu elección cuando quieras:{" "}
            <button type="button" className="sf-consent-link" onClick={openConsentSettings}>configurar cookies</button>.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
