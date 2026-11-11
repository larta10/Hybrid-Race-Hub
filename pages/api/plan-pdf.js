// GET /api/plan-pdf?<mismos parámetros que /mi-plan> → PDF del plan (una semana por página). Gratis y sin registro.
import { planFromQuery } from "../../lib/plan-export/request";
import { buildPlanPdf, planFileName } from "../../lib/plan-export/pdf";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });
  const data = await planFromQuery(req.query);
  if (!data) return res.status(400).json({ error: "Faltan datos para generar el plan" });
  try {
    const buffer = buildPlanPdf(data.plan, { race: data.race });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${planFileName(data.plan, "pdf")}"`);
    res.setHeader("Cache-Control", "public, s-maxage=900");
    res.status(200).send(buffer);
  } catch (err) {
    console.error("plan-pdf:", err?.message ?? err);
    res.status(500).json({ error: "No se ha podido generar el PDF" });
  }
}
