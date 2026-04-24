// Supabase Edge Function — update-races
// Raspa calendarios deportivos españoles 2026 y hace upsert en la tabla `races`.
// Deploy: supabase functions deploy update-races
// Cron:   configurar en Supabase Dashboard → Edge Functions → Schedules (diario, ej. "0 4 * * *")

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Race {
  nombre: string;
  fecha: string;        // "15 mar 2026"
  fecha_iso: string;    // "2026-03-15"
  ubicacion: string;
  comunidad: string;
  pais: string;
  modalidad: string;    // label visible
  modalidad_id: string; // e.g. "running-road"
  modalidad_parent: string; // e.g. "running"
  distancia: string;    // label visible
  distancia_id: string; // e.g. "10k"
  precio: string;
  estado: string;       // "Abierta" | "Cerrada" | "Agotada"
  url: string;
  notas: string;
  source: string;       // sitio de origen
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9",
};

async function fetchHtml(url: string): Promise<Document | null> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS });
    if (!res.ok) { console.warn(`[fetch] ${res.status} ${url}`); return null; }
    const html = await res.text();
    return new DOMParser().parseFromString(html, "text/html");
  } catch (e) {
    console.error(`[fetch] error ${url}:`, e);
    return null;
  }
}

/** Convierte texto de fecha española a ISO yyyy-mm-dd. Acepta varios formatos. */
function parseDate(raw: string): string {
  if (!raw) return "";
  const MESES: Record<string, string> = {
    ene:"01",feb:"02",mar:"03",abr:"04",may:"05",jun:"06",
    jul:"07",ago:"08",sep:"09",oct:"10",nov:"11",dic:"12",
    enero:"01",febrero:"02",marzo:"03",abril:"04",mayo:"05",junio:"06",
    julio:"07",agosto:"08",septiembre:"09",octubre:"10",noviembre:"11",diciembre:"12",
    jan:"01",feb2:"02",mar2:"03",apr:"04",may2:"05",jun2:"06",
    jul2:"07",aug:"08",sep2:"09",oct2:"10",nov2:"11",dec:"12",
  };
  const s = raw.toLowerCase().trim();

  // "15/03/2026" o "15-03-2026"
  const m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})$/);
  if (m1) return `${m1[3]}-${m1[2].padStart(2,"0")}-${m1[1].padStart(2,"0")}`;

  // "2026-03-15"
  const m2 = s.match(/^(20\d{2})-(\d{2})-(\d{2})$/);
  if (m2) return s;

  // "15 marzo 2026" / "15 mar 2026"
  const m3 = s.match(/^(\d{1,2})\s+([a-záéíóú]+)\.?\s+(20\d{2})$/);
  if (m3) {
    const mes = MESES[m3[2].replace(".","")];
    if (mes) return `${m3[3]}-${mes}-${m3[1].padStart(2,"0")}`;
  }

  // "marzo 2026" → primer día del mes
  const m4 = s.match(/^([a-záéíóú]+)\.?\s+(20\d{2})$/);
  if (m4) {
    const mes = MESES[m4[1].replace(".","")];
    if (mes) return `${m4[2]}-${mes}-01`;
  }

  return "";
}

/** Normaliza texto de distancia a distancia_id */
function parseDistanciaId(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("sprint") || s.includes("< 5") || s.includes("<5")) return "sprint";
  if (s.match(/\b5\s*k/)) return "5k";
  if (s.match(/\b10\s*k/)) return "10k";
  if (s.match(/\b15\s*k/)) return "15k";
  if (s.match(/\b21|media\s*maratón|medio\s*fondo/)) return "media";
  if (s.match(/\b42|maratón|marathon/)) return "marat";
  if (s.match(/\b80|ultra.+80|100/)) return "ultra2";
  if (s.match(/\b50|ultra|trail.+largo|larga/)) return "ultra1";
  return "";
}

// ── Comunidad autónoma lookup ─────────────────────────────────────────────────

