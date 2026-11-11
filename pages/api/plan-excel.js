// GET /api/plan-excel?<mismos parámetros que /mi-plan> → Excel del plan (una hoja por semana y hoja de progreso).
import { planFromQuery } from "../../lib/plan-export/request";
import { buildPlanExcel } from "../../lib/plan-export/excel";
import { planFileName } from "../../lib/plan-export/pdf";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });
  const data = await planFromQuery(req.query);
  if (!data) return res.status(400).json({ error: "Faltan datos para generar el plan" });
  try {
    const buffer = await buildPlanExcel(data.plan, { race: data.race });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${planFileName(data.plan, "xlsx")}"`);
    res.setHeader("Cache-Control", "public, s-maxage=900");
    res.status(200).send(buffer);
  } catch (err) {
    console.error("plan-excel:", err?.message ?? err);
    res.status(500).json({ error: "No se ha podido generar el Excel" });
  }
}
