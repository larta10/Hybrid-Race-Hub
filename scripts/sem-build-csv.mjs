// Genera docs/sem/google-ads-editor.csv (importable en Google Ads Editor: Cuenta > Importar > Desde archivo)
// y valida las longitudes de los anuncios RSA: títulos ≤ 30 caracteres, descripciones ≤ 90, rutas ≤ 15.
//   node scripts/sem-build-csv.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://hybridracehub.com";
const utm = (path, campaign, content) =>
  `${SITE}${path}?utm_source=google&utm_medium=cpc&utm_campaign=${campaign}&utm_content=${content}`;

// Presupuestos diarios con el reparto 60 % Google / 40 % Meta sobre 200 €/mes (ver PLAN-GOOGLE-ADS.md)
const CAMPAIGNS = [
  { name: "HRH | Search | Calendario genérico", slug: "calendario", budget: "2.00" },
  { name: "HRH | Search | Regional", slug: "regional", budget: "1.20" },
  { name: "HRH | Search | Centros por ciudad", slug: "centros", budget: "0.80" },
];

const NEGATIVES = [
  "crossfit cerca de mi", "universidad", "modalidad hibrida", "modalidad híbrida", "clases hibridas", "educacion hibrida",
  "curso", "cursos", "master", "grado", "oposiciones", "coche hibrido", "coche híbrido", "coches hibridos", "toyota", "hibrido enchufable",
  "bicicleta hibrida", "trabajo hibrido", "teletrabajo", "entradas oficiales", "reventa", "resultados", "clasificacion", "ranking hyrox",
  "gratis online", "pdf", "mexico", "argentina", "colombia", "chile", "peru", "hybrid car", "planta hibrida", "semillas",
];

// Bloques reutilizables de anuncio. {X} se sustituye por la zona o ciudad.
const DESC_CAL = [
  "Calendario de carreras híbridas en España: HYROX, DEKA, Spartan y OCR con fecha y precio.",
  "Fechas revisadas a diario y enlace directo a la inscripción oficial de cada carrera.",
  "Busca por comunidad y mes. Ya hay carreras con fecha en 2027. Sin registro y gratis.",
  "Guías para tu primera carrera, plan de entrenamiento gratis y centros donde entrenar.",
];

function adGroupsCalendario() {
  const base = [
    "Carreras híbridas en España", "Calendario 2026-2027", "HYROX, DEKA, Spartan y OCR", "Fechas y precios revisados",
    "Enlace a la inscripción", "Carreras híbridas 2027", "Elige fecha y ciudad", "Calendario gratis",
    "Hybrid Race Hub", "Busca por comunidad", "Más de 35 carreras", "Tu próxima hybrid race",
    "Competiciones híbridas", "Guía para principiantes", "Plan de entrenamiento gratis",
  ];
  return [
    { name: "Carreras híbridas", path: "/", p1: "carreras", p2: "hibridas",
      kw: ["carreras hibridas", "carreras híbridas", "carrera hibrida", "carrera híbrida", "calendario carreras hibridas", "carreras hibridas españa"],
      h: base, d: DESC_CAL },
    { name: "Hybrid race", path: "/", p1: "hybrid-race", p2: "espana",
      kw: ["hybrid race", "hybrid races", "hybrid race españa", "hybrid race spain", "que es hybrid race"],
      h: ["Hybrid race en España", ...base.filter(x => x !== "Tu próxima hybrid race").slice(0, 13), "Qué es una hybrid race"],
      d: DESC_CAL },
    { name: "Competiciones 2027", path: "/calendario", p1: "calendario", p2: "2027",
      kw: ["carreras hibridas 2027", "carreras hibridas españa 2027", "competiciones hibridas 2027", "competiciones hibridas españa 2027", "competiciones hibridas", "competiciones híbridas españa"],
      h: ["Carreras híbridas 2027", "Competiciones híbridas 2027", ...base.filter(x => x !== "Carreras híbridas 2027").slice(0, 13)],
      d: DESC_CAL },
  ];
}