const CCAA_KEYWORDS: Array<[string, string[]]> = [
  ["Andalucía",          ["sevilla","málaga","granada","córdoba","jaén","huelva","almería","cádiz","andaluc"]],
  ["Aragón",             ["zaragoza","huesca","teruel","aragón"]],
  ["Asturias",           ["asturias","oviedo","gijón","avilés"]],
  ["Baleares",           ["mallorca","ibiza","menorca","palma","baleares"]],
  ["Canarias",           ["tenerife","gran canaria","lanzarote","fuerteventura","canarias"]],
  ["Cantabria",          ["santander","cantabria"]],
  ["Castilla-La Mancha", ["toledo","ciudad real","albacete","cuenca","guadalajara","castilla-la mancha"]],
  ["Castilla y León",    ["valladolid","burgos","salamanca","segovia","ávila","soria","zamora","palencia","león","castilla y león"]],
  ["Cataluña",           ["barcelona","girona","lleida","tarragona","cataluña","barcelona"]],
  ["Ceuta",              ["ceuta"]],
  ["Comunidad Valenciana",["valencia","alicante","castellón","comunidad valenciana"]],
  ["Extremadura",        ["badajoz","cáceres","extremadura"]],
  ["Galicia",            ["coruña","vigo","pontevedra","ourense","lugo","santiago","galicia"]],
  ["La Rioja",           ["logroño","rioja"]],
  ["Madrid",             ["madrid"]],
  ["Melilla",            ["melilla"]],
  ["Murcia",             ["murcia","cartagena"]],
  ["Navarra",            ["pamplona","navarra"]],
  ["País Vasco",         ["bilbao","san sebastián","donostia","vitoria","álava","vizcaya","guipúzcoa","país vasco","euskadi"]],
];

function guessComunidad(text: string): string {
  const s = text.toLowerCase();
  for (const [ccaa, kw] of CCAA_KEYWORDS) {
    if (kw.some(k => s.includes(k))) return ccaa;
  }
  return "";
}

// ── Scraper: Runedia ──────────────────────────────────────────────────────────
// https://runedia.com/calendario-carreras/

async function scrapeRunedia(): Promise<Race[]> {
  const races: Race[] = [];
  // Runedia paginates by month; scrape Jan–Dec 2026
  for (let mes = 1; mes <= 12; mes++) {
    const url = `https://runedia.com/calendario-carreras/?year=2026&month=${mes}`;
    const doc  = await fetchHtml(url);
    if (!doc) continue;

    const rows = doc.querySelectorAll(".carrera, .race-item, article.carrera, .lista-carrera li");
    rows.forEach(row => {
      const nombre   = row.querySelector(".nombre, .title, h2, h3, .carrera-nombre")?.textContent?.trim() || "";
      const fechaRaw = row.querySelector(".fecha, .date, time")?.textContent?.trim() || "";
      const lugar    = row.querySelector(".lugar, .location, .ciudad")?.textContent?.trim() || "";
      const distRaw  = row.querySelector(".distancia, .distance, .km")?.textContent?.trim() || "";
      const link     = (row.querySelector("a") as HTMLAnchorElement)?.href || "";
      const fecha_iso = parseDate(fechaRaw);

      if (!nombre || !fecha_iso.startsWith("2026")) return;

      races.push({
        nombre,
        fecha: fechaRaw,
        fecha_iso,
        ubicacion: lugar,
        comunidad: guessComunidad(lugar),
        pais: "España",
        modalidad: "Running",
        modalidad_id: "running-road",
        modalidad_parent: "running",
        distancia: distRaw,
        distancia_id: parseDistanciaId(distRaw),
        precio: "",
        estado: "Abierta",
        url: link.startsWith("http") ? link : `https://runedia.com${link}`,
        notas: "",
        source: "runedia.com",
      });
    });
  }
  console.log(`[runedia] ${races.length} pruebas`);
  return races;
}

// ── Scraper: SoyCorredor ──────────────────────────────────────────────────────
// https://www.soycorredor.es/calendario

