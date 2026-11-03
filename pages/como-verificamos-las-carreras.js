/* Método de verificación de las carreras (E-E-A-T). Describe lo que se hace de verdad:
   ver docs/datos/verificacion-carreras-2026-10.md y scripts/verify-races.mjs. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_EMAIL, pageTitle, breadcrumbLd, ROBOTS_INDEX } from "../lib/site";
import { fechaLarga } from "../lib/dates";

const PATH = "/como-verificamos-las-carreras";
const UPDATED = "2026-11-03";

export default function ComoVerificamos() {
  const url = `${SITE_URL}${PATH}`;
  const title = "Cómo verificamos las carreras del calendario";
  const desc = "Cómo comprobamos cada carrera antes de publicarla: web oficial del organizador, inscripción abierta, fecha y sede, y la fecha de la última comprobación.";
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Cómo verificamos las carreras" }];
  return (
    <PageShell>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og?title=${encodeURIComponent(title)}&cat=Método`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd(crumbs, url), {
          "@context": "https://schema.org", "@type": "WebPage", "name": title, "description": desc, "url": url, "dateModified": UPDATED, "inLanguage": "es-ES",
          "publisher": { "@id": `${SITE_URL}/#organization` },
        }]) }} />
      </Head>
      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Método</p>
          <h1 className="guide-title">{title}</h1>
          <p className="guide-updated">Actualizado: <time dateTime={UPDATED}>{fechaLarga(UPDATED)}</time></p>
        </div>
        <div className="guide-body">
          <p className="guide-lead">
            Una carrera entra en el calendario cuando la hemos visto en la web de quien la organiza, no en un cartel de Instagram ni en un agregador.
            Esto es lo que comprobamos y lo que no podemos garantizar.
          </p>

          <h2 id="criterios">Lo que comprobamos antes de publicar</h2>
          <ol>
            <li><strong>Web oficial.</strong> La fecha y la sede salen de la web del organizador o de su plataforma de inscripción. Si solo hay un calendario de terceros o una red social, la carrera no se publica o se marca como «Por confirmar».</li>
            <li><strong>Inscripción.</strong> Abrimos la página de inscripción y miramos qué dice: si hay botón para comprar dorsal o cuotas a la venta, la marcamos como abierta; si pone que abre más adelante, «Aún no abierta»; si está agotada o cerrada, así lo indicamos.</li>
            <li><strong>Fecha y sede.</strong> Cuando la prueba dura varios días, guardamos el primero y el último. Si la web oficial y nuestros datos no coinciden, manda la web oficial y corregimos.</li>
            <li><strong>Precio.</strong> Solo publicamos el precio que aparece en la inscripción oficial, normalmente el más bajo («desde»). Si no está publicado, ponemos «Consultar».</li>
            <li><strong>Fecha de comprobación.</strong> Cada ficha dice cuándo se verificó por última vez o, si no tenemos ese dato, cuándo se actualizó el registro.</li>
          </ol>

          <h2 id="como">Cómo lo hacemos</h2>
          <p>
            Cada pocas semanas repasamos todas las carreras futuras con un script que abre la web de cada una y busca señales de inscripción
            («inscríbete», «agotado», «próximamente»…). Lo que el script marca como dudoso lo revisamos a mano, también cuando la inscripción
            va dentro de una plataforma externa. Las webs de agregadores no cuentan como web oficial: si es lo único que hay, la carrera aparece sin botón de inscripción.
          </p>

          <h2 id="limites">Lo que no podemos garantizar</h2>
          <p>
            Los organizadores cambian fechas, precios y plazas sin avisar. Por eso cada ficha enlaza a la inscripción oficial y te pedimos que
            confirmes allí antes de pagar. Nosotros no vendemos dorsales ni cobramos a los organizadores por aparecer.
          </p>

          <h2 id="errores">Si ves un error</h2>
          <p>
            Escríbenos a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> con el enlace de la ficha y la fuente oficial, y lo corregimos.
            Si organizas una carrera, puedes <a href="/organizadores">enviárnosla desde la página de organizadores</a>.
          </p>
          <p>Empieza por el <a href="/calendario">calendario completo</a> o por <a href="/que-es-una-carrera-hibrida">qué es una carrera híbrida</a>.</p>
        </div>
      </article>
    </PageShell>
  );
}
