/**
 * Estado de inscripción canónico a partir del texto libre de races.estado.
 * En la tabla conviven equivalentes ("Abierta", "inscripciones abiertas"…); todo el código
 * (badges, botones, schema y contadores) pasa por aquí. SQL para unificar los textos de la tabla:
 * docs/datos/normalizar-estados-2026-11-03.sql.
 *
 * abierta · agotada · cerrada · proximamente · por_confirmar
 * Un texto vacío o desconocido cuenta como por_confirmar: sin dato no se anuncia como abierta.
 */
export const ESTADOS = ["abierta", "agotada", "cerrada", "proximamente", "por_confirmar"];

export function normalizeEstado(estado) {
  const e = String(estado || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  if (!e) return "por_confirmar";
  if (/agotad|sold ?out|completo|sin plazas/.test(e)) return "agotada";
  if (/pendiente|por confirmar|verificar|sin confirmar/.test(e)) return "por_confirmar";
  if (/cerrad|finalizad/.test(e)) return "cerrada";
  if (/proxim|abriran|coming soon/.test(e)) return "proximamente";
  if (/abiert|ultimas plazas/.test(e)) return "abierta";
  return "por_confirmar";
}

/** Texto y estilo del badge de cada estado canónico */
export const ESTADO_BADGE = {
  abierta: { label: "Inscripción abierta", kind: "open" },
  agotada: { label: "Agotado", kind: "closed" },
  cerrada: { label: "Inscripción cerrada", kind: "closed" },
  proximamente: { label: "Aún no abierta", kind: "closed" },
  por_confirmar: { label: "Por confirmar", kind: "neutral" },
};

/** Disponibilidad de schema.org. por_confirmar no lleva: esas carreras van fuera del Event schema */
export const ESTADO_AVAILABILITY = {
  abierta: "https://schema.org/InStock",
  agotada: "https://schema.org/SoldOut",
  cerrada: "https://schema.org/SoldOut",
  proximamente: "https://schema.org/PreOrder",
  por_confirmar: null,
};
