/**
 * Preparación del artículo en el servidor (getStaticProps):
 * enlaces de afiliado, ids en los H2 para el índice, tablas con scroll propio
 * e imágenes convertidas a bloques que se pintan con next/image.
 */
import { renderAffiliateHtml } from "./affiliate";
import { posts, getPostBySlug } from "./posts";
import { summary, ogImageUrl, CATEGORY_BY_NAME } from "./blog";
import { BLOG_SEO } from "./blog-seo";

const slugify = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/<[^>]+>/g, "")
  .replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const strip = s => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();

export function prepareArticle(slug) {
  const base = getPostBySlug(slug);
  if (!base) return null;
  const raw = { ...base, ...(BLOG_SEO[slug] || {}) };
  let html = renderAffiliateHtml(raw.content, { category: raw.category });

  // Índice: ids estables en los H2
  const toc = [];
  const used = new Set();
  html = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, attrs = "", inner) => {
    const text = strip(inner);
    let id = (attrs.match(/id="([^"]+)"/) || [])[1] || slugify(text) || `seccion-${toc.length + 1}`;
    while (used.has(id)) id += "-2";
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  // Tablas: siempre dentro de un contenedor con scroll horizontal propio
  html = html.replace(/<div style="overflow-x:\s*auto;?">\s*(<table[\s\S]*?<\/table>)\s*<\/div>/g, "$1");
  html = html.replace(/<table[\s\S]*?<\/table>/g, t => `<div class="table-wrap" tabindex="0" role="region" aria-label="Tabla">${t.replace(/\sstyle="[^"]*"/g, "")}</div>`);

  // Imágenes: bloques para next/image (sin estilos en línea)
  html = html.replace(/<img\s[^>]*src="([^"]+)"[^>]*?(?:alt="([^"]*)")?[^>]*>/g, (m, src, alt) => {
    const a = alt || (m.match(/alt="([^"]*)"/) || [])[1] || "";
    return `<div data-block="img" data-src="${src}" data-alt="${a.replace(/"/g, "&quot;")}"></div>`;
  });

  const s = summary(raw);
  // La foto de portada no se repite como primera imagen del cuerpo
  if (!s.generatedImage) {
    const start = html.indexOf(`<div data-block="img" data-src="${s.image}"`);
    if (start >= 0) html = html.slice(0, start) + html.slice(html.indexOf("</div>", start) + 6);
  }
  const words = strip(html).split(/\s+/).filter(Boolean).length;
  const cat = CATEGORY_BY_NAME[raw.category] || null;
  const related = posts
    .filter(p => p.slug !== raw.slug && p.category === raw.category)
    .map(summary)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  // Si la categoría tiene menos de 3, completa con los más recientes
  if (related.length < 3) {
    for (const p of posts.map(summary).sort((a, b) => b.date.localeCompare(a.date))) {
      if (related.length >= 3) break;
      if (p.slug !== raw.slug && !related.some(r => r.slug === p.slug)) related.push(p);
    }
  }

  return {
    post: {
      slug: raw.slug,
      title: raw.title,
      metaTitle: raw.metaTitle || raw.title,
      h1: raw.h1 || raw.title,
      description: raw.description || raw.excerpt || "",
      excerpt: raw.excerpt || "",
      category: raw.category,
      catSlug: cat?.slug || null,
      date: raw.date,
      updated: raw.updated || raw.date,
      readTime: raw.readTime || `${Math.max(1, Math.round(words / 220))} min`,
      words,
      image: s.image,
      imageAlt: s.imageAlt,
      generatedImage: s.generatedImage,
      ogImage: ogImageUrl(raw, { absolute: true }),
      faq: raw.faq || null,
      racesFilter: raw.racesFilter || null,
      hasAffiliate: /data-aff="/.test(html),
      content: html,
    },
    toc,
    related,
  };
}
