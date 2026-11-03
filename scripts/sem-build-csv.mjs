// Genera docs/sem/google-ads-editor.csv (importable en Google Ads Editor: Cuenta > Importar > Desde archivo)
// con el plan de noviembre de 2026 (docs/sem/PLAN-SEM-NOV-2026.md). Todas las campañas salen EN PAUSA.
// Valida los RSA: 15 títulos ≤ 30 caracteres, 4 descripciones ≤ 90, rutas ≤ 15, sin repetidos,
// UTM en todas las URL finales y ninguna marca de terceros (HYROX, DEKA, Spartan…) en el texto del anuncio.
//   node scripts/sem-build-csv.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { raceSlug } from "../lib/race-slug.js";

const SITE = "https://hybridracehub.com";
const utm = (path, campaign, content) =>
  `${SITE}${path}?utm_source=google&utm_medium=cpc&utm_campaign=${campaign}&utm_content=${content}`;
const slugify = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Presupuesto: 150-200 €/mes. A arranca sola a 5 €/día (semana 2); al abrir B y C en la semana 4, A baja a 3,50.
const CAMPAIGNS = [
  { name: "HRH | Search | A Donde entrenar", slug: "a-entrenar", budget: "5.00", cpc: "0.40" },
  { name: "HRH | Search | B Inscripciones", slug: "b-inscripciones", budget: "1.50", cpc: "0.30" },
  { name: "HRH | Search | C Material", slug: "c-material", budget: "1.00", cpc: "0.35" },
  { name: "HRH | Search | Marca", slug: "marca", budget: "0.30", cpc: "0.15" },
];

const NEGATIVES = [
  "universidad", "modalidad hibrida", "modalidad híbrida", "clases hibridas", "educacion hibrida", "curso", "cursos", "master", "grado",
  "oposiciones", "coche hibrido", "coche híbrido", "coches hibridos", "vehiculo hibrido", "vehículo híbrido", "hibrido enchufable", "toyota",
  "bicicleta hibrida", "bicicleta híbrida", "gratis", "trabajo", "empleo", "trabajo hibrido", "teletrabajo", "reventa", "resultados",
  "clasificacion", "mexico", "méxico", "argentina", "colombia", "chile", "peru", "perú", "venezuela", "ecuador", "uruguay", "bolivia",
  "paraguay", "costa rica", "guatemala", "republica dominicana", "panama", "hybrid car", "planta hibrida", "semillas",
];
// Marcas de terceros que no pueden ir en títulos ni descripciones (sí en palabras clave)
const TRADEMARKS = /hyrox|deka|spartan|hyatl|hurbax|hybrid day|survivor|desaf[ií]o de guerreros|garmin|nike|reebok|salomon|ifema/i;

// ── A: Dónde entrenar → /centros-entrenamiento/<ciudad> (orgánico débil: Madrid en posición 50-60)
function groupsA() {
  const cities = [["Madrid", "madrid"], ["Barcelona", "barcelona"], ["Valencia", "valencia"], ["Sevilla", "sevilla"],
    ["Málaga", "malaga"], ["Zaragoza", "zaragoza"], ["Alicante", "alicante"], ["Bilbao", "bilbao"]];
  return cities.map(([name, slug]) => {
    const low = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return {
      name: `Entrenar ${name}`, path: `/centros-entrenamiento/${slug}`, p1: "centros", p2: slug.slice(0, 15),
      kw: [`donde entrenar hyrox ${low}`, `donde entrenar hyrox en ${low}`, `gimnasio hyrox ${low}`, `box hyrox ${low}`, `entrenar hyrox ${low}`, `box ocr ${low}`, `gimnasio ocr ${low}`],
      h: [
        `Dónde entrenar en ${name}`, `Boxes en ${name}`, `Gimnasios en ${name}`, "Con trineo, SkiErg y remo",
        "Dirección, web y teléfono", "Directorio sin registro", "Encuentra tu box", "Prepara tu carrera híbrida",
        "Hybrid Race Hub", "Carreras cerca de ti", "Llama antes de ir", "Para carreras de obstáculos",
        "Entrenamiento funcional", "Plan de entrenamiento", "Centros por ciudad",
      ],
      d: [
        `Boxes y gimnasios en ${name} para preparar carreras híbridas y de obstáculos.`,
        "Mira cuáles tienen trineo, SkiErg, remo y rig, con dirección, web y teléfono.",
        "Además, las próximas carreras híbridas de la provincia con su fecha y su ficha.",
        "Directorio de centros de entrenamiento funcional en toda España. Sin registro.",
      ],
    };
  });
}