async function scrapeSoyCorredor(): Promise<Race[]> {
  const races: Race[] = [];
  const doc = await fetchHtml("https://www.soycorredor.es/calendario?year=2026");
  if (!doc) return races;

  doc.querySelectorAll(".event-item, .calendar-event, .race, article").forEach(row => {
    const nombre    = row.querySelector("h2, h3, .title, .event-title")?.textContent?.trim() || "";
    const fechaRaw  = row.querySelector(".date, time, .fecha")?.textContent?.trim() || "";
    const lugar     = row.querySelector(".location, .lugar, .city")?.textContent?.trim() || "";
    const distRaw   = row.querySelector(".distance, .distancia")?.textContent?.trim() || "";
    const link      = (row.querySelector("a") as HTMLAnchorElement)?.href || "";
    const fecha_iso = parseDate(fechaRaw);

    if (!nombre || !fecha_iso.startsWith("2026")) return;

    races.push({
      nombre, fecha: fechaRaw, fecha_iso,
      ubicacion: lugar, comunidad: guessComunidad(lugar),
      pais: "España",
      modalidad: "Running", modalidad_id: "running-road", modalidad_parent: "running",
      distancia: distRaw, distancia_id: parseDistanciaId(distRaw),
      precio: "", estado: "Abierta",
      url: link.startsWith("http") ? link : `https://www.soycorredor.es${link}`,
      notas: "", source: "soycorredor.es",
    });
  });

  console.log(`[soycorredor] ${races.length} pruebas`);
  return races;
}

// ── Scraper: FETRI (Triatlón) ─────────────────────────────────────────────────
// https://www.fetri.es/calendario

async function scrapeFetri(): Promise<Race[]> {
  const races: Race[] = [];
  const doc = await fetchHtml("https://www.fetri.es/calendario/?temporada=2026");
  if (!doc) return races;

  doc.querySelectorAll("tr.competicion, .evento, .competicion-item, table tbody tr").forEach(row => {
    const cells    = row.querySelectorAll("td");
    if (cells.length < 3) return;

    const nombre    = cells[0]?.textContent?.trim() || "";
    const fechaRaw  = cells[1]?.textContent?.trim() || "";
    const lugar     = cells[2]?.textContent?.trim() || "";
    const tipoRaw   = (cells[3]?.textContent?.trim() || "").toLowerCase();
    const link      = (row.querySelector("a") as HTMLAnchorElement)?.href || "";
    const fecha_iso = parseDate(fechaRaw);

    if (!nombre || !fecha_iso.startsWith("2026")) return;

    let mid = "tri-triatlon";
    let mparent = "triatlon";
    let mlabel = "Triatlón";
    if (tipoRaw.includes("duatlón") || tipoRaw.includes("duatlon")) {
      mid = "tri-duatlon"; mlabel = "Duatlón";
    } else if (tipoRaw.includes("xterra")) {
      mid = "tri-xterra"; mlabel = "XTERRA";
    } else if (tipoRaw.includes("aquatlón") || tipoRaw.includes("aquatlon")) {
      mid = "tri-aquatlon"; mlabel = "Aquatlón";
    }

    races.push({
      nombre, fecha: fechaRaw, fecha_iso,
      ubicacion: lugar, comunidad: guessComunidad(lugar),
      pais: "España",
      modalidad: mlabel, modalidad_id: mid, modalidad_parent: mparent,
      distancia: cells[4]?.textContent?.trim() || "",
      distancia_id: parseDistanciaId(cells[4]?.textContent?.trim() || ""),
      precio: "", estado: "Abierta",
      url: link.startsWith("http") ? link : `https://www.fetri.es${link}`,
      notas: "", source: "fetri.es",
    });
  });

  console.log(`[fetri] ${races.length} pruebas`);
  return races;
}

// ── Scraper: HYROX ────────────────────────────────────────────────────────────
// https://hyrox.com/events/?country=ES

async function scrapeHyrox(): Promise<Race[]> {
  const races: Race[] = [];
  const doc = await fetchHtml("https://hyrox.com/events/?country=ES&year=2026");
  if (!doc) return races;

  doc.querySelectorAll(".event-card, .event-item, article.event, .hyrox-event").forEach(card => {
    const nombre    = card.querySelector("h2, h3, .event-name, .title")?.textContent?.trim() || "";
    const fechaRaw  = card.querySelector("time, .date, .event-date")?.textContent?.trim() || "";
    const lugar     = card.querySelector(".location, .city, .venue")?.textContent?.trim() || "";
    const link      = (card.querySelector("a") as HTMLAnchorElement)?.href || "";
    const fecha_iso = parseDate(fechaRaw);

    const esEspana  = guessComunidad(lugar) !== "" || lugar.toLowerCase().includes("spain") || lugar.toLowerCase().includes("españa");
    if (!nombre || !fecha_iso.startsWith("2026") || !esEspana) return;

    races.push({
      nombre, fecha: fechaRaw, fecha_iso,
      ubicacion: lugar, comunidad: guessComunidad(lugar),
      pais: "España",
      modalidad: "HYROX", modalidad_id: "func-hyrox", modalidad_parent: "funcional",
      distancia: "8km + 8 estaciones", distancia_id: "10k",
      precio: "", estado: "Abierta",
      url: link.startsWith("http") ? link : `https://hyrox.com${link}`,
      notas: "", source: "hyrox.com",
    });
  });

  console.log(`[hyrox] ${races.length} pruebas`);
  return races;
}

