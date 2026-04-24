// API route to fix formats in Supabase
// Deploys on Vercel and executes on first request

const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Update HYROX formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*hyrox*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    // Update Spartan formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*spartan*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas, Equipos, Elite' })
    });
    
    // Update Tough Mudder formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*mudder*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    res.json({ success: true, message: 'Formats updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}