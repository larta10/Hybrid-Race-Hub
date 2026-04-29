import Stripe from "stripe";
import ExcelJS from "exceljs";
import { Resend } from "resend";
import { generatePlan } from "../../lib/training-plans";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend  = new Resend(process.env.RESEND_API_KEY);

/* ─── Load tables (mirror of plan-entrenamiento.js) ─────────────────────── */

const EX_BASE = {
  principiante: [
    { id: "squat",    label: "Sentadilla",   r: 0.50 },
    { id: "deadlift", label: "Peso Muerto",  r: 0.60 },
    { id: "bench",    label: "Press Banca",  r: 0.40 },
    { id: "press",    label: "Press Hombro", r: 0.30 },
    { id: "row",      label: "Remo",         r: 0.35 },
    { id: "lunge",    label: "Zancada",      r: 0.30 },
    { id: "kb",       label: "KB Swing",     r: 0.20 },
    { id: "thruster", label: "Thruster",     r: 0.20 },
  ],
  intermedio: [
    { id: "squat",    label: "Sentadilla",   r: 0.80 },
    { id: "deadlift", label: "Peso Muerto",  r: 1.00 },
    { id: "bench",    label: "Press Banca",  r: 0.65 },
    { id: "press",    label: "Press Hombro", r: 0.50 },
    { id: "row",      label: "Remo",         r: 0.55 },
    { id: "lunge",    label: "Zancada",      r: 0.45 },
    { id: "kb",       label: "KB Swing",     r: 0.30 },
    { id: "thruster", label: "Thruster",     r: 0.30 },
  ],
  avanzado: [
    { id: "squat",    label: "Sentadilla",   r: 1.10 },
    { id: "deadlift", label: "Peso Muerto",  r: 1.40 },
    { id: "bench",    label: "Press Banca",  r: 0.85 },
    { id: "press",    label: "Press Hombro", r: 0.70 },
    { id: "row",      label: "Remo",         r: 0.75 },
    { id: "lunge",    label: "Zancada",      r: 0.60 },
    { id: "kb",       label: "KB Swing",     r: 0.40 },
    { id: "thruster", label: "Thruster",     r: 0.45 },
  ],
};

function calcLoads(pesoKg, level, weekNum) {
  const pos   = (weekNum - 1) % 4;
  const cycle = Math.floor((weekNum - 1) / 4);
  const mult  = (1.0 + 0.05 * cycle) * [1.0, 1.05, 1.10, 0.80][pos];
  const bases = EX_BASE[level] || EX_BASE.intermedio;
  return {
    items:      bases.map(({ id, label, r }) => ({ id, label, kg: Math.round(pesoKg * r * mult / 2.5) * 2.5 })),
    isDeload:   pos === 3,
    cycleLabel: ["Base", "+5%", "+10%", "DELOAD"][pos],
  };
}

function parseExercise(str) {
  const sep = str.lastIndexOf(" — ");
  if (sep === -1) return { name: str.trim(), sets: "", reps: "" };
  const name = str.slice(0, sep).trim();
  const rest = str.slice(sep + 3).trim();
  const m = rest.match(/^(\d+)\s*[×x]\s*(.+)$/);
  if (!m) return { name, sets: "", reps: rest };
  return { name, sets: m[1], reps: m[2].replace(/ ?reps?$/i, "").trim() };
}

/* ─── Excel style constants ──────────────────────────────────────────────── */

const C = {
  bgDark:    "FF08090C",
  bgSurface: "FF1A1D26",
  bgRow:     "FF13151C",
  bgAlt:     "FF0F1015",
  orange:    "FFFB923C",
  white:     "FFF5F5F7",
  muted:     "FF8C8E9A",
  border:    "FF2A2D36",
};

const fill   = argb => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
const border = () => { const s = { style: "thin", color: { argb: C.border } }; return { top: s, left: s, bottom: s, right: s }; };
const font   = (argb, size = 10, bold = false, italic = false) => ({ name: "Calibri", size, bold, italic, color: { argb } });

function styleHeader(cell, text, argb = C.orange, size = 10) {
  cell.value     = text;
  cell.font      = font(argb, size, true);
  cell.fill      = fill(C.bgSurface);
  cell.border    = border();
  cell.alignment = { vertical: "middle", horizontal: "center" };
}

function styleData(cell, value, argb = C.white, bgArgb = C.bgRow, bold = false) {
  cell.value  = value;
  cell.font   = font(argb, 10, bold);
  cell.fill   = fill(bgArgb);
  cell.border = border();
}

/* ─── Excel generator ────────────────────────────────────────────────────── */

