// Feed RSS del blog: /rss.xml (todos los artículos, del más reciente al más antiguo)
import { allSummaries } from "../lib/blog";
import { posts } from "../lib/posts";
import { SITE_URL, SITE_NAME } from "../lib/site";

const esc = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = iso => new Date(`${iso}T08:00:00+02:00`).toUTCString();

export async function getServerSideProps({ res }) {
  const list = allSummaries();
  const bySlug = Object.fromEntries(posts.map(p => [p.slug, p]));
  const items = list.map(p => {
    const full = bySlug[p.slug] || {};
    return `    <item>
      <title>${esc(full.h1 || p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(full.description || p.excerpt)}</description>
    </item>`;
  }).join("\n");
  const last = list.reduce((m, p) => (p.updated > m ? p.updated : m), list[0]?.date || "2026-01-01");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`Blog de ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Guías, entrenamiento, material y podcasts sobre HYROX, carreras de obstáculos y carreras híbridas en España.</description>
    <language>es-ES</language>
    <lastBuildDate>${rfc822(last)}</lastBuildDate>
${items}
  </channel>
</rss>`;
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Rss() { return null; }