// ── B: Inscripciones → ficha de la carrera. Carreras de 2027 con nombre de serie conocido (búsquedas "[modalidad] [ciudad] 2027")
function groupsB(races) {
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const SERIES = [["HYROX", /^hyrox/i, "hyrox"], ["DEKA", /^deka/i, "deka"], ["Spartan", /^spartan/i, "spartan race"]];
  const picked = races.filter(r => r.fecha_iso.startsWith("2027") && SERIES.some(([, re]) => re.test(r.nombre)))
    .sort((a, b) => (/sprint/i.test(b.nombre) - /sprint/i.test(a.nombre)) || a.fecha_iso.localeCompare(b.fecha_iso))
    .filter((r, i, a) => a.findIndex(x => x.municipio === r.municipio && SERIES.find(([, re]) => re.test(x.nombre))[0] === SERIES.find(([, re]) => re.test(r.nombre))[0]) === i)
    .slice(0, 10);
  return picked.map(r => {
    const [serie, , kwSerie] = SERIES.find(([, re]) => re.test(r.nombre));
    const city = /barakaldo/i.test(r.municipio) ? "Bilbao" : /guadalix/i.test(r.municipio) ? "Madrid" : /sant agust/i.test(r.municipio) ? "Ibiza" : r.municipio;
    const low = city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const mes = MESES[Number(r.fecha_iso.slice(5, 7)) - 1];
    return {
      name: `${serie} ${city} 2027`, path: `/carreras/${raceSlug(r)}`, p1: "carreras", p2: slugify(city).slice(0, 15),
      kw: [`inscripcion ${kwSerie} ${low} 2027`, `${kwSerie} ${low} 2027`, `${kwSerie} ${low}`, `inscripcion ${kwSerie} ${low}`, `fecha ${kwSerie} ${low} 2027`],
      h: [
        `Carrera híbrida en ${city}`.slice(0, 30), `${mes[0].toUpperCase()}${mes.slice(1)} de 2027 en ${city}`.slice(0, 30), "Fecha, sede y precio", "Enlace a la inscripción",
        "Estado de la inscripción", "Cómo prepararla", "Dónde entrenar cerca", "Añádela a tu calendario",
        "Hybrid Race Hub", "Ficha verificada", "Carreras híbridas 2027", "Elige categoría",
        "Individual o por parejas", "Otras carreras cerca", "Calendario de España",
      ],
      d: [
        `Fecha, sede, precio y enlace a la inscripción oficial de la carrera de ${city}.`.slice(0, 90),
        "Te decimos si la inscripción está abierta y cuándo lo comprobamos por última vez.",
        "Cómo prepararla, dónde entrenar cerca y el material que de verdad hace falta.",
        "Añádela a tu calendario y compártela con tu equipo en un clic.",
      ],
    };
  });
}

