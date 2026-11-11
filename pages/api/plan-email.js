// POST /api/plan-email { email, qs } → envía el plan (PDF y Excel adjuntos) con Resend.
// El correo solo se usa para este envío: no se guarda en base de datos ni se escribe en los registros.
import { Resend } from "resend";
import { planFromQuery } from "../../lib/plan-export/request";
import { buildPlanPdf, planFileName } from "../../lib/plan-export/pdf";
import { buildPlanExcel } from "../../lib/plan-export/excel";
import { toQueryString } from "../../lib/plan/index.js";
import { SITE_URL } from "../../lib/site";

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Freno básico por IP (en memoria de la función): 3 envíos cada 10 minutos
const HITS = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (HITS.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (recent.length >= 3) return true;
  HITS.set(ip, [...recent, now]);
  if (HITS.size > 5000) HITS.clear();
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  const { email, qs, website } = req.body || {};
  // Campo trampa para bots: si viene relleno, se responde bien y no se envía nada
  if (website) return res.status(200).json({ ok: true });
  const to = String(email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to) || to.length > 200) return res.status(400).json({ error: "Revisa la dirección de correo" });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "El envío por correo no está disponible ahora. Descarga el PDF o el Excel." });
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return res.status(429).json({ error: "Demasiados envíos seguidos. Prueba dentro de unos minutos." });

  const data = await planFromQuery(Object.fromEntries(new URLSearchParams(String(qs || "").slice(0, 600))));
  if (!data) return res.status(400).json({ error: "Faltan datos para generar el plan" });
  const { plan, race, input } = data;
  const link = `${SITE_URL}/mi-plan?${toQueryString(input)}`;

  const html = `<!DOCTYPE html><html lang="es"><body style="margin:0;padding:24px;background:#F5F4F0;font-family:Helvetica,Arial,sans-serif;color:#14161A;">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E0DA;border-radius:8px;padding:28px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1F5C46;">Hybrid Race Hub · Plan gratis</p>
    <h1 style="margin:0 0 8px;font-size:24px;line-height:1.15;">${esc(plan.meta.title)}</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#4A4F57;">${esc(plan.meta.subtitle)}</p>
    ${race ? `<p style="margin:0 0 16px;font-size:15px;"><strong>Tu carrera:</strong> ${esc(race.nombre)}</p>` : ""}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;">Van adjuntos el PDF, con una semana por página, y el Excel, con columnas para apuntar el peso real y el RPE de cada sesión.</p>
    <p style="margin:0 0 20px;"><a href="${esc(link)}" style="display:inline-block;background:#1F5C46;color:#FFFFFF;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:6px;">Abrir mi plan en la web</a></p>
    <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#4A4F57;">${esc(plan.health)}</p>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#4A4F57;">Has recibido este correo porque lo pediste en hybridracehub.com. No hemos guardado tu dirección y no te vamos a escribir más.</p>
  </div></body></html>`;

  try {
    const [pdf, xlsx] = [buildPlanPdf(plan, { race }), await buildPlanExcel(plan, { race })];
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Hybrid Race Hub <hola@hybridracehub.com>",
      to,
      subject: `Tu ${plan.meta.title.charAt(0).toLowerCase()}${plan.meta.title.slice(1)}`,
      html,
      attachments: [
        { filename: planFileName(plan, "pdf"), content: pdf },
        { filename: planFileName(plan, "xlsx"), content: xlsx },
      ],
    });
    if (error) throw new Error(error.message || "Resend");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("plan-email:", err?.message ?? err);
    return res.status(500).json({ error: "No se ha podido enviar. Descarga el PDF o el Excel desde la página." });
  }
}
