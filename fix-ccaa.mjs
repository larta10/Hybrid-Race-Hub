const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI";
const BASE = "https://ssyljhtganuaanczxeep.supabase.co/rest/v1/races";
const H = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" };

const fixes = [
  ["Comunidad de Madrid",        "Madrid"],
  ["Principado de Asturias",     "Asturias"],
  ["Islas Baleares",             "Baleares"],
  ["Comunidad Foral de Navarra", "Navarra"],
  ["Región de Murcia",           "Murcia"],
];

for (const [from, to] of fixes) {
  const r = await fetch(`${BASE}?comunidad=eq.${encodeURIComponent(from)}`, {
    method: "PATCH", headers: H, body: JSON.stringify({ comunidad: to }),
  });
  console.log(`${from} → ${to}: ${r.status}`);
}

// Fix NULL comunidad for Spartan Race Andorra (id=4)
const r = await fetch(`${BASE}?id=eq.4`, {
  method: "PATCH", headers: H, body: JSON.stringify({ comunidad: "Andorra" }),
});
console.log(`ID 4 → Andorra: ${r.status}`);

console.log("Done.");
