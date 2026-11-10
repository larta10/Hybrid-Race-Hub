// Publica en el momento un Reel especial (fuera de la cola diaria), p. ej. una colaboración.
// Usa el MP4 y la portada ya renderizados con video/scripts/render.mjs y el caption EXACTO del guion
// (sin añadidos automáticos). Si el guion trae "collaborators", intenta la invitación de colaboración
// y, si la API la rechaza, publica sin ella.
//
//   node scripts/instagram/publish-extra.mjs <reel_id> <mp4> <jpg> [--dry-run]
//
// Se registra en ig_posts_log con post_id = <reel_id>. La publicación diaria ignora estos registros
// (ids que empiezan por "x") al comprobar si ya se publicó hoy, así que no la bloquea.
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { env, supabaseKey, ROOT, STORAGE_BUCKET } from "./lib/config.mjs";
import { graph } from "./lib/graph.mjs";

const [id, mp4, jpg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const DRY = process.argv.includes("--dry-run");
if (!id || !mp4 || !jpg) {
  console.log("Uso: node scripts/instagram/publish-extra.mjs <reel_id> <mp4> <jpg> [--dry-run]");
  process.exit(1);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TODAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const reel = JSON.parse(readFileSync(path.join(ROOT, "instagram/reels", `${id}.json`), "utf8"));
const caption = reel.caption.trim();

const db = createClient(process.env.SUPABASE_URL || "https://ssyljhtganuaanczxeep.supabase.co", supabaseKey(), { auth: { persistSession: false } });

async function uploadPublic(key, file, contentType) {
  const { error } = await db.storage.from(STORAGE_BUCKET).upload(key, readFileSync(file), { contentType, upsert: true, cacheControl: "3600" });
  if (error) throw new Error(`Storage (${key}): ${error.message}`);
  const url = db.storage.from(STORAGE_BUCKET).getPublicUrl(key).data.publicUrl;
  const r = await fetch(url, { method: "HEAD" });
  if (r.status !== 200) throw new Error(`No responde 200: ${url}`);
  return url;
}

async function waitFinished(cid, token) {
  const deadline = Date.now() + 15 * 60 * 1000;
  for (;;) {
    const { status_code, status } = await graph("GET", `/${cid}`, { fields: "status_code,status" }, token);
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`Contenedor en ${status_code}: ${status || ""}`);
    if (Date.now() > deadline) throw new Error("Contenedor sin terminar tras 15 minutos");
    await sleep(10000);
  }
}

async function main() {
  const { data: prev } = await db.from("ig_posts_log").select("ig_media_id").eq("post_id", id).eq("status", "published");
  if (prev?.length) {
    console.log(`${id} ya está publicado (${prev[0].ig_media_id}). No se repite.`);
    return;
  }
  const base = `reels/${TODAY}/${id}`;
  const videoUrl = await uploadPublic(`${base}.mp4`, mp4, "video/mp4");
  const coverUrl = await uploadPublic(`${base}.jpg`, jpg, "image/jpeg");
  console.log(`Subido: ${videoUrl}`);
  if (DRY) return console.log("DRY RUN: no se publica.");

  const token = env("IG_ACCESS_TOKEN");
  const igUser = env("IG_USER_ID");
  const params = { media_type: "REELS", video_url: videoUrl, cover_url: coverUrl, caption, share_to_feed: true };
  let colaboracion = "no pedida";
  let c;
  if (reel.collaborators?.length) {
    try {
      c = await graph("POST", `/${igUser}/media`, { ...params, collaborators: JSON.stringify(reel.collaborators) }, token);
      colaboracion = `invitación enviada a ${reel.collaborators.join(", ")}`;
    } catch (e) {
      colaboracion = `rechazada por la API (${e.message}); se publica sin invitación`;
      console.warn(`collaborators: ${colaboracion}`);
    }
  }
  if (!c) c = await graph("POST", `/${igUser}/media`, params, token);
  console.log(`Contenedor: ${c.id}`);
  await waitFinished(c.id, token);
  const pub = await graph("POST", `/${igUser}/media_publish`, { creation_id: c.id }, token);
  const info = await graph("GET", `/${pub.id}`, { fields: "id,permalink,media_type,media_product_type,timestamp" }, token);
  console.log(`Publicado: ${info.id} · ${info.media_product_type} · ${info.permalink}`);
  console.log(`Colaboración: ${colaboracion}`);
  const { error } = await db.from("ig_posts_log").insert({ post_id: id, fecha: TODAY, status: "published", tipo: "reel", ig_media_id: pub.id });
  if (error) console.error(`No se pudo registrar en ig_posts_log: ${error.message}`);
}

main().catch((e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});
