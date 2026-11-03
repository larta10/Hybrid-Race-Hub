/* Fechas en español sin depender de Intl (mismo resultado en servidor y navegador). */
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(d)} de ${MESES[Number(m) - 1]} de ${y}`;
}
export function mesAno(iso) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return `${MESES[Number(m) - 1]} de ${y}`;
}
/** "del 11 al 15 de noviembre de 2026" · "del 30 de abril al 2 de mayo de 2027" · "14 de febrero de 2027" */
export function rangoFechas(start, end) {
  if (!start) return "";
  if (!end || end === start) return fechaLarga(start);
  const [y1, m1, d1] = start.split("-"), [y2, m2, d2] = end.split("-");
  if (y1 === y2 && m1 === m2) return `del ${Number(d1)} al ${Number(d2)} de ${MESES[Number(m2) - 1]} de ${y2}`;
  if (y1 === y2) return `del ${Number(d1)} de ${MESES[Number(m1) - 1]} al ${Number(d2)} de ${MESES[Number(m2) - 1]} de ${y2}`;
  return `del ${fechaLarga(start)} al ${fechaLarga(end)}`;
}
