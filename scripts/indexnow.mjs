// Envía las URLs del sitemap a IndexNow (Bing, Copilot, Yandex, Seznam…) en una sola petición.
// La clave se sirve en https://hybridracehub.com/93eff6d8563ee7911d5e7fdf1e62f7bf.txt (public/93eff6d8563ee7911d5e7fdf1e62f7bf.txt).
//   node scripts/indexnow.mjs                 -> todas las URLs de https://hybridracehub.com/sitemap.xml
//   node scripts/indexnow.mjs /ruta /otra     -> solo esas rutas
//   node scripts/indexnow.mjs --dry           -> muestra lo que enviaría, sin enviar
const HOST = "hybridracehub.com";
const KEY = "93eff6d8563ee7911d5e7fdf1e62f7bf";
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const paths = args.filter(a => a.startsWith("/"));

let urls;
if (paths.length) {
  urls = paths.map(p => `https://${HOST}${p}`);
} else {
  const sm = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}
// Comprueba que la clave está publicada antes de enviar
const k = await fetch(`https://${HOST}/${KEY}.txt`);
if (!k.ok || (await k.text()).trim() !== KEY) { console.error(`La clave no está publicada en https://${HOST}/${KEY}.txt (HTTP ${k.status}).`); process.exit(1); }

const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) };
console.log(`${urls.length} URLs${dry ? " (simulación, no se envía)" : ""}`);
if (dry) { console.log(urls.join("\n")); process.exit(0); }
const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
// 200 = recibido, 202 = recibido pendiente de validar la clave; 4xx = error
console.log(`IndexNow respondió ${r.status} ${r.statusText}`, await r.text().catch(() => ""));
if (r.status >= 400) process.exit(1);
