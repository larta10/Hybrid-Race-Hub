/**
 * Capa de datos del blog: categorías, resúmenes de artículos (sin el cuerpo) y paginación.
 * Las páginas de listado solo reciben resúmenes para no enviar todo el contenido al navegador.
 */
import { posts } from "./posts";
import { SITE_URL } from "./site";

export const PER_PAGE = 12;

export { CATEGORIES, CATEGORY_BY_NAME, CATEGORY_BY_SLUG } from "./blog-categories";
import { CATEGORY_BY_NAME } from "./blog-categories";

/** URL de la imagen generada (Open Graph) de un artículo. /og se reescribe a /api/og. */
export function ogImageUrl(p, { absolute = false } = {}) {
  const q = new URLSearchParams({ title: p.h1 || p.title, cat: p.category || "Blog" });
  return `${absolute ? SITE_URL : ""}/og?${q}`;
}

/** Resumen ligero para listados (sin el HTML del artículo). */
export function summary(p) {
  const words = (p.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    category: p.category,
    catSlug: CATEGORY_BY_NAME[p.category]?.slug || null,
    date: p.date,
    updated: p.updated || p.date,
    readTime: p.readTime || `${Math.max(1, Math.round(words / 220))} min`,
    image: p.cover || p.image || ogImageUrl(p),
    imageAlt: p.imageAlt || p.title,
    generatedImage: !(p.cover || p.image),
    featured: !!p.featured,
  };
}

export function allSummaries() {
  return posts.map(summary).sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.title.localeCompare(b.title));
}

export function featuredPost(list = allSummaries()) {
  return list.find(p => p.featured) || list[0];
}

export function paginate(list, page) {
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  return { items: list.slice((page - 1) * PER_PAGE, page * PER_PAGE), page, pages };
}

export { fechaLarga, mesAno } from "./dates";
