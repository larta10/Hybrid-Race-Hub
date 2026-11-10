import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_NAME, SITE_EMAIL, SITE_INSTAGRAM, ROBOTS_INDEX } from "../lib/site";

const PATH = "/sobre-nosotros";
const UPDATED = "2026-11-10";

export default function SobreNosotros() {
  const url = `${SITE_URL}${PATH}`;
  const desc = "Quién está detrás de Hybrid Race Hub, por qué existe, cómo revisamos las fechas del calendario, cómo elegimos los productos y cómo funciona la afiliación.";
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": `Sobre nosotros | ${SITE_NAME}`,
      "url": url,
      "inLanguage": "es-ES",
      "dateModified": UPDATED,
      "about": { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": SITE_NAME,
      "url": `${SITE_URL}/`,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon-512.png`, "width": 512, "height": 512 },
      "email": SITE_EMAIL,
      "contactPoint": { "@type": "ContactPoint", "email": SITE_EMAIL, "contactType": "customer support", "availableLanguage": ["es"] },
      "sameAs": [SITE_INSTAGRAM],
      "areaServed": { "@type": "Country", "name": "España" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Sobre nosotros", "item": url },
      ],
    },
  ];

  return (
    <PageShell activePath={PATH}>
      <Head>
        <title>Sobre nosotros: quién hace Hybrid Race Hub</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Sobre nosotros | Hybrid Race Hub" />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Sobre nosotros" }]} />
          <p className="section-label">Quiénes somos</p>
          <h1 className="guide-title">Sobre Hybrid Race Hub</h1>
          <p className="guide-updated">Última actualización: <time dateTime={UPDATED}>10 de noviembre de 2026</time></p>
        </div>

        <div className="guide-body">
          <p className="guide-lead">
            Hybrid Race Hub es un calendario y una guía de carreras híbridas en España: HYROX, carreras de obstáculos (OCR), Spartan y DEKA.
            Lo hacemos atletas que compiten en estas pruebas, para que encontrar fecha, prepararla y elegir material no te cueste una tarde de pestañas abiertas.
          </p>

          <h2>¿Quién está detrás?</h2>
          <p>
            [COMPLETAR PABLO: tu nombre y apellido, ciudad, y desde cuándo compites en carreras híbridas.]
          </p>
          <p>
            [COMPLETAR PABLO: tu experiencia real: qué pruebas has hecho (por ejemplo, ediciones de HYROX con categoría y tiempo, Spartan Race con distancia), si entrenas en box o por tu cuenta, y cualquier titulación deportiva que tengas. Solo datos verdaderos y comprobables.]
          </p>
          <p>
            [COMPLETAR PABLO: opcional, una foto tuya compitiendo (súbela a /public/equipo/ y avísame para añadirla) y enlace a tu perfil de Instagram o Strava si es público.]
          </p>

          <h2>¿Por qué existe esta web?</h2>
          <p>
            Las fechas de las carreras híbridas están repartidas entre webs de organizadores, redes sociales y calendarios genéricos de running.
            Aquí las juntamos en un solo sitio, con filtros por comunidad, mes y formato, y las enlazamos siempre a la web oficial de cada organizador para que te inscribas allí.
          </p>
          <p>
            Además publicamos guías para preparar tu primera carrera, una calculadora de tiempos HYROX y un generador de planes de entrenamiento gratuito.
          </p>

          <h2>¿De dónde salen los datos del calendario?</h2>
          <ul>
            <li>Revisamos las webs y redes de los organizadores y añadimos cada prueba con su fecha, lugar, formato y precio cuando está publicado.</li>
            <li>Si un dato no está confirmado, no lo inventamos: lo dejamos en blanco o indicamos que hay que consultarlo en la web oficial.</li>
            <li>Solo enlazamos a la web del organizador o de su plataforma de inscripción. Si no tenemos una web oficial fiable, no ponemos enlace.</li>
            <li>¿Organizas una prueba o has visto un error? Escríbenos a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> o usa el <a href="/contacto-organizadores">formulario para organizadores</a>.</li>
          </ul>

          <h2>¿Cómo escribimos las guías de material?</h2>
          <ol>
            <li><strong>Primero el uso</strong>: explicamos qué pide cada prueba (moqueta y trineo en HYROX, barro y agua en OCR) y qué tiene que tener el material para eso.</li>
            <li><strong>Criterios antes que modelos</strong>: si citamos un modelo es como ejemplo de un tipo de producto, no como lista de la compra.</li>
            <li><strong>Datos técnicos</strong>: comparamos peso, drop, autonomía, sensores y agarre, no las descripciones de marketing.</li>
            <li><strong>Revisión periódica</strong>: cuando cambia algo relevante, actualizamos la guía y su fecha de revisión.</li>
          </ol>

          <h2>Independencia</h2>
          <p>
            No tenemos enlaces de afiliado ni cobramos a marcas por aparecer en las guías. Si recomendamos algo, es porque lo usaríamos.
            Cuando enlazamos a otro proyecto, como Buscar Pareja Híbrida, es porque creemos que te sirve.
          </p>

          <h2>Contacto</h2>
          <ul>
            <li>Email: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a></li>
            <li>Instagram: <a href={SITE_INSTAGRAM} target="_blank" rel="noopener noreferrer">@hybridracehub_spain</a></li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
