import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import { SITE_URL, SITE_NAME, SITE_EMAIL, SITE_INSTAGRAM } from "../lib/site";
import { TAG } from "../lib/rankings";

const PATH = "/sobre-nosotros";
const UPDATED = "2026-10-14";

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
        <meta name="robots" content="index, follow" />
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
          <p className="guide-updated">Última actualización: <time dateTime={UPDATED}>14 de octubre de 2026</time></p>
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

          <h2>¿Cómo elegimos los productos de los rankings?</h2>
          <ol>
            <li><strong>Uso real en carrera</strong>: priorizamos modelos usados en competición de OCR o HYROX, por nosotros o por atletas de nuestro entorno.</li>
            <li><strong>Tres franjas de precio</strong>: en cada ranking intentamos que haya una opción económica, una intermedia y una de gama alta.</li>
            <li><strong>Datos técnicos</strong>: comparamos peso, drop, autonomía, sensores y agarre, no las descripciones de marketing.</li>
            <li><strong>Revisión periódica</strong>: cuando sale un modelo nuevo relevante o cambia mucho el precio, actualizamos el ranking y su fecha de revisión.</li>
          </ol>
          <p>[COMPLETAR PABLO: qué productos de los rankings has usado tú personalmente y en qué pruebas.]</p>

          <h2>Política de afiliación</h2>
          <p>
            Algunos enlaces de los rankings llevan a Amazon con nuestro código de afiliado (<code>{TAG}</code>). Si compras a través de ellos,
            Amazon nos paga una pequeña comisión y a ti no te cuesta nada más. Esos enlaces van marcados como patrocinados para los buscadores.
          </p>
          <p>
            La comisión no decide el orden del ranking: si un producto no lo recomendaríamos, no aparece. Como Afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
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
