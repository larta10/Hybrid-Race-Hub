# Fase 2 (rediseño, móvil, carreras) — progreso

Si la sesión se corta: leer este archivo y `git log -5`, y seguir por la primera fase en ⏳.
Punto de retorno: tag `pre-rediseno`.

- ✅ Fase 1 — Datos: correcciones + carreras nuevas verificadas
- ✅ Fase 2 — Cookies + Consent Mode v2
- ✅ Fase 3 — GTM importable
- ✅ Fase 4 — Rediseño editorial
- ✅ Fase 5 — Mobile first y rendimiento
- ✅ Fase 6 — QA
- ⏳ Fase 7 — Informe

## Notas
- Fase 1: sin clave de servicio en .env.local y MCP de Supabase sin autorizar → la clave anon no puede escribir (RLS). Cambios verificados en docs/datos/cambios-races-2026-10-27.sql (6 altas, 8 correcciones) para pegar en el SQL Editor. Hybrid Day Vigo se mantiene en lib/verified-events.js hasta entonces (se oculta solo cuando exista en Supabase). Evidencias: docs/datos/verificacion-carreras-2026-10.md.
- Fase 2: banner propio (components/ConsentBanner.js, lib/consent.js), Consent Mode v2 por defecto en _document, /politica-cookies, pie con «Configurar cookies». scripts/check-consent.mjs: 13/13 OK.
- Fase 3: gtm.js publicado sin etiquetas ni G- (GA4 sin configurar). docs/sem/gtm-container-import.json (6 etiquetas, 5 activadores, 9 variables, consentimiento analytics_storage) generado y validado por scripts/gtm-build-container.mjs. GTM-CONFIG.md reescrito.
- Fase 4: tokens nuevos en :root (papel/tinta/verde pista), Archivo wdth 112 + Source Sans 3 (fuera Barlow, Inter, JetBrains Mono), sin mayúsculas forzadas salvo etiquetas pequeñas, sin blur ni degradados, logo H nuevo + favicons + manifest + OG (scripts/generate-brand.mjs, api/og.js), hero con foto y capa oscura, microtextos. Capturas antes en audit-screenshots/antes.
- Fase 5: cabecera única 56px (components/SiteHeader.js) con buscador y menú a pantalla completa; calendario con chips Región/Modalidad/Mes sincronizados con la URL y filtrado local (sin consultas extra); tarjeta de carrera pulsable + ficha con barra fija (Inscribirme, .ics, Compartir); tablas apiladas en móvil; formularios 16px con autocomplete; Archivo como instancia estática de 37 KB; modo oscuro (pedido por Pablo) con botón en la cabecera y preferencia del sistema por defecto. Lighthouse local: home 97-98 (LCP 2,4-2,5 s), centros 90-93 (LCP 2,8-2,9 s).
- Fase 6: build y lint (0 errores), 0 enlaces internos rotos, QA en 360/390/1440 sin scroll horizontal, táctiles ≥44 px y texto ≥14 px (salvo la letra oculta del logo), axe 0 críticos/graves, consentimiento 13/13, medición 6/6. Lighthouse antes (tag pre-rediseno) vs después en local: ver informe.
