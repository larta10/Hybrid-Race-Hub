// Verificador de enlaces - se ejecuta automáticamente cada día
// pages/api/verify-links.js

const fetch = require('node-fetch');

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI";

// Dominios known con inscripción real
const KNOWN_URLS = {
  'spartan.com': 'Spartan Race',
  'toughmudder.com': 'Tough Mudder',
  'hyrox.com': 'HYROX',
  'crossfit.com': 'CrossFit'
};

export default async function handler(req, res) {
  try {
    // 1. Fetch all races
    const racesRes = await fetch(`${SUPABASE_URL}/rest/v1/races?select=*`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
    });
    const races = await racesRes.json();
    
    let updated = 0;
    let withRealUrl = 0;
    
    for (const race of races) {
      let newUrl = race.url;
      let newEstado = race.estado;
      let needsUpdate = false;
      
      // Verificar si el URL es known
      if (race.url && race.url !== '') {
        const hasKnownDomain = Object.keys(KNOWN_URLS).some(domain => 
          race.url.toLowerCase().includes(domain)
        );
        
        if (hasKnownDomain) {
          withRealUrl++;
        } else if (race.url.includes('google.com') || race.url.includes('carrerasocr.com')) {
          // URL no válido - limpiar
          newUrl = '';
          newEstado = 'Pendiente verificar';
          needsUpdate = true;
        }
      } else {
        // Sin URL - marcar pendiente
        newEstado = 'Pendiente verificar';
        needsUpdate = true;
      }
      
      if (needsUpdate && newUrl !== race.url) {
        await fetch(`${SUPABASE_URL}/rest/v1/races?id=eq.${race.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: newUrl, estado: newEstado })
        });
        updated++;
      }
    }
    
    res.json({ 
      success: true, 
      totalRaces: races.length,
      withKnownUrl: withRealUrl,
      updated: updated,
      message: 'Verificación completada'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}