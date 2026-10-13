/**
 * Script temporal: limpia y amplía lib/centros-entrenamiento.json
 * - Elimina entradas basura (IDs 393, 394, 395)
 * - Limpia URL .example (ID 382)
 * - Añade 33 centros reales verificados (HYROX, Funcional, OCR)
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/centros-entrenamiento.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Eliminar entradas basura (nombres=teléfonos)
data = data.filter(c => ![393, 394, 395].includes(c.id));

// 2. Limpiar URL .example del ID 382
const entry382 = data.find(c => c.id === 382);
if (entry382) entry382.web = '';

// 3. Nuevos centros reales verificados
const newCenters = [
  // ── MADRID ─────────────────────────────────────────────────
  {
    id: 397, tipo: 'HYROX',
    nombre: 'CDM La Cebada',
    ciudad: 'Madrid', codigo_postal: '28005',
    direccion: 'Plaza de la Cebada, s/n',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://cdmlacebada.com/hyrox/',
    lat: 40.411, lng: -3.707,
  },
  {
    id: 398, tipo: 'HYROX',
    nombre: 'Hercresfit',
    ciudad: 'Fuenlabrada', codigo_postal: '28943',
    direccion: 'C/ Valdemoro, s/n',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://hercresfit.com/',
    lat: 40.282, lng: -3.796,
  },
  {
    id: 399, tipo: 'Multidisciplinar',
    nombre: 'Gloves Valdebebas',
    ciudad: 'Madrid', codigo_postal: '28055',
    direccion: 'Avenida Juan Antonio Samaranch 67B',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.glovesbox-vdbb.es/',
    lat: 40.474, lng: -3.593,
  },
  {
    id: 400, tipo: 'Multidisciplinar',
    nombre: 'Sport&Beauty BOX',
    ciudad: 'Madrid', codigo_postal: '28033',
    direccion: 'Calle Julio Dánvila, 2',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.sbbox.es/',
    lat: 40.449, lng: -3.648,
  },
  {
    id: 401, tipo: 'Funcional',
    nombre: 'R-OG Habana',
    ciudad: 'Madrid', codigo_postal: '28036',
    direccion: 'Paseo de la Habana 137',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://roxzone-og.es/',
    lat: 40.458, lng: -3.682,
  },
  {
    id: 402, tipo: 'Multidisciplinar',
    nombre: 'After Box CrossFit',
    ciudad: 'Madrid', codigo_postal: '28006',
    direccion: 'Calle Cartagena 99',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.aftxbox.com/',
    lat: 40.432, lng: -3.670,
  },
  {
    id: 403, tipo: 'Funcional',
    nombre: 'Windfit Madrid',
    ciudad: 'Madrid', codigo_postal: '28028',
    direccion: 'Calle Doctor Gómez Ulla 24',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.windfit.es/',
    lat: 40.421, lng: -3.664,
  },
  {
    id: 404, tipo: 'Funcional',
    nombre: 'MYO Madrid',
    ciudad: 'Madrid', codigo_postal: '28036',
    direccion: 'Paseo de la Castellana, zona norte',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.myofismadrid.com/',
    lat: 40.455, lng: -3.679,
  },
  {
    id: 405, tipo: 'Funcional',
    nombre: 'We Are Monkeys',
    ciudad: 'Madrid', codigo_postal: '28001',
    direccion: 'General Díaz Porliers 34',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://wearemonkeys.es/',
    lat: 40.431, lng: -3.676,
  },
  {
    id: 406, tipo: 'Funcional',
    nombre: 'F45 Training Barrio Salamanca',
    ciudad: 'Madrid', codigo_postal: '28006',
    direccion: 'Calle Lagasca 120',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://f45training.com/es/studio/barriosalamanca/',
    lat: 40.430, lng: -3.681,
  },
  {
    id: 407, tipo: 'Funcional',
    nombre: 'Pomona Club',
    ciudad: 'Madrid', codigo_postal: '28006',
    direccion: 'Calle de Serrano 100',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://pomonaclub.es/',
    lat: 40.431, lng: -3.680,
  },
  {
    id: 408, tipo: 'Multidisciplinar',
    nombre: 'CrossFit 4K Madrid',
    ciudad: 'Madrid', codigo_postal: '28009',
    direccion: 'Plaza del Dr. Laguna, 1',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://crossfit4k.com/',
    lat: 40.413, lng: -3.686,
  },
  {
    id: 409, tipo: 'Funcional',
    nombre: 'Gennox 360',
    ciudad: 'Madrid', codigo_postal: '28045',
    direccion: 'Calle Canarias 41',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.gennox360.es/',
    lat: 40.398, lng: -3.701,
  },
  {
    id: 410, tipo: 'Multidisciplinar',
    nombre: 'UrbanBox CrossFit',
    ciudad: 'Madrid', codigo_postal: '28005',
    direccion: 'Calle Martín de Vargas, 22',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://urbanboxcrossfit.com/',
    lat: 40.409, lng: -3.707,
  },
  {
    id: 411, tipo: 'Funcional',
    nombre: 'Elite Fitness La Gavia',
    ciudad: 'Madrid', codigo_postal: '28051',
    direccion: 'Calle Arte Figurativo 10',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://www.elitefitness.es/',
    lat: 40.369, lng: -3.617,
  },
  {
    id: 412, tipo: 'Multidisciplinar',
    nombre: 'Improve CrossFit Madrid',
    ciudad: 'Madrid', codigo_postal: '28009',
    direccion: 'Zona Retiro',
    ccaa: 'Comunidad de Madrid',
    telefono: '', web: 'https://improvecrossfit.com/',
    lat: 40.413, lng: -3.683,
  },

  // ── BARCELONA ──────────────────────────────────────────────
  {
    id: 413, tipo: 'HYROX',
    nombre: 'CEM Bac de Roda',
    ciudad: 'Barcelona', codigo_postal: '08019',
    direccion: 'Carrer de Bac de Roda, 97',
    ccaa: 'Cataluña',
    telefono: '', web: 'https://bacderodasport.com/es/hyrox/',
    lat: 41.400, lng: 2.197,
  },
  {
    id: 414, tipo: 'HYROX',
    nombre: 'HYBRD Academy',
    ciudad: 'Barcelona', codigo_postal: '08003',
    direccion: 'Carrer de la Fusina 11',
    ccaa: 'Cataluña',
    telefono: '692382544', web: '',
    lat: 41.385, lng: 2.184,
  },
  {
    id: 415, tipo: 'Multidisciplinar',
    nombre: 'PROJECT 96',
    ciudad: 'Barcelona', codigo_postal: '08015',
    direccion: 'Calle Diputación 96',
    ccaa: 'Cataluña',
    telefono: '647916235', web: 'https://project96bcn.com/',
    lat: 41.373, lng: 2.157,
  },
  {
    id: 416, tipo: 'Funcional',
    nombre: 'Fabrik Training Club',
    ciudad: 'Barcelona', codigo_postal: '08037',
    direccion: 'Calle Mallorca 337',
    ccaa: 'Cataluña',
    telefono: '633355857', web: 'https://fabriktrainingclub.com/',
    lat: 41.397, lng: 2.168,
  },
  {
    id: 417, tipo: 'Funcional',
    nombre: 'Lomalinda Training',
    ciudad: 'Barcelona', codigo_postal: '08013',
    direccion: 'Carrer Diputació 465',
    ccaa: 'Cataluña',
    telefono: '645719498', web: 'https://lomalindatraining.es/',
    lat: 41.398, lng: 2.183,
  },
  {
    id: 418, tipo: 'HYROX',
    nombre: 'CEM Nova Icaria',
    ciudad: 'Barcelona', codigo_postal: '08005',
    direccion: 'Av. Icària 167',
    ccaa: 'Cataluña',
    telefono: '', web: 'https://novaicaria.com/',
    lat: 41.389, lng: 2.200,
  },
  {
    id: 419, tipo: 'HYROX',
    nombre: 'MO&MACE Barcelona Sports',
    ciudad: 'Barcelona', codigo_postal: '08001',
    direccion: 'Passeig de Pujades',
    ccaa: 'Cataluña',
    telefono: '34692382544', web: 'https://moandmace.com/',
    lat: 41.392, lng: 2.189,
  },
  {
    id: 420, tipo: 'OCR',
    nombre: 'WELL Centro OCR',
    ciudad: 'Barcelona', codigo_postal: '08023',
    direccion: 'Carrer Ballester, 33',
    ccaa: 'Cataluña',
    telefono: '658423406', web: 'https://www.wellcentro.com/',
    lat: 41.402, lng: 2.143,
  },
  {
    id: 421, tipo: 'OCR',
    nombre: 'Outdoor Circuits Sant Cugat',
    ciudad: 'Sant Cugat del Vallès', codigo_postal: '08172',
    direccion: 'Sant Cugat del Vallès',
    ccaa: 'Cataluña',
    telefono: '', web: 'https://www.outdoorcircuits.com/',
    lat: 41.472, lng: 2.089,
  },

  // ── BILBAO / PAÍS VASCO ────────────────────────────────────
  {
    id: 422, tipo: 'Funcional',
    nombre: 'UP&YOU Bilbao',
    ciudad: 'Bilbao', codigo_postal: '48010',
    direccion: 'Manuel Allende 18',
    ccaa: 'País Vasco',
    telefono: '944005600', web: 'https://www.upandyou.es/',
    lat: 43.267, lng: -2.941,
  },

  // ── SEVILLA ────────────────────────────────────────────────
  {
    id: 423, tipo: 'HYROX',
    nombre: 'Training For Gold',
    ciudad: 'Sevilla', codigo_postal: '41092',
    direccion: 'Sevilla',
    ccaa: 'Andalucía',
    telefono: '', web: 'https://trainingforgold.es/',
    lat: 37.393, lng: -5.987,
  },

  // ── MÁLAGA ─────────────────────────────────────────────────
  {
    id: 424, tipo: 'HYROX',
    nombre: 'Underground Málaga',
    ciudad: 'Málaga', codigo_postal: '29017',
    direccion: 'Avenida del Pintor Joaquín Sorolla, 141',
    ccaa: 'Andalucía',
    telefono: '+34 951 913 803', web: 'https://underground.wodbuster.com/',
    lat: 36.716, lng: -4.428,
  },
  {
    id: 425, tipo: 'HYROX',
    nombre: 'Yndico Training Center',
    ciudad: 'Málaga', codigo_postal: '29006',
    direccion: 'C/ Sigfrido 37',
    ccaa: 'Andalucía',
    telefono: '', web: 'https://yndico.com/',
    lat: 36.722, lng: -4.434,
  },

  // ── VALENCIA ───────────────────────────────────────────────
  {
    id: 426, tipo: 'Funcional',
    nombre: 'Activaclub Nou Mestalla',
    ciudad: 'Valencia', codigo_postal: '46015',
    direccion: 'Avenida de las Cortes Valencianas, 18',
    ccaa: 'Comunidad Valenciana',
    telefono: '', web: 'https://activaclub.es/nou-mestalla/',
    lat: 39.479, lng: -0.375,
  },
  {
    id: 427, tipo: 'Funcional',
    nombre: 'Activaclub Germanías',
    ciudad: 'Valencia', codigo_postal: '46006',
    direccion: 'Gran Vía de las Germanías, 43',
    ccaa: 'Comunidad Valenciana',
    telefono: '', web: 'https://activaclub.es/germanias/',
    lat: 39.464, lng: -0.378,
  },
  {
    id: 428, tipo: 'HYROX',
    nombre: 'Foc Training Center',
    ciudad: 'Bonrepos i Mirambell', codigo_postal: '46131',
    direccion: 'Calle Gabriel Esteve 4',
    ccaa: 'Comunidad Valenciana',
    telefono: '', web: 'https://www.foctrainingcenter.com/',
    lat: 39.518, lng: -0.356,
  },
  {
    id: 429, tipo: 'Multidisciplinar',
    nombre: 'CrossPartan Box',
    ciudad: 'Massamagrell', codigo_postal: '46130',
    direccion: 'C/Josep Renau 9',
    ccaa: 'Comunidad Valenciana',
    telefono: '', web: 'https://crosspartanbox.es/',
    lat: 39.558, lng: -0.332,
  },
];

data.push(...newCenters);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

const byTipo = {};
data.forEach(c => { byTipo[c.tipo] = (byTipo[c.tipo] || 0) + 1; });
console.log('Distribución por tipo:', byTipo);
console.log('Total centros:', data.length);
console.log('Nuevos añadidos:', newCenters.length);
