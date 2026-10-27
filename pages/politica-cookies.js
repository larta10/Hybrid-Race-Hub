import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_EMAIL, breadcrumbLd } from "../lib/site";
import { fechaLarga } from "../lib/dates";
import { openConsentSettings } from "../lib/consent";

const PATH = "/politica-cookies";
const UPDATED = "2026-10-27";

const COOKIES = [
  { name: "hrh_consent", who: "Hybrid Race Hub (propia)", type: "Técnica", purpose: "Guardar si aceptas o rechazas la analítica y la publicidad, para no volver a preguntarte.", duration: "12 meses (cookie y almacenamiento local del navegador)" },
  { name: "_ga", who: "Google Ireland Ltd. (Google Analytics 4)", type: "Analítica", purpose: "Distinguir visitantes de forma anónima para contar visitas y páginas vistas.", duration: "2 años" },
  { name: "_ga_<ID>", who: "Google Ireland Ltd. (Google Analytics 4)", type: "Analítica", purpose: "Mantener el estado de la sesión de Google Analytics.", duration: "2 años" },
  { name: "_gcl_au", who: "Google Ireland Ltd. (Google Ads)", type: "Publicidad", purpose: "Medir si una visita que llega desde un anuncio de Google acaba en una acción útil (por ejemplo, abrir la web de una carrera). Solo se usa cuando hay campañas activas.", duration: "90 días" },
];

export default function PoliticaCookies() {
  const url = `${SITE_URL}${PATH}`;
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Política de cookies" }];
  const desc = "Qué cookies usa Hybrid Race Hub, para qué sirven, cuánto duran y quién las instala (Google Analytics y Google Ads), y cómo retirar tu consentimiento.";
  return (
    <PageShell activePath={PATH}>
      <Head>
        <title>Política de cookies | Hybrid Race Hub</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Política de cookies de Hybrid Race Hub" />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
      </Head>

      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <h1 className="guide-title">Política de cookies</h1>
          <p className="guide-updated">Actualizado: <time dateTime={UPDATED}>{fechaLarga(UPDATED)}</time></p>
        </div>
        <div className="guide-body">
          <p className="guide-lead">
            Una cookie es un pequeño archivo que la web guarda en tu navegador. En Hybrid Race Hub usamos una cookie técnica propia y,
            solo si das tu permiso, cookies de analítica y de publicidad de Google. Hasta que eliges, Google Analytics y Google Ads funcionan
            sin guardar cookies (modo de consentimiento de Google).
          </p>

          <h2 id="lista">Qué cookies usamos</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Cookie</th><th>Titular</th><th>Tipo</th><th>Para qué</th><th>Duración</th></tr></thead>
              <tbody>
                {COOKIES.map(c => (
                  <tr key={c.name}><td><code>{c.name}</code></td><td>{c.who}</td><td>{c.type}</td><td>{c.purpose}</td><td>{c.duration}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            No usamos el píxel de Meta (Facebook o Instagram) ni otras cookies publicitarias. Los enlaces a Amazon son enlaces normales:
            Amazon solo instala sus cookies si entras en su web, con su propia política.
          </p>
          <p>
            En los artículos de podcasts, el reproductor de Spotify no se carga hasta que pulsas «Escuchar aquí». A partir de ese momento,
            Spotify puede instalar sus propias cookies según su política de privacidad.
          </p>

          <h2 id="consentimiento">Cómo aceptar, rechazar o cambiar de opinión</h2>
          <p>
            La primera vez que entras te preguntamos con tres botones del mismo tamaño: <strong>Aceptar</strong>, <strong>Rechazar</strong> y
            <strong> Configurar</strong>. Si rechazas, la web funciona igual.
          </p>
          <p>
            Puedes cambiar tu elección o retirar el consentimiento cuando quieras desde el enlace «Configurar cookies» del pie de cualquier página
            o desde aquí:
          </p>
          <p><button type="button" className="btn-line" onClick={openConsentSettings}>Configurar cookies</button></p>
          <p>
            También puedes borrar las cookies desde tu navegador: en Chrome, Configuración → Privacidad y seguridad → Cookies; en Safari,
            Ajustes → Safari → Avanzado → Datos de sitios web; en Firefox, Ajustes → Privacidad y seguridad.
          </p>

          <h2 id="responsable">Responsable y contacto</h2>
          <p>
            Responsable: Hybrid Race Hub. Para cualquier duda sobre cookies o para ejercer tus derechos de acceso, rectificación, supresión,
            oposición o portabilidad, escríbenos a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>. Google trata los datos de Analytics y Ads
            como encargado o responsable según su política, disponible en policies.google.com.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