// ── C: Material → rankings (solo los que tienen contenido sólido: zapatillas)
function groupsC() {
  return [
    { name: "Zapatillas pruebas hibridas", path: "/productos/zapatillas-hyrox", p1: "zapatillas", p2: "comparativa",
      kw: ["mejores zapatillas hyrox", "zapatillas para hyrox", "zapatillas hyrox", "que zapatillas usar en hyrox", "material hyrox", "hyrox material"],
      h: ["Zapatillas para pruebas híbridas", "Comparativa 2026", "Agarre en el trineo", "Estables en las zancadas",
        "Aguantan 8 km de carrera", "Para quién es cada una", "Criterios claros", "Sin notas inventadas",
        "Hybrid Race Hub", "Elige según tu perfil", "Corredor o de box", "Ver precio en Amazon",
        "Tabla comparativa", "Preguntas frecuentes", "Actualizado en noviembre"].map(t => t.slice(0, 30)),
      d: ["Comparativa de zapatillas para pruebas híbridas: agarre, estabilidad y amortiguación.",
        "Para quién es cada modelo y qué mirar antes de comprar, explicado por gente que compite.",
        "Tabla comparativa, criterios de elección y preguntas frecuentes. Actualizado en 2026.",
        "Enlaces a Amazon con el precio actual. Sin valoraciones inventadas."] },
    { name: "Zapatillas OCR", path: "/productos/zapatillas-trail", p1: "zapatillas", p2: "ocr",
      kw: ["zapatillas ocr", "zapatillas para ocr", "zapatillas carreras de obstaculos", "zapatillas para barro", "mejores zapatillas ocr"],
      h: ["Zapatillas para OCR", "Carreras de obstáculos", "Agarre en barro", "Comparativa 2026",
        "Con membrana o sin ella", "Drenaje y protección", "Para quién es cada una", "Criterios claros",
        "Hybrid Race Hub", "Taco para rampas", "Tabla comparativa", "Ver precio en Amazon",
        "Preguntas frecuentes", "Elige según tu carrera", "Actualizado en noviembre"],
      d: ["Zapatillas de trail para carreras de obstáculos: taco, drenaje, protección y peso.",
        "Cuándo conviene la membrana impermeable y cuándo una que drene rápido tras el agua.",
        "Para quién es cada modelo, tabla comparativa y preguntas frecuentes. 2026.",
        "Enlaces a Amazon con el precio actual. Sin valoraciones inventadas."] },
  ];
}

// ── Marca (barata): solo para que nadie se quede con nuestro nombre
function groupsMarca() {
  return [{ name: "Marca", path: "/", p1: "calendario", p2: "espana",
    kw: ["hybrid race hub", "hybridracehub", "hybrid race hub españa"],
    h: ["Hybrid Race Hub", "Calendario de carreras", "Carreras híbridas España", "Fichas verificadas",
      "Dónde entrenar", "Calendario por meses", "Por comunidad", "Guías para empezar",
      "Enlace a la inscripción", "Carreras 2026-2027", "Carreras de obstáculos", "Plan de entrenamiento",
      "Centros por ciudad", "Comparativas de material", "Web oficial"],
    d: ["Calendario de carreras híbridas y de obstáculos en España, con fecha, sede y precio.",
      "Cada carrera con su ficha, el estado de la inscripción y el enlace a la web oficial.",
      "Calendario por meses y por comunidad, centros donde entrenar y guías para empezar.",
      "Comprobamos cada carrera con la web del organizador antes de publicarla."] }];
}

// Carreras futuras (Supabase, solo lectura) para la campaña B
const K = readFileSync("lib/shared.js", "utf8").match(/ANON_KEY =\s*"([^"]+)"/)[1];
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const res = await fetch(`https://ssyljhtganuaanczxeep.supabase.co/rest/v1/races?select=id,nombre,fecha_iso,municipio,provincia&modalidad_parent=in.(ocr,funcional)&fecha_iso=gte.${today}&order=fecha_iso.asc`, { headers: { apikey: K, Authorization: `Bearer ${K}` } });
const races = await res.json();

const GROUPS = { "a-entrenar": groupsA(), "b-inscripciones": groupsB(races), "c-material": groupsC(), marca: groupsMarca() };

