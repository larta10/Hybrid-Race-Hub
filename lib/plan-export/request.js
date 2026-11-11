/* Lo común de las rutas de descarga: reconstruir el plan desde los parámetros y buscar la carrera, si viene. */
import { buildPlan, parseParams, isComplete } from "../plan/index.js";
import { todayISO, fetchAllRaces } from "../races-server";

export async function planFromQuery(query) {
  const input = parseParams(query);
  if (!isComplete(input)) return null;
  const plan = buildPlan(input, { today: todayISO() });
  let race = null;
  if (input.carrera) {
    try {
      const r = (await fetchAllRaces()).find(x => x.slug === input.carrera);
      if (r) race = { nombre: r.nombre, fecha_iso: r.fecha_iso, municipio: r.municipio || null, slug: r.slug };
    } catch {}
  }
  return { input, plan, race };
}