// ── Scraper: Spartan Race ─────────────────────────────────────────────────────
// https://es.spartan.com/races/find-a-race/

async function scrapeSpartan(): Promise<Race[]> {
  const races: Race[] = [];

  // Spartan embeds JSON-LD o usa una API interna; intentamos la página principal
  const doc = await fetchHtml("https://es.spartan.com/races/find-a-race/?country=es");
  if (!doc) return races;

  // Busca JSON-LD estructurado
  doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      const data = JSON.parse(script.textContent || "");
      const events = Array.isArray(data) ? data : data["@type"] === "Event" ? [data] : [];
      events.forEach((ev: Record<string, unknown>) => {
        if (ev["@type"] !== "Event") return;
        const nombre   = String(ev.name || "");
        const fechaRaw = String(ev.startDate || "");
        const fecha_iso = parseDate(fechaRaw) || fechaRaw.split("T")[0];
        const lugar    = String((ev.location as Record<string,unknown>)?.name || "");
        const url      = String(ev.url || "");

        if (!nombre || !fecha_iso.startsWith("2026")) return;

        const tipoRaw = nombre.toLowerCase();
        let mid = "ocr-spartan", mlabel = "Spartan Race";
        if (tipoRaw.includes("sprint"))      { mid = "ocr-spartan"; mlabel = "Spartan Sprint"; }
        if (tipoRaw.includes("super"))       { mid = "ocr-spartan"; mlabel = "Spartan Super"; }
        if (tipoRaw.includes("beast"))       { mid = "ocr-spartan"; mlabel = "Spartan Beast"; }
        if (tipoRaw.includes("ultra"))       { mid = "ocr-spartan"; mlabel = "Spartan Ultra"; }

        races.push({
          nombre, fecha: fechaRaw, fecha_iso,
          ubicacion: lugar, comunidad: guessComunidad(lugar),
          pais: "España",
          modalidad: mlabel, modalidad_id: mid, modalidad_parent: "ocr",
          distancia: "", distancia_id: "",
          precio: "", estado: "Abierta",
          url, notas: "", source: "spartan.com",
        });
      });
    } catch { /* JSON parse error, skip */ }
  });

  // Fallback: busca tarjetas HTML si no hay JSON-LD
  if (races.length === 0) {
    doc.querySelectorAll(".race-card, .event-card, article").forEach(card => {
      const nombre    = card.querySelector("h2, h3, .title")?.textContent?.trim() || "";
      const fechaRaw  = card.querySelector("time, .date")?.textContent?.trim() || "";
      const lugar     = card.querySelector(".location, .city")?.textContent?.trim() || "";
      const link      = (card.querySelector("a") as HTMLAnchorElement)?.href || "";
      const fecha_iso = parseDate(fechaRaw);
      if (!nombre || !fecha_iso.startsWith("2026")) return;
      races.push({
        nombre, fecha: fechaRaw, fecha_iso,
        ubicacion: lugar, comunidad: guessComunidad(lugar),
        pais: "España",
        modalidad: "Spartan Race", modalidad_id: "ocr-spartan", modalidad_parent: "ocr",
        distancia: "", distancia_id: "", precio: "", estado: "Abierta",
        url: link.startsWith("http") ? link : `https://es.spartan.com${link}`,
        notas: "", source: "spartan.com",
      });
    });
  }

  console.log(`[spartan] ${races.length} pruebas`);
  return races;
}

// ── Scraper: Calendario Aguas Abiertas ────────────────────────────────────────
// https://www.calendarioaguasabiertas.com/