// Validación
const errors = [];
for (const groups of Object.values(GROUPS)) for (const g of groups) {
  if (g.h.length !== 15) errors.push(`${g.name}: ${g.h.length} títulos (deben ser 15)`);
  if (g.d.length !== 4) errors.push(`${g.name}: ${g.d.length} descripciones (deben ser 4)`);
  if (new Set(g.h).size !== g.h.length) errors.push(`${g.name}: títulos repetidos`);
  g.h.forEach(t => { if ([...t].length > 30) errors.push(`${g.name}: título de ${[...t].length} > 30: "${t}"`); });
  g.d.forEach(t => { if ([...t].length > 90) errors.push(`${g.name}: descripción de ${[...t].length} > 90: "${t}"`); });
  [...g.h, ...g.d].forEach(t => { if (TRADEMARKS.test(t)) errors.push(`${g.name}: marca de terceros en el anuncio: "${t}"`); });
  [g.p1, g.p2].forEach(p => { if ([...p].length > 15) errors.push(`${g.name}: ruta > 15: "${p}"`); });
}
if (!GROUPS["b-inscripciones"].length) errors.push("Campaña B sin grupos (¿falló Supabase?)");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

// CSV
const H = ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type", "Bid Strategy Type", "Languages", "Location", "Campaign Status",
  "Ad Group", "Max CPC", "Ad Group Status", "Keyword", "Criterion Type", "Ad type", "Final URL", "Path 1", "Path 2",
  ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`), "Status"];
const rows = [];
const row = o => rows.push(H.map(k => o[k] ?? ""));
for (const c of CAMPAIGNS) {
  row({ Campaign: c.name, "Campaign Type": "Search", Networks: "Google search", Budget: c.budget, "Budget type": "Daily",
    "Bid Strategy Type": "Manual CPC", Languages: "es", Location: "Spain", "Campaign Status": "Paused" });
  for (const n of NEGATIVES) row({ Campaign: c.name, Keyword: n, "Criterion Type": "Campaign Negative Phrase" });
  for (const g of GROUPS[c.slug]) {
    row({ Campaign: c.name, "Ad Group": g.name, "Max CPC": c.cpc, "Ad Group Status": "Enabled" });
    for (const k of g.kw) {
      row({ Campaign: c.name, "Ad Group": g.name, Keyword: k, "Criterion Type": "Phrase" });
      row({ Campaign: c.name, "Ad Group": g.name, Keyword: k, "Criterion Type": "Exact" });
    }
    const ad = { Campaign: c.name, "Ad Group": g.name, "Ad type": "Responsive search ad",
      "Final URL": utm(g.path, c.slug, slugify(g.name)), "Path 1": g.p1, "Path 2": g.p2, Status: "Enabled" };
    g.h.forEach((t, i) => { ad[`Headline ${i + 1}`] = t; });
    g.d.forEach((t, i) => { ad[`Description ${i + 1}`] = t; });
    row(ad);
  }
}
const finals = rows.map(r => r[H.indexOf("Final URL")]).filter(Boolean);
if (finals.some(u => !/utm_source=google&utm_medium=cpc&utm_campaign=/.test(u))) { console.error("URL final sin UTM"); process.exit(1); }
const esc = v => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v);
mkdirSync("docs/sem", { recursive: true });
writeFileSync("docs/sem/google-ads-editor.csv", "﻿" + [H, ...rows].map(r => r.map(esc).join(",")).join("\r\n") + "\r\n");
const all = Object.values(GROUPS).flat();
console.log(`OK: ${CAMPAIGNS.length} campañas en pausa, ${all.length} grupos con RSA, ${all.reduce((a, g) => a + g.kw.length * 2, 0)} palabras clave (frase + exacta), ${NEGATIVES.length} negativas por campaña, ${finals.length} URL finales con UTM.`);
for (const g of GROUPS["b-inscripciones"]) console.log("  B:", g.name, "→", g.path);
