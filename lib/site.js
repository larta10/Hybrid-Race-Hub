/**
 * Dominio oficial del sitio: https://hybridracehub.com (SIN www).
 * Única fuente de verdad para canonicals, og:url, sitemap, robots.txt y JSON-LD.
 * No hay redirecciones de dominio en el código: la de www -> sin www, si se
 * configura, la gestiona Vercel desde su panel.
 */
export const SITE_URL = "https://hybridracehub.com";
export const SITE_NAME = "Hybrid Race Hub";
export const SITE_EMAIL = "hola@hybridracehub.com";
export const SITE_INSTAGRAM = "https://www.instagram.com/hybridracehub_spain";

/** Title con la marca al final solo si cabe en 60 caracteres (si no, sin marca). */
export function pageTitle(t) {
  const full = `${t} | ${SITE_NAME}`;
  return full.length <= 60 ? full : t;
}

/** JSON-LD BreadcrumbList a partir de [{ name, href }] (el último puede ir sin href). */
export function breadcrumbLd(items, currentUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((c, i) => ({
      "@type": "ListItem", "position": i + 1, "name": c.name,
      "item": c.href ? `${SITE_URL}${c.href === "/" ? "/" : c.href}` : currentUrl,
    })),
  };
}

/**
 * Meta description entre 140 y 155 caracteres: devuelve el primer candidato que
 * cae en el rango; si ninguno, el más largo que no pase de 155; si todos se pasan,
 * recorta el primero por palabra.
 */
export function fitDesc(candidates) {
  const list = candidates.filter(Boolean).map(s => s.replace(/\s+/g, " ").trim());
  const ok = list.find(s => s.length >= 140 && s.length <= 155);
  if (ok) return ok;
  const under = list.filter(s => s.length <= 155).sort((a, b) => b.length - a.length)[0];
  if (under) return under;
  const cut = list[0].slice(0, 154);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,:;.\s]+$/, "") + "…";
}
