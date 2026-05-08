/**
 * scrape-gyms.mjs — Scraping exhaustivo de gimnasios BasicFit, DreamFit y Vivagym en España
 * Crea la tabla sport_centers si no existe y luego inserta todos los centros.
 * Uso: node scripts/scrape-gyms.mjs
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI";
const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const HEADERS = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

// ── CCAA mapping ─────────────────────────────────────────────────────────────
function getCCAA(provincia) {
  const map = {
    'Madrid': 'Madrid',
    'Barcelona': 'Cataluña', 'Girona': 'Cataluña', 'Tarragona': 'Cataluña', 'Lleida': 'Cataluña', 'Lérida': 'Cataluña',
    'Valencia': 'Comunidad Valenciana', 'Alicante': 'Comunidad Valenciana', 'Castellón': 'Comunidad Valenciana', 'Castellón de la Plana': 'Comunidad Valenciana',
    'Sevilla': 'Andalucía', 'Málaga': 'Andalucía', 'Granada': 'Andalucía', 'Córdoba': 'Andalucía',
    'Jaén': 'Andalucía', 'Almería': 'Andalucía', 'Cádiz': 'Andalucía', 'Huelva': 'Andalucía',
    'Bizkaia': 'País Vasco', 'Vizcaya': 'País Vasco', 'Gipuzkoa': 'País Vasco', 'Guipúzcoa': 'País Vasco', 'Álava': 'País Vasco', 'Araba': 'País Vasco',
    'Zaragoza': 'Aragón', 'Huesca': 'Aragón', 'Teruel': 'Aragón',
    'Murcia': 'Murcia',
    'Valladolid': 'Castilla y León', 'Burgos': 'Castilla y León', 'León': 'Castilla y León',
    'Salamanca': 'Castilla y León', 'Segovia': 'Castilla y León', 'Ávila': 'Castilla y León',
    'Soria': 'Castilla y León', 'Zamora': 'Castilla y León', 'Palencia': 'Castilla y León',
    'Toledo': 'Castilla-La Mancha', 'Ciudad Real': 'Castilla-La Mancha', 'Cuenca': 'Castilla-La Mancha',
    'Guadalajara': 'Castilla-La Mancha', 'Albacete': 'Castilla-La Mancha',
    'Asturias': 'Asturias',
    'Navarra': 'Navarra',
    'Cantabria': 'Cantabria',
    'La Rioja': 'La Rioja', 'Logroño': 'La Rioja',
    'Baleares': 'Baleares', 'Illes Balears': 'Baleares', 'Islas Baleares': 'Baleares',
    'Las Palmas': 'Canarias', 'Santa Cruz de Tenerife': 'Canarias', 'Tenerife': 'Canarias', 'Gran Canaria': 'Canarias',
    'Badajoz': 'Extremadura', 'Cáceres': 'Extremadura',
    'A Coruña': 'Galicia', 'Coruña': 'Galicia', 'Pontevedra': 'Galicia', 'Ourense': 'Galicia', 'Lugo': 'Galicia',
  };
  return map[provincia] || '';
}

// ── Supabase helpers ──────────────────────────────────────────────────────────
async function tableExists() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sport_centers?limit=1`, {
    headers: { ...HEADERS, "Accept": "application/json" }
  });
  return r.status !== 404;
}

async function upsertBatch(rows) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sport_centers`, {
    method: 'POST',
    headers: { ...HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
  });
  const text = await r.text();
  if (!r.ok) {
    console.error('  Error batch insert:', r.status, text.substring(0, 200));
    return { ok: false, count: 0 };
  }
  const inserted = JSON.parse(text);
  return { ok: true, count: inserted.length };
}

async function insertAll(gyms, franquicia) {
  let total = 0, errors = 0;
  const BATCH = 50;
  for (let i = 0; i < gyms.length; i += BATCH) {
    const batch = gyms.slice(i, i + BATCH);
    const { ok, count } = await upsertBatch(batch);
    if (ok) total += count;
    else errors += batch.length;
    process.stdout.write(`\r  ${franquicia}: ${total} insertados, ${errors} errores (${i + batch.length}/${gyms.length})`);
  }
  console.log('');
  return { total, errors };
}

// ── Apply SQL migration via management API (best effort) ─────────────────────
async function applyMigration() {
  const sql = readFileSync(
    new URL('../supabase/migrations/20260508_create_sport_centers.sql', import.meta.url),
    'utf8'
  );

  // Try Supabase management API
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (accessToken) {
    const r = await fetch('https://api.supabase.com/v1/projects/ssyljhtganuaanczxeep/database/query', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql }),
    });
    if (r.ok) { console.log('  Migración aplicada via management API.'); return true; }
  }

  // Try pg module if available
  try {
    const { default: pg } = await import('pg');
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    if (dbUrl) {
      const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      await client.connect();
      await client.query(sql);
      await client.end();
      console.log('  Migración aplicada via pg client.');
      return true;
    }
  } catch {}

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BASICFIT — 242 gimnasios en España, 21 páginas × 12
// ═══════════════════════════════════════════════════════════════════════════════

function cityFromSlug(slug) {
  // basic-fit-a-coruna-avd.-salvador-de-madariaga-HASH
  // Remove prefix and hash
  const noPrefix = slug.replace(/^basic-fit-/, '');
  const noHash = noPrefix.replace(/-[a-f0-9]{32}$/, '');
  // City is usually 1-3 words at the beginning; address starts after
  // We'll just return the full slug without hash for display purposes
  return noHash;
}

function parseBasicFitHTML(html, baseUrl) {
  const clubs = [];

  // Strategy 1: Try to find JSON data blob (__NEXT_DATA__ or window.__data)
  const jsonMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const props = data?.props?.pageProps;
      // Look for clubs/stores array anywhere in the props
      const findClubs = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        if (Array.isArray(obj) && obj.length > 0 && obj[0]?.name && obj[0]?.address) return obj;
        for (const key of Object.keys(obj)) {
          const result = findClubs(obj[key]);
          if (result) return result;
        }
        return null;
      };
      const foundClubs = findClubs(props);
      if (foundClubs) {
        for (const c of foundClubs) {
          clubs.push({
            nombre: `Basic-Fit ${c.name || ''}`.trim(),
            direccion: c.address || c.street || '',
            ciudad: c.city || '',
            rawUrl: c.url || c.link || '',
          });
        }
        return clubs;
      }
    } catch {}
  }

  // Strategy 2: Look for club tiles with data-club-id or similar
  const dataMatches = [...html.matchAll(/data-(?:club|store)[^>]*?(?:city|ciudad)['"]\s*:\s*['"]([^'"]+)['"]/gi)];

  // Strategy 3: Find all club links and extract surrounding text
  const linkPattern = /href="(\/es-es\/clubs\/basic-fit-([^"]+?)\.html)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const [, urlPath, slug, innerHtml] = match;
    // Strip HTML tags from inner content
    const text = innerHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Text is likely: "City | Name | Address" or just "Name Address"
    // Split on common separators
    const parts = text.split(/[\|\n·•]+/).map(s => s.trim()).filter(Boolean);

    let city = '', name = '', address = '';
    if (parts.length >= 3) {
      city = parts[0];
      name = parts[1];
      address = parts[2];
    } else if (parts.length === 2) {
      city = parts[0];
      address = parts[1];
      name = parts[1];
    } else if (parts.length === 1) {
      address = parts[0];
      name = parts[0];
    }

    // Fallback: derive city from URL slug
    if (!city && slug) {
      const slugParts = slug.replace(/^basic-fit-/, '').replace(/-[a-f0-9]{32}$/, '');
      city = slugParts.split('-')[0].replace(/-/g, ' ');
    }

    clubs.push({
      nombre: `Basic-Fit ${city ? city + ' ' : ''}${name}`.replace(/\s+/g, ' ').trim(),
      direccion: address,
      ciudad: city,
      rawUrl: `https://www.basic-fit.com${urlPath}`,
    });
  }

  // Strategy 4: Look for JSON-like structures in window variables
  const windowMatch = html.match(/window\.__(?:stores|clubs|data)\s*=\s*(\[[\s\S]*?\]);/);
  if (windowMatch && clubs.length === 0) {
    try {
      const data = JSON.parse(windowMatch[1]);
      for (const c of data) {
        clubs.push({
          nombre: `Basic-Fit ${c.city || ''} ${c.name || c.address || ''}`.trim(),
          direccion: c.address || c.street || '',
          ciudad: c.city || '',
          rawUrl: c.url || '',
        });
      }
    } catch {}
  }

  return clubs;
}

function getCityFromAddress(address) {
  // Extract city from patterns like "Calle X 1, 28001 Madrid" or "Madrid"
  const cpMatch = address.match(/\b\d{5}\s+([A-ZÁÉÍÓÚÜÑ][^,\n]+)/i);
  if (cpMatch) return cpMatch[1].trim();
  // Last part after comma
  const parts = address.split(',');
  if (parts.length > 1) return parts[parts.length - 1].trim();
  return '';
}

function getProvinciaFromCity(ciudad, defaultProvincia) {
  const cityToProvince = {
    'Madrid': 'Madrid', 'Alcalá de Henares': 'Madrid', 'Alcobendas': 'Madrid',
    'Móstoles': 'Madrid', 'Leganés': 'Madrid', 'Getafe': 'Madrid', 'Alcorcón': 'Madrid',
    'Fuenlabrada': 'Madrid', 'Coslada': 'Madrid', 'Parla': 'Madrid', 'Majadahonda': 'Madrid',
    'Pozuelo de Alarcón': 'Madrid', 'Las Rozas de Madrid': 'Madrid', 'Torrejón de Ardoz': 'Madrid',
    'Rivas-Vaciamadrid': 'Madrid', 'Aranjuez': 'Madrid', 'Alcalá de Guadaira': 'Sevilla',
    'San Sebastián de los Reyes': 'Madrid', 'San Fernando de Henares': 'Madrid',
    'Galapagar': 'Madrid', 'Pinto': 'Madrid', 'Arroyomolinos': 'Madrid',
    'El Escorial': 'Madrid', 'Tres Cantos': 'Madrid', 'Villanueva de la Cañada': 'Madrid',
    'Barcelona': 'Barcelona', 'L\'Hospitalet de Llobregat': 'Barcelona', 'Badalona': 'Barcelona',
    'Terrassa': 'Barcelona', 'Sabadell': 'Barcelona', 'Mataró': 'Barcelona',
    'Sant Cugat del Vallès': 'Barcelona', 'Cornellà de Llobregat': 'Barcelona',
    'Mollet del Vallès': 'Barcelona', 'Vic': 'Barcelona', 'Sant Adrià de Besòs': 'Barcelona',
    'Sant Boi de Llobregat': 'Barcelona', 'Esplugues de Llobregat': 'Barcelona',
    'Sant Feliu de Llobregat': 'Barcelona',
    'Valencia': 'Valencia', 'Alboraya': 'Valencia', 'Torrent': 'Valencia', 'Paterna': 'Valencia',
    'Gandía': 'Valencia', 'Sagunto': 'Valencia', 'Elche': 'Alicante', 'Benidorm': 'Alicante',
    'Elda': 'Alicante', 'Alicante': 'Alicante', 'San Vicente del Raspeig': 'Alicante',
    'Castellón de la Plana': 'Castellón', 'Villarreal': 'Castellón', 'Vila-real': 'Castellón',
    'Sevilla': 'Sevilla', 'Dos Hermanas': 'Sevilla', 'Camas': 'Sevilla', 'Alcalá de Guadaíra': 'Sevilla',
    'Málaga': 'Málaga', 'Marbella': 'Málaga', 'Fuengirola': 'Málaga', 'Estepona': 'Málaga', 'Vélez-Málaga': 'Málaga',
    'Granada': 'Granada', 'Córdoba': 'Córdoba',
    'Bilbao': 'Bizkaia', 'Barakaldo': 'Bizkaia', 'Getxo': 'Bizkaia', 'Basauri': 'Bizkaia',
    'Portugalete': 'Bizkaia', 'Artea': 'Bizkaia',
    'San Sebastián': 'Gipuzkoa', 'Rentería': 'Gipuzkoa', 'Errenteria': 'Gipuzkoa',
    'Vitoria': 'Álava', 'Vitoria-Gasteiz': 'Álava',
    'Zaragoza': 'Zaragoza', 'Logroño': 'La Rioja',
    'Murcia': 'Murcia', 'Cartagena': 'Murcia', 'Molina de Segura': 'Murcia',
    'Oviedo': 'Asturias', 'Gijón': 'Asturias', 'Avilés': 'Asturias',
    'Las Palmas de Gran Canaria': 'Las Palmas', 'Vecindario': 'Las Palmas', 'Aguimes': 'Las Palmas',
    'Santa Cruz de Tenerife': 'Santa Cruz de Tenerife', 'La Laguna': 'Santa Cruz de Tenerife',
    'Vigo': 'Pontevedra', 'Pontevedra': 'Pontevedra', 'Santiago de Compostela': 'A Coruña', 'A Coruña': 'A Coruña',
    'Pamplona': 'Navarra', 'Segovia': 'Segovia',
  };
  return cityToProvince[ciudad] || defaultProvincia || '';
}

async function scrapeBasicFit() {
  console.log('\n═══ BasicFit ═══════════════════════════════════════════════════');
  const allClubs = [];
  const TOTAL_PAGES = 21;
  const PAGE_SIZE = 12;

  // Try fetching all at once first (larger sz)
  let tryAllAtOnce = false;
  try {
    const r = await fetch('https://www.basic-fit.com/es-es/gimnasios?s=0&sz=300', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
      timeout: 30000,
    });
    if (r.ok) {
      const html = await r.text();
      const clubs = parseBasicFitHTML(html, 'https://www.basic-fit.com');
      if (clubs.length > 100) {
        console.log(`  Obtenidos ${clubs.length} clubes BasicFit en una sola página`);
        tryAllAtOnce = true;
        allClubs.push(...clubs);
      }
    }
  } catch (e) {
    console.log('  sz=300 falló, paginando...');
  }

  if (!tryAllAtOnce) {
    // Paginate through all 21 pages
    for (let page = 0; page < TOTAL_PAGES; page++) {
      const offset = page * PAGE_SIZE;
      try {
        await delay(800);
        const r = await fetch(`https://www.basic-fit.com/es-es/gimnasios?s=${offset}&sz=${PAGE_SIZE}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
          },
          timeout: 30000,
        });
        if (!r.ok) { console.log(`  Página ${page+1}: HTTP ${r.status}`); continue; }
        const html = await r.text();
        const clubs = parseBasicFitHTML(html, 'https://www.basic-fit.com');
        console.log(`  Página ${page+1}/${TOTAL_PAGES}: ${clubs.length} clubes`);
        allClubs.push(...clubs);
      } catch (e) {
        console.error(`  Página ${page+1} error: ${e.message}`);
      }
    }
  }

  // Also try the SFCC store locator API
  if (allClubs.length < 50) {
    console.log('  Intentando API de localización de tiendas SFCC...');
    try {
      const r = await fetch(
        'https://www.basic-fit.com/on/demandware.store/Sites-basic-fit-es-Site/es_ES/Stores-FindStores?' +
        'showMap=true&radius=2000&postalCode=28001&countryCode=ES&distanceUnit=km',
        { headers: { 'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest' }, timeout: 30000 }
      );
      if (r.ok) {
        const text = await r.text();
        try {
          const data = JSON.parse(text);
          if (data.stores || data.results) {
            const stores = data.stores || data.results;
            for (const s of stores) {
              allClubs.push({
                nombre: `Basic-Fit ${s.city || ''} ${s.name || s.address1 || ''}`.trim(),
                direccion: `${s.address1 || ''} ${s.address2 || ''}`.trim(),
                ciudad: s.city || '',
                rawUrl: s.url || '',
              });
            }
            console.log(`  SFCC API: ${allClubs.length} clubes`);
          }
        } catch {}
      }
    } catch {}
  }

  // Normalize and deduplicate
  const seen = new Set();
  const normalized = [];
  for (const c of allClubs) {
    if (!c.ciudad && c.direccion) c.ciudad = getCityFromAddress(c.direccion);
    if (!c.nombre || c.nombre === 'Basic-Fit') continue;
    const key = `${c.nombre.toLowerCase()}|${c.ciudad.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const provincia = getProvinciaFromCity(c.ciudad, '');
    normalized.push({
      nombre: c.nombre,
      direccion: c.direccion || null,
      ciudad: c.ciudad || null,
      provincia: provincia || null,
      ccaa: getCCAA(provincia) || null,
      url: c.rawUrl || null,
      franquicia: 'BasicFit',
      tipo: 'gimnasio',
    });
  }

  console.log(`  Total BasicFit normalizados: ${normalized.length}`);
  return normalized;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DREAMFIT — 26 centros + próximas aperturas
// ═══════════════════════════════════════════════════════════════════════════════

const DREAMFIT_CENTERS = [
  { slug: 'vistahermosa',           ciudad: 'Alicante',                    provincia: 'Alicante' },
  { slug: 'vitoria',                ciudad: 'Vitoria-Gasteiz',             provincia: 'Álava' },
  { slug: 'oviedo',                 ciudad: 'Oviedo',                      provincia: 'Asturias' },
  { slug: 'gijon',                  ciudad: 'Gijón',                       provincia: 'Asturias' },
  { slug: 'sant-adria-de-besos',    ciudad: 'Sant Adrià de Besòs',         provincia: 'Barcelona' },
  { slug: 'sant-boi-de-llobregat',  ciudad: 'Sant Boi de Llobregat',       provincia: 'Barcelona' },
  { slug: 'hospitalet',             ciudad: "L'Hospitalet de Llobregat",   provincia: 'Barcelona' },
  { slug: 'barakaldo',              ciudad: 'Barakaldo',                   provincia: 'Bizkaia' },
  { slug: 'cordoba',                ciudad: 'Córdoba',                     provincia: 'Córdoba' },
  { slug: 'santiago-de-compostela', ciudad: 'Santiago de Compostela',      provincia: 'A Coruña' },
  { slug: 'logrono',                ciudad: 'Logroño',                     provincia: 'La Rioja' },
  { slug: 'las-palmas',             ciudad: 'Las Palmas de Gran Canaria',  provincia: 'Las Palmas' },
  { slug: 'aluche',                 ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'valdebernardo',          ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'vallecas',               ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'villaverde',             ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'alcorcon',               ciudad: 'Alcorcón',                    provincia: 'Madrid' },
  { slug: 'ventas',                 ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'moratalaz',              ciudad: 'Madrid',                      provincia: 'Madrid' },
  { slug: 'san-sebastian-de-los-reyes', ciudad: 'San Sebastián de los Reyes', provincia: 'Madrid' },
  { slug: 'parla',                  ciudad: 'Parla',                       provincia: 'Madrid' },
  { slug: 'mostoles-fuensanta',     ciudad: 'Móstoles',                    provincia: 'Madrid' },
  { slug: 'nueva-segovia',          ciudad: 'Segovia',                     provincia: 'Segovia' },
  { slug: 'sevilla',                ciudad: 'Sevilla',                     provincia: 'Sevilla' },
  { slug: 'valencia',               ciudad: 'Valencia',                    provincia: 'Valencia' },
  { slug: 'los-enlaces',            ciudad: 'Zaragoza',                    provincia: 'Zaragoza' },
];

function parseDreamFitAddress(html) {
  // Try schema.org structured data first
  const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (ldMatch) {
    for (const block of ldMatch) {
      const content = block.replace(/<[^>]+>/g, '');
      try {
        const data = JSON.parse(content);
        const places = Array.isArray(data) ? data : [data];
        for (const place of places) {
          if (place?.address || place?.['@type'] === 'SportsActivityLocation' || place?.['@type'] === 'HealthClub') {
            const addr = place.address;
            if (addr) {
              return `${addr.streetAddress || ''}, ${addr.postalCode || ''} ${addr.addressLocality || ''}`.trim().replace(/^,\s*/, '');
            }
          }
        }
      } catch {}
    }
  }

  // Try common address HTML patterns
  const patterns = [
    /(?:dirección|address)[^>]*>([^<]{10,80})</i,
    /<address[^>]*>([^<]{10,80})</i,
    /(?:calle|avenida|paseo|plaza|camino)[^<]{5,80}/i,
    /\b\d{5}\b.*?(?:madrid|barcelona|valencia|sevilla|málaga|alicante|bilbao|zaragoza|murcia|oviedo|gijón|vitoria|logroño|granada|córdoba|sevilla|vigo|santiago)/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[0].replace(/<[^>]+>/g, '').trim();
  }

  // Last resort: look for address near map embed
  const mapMatch = html.match(/(?:query|q)=([^&"']+)/);
  if (mapMatch) {
    return decodeURIComponent(mapMatch[1]).replace(/\+/g, ' ');
  }

  return null;
}

async function scrapeDreamFit() {
  console.log('\n═══ DreamFit ════════════════════════════════════════════════════');
  const gyms = [];

  for (const center of DREAMFIT_CENTERS) {
    const url = `https://www.dreamfit.es/centros/${center.slug}`;
    try {
      await delay(600);
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
        timeout: 20000,
      });
      let direccion = null;
      if (r.ok) {
        const html = await r.text();
        direccion = parseDreamFitAddress(html);
      }

      // Format name from slug
      const nameParts = center.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
      const locationName = center.ciudad + (center.ciudad === 'Madrid' ? ` ${nameParts.join(' ')}` : '');

      gyms.push({
        nombre: `Dreamfit ${locationName}`,
        direccion: direccion || null,
        ciudad: center.ciudad,
        provincia: center.provincia,
        ccaa: getCCAA(center.provincia),
        url,
        franquicia: 'DreamFit',
        tipo: 'gimnasio',
      });
      process.stdout.write(`  ${center.slug}: ${direccion ? '✓' : '?'}\n`);
    } catch (e) {
      console.error(`  ${center.slug} error: ${e.message}`);
      gyms.push({
        nombre: `Dreamfit ${center.ciudad}`,
        direccion: null,
        ciudad: center.ciudad,
        provincia: center.provincia,
        ccaa: getCCAA(center.provincia),
        url,
        franquicia: 'DreamFit',
        tipo: 'gimnasio',
      });
    }
  }

  console.log(`  Total DreamFit: ${gyms.length}`);
  return gyms;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIVAGYM — ~220+ gimnasios en España (datos verificados por regiones)
// ═══════════════════════════════════════════════════════════════════════════════

function vg(nombre, direccion, ciudad, provincia, urlPath) {
  return {
    nombre: `VivaGym ${nombre}`,
    direccion,
    ciudad,
    provincia,
    ccaa: getCCAA(provincia),
    url: `https://www.vivagym.com${urlPath}`,
    franquicia: 'Vivagym',
    tipo: 'gimnasio',
  };
}

const VIVAGYM_GYMS = [
  // ── MADRID (71) ──────────────────────────────────────────────────────────
  vg('Tres Cantos',              'Pl. Del Toro, 1, 28760 Tres Cantos',                    'Tres Cantos',              'Madrid', '/es-es/gimnasios/madrid/capital/tres-cantos/'),
  vg('Alberto Aguilera',         'Calle de Alberto Aguilera, 1, 28015 Madrid',            'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/alberto-aguilera/'),
  vg('Alcalá El Val',            'CC Alcalá El Val, 28804 Alcalá de Henares',             'Alcalá de Henares',        'Madrid', '/es-es/gimnasios/madrid/alcala-de-henares/el-val/'),
  vg('Alcalá Ronda Fiscal',      'C/ Ronda Fiscal 8, 28803 Alcalá de Henares',            'Alcalá de Henares',        'Madrid', '/es-es/gimnasios/madrid/alcala-de-henares/ronda-fiscal/'),
  vg('Alcobendas Río Norte',     'Carr. de Fuencarral, 4, 28108 Alcobendas',              'Alcobendas',               'Madrid', '/es-es/gimnasios/madrid/alcobendas/rio-norte/'),
  vg('Aranjuez',                 'P.º Del Deleite, 13, 28300 Aranjuez',                   'Aranjuez',                 'Madrid', '/es-es/gimnasios/madrid/aranjuez/aranjuez/'),
  vg('Arroyomolinos Park',       'CC. OMO Arroyomolinos Park, 28939 Arroyomolinos',       'Arroyomolinos',            'Madrid', '/es-es/gimnasios/madrid/arroyomolinos/park/'),
  vg('Arturo Soria',             'C. de Arturo Soria, 310, 28033 Madrid',                'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/arturo-soria/'),
  vg('Barrio Del Pilar',         'Camino de Ganapanes, 27, 28035 Madrid',                'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/barrio-del-pilar/'),
  vg('Bernabéu',                 'Av. de Brasil, 18, 28020 Madrid',                       'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/bernabeu/'),
  vg('Carabanchel',              'Av. de Ntra. Sra. de Fátima, 34, 28047 Madrid',        'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/carabanchel/'),
  vg('Castellana',               'Av. de Brasil, 28, 28020 Madrid',                       'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/castellana/'),
  vg('Chamberí',                 'C. de Alonso Cano, 10, 28010 Madrid',                  'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/chamberi/'),
  vg('Ciudad de Barcelona',      'C. de Luis Mitjans, 22, 28007 Madrid',                 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/ciudad-de-barcelona/'),
  vg('Ciudad Lineal',            'C. de Los Hermanos García Noblejas, 43, 28037 Madrid', 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/ciudad-lineal/'),
  vg('Ciudad Universitaria',     'Calle Los Vascos, 26-28, 28040 Madrid',                'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/ciudad-universitaria/'),
  vg('Clara del Rey',            'Calle de Santa Rita 10, 28002 Madrid',                 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/clara-del-rey/'),
  vg('Conde de Casal',           'Av. Del Mediterráneo, 50, 28007 Madrid',               'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/conde-de-casal/'),
  vg('Coslada Plaza',            'Av. de José Gárate, 3, 28823 Coslada',                 'Coslada',                  'Madrid', '/es-es/gimnasios/madrid/coslada/coslada-plaza/'),
  vg('Cuatro Caminos',           'Calle de Bravo Murillo, 120, 28020 Madrid',            'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/cuatro-caminos/'),
  vg('Cuzco',                    'Calle Pensamiento, 26, 28020 Madrid',                  'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/cuzco/'),
  vg('El Escorial',              'Calle de Juliana, 2, 28280 El Escorial',               'El Escorial',              'Madrid', '/es-es/gimnasios/madrid/el-escorial/el-escorial/'),
  vg('El Retiro',                'Calle Del Alcalde Sainz de Baranda, 26, 28009 Madrid', 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/el-retiro/'),
  vg('Embajadores',              'Rda. de Valencia, 1, 28012 Madrid',                    'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/embajadores/'),
  vg('Equinoccio',               'Centro Comercial Equinoccio, 28222 Majadahonda',       'Majadahonda',              'Madrid', '/es-es/gimnasios/madrid/majadahonda/equinoccio/'),
  vg('Estudiantes',              'Serrano 127, 28006 Madrid',                             'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/estudiantes/'),
  vg('Fuenlabrada Central',      'Pasaje de Los Notarios S/n, 28943 Fuenlabrada',        'Fuenlabrada',              'Madrid', '/es-es/gimnasios/madrid/fuenlabrada/central/'),
  vg('Fuenlabrada Las Provincias','Centro Comercial Las Provincias, 28941 Fuenlabrada',  'Fuenlabrada',              'Madrid', '/es-es/gimnasios/madrid/fuenlabrada/las-provincias/'),
  vg('Fuenlabrada Loranca',      'Av. de Pablo Iglesias, 25, 28942 Fuenlabrada',         'Fuenlabrada',              'Madrid', '/es-es/gimnasios/madrid/fuenlabrada/loranca/'),
  vg('Fuenlabrada Nexum',        'C. Almendro, 28942 Fuenlabrada',                        'Fuenlabrada',              'Madrid', '/es-es/gimnasios/madrid/fuenlabrada/nexum/'),
  vg('Galapagar',                'Calle Postas, 1, 28260 Galapagar',                      'Galapagar',                'Madrid', '/es-es/gimnasios/madrid/galapagar/galapagar/'),
  vg('Getafe Universidad',       'Av. de Cadiz, 2, 28903 Getafe',                         'Getafe',                   'Madrid', '/es-es/gimnasios/madrid/getafe/universidad/'),
  vg('Islazul',                  'Calle Calderilla, 1, 28054 Madrid',                     'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/islazul/'),
  vg('José Garate',              'Av. de José Gárate, 5, 28823 Coslada',                 'Coslada',                  'Madrid', '/es-es/gimnasios/madrid/coslada/jose-garate/'),
  vg('Julián Camarillo',         'Calle Alfonso Gomez 61, 28037 Madrid',                 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/julian-camarillo/'),
  vg('La Concepción',            'Calle de la Virgen de África, 14, 28027 Madrid',       'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/la-concepcion/'),
  vg('Las Américas',             'Avenida Del Leguario 53, 28981 Parla',                  'Parla',                    'Madrid', '/es-es/gimnasios/madrid/parla/las-americas/'),
  vg('Las Rosas',                'Calle de Aquitania, 9, 28032 Madrid',                  'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/las-rosas/'),
  vg('Las Rozas Burgo',          'Centro Comercial Burgo, 28231 Las Rozas de Madrid',    'Las Rozas de Madrid',      'Madrid', '/es-es/gimnasios/madrid/las-rozas/burgo/'),
  vg('Las Tablas Norte',         'Calle de Hospital de Órbigo, 12, 28050 Madrid',        'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/las-tablas-norte/'),
  vg('Las Tablas Sur',           'Av. de Burgos, 89, 28050 Madrid',                       'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/las-tablas-sur/'),
  vg('Leganés Centro',           'C/ de Aligustre, 5, 28912 Leganés',                    'Leganés',                  'Madrid', '/es-es/gimnasios/madrid/leganes/leganes/'),
  vg('Madrid Río',               'Cl. Del Mármol, 5, 28005 Madrid',                      'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/rio/'),
  vg('Majadahonda Centro',       'Av. de Los Reyes Católicos, 8, 28220 Majadahonda',     'Majadahonda',              'Madrid', '/es-es/gimnasios/madrid/majadahonda/majadahonda/'),
  vg('Mercado de Numancia',      'C. de Josefa Díaz, 28038 Madrid',                      'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/mercado-de-numancia/'),
  vg('Mercado de Villaverde',    'Paseo de Alberto Palacios, 18, 28021 Madrid',          'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/mercado-de-villaverde/'),
  vg('Mirasierra',               'Calle de la Costa Brava 38, 28034 Madrid',             'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/mirasierra/'),
  vg('Móstoles Dos de Mayo',     'Av. Del Dos de Mayo, 27, 28934 Móstoles',              'Móstoles',                 'Madrid', '/es-es/gimnasios/madrid/mostoles/dos-de-mayo/'),
  vg('Palacio Vistalegre',       'Av. de la Plaza de Toros, S/n, 28025 Madrid',          'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/palacio-vistalegre/'),
  vg('Parque Almansa',           'C. de Aravaca, 7, 28040 Madrid',                        'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/parque-almansa/'),
  vg('Paseo de la Habana',       'P.º de la Habana, 86, 28036 Madrid',                   'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/paseo-de-la-habana/'),
  vg('Paseo de las Delicias',    'Calle de Juan de Vera, 4, 28045 Madrid',               'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/paseo-de-las-delicias/'),
  vg('Pinto',                    'CC Plaza Éboli, 28320 Pinto',                           'Pinto',                    'Madrid', '/es-es/gimnasios/madrid/pinto/pinto/'),
  vg('Plaza Mayor',              'Calle Del Conde de Miranda, 1, 28005 Madrid',          'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/plaza-mayor/'),
  vg('Pozuelo Centro',           'Camino Valdenigriales, 6, 28223 Pozuelo de Alarcón',   'Pozuelo de Alarcón',       'Madrid', '/es-es/gimnasios/madrid/pozuelo-de-alarcon/pozuelo-centro/'),
  vg('Pozuelo El Torreón',       'Centro Comercial El Torreón, 28224 Pozuelo de Alarcón','Pozuelo de Alarcón',       'Madrid', '/es-es/gimnasios/madrid/pozuelo-de-alarcon/pozuelo-el-torreon/'),
  vg('Príncipe de Vergara',      'Calle Príncipe de Vergara, 113, 28002 Madrid',         'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/principe-de-vergara/'),
  vg('Puerta del Sol',           'C. Mayor, 6, 28013 Madrid',                             'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/puerta-del-sol/'),
  vg('Quintana',                 'C. de Virgen de Lluc, 104, 28027 Madrid',              'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/quintana/'),
  vg('Rivas',                    'Av. Los Almendros, 28522 Rivas-Vaciamadrid',            'Rivas-Vaciamadrid',        'Madrid', '/es-es/gimnasios/madrid/rivas-vaciamadrid/rivas/'),
  vg('Rivas Bulevar',            'C. Paco Rabal, 28521 Rivas-Vaciamadrid',               'Rivas-Vaciamadrid',        'Madrid', '/es-es/gimnasios/madrid/rivas-vaciamadrid/futura/'),
  vg('Rivas Futura',             'Isaac Peral 2, 28521 Rivas-Vaciamadrid',               'Rivas-Vaciamadrid',        'Madrid', '/es-es/gimnasios/madrid/rivas-vaciamadrid/rivas-futura/'),
  vg('Rivas Santa Ana',          'C. de la Madera, 19, 28522 Rivas-Vaciamadrid',         'Rivas-Vaciamadrid',        'Madrid', '/es-es/gimnasios/madrid/rivas-vaciamadrid/santa-ana/'),
  vg('San Fernando de Henares',  'C. Rafael Sánchez Ferlosio, 28830 San Fernando de Henares', 'San Fernando de Henares', 'Madrid', '/es-es/gimnasios/madrid/san-fernando-de-henares/san-fdo-de-henares/'),
  vg('San Sebastián de los Reyes','Paseo Europa, 28, 28703 San Sebastián de los Reyes',  'San Sebastián de los Reyes','Madrid', '/es-es/gimnasios/madrid/san-sebastian-de-los-reyes/san-sebastian-de-los-reyes/'),
  vg('Santa Eugenia',            'Av. de Santa Eugenia, 6, 28031 Madrid',                'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/santa-eugenia/'),
  vg('Torre Picasso',            'Pl. Pablo Ruiz Picasso, 28020 Madrid',                 'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/torre-picasso/'),
  vg('Torrejón Circunvalación',  'C. Circunvalación, 20, 28850 Torrejón de Ardoz',       'Torrejón de Ardoz',        'Madrid', '/es-es/gimnasios/madrid/torrejon/circunvalacion/'),
  vg('Vallecas',                 'C. Cabeza Mesada, 1, 28031 Madrid',                    'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/vallecas/'),
  vg('Ventas',                   'Plaza Bami, S/n, 28017 Madrid',                         'Madrid',                   'Madrid', '/es-es/gimnasios/madrid/capital/ventas/'),
  vg('Villanueva de la Cañada',  'Av. de la Sierra de Gredos, 2, 28691 Villanueva de la Cañada', 'Villanueva de la Cañada', 'Madrid', '/es-es/gimnasios/madrid/villanueva-de-la-canada/villanueva-de-la-canada/'),

  // ── BARCELONA (32) ───────────────────────────────────────────────────────
  vg('Passeig de Sant Joan',     'Passeig de Sant Joan, 27, 08010 Barcelona',            'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/passeig-de-sant-joan/'),
  vg('Arc de Triomf',            'Carrer de Girona, 9, 08010 Barcelona',                 'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/arc-de-triomf/'),
  vg('Av. Roma',                 'Avinguda de Roma, 22, 08015 Barcelona',                'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/av-roma/'),
  vg('Berlín',                   'Calle Berlín, 74, 08036 Barcelona',                    'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/berlin/'),
  vg('Bruc',                     'Carrer Del Bruc, 49, 08022 Barcelona',                 'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/bruc/'),
  vg('Cornellà',                 'Carrer de Josep Cuxart I Cases, 08940 Cornellà de Llobregat', 'Cornellà de Llobregat', 'Barcelona', '/es-es/gimnasios/barcelona/cornella/cornella/'),
  vg('Diagonal',                 'Carrer de Mallorca, 318, 08037 Barcelona',             'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/diagonal/'),
  vg('Entença',                  'Avinguda de Roma, 42, 08015 Barcelona',                'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/entenca/'),
  vg('Finestrelles',             'Calle Laurea Miró, 20, 08950 Esplugues de Llobregat',  'Esplugues de Llobregat',   'Barcelona', '/es-es/gimnasios/barcelona/esplugues-de-llobregat/finestrelles/'),
  vg('Glòries',                  'Av. Diagonal, 208, 08018 Barcelona',                   'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/glories/'),
  vg('Gran Vía – Hospitalet',    'Carrer de Jerusalem, 1, 08902 Hospitalet de Llobregat','L\'Hospitalet de Llobregat', 'Barcelona', '/es-es/gimnasios/barcelona/hospitalet-de-llobregat/gran-via/'),
  vg('La Rotonda',               'Passeig de Sant Gervasi, 51, 08022 Barcelona',         'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/la-rotonda/'),
  vg('La Verneda',               'Carrer de Guipúscoa, 130, 08020 Barcelona',            'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/la-verneda/'),
  vg('Londres',                  'Calle Londres, 71, 08036 Barcelona',                   'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/londres/'),
  vg('Magoria',                  'Camí de la Cadena, 11, 08014 Barcelona',               'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/magoria/'),
  vg('Manso',                    'Carrer de Manso, 28, 08015 Barcelona',                 'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/manso/'),
  vg('Meridiana',                'Avenida Meridiana, 333, 08027 Barcelona',              'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/meridiana/'),
  vg('Millenium – Sabadell',     'Avda. Francesc Macià, 60, 08208 Sabadell',             'Sabadell',                 'Barcelona', '/es-es/gimnasios/barcelona/sabadell/millenium/'),
  vg('Mollet Del Vallès',        'Av. Dels Rabassaires, 48, 08100 Mollet Del Vallès',    'Mollet del Vallès',        'Barcelona', '/es-es/gimnasios/barcelona/mollet-del-valles/mollet-del-valles/'),
  vg('Sagrada Familia',          'Carrer Mallorca, 508, 08013 Barcelona',                'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/sagrada-familia/'),
  vg('Sagrera',                  'Carrer Del Pegàs, 9, 08027 Barcelona',                 'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/sagrera/'),
  vg('Sant Antoni',              'Carrer Comte d\'Urgell, 1, 08011 Barcelona',           'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/sant-antoni/'),
  vg('Sant Feliu',               'Carrer de Laureà Miró, 363, 08980 Sant Feliu de Llobregat', 'Sant Feliu de Llobregat', 'Barcelona', '/es-es/gimnasios/barcelona/sant-feliu-de-llobregat/sant-feliu/'),
  vg('Santa Eulàlia',            'Carrer Martí Codolar, 43, 08902 Hospitalet de Llobregat', 'L\'Hospitalet de Llobregat', 'Barcelona', '/es-es/gimnasios/barcelona/hospitalet-de-llobregat/santa-eulalia/'),
  vg('Sants',                    'Carrer Sants, 212, 08028 Barcelona',                   'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/sants/'),
  vg('Terrassa Can Palet',       'Avinguda de Santa Eulàlia 236, 08223 Terrassa',        'Terrassa',                 'Barcelona', '/es-es/gimnasios/barcelona/terrassa/terrassa-can-palet/'),
  vg('Terrassa Plaça',           'Carrer Navarra, 10, 08227 Terrassa',                   'Terrassa',                 'Barcelona', '/es-es/gimnasios/barcelona/terrassa/placa/'),
  vg('Terrassa Riera',           'Avda. Del Valles, 139, 08223 Terrassa',                'Terrassa',                 'Barcelona', '/es-es/gimnasios/barcelona/terrassa/terrasa/'),
  vg('Universitat',              'Gran Via de Les Corts Catalanes 584, 08011 Barcelona', 'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/universitat/'),
  vg('Vía Augusta',              'Via Augusta, 17, 08006 Barcelona',                     'Barcelona',                'Barcelona', '/es-es/gimnasios/barcelona/capital/via-augusta/'),
  vg('Vic',                      'Carrer Costa d\'En Paratge, 10, 08500 Vic',            'Vic',                      'Barcelona', '/es-es/gimnasios/barcelona/vic/vic/'),
  vg('Templers (Lleida)',         'Carrer Acadèmia, 34, 25002 Lleida',                    'Lleida',                   'Lleida',    '/es-es/gimnasios/barcelona/lleida/templers/'),

  // ── VALENCIA (25) ────────────────────────────────────────────────────────
  vg('Torrent Avinguda',         'Avenida Del Vedat 31, 46900 Torrent',                   'Torrent',                  'Valencia', '/es-es/gimnasios/valencia/torrent/torrent-avinguda/'),
  vg('Alfafar',                  'C. Clara Campoamor, 2, 46910 Alfafar',                  'Alfafar',                  'Valencia', '/es-es/gimnasios/valencia/capital/alfafar/'),
  vg('Arena',                    'C/ de Santa Genoveva Torres, 21, 46019 Valencia',       'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/arena/'),
  vg('Av. Burjassot',            'Av. de Burjassot, 273, 46015 Valencia',                 'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/avenida-burjassot/'),
  vg('Benlloch',                 'Avenida Cardenal Benlloch, 26, 46021 Valencia',         'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/benlloch/'),
  vg('Campanar',                 'Av. de Tirso de Molina, 16, 46015 Valencia',            'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/campanar/'),
  vg('Cánovas',                  'Carrer de Salamanca, 19-23, 46005 Valencia',            'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/canovas/'),
  vg('Clariano',                 'Calle Clariano, 36, 46021 Valencia',                    'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/clariano/'),
  vg('Eliana',                   'Avenida Camp de Turia, 76, 46183 Eliana',               'Eliana',                   'Valencia', '/es-es/gimnasios/valencia/eliana/eliana/'),
  vg('Godella',                  'Carrer Camí Camarena, 1, 46110 Godella',                'Godella',                  'Valencia', '/es-es/gimnasios/valencia/godella/godella/'),
  vg('Islas Canarias',           'C/ Del Riu Escalona, 13, 46023 Valencia',               'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/islas-canarias/'),
  vg('Leandro',                  'Carrer de Leandro de Saralegui, 11, 46021 Valencia',    'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/leandro/'),
  vg('Museros',                  'Av. Constitució, 21, 46136 Museros',                    'Museros',                  'Valencia', '/es-es/gimnasios/valencia/capital/museros/'),
  vg('Parque Central',           'C. de Les Filipines, 39, 46006 Valencia',               'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/parque-central/'),
  vg('Paterna',                  'Polígono Industrial Fuente Del Jarro, 46988 Paterna',   'Paterna',                  'Valencia', '/es-es/gimnasios/valencia/capital/paterna/'),
  vg('Patraix',                  'Carrer de Xera, 72, 46017 Valencia',                    'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/patraix/'),
  vg('Pio XII',                  'Plaça Del Pare Domènech, 5, 46009 Valencia',            'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/pio-xii/'),
  vg('Platero',                  'C/ de L\'argenter Suárez, 11, 46009 Valencia',          'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/platero/'),
  vg('Ruzafa',                   'Carrer de Sueca, 20, 46004 Valencia',                   'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/ruzafa/'),
  vg('Torrent Nord',             'Carrer de Picanya, 37, 46900 Torrent',                  'Torrent',                  'Valencia', '/es-es/gimnasios/valencia/capital/torrent-nord/'),
  vg('Tres Cruces',              'Carrer de la Borrasca, 1, 46017 Valencia',              'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/tres-cruces/'),
  vg('Tres Forques',             'Tres Forques 36, 46018 Valencia',                        'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/tres-forques/'),
  vg('Troya',                    'Calle Troya, 4, 46007 Valencia',                         'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/troya/'),
  vg('Uruguay',                  'Carrer de L\'uruguai, 11, 46007 Valencia',              'Valencia',                 'Valencia', '/es-es/gimnasios/valencia/capital/uruguay/'),
  vg('Xàtiva',                   'Ronda de la Sèquia de la Vila 16, 46800 Xàtiva',        'Xàtiva',                   'Valencia', '/es-es/gimnasios/valencia/xativa/xativa/'),

  // ── SEVILLA (6) ──────────────────────────────────────────────────────────
  vg('Alcalá Plaza',             'CC Alcalá Plaza, Av. 28 de Febrero S/N, 41500 Alcalá de Guadaíra', 'Alcalá de Guadaíra', 'Sevilla', '/es-es/gimnasios/sevilla/alcala-de-guadaira/alcala-plaza/'),
  vg('Camas',                    'Calle Poeta Muñoz San Roman 1, 41900 Camas',            'Camas',                    'Sevilla', '/es-es/gimnasios/sevilla/camas/camas/'),
  vg('Dos Hermanas',             'Av. Ing. José Luis Prats, 41701 Dos Hermanas',          'Dos Hermanas',             'Sevilla', '/es-es/gimnasios/sevilla/dos-hermanas/dos-hermanas/'),
  vg('Los Remedios',             'Avda. República Argentina, 27, 41011 Sevilla',          'Sevilla',                  'Sevilla', '/es-es/gimnasios/sevilla/capital/los-remedios/'),
  vg('Nervión',                  'Calle Luis Montoto, 88, 41018 Sevilla',                 'Sevilla',                  'Sevilla', '/es-es/gimnasios/sevilla/capital/nervion/'),
  vg('Sevilla Este',             'C. Argos, 13, 41020 Sevilla',                           'Sevilla',                  'Sevilla', '/es-es/gimnasios/sevilla/capital/este/'),

  // ── VIZCAYA (11) ─────────────────────────────────────────────────────────
  vg('Abando',                   'José María Olavarri Kalea, 1, 48001 Bilbao',            'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/abando/'),
  vg('Artea',                    'Peruri Auzoa, 33, 48940 Artea',                          'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/artea/artea/'),
  vg('Autonomía',                'Autonomia Kalea, 53, 48012 Bilbao',                      'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/autonomia-53/'),
  vg('Ballonti',                 'Av. Ballonti, 1, 48920 Portugalete',                     'Portugalete',              'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/ballonti/'),
  vg('Bilbondo',                 'C. Zabalandi S/n, 48970 Basauri',                        'Basauri',                  'Bizkaia', '/es-es/gimnasios/vizcaya/basauri/bilbondo/'),
  vg('Bolueta',                  'Miraflores Etorbidea, 51, 48004 Bilbao',                 'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/bolueta/'),
  vg('Deusto',                   'Madariaga Etorbidea, 24, 48014 Bilbao',                  'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/deusto/'),
  vg('Gran Vía – Bilbao',        'Diego Lopez Haroko Kale Nagusia, 83, 48011 Bilbao',     'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/gran-via-bilbao/'),
  vg('Leioa',                    'Amaia Kalea, 29, 48930 Getxo',                           'Getxo',                    'Bizkaia', '/es-es/gimnasios/vizcaya/getxo/leioa/'),
  vg('Miribilla',                'Espinosa Orive Doktorearen Kalea, 5, 48003 Bilbao',     'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/miribilla/'),
  vg('Sarriko',                  'Mediterraneo Itsasoaren Kalea, 1, 48015 Bilbao',        'Bilbao',                   'Bizkaia', '/es-es/gimnasios/vizcaya/bilbao/sarriko/'),

  // ── ZARAGOZA (9) ─────────────────────────────────────────────────────────
  vg('Actur',                    'Calle María Zambrano 31, 50018 Zaragoza',               'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/actur/'),
  vg('Av. Cataluña',             'Avda Cataluña 59, 50014 Zaragoza',                      'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/av-cataluna/'),
  vg('Boston',                   'Av. de Cesáreo Alierta, 9, 50008 Zaragoza',             'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/boston/'),
  vg('Delicias',                 'Av. de Navarra, 28, 50010 Zaragoza',                    'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/delicias/'),
  vg('GranCasa',                 'C. de María Zambrano, 35, 50018 Zaragoza',              'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/gran-casa/'),
  vg('Las Torres',               'Cam. de Las Torres, 99, 50007 Zaragoza',               'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/las-torres/'),
  vg('Parque Roma',              'C. de Santander, 30, 50010 Zaragoza',                  'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/parque-roma/'),
  vg('Puerta del Carmen',        'C. de Hernán Cortés, 6, 50004 Zaragoza',              'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/puerta-del-carmen/'),
  vg('Romareda',                 'Paseo Isabel La Catolica, 6, 50009 Zaragoza',          'Zaragoza',                 'Zaragoza', '/es-es/gimnasios/zaragoza/capital/romareda/'),

  // ── ASTURIAS (4) ─────────────────────────────────────────────────────────
  vg('La Calzada',               'Calle Maestro Amado Morán, 33213 Gijón',               'Gijón',                    'Asturias', '/es-es/gimnasios/asturias/gijon/la-calzada/'),
  vg('Natahoyo',                 'C. de Rosalía de Castro, 4, 33212 Gijón',              'Gijón',                    'Asturias', '/es-es/gimnasios/asturias/gijon/natahoyo/'),
  vg('Oviedo Centro',            'C. Matemático Pedrayes, 9, 33005 Oviedo',              'Oviedo',                   'Asturias', '/es-es/gimnasios/asturias/oviedo/oviedo/'),
  vg('San Agustín',              'CC San Agustín Planta 2, 33202 Gijón',                 'Gijón',                    'Asturias', '/es-es/gimnasios/asturias/gijon/san-agustin/'),

  // ── MURCIA (6) ───────────────────────────────────────────────────────────
  vg('Cartagena Centro',         'Calle Ángel Bruna, 12, 30201 Cartagena',               'Cartagena',                'Murcia', '/es-es/gimnasios/murcia/cartagena/cartagena-centro/'),
  vg('Mandarache',               'Ronda Ciudad de la Unión, 30, 30202 Cartagena',        'Cartagena',                'Murcia', '/es-es/gimnasios/murcia/cartagena/mandarache/'),
  vg('Plaza Circular',           'Rda. de Levante, 15, 30008 Murcia',                    'Murcia',                   'Murcia', '/es-es/gimnasios/murcia/capital/plaza-circular/'),
  vg('Ronda Norte – Murcia',     'Ronda Norte, 8, 30009 Murcia',                          'Murcia',                   'Murcia', '/es-es/gimnasios/murcia/capital/ronda-norte-murcia/'),
  vg('Ronda Sur',                'C. Río Pliego, 13, 30010 Murcia',                       'Murcia',                   'Murcia', '/es-es/gimnasios/murcia/capital/ronda-sur/'),
  vg('Vega Plaza',               'CC Vega Plaza, 30500 Molina de Segura',                'Molina de Segura',         'Murcia', '/es-es/gimnasios/murcia/molina-de-segura/vega-plaza/'),

  // ── MÁLAGA (5) ───────────────────────────────────────────────────────────
  vg('El Ingenio',               'Av. Del Rey Juan Carlos I, 29700 Vélez-Málaga',        'Vélez-Málaga',             'Málaga', '/es-es/gimnasios/malaga/velez-malaga/el-ingenio/'),
  vg('Estepona Park',            'Av. Juan Carlos I, 29680 Estepona',                    'Estepona',                 'Málaga', '/es-es/gimnasios/malaga/estepona/park/'),
  vg('Fuengirola',               'C/ Francisco Pizarro, 2, 29640 Fuengirola',            'Fuengirola',               'Málaga', '/es-es/gimnasios/malaga/fuengirola/fuengirola/'),
  vg('Málaga Centro',            'Calle Armengual de la Mota 12, 29007 Málaga',          'Málaga',                   'Málaga', '/es-es/gimnasios/malaga/capital/malaga-centro/'),
  vg('Málaga Juan XXIII',        'Avda. Juan XXIII, 23, 29006 Málaga',                   'Málaga',                   'Málaga', '/es-es/gimnasios/malaga/capital/juan-xxiii/'),

  // ── ALICANTE (7) ─────────────────────────────────────────────────────────
  vg('Benidorm Avenida Aigüera', 'AV. L\'AIGUERA, 11, 03502 Benidorm',                  'Benidorm',                 'Alicante', '/es-es/gimnasios/alicante/benidorm/avenida-aiguera/'),
  vg('Carrús',                   'Avinguda de Novelda, 129, 03206 Elche',                'Elche',                    'Alicante', '/es-es/gimnasios/alicante/capital/carrus/'),
  vg('Conde Lumiares',           'Av. Conde de Lumiares, 12-16, 03010 Alicante',         'Alicante',                 'Alicante', '/es-es/gimnasios/alicante/capital/conde-lumiares/'),
  vg('Plaza América',            'C. Javier Carratalá, 13, 03010 Alicante',              'Alicante',                 'Alicante', '/es-es/gimnasios/alicante/capital/plaza-america/'),
  vg('San Vicente',              'C/ Alicante, 82, 03690 San Vicente del Raspeig',       'San Vicente del Raspeig',  'Alicante', '/es-es/gimnasios/alicante/san-vicente-de-raspeig/san-vicente/'),
  vg('Santa Lucía',              'Carrer Sant Vicent, 10, 03202 Elche',                  'Elche',                    'Alicante', '/es-es/gimnasios/alicante/elche/santa-lucia/'),
  vg('Universidad Alicante',     'C. Del Bronce, 8, 03690 San Vicente del Raspeig',      'San Vicente del Raspeig',  'Alicante', '/es-es/gimnasios/alicante/capital/universidad-alicante/'),

  // ── TENERIFE (5) ─────────────────────────────────────────────────────────
  vg('CC Alcampo – La Laguna',   'CC Alcampo, TF-2, 38205 La Laguna',                   'La Laguna',                'Santa Cruz de Tenerife', '/es-es/gimnasios/tenerife/san-cristobal-de-la-laguna/alcampo/'),
  vg('Las Retamas',              'Calle Sgto. Provisional, 38010 Santa Cruz de Tenerife','Santa Cruz de Tenerife',   'Santa Cruz de Tenerife', '/es-es/gimnasios/tenerife/santa-cruz-de-tenerife/las-retamas/'),
  vg('San Benito – La Laguna',   'Cam. San Lázaro, 9, 38206 La Laguna',                 'La Laguna',                'Santa Cruz de Tenerife', '/es-es/gimnasios/tenerife/san-cristobal-de-la-laguna/la-laguna/'),
  vg('Tres de Mayo',             'Av. Tres de Mayo, 22, 38005 Santa Cruz de Tenerife',  'Santa Cruz de Tenerife',   'Santa Cruz de Tenerife', '/es-es/gimnasios/tenerife/santa-cruz-de-tenerife/tres-de-mayo/'),
  vg('Tomé Cano',                'Edif. Los Corales 2, C. Fragata Danmark, 38005 Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', '/es-es/gimnasios/tenerife/santa-cruz-de-tenerife/tome-cano/'),

  // ── GRAN CANARIA (8) ─────────────────────────────────────────────────────
  vg('Alisios',                  'C. Hermanos Domínguez Santana S/N, 35018 Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria', 'Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/alisios/'),
  vg('Castillo',                 'C. Pino, 10, 35118 Arinaga',                           'Agüimes',                  'Las Palmas', '/es-es/gimnasios/gran-canaria/aguimes/castillo/'),
  vg('La Ballena',               'CC La Ballena, Carr. Del Nte. 112, 35013 Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria', 'Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/la-ballena/'),
  vg('Las Arenas',               'CC Las Arenas, Ctra. Del Rincón S/N, 35010 Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria', 'Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/las-arenas/'),
  vg('Las Palmas Juan XXIII',    'Av. Juan XXIII, 3, 35004 Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria','Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/juan-xxiii/'),
  vg('Siete Palmas',             'CC Siete Palmas, 35019 Las Palmas de Gran Canaria',   'Las Palmas de Gran Canaria','Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/siete-palmas/'),
  vg('Vecindario',               'Av. de Canarias, 332, 35110 Vecindario',               'Vecindario',               'Las Palmas', '/es-es/gimnasios/gran-canaria/vecindario/vecindario/'),
  vg('Vegueta',                  'C. Bernardino Correa Viera, 8, 35002 Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria', 'Las Palmas', '/es-es/gimnasios/gran-canaria/las-palmas-de-gran-canaria/vegueta/'),

  // ── GRANADA (1) ──────────────────────────────────────────────────────────
  vg('Fuentenueva',              'Arabial, 95, 18003 Granada',                            'Granada',                  'Granada', '/es-es/gimnasios/granada/capital/fuentenueva/'),

  // ── GUIPÚZCOA (2) ────────────────────────────────────────────────────────
  vg('Gros',                     'Peña Y Goñi Kalea, 14, 20002 San Sebastián',           'San Sebastián',            'Gipuzkoa', '/es-es/gimnasios/guipuzcoa/san-sebastian/gros/'),
  vg('Niessen',                  'Xabier Olaskoaga Plaza, 10, 20100 Errenteria',         'Errenteria',               'Gipuzkoa', '/es-es/gimnasios/guipuzcoa/renteria/niessen/'),

  // ── ÁLAVA (4) ────────────────────────────────────────────────────────────
  vg('Aranbizkarra',             'Monseñor Estenaga Kalea, 4, 01002 Vitoria-Gasteiz',    'Vitoria-Gasteiz',          'Álava', '/es-es/gimnasios/alava/vitoria/aranbizkarra/'),
  vg('Guridi',                   'San Prudencio Kalea, 6, 01005 Vitoria-Gasteiz',        'Vitoria-Gasteiz',          'Álava', '/es-es/gimnasios/alava/vitoria/guridi/'),
  vg('Los Herrán',               'C. de Los Herrán, 34, 01004 Vitoria-Gasteiz',          'Vitoria-Gasteiz',          'Álava', '/es-es/gimnasios/alava/vitoria/los-herran/'),
  vg('Padeleku',                 'Donostia San Sebastian Kalea, 48, 01010 Vitoria-Gasteiz', 'Vitoria-Gasteiz',       'Álava', '/es-es/gimnasios/alava/vitoria/padeleku/'),

  // ── CÓRDOBA (1) ──────────────────────────────────────────────────────────
  vg('Gran Capitán',             'Av. Del Gran Capitán, 23, 14008 Córdoba',              'Córdoba',                  'Córdoba', '/es-es/gimnasios/cordoba/capital/gran-capitan/'),

  // ── CASTELLÓN (5) ────────────────────────────────────────────────────────
  vg('Avenida del Mar',          'Avenida Del Mar 55, 12003 Castellón de la Plana',      'Castellón de la Plana',    'Castellón', '/es-es/gimnasios/castellon/capital/avenida-del-mar/'),
  vg('Castellón Estaciones',     'Carrer de la Vall d\'Uixó, 28, 12004 Castellón de la Plana', 'Castellón de la Plana', 'Castellón', '/es-es/gimnasios/castellon/capital/castellon-estaciones/'),
  vg('Dr Marañón',               'C/ Pare Ricardo, 24, 12005 Castellón de la Plana',    'Castellón de la Plana',    'Castellón', '/es-es/gimnasios/castellon/capital/dr-maranon/'),
  vg('Salera',                   'N-340a, CC Salera, 12006 Castellón de la Plana',       'Castellón de la Plana',    'Castellón', '/es-es/gimnasios/castellon/capital/salera/'),
  vg('Villarreal',               'Carrer Vicente Sanchiz, 35, 12540 Vila-real',          'Vila-real',                'Castellón', '/es-es/gimnasios/castellon/capital/villarreal/'),

  // ── PONTEVEDRA (3) ───────────────────────────────────────────────────────
  vg('Vigo Travesía',            'Rúa Travesía de Vigo, 202, 36207 Vigo',               'Vigo',                     'Pontevedra', '/es-es/gimnasios/pontevedra/vigo/vigo-travesia/'),
  vg('Plaza Elíptica',           'Praza Francisco Fernández Del Riego S/n, 36203 Vigo',  'Vigo',                     'Pontevedra', '/es-es/gimnasios/pontevedra/vigo/plaza-eliptica/'),
  vg('Vigo Centro',              'Rúa de María Berdiales, 24, 36203 Vigo',              'Vigo',                     'Pontevedra', '/es-es/gimnasios/pontevedra/vigo/vigo-centro/'),
];

async function scrapeVivaGym() {
  console.log('\n═══ Vivagym ═════════════════════════════════════════════════════');

  // Try to discover additional regions not yet hardcoded
  const extraRegions = [
    'navarra', 'cantabria', 'la-rioja', 'cadiz', 'almeria', 'huelva', 'jaen',
    'valladolid', 'burgos', 'salamanca', 'leon', 'extremadura', 'albacete',
    'toledo', 'ciudad-real', 'cuenca', 'lugo', 'ourense', 'a-coruna', 'logrono',
    'cadiz', 'almeria', 'granada', 'huesca', 'teruel',
  ];

  const extraGyms = [];
  for (const region of extraRegions) {
    try {
      await delay(500);
      const r = await fetch(`https://www.vivagym.com/es-es/gimnasios/${region}/`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'es-ES,es;q=0.9' },
        timeout: 15000,
      });
      if (!r.ok) continue;
      const html = await r.text();

      // Extract gym URLs and names from the regional listing page
      const gymPattern = /href="(https:\/\/www\.vivagym\.com\/es-es\/gimnasios\/[^"]+\/)"[^>]*>[\s\S]{0,200}?<[^>]*class="[^"]*(?:gym-name|title|nombre)[^"]*"[^>]*>(.*?)<\/[^>]+>/gi;
      // Simpler: extract all gym links from the page
      const linkPattern = /href="(https:\/\/www\.vivagym\.com\/es-es\/gimnasios\/[^"]{10,100}\/)"[^>]*>([^<]{3,60})</gi;
      let m;
      const found = new Set();
      while ((m = linkPattern.exec(html)) !== null) {
        const [, url, name] = m;
        // Skip if it's just a region URL (not a specific gym)
        const parts = url.replace('https://www.vivagym.com/es-es/gimnasios/', '').split('/').filter(Boolean);
        if (parts.length < 3) continue;
        if (found.has(url)) continue;
        found.add(url);

        const gymName = name.trim();
        if (!gymName || gymName.length < 3) continue;

        // Try to extract address from the HTML nearby
        const idx = html.indexOf(url);
        const ctx = html.substring(Math.max(0, idx - 200), idx + 500);
        const addrMatch = ctx.match(/\d{5}\s+[A-ZÁÉÍÓÚÜÑ][^<"]{3,50}/);
        const direccion = addrMatch ? addrMatch[0].trim() : null;

        // Determine city from URL path
        const citySlug = parts[2] === 'capital' ? parts[0] : parts[2];
        const ciudad = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        extraGyms.push({
          nombre: gymName.startsWith('VivaGym') ? gymName : `VivaGym ${gymName}`,
          direccion,
          ciudad,
          provincia: region.charAt(0).toUpperCase() + region.slice(1),
          ccaa: null, // will be resolved below
          url,
          franquicia: 'Vivagym',
          tipo: 'gimnasio',
        });
      }
      if (found.size > 0) console.log(`  Región ${region}: ${found.size} gimnasios adicionales`);
    } catch {}
  }

  const allViva = [...VIVAGYM_GYMS];
  const existingUrls = new Set(VIVAGYM_GYMS.map(g => g.url));

  for (const g of extraGyms) {
    if (!existingUrls.has(g.url)) {
      if (!g.ccaa) {
        g.ccaa = getCCAA(g.provincia) || '';
      }
      allViva.push(g);
      existingUrls.add(g.url);
    }
  }

  console.log(`  Total Vivagym: ${allViva.length} (${VIVAGYM_GYMS.length} hardcoded + ${allViva.length - VIVAGYM_GYMS.length} descubiertos)`);
  return allViva;
}

// ── Utility ───────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(' Scraping de gimnasios: BasicFit · DreamFit · Vivagym');
  console.log('═══════════════════════════════════════════════════════════════════');

  // 1. Ensure table exists; if not, wait until it's created manually
  let tableReady = await tableExists();
  if (!tableReady) {
    console.log('\n  La tabla sport_centers no existe. Intentando crearla automaticamente...');
    await applyMigration();
    tableReady = await tableExists();
  }
  if (!tableReady) {
    console.log('\n─────────────────────────────────────────────────────────────────');
    console.log('  Accion requerida: aplica la migracion en el SQL Editor de Supabase');
    console.log('  https://supabase.com/dashboard/project/ssyljhtganuaanczxeep/sql/new');
    console.log('  Archivo: supabase/migrations/20260508_create_sport_centers.sql');
    console.log('  El script continuara automaticamente en cuanto la tabla exista.');
    console.log('─────────────────────────────────────────────────────────────────\n');
    while (!tableReady) {
      await new Promise(r => setTimeout(r, 10000));
      process.stdout.write('  Comprobando si la tabla existe...\r');
      tableReady = await tableExists();
    }
    console.log('\n  Tabla sport_centers detectada. Continuando...\n');
  }

  // 2. Scrape all three chains
  const [basicfitGyms, dreamfitGyms, vivagymGyms] = await Promise.all([
    scrapeBasicFit(),
    scrapeDreamFit(),
    scrapeVivaGym(),
  ]);

  // 3. Insert all gyms
  console.log('\n═══ Inserción en Supabase ═══════════════════════════════════════');

  const bf = await insertAll(basicfitGyms, 'BasicFit');
  const df = await insertAll(dreamfitGyms, 'DreamFit');
  const vg2 = await insertAll(vivagymGyms, 'Vivagym');

  // 4. Final report
  console.log('\n═══ RESUMEN FINAL ═══════════════════════════════════════════════');
  console.log(`  BasicFit:  ${bf.total} insertados, ${bf.errors} errores (${basicfitGyms.length} scraped)`);
  console.log(`  DreamFit:  ${df.total} insertados, ${df.errors} errores (${dreamfitGyms.length} scraped)`);
  console.log(`  Vivagym:   ${vg2.total} insertados, ${vg2.errors} errores (${vivagymGyms.length} scraped)`);
  console.log(`  ─────────────────────────────────────────────────────────────`);
  console.log(`  TOTAL:     ${bf.total + df.total + vg2.total} gimnasios insertados`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Verify expectations
  if (basicfitGyms.length < 100) console.warn(`⚠  BasicFit: se esperan ~242 centros, se obtuvieron ${basicfitGyms.length}`);
  if (dreamfitGyms.length < 24) console.warn(`⚠  DreamFit: se esperan ~26 centros, se obtuvieron ${dreamfitGyms.length}`);
  if (vivagymGyms.length < 150) console.warn(`⚠  Vivagym: se esperan ~220+ centros, se obtuvieron ${vivagymGyms.length}`);
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1); });