async function scrapeAguasAbiertas(): Promise<Race[]> {
  const races: Race[] = [];
  const doc = await fetchHtml("https://www.calendarioaguasabiertas.com/");
  if (!doc) return races;

  doc.querySelectorAll("table tbody tr, .event-row, .prueba, article").forEach(row => {
    const cells  = row.querySelectorAll("td");
    let nombre = "", fechaRaw = "", lugar = "", distRaw = "", link = "";

    if (cells.length >= 3) {
      nombre    = cells[0]?.textContent?.trim() || row.querySelector(".nombre, h2, h3")?.textContent?.trim() || "";
      fechaRaw  = cells[1]?.textContent?.trim() || row.querySelector("time, .fecha")?.textContent?.trim() || "";
      lugar     = cells[2]?.textContent?.trim() || row.querySelector(".lugar, .location")?.textContent?.trim() || "";
      distRaw   = cells[3]?.textContent?.trim() || "";
      link      = (row.querySelector("a") as HTMLAnchorElement)?.href || "";
    } else {
      nombre   = row.querySelector(".nombre, h2, h3, .title")?.textContent?.trim() || "";
      fechaRaw = row.querySelector("time, .fecha, .date")?.textContent?.trim() || "";
      lugar    = row.querySelector(".lugar, .location")?.textContent?.trim() || "";
      link     = (row.querySelector("a") as HTMLAnchorElement)?.href || "";
    }

    const fecha_iso = parseDate(fechaRaw);
    if (!nombre || !fecha_iso.startsWith("2026")) return;

    races.push({
      nombre, fecha: fechaRaw, fecha_iso,
      ubicacion: lugar, comunidad: guessComunidad(lugar),
      pais: "España",
      modalidad: "Aguas abiertas", modalidad_id: "nat-abiertas", modalidad_parent: "natacion",
      distancia: distRaw, distancia_id: parseDistanciaId(distRaw),
      precio: "", estado: "Abierta",
      url: link.startsWith("http") ? link : `https://www.calendarioaguasabiertas.com${link}`,
      notas: "", source: "calendarioaguasabiertas.com",
    });
  });

  console.log(`[aguasabiertas] ${races.length} pruebas`);
  return races;
}

// ── Scraper: ITRA (Trail Running) ─────────────────────────────────────────────
// https://itra.run/Races/FindRace — usa API JSON

async function scrapeItra(): Promise<Race[]> {
  const races: Race[] = [];
  try {
    // ITRA expone una API pública de búsqueda
    const apiUrl = "https://itra.run/api/Races/GetRaces?countryCode=ES&year=2026&pageSize=200&pageIndex=0";
    const res  = await fetch(apiUrl, { headers: { ...FETCH_HEADERS, Accept: "application/json" } });
    if (!res.ok) { console.warn(`[itra] ${res.status}`); return races; }

    const json = await res.json();
    const list: Record<string, unknown>[] = json?.races || json?.data || (Array.isArray(json) ? json : []);

    list.forEach(ev => {
      const nombre    = String(ev.name || ev.raceName || "");
      const fechaRaw  = String(ev.date || ev.startDate || "");
      const fecha_iso = parseDate(fechaRaw) || String(fechaRaw).split("T")[0];
      const lugar     = String(ev.city || ev.location || "");
      const distKm    = Number(ev.distanceKm || ev.distance || 0);
      const url       = String(ev.url || ev.raceUrl || `https://itra.run/Races/FindRace?name=${encodeURIComponent(nombre)}`);

      if (!nombre || !fecha_iso.startsWith("2026")) return;

      const distRaw = distKm ? `${distKm} km` : "";
      races.push({
        nombre, fecha: fechaRaw, fecha_iso,
        ubicacion: lugar, comunidad: guessComunidad(lugar),
        pais: "España",
        modalidad: "Trail running", modalidad_id: "running-trail", modalidad_parent: "running",
        distancia: distRaw, distancia_id: parseDistanciaId(distRaw),
        precio: "", estado: "Abierta",
        url, notas: "", source: "itra.run",
      });
    });
  } catch (e) {
    console.error("[itra] error:", e);
  }

  console.log(`[itra] ${races.length} pruebas`);
  return races;
}

// ── Validación ───────────────────────────────────────────────────────────────

const VALID_CCAA = new Set([
  "Andalucía","Aragón","Principado de Asturias","Islas Baleares","Canarias",
  "Cantabria","Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Comunidad de Madrid","Melilla","Región de Murcia",
  "Comunidad Foral de Navarra","País Vasco",
]);

