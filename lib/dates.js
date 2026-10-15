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
