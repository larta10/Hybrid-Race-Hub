/* Excel del plan (solo servidor): resumen, una hoja por semana con columnas para apuntar
   el peso real, el RPE y notas, y una hoja de progreso. Fondo blanco: se imprime sin gastar tinta. */
import ExcelJS from "exceljs";
import { longDate } from "../plan/dates.js";
import { refText } from "../plan/principles.js";

const C = { ink: "FF14161A", ink2: "FF4A4F57", line: "FFE2E0DA", accent: "FF1F5C46", soft: "FFE3EDE8", paper: "FFF5F4F0", white: "FFFFFFFF" };
const font = (color = C.ink, size = 10, bold = false, italic = false) => ({ name: "Calibri", size, bold, italic, color: { argb: color } });
const fill = argb => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
const border = { bottom: { style: "thin", color: { argb: C.line } } };
const box = Object.fromEntries(["top", "left", "bottom", "right"].map(k => [k, { style: "thin", color: { argb: C.line } }]));
const wrap = { vertical: "top", wrapText: true };

function header(ws, row, labels) {
  const r = ws.getRow(row);
  labels.forEach((l, i) => {
    const c = r.getCell(i + 1);
    c.value = l; c.font = font(C.white, 10, true); c.fill = fill(C.accent); c.alignment = { vertical: "middle", wrapText: true }; c.border = box;
  });
  r.height = 30;
}
function merged(ws, row, cols, value, style = {}) {
  ws.mergeCells(row, 1, row, cols);
  const c = ws.getCell(row, 1);
  c.value = value; c.font = style.font || font(); c.alignment = style.alignment || wrap;
  if (style.fill) c.fill = style.fill;
  if (style.height) ws.getRow(row).height = style.height;
  return c;
}
const lines = (text, perLine) => Math.max(1, Math.ceil(String(text).length / perLine));

