# Auditoría SEO/SEM octubre 2026 — progreso

Si la sesión se corta: leer este archivo y `git log -5`, y seguir por la primera fase en ⏳.

- ✅ Fase 1 — Auditoría técnica (enlaces, imágenes, móvil)
- ✅ Fase 2 — SEO técnico (sitemap, canonical, metas, schema, CWV, enlazado, 404)
- ✅ Fase 3 — SEO de contenido (home, guía, blog, Galicia y regiones nuevas, centros por ciudad, artículos)
- ✅ Fase 4 — SEM (lib/track.js, docs/sem/*)
- ✅ Fase 5 — Cierre (lint, crawler, INFORME-AUDITORIA-2026-10.md)

## Notas de trabajo
- La tabla `sport_centers` no existe en Supabase (PGRST205). Los centros salen de `lib/centros-entrenamiento.json` (468 centros).
- Carreras futuras en Supabase a 27/10/2026: 38 (modalidad ocr + funcional).

### Fase 1 (hecho)
- Crawler propio `scripts/audit-links.mjs` (local y producción): 60 páginas, 0 internos rotos, 0 imágenes rotas, Amazon OK (tag + rel + target).
- 18 externos con error: 12 webs de centros muertas (DNS) quitadas del JSON, 16 enlaces Basic-Fit 404 → /es-es/gimnasios, SGX 404 quitado. Pendientes (Supabase): farinatorace.es no responde.
- Home: 3 fotos Unsplash a next/image (eran <img> sin dimensiones, 572 KB y 303 KB); alt de la banda corregido (es SkiErg, no sled). Quitados weserv y m.media-amazon de remotePatterns.
- Móvil (`scripts/audit-mobile.mjs`, capturas en audit-screenshots/before|after): sin scroll horizontal, menú OK. Corregidos tamaños táctiles (pie, centros, botón calendario, migas) y textos de 8-10 px en centros/pie. Filtros de centros en fila deslizable en móvil.
- Productos Amazon: 49 productos, 0 con imagen; todos muestran el placeholder (icono + nombre), sin romper el layout.

### Fase 2 (hecho)
- `scripts/audit-seo.mjs`: de 54/57 URLs con incidencias a 0 (salvo /calculadora y /centros-deportivos, stubs con noindex).
- Titles ≤60 (helper `pageTitle`: marca solo si cabe), descriptions 140-155 (`fitDesc` en regiones), overrides del blog en `lib/blog-seo.js`.
- BreadcrumbList en calendario, plan, calculadora, programas, comunidad, productos, organizadores y centros; migas visibles en centros, calendario, productos y calculadora.
- Event: addressRegion con fallback a comunidad; quitado el organizador inventado (no hay dato en Supabase). Event también en la home.
- Sitemap con lastmod real (updated_at de Supabase / fecha de cambio de plantilla). Quitado gtag.js paralelo (solo GTM).
- Centros: geolocalización solo bajo demanda, 6 centros por comunidad con botón "Ver los N" (DOM inicial mucho menor).
- Enlazado: home → todas las regiones con anchor "Carreras híbridas en X"; bloque fijo en cada post (calendario + 3 regiones + ranking); 404 con regiones.
- Lighthouse móvil ANTES (producción): home 76 (LCP 4,5 s, TBT 310 ms), centros 71 (TBT 1.270 ms, 8.162 nodos DOM).

### Fase 3 (hecho)
- Home: title "Carreras híbridas en España 2026-2027 | Hybrid Race Hub", bloque de ~105 palabras con hybrid race / carreras híbridas / competiciones híbridas, FAQ visible (<details>) de 6 preguntas con datos de Supabase + FAQPage.
- Guía: title y H1 con "hybrid race", definición de ~55 palabras al inicio, sección Hybrid Day (verificada en hybrid-day.com), 2 FAQ nuevas (qué significa / ¿hybrid race = HYROX?).
- Blog: titles/metas de HURBAX, Hyatlón y HYROX con respuesta directa (+ fechas verificadas en hyatlon.org y hurbax.com).
- Regiones nuevas: /carreras-hibridas/galicia (DEKA Vigo 2027 de Supabase + Hybrid Day Vigo 12-13/12/2026 verificado en hybrid-day.com, en lib/verified-events.js), /carreras-hibridas/cantabria, /carreras-hibridas/castilla-la-mancha. No se menciona Coruña: no hay evento verificado.
- 31 páginas /centros-entrenamiento/[ciudad] (≥3 centros distintos, lib/center-cities.js) + bloque "Centros por ciudad".
- Artículos: /blog/hyrox-vs-carrera-hibrida-diferencias y /blog/calendario-hyrox-espana-2026-2027 (Hybrid Day 2027 sin sedes publicadas → sustituido).
- "Actualizado: fecha" en regiones, centros por ciudad y posts.

### Fase 4 (hecho)
- `lib/track.js`: affiliate_click, race_outbound_click, contact_form_submit, search_used, region_view. Enganchado en Amazon (listener de _app), "Web oficial"/"Inscribirme", formularios de organizadores y home, buscadores de calendario y centros, y páginas de región/ciudad. Verificado con `scripts/check-tracking.mjs` (los 5 llegan al dataLayer).
- docs/sem/GTM-CONFIG.md, PLAN-GOOGLE-ADS.md, PLAN-META-ADS.md y google-ads-editor.csv (generado y validado por `scripts/sem-build-csv.mjs`: 3 campañas en pausa, 19 RSA, 250 keywords, 34 negativas por campaña).
- Aviso: el texto de cookies dice "solo técnicas"; hace falta CMP + Consent Mode v2 antes de lanzar campañas.

### Fase 5 (hecho)
- `npm run build` limpio (98 páginas) y `npm run lint` con 0 errores (109 avisos, sobre todo `<a>` en vez de `<Link>`).
- Crawler local final: 96 páginas, 0 enlaces internos rotos; audit-seo: 0 incidencias en las 90 URLs del sitemap.
- Informe: INFORME-AUDITORIA-2026-10.md.
