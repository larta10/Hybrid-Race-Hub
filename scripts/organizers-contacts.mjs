// Organizadores de las carreras futuras: web oficial y email de contacto si aparece publicado en su web
// (busca enlaces mailto: y direcciones en la portada y en /contacto). Solo lectura.
//   node scripts/organizers-contacts.mjs docs/seo/data/organizadores.json
import { writeFileSync } from "node:fs";
const OUT = process.argv[2] || "organizadores.json";
const SITE = process.argv[3] || "http://localhost:3000";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
// Las carreras (con slug y url ya saneada) salen del sitemap y de cada ficha no; se usan las de Supabase vía la propia web:
const sm = await (await fetch(`${SITE}/sitemap.xml`)).text();
const fichas = [...sm.matchAll(/<loc>[^<]*\/carreras\/([^<]+)<\/loc>/g)].map(m => decodeURIComponent(m[1]));
const byHost = new Map();
for (const slug of fichas) {
  const h = await (await fetch(`${SITE}/carreras/${slug}`)).text();
  const name = (h.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || slug;
  const insc = (h.match(/<a class="btn-solid" href="([^"]+)"/) || [])[1];
  const org = (h.match(/<dt>Organiza<\/dt><dd><a href="([^"]+)"[^>]*>([^<]+)</) || []);
  const future = !/Edición finalizada/.test(h);
  if (!future) continue;
  const web = org[1] || (insc ? new URL(insc).origin + "/" : null);
  if (!web) { byHost.set(`sin-web-${slug}`, { organizer: name, web: null, races: [name], email: null }); continue; }
  const host = new URL(web).hostname;
  if (!byHost.has(host)) byHost.set(host, { organizer: org[2] || host, web, races: [], email: null, emailSource: null });
  byHost.get(host).races.push(name);
}
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
for (const o of byHost.values()) {
  if (!o.web) continue;
  for (const path of ["", "contacto", "contact", "contacto/"]) {
    try {
      const r = await fetch(new URL(path, o.web), { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (!r.ok) continue;
      const t = await r.text();
      const mails = [...new Set([...(t.match(/mailto:([^"'?`]+)/gi) || []).map(m => m.slice(7)), ...(t.match(EMAIL) || [])].map(m => (m.match(EMAIL) || [""])[0]))]
        .map(m => decodeURIComponent(m).trim().toLowerCase())
        .filter(m => !/\.(png|jpe?g|webp|gif|svg)$|sentry|example|wixpress|u003e|@2x|domain\.com/.test(m));
      if (mails.length) { o.email = mails[0]; o.emailSource = new URL(path, o.web).href; break; }
    } catch {}
  }
}
const list = [...byHost.values()].sort((a, b) => b.races.length - a.races.length);
writeFileSync(OUT, JSON.stringify(list, null, 1));
for (const o of list) console.log([o.organizer, o.web, o.email || "-", o.races.length].join(" | "));
