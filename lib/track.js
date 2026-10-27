/**
 * Medición vía GTM (GTM-5D5D2CH9): solo se empuja al dataLayer.
 * GA4 y Google Ads se configuran dentro de GTM (ver docs/sem/GTM-CONFIG.md);
 * aquí no se carga gtag.js para no contar dos veces.
 *
 * Eventos y parámetros (nombres en snake_case, iguales en GA4):
 *   affiliate_click      { product, ranking, position }
 *   race_outbound_click  { race_name, region }
 *   contact_form_submit  { form }
 *   search_used          { term, search_location }
 *   region_view          { region }
 */
function push(event, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params, page_path: window.location.pathname });
}

export function trackAffiliateClick({ product, ranking, position }) {
  push("affiliate_click", {
    product: String(product || "").slice(0, 100) || undefined,
    ranking: ranking || undefined,
    position: Number(position) || undefined,
  });
}

export function trackRaceOutbound({ race_name, region }) {
  push("race_outbound_click", { race_name: String(race_name || "").slice(0, 100), region: region || undefined });
}

export function trackContactSubmit(form = "contacto") {
  push("contact_form_submit", { form });
}

// Las búsquedas se envían cuando el usuario deja de escribir, no en cada tecla
let searchTimer = null;
export function trackSearch(term, search_location) {
  const t = String(term || "").trim();
  if (typeof window === "undefined" || t.length < 2) return;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => push("search_used", { term: t.slice(0, 60).toLowerCase(), search_location }), 1200);
}

export function trackRegionView(region) {
  push("region_view", { region });
}