function adGroupsRegional() {
  const zones = [
    { name: "Madrid", slug: "madrid", kw: ["carreras hibridas madrid", "carreras híbridas madrid", "competiciones hibridas madrid", "hybrid race madrid", "carrera hibrida madrid"] },
    { name: "Andalucía", slug: "andalucia", kw: ["carreras hibridas andalucia", "carreras hibridas sevilla", "carreras hibridas malaga", "hybrid race andalucia", "hybrid race malaga"] },
    { name: "Cataluña", slug: "cataluna", kw: ["carreras hibridas cataluña", "carreras hibridas barcelona", "hybrid race barcelona", "competiciones hibridas barcelona"] },
    { name: "Galicia", slug: "galicia", kw: ["hybrid race galicia", "carreras hibridas galicia", "hybrid race vigo", "carrera hibrida galicia", "hybrid day vigo"] },
  ];
  return zones.map(z => ({
    name: `Regional ${z.name}`, path: `/carreras-hibridas/${z.slug}`, p1: "carreras", p2: z.slug.slice(0, 15),
    kw: z.kw,
    h: [
      `Carreras híbridas en ${z.name}`, `Hybrid race en ${z.name}`, `Calendario ${z.name} 2027`, "HYROX, DEKA, Spartan y OCR",
      "Fechas y precios revisados", "Enlace a la inscripción", "Carreras híbridas 2026-2027", "Elige tu próxima carrera",
      "Hybrid Race Hub", `Próximas en ${z.name}`, "Dónde entrenar cerca", "Calendario gratis",
      "Competiciones híbridas", "Guía para principiantes", "Añádela a tu calendario",
    ],
    d: [
      `Todas las carreras híbridas en ${z.name}: HYROX, DEKA, Spartan y OCR con fecha y precio.`,
      "Fechas revisadas a diario y enlace directo a la inscripción oficial de cada carrera.",
      "Mira también las zonas cercanas y los centros donde preparar tu carrera.",
      "Guías para tu primera carrera híbrida y plan de entrenamiento gratis en Excel o PDF.",
    ],
  }));
}

function adGroupsCentros() {
  const cities = [
    ["Madrid", "madrid"], ["Barcelona", "barcelona"], ["Valencia", "valencia"], ["Sevilla", "sevilla"],
    ["Pozuelo", "pozuelo-de-alarcon"], ["Reus", "reus"], ["Palma", "palma"], ["Murcia", "murcia"],
    ["Alicante", "alicante"], ["Málaga", "malaga"], ["Zaragoza", "zaragoza"], ["Bilbao", "bilbao"],
  ];
  // "hyrox [ciudad]" a secas suele buscar la carrera, no un gimnasio: solo se puja en Pozuelo y Reus,
  // donde Search Console muestra que esa búsqueda llega a la página de centros.
  const extra = { Palma: ["donde entrenar hyrox mallorca", "gimnasio hyrox mallorca"], Pozuelo: ["hyrox pozuelo", "hyrox pozuelo de alarcon"], Reus: ["hyrox reus"] };
  return cities.map(([name, slug]) => {
    const low = name.toLowerCase();
    const kwBase = [`donde entrenar hyrox ${low}`, `donde entrenar hyrox en ${low}`, `hyrox ${low} donde entrenar`, `gimnasio hyrox ${low}`, `box hyrox ${low}`, `entrenar hyrox ${low}`, `gimnasio ocr ${low}`];
    const kw = [...kwBase, ...(extra[name] || [])].map(k => k.normalize("NFD").replace(/[̀-ͯ]/g, ""));
    return {
      name: `Centros ${name}`, path: `/centros-entrenamiento/${slug}`, p1: "entrenar-hyrox", p2: slug.slice(0, 15),
      kw,
      h: [
        `Entrenar HYROX en ${name}`, `Gimnasios HYROX en ${name}`, `Boxes en ${name}`, "Con trineo, SkiErg y remo",
        "Dirección, web y teléfono", "Directorio gratuito", "Encuentra tu box", "Prepara tu HYROX",
        "Hybrid Race Hub", "Carreras cerca de ti", "Llama antes de ir", "Centros revisados",
        "OCR, HYROX y funcional", "Plan de entrenamiento gratis", "Más de 400 centros en España",
      ],
      d: [
        `Gimnasios y boxes en ${name} para preparar HYROX y OCR, con dirección, web y teléfono.`,
        "Busca un centro con trineo, SkiErg y remo y mira las próximas carreras de tu zona.",
        "Directorio gratuito de centros para entrenar carreras híbridas en toda España.",
        "Plan de entrenamiento HYROX gratis y guías para tu primera carrera híbrida.",
      ],
    };
  });
}

