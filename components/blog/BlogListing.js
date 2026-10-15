import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import PageShell, { Breadcrumbs } from "../PageShell";
import RaceList from "../RaceList";
import { SITE_URL, SITE_NAME } from "../../lib/site";
import { fechaLarga } from "../../lib/dates";

function track(event, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params, page_path: window.location.pathname });
}

const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function PostCard({ post, priority = false, large = false }) {
  return (
    <article className={`bcard${large ? " bcard--large" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="bcard-link">
        <div className="bcard-img">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            priority={priority}
            unoptimized={post.dynamicImage}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="bcard-body">
          <span className="bcard-cat">{post.category}</span>
          {large ? <h2 className="bcard-title">{post.title}</h2> : <h3 className="bcard-title">{post.title}</h3>}
          <p className="bcard-excerpt">{post.excerpt}</p>
          <p className="bcard-meta">
            <time dateTime={post.date}>{fechaLarga(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{post.readTime} de lectura</span>
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function BlogListing({
  path, title, description, h1, intro, items, all, featured = null,
  categories, activeCat = null, page = 1, pages = 1, upcoming = [], crumbs,
}) {
  const [q, setQ] = useState("");
  const timer = useRef(null);
  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return null;
    return all.filter(p => norm(`${p.title} ${p.excerpt} ${p.category}`).includes(t));
  }, [q, all]);

  useEffect(() => {
    if (!q.trim()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => track("blog_search", { search_term: q.trim().slice(0, 80), results: results?.length ?? 0 }), 900);
    return () => clearTimeout(timer.current);
  }, [q, results]);

  const url = `${SITE_URL}${path}`;
  const pageHref = n => (n === 1 ? (activeCat ? `/blog/categoria/${activeCat}` : "/blog") : `${activeCat ? `/blog/categoria/${activeCat}` : "/blog"}/pagina/${n}`);
  const shown = items.filter(p => !featured || p.slug !== featured.slug);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": h1,
      "description": description,
      "url": url,
      "inLanguage": "es-ES",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": items.map((p, i) => ({ "@type": "ListItem", "position": (page - 1) * 12 + i + 1, "url": `${SITE_URL}/blog/${p.slug}`, "name": p.title })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((c, i) => ({ "@type": "ListItem", "position": i + 1, "name": c.name, "item": c.href ? `${SITE_URL}${c.href}` : url })),
    },
  ];

  return (
    <PageShell activePath="/blog">
      <Head>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        {page > 1 && <link rel="prev" href={`${SITE_URL}${pageHref(page - 1)}`} />}
        {page < pages && <link rel="next" href={`${SITE_URL}${pageHref(page + 1)}`} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="blog-wrap">
        <div className="blog-head">
          <Breadcrumbs items={crumbs} />
          <h1 className="blog-h1">{h1}{page > 1 ? ` · página ${page}` : ""}</h1>
          {intro && page === 1 && <p className="blog-intro">{intro}</p>}
        </div>

        <nav className="blog-cats" aria-label="Categorías del blog">
          <Link href="/blog" className={`blog-cat${!activeCat ? " blog-cat--on" : ""}`} aria-current={!activeCat ? "page" : undefined}>Todo</Link>
          {categories.map(c => (
            <Link key={c.slug} href={`/blog/categoria/${c.slug}`} className={`blog-cat${activeCat === c.slug ? " blog-cat--on" : ""}`} aria-current={activeCat === c.slug ? "page" : undefined}>
              {c.name}
            </Link>
          ))}
        </nav>

        <label className="blog-search">
          <span className="sr-only">Buscar en el blog</span>
          <input type="search" inputMode="search" enterKeyHint="search" autoComplete="off"
            placeholder="Buscar en el blog: HYROX, zapatillas, plan…" value={q} onChange={e => setQ(e.target.value)} />
        </label>

        {results ? (
          <section aria-live="polite">
            <p className="blog-results">{results.length === 0 ? `Nada para «${q.trim()}». Prueba con «HYROX», «OCR» o «zapatillas».` : `${results.length} artículo${results.length !== 1 ? "s" : ""} para «${q.trim()}»`}</p>
            <div className="blog-grid">{results.map(p => <PostCard key={p.slug} post={p} />)}</div>
          </section>
        ) : (
          <>
            {featured && page === 1 && (
              <section className="blog-featured" aria-label="Artículo destacado">
                <PostCard post={featured} large priority />
              </section>
            )}
            <div className="blog-grid">
              {shown.map((p, i) => <PostCard key={p.slug} post={p} priority={!featured && i < 2} />)}
            </div>
            {pages > 1 && (
              <nav className="blog-pages" aria-label="Paginación">
                {page > 1 && <Link href={pageHref(page - 1)} rel="prev">Anteriores</Link>}
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  n === page
                    ? <span key={n} aria-current="page">{n}</span>
                    : <Link key={n} href={pageHref(n)}>{n}</Link>
                ))}
                {page < pages && <Link href={pageHref(page + 1)} rel="next">Siguientes</Link>}
              </nav>
            )}
          </>
        )}

        {upcoming.length > 0 && (
          <section className="blog-races" aria-labelledby="proximas">
            <h2 id="proximas" className="section-title">Próximas carreras</h2>
            <p className="blog-races-sub">Las tres carreras híbridas más cercanas en el calendario, con enlace a la web oficial.</p>
            <RaceList races={upcoming} pageUrl={url} compact />
            <Link href="/calendario" className="btn-line">Ver el calendario completo</Link>
          </section>
        )}
      </div>
    </PageShell>
  );
}
