/**
 * Enlaces de afiliado de Amazon. ÚNICO sitio del proyecto donde se escriben URLs de Amazon.
 * Comprobado por `npm run qa:links` (scripts/check-affiliate-links.mjs).
 */
import { PRODUCT_BY_ID } from "../data/products";

export const AMAZON_TAG = "hybridracehub-21";
const AMAZON_ES = "https://www.amazon.es";
const ASIN_RE = /^[A-Z0-9]{10}$/;

export const AFFILIATE_REL = "sponsored nofollow noopener";

/** URL de Amazon.es con nuestro tag: ficha si el ASIN es válido, búsqueda si no. */
export function buildAmazonUrl(product) {
  if (!product) return `${AMAZON_ES}/?tag=${AMAZON_TAG}`;
  const asin = product.asin && String(product.asin).toUpperCase();
  if (asin && ASIN_RE.test(asin) && product.asinDisponible !== false) {
    return `${AMAZON_ES}/dp/${asin}?tag=${AMAZON_TAG}`;
  }
  const q = product.searchQuery || product.nombre || "";
  return `${AMAZON_ES}/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`;
}

export function getProduct(id) {
  const p = PRODUCT_BY_ID[id];
  if (!p) throw new Error(`Producto desconocido en data/products.js: "${id}"`);
  return p;
}

/**
 * Normaliza una URL de Amazon que viene de fuera (p. ej. Supabase) a amazon.es + tag.
 * Si no es de Amazon, la devuelve tal cual.
 */
export function normalizeAmazonUrl(url) {
  if (!url) return url;
  let u;
  try { u = new URL(url); } catch { return url; }
  if (!/(^|\.)amazon\.[a-z.]+$|(^|\.)amzn\.(to|eu)$/i.test(u.hostname)) return url;
  const asin = (u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i) || [])[1];
  if (asin) return buildAmazonUrl({ asin, asinDisponible: true });
  const k = u.searchParams.get("k") || u.searchParams.get("field-keywords");
  return buildAmazonUrl({ searchQuery: k || "" });
}

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Para el HTML de los artículos: sustituye <a data-product="id">texto</a>
 * por el enlace completo con tag, rel y atributos de medición.
 */
export function renderAffiliateHtml(html, { category = "" } = {}) {
  let pos = 0;
  return html.replace(/<a data-product="([a-z0-9-]+)"(?: data-cta)?>([\s\S]*?)<\/a>/g, (_, id, text) => {
    const p = getProduct(id);
    pos += 1;
    return `<a href="${esc(buildAmazonUrl(p))}" target="_blank" rel="${AFFILIATE_REL}" class="aff-link" data-aff="${esc(p.id)}" data-aff-name="${esc(p.nombre)}" data-aff-cat="${esc(p.categoria || category)}" data-aff-pos="${pos}">${text}</a>`;
  });
}
