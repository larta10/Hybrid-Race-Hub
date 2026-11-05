// Segunda verificación de las fuentes citadas en los posts: comprueba contra PubMed (E-utilities)
// y Crossref que el PMID y el DOI existen y que autor principal, año y título coinciden, y que el DOI
// resuelve en doi.org. No sustituye a leer el resumen: confirma que la referencia es la que dice ser.
// Uso: node scripts/instagram/verify-sources.mjs [filtro-de-id]
import { loadPosts } from "./lib/posts.mjs";

const only = process.argv[2];
const UA = { "User-Agent": "HybridRaceHub-source-check/1.0 (+https://hybridracehub.com)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const firstSurname = (autores) => norm(String(autores).split(",")[0]).split(" ")[0];
/** Parecido entre títulos: proporción de palabras del nuestro presentes en el oficial */
// en ambos sentidos: Crossref a veces guarda el título sin el subtítulo
const titleScore = (a, b) => {
  const one = (x, y) => {
    const X = norm(x).split(" ").filter((w) => w.length > 3);
    const Y = new Set(norm(y).split(" "));
    return X.length ? X.filter((w) => Y.has(w)).length / X.length : 0;
  };
  return Math.max(one(a, b), one(b, a));
};

async function pubmed(pmid) {
  const r = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=hybridracehub&id=${pmid}`, { headers: UA });
  const j = await r.json();
  const d = j.result?.[pmid];
  if (!d || d.error) return null;
  return { title: d.title, year: Number(String(d.pubdate).slice(0, 4)), author: d.authors?.[0]?.name || "", doi: (d.articleids || []).find((a) => a.idtype === "doi")?.value || "" };
}

async function crossref(doi) {
  const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: UA });
  if (!r.ok) return null;
  const m = (await r.json()).message;
  const years = ["published-print", "published-online", "issued"].map((k) => m[k]?.["date-parts"]?.[0]?.[0]).filter(Boolean);
  return { title: m.title?.[0] || "", years, author: m.author?.[0]?.family || "", journal: m["container-title"]?.[0] || "" };
}

async function doiResolves(doi) {
  const r = await fetch(`https://doi.org/${doi}`, { method: "HEAD", redirect: "manual", headers: UA }).catch(() => null);
  return r && r.status >= 300 && r.status < 400;
}

let problems = 0;
const seen = new Map();
for (const post of loadPosts().filter((p) => !only || p.id.includes(only))) {
  for (const f of post.fuentes || []) {
    const key = f.doi || f.pmid;
    if (seen.has(key)) {
      console.log(`${post.id} · ${f.autores.split(",")[0]} ${f.anio}: ${seen.get(key)} (ya comprobada)`);
      continue;
    }
    const errs = [];
    const surname = firstSurname(f.autores);
    if (f.pmid) {
      const pm = await pubmed(f.pmid);
      if (!pm) errs.push(`PMID ${f.pmid} no existe`);
      else {
        if (!norm(pm.author).startsWith(surname)) errs.push(`PubMed: primer autor "${pm.author}" ≠ "${surname}"`);
        if (pm.year !== f.anio) errs.push(`PubMed: año ${pm.year} ≠ ${f.anio}`);
        if (titleScore(f.titulo, pm.title) < 0.8) errs.push(`PubMed: título distinto ("${pm.title}")`);
        if (f.doi && pm.doi && pm.doi.toLowerCase() !== f.doi.toLowerCase()) errs.push(`PubMed: DOI ${pm.doi} ≠ ${f.doi}`);
      }
      await sleep(400);
    }
    if (f.doi) {
      const cr = await crossref(f.doi);
      if (!cr) errs.push(`DOI ${f.doi} no está en Crossref`);
      else {
        if (!norm(cr.author).startsWith(surname)) errs.push(`Crossref: primer autor "${cr.author}" ≠ "${surname}"`);
        if (!cr.years.includes(f.anio)) errs.push(`Crossref: años ${cr.years.join("/")} no incluyen ${f.anio}`);
        if (titleScore(f.titulo, cr.title) < 0.8) errs.push(`Crossref: título distinto ("${cr.title}")`);
      }
      if (!(await doiResolves(f.doi))) errs.push(`doi.org/${f.doi} no redirige`);
    }
    const status = errs.length ? `✗ ${errs.join("; ")}` : "✓ autor, año, título y enlaces correctos";
    seen.set(key, errs.length ? "✗ con problemas" : "✓");
    if (errs.length) problems++;
    console.log(`${post.id} · ${f.autores.split(",")[0]} ${f.anio} · ${f.pmid ? `PMID ${f.pmid} · ` : ""}doi ${f.doi || "-"}\n   ${status}`);
  }
}
console.log(problems ? `\n${problems} fuente(s) con problemas` : "\nTodas las fuentes coinciden con PubMed/Crossref");
process.exit(problems ? 1 : 0);
