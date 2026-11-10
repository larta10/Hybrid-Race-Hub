// Valida todos los posts de instagram/posts/: esquema, longitudes y que nada desborde al maquetar.
// Uso: npm run ig:validate
import { loadPosts, validatePost, fullCaption } from "./lib/posts.mjs";
import { layoutIssues } from "./render.mjs";
import { loadReels, validateReel, reelReady } from "./lib/reels.mjs";
import { variedadCola, enCola } from "./lib/variedad.mjs";

const posts = loadPosts();
let errors = 0;
const ids = new Map();

for (const p of posts) {
  const errs = validatePost(p);
  if (ids.has(p.id)) errs.push(`id duplicado (también en ${ids.get(p.id)})`);
  ids.set(p.id, p.__file);
  if (!errs.length) errs.push(...layoutIssues(p));
  if (errs.length) {
    errors += errs.length;
    console.log(`✗ ${p.__file}`);
    for (const e of errs) console.log(`    - ${e}`);
  }
}

const byPilar = posts.reduce((acc, p) => ((acc[p.pilar] = (acc[p.pilar] || 0) + 1), acc), {});
console.log(`\n${posts.length} posts · ${Object.entries(byPilar).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
console.log(`Caption más largo: ${Math.max(0, ...posts.map((p) => (p.caption ? fullCaption(p).length : 0)))} caracteres`);

// ---- Guiones de Reel ----
const reels = loadReels();
const byId = new Map(posts.map((p) => [p.id, p]));
let listos = 0;
// Variedad del metraje: solo los reels que siguen en cola (los publicados y descartados no cuentan)
const variedad = variedadCola(reels);
const avisos = [];
for (const r of reels) {
  const errs = validateReel(r, byId.get(r.post_carrusel_id));
  // Error si el reel ya está marcado como listo (qa_ok); aviso mientras se prepara (sale el carrusel)
  const v = enCola(r) ? variedad.get(r.id) || [] : [];
  if (r.qa_ok) errs.push(...v);
  else if (v.length) avisos.push(`${r.id}: ${v.length} regla(s) de variedad sin cumplir (en preparación: hasta cumplirlas sale el carrusel)`);
  if (reelReady(r).listo) listos++;
  if (errs.length) {
    errors += errs.length;
    console.log(`✗ reels/${r.__file}`);
    for (const e of errs) console.log(`    - ${e}`);
  }
}
for (const a of avisos) console.log(`  aviso ${a}`);
console.log(`${reels.length} guiones de Reel · ${listos} listos para publicar (clips revisados y control de calidad hecho)`);

if (errors) {
  console.log(`\n${errors} error(es)`);
  process.exit(1);
}
console.log("Todo correcto");
