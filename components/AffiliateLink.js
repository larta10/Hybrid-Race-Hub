import { buildAmazonUrl, getProduct, AFFILIATE_REL } from "../lib/affiliate";

/**
 * Enlace de afiliado a Amazon.es. El evento "amazon_click" lo envía el listener
 * delegado de pages/_app.js leyendo los data-aff-* (producto, categoría, posición).
 */
export default function AffiliateLink({ id, product, position, className = "", children }) {
  const p = product || getProduct(id);
  return (
    <a
      href={buildAmazonUrl(p)}
      target="_blank"
      rel={AFFILIATE_REL}
      className={`aff-link ${className}`.trim()}
      data-aff={p.id}
      data-aff-name={p.nombre}
      data-aff-cat={p.categoria || ""}
      data-aff-pos={position || undefined}
    >
      {children || "Ver precio en Amazon"}
    </a>
  );
}
