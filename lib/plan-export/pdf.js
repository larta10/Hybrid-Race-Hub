/* PDF imprimible del plan (solo servidor): portada con el resumen y una semana por página.
   jsPDF con las fuentes estándar: admiten los acentos del castellano (WinAnsi), no emojis ni flechas. */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { refText } from "../plan/principles.js";
import { longDate } from "../plan/dates.js";

const INK = [20, 22, 26], INK2 = [74, 79, 87], LINE = [226, 224, 218], ACCENT = [31, 92, 70], SOFT = [227, 237, 232], PAPER = [245, 244, 240];
const W = 210, H = 297, M = 14;
const clean = s => String(s ?? "").replace(/[→➜]/g, ">").replace(/[^\x09\x0A\x20-\xFF€…–—]/g, "");
const kg = n => `${String(n).replace(".", ",")} kg`;

export function planFileName(plan, ext) {
  const slug = plan.meta.prueba.replace(/_/g, "-");
  return `plan-${slug}-${plan.meta.weeks}-semanas.${ext}`;
}

export function buildPlanPdf(plan, { race = null } = {}) {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
  const { meta } = plan;
  let page = 0;

  function decor() {
    page++;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...INK);
    doc.text("Hybrid Race Hub", M, 10);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...INK2);
    doc.text(clean(meta.title), W - M, 10, { align: "right" });
    doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(M, 12.5, W - M, 12.5);
    doc.setFontSize(8);
    doc.text("hybridracehub.com/plan-entrenamiento-hyrox", M, H - 7);
    doc.text(String(page), W - M, H - 7, { align: "right" });
  }
  const para = (text, y, { size = 10, color = INK2, bold = false, width = W - 2 * M, lh = 1.35 } = {}) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean(text), width);
    doc.text(lines, M, y, { lineHeightFactor: lh });
    return y + lines.length * size * 0.3528 * lh + 1.5;
  };
  const tableBase = {
    theme: "plain", margin: { left: M, right: M, top: 18, bottom: 14 },
    styles: { font: "helvetica", fontSize: 8.5, cellPadding: { top: 1.3, bottom: 1.3, left: 1.5, right: 1.5 }, textColor: INK, lineColor: LINE, lineWidth: { bottom: 0.2 }, overflow: "linebreak" },
    headStyles: { fontStyle: "bold", textColor: INK2, fontSize: 8, lineWidth: { bottom: 0.4 }, lineColor: INK },
    didDrawPage: decor,
  };

  /* ── Portada ── */
  decor();
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...ACCENT);
  doc.text(clean(`PLAN GRATIS · ${meta.pruebaLabel}`.toUpperCase()), M, 24);
  let y = para(meta.title, 34, { size: 24, color: INK, bold: true, lh: 1.1 });
  y = para(meta.subtitle, y + 1, { size: 11 });
  if (race) y = para(`Tu carrera: ${race.nombre} · ${longDate(race.fecha_iso)}${race.municipio ? ` · ${race.municipio}` : ""}`, y + 1, { size: 11, color: INK, bold: true });
  else if (meta.raceIso) y = para(`Carrera: ${longDate(meta.raceIso)}`, y + 1, { size: 11, color: INK, bold: true });
  y += 2;
  for (const n of plan.notices) y = para(n, y, { size: 9.5, color: INK });

  y = para("Cómo se reparten las semanas", y + 4, { size: 13, color: INK, bold: true });
  autoTable(doc, {
    ...tableBase, startY: y, didDrawPage: undefined,
    head: [["Fase", "Semanas", "Qué se trabaja"]],
    body: plan.phases.map(p => [p.label, `${p.from}${p.weeks > 1 ? ` a ${p.from + p.weeks - 1}` : ""}`, clean(p.desc)]),
    columnStyles: { 0: { cellWidth: 30, fontStyle: "bold" }, 1: { cellWidth: 22 } },
  });
  y = doc.lastAutoTable.finalY + 3;
  y = para(`Descarga cada ${meta.deloadEvery} semanas. ${plan.rpe}`, y + 2, { size: 9 });

  if (plan.paces) {
    y = para("Tus ritmos", y + 4, { size: 13, color: INK, bold: true });
    autoTable(doc, {
      ...tableBase, startY: y, didDrawPage: undefined,
      head: [["Ritmo", "min/km", "Cuándo se usa"]],
      body: plan.paces.rows.map(r => [r.label, r.range.replace(" min/km", ""), clean(r.use)]),
      columnStyles: { 0: { cellWidth: 38, fontStyle: "bold" }, 1: { cellWidth: 28 } },
    });
    y = doc.lastAutoTable.finalY + 3;
    y = para(`Calculados con tu ${plan.paces.estimated ? "ritmo cómodo (marca de 5 km estimada: " : "marca de 5 km ("}${plan.paces.t5k}). Son una referencia: manda el RPE.`, y + 2, { size: 9 });
  }
  if (plan.substitutions.length) {
    y = para("Lo que cambia con tu material", y + 4, { size: 13, color: INK, bold: true });
    autoTable(doc, {
      ...tableBase, startY: y, didDrawPage: undefined,
      head: [["Estación de carrera", "Lo que haces tú"]],
      body: plan.substitutions.map(x => [clean(x.original), clean(x.sustituto)]),
      columnStyles: { 0: { cellWidth: 55, fontStyle: "bold" } },
    });
    y = doc.lastAutoTable.finalY + 3;
  }
  if (y > H - 40) { doc.addPage(); decor(); y = 22; }
  para(`Antes de empezar. ${plan.health}`, y + 4, { size: 9 });

  /* ── Una semana por página ── */
  for (const w of plan.weeks) {
    doc.addPage();
    const startPage = page;
    const body = [];
    for (const s of w.sessions) {
      body.push([{ content: clean(`${s.day}${s.dateLabel ? ` ${s.dateLabel}` : ""}  ·  ${s.title}${s.minutes ? `  ·  ${s.minutes} min` : ""}  ·  RPE ${s.rpe}`), colSpan: 3, styles: { fontStyle: "bold", fillColor: SOFT, textColor: INK, fontSize: 9 } }]);
      body.push([{ content: clean(s.objetivo), colSpan: 3, styles: { textColor: INK2, fontStyle: "italic" } }]);
      if (s.warmup.length) body.push([{ content: clean(`Calentamiento: ${s.warmup.join(" · ")}`), colSpan: 3, styles: { textColor: INK2 } }]);
      for (const it of s.main) body.push([clean(it.name), clean(it.dose), it.kg ? kg(it.kg) : ""]);
      if (s.cooldown.length) body.push([{ content: clean(`Vuelta a la calma: ${s.cooldown.join(" · ")}`), colSpan: 3, styles: { textColor: INK2 } }]);
      if (s.note) body.push([{ content: clean(s.note), colSpan: 3, styles: { textColor: INK2, fontSize: 8 } }]);
    }
    autoTable(doc, {
      ...tableBase, startY: 36,
      head: [["Trabajo", "Series, tiempo o distancia", "Peso orientativo"]],
      body,
      columnStyles: { 0: { cellWidth: 96 }, 1: { cellWidth: 56 }, 2: { cellWidth: 30, halign: "right" } },
      rowPageBreak: "avoid",
      didDrawPage: () => {
        decor();
        if (page !== startPage) return;
        doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(...INK);
        doc.text(clean(`Semana ${w.n} · ${w.phaseLabel}${w.raceWeek ? (meta.hasDate ? " · Carrera" : " · Test") : w.deload ? " · Descarga" : ""}`), M, 22);
        doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...INK2);
        doc.text(doc.splitTextToSize(clean(`${w.range ? `${w.range}. ` : ""}${w.focus}`), W - 2 * M), M, 28);
      },
    });
  }

  /* ── Por qué está hecho así ── */
  doc.addPage(); decor();
  y = para("Por qué está hecho así", 24, { size: 16, color: INK, bold: true });
  for (const p of plan.principles) {
    if (y > H - 50) { doc.addPage(); decor(); y = 22; }
    y = para(p.title, y + 3, { size: 11, color: INK, bold: true });
    y = para(p.text, y, { size: 9.5 });
    y = para(refText(p.ref), y, { size: 8, color: ACCENT });
  }
  if (plan.paces) y = para(`Ritmos: ${refText(plan.paces.ref)}`, y + 3, { size: 8, color: ACCENT });
  doc.setFillColor(...PAPER);
  return Buffer.from(doc.output("arraybuffer"));
}
