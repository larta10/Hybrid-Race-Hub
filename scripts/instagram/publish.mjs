// Publica el carrusel del día en Instagram (Graph API) a partir de instagram/posts o del calendario.
// GitHub Actions lo ejecuta cada día; en local: DRY_RUN=true node scripts/instagram/publish.mjs
import { createClient } from "@supabase/supabase-js";
import { env, supabaseKey, mask, STORAGE_BUCKET } from "./lib/config.mjs";
import { graph } from "./lib/graph.mjs";
import { loadPosts, buildCalendarPost, fullCaption } from "./lib/posts.mjs";
import { renderPost } from "./render.mjs";
import { sendReserveEmail } from "./lib/reserve.mjs";

const DRY_RUN = String(process.env.DRY_RUN || "").toLowerCase() === "true";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ssyljhtganuaanczxeep.supabase.co";
const RESERVE_MIN = 10;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Fechas en Europe/Madrid ----------
const madridISO = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);
const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekday = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 = domingo

const TODAY = process.env.IG_DATE || madridISO(); // IG_DATE solo para pruebas
const DOW = weekday(TODAY);
const FIRST_SATURDAY = DOW === 6 && Number(TODAY.slice(8, 10)) <= 7;
const PILAR_DEL_DIA = FIRST_SATURDAY ? "producto" : ["comunidad", "calendario", "estaciones", "entrenamiento", "errores", "ocr", "nutricion"][DOW];

// Estados de carrera que no se anuncian: canceladas, terminadas o sin fecha confirmada
const ESTADO_EXCLUIDO = /cancel|suspend|aplaz|finaliz|celebrad|pendiente|verificar|por confirmar/i;

const supabaseKeyValue = supabaseKey();
if (!supabaseKeyValue) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(SUPABASE_URL, supabaseKeyValue, { auth: { persistSession: false } });

async function logRun(post_id, status, extra = {}) {
  const { error } = await db.from("ig_posts_log").insert({ post_id, fecha: TODAY, status, ...extra });
  if (error) console.error(`No se pudo registrar en ig_posts_log: ${error.message}`);
}

async function publishedIds() {
  const { data, error } = await db.from("ig_posts_log").select("post_id,fecha").eq("status", "published");
  if (error) throw new Error(`ig_posts_log: ${error.message}`);
  return data;
}

async function upcomingRaces() {
  const { data, error } = await db
    .from("races")
    .select("nombre,fecha_iso,municipio,provincia,ubicacion,modalidad,modalidad_parent,estado")
    .gte("fecha_iso", TODAY)
    .lte("fecha_iso", addDays(TODAY, 21))
    .in("modalidad_parent", ["ocr", "funcional"])
    .order("fecha_iso", { ascending: true })
    .limit(100);
  if (error) throw new Error(`races: ${error.message}`);
  return data.filter((r) => !ESTADO_EXCLUIDO.test(r.estado || "")).slice(0, 7);
}

function pickStatic(posts, done, pilar) {
  const pending = posts.filter((p) => !done.has(p.id));
  // Si no quedan posts de material el primer sábado, sale el de nutrición/recuperación que tocaba
  const alt = pilar === "producto" ? "nutricion" : null;
  return pending.find((p) => p.pilar === pilar) || (alt && pending.find((p) => p.pilar === alt)) || pending[0] || null;
}

async function uploadImages(post, images) {
  const urls = [];
  for (let i = 0; i < images.length; i++) {
    const key = `${TODAY}/${post.id}/${i + 1}.jpg`;
    const { error } = await db.storage.from(STORAGE_BUCKET).upload(key, images[i], { contentType: "image/jpeg", upsert: true, cacheControl: "3600" });
    if (error) throw new Error(`Storage (${key}): ${error.message}`);
    urls.push(db.storage.from(STORAGE_BUCKET).getPublicUrl(key).data.publicUrl);
  }
  // Instagram descarga las imágenes por URL: tienen que responder 200 sin autenticación
  for (const url of urls) {
    let ok = false;
    for (let a = 0; a < 3 && !ok; a++) {
      const r = await fetch(url, { method: "GET" }).catch(() => null);
      ok = r?.status === 200 && (r.headers.get("content-type") || "").includes("image/jpeg");
      if (!ok) await sleep(3000 * (a + 1));
    }
    if (!ok) throw new Error(`La imagen no es pública o no responde 200: ${url}`);
  }
  return urls;
}

async function waitFinished(containerId, token, label) {
  const deadline = Date.now() + 3 * 60 * 1000;
  for (;;) {
    const { status_code, status } = await graph("GET", `/${containerId}`, { fields: "status_code,status" }, token);
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`Contenedor ${label} en estado ${status_code}: ${status || ""}`);
    if (Date.now() > deadline) throw new Error(`Contenedor ${label} sin terminar tras 3 minutos (${status_code})`);
    await sleep(5000);
  }
}