const OBJ_LABELS = {
  ocr_sprint: "OCR Sprint", ocr_pro: "OCR Pro", ocr_ultra: "OCR Ultra",
  hyrox: "HYROX", crossfit: "CrossFit", general: "Funcional",
};
const LEVEL_LABELS = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };

async function generateExcel(plan, answers, email) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Hybrid Race Hub";
  wb.created = new Date();

  const pesoKg   = Number(answers.peso) || 70;
  const totalWeeks = plan.weeks?.length || 0;

  /* ── Portada ─────────────────────────────────────────────────────────── */
  const cover = wb.addWorksheet("Portada");
  cover.views = [{ showGridLines: false }];
  ["A","B","C","D"].forEach((col, i) => { cover.getColumn(col).width = [4, 28, 28, 4][i]; });

  for (let r = 1; r <= 35; r++) {
    for (let c = 1; c <= 5; c++) cover.getRow(r).getCell(c).fill = fill(C.bgDark);
    cover.getRow(r).height = 20;
  }

  cover.mergeCells("B3:C3");
  const logoC = cover.getCell("B3");
  logoC.value = "HYBRID RACE HUB";
  logoC.font  = font(C.orange, 20, true);
  logoC.fill  = fill(C.bgDark);
  cover.getRow(3).height = 30;

  cover.mergeCells("B5:C5");
  const titleC = cover.getCell("B5");
  titleC.value = plan.title || "Plan de Entrenamiento Personalizado";
  titleC.font  = font(C.white, 15, true);
  titleC.fill  = fill(C.bgDark);

  cover.mergeCells("B6:C6");
  const subC = cover.getCell("B6");
  subC.value = plan.subtitle || "";
  subC.font  = font(C.muted, 10, false, true);
  subC.fill  = fill(C.bgDark);

  const stats = [
    ["Objetivo",      OBJ_LABELS[answers.objective]  || answers.objective  || "—"],
    ["Nivel",         LEVEL_LABELS[answers.level]     || answers.level      || "—"],
    ["Semanas",       String(totalWeeks)],
    ["Días / semana", String(answers.daysPerWeek || 4)],
    ["Peso corporal", answers.peso ? `${answers.peso} kg` : "—"],
    ["Generado",      new Date().toLocaleDateString("es-ES")],
    ["Email",         email],
  ];
  let ri = 8;
  for (const [label, val] of stats) {
    const lc = cover.getCell(`B${ri}`);
    lc.value = label; lc.font = font(C.muted, 9); lc.fill = fill(C.bgDark);
    const vc = cover.getCell(`C${ri}`);
    vc.value = val;   vc.font = font(C.white, 9, true); vc.fill = fill(C.bgDark);
    ri++;
  }

  cover.mergeCells(`B${ri + 2}:C${ri + 2}`);
  const noteC = cover.getCell(`B${ri + 2}`);
  noteC.value = "hybridracehub.com · Rellena Peso real y RPE tras cada sesión";
  noteC.font  = font(C.muted, 8, false, true);
  noteC.fill  = fill(C.bgDark);

  /* ── Hoja semanal ────────────────────────────────────────────────────── */
  const COLS = [
    { header: "Ejercicio",       key: "ejercicio",  width: 42 },
    { header: "Series",          key: "series",     width: 10 },
    { header: "Reps / Tiempo",   key: "reps",       width: 16 },
    { header: "Peso obj. (kg)",  key: "peso_obj",   width: 16 },
    { header: "Peso real (kg)",  key: "peso_real",  width: 16 },
    { header: "RPE (1-10)",      key: "rpe",        width: 13 },
    { header: "Notas",           key: "notas",      width: 32 },
  ];

  for (const week of (plan.weeks || [])) {
    const { items: loads, isDeload, cycleLabel } = calcLoads(pesoKg, answers.level, week.number);
    const ws = wb.addWorksheet(`Semana ${week.number}`);
    ws.views = [{ showGridLines: false }];
    COLS.forEach((col, i) => { ws.getColumn(i + 1).width = col.width; });

    // Week title
    ws.mergeCells(1, 1, 1, COLS.length);
    const wt = ws.getCell(1, 1);
    wt.value = `SEMANA ${week.number}  ·  ${(week.phaseLabel || "").toUpperCase()}  ·  ${cycleLabel}${isDeload ? "  ← DELOAD" : ""}`;
    wt.font  = font(C.orange, 13, true);
    wt.fill  = fill(C.bgSurface);
    wt.alignment = { vertical: "middle" };
    ws.getRow(1).height = 26;

    // Tip
    ws.mergeCells(2, 1, 2, COLS.length);
    const tip = ws.getCell(2, 1);
    tip.value = week.tip || "";
    tip.font  = font(C.muted, 9, false, true);
    tip.fill  = fill(C.bgSurface);

    // Column headers
    const hRow = ws.getRow(3);
    hRow.height = 20;
    COLS.forEach((col, i) => styleHeader(hRow.getCell(i + 1), col.header));

    let curRow = 4;

    for (const dayObj of (week.days || [])) {
      if (!dayObj.session) continue;

      // Day separator
      ws.mergeCells(curRow, 1, curRow, COLS.length);
      const ds = ws.getCell(curRow, 1);
      ds.value     = `${dayObj.day}  —  ${dayObj.session.title || ""}`;
      ds.font      = font(C.white, 10, true);
      ds.fill      = fill(C.bgAlt);
      ds.border    = border();
      ds.alignment = { vertical: "middle" };
      ws.getRow(curRow).height = 18;
      curRow++;

      // Calentamiento (muted)
      for (const item of (dayObj.session.warmup || [])) {
        const { name, sets, reps } = parseExercise(item);
        const row = ws.getRow(curRow);
        row.height = 17;
        [name, sets, reps, "", "", "", ""].forEach((v, i) => {
          const cell = row.getCell(i + 1);
          cell.value = v;
          cell.font  = font(C.muted, 9, false, true);
          cell.fill  = fill(C.bgRow);
          cell.border = border();
        });
        curRow++;
      }

      // Ejercicios principales
      for (const item of (dayObj.session.main || [])) {
        const { name, sets, reps } = parseExercise(item);
        const loadEntry = loads.find(l => name.toLowerCase().includes(l.label.toLowerCase().split(" ")[0]));
        const pesoObj   = loadEntry ? String(loadEntry.kg) : "";

        const row = ws.getRow(curRow);
        row.height = 20;
        [name, sets, reps, pesoObj, "", "", ""].forEach((v, i) => {
          const cell = row.getCell(i + 1);
          cell.fill   = fill(C.bgRow);
          cell.border = border();
          if (i === 3 && v) {
            cell.value = v;
            cell.font  = font(C.orange, 10, true);
          } else {
            cell.value = v;
            cell.font  = font(C.white, 10);
          }
        });
        curRow++;
      }

      // Fila peso corporal
      const pcRow = ws.getRow(curRow);
      pcRow.height = 17;
      ["Peso corporal (kg)", "", "", "", "", "", ""].forEach((v, i) => {
        const cell = pcRow.getCell(i + 1);
        cell.value  = v;
        cell.font   = font(C.muted, 9, false, true);
        cell.fill   = fill(C.bgAlt);
        cell.border = border();
      });
      curRow++;
    }
  }

  /* ── Mi Progreso ─────────────────────────────────────────────────────── */
  const prog = wb.addWorksheet("Mi Progreso");
  prog.views = [{ showGridLines: false }];

  const PCOLS = [
    { header: "Semana",             width: 12 },
    { header: "Fase",               width: 18 },
    { header: "Peso corporal (kg)", width: 20 },
    { header: "RPE medio",          width: 14 },
    { header: "Ejercicio clave",    width: 30 },
    { header: "Peso movido (kg)",   width: 18 },
    { header: "Observaciones",      width: 35 },
  ];

  prog.mergeCells(1, 1, 1, PCOLS.length);
  const pt = prog.getCell(1, 1);
  pt.value     = "MI PROGRESO — SEGUIMIENTO SEMANAL";
  pt.font      = font(C.orange, 14, true);
  pt.fill      = fill(C.bgSurface);
  pt.alignment = { vertical: "middle" };
  prog.getRow(1).height = 26;

  const phRow = prog.getRow(2);
  phRow.height = 20;
  PCOLS.forEach((col, i) => {
    prog.getColumn(i + 1).width = col.width;
    styleHeader(phRow.getCell(i + 1), col.header);
  });

  for (const week of (plan.weeks || [])) {
    const row = prog.getRow(2 + week.number);
    row.height = 20;
    [String(week.number), week.phaseLabel || "", "", "", "", "", ""].forEach((v, i) => {
      const cell = row.getCell(i + 1);
      const bg = week.number % 2 === 0 ? C.bgRow : C.bgSurface;
      cell.value  = v;
      cell.font   = font(i < 2 ? C.muted : C.white, 10);
      cell.fill   = fill(bg);
      cell.border = border();
    });
  }

  return wb.xlsx.writeBuffer();
}

