# AUDITORÍA Hybrid Race Hub — Octubre 2026

> Fecha: 2026-10-13 | Auditor: Claude (desarrollador senior)
> Estado del build antes de la auditoría: ✅ PASA (sin errores)

---

## MAPA DEL SITIO

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Static | Home principal |
| `/calendario` | Static (SSR fetch) | Calendario de eventos |
| `/calendario/[ciudad]` | SSG (8 paths) | Calendario por ciudad |
| `/blog` | Static | Índice del blog |
| `/blog/[slug]` | SSG (~12 posts) | Artículos individuales |
| `/productos` | Static | Índice de rankings |
| `/productos/[categoria]` | SSG (6 paths) | Rankings individuales |
| `/plan-entrenamiento` | Static | Generador de planes |
| `/calculadora-hyrox` | Static | Calculadora de tiempos HYROX |
| `/centros-entrenamiento` | Static | Directorio de centros (JSON) |
| `/race-hub` | Static | Programas de entrenamiento |
| `/comunidad` | Static (SSR fetch) | Artículos de Supabase |
| `/comunidad/[slug]` | Dynamic | Artículos individuales de Supabase |
| `/contacto-organizadores` | Static | Formulario de contacto |
| `/calculadora` | Static | Stub page (noindex) |
| `/centros-deportivos` | Static | Stub page (noindex) |
| `/sitemap.xml` | Dynamic | Sitemap XML |
| `/api/contact` | API | Envío de formulario |
| `/api/fix-formats` | API | Script interno |
| `/api/generate-excel` | API | Generador Excel |
| `/api/verify-links` | API | Verificador de links |

---

## HALLAZGOS POR PRIORIDAD

### 🔴 CRÍTICO

**C1. No existe página 404 personalizada**
- Archivo: no existe `pages/404.js`
- Next.js muestra una 404 genérica sin el diseño de la marca
- Impacto: pérdida de usuarios, mala imagen

**C2. No existe página 500 personalizada**
- Archivo: no existe `pages/500.js`
- Next.js muestra un error de servidor genérico
- Impacto: pérdida de confianza en errores de servidor

---

### 🟠 ALTO

**A1. Enlace interno roto: `/productos/zapatillas`**
- Archivo: `pages/blog/[slug].js` línea 354
- El link apunta a `/productos/zapatillas` que NO EXISTE
- La URL correcta es `/productos/zapatillas-trail`
- Impacto: 404 para usuarios que hacen clic en "Ranking zapatillas OCR"

**A2. Enlace interno roto: `/calculadora`**
- Archivo: `pages/index.js` línea 563 (sección home-secondary)
- El link apunta a `/calculadora` que es un stub con noindex
- Debería apuntar a `/calculadora-hyrox`
- Impacto: usuarios llegan a una página vacía desde la home

**A3. Menú blog apunta a "/" en lugar de "/calendario"**
- Archivo: `pages/blog/[slug].js` línea 254 topbar
- `<Link href="/">Calendario</Link>` — etiqueta "Calendario" pero URL "/"
- Impacto: confusión de navegación en artículos del blog

**A4. Imágenes de productos con hotlinks de Bing (tse1.mm.bing.net)**
- Archivo: `lib/rankings.js` — todas las imágenes `img` usan `tse1.mm.bing.net`
- Los thumbnails de Bing son hotlinks que pueden romperse sin aviso
- `_document.js` tiene un preconnect innecesario a Bing
- Impacto: imágenes rotas en rankings de productos (conversión principal)

**A5. Sin redirección www → no-www en next.config.js**
- Archivo: `next.config.js`
- No hay redirección 301 de `hybridracehub.com` → `www.hybridracehub.com`
- Impacto: posible indexación duplicada, pérdida de link equity

**A6. Todos los canonicals y OG usan non-www**
- Todos los `<link rel="canonical">` apuntan a `https://hybridracehub.com/...`
- La URL oficial es `https://www.hybridracehub.com`
- Afecta a: index.js, calendario.js, blog/index.js, blog/[slug].js, productos.js, productos/[categoria].js, plan-entrenamiento.js, calculadora-hyrox.js, centros-entrenamiento.js, comunidad.js, comunidad/[slug].js, contacto-organizadores.js, race-hub.js, calendario/[ciudad].js, sitemap.xml.js

---

### 🟡 MEDIO

**M1. robots.txt Sitemap URL usa non-www**
- Archivo: `public/robots.txt`
- `Sitemap: https://hybridracehub.com/sitemap.xml` → debe ser www

**M2. sitemap.xml.js usa BASE non-www**
- Archivo: `pages/sitemap.xml.js`
- `const BASE = "https://hybridracehub.com"` → debe ser www

