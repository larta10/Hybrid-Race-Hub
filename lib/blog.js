/**
 * Capa de datos del blog: categorías, resúmenes de artículos (sin el cuerpo) y paginación.
 * Las páginas de listado solo reciben resúmenes para no enviar todo el contenido al navegador.
 */
import { posts } from "./posts";
import { SITE_URL } from "./site";

export const PER_PAGE = 12;

export { CATEGORIES, CATEGORY_BY_NAME, CATEGORY_BY_SLUG } from "./blog-categories";
import { CATEGORY_BY_NAME } from "./blog-categories";

/**
 * Imagen generada (Open Graph) de un artículo: PNG estático en public/og/blog/<slug>.png
 * (lo crea scripts/gen-og.mjs). Si aún no existe, se usa la ruta dinámica /og.
 */
export function ogImageUrl(p, { absolute = false } = {}) {
  let path;
  try {
    const fs = require("fs");
    if (fs.existsSync(`${process.cwd()}/public/og/blog/${p.slug}.png`)) path = `/og/blog/${p.slug}.png`;
  } catch {}
  if (!path) path = `/og?${new URLSearchParams({ title: p.h1 || p.title, cat: p.category || "Blog" })}`;
  return `${absolute ? SITE_URL : ""}${path}`;
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
    // La imagen generada repite el título de la tarjeta: alt vacío para no leerlo dos veces
    imageAlt: p.cover || p.image ? (p.imageAlt || p.title) : "",
    generatedImage: !(p.cover || p.image),
    dynamicImage: !(p.cover || p.image) && ogImageUrl(p).startsWith("/og?"),
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
