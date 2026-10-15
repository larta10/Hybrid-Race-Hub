import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PageShell, { Breadcrumbs } from "../../components/PageShell";
import ArticleBody from "../../components/blog/ArticleBody";
import { Toc, ShareButtons, AuthorBox, ArticleCta, RelatedPosts } from "../../components/blog/ArticleParts";
import { getAllSlugs } from "../../lib/posts";
import { prepareArticle } from "../../lib/article-server";
import { fechaLarga, mesAno } from "../../lib/dates";
import { SITE_URL, SITE_NAME } from "../../lib/site";
import { PODCASTS } from "../../data/podcasts";
import { fetchUpcomingRaces } from "../../lib/races-server";

export async function getStaticPaths() {
  return { paths: getAllSlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  const data = prepareArticle(params.slug);
  if (!data) return { notFound: true };
  // Artículos con bloque de próximas carreras (Supabase): se regeneran cada hora
  const f = data.post.racesFilter;
  if (f) {
    const re = new RegExp(f.name, "i");
    const races = (await fetchUpcomingRaces()).filter(r => r.modalidad_id === f.modalidadId || re.test(r.nombre || ""));
    return { props: { ...data, races }, revalidate: 3600 };
  }
  return { props: { ...data, races: null } };
}

export default function BlogPost({ post, toc, related, races }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Blog", href: "/blog" },
    ...(post.catSlug ? [{ name: post.category, href: `/blog/categoria/${post.catSlug}` }] : []),
    { name: post.h1 },
  ];
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.h1.slice(0, 110),
      "description": post.description,
      "image": [post.ogImage],
      "datePublished": post.date,
      "dateModified": post.updated,
      "inLanguage": "es-ES",
      "wordCount": post.words,
      "articleSection": post.category,
      "author": { "@type": "Organization", "name": "Equipo de Hybrid Race Hub", "url": `${SITE_URL}/sobre-nosotros` },
      "publisher": {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": SITE_NAME,
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon-512.png`, "width": 512, "height": 512 },
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "url": url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((c, i) => ({ "@type": "ListItem", "position": i + 1, "name": c.name, "item": c.href ? `${SITE_URL}${c.href}` : url })),
    },
  ];
  if (post.faq?.length) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    });
  }
  if (post.category === "Podcasts") {
    schema.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": post.h1,
      "numberOfItems": PODCASTS.length,
      "itemListElement": PODCASTS.map((p, i) => ({
        "@type": "ListItem", "position": i + 1,
        "item": { "@type": "PodcastSeries", "name": p.name, "url": p.apple, "inLanguage": p.lang === "ES" ? "es" : "en" },
      })),
    });
  }

  return (
    <PageShell activePath="/blog">
      <Head>
        <title>{`${post.metaTitle} | ${SITE_NAME}`}</title>
        <meta name="description" content={post.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.description} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:image" content={post.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.updated} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="article-wrap">
        <header className="art-head">
          <Breadcrumbs items={crumbs} />
          {post.catSlug && <Link href={`/blog/categoria/${post.catSlug}`} className="art-cat">{post.category}</Link>}
          <h1 className="art-h1">{post.h1}</h1>
          <p className="art-byline">
            Por <Link href="/sobre-nosotros">el equipo de Hybrid Race Hub</Link>
            <span aria-hidden="true"> · </span>
            Publicado el <time dateTime={post.date}>{fechaLarga(post.date)}</time>
            {post.updated !== post.date && (<><span aria-hidden="true"> · </span>Actualizado: <time dateTime={post.updated}>{mesAno(post.updated)}</time></>)}
            <span aria-hidden="true"> · </span>
            {post.readTime} de lectura
          </p>
          {post.excerpt && <p className="art-lead">{post.excerpt}</p>}
        </header>

        {/* Foto de cabecera solo si es una foto real; la imagen generada (título sobre fondo de marca) se usa para redes y tarjetas */}
        {!post.generatedImage && (
          <div className="art-cover">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 1280px) 1040px, 100vw" style={{ objectFit: "cover" }} />
          </div>
        )}

        <div className="art-layout">
          <div className="art-main">
            <Toc toc={toc} variant="inline" />
            {post.hasAffiliate && (
              <p className="aff-disclosure">
                Este artículo contiene enlaces de afiliado: si compras a través de ellos, Hybrid Race Hub recibe una pequeña comisión sin coste extra para ti.
              </p>
            )}
            <ArticleBody html={post.content} faq={post.faq} races={races} pageUrl={url} className="art-body" />
            <ShareButtons url={url} title={post.h1} />
            <ArticleCta category={post.category} />
            <AuthorBox />
          </div>
          <aside className="art-side">
            <Toc toc={toc} variant="side" />
          </aside>
        </div>

        <RelatedPosts related={related} />
      </div>
    </PageShell>
  );
}
