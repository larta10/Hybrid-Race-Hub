# Fase 2 (rediseño, móvil, carreras) — progreso

Si la sesión se corta: leer este archivo y `git log -5`, y seguir por la primera fase en ⏳.
Punto de retorno: tag `pre-rediseno`.

- ✅ Fase 1 — Datos: correcciones + carreras nuevas verificadas
- ✅ Fase 2 — Cookies + Consent Mode v2
- ✅ Fase 3 — GTM importable
- ✅ Fase 4 — Rediseño editorial
- ⏳ Fase 5 — Mobile first y rendimiento
- ⏳ Fase 6 — QA
- ⏳ Fase 7 — Informe

## Notas
- Fase 1: sin clave de servicio en .env.local y MCP de Supabase sin autorizar → la clave anon no puede escribir (RLS). Cambios verificados en docs/datos/cambios-races-2026-10-27.sql (6 altas, 8 correcciones) para pegar en el SQL Editor. Hybrid Day Vigo se mantiene en lib/verified-events.js hasta entonces (se oculta solo cuando exista en Supabase). Evidencias: docs/datos/verificacion-carreras-2026-10.md.
- Fase 2: banner propio (components/ConsentBanner.js, lib/consent.js), Consent Mode v2 por defecto en _document, /politica-cookies, pie con «Configurar cookies». scripts/check-consent.mjs: 13/13 OK.
- Fase 3: gtm.js publicado sin etiquetas ni G- (GA4 sin configurar). docs/sem/gtm-container-import.json (6 etiquetas, 5 activadores, 9 variables, consentimiento analytics_storage) generado y validado por scripts/gtm-build-container.mjs. GTM-CONFIG.md reescrito.
- Fase 4: tokens nuevos en :root (papel/tinta/verde pista), Archivo wdth 112 + Source Sans 3 (fuera Barlow, Inter, JetBrains Mono), sin mayúsculas forzadas salvo etiquetas pequeñas, sin blur ni degradados, logo H nuevo + favicons + manifest + OG (scripts/generate-brand.mjs, api/og.js), hero con foto y capa oscura, microtextos. Capturas antes en audit-screenshots/antes.