const AGG_DOMAINS = [
  "calendariocarrerasobstaculos.es","theboxinthebox.com",
  "soycorredor.es","runedia.com","buscametas.com",
];

function validateRace(r: Race): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!r.nombre?.trim())           return { valid: false, warnings: ["nombre vacío"] };
  if (!r.fecha_iso)                warnings.push("sin fecha_iso");
  if (r.fecha_iso && r.fecha_iso < "2026-01-01")
    return { valid: false, warnings: [`fecha pasada: ${r.fecha_iso}`] };
  if (!r.comunidad)                warnings.push("sin comunidad");
  if (r.comunidad && !VALID_CCAA.has(r.comunidad))
    warnings.push(`CCAA desconocida: "${r.comunidad}"`);
  if (!r.precio)                   warnings.push("sin precio");
  if (r.url && AGG_DOMAINS.some(d => r.url.includes(d)))
    warnings.push(`URL apunta a agregador: ${r.url} — se nullifica`);

  return { valid: true, warnings };
}

/** Normaliza nombre para comparación fuzzy (elimina año y sufijos de ciudad) */
function normalizeNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s*20\d\d\s*/g, " ")
    .replace(/[^a-záéíóúüñ0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase    = createClient(supabaseUrl, supabaseKey);

  const log: string[] = [];
  let inserted = 0, updated = 0, rejected = 0;

  const results = await Promise.allSettled([
    scrapeRunedia(),
    scrapeSoyCorredor(),
    scrapeFetri(),
    scrapeHyrox(),
    scrapeSpartan(),
    scrapeAguasAbiertas(),
    scrapeItra(),
  ]);

  const allRaces: Race[] = [];
  results.forEach(r => {
    if (r.status === "fulfilled") allRaces.push(...r.value);
    else log.push(`Scraper error: ${r.reason}`);
  });

  log.push(`Total scraped: ${allRaces.length}`);

  // Deduplicar en memoria por (nombre_normalizado + fecha_iso + comunidad)
  const seen = new Set<string>();
  const unique = allRaces.filter(r => {
    const key = `${normalizeNombre(r.nombre)}|${r.fecha_iso ?? ""}|${r.comunidad ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  log.push(`Unique (after dedup): ${unique.length}`);

  // Upsert uno a uno con validación y dedup contra BD
  for (const race of unique) {
    const { valid, warnings } = validateRace(race);
    if (!valid) { rejected++; log.push(`REJECTED: ${race.nombre} — ${warnings.join("; ")}`); continue; }

    // Nullificar URLs de agregadores
    if (race.url && AGG_DOMAINS.some(d => race.url.includes(d))) race.url = "";

    // Dedup contra BD: buscar por nombre exacto + fecha_iso primero
    let query = supabase.from("races").select("id").eq("nombre", race.nombre);
    if (race.fecha_iso) query = query.eq("fecha_iso", race.fecha_iso);
    else query = query.is("fecha_iso", null);
    const { data: exact } = await query.maybeSingle();

    let existingId = exact?.id ?? null;

    // Si no hay exacto, buscar por nombre normalizado + fecha + comunidad
    if (!existingId && race.fecha_iso && race.comunidad) {
      const { data: candidates } = await supabase
        .from("races").select("id, nombre")
        .eq("fecha_iso", race.fecha_iso).eq("comunidad", race.comunidad);
      const norm = normalizeNombre(race.nombre);
      const fuzzy = candidates?.find(c => normalizeNombre(c.nombre) === norm);
      if (fuzzy) existingId = fuzzy.id;
    }

    const payload = { ...race, url: race.url || null };

    if (existingId) {
      const { error } = await supabase.from("races").update(payload).eq("id", existingId);
      if (error) log.push(`UPDATE ERROR: ${race.nombre} — ${error.message}`);
      else updated++;
    } else {
      const { error } = await supabase.from("races").insert(payload);
      if (error) log.push(`INSERT ERROR: ${race.nombre} — ${error.message}`);
      else inserted++;
    }
  }

  log.push(`Inserted: ${inserted}, Updated: ${updated}, Rejected: ${rejected}`);
  console.log(log.join("\n"));

  return new Response(JSON.stringify({ ok: true, log, inserted, updated, rejected }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
