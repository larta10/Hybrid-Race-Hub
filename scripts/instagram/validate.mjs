// Valida todos los posts de instagram/posts/: esquema, longitudes y que nada desborde al maquetar.
// Uso: npm run ig:validate
import { loadPosts, validatePost, fullCaption } from "./lib/posts.mjs";
import { layoutIssues } from "./render.mjs";

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

if (errors) {
  console.log(`\n${errors} error(es)`);
  process.exit(1);
}
console.log("Todo correcto");