export async function buildPlanExcel(plan, { race = null } = {}) {
  const { meta } = plan;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Hybrid Race Hub";
  wb.created = new Date();

  /* ── Resumen ── */
  const sum = wb.addWorksheet("Plan", { views: [{ showGridLines: false }] });
  sum.columns = [{ width: 26 }, { width: 22 }, { width: 70 }];
  let r = 1;
  merged(sum, r++, 3, "Hybrid Race Hub · Plan gratis", { font: font(C.accent, 10, true) });
  merged(sum, r++, 3, meta.title, { font: font(C.ink, 20, true), height: 30 });
  merged(sum, r++, 3, meta.subtitle, { font: font(C.ink2, 11) });
  if (race) merged(sum, r++, 3, `Tu carrera: ${race.nombre} · ${longDate(race.fecha_iso)}${race.municipio ? ` · ${race.municipio}` : ""}`, { font: font(C.ink, 11, true) });
  else if (meta.raceIso) merged(sum, r++, 3, `Carrera: ${longDate(meta.raceIso)}`, { font: font(C.ink, 11, true) });
  for (const n of plan.notices) merged(sum, r++, 3, n, { font: font(C.ink, 10), fill: fill(C.paper), height: 15 * lines(n, 105) });
  r++;
  header(sum, r++, ["Fase", "Semanas", "Qué se trabaja"]);
  for (const p of plan.phases) {
    const row = sum.getRow(r++);
    [p.label, `${p.from}${p.weeks > 1 ? ` a ${p.from + p.weeks - 1}` : ""}`, p.desc].forEach((v, i) => { const c = row.getCell(i + 1); c.value = v; c.font = font(C.ink, 10, i === 0); c.alignment = wrap; c.border = border; });
    row.height = 15 * lines(p.desc, 68);
  }
  if (plan.paces) {
    r++;
    header(sum, r++, ["Ritmo", "min/km", "Cuándo se usa"]);
    for (const p of plan.paces.rows) {
      const row = sum.getRow(r++);
      [p.label, p.range.replace(" min/km", ""), p.use].forEach((v, i) => { const c = row.getCell(i + 1); c.value = v; c.font = font(C.ink, 10, i === 0); c.alignment = wrap; c.border = border; });
    }
  }
  if (plan.substitutions.length) {
    r++;
    header(sum, r++, ["Estación de carrera", "", "Lo que haces tú"]);
    for (const x of plan.substitutions) {
      const row = sum.getRow(r++);
      row.getCell(1).value = x.original; row.getCell(1).font = font(C.ink, 10, true);
      row.getCell(3).value = x.sustituto; row.getCell(3).font = font(); row.getCell(3).alignment = wrap;
      [1, 2, 3].forEach(i => { row.getCell(i).border = border; });
    }
  }
  r++;
  merged(sum, r++, 3, plan.rpe, { font: font(C.ink2, 10), height: 15 * lines(plan.rpe, 105) });
  merged(sum, r++, 3, `Antes de empezar. ${plan.health}`, { font: font(C.ink2, 10), height: 15 * lines(plan.health, 100) });
  r++;
  merged(sum, r++, 3, "Por qué está hecho así", { font: font(C.ink, 13, true), height: 22 });
  for (const p of plan.principles) {
    merged(sum, r++, 3, p.title, { font: font(C.ink, 10, true) });
    merged(sum, r++, 3, p.text, { font: font(C.ink2, 10), height: 15 * lines(p.text, 105) });
    merged(sum, r++, 3, refText(p.ref), { font: font(C.accent, 9, false, true), height: 13 * lines(refText(p.ref), 115) });
  }
  merged(sum, r + 1, 3, "hybridracehub.com/plan-entrenamiento-hyrox", { font: font(C.ink2, 9) });

  /* ── Una hoja por semana ── */
  const COLS = ["Trabajo", "Series, tiempo o distancia", "Peso orientativo (kg)", "Peso real (kg)", "RPE previsto", "RPE real", "Notas"];
  for (const w of plan.weeks) {
    const ws = wb.addWorksheet(`Semana ${w.n}`, { views: [{ showGridLines: false, state: "frozen", ySplit: 3 }], pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 } });
    ws.columns = [{ width: 56 }, { width: 30 }, { width: 14 }, { width: 14 }, { width: 11 }, { width: 10 }, { width: 34 }];
    merged(ws, 1, COLS.length, `Semana ${w.n} · ${w.phaseLabel}${w.raceWeek ? (meta.hasDate ? " · Carrera" : " · Test") : w.deload ? " · Descarga" : ""}${w.range ? ` · ${w.range}` : ""}`, { font: font(C.ink, 14, true), height: 24 });
    merged(ws, 2, COLS.length, w.focus, { font: font(C.ink2, 10, false, true), height: 16 });
    header(ws, 3, COLS);
    let row = 4;
    for (const s of w.sessions) {
      merged(ws, row++, COLS.length, `${s.day}${s.dateLabel ? ` ${s.dateLabel}` : ""} · ${s.title}${s.minutes ? ` · ${s.minutes} min` : ""}`, { font: font(C.ink, 11, true), fill: fill(C.soft), height: 20, alignment: { vertical: "middle" } });
      merged(ws, row++, COLS.length, s.objetivo, { font: font(C.ink2, 10, false, true), height: 15 * lines(s.objetivo, 160) });
      if (s.warmup.length) merged(ws, row++, COLS.length, `Calentamiento: ${s.warmup.join(" · ")}`, { font: font(C.ink2, 10), height: 15 * lines(s.warmup.join(" · "), 150) });
      for (const it of s.main) {
        const x = ws.getRow(row++);
        [it.name, it.dose, it.kg ?? "", "", s.rpe, "", ""].forEach((v, i) => {
          const c = x.getCell(i + 1);
          c.value = v; c.font = font(i === 2 && v !== "" ? C.accent : C.ink, 10, i === 2); c.border = box;
          c.alignment = { ...wrap, horizontal: i >= 2 && i <= 5 ? "center" : "left" };
        });
        x.height = Math.max(18, 15 * Math.max(lines(it.name, 58), lines(it.dose, 30)));
      }
      if (s.cooldown.length) merged(ws, row++, COLS.length, `Vuelta a la calma: ${s.cooldown.join(" · ")}`, { font: font(C.ink2, 10) });
      if (s.note) merged(ws, row++, COLS.length, s.note, { font: font(C.ink2, 9, false, true), height: 13 * lines(s.note, 170) });
      row++;
    }
    merged(ws, row, COLS.length, "hybridracehub.com", { font: font(C.ink2, 9) });
  }

  /* ── Progreso ── */
  const pr = wb.addWorksheet("Progreso", { views: [{ showGridLines: false, state: "frozen", ySplit: 2 }] });
  const PCOLS = ["Semana", "Fase", "Fechas", "Sesiones previstas", "Sesiones hechas", "RPE medio", "Peso corporal (kg)", "Cómo ha ido"];
  pr.columns = [{ width: 10 }, { width: 22 }, { width: 20 }, { width: 12 }, { width: 12 }, { width: 11 }, { width: 14 }, { width: 50 }];
  merged(pr, 1, PCOLS.length, "Progreso: rellena una fila cada domingo", { font: font(C.ink, 14, true), height: 24 });
  header(pr, 2, PCOLS);
  plan.weeks.forEach((w, i) => {
    const row = pr.getRow(3 + i);
    [w.n, `${w.phaseLabel}${w.deload ? " (descarga)" : w.raceWeek ? (meta.hasDate ? " (carrera)" : " (test)") : ""}`, w.range || "", w.sessions.length, "", "", "", ""].forEach((v, k) => {
      const c = row.getCell(k + 1);
      c.value = v; c.font = font(k < 4 ? C.ink2 : C.ink); c.border = box; c.alignment = { vertical: "middle", horizontal: k === 1 || k === 2 || k === 7 ? "left" : "center" };
      if (i % 2) c.fill = fill(C.paper);
    });
    row.height = 20;
  });
  const end = 3 + plan.weeks.length;
  pr.getCell(end + 1, 4).value = "Total";
  pr.getCell(end + 1, 4).font = font(C.ink, 10, true);
  pr.getCell(end + 1, 5).value = { formula: `SUM(E3:E${end - 1})` };
  pr.getCell(end + 1, 6).value = { formula: `IFERROR(AVERAGE(F3:F${end - 1}),"")` };
  [5, 6].forEach(k => { pr.getCell(end + 1, k).font = font(C.accent, 10, true); pr.getCell(end + 1, k).alignment = { horizontal: "center" }; });

  return Buffer.from(await wb.xlsx.writeBuffer());
}