/* ─── Email HTML ─────────────────────────────────────────────────────────── */

function buildEmailHtml(plan, answers) {
  const objLabel   = OBJ_LABELS[answers.objective] || "Entrenamiento";
  const levelLabel = LEVEL_LABELS[answers.level]   || answers.level || "";
  const weeks      = plan.weeks?.length || 0;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08090C;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#08090C;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:32px 40px 24px;background:#13151C;border-radius:12px 12px 0 0;border-bottom:2px solid #FB923C;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#FB923C;font-weight:700;">HYBRID RACE HUB</p>
          <h1 style="margin:0;font-size:28px;font-weight:800;color:#F5F5F7;line-height:1.2;">Tu plan está listo.</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;background:#13151C;">
          <p style="margin:0 0 16px;font-size:15px;color:#8C8E9A;line-height:1.6;">
            Aquí tienes tu <strong style="color:#F5F5F7;">Plan ${objLabel} ${levelLabel}</strong>
            de <strong style="color:#F5F5F7;">${weeks} semanas</strong>.<br>
            Adjunto encontrarás el archivo Excel con tu rutina completa.
          </p>
          <div style="background:#1A1D26;border-radius:8px;padding:20px 24px;margin:24px 0;">
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#FB923C;font-weight:700;">CÓMO USAR TU EXCEL</p>
            <ul style="margin:0;padding:0 0 0 16px;color:#8C8E9A;font-size:13px;line-height:1.9;">
              <li>Abre la hoja <strong style="color:#F5F5F7;">Portada</strong> para ver el resumen de tu plan</li>
              <li>Cada semana tiene su propia hoja con los ejercicios del día</li>
              <li>Rellena <em>Peso real</em> y <em>RPE</em> después de cada sesión</li>
              <li>Anota tu <em>Peso corporal</em> cada semana en la hoja <strong style="color:#F5F5F7;">Mi Progreso</strong></li>
              <li>Los pesos orientativos están calculados para tu peso corporal</li>
            </ul>
          </div>
          <p style="margin:0;font-size:13px;color:#5D5F6B;line-height:1.6;">
            ¿El email llegó a spam? Muévelo a tu bandeja para futuros mensajes.<br>
            ¿Dudas? Escríbenos a <a href="mailto:hola@hybridracehub.com" style="color:#FB923C;">hola@hybridracehub.com</a>
          </p>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#0F1015;border-radius:0 0 12px 12px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#5D5F6B;">
            © ${new Date().getFullYear()} Hybrid Race Hub ·
            <a href="https://hybridracehub.com" style="color:#FB923C;text-decoration:none;">hybridracehub.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Raw body reader ────────────────────────────────────────────────────── */

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end",  () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/* ─── Handler ────────────────────────────────────────────────────────────── */

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const rawBody = await getRawBody(req);
  const sig     = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta    = session.metadata || {};
    const email   = meta.email || session.customer_email || "";

    const answers = {
      objective:   meta.objective,
      level:       meta.level,
      daysPerWeek: Number(meta.daysPerWeek) || 4,
      horizon:     { weeks: Number(meta.horizonWeeks) || 8, label: meta.horizonLabel || "" },
      equipment:   meta.equipment,
      weaknesses:  meta.weaknesses ? meta.weaknesses.split(",").filter(Boolean) : [],
      edad:        meta.edad   || "",
      peso:        meta.peso   || "",
      altura:      meta.altura || "",
    };

    try {
      const plan = generatePlan({
        objective:   answers.objective,
        level:       answers.level,
        daysPerWeek: answers.daysPerWeek,
        horizon:     { weeks: answers.horizon.weeks },
        equipment:   answers.equipment,
        weaknesses:  answers.weaknesses,
      });

      const excelBuffer = await generateExcel(plan, answers, email);

      const objLabel = OBJ_LABELS[answers.objective] || "entrenamiento";
      const filename = `plan-${objLabel.toLowerCase().replace(/\s+/g, "-")}-${answers.level || "personalizado"}.xlsx`;

      await resend.emails.send({
        from:    "hola@hybridracehub.com",
        to:      email,
        subject: "Tu plan de entrenamiento personalizado — Hybrid Race Hub",
        html:    buildEmailHtml(plan, answers),
        attachments: [{ filename, content: Buffer.from(excelBuffer) }],
      });

      console.log(`Excel enviado a ${email}`);
    } catch (err) {
      console.error("Error generando o enviando Excel:", err);
      // Devolvemos 200 igualmente para que Stripe no reintente
    }
  }

  res.status(200).json({ received: true });
}
