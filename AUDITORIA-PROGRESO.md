# Auditoría SEO/SEM octubre 2026 — progreso

Si la sesión se corta: leer este archivo y `git log -5`, y seguir por la primera fase en ⏳.

- ✅ Fase 1 — Auditoría técnica (enlaces, imágenes, móvil)
- ⏳ Fase 2 — SEO técnico (sitemap, canonical, metas, schema, CWV, enlazado, 404)
- ⏳ Fase 3 — SEO de contenido (home, guía, blog, Galicia y regiones nuevas, centros por ciudad, artículos)
- ⏳ Fase 4 — SEM (lib/track.js, docs/sem/*)
- ⏳ Fase 5 — Cierre (lint, crawler, INFORME-AUDITORIA-2026-10.md)

## Notas de trabajo
- La tabla `sport_centers` no existe en Supabase (PGRST205). Los centros salen de `lib/centros-entrenamiento.json` (468 centros).
- Carreras futuras en Supabase a 27/10/2026: 38 (modalidad ocr + funcional).

### Fase 1 (hecho)
- Crawler propio `scripts/audit-links.mjs` (local y producción): 60 páginas, 0 internos rotos, 0 imágenes rotas, Amazon OK (tag + rel + target).
- 18 externos con error: 12 webs de centros muertas (DNS) quitadas del JSON, 16 enlaces Basic-Fit 404 → /es-es/gimnasios, SGX 404 quitado. Pendientes (Supabase): farinatorace.es no responde.
- Home: 3 fotos Unsplash a next/image (eran <img> sin dimensiones, 572 KB y 303 KB); alt de la banda corregido (es SkiErg, no sled). Quitados weserv y m.media-amazon de remotePatterns.
- Móvil (`scripts/audit-mobile.mjs`, capturas en audit-screenshots/before|after): sin scroll horizontal, menú OK. Corregidos tamaños táctiles (pie, centros, botón calendario, migas) y textos de 8-10 px en centros/pie. Filtros de centros en fila deslizable en móvil.
- Productos Amazon: 49 productos, 0 con imagen; todos muestran el placeholder (icono + nombre), sin romper el layout.
