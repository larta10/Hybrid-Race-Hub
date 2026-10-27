import { allSummaries, PER_PAGE } from "../lib/blog";
import { CATEGORIES } from "../lib/blog-categories";
import { SUPABASE_URL, ANON_KEY } from "../lib/shared";

import { SITE_URL } from "../lib/site";
import { fetchUpcomingRaces, lastUpdated } from "../lib/races-server";
import { HYBRID_CITIES, raceMatchesCity } from "../lib/hybrid-cities";
import { CENTER_CITIES } from "../lib/center-cities";
import { upcomingVerifiedEvents } from "../lib/verified-events";
import { todayISO } from "../lib/races-server";
const BASE = `${SITE_URL}`;

// Última modificación real del contenido o de las metas de cada plantilla estática.
// Actualiza la fecha cuando cambies el texto visible o el title/description de la página.
const STATIC_LASTMOD = {
  "/que-es-una-carrera-hibrida": "2026-10-27",
  "/plan-entrenamiento": "2026-10-27",
  "/centros-entrenamiento": "2026-10-27",
  "/calculadora-hyrox": "2026-10-27",
  "/race-hub": "2026-10-27",
  "/comunidad": "2026-10-27",
  "/productos": "2026-10-27",
  "/sobre-nosotros": "2026-10-27",
  "/contacto-organizadores": "2026-10-27",
};
const RANKINGS_LASTMOD = "2026-10-27";
// Fecha del último cambio de las plantillas de home, calendario y regiones
const TEMPLATE_LASTMOD = "2026-10-27";

const PRODUCT_SLUGS = [
  "relojes",
  "zapatillas-trail",
  "zapatillas-hyrox",
  "zapatillas-crossfit",
  "pulsometros",
  "ropa",
];

function buildSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  const today = new Date().toISOString().split("T")[0];
  const max = (...d) => d.filter(Boolean).sort().pop();
  const posts = allSummaries();
  const newest = posts.reduce((m, p) => (p.updated > m ? p.updated : m), "2026-01-01");
  const blogPages = Math.max(1, Math.ceil((posts.length - 1) / PER_PAGE));
  const races = [...(await fetchUpcomingRaces()), ...upcomingVerifiedEvents(todayISO())];
  const racesLastmod = max(lastUpdated(races), TEMPLATE_LASTMOD);
  // Solo ciudades con carreras futuras (las demás llevan noindex); lastmod = último cambio de sus carreras
  const cityPages = HYBRID_CITIES
    .map((c) => ({ slug: c.slug, races: races.filter((r) => raceMatchesCity(r, c)) }))
    .filter((c) => c.races.length)
    .map((c) => ({ slug: c.slug, lastmod: max(lastUpdated(c.races), TEMPLATE_LASTMOD) }));

  // Artículos de /comunidad (Supabase). Si falla, el sitemap se genera igual.
  let comunidad = [];
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=slug,published_at&order=published_at.desc`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (r.ok) comunidad = (await r.json()).filter((a) => a.slug);
  } catch {}

  const urls = [
    { loc: `${BASE}/`,                          lastmod: racesLastmod, changefreq: "daily",   priority: "1.0" },
    { loc: `${BASE}/que-es-una-carrera-hibrida`, lastmod: STATIC_LASTMOD["/que-es-una-carrera-hibrida"], changefreq: "weekly",  priority: "0.9" },
    { loc: `${BASE}/calendario`,                lastmod: racesLastmod, changefreq: "daily",   priority: "0.9" },
    { loc: `${BASE}/blog`,                      lastmod: newest, changefreq: "weekly",  priority: "0.8" },
    ...["/plan-entrenamiento", "/centros-entrenamiento", "/calculadora-hyrox", "/race-hub", "/comunidad", "/productos", "/sobre-nosotros", "/contacto-organizadores"]
      .map((p) => ({ loc: `${BASE}${p}`, lastmod: STATIC_LASTMOD[p], changefreq: "monthly", priority: p === "/centros-entrenamiento" ? "0.8" : "0.6" })),

    ...PRODUCT_SLUGS.map((slug) => ({
      loc: `${BASE}/productos/${slug}`,
      lastmod: RANKINGS_LASTMOD,
      changefreq: "monthly",
      priority: "0.7",
    })),

    ...cityPages.map(({ slug, lastmod }) => ({
      loc: `${BASE}/carreras-hibridas/${slug}`,
      lastmod,
      changefreq: "daily",
      priority: "0.8",
    })),

    // Centros por ciudad (solo ciudades con 3 o más centros)
    ...CENTER_CITIES.map((c) => ({
      loc: `${BASE}/centros-entrenamiento/${c.slug}`,
      lastmod: TEMPLATE_LASTMOD,
      changefreq: "monthly",
      priority: "0.6",
    })),

    // Artículos con su fecha real de última actualización
    ...posts.map((p) => ({
      loc: `${BASE}/blog/${p.slug}`,
      lastmod: p.updated,
      changefreq: "monthly",
      priority: "0.7",
    })),
    // Categorías del blog y páginas 2, 3… del listado
    ...CATEGORIES.map((c) => ({
      loc: `${BASE}/blog/categoria/${c.slug}`,
      lastmod: posts.filter((p) => p.catSlug === c.slug).reduce((m, p) => (p.updated > m ? p.updated : m), "2026-01-01"),
      changefreq: "weekly",
      priority: "0.6",
    })),
    ...Array.from({ length: blogPages - 1 }, (_, i) => ({
      loc: `${BASE}/blog/pagina/${i + 2}`,
      lastmod: newest,
      changefreq: "weekly",
      priority: "0.4",
    })),

    ...comunidad.map((a) => ({
      loc: `${BASE}/comunidad/${encodeURIComponent(a.slug)}`,
      lastmod: a.published_at ? String(a.published_at).split("T")[0] : today,
      changefreq: "monthly",
      priority: "0.5",
    })),
  ];

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(buildSitemap(urls));
  res.end();

  return { props: {} };
}
