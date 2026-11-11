/* Plantilla de las páginas del plan: cabecera compacta, generador visible sin scroll en móvil
   y, debajo, el contenido propio de cada página (children) con sus preguntas frecuentes. */
import Head from "next/head";
import PageShell, { Breadcrumbs } from "../PageShell";
import PlanWizard from "./PlanWizard";
import { SITE_URL, breadcrumbLd, ROBOTS_INDEX } from "../../lib/site";
import { fechaLarga } from "../../lib/dates";
import s from "./plan.module.css";

const AUTHOR = { "@type": "Organization", name: "Hybrid Race Hub", url: SITE_URL };

export default function PlanLanding({ path, title, description, h1, lead, crumbs, presets, published, updated, faqs = [], children }) {
  const url = `${SITE_URL}${path}`;
  const og = `${SITE_URL}/og?title=${encodeURIComponent(h1)}&cat=${encodeURIComponent("Plan gratis")}`;
  const ld = [
    {
      "@context": "https://schema.org", "@type": "Article",
      headline: h1, description, inLanguage: "es-ES", image: [og],
      datePublished: published, dateModified: updated,
      author: AUTHOR, publisher: { ...AUTHOR, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-icon.svg` } },
      mainEntityOfPage: url, isAccessibleForFree: true,
    },
    breadcrumbLd(crumbs, url),
    // FAQPage solo con las preguntas que se ven en la página
    ...(faqs.length ? [{
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    }] : []),
  ];
  return (
    <PageShell activePath="/plan-entrenamiento-hyrox">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={ROBOTS_INDEX} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content={og} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>

      <div className={s.hero}>
        <Breadcrumbs items={crumbs} />
        <h1 className={s.h1}>{h1}</h1>
        <p className={s.lead}>{lead}</p>
        <PlanWizard presets={presets} />
      </div>

      {children && (
        <article className="guide">
          <div className="guide-body">
            {children}
            {faqs.length > 0 && (
              <>
                <h2 id="faq">Preguntas frecuentes</h2>
                <div className="faq-plain">
                  {faqs.map((f, i) => (
                    <details key={i} className="faq-d" open={i === 0}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}
            {updated && <p className="guide-note" style={{ marginTop: 24 }}>Actualizado el <time dateTime={updated}>{fechaLarga(updated)}</time>.</p>}
          </div>
        </article>
      )}
    </PageShell>
  );
}
