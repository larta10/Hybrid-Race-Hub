/* Guía editorial de material: qué mirar al elegir. Sin enlaces de compra ni precios. URL histórica /productos/<slug>. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import GuideCallout from "../../components/GuideCallout";
import Related from "../../components/Related";
import { GUIAS, GUIA_BY_SLUG, GUIAS_UPDATED } from "../../lib/guias-material";
import { SITE_URL, SITE_NAME, ROBOTS_INDEX, breadcrumbLd } from "../../lib/site";
import { fechaLarga } from "../../lib/dates";

export async function getStaticPaths() {
  return { paths: GUIAS.map(g => ({ params: { categoria: g.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const guia = GUIA_BY_SLUG[params.categoria];
  if (!guia) return { notFound: true };
  const others = GUIAS.filter(g => g.slug !== guia.slug).map(g => ({ href: `/productos/${g.slug}`, label: g.h1 }));
  return { props: { guia, others } };
}

export default function GuiaMaterial({ guia, others = [] }) {
  const url = `${SITE_URL}/productos/${guia.slug}`;
  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Guías de material", href: "/productos" }, { name: guia.nav }];
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.h1,
    description: guia.metaDesc,
    url,
    mainEntityOfPage: url,
    dateModified: GUIAS_UPDATED,
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` } },
    image: `${SITE_URL}/og-image.png`,
  };
  const faqLd = guia.faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guia.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  return (
    <PageShell activePath="/productos">
      <Head>
        <title>{guia.metaTitle}</title>
        <meta name="description" content={guia.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={guia.metaTitle} />
        <meta property="og:description" content={guia.metaDesc} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, url)) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      </Head>

      <article className="guide">
        <div className="guide-head">
          <Breadcrumbs items={crumbs} />
          <p className="section-label">Guía de material · {guia.eyebrow}</p>
          <h1 className="guide-title">{guia.h1}</h1>
          <p className="guide-updated">Actualizado: <time dateTime={GUIAS_UPDATED}>{fechaLarga(GUIAS_UPDATED)}</time></p>
        </div>

        <div className="guide-body">
          {guia.intro.map((p, i) => <p key={i} className={i === 0 ? "guide-lead" : undefined}>{p}</p>)}

          <h2 id="que-mirar">Qué mirar antes de elegir</h2>
          <ul>
            {guia.criteria.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}
          </ul>

          <h2 id="errores">Errores comunes</h2>
          <ul>
            {guia.errores.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}
          </ul>

          <h2 id="segun-perfil">Qué conviene según tu perfil</h2>
          {guia.perfiles.map(([t, d]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}

          <h2 id="ejemplos">Algunos modelos de referencia</h2>
          <p>
            No es una lista de la compra ni un orden de preferencia: son modelos conocidos que sirven de ejemplo para ver
            en qué se diferencian. Mira las especificaciones actuales en la web de cada marca, porque cambian con cada versión.
          </p>
          <div className="table-wrap">
            <table className="guide-table">
              <thead><tr>{guia.table.headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {guia.table.rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
          <ul>
            {guia.modelos.map(([name, forWho]) => <li key={name}><strong>{name}:</strong> {forWho.charAt(0).toLowerCase() + forWho.slice(1)}</li>)}
          </ul>

          {guia.faq?.length > 0 && (
            <>
              <h2 id="faq">Preguntas frecuentes</h2>
              <div className="faq-plain">
                {guia.faq.map((f, i) => (
                  <details key={i} className="faq-d" open={i === 0}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </>
          )}

          <GuideCallout context="ranking" />
          <Related title="Para preparar la carrera" links={guia.relacionados.map(([href, label]) => ({ href, label }))} />
          <Related title="Otras guías de material" links={others} />
        </div>
      </article>
    </PageShell>
  );
}