async function createImageContainer(igUser, token, params) {
  try {
    return await graph("POST", `/${igUser}/media`, params, token);
  } catch (e) {
    // Si la API no acepta alt_text en esta cuenta o versión, se publica sin él antes que fallar
    if (params.alt_text && /alt_text/i.test(e.message)) {
      console.warn("  alt_text no aceptado; se reintenta sin él");
      const { alt_text, ...rest } = params;
      return graph("POST", `/${igUser}/media`, rest, token);
    }
    throw e;
  }
}

async function publishToInstagram(post, urls) {
  const token = env("IG_ACCESS_TOKEN");
  const igUser = env("IG_USER_ID");
  const caption = fullCaption(post);
  let creationId;

  if (urls.length === 1) {
    const c = await createImageContainer(igUser, token, { image_url: urls[0], caption, alt_text: post.alt_text?.[0] });
    await waitFinished(c.id, token, "imagen");
    creationId = c.id;
  } else {
    const children = [];
    for (let i = 0; i < urls.length; i++) {
      const c = await createImageContainer(igUser, token, { image_url: urls[i], is_carousel_item: true, alt_text: post.alt_text?.[i] });
      children.push(c.id);
      console.log(`  hijo ${i + 1}/${urls.length}: ${c.id}`);
    }
    for (const [i, id] of children.entries()) await waitFinished(id, token, `hijo ${i + 1}`);
    const carousel = await graph("POST", `/${igUser}/media`, { media_type: "CAROUSEL", children: children.join(","), caption }, token);
    console.log(`  carrusel: ${carousel.id}`);
    await waitFinished(carousel.id, token, "carrusel");
    creationId = carousel.id;
  }
  const published = await graph("POST", `/${igUser}/media_publish`, { creation_id: creationId }, token);
  return published.id;
}

async function checkReserve(posts, done) {
  if (DOW !== 0) return;
  const left = posts.filter((p) => !done.has(p.id)).length;
  console.log(`Reserva: ${left} posts estáticos sin publicar`);
  if (left >= RESERVE_MIN) return;
  const key = process.env.RESEND_API_KEY;
  if (DRY_RUN) return console.log(`  (DRY_RUN) se enviaría el aviso "Instagram: quedan ${left} publicaciones"`);
  if (!key) return console.warn("  Falta RESEND_API_KEY: no se envía el aviso");
  try {
    await sendReserveEmail(left, key);
    console.log("  Aviso enviado a hola@hybridracehub.com");
  } catch (e) {
    console.warn(`  No se pudo enviar el aviso: ${e.message}`);
  }
}

// ---------- Main ----------
async function main() {
  console.log(`Fecha (Madrid): ${TODAY} · pilar del día: ${PILAR_DEL_DIA}${DRY_RUN ? " · DRY_RUN" : ""}`);
  if (!DRY_RUN) console.log(`Token ${mask(process.env.IG_ACCESS_TOKEN)} · cuenta ${process.env.IG_USER_ID || "(sin IG_USER_ID)"}`);

  const published = await publishedIds();
  if (published.some((r) => r.fecha === TODAY)) {
    console.log("Ya hay una publicación registrada hoy. Nada que hacer.");
    return;
  }
  const done = new Set(published.map((r) => r.post_id));
  const posts = loadPosts();

  let post = null;
  if (PILAR_DEL_DIA === "calendario") {
    const races = await upcomingRaces();
    console.log(`Carreras en los próximos 21 días: ${races.length}`);
    if (races.length >= 2) post = buildCalendarPost(races, TODAY, addDays(TODAY, 21));
  }
  if (!post) post = pickStatic(posts, done, PILAR_DEL_DIA === "calendario" ? null : PILAR_DEL_DIA);
  if (!post) {
    console.log("No quedan posts sin publicar.");
    await checkReserve(posts, done);
    return;
  }
  console.log(`Post: ${post.id} (${post.pilar}, ${post.slides.length} slides)`);

  try {
    const images = await renderPost(post);
    const urls = await uploadImages(post, images);
    urls.forEach((u) => console.log(`  ${u}`));

    if (DRY_RUN) {
      console.log("DRY_RUN: imágenes subidas y comprobadas. No se crean contenedores ni se publica.");
      await logRun(post.id, "dry_run");
    } else {
      const mediaId = await publishToInstagram(post, urls);
      console.log(`Publicado: ${mediaId}`);
      await logRun(post.id, "published", { ig_media_id: mediaId });
      done.add(post.id);
    }
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    await logRun(post.id, "failed", { error: String(e.message).slice(0, 2000) });
    process.exitCode = 1;
    return;
  }
  await checkReserve(posts, done);
}

main().catch((e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});
