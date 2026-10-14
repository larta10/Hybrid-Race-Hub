import { getAllSlugs } from "../lib/posts";
import { SUPABASE_URL, ANON_KEY } from "../lib/shared";

import { SITE_URL } from "../lib/site";
const BASE = `${SITE_URL}`;

const PRODUCT_SLUGS = [
  "relojes",
  "zapatillas-trail",
  "zapatillas-hyrox",
  "zapatillas-crossfit",
  "pulsometros",
  "ropa",
];

const CIUDAD_SLUGS = [
  "bilbao",
  "barcelona",
  "madrid",
  "valencia",
  "malaga",
  "sevilla",
  "zaragoza",
  "murcia",
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
  const slugs = getAllSlugs().map((s) => s.params.slug);

  // Artículos de /comunidad (Supabase). Si falla, el sitemap se genera igual.
  let comunidad = [];
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=slug,published_at&order=published_at.desc`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (r.ok) comunidad = (await r.json()).filter((a) => a.slug);
  } catch {}

  const urls = [
    { loc: `${BASE}/`,                          lastmod: today, changefreq: "daily",   priority: "1.0" },
    { loc: `${BASE}/que-es-una-carrera-hibrida`, lastmod: today, changefreq: "weekly",  priority: "0.9" },
    { loc: `${BASE}/calendario`,                lastmod: today, changefreq: "daily",   priority: "0.9" },
    { loc: `${BASE}/blog`,                      lastmod: today, changefreq: "weekly",  priority: "0.8" },
    { loc: `${BASE}/plan-entrenamiento`,        lastmod: today, changefreq: "monthly", priority: "0.8" },
    { loc: `${BASE}/centros-entrenamiento`,     lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${BASE}/calculadora-hyrox`,         lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${BASE}/race-hub`,                  lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${BASE}/comunidad`,                 lastmod: today, changefreq: "weekly",  priority: "0.6" },
    { loc: `${BASE}/productos`,                 lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${BASE}/contacto-organizadores`,    lastmod: today, changefreq: "monthly", priority: "0.5" },

    ...PRODUCT_SLUGS.map((slug) => ({
      loc: `${BASE}/productos/${slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    })),

    ...CIUDAD_SLUGS.map((ciudad) => ({
      loc: `${BASE}/calendario/${ciudad}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    })),

    ...slugs.map((slug) => ({
      loc: `${BASE}/blog/${slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
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
