/* Índice de guías de material (URL histórica /productos). Sin enlaces de compra ni precios. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../components/PageShell";
import GuideCallout from "../components/GuideCallout";
import Related from "../components/Related";
import { GUIAS, GUIAS_UPDATED } from "../lib/guias-material";
import { SITE_URL, SITE_NAME, ROBOTS_INDEX, breadcrumbLd } from "../lib/site";
import { fechaLarga } from "../lib/dates";

const TITLE = "Guías de material para HYROX y OCR: cómo elegir";
const DESC = "Qué mirar al elegir zapatillas, reloj GPS, pulsómetro y ropa para HYROX, OCR y carreras híbridas: criterios, errores comunes y qué conviene según tu perfil.";

export default function Productos() {
  const url = `${SITE_URL}/productos`;
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Guías de material" }];
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESC,
    url,
    mainEntityOfPage: url,
    dateModified: GUIAS_UPDATED,
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` } },
    image: `${SITE_URL}/og-image.png`,
  };
  return (
    <PageShell activePath="/productos">
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
      </Head>

      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Material</p>
          <h1 className="guide-title">Guías de material para HYROX y OCR</h1>
          <p className="guide-updated">Actualizado: <time dateTime={GUIAS_UPDATED}>{fechaLarga(GUIAS_UPDATED)}</time></p>
        </div>

        <div className="guide-body">
          <p className="guide-lead">
            Para tu primera carrera híbrida casi todo lo que necesitas ya lo tienes. Lo que sí conviene es saber qué pide cada prueba
            antes de gastar: una HYROX se corre sobre moqueta y te hace empujar un trineo; una OCR te mete en barro y agua.
          </p>
          <p>
            Estas guías no son rankings ni tienen enlaces de compra. Explican qué mirar, los errores que más vemos y qué tipo de
            producto encaja según cómo entrenas y qué carrera vas a hacer.
          </p>

          <h2 id="guias">Elige la guía</h2>
          <ul>
            {GUIAS.map(g => (
              <li key={g.slug}>
                <a href={`/productos/${g.slug}`}><strong>{g.h1}</strong></a>. {g.criteria.map(c => c[0].toLowerCase()).join(", ")}.
              </li>
            ))}
          </ul>

          <h2 id="por-donde-empezar">Por dónde empezar</h2>
          <ol>
            <li><strong>Zapatillas.</strong> Es lo único que de verdad cambia la carrera. Estables para HYROX, con taco para OCR.</li>
            <li><strong>Ropa técnica.</strong> Nada de algodón. Lo que ya uses para entrenar suele valer.</li>
            <li><strong>Reloj y pulsómetro.</strong> Útiles para entrenar mejor, no imprescindibles para competir.</li>
          </ol>

          <GuideCallout context="ranking" />
          <Related title="Para preparar la carrera" links={[
            { href: "/calendario", label: "Calendario de carreras híbridas en España" },
            { href: "/blog/material-hyrox-carreras-obstaculos", label: "Material para HYROX y OCR, por prioridad" },
            { href: "/blog/plan-entrenamiento-hyrox-12-semanas", label: "Plan de entrenamiento HYROX de 12 semanas" },
            { href: "/centros-entrenamiento", label: "Dónde entrenar: centros por ciudad" },
          ]} />
        </div>
      </article>
    </PageShell>
  );
}