**M3. Footer sin aviso de afiliación Amazon ni enlace a centros-entrenamiento**
- Archivo: `lib/shared.js` → `SiteFooter`
- Falta enlace explícito a `/centros-entrenamiento` en la sección de Secciones
- Falta el aviso legal de Amazon en el footer

**M4. comunidad.js y comunidad/[slug].js duplican credenciales Supabase**
- Archivos: `pages/comunidad.js`, `pages/comunidad/[slug].js`
- Definen `SUPABASE_URL` y `ANON_KEY` inline en lugar de importar de `lib/shared.js`
- No es un riesgo de seguridad (son credenciales anon públicas) pero es code smell

**M5. Sin manejo de errores en comunidad.js (Supabase)**
- Archivo: `pages/comunidad.js`
- El `Promise.all` no tiene `.catch()` en el then — si falla muestra pantalla en blanco
- Tiene un `.finally()` pero no maneja el estado de error

**M6. Preconnect innecesario a Bing en _document.js**
- Archivo: `pages/_document.js` línea 14
- `<link rel="preconnect" href="https://tse1.mm.bing.net"/>` — obsoleto una vez eliminados los hotlinks

**M7. Sin carpeta public/products/ para imágenes locales de productos**
- No existe `/public/products/`
- El componente ProductImage (a crear) necesitará esta carpeta

**M8. GTM (GTM-5D5D2CH9) cargado en _document.js ✓**
- Ya está correctamente implementado — BIEN

**M9. Sitemap no incluye slugs de /comunidad**
- Archivo: `pages/sitemap.xml.js`
- Los artículos de Supabase en /comunidad/ no están en el sitemap

---

### 🔵 BAJO

**B1. Fuentes cargadas vía `<link>` tag en cada página**
- Cada página carga las Google Fonts por separado
- Debería usarse `next/font` o cargarse una sola vez en `_document.js`
- Impacto menor en rendimiento (navegador las cachea, pero hay múltiples requests)

**B2. CSS variables redefinidas en `<style>` blocks de múltiples páginas**
- `blog/[slug].js` y `productos/[categoria].js` tienen bloques `<style>` con las mismas variables CSS que `styles/global.css`
- Duplicación innecesaria

**B3. Aggreg ateRating con ratingCount: "1" en schema.org de productos**
- Archivo: `productos/[categoria].js` y `productos.js`
- `"ratingCount": "1"` es ficticio — Google puede penalizar schemas incorrectos

**B4. Schema duplicado en index.js**
- Archivo: `pages/index.js`
- Hay dos scripts Organization y dos WebSite JSON-LD en la home (líneas 303-413)
- El primero usa `@graph`, el segundo no — redundante

