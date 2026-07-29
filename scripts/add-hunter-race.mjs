import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ssyljhtganuaanczxeep.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const event = {
  nombre: 'HUNTER Mataró 2026',
  modalidad: 'OCR',
  modalidad_id: 'ocr-general',
  modalidad_parent: 'ocr',
  fecha: '10 Oct 2026',
  fecha_iso: '2026-10-10',
  ubicacion: 'Mataró, Barcelona',
  municipio: 'Mataró',
  provincia: 'Barcelona',
  comunidad: 'Cataluña',
  pais: 'España',
  distancia: '3,5 km / 7 km / 13 km',
  precio: '54,50–72 € (Ind.) · 45–59 €/pers. (Dobles)',
  estado: 'Abierta',
  notas: '3 distancias: Sprinter 3,5 km, Alpha 7 km, Legend 13 km — 7 workouts en cada',
  url: 'https://www.rockthesport.com/es/evento/hunter-endurance-hybrid-race/inscripcion/selecciona-tarifa',
  formato: 'Individual, Dobles',
  source: 'hunter-race.com',
};

async function run() {
  // Check for duplicates
  const { data: existing } = await supabase
    .from('races')
    .select('id, nombre, fecha_iso')
    .ilike('nombre', '%HUNTER%')
    .eq('fecha_iso', '2026-10-10');

  if (existing && existing.length > 0) {
    console.log('⚠  Ya existe un evento HUNTER para 2026-10-10:');
    console.log(JSON.stringify(existing, null, 2));
    process.exit(0);
  }

  const { data, error } = await supabase
    .from('races')
    .insert(event)
    .select();

  if (error) {
    console.error('❌ Error al insertar:', JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log('✅ Evento insertado correctamente:');
  console.log(JSON.stringify(data, null, 2));
}

run();