const GROUPS = { calendario: adGroupsCalendario(), regional: adGroupsRegional(), centros: adGroupsCentros() };

// Validación
const errors = [];
for (const [camp, groups] of Object.entries(GROUPS)) for (const g of groups) {
  if (g.h.length !== 15) errors.push(`${g.name}: ${g.h.length} títulos (deben ser 15)`);
  if (g.d.length !== 4) errors.push(`${g.name}: ${g.d.length} descripciones (deben ser 4)`);
  if (new Set(g.h).size !== g.h.length) errors.push(`${g.name}: títulos repetidos`);
  g.h.forEach(t => { if ([...t].length > 30) errors.push(`${g.name}: título de ${[...t].length} > 30: "${t}"`); });
  g.d.forEach(t => { if ([...t].length > 90) errors.push(`${g.name}: descripción de ${[...t].length} > 90: "${t}"`); });
  [g.p1, g.p2].forEach(p => { if ([...p].length > 15) errors.push(`${g.name}: ruta > 15: "${p}"`); });
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

// CSV
const H = ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type", "Bid Strategy Type", "Languages", "Location", "Campaign Status",
  "Ad Group", "Max CPC", "Ad Group Status", "Keyword", "Criterion Type", "Ad type", "Final URL", "Path 1", "Path 2",
  ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`), "Status"];
const rows = [];
const row = o => rows.push(H.map(k => o[k] ?? ""));
const MAX_CPC = { calendario: "0.35", regional: "0.30", centros: "0.30" };

for (const c of CAMPAIGNS) {
  row({ Campaign: c.name, "Campaign Type": "Search", Networks: "Google search", Budget: c.budget, "Budget type": "Daily",
    "Bid Strategy Type": "Manual CPC", Languages: "es", Location: "Spain", "Campaign Status": "Paused" });
  for (const n of NEGATIVES) row({ Campaign: c.name, Keyword: n, "Criterion Type": "Campaign Negative Phrase" });
  for (const g of GROUPS[c.slug]) {
    row({ Campaign: c.name, "Ad Group": g.name, "Max CPC": MAX_CPC[c.slug], "Ad Group Status": "Enabled" });
    for (const k of g.kw) {
      row({ Campaign: c.name, "Ad Group": g.name, Keyword: k, "Criterion Type": "Phrase" });
      row({ Campaign: c.name, "Ad Group": g.name, Keyword: k, "Criterion Type": "Exact" });
    }
    const ad = { Campaign: c.name, "Ad Group": g.name, "Ad type": "Responsive search ad",
      "Final URL": utm(g.path, c.slug, g.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")),
      "Path 1": g.p1, "Path 2": g.p2, Status: "Enabled" };
    g.h.forEach((t, i) => { ad[`Headline ${i + 1}`] = t; });
    g.d.forEach((t, i) => { ad[`Description ${i + 1}`] = t; });
    row(ad);
  }
}
const esc = v => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v);
mkdirSync("docs/sem", { recursive: true });
writeFileSync("docs/sem/google-ads-editor.csv", "﻿" + [H, ...rows].map(r => r.map(esc).join(",")).join("\r\n") + "\r\n");
const nAds = Object.values(GROUPS).flat().length;
const nKw = Object.values(GROUPS).flat().reduce((a, g) => a + g.kw.length * 2, 0);
console.log(`OK: ${CAMPAIGNS.length} campañas, ${nAds} grupos/anuncios RSA, ${nKw} palabras clave (frase + exacta), ${NEGATIVES.length} negativas por campaña. Longitudes validadas.`);
