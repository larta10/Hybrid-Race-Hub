// Comprueba el token de Instagram y localiza el ID de la cuenta @hybridracehub_spain.
// Uso: npm run ig:whoami   (lee IG_ACCESS_TOKEN de .env.local y guarda IG_USER_ID allí)
import { API_VERSION, IG_USERNAME, env, mask, setEnvLocal } from "./lib/config.mjs";
import { graph } from "./lib/graph.mjs";

const token = env("IG_ACCESS_TOKEN");
const REQUIRED_SCOPES = ["instagram_basic", "instagram_content_publish"];
const tryGet = (p, params) => graph("GET", p, params, token, { retries: 1 }).catch((e) => ({ __error: e.message }));

console.log(`Graph API ${API_VERSION} · token ${mask(token)}\n`);

// 1) debug_token
const dbg = await tryGet("/debug_token", { input_token: token });
const data = dbg.data || {};
const warnings = [];
if (dbg.__error) {
  // debug_token solo funciona con token de app o si el usuario es admin/desarrollador de la app.
  // Alternativa: permisos concedidos y datos básicos del token.
  console.log(`debug_token no disponible (${dbg.__error})`);
  const perms = await tryGet("/me/permissions");
  const granted = (perms.data || []).filter((p) => p.status === "granted").map((p) => p.permission);
  const info = await tryGet("/oauth/access_token_info");
  const app = await tryGet("/app", { fields: "id,name" });
  console.log(`App:          ${app.name || "?"} (${app.id || "?"})`);
  console.log(`Caduca:       ${info.expires_in ? `en ${Math.round(info.expires_in / 86400)} días` : "sin fecha de caducidad informada (expires_in ausente)"}`);
  console.log(`Permisos:     ${granted.join(", ") || "(no se pudieron leer)"}`);
  if (info.expires_in) warnings.push(`El token CADUCA en ${Math.round(info.expires_in / 86400)} días.`);
  const missing = REQUIRED_SCOPES.filter((s) => !granted.includes(s));
  if (missing.length) warnings.push(`Faltan permisos: ${missing.join(", ")}`);
  if (!granted.includes("pages_show_list") && !granted.includes("business_management"))
    warnings.push("Sin pages_show_list ni business_management no se puede descubrir el ID de la cuenta de Instagram con este token.");
} else {
  const exp = data.expires_at;
  const expTxt = !exp ? "nunca (0)" : new Date(exp * 1000).toISOString();
  console.log(`Tipo:         ${data.type}`);
  console.log(`App:          ${data.application} (${data.app_id})`);
  console.log(`Válido:       ${data.is_valid}`);
  console.log(`Caduca:       ${expTxt}`);
  if (data.data_access_expires_at) console.log(`Acceso datos: hasta ${new Date(data.data_access_expires_at * 1000).toISOString()}`);
  console.log(`Permisos:     ${(data.scopes || []).join(", ")}`);
  if (!data.is_valid) warnings.push("El token NO es válido.");
  if (exp) warnings.push(`El token CADUCA el ${expTxt}. Hace falta un token que no caduque (expires_at = 0).`);
  const missing = REQUIRED_SCOPES.filter((s) => !(data.scopes || []).includes(s));
  if (missing.length) warnings.push(`Faltan permisos: ${missing.join(", ")}`);
}

// 2) Buscar la cuenta profesional
const found = new Map(); // id -> username
const note = (id, username) => id && !found.has(id) && found.set(id, username || "?");

const accounts = await tryGet("/me/accounts", { fields: "name,instagram_business_account{id,username}" });
for (const p of accounts.data || []) note(p.instagram_business_account?.id, p.instagram_business_account?.username);

const me = await tryGet("/me", { fields: "id,name" });
if (me.id) console.log(`\n/me:          ${me.name} (${me.id})`);

const biz = await tryGet("/me/businesses", { fields: "id,name" });
for (const b of biz.data || []) {
  for (const edge of ["owned_instagram_accounts", "instagram_business_accounts"]) {
    const r = await tryGet(`/${b.id}/${edge}`, { fields: "id,username" });
    for (const a of r.data || []) note(a.id, a.username);
  }
}

const targetIds = new Set((data.granular_scopes || []).flatMap((g) => g.target_ids || []));
for (const id of targetIds) {
  const r = await tryGet(`/${id}`, { fields: "id,username" });
  if (r.username) note(r.id, r.username);
  else {
    // Puede ser una página de Facebook: su cuenta de Instagram vinculada
    const pg = await tryGet(`/${id}`, { fields: "instagram_business_account{id,username}" });
    note(pg.instagram_business_account?.id, pg.instagram_business_account?.username);
  }
}

console.log("\nCuentas de Instagram encontradas:");
for (const [id, u] of found) console.log(`  ${id}  @${u}`);

const match = [...found].find(([, u]) => u?.toLowerCase() === IG_USERNAME);
if (match) {
  console.log(`\nIG_USER_ID = ${match[0]} (@${match[1]})`);
  setEnvLocal("IG_USER_ID", match[0]);
  console.log("Guardado en .env.local");
} else {
  warnings.push(`No se encontró @${IG_USERNAME} con este token.`);
}

if (warnings.length) {
  console.log("\n⚠️  AVISOS:");
  for (const w of warnings) console.log(`  - ${w}`);
  process.exitCode = match ? 0 : 1;
} else {
  console.log("\nToken correcto: no caduca y tiene los permisos necesarios.");
}