**B5. Sin carpeta _data-analisis/**
- No hay datos de Search Console disponibles
- No se puede analizar CTR ni posiciones

---

## ACCIONES MANUALES PABLO

### ACCIÓN MANUAL 0 — 🔴 URGENTE: rotar la clave secreta de Supabase
La clave `service_role` (acceso TOTAL a la base de datos) estaba escrita en el código de un repositorio público de GitHub. Ya se ha quitado del código, pero sigue visible en el historial de git, así que hay que invalidarla:
1. Ve a supabase.com → proyecto `ssyljhtganuaanczxeep` → "Project Settings" → "API Keys".
2. Crea una nueva clave secreta ("Secret key", empieza por `sb_secret_...`) y una "Publishable key" (`sb_publishable_...`).
3. Desactiva las claves antiguas ("Legacy API keys" → "Disable"). OJO: esto también desactiva la anon key antigua que usa la web; antes, sustituye el valor de `ANON_KEY` en `lib/shared.js` y `pages/api/verify-links.js` por la nueva publishable key (o pídemelo).
4. En vercel.com → proyecto → Settings → Environment Variables, añade `SUPABASE_SERVICE_KEY` (la nueva secreta) y `CRON_SECRET` (una cadena larga inventada). Redeploy.
5. En tu PC, para usar los scripts de `scripts/`, define la variable antes: en Git Bash `export SUPABASE_SERVICE_KEY=...`.
6. Revisa en Supabase → Table Editor que las tablas `races` y `sport_centers` no tienen cambios extraños.

### ACCIÓN MANUAL 1 — Añadir dominio apex en Vercel
1. Ve a vercel.com → tu proyecto Hybrid Race Hub
2. Haz clic en "Settings" (arriba del todo)
3. En el menú izquierdo, haz clic en "Domains"
4. Escribe `hybridracehub.com` (sin www) y haz clic en "Add"
5. Vercel te dará las instrucciones DNS para ese dominio

### ACCIÓN MANUAL 2 — Configurar DNS en Cloudflare para dominio apex
1. Ve a dash.cloudflare.com → tu zona hybridracehub.com
2. Entra en "DNS" → "Records"
3. Si tienes un registro A para hybridracehub.com (sin www), cámbialo para que apunte a la IP que te dé Vercel (normalmente 76.76.21.21)
4. Alternativamente, crea un registro CNAME de hybridracehub.com → cname.vercel-dns.com (si Cloudflare lo permite para el apex — algunos planes no lo permiten)
5. El registro www CNAME debe apuntar a cname.vercel-dns.com

### ACCIÓN MANUAL 3 — Enviar sitemap a Google Search Console
1. Ve a search.google.com/search-console
2. Selecciona la propiedad hybridracehub.com
3. En el menú izquierdo haz clic en "Sitemaps"
4. Añade `https://www.hybridracehub.com/sitemap.xml`
5. Haz clic en "Enviar"

### ACCIÓN MANUAL 4 — Añadir imágenes de productos
Una vez creado el componente ProductImage, puedes añadir imágenes reales de los productos:
1. Busca la imagen del producto (JPG o WebP, mínimo 400×400px)
2. Conviértela a WebP (puedes usar squoosh.app)
3. Nómbrala con el slug del producto, por ejemplo:
   - `garmin-forerunner-965.webp`
   - `salomon-speedcross-6-gtx.webp`
   - `polar-vantage-v3.webp`
4. Súbela a la carpeta `/public/products/` del proyecto
5. El componente ProductImage la mostrará automáticamente

Los slugs de cada producto están definidos en `lib/rankings.js` en el campo `asin` — usa el nombre del producto en minúsculas con guiones.

---

## IDEAS DE CONTENIDO (sin datos de Search Console)
- **Guía: "Cómo preparar tu primera HYROX en 8 semanas"** → `/blog/preparar-primera-hyrox-8-semanas`
- **Comparativa: "OCR vs HYROX: ¿cuál es para ti?"** → ya existe `/blog/hyrox-vs-ocr-diferencias`
- **Guía: "Los mejores eventos OCR de primavera 2026 en España"** → `/blog/mejores-ocr-primavera-espana-2026`
- **Rankings: "Mejor ropa técnica OCR 2026"** → `/productos/ropa` (ya existe, reforzar)
- **Guía: "Qué comer antes de una carrera HYROX"** → `/blog/nutricion-hyrox-dia-carrera`
- **Directorio: "Mejores boxes CrossFit con equipamiento HYROX en Madrid"** → `/calendario/madrid`

---

## GTM — CÓMO CREAR ACTIVADORES EN GA4

### Evento: clic en enlace Amazon (amazon_click)
1. En GTM, ve a "Activadores" → "Nuevo"
2. Tipo: "Clic — solo enlaces"
3. Condición: "URL del clic" contiene "amazon.es"
4. Nombre: "Clic Amazon"
5. En GA4 Event Tag: evento = "amazon_click", parámetros: product_name = {{Click Text}}, page_url = {{Page URL}}

### Evento: uso del buscador (search)
1. El evento se dispara via dataLayer.push desde el código
2. En GTM ve a "Activadores" → "Nuevo" → Tipo: "Evento personalizado"
3. Nombre del evento: "search"
4. En GA4 Event Tag: parámetros: search_term = {{DLV - search_term}}

### Evento: filtros del calendario (calendar_filter)
1. Mismo proceso que "search" pero con nombre de evento: "calendar_filter"
2. Parámetros: filter_type + filter_value

### Evento: clic web organizador (organizer_click)
1. Activador de "Clic — solo enlaces" donde URL del clic NO contiene "hybridracehub.com" y la página contiene "/calendario"
2. Parámetros: race_name, url

---

*Nota: Esta auditoría se realizó sin datos de Search Console. Repetir esta fase con datos reales de Google Search Console para identificar las páginas con más impresiones y CTR bajo.*

---

## REGISTRO DE PROGRESO

> Nota: el prompt original de la auditoría no estaba disponible al retomar la sesión (2026-10-13). Las fases 2+ se han reconstruido a partir de los hallazgos de este documento.

### Fase 1 — Fallos técnicos ✅ (commits a8b1d00, 175d394)
C1, C2, A1, A2, A3, A5, A6, M1, M2, M6, M7 resueltos.

### Fase 2 — SEO on-page, schema y afiliación ✅
- A4: eliminados los hotlinks de Bing (`img: null`). Las fichas muestran un placeholder con icono hasta que haya imagen local.
- `ProductImage` ya no pide a ciegas `/products/<asin>.webp` (evita un 404 por producto). Ahora `getStaticProps` comprueba en build si existe `/public/products/<nombre-en-slug>.webp` o `<asin>.webp`.
- B3: eliminado `aggregateRating` con `ratingCount: "1"` ficticio (productos.js y productos/[categoria].js).
- B4: eliminado el JSON-LD duplicado de Organization/WebSite en la home (se mantiene el `@graph`).
- M3: footer con enlaces a Centros, Plan de entreno y Calculadora + aviso de afiliado de Amazon (una sola vez).
- M9: el sitemap incluye ahora los artículos de /comunidad (consulta a Supabase con fallback si falla).
- Decisión: los BOM UTF-8 de varios ficheros de `pages/` no se tocan (inofensivos; evitar diffs masivos).

### Fase 3 — Seguridad y robustez ✅
- 🔴 NUEVO (crítico): clave `service_role` de Supabase hardcodeada en 7 ficheros de un repo público. Sustituida por `process.env.SUPABASE_SERVICE_KEY`. Requiere rotación manual (ver ACCIÓN MANUAL 0).
- 🔴 NUEVO: `/api/fix-formats` permitía a cualquiera modificar la tabla `races` sin autenticación. Eliminado (era un script de un solo uso).
- `/api/verify-links` exige ahora `Authorization: Bearer $CRON_SECRET` (compatible con Vercel Cron).
- `.env.example` documenta `CRON_SECRET` y `RESEND_API_KEY`.
- SEO/robustez: `/comunidad/[slug]` pasa de render en cliente ("Cargando..." para Google) a ISR (`getStaticProps` + `fallback: "blocking"`, revalidate 1 h). Slug codificado en la consulta. 404 real si no existe.
- XSS: `parseMarkdown` escapa el HTML antes de convertir (la tabla `articles` está vacía, no rompe contenido).
- M4: `comunidad.js` y `comunidad/[slug].js` importan las credenciales de `lib/shared.js`.
- M5: `comunidad.js` muestra un mensaje de error si Supabase falla en lugar de quedarse vacío.
- Decisión: no se reescribe el historial de git (force-push arriesgado y no elimina copias ya clonadas). La solución real es rotar la clave.

### Fase 4 — Rendimiento ✅
- B1: Google Fonts se cargan una sola vez desde `_document.js` (una hoja con todos los pesos). Eliminados 16 `<link>` de fuentes y 4 preconnects duplicados en las páginas. El navegador solo descarga los pesos que realmente se usan.
- Eliminado el dominio de Bing de `images.remotePatterns` (ya no se usa).
- B2 (variables CSS duplicadas en `<style>` de páginas): NO se toca. Cada página define tokens ligeramente distintos y unificarlos podría cambiar el aspecto visual; beneficio de rendimiento mínimo. Pendiente para un refactor de estilos.
- Nota: `next lint` no funciona (incompatibilidad de versión de ESLint con `.eslintrc.json`). El build compila sin errores. Pendiente: migrar a `eslint.config.js` o fijar ESLint 8.

### Fase 5 — Analítica (GTM / dataLayer) ✅
- Nuevo helper `track(event, params)` en `lib/shared.js` que hace `dataLayer.push`.
- `/calendario`: evento `search` (`search_term`, debounce 1 s, mín. 2 caracteres) y `calendar_filter` (`filter_type` = tipo | subtipo | ccaa | fechas, `filter_value`) solo al activar un filtro.
- Ficha de carrera (modal, todas las páginas): evento `organizer_click` (`race_name`, `url`) al pulsar "IR A INSCRIPCIÓN".
- `amazon_click` se mide con un activador de clic de GTM (sin código), como indica la sección de GTM.
- Pendiente manual: crear en GTM las variables de capa de datos (`search_term`, `filter_type`, `filter_value`, `race_name`, `url`) y los activadores descritos arriba. Para `organizer_click` usar ahora "Evento personalizado" en lugar del activador de clic.

### Fase 6 — Contenido
- Sin datos de Search Console no se crean artículos nuevos (decisión: evitar contenido sin validar). Las ideas siguen en "IDEAS DE CONTENIDO".

## PENDIENTES TRAS LA AUDITORÍA
1. 🔴 ACCIÓN MANUAL 0 (rotar clave Supabase) — lo más urgente.
2. Acciones manuales 1–4 (dominio apex, DNS, sitemap en Search Console, imágenes de producto).
3. Arreglar `next lint` (configuración de ESLint).
4. B2: unificar variables CSS en `styles/global.css`.
5. Repetir el análisis de contenido con datos reales de Search Console.
