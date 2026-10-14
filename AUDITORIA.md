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
- (Corregido 2026-10-14) El dominio oficial es `hybridracehub.com` sin www; no debe haber redirección hacia www
- Impacto: posible indexación duplicada, pérdida de link equity

**A6. Todos los canonicals y OG usan non-www**
- Todos los `<link rel="canonical">` apuntan a `https://hybridracehub.com/...`
- La URL oficial es `https://hybridracehub.com` (sin www)
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

### ACCIÓN MANUAL PRIORITARIA — Dominio oficial: https://hybridracehub.com (sin www)
El dominio oficial es **https://hybridracehub.com** (sin www): es el que está configurado y validado en Vercel y el que Google tiene indexado. `www.hybridracehub.com` no está configurado y **el código no contiene ninguna redirección de dominio** (ni en `next.config.js` ni en middleware). Todas las URLs absolutas salen de `SITE_URL` en `lib/site.js`.

Opcional, si algún día quieres que www también funcione (sin cambiar el dominio oficial):
1. Cloudflare → DNS → Records → Add record: `CNAME`, nombre `www`, destino `cname.vercel-dns.com`, nube gris (DNS only).
2. Vercel → Settings → Domains → Add `www.hybridracehub.com` y elige **"Redirect to hybridracehub.com" (308/301)**. La redirección la hace Vercel, no el código.
3. Comprueba con `nslookup www.hybridracehub.com` que devuelve una IP y que https://www.hybridracehub.com acaba en https://hybridracehub.com.

Search Console: la propiedad y el sitemap son `https://hybridracehub.com/sitemap.xml`.

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
4. Añade `https://hybridracehub.com/sitemap.xml`
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

## INCIDENCIA 2026-10-13 — web caída (DNS_PROBE_FINISHED_NXDOMAIN)
- Causa: la redirección hybridracehub.com → www (fase 1) enviaba todo a `www.hybridracehub.com`, que NO tiene registro DNS en Cloudflare.
- Arreglo: eliminada la redirección (commit 564705c) y canonicals/sitemap/robots/schema pasados a `https://hybridracehub.com` (commit 4eb7bb1). Verificado en producción: todas las páginas 200, 404 correcto.
- El dominio oficial queda sin www. Si se configura www en el futuro, que sea Vercel quien redirija www → sin www (nunca al revés y nunca desde el código).

---

## REDISEÑO VISUAL (2026-10-14)

Objetivo: que la web parezca hecha a mano por un equipo y no generada por IA. Sin cambios de URLs, rutas, datos, enlaces de Amazon (tag `hybridracehub-21`), titles, meta descriptions, H1, JSON-LD, sitemap ni cuerpo de los artículos.

### Cómo cambiar el color de marca
Edita **solo** `--accent` y `--accent-hover` en `styles/global.css` (bloque `:root`, arriba del todo). Todo lo demás lee esas variables. Si cambias el acento, revisa también `public/logo-icon.svg`, `public/favicon.svg`, `public/favicon.ico` y `public/og-image.svg` (los SVG/ICO no pueden leer variables CSS).

### Qué ha cambiado
1. **Cursor**: eliminado el cursor naranja personalizado (SVG en CSS). Cursor del sistema; `pointer` solo en enlaces, botones y selects.
2. **Color**: paleta centralizada en `:root` (`--bg #0B0B0C`, `--surface #141416`, `--border #26262A`, `--text #F2F2F0`, `--text-muted #9A9A9E`, `--accent #E10600`, `--accent-hover #CB0500`). Eliminadas las 13 redefiniciones de `:root` que había en las páginas. Todos los naranjas, amarillos, verdes, azules y morados decorativos pasan a blanco/grises. El rojo solo aparece en: botones "Ver precio en Amazon" y "Inscribirme", subrayado del menú activo, punto de carreras en los próximos 14 días, el nº 01 de cada ranking y el logo. Verde/rojo de estado solo en mensajes de formulario.
3. **Rasgos de IA eliminados**: glows y sombras de color, degradados (salvo un degradado negro sobre la foto del hero), elevación/scale en hover, animación de aparición de tarjetas, emojis como iconos (calculadora, enlaces, estados vacíos), iconos en cajas de color en rejillas iguales, cinta girada de "Destacada". Radios: 4px en tarjetas y botones, 2px en etiquetas. Transiciones solo de color, 150 ms.
4. **Look editorial**: escala tipográfica 48/32/22/17/14, Barlow Condensed solo en titulares, Inter para el texto (16–17px, interlineado 1.6, máx. 70 caracteres). Etiquetas pequeñas en mayúsculas sobre los titulares (`CALENDARIO · ESPAÑA 2026`, `RANKING · 2026 · …`). Home con ritmo variado: hero con foto, "Cómo funciona" como lista numerada a tres columnas, banda de foto a ancho completo, bloques foto+texto e índice del hub en filas (sustituye a las dos rejillas de tarjetas con iconos; los enlaces y textos se conservan en el índice). Rankings tipo revista: número grande 01–06, filas separadas por 1px, tabla comparativa limpia, "A favor / En contra" en dos columnas. Estilos de ranking compartidos en `global.css`. Logo "H" blanco con barra roja; favicon, `theme-color` y manifest regenerados.
5. **Microcopy**: botones con verbos claros ("Ver carreras", "Crear plan", "Ver precio en Amazon", "Inscribirme"), subtítulos y estados vacíos reescritos en tono de atleta, sin "descubre", "todo lo que necesitas", exclamaciones ni guiones largos en la interfaz.
6. **Revisión**: home, ranking, artículo, calendario y 404 revisados a 375px y 1440px (sin scroll horizontal; la tabla comparativa hace scroll dentro de su caja en móvil). Lighthouse en la home (local, build de producción), antes → después:
   - Móvil: Rendimiento 100 → 100 · Accesibilidad 95 → 100.
   - Escritorio: Rendimiento 100 → 100 · Accesibilidad 95 → 100.
   - Para no empeorar el LCP, la foto del hero se sirve en local (`public/hero-home.webp`, 140 KB, precargada) y en móvil el hero va sin foto.

### Decisiones tomadas sin consultar
- Las imágenes dentro de los artículos conservan su `border-radius` inline; se limitan a 4px por CSS para no tocar `lib/posts.js`.
- Los colores por tipo de sesión del plan de entrenamiento y por tipo de centro pasan a grises (se distinguen por la etiqueta de texto).
- Reglas CSS de componentes que ya no existen (journey, home-secondary, home-sections…) eliminadas de `global.css`.


---

## PLAN DE TRÁFICO ORGÁNICO — "CARRERAS HÍBRIDAS" (2026-10-14)

### Fase 6 — Medición: eventos dataLayer (verificados en navegador)
| Evento | Cuándo se envía | Parámetros |
|---|---|---|
| `amazon_click` | Clic en cualquier enlace de Amazon (rankings, artículos, comunidad) | `product_name`, `link_url`, `page_path` |
| `search` | Búsqueda en el calendario (1 s tras dejar de escribir, mín. 2 letras) | `search_term` |
| `calendar_filter` | Al activar un filtro del calendario (chips o panel) | `filter_type` (tipo, subtipo, ccaa, fechas, mes), `filter_value` |
| `organizer_click` | Clic en "Web oficial" / "Inscribirme" | `race_name`, `url` |
| `ics_download` | Clic en "Añadir a mi calendario" | `race_name`, `race_date` |
| `whatsapp_share` | Clic en "Compartir por WhatsApp" | `race_name`, `race_date` |
| `city_page_view` | Al abrir una página /carreras-hibridas/<ciudad> | `city_name`, `city_slug`, `races_count` |

#### Cómo verlos en GA4 (5 pasos)
1. **GTM → Variables → Nueva → "Variable de capa de datos"**: crea una por parámetro (`product_name`, `search_term`, `filter_type`, `filter_value`, `race_name`, `race_date`, `url`, `city_name`). Nómbralas `DLV - product_name`, etc.
2. **GTM → Activadores → Nuevo → "Evento personalizado"**: uno por evento, con el nombre exacto (`amazon_click`, `search`, `calendar_filter`, `organizer_click`, `ics_download`, `whatsapp_share`, `city_page_view`). Si tenías el activador antiguo de "Clic — solo enlaces" para Amazon u organizadores, bórralo para no contar dos veces.
3. **GTM → Etiquetas → Nueva → "Evento de Google Analytics: GA4"**: tu ID de medición, nombre del evento = `{{Event}}`, y en "Parámetros del evento" añade cada parámetro con su variable. Activador: los 7 eventos personalizados. **Enviar → Publicar**.
4. **GA4 → Administrar → Definiciones personalizadas → Crear dimensión personalizada** (ámbito "Evento") para `city_name`, `product_name`, `race_name`, `search_term` y `filter_value`. Marca `amazon_click`, `organizer_click` e `ics_download` como **eventos clave** en Administrar → Eventos.
5. **GA4 → Informes → Interacción → Eventos** (datos en 24-48 h) o **Explorar → Exploración libre**: filas = Nombre del evento y la dimensión (p. ej. `city_name`), métrica = Recuento de eventos. Para verlo en directo mientras pruebas: GA4 → Administrar → **DebugView** con la extensión Tag Assistant activa.

### Fase 7 — Informe

#### Qué se ha hecho
- **Dominio único**: el dominio oficial es **https://hybridracehub.com (sin www)**. Todas las URLs absolutas (canonical, og:url, JSON-LD, sitemap, robots) salen de `SITE_URL` en `lib/site.js`. No hay redirecciones de dominio en el código (la de www → sin www, si se configura, es del panel de Vercel). Las únicas redirecciones son de ruta: `/calendario/<ciudad>` → `/carreras-hibridas/<ciudad>` (permanentes).
- **Home**: renderizada en servidor (ISR cada hora). Title `Carreras híbridas en España <temporada>: calendario Hyrox y OCR` con la temporada calculada (hoy 2026-2027), meta description nueva, H1 único "Carreras híbridas en España 2026-2027", "hybrid races" en el primer párrafo, bloque de las 6 próximas carreras reales de Supabase, accesos por ciudad y enlaces a la guía y a los rankings.
- **Guía pilar** `/que-es-una-carrera-hibrida` (~1.700 palabras de texto + calendario dinámico): respuesta directa en la primera frase, tipos (HYROX, OCR, Spartan, DEKA y las modalidades que haya en la base de datos), tabla de las 8 estaciones HYROX, tabla comparativa HYROX vs OCR vs Spartan, categorías, preparación, material (enlaces a rankings), próximas carreras (dinámico), FAQ de 8 preguntas con FAQPage, "Última actualización" visible y `dateModified` en el schema Article. La pregunta de precios se genera solo con precios publicados en la base de datos; no hay ninguna de HYROX porque no tienen precio en la tabla.
- **Enlazado a la guía**: home, pie de página, todos los artículos (bloque al final) y todos los rankings.
- **Páginas por ciudad/comunidad** `/carreras-hibridas/<slug>` (15): getStaticProps + ISR diario, intro propia por ciudad (se reutilizan los textos de las antiguas páginas /calendario/<ciudad> y hay textos nuevos para Valladolid, Asturias y las comunidades), carreras reales con fecha, modalidad, precio y enlace, centros del directorio por código postal, FAQ local con FAQPage, schema SportsEvent por carrera y BreadcrumbList, ciudades cercanas y enlace a la guía. **Si no hay carreras futuras: `noindex, follow`, se muestran las carreras de las zonas cercanas y no entra en el sitemap.**
- **Móvil**: fuentes con `next/font` (autoalojadas, sin saltos de diseño), GTM con `afterInteractive`, calendario con el HTML ya relleno (antes Google lo veía vacío), H1 visible, buscador siempre a mano y chips con scroll horizontal (modalidad, mes, comunidad) fijos arriba en móvil, objetivos táctiles de 44 px, texto base de 16 px. Cada carrera tiene **"Añadir a mi calendario"** (.ics con aviso una semana antes) y **"Compartir por WhatsApp"** (texto + URL). `manifest.json` con iconos PNG 192/512/maskable y theme-color: la web se puede instalar como app. Nueva imagen social `og-image.png` (WhatsApp y las redes no muestran SVG).
- **Buscadores con IA**: `robots.txt` dinámico que permite Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot y Applebot, bloquea solo /api y páginas internas e incluye la línea Sitemap. Rankings con "Respuesta rápida" arriba (H2 en forma de pregunta + top 3 en lista) y "Última revisión" visible; artículos con "Última actualización" visible y `dateModified`. Página **/sobre-nosotros** (E-E-A-T) enlazada desde el pie, con marcadores `[COMPLETAR PABLO: …]`. Schema Organization con logo, email y sameAs de Instagram.
- **Enlaces oficiales de carreras**: 76 carreras de la base de datos apuntaban a la portada de carrerasocr.com (un agregador, no el organizador). La web ya no muestra esos enlaces como oficiales (`lib/race-links.js`). Webs oficiales verificadas y aplicadas: Gladius Race Santacara → gladiusrace.com, Bestial Race Arucas → bestialrace.com, Desafío Costa Blanca → desafiocostablanca.com. Sin web oficial verificable: Monster Race (Sant Miquel de Campmajor), OCR Mencey Los Realejos y Gollizno Race Olivares; aparecen como "Sin web oficial".
- **Enlaces de Amazon**: todos con `tag=hybridracehub-21` y `rel="sponsored nofollow noopener"` (también los 22 de dentro de los artículos y los productos de /comunidad).
- **Nota**: la tabla `sport_centers` no existe en Supabase; los centros salen de `lib/centros-entrenamiento.json` (468 centros), que es lo que ya usaba la web.

#### Páginas nuevas
| URL | Estado |
|---|---|
| https://hybridracehub.com/que-es-una-carrera-hibrida | Indexable |
| https://hybridracehub.com/sobre-nosotros | Indexable (completar datos personales) |
| https://hybridracehub.com/carreras-hibridas/madrid | Indexable |
| https://hybridracehub.com/carreras-hibridas/barcelona | Indexable |
| https://hybridracehub.com/carreras-hibridas/valencia | Indexable |
| https://hybridracehub.com/carreras-hibridas/sevilla | Indexable |
| https://hybridracehub.com/carreras-hibridas/malaga | Indexable |
| https://hybridracehub.com/carreras-hibridas/andalucia | Indexable |
| https://hybridracehub.com/carreras-hibridas/cataluna | Indexable |
| https://hybridracehub.com/carreras-hibridas/comunidad-valenciana | Indexable |
| https://hybridracehub.com/carreras-hibridas/canarias | Indexable |
| https://hybridracehub.com/carreras-hibridas/baleares | Indexable |
| /carreras-hibridas/bilbao, /zaragoza, /valladolid, /asturias, /murcia | noindex hasta que haya carreras (pasan solas a indexables y al sitemap con el ISR diario) |
| /calendario/<ciudad> (8 URLs antiguas) | Redirección permanente a /carreras-hibridas/<ciudad> |

#### Lighthouse móvil (`--preset=perf --form-factor=mobile`, build de producción en local, mejor de 2 pasadas)
| Página | Antes (tras fase 3) | Después (fase 4) |
|---|---|---|
| Home `/` | 77 · LCP 2,2 s · CLS 0,266 · TBT 280 ms | **95** · LCP 2,3 s · CLS 0,005 · TBT 100 ms |
| Guía `/que-es-una-carrera-hibrida` | 77 · LCP 2,2 s · CLS 0,185 · TBT 440 ms | **93** · LCP 2,3 s · CLS 0 · TBT 180 ms |
| Ciudad `/carreras-hibridas/madrid` | 93 · LCP 2,1 s · CLS 0,011 · TBT 230 ms | **96** · LCP 2,2 s · CLS 0,003 · TBT 100 ms |
| Ranking `/productos/zapatillas-hyrox` | 95 · LCP 2,0 s · CLS 0,066 · TBT 170 ms | **97** · LCP 2,1 s · CLS 0,041 · TBT 60 ms |

Objetivos: LCP < 2,5 s ✅ · CLS < 0,1 ✅ · INP < 200 ms: no se mide en laboratorio; el TBT (su indicador de laboratorio) está entre 60 y 180 ms. Revisa el INP real en Search Console → Métricas web principales dentro de 28 días.

#### ACCIONES MANUAL PABLO (por orden de prioridad)
1. **Search Console**: envía de nuevo `https://hybridracehub.com/sitemap.xml` (Sitemaps → Añadir) y pide la indexación de `/`, `/que-es-una-carrera-hibrida` y `/carreras-hibridas/madrid` con "Inspección de URLs → Solicitar indexación".
2. **Supabase → SQL Editor**: ejecuta `scripts/fix-race-urls.sql` para dejar corregidos en la base de datos los enlaces de carrerasocr.com (pone las 3 webs oficiales verificadas y vacía el resto). Luego busca la web oficial de Monster Race, OCR Mencey Los Realejos y Gollizno Race (no encontré ediciones 2026 confirmadas de las dos últimas: revisa si siguen en pie) y actualízalas.
3. **Completa /sobre-nosotros**: busca `[COMPLETAR PABLO` en `pages/sobre-nosotros.js` y escribe tus datos reales (nombre, pruebas que has hecho, material que usas). Es lo que más pesa para E-E-A-T.
4. **GTM/GA4**: configura los 7 eventos siguiendo los 5 pasos de la fase 6.
5. **Rotar la clave de Supabase** (ACCIÓN MANUAL 0, sigue pendiente si no lo hiciste).
6. **Carreras sin precio**: las HYROX de la tabla no tienen `precio`; si lo añades, aparecerá en las fichas, en el schema Event y en la FAQ de precios de la guía.
7. **Opcional**: configura www en Vercel como redirección a hybridracehub.com (ver "ACCIÓN MANUAL PRIORITARIA — Dominio oficial").

#### 10 ideas de contenido, por potencial de tráfico
1. **"HYROX Madrid 2026-2027: fechas, sede, categorías y cómo prepararla"**: la ciudad que ya trae clics + la marca más buscada. URL sugerida `/blog/hyrox-madrid`.
2. **"Carreras de obstáculos para principiantes en España"**: qué distancias elegir, la lista de pruebas cortas del calendario y un plan de 8 semanas.
3. **"HYROX Barcelona y HYROX Valencia: guía de la sede"** (dos artículos): accesos, tandas y dónde entrenar cerca (cruzando con el directorio de centros).
4. **"Cómo entrenar para HYROX: plan de 12 semanas"**: guía larga con tablas por semana y enlace al generador de planes.
5. **"Tiempos medios en HYROX por categoría"**: tabla de referencias y enlace a la calculadora (muy citable por buscadores con IA).
6. **"Spartan Race en España: Sprint, Super y Beast explicados"**: distancias, obstáculos, penalizaciones y próximas fechas Spartan del calendario.
7. **"DEKA FIT vs HYROX: diferencias y cuál elegir"**: comparativa con tabla; ahora mismo hay 3 DEKA en el calendario.
8. **"Carreras híbridas en Andalucía: temporada otoño-primavera"**: refuerza la página de comunidad (Sevilla, Málaga, Granada, Jaén).
9. **"Zapatillas para HYROX vs zapatillas para OCR: cuál necesitas"**: artículo puente entre los dos rankings con más intención de compra.
10. **"Qué llevar a tu primera carrera de obstáculos: checklist"**: lista imprimible con enlaces a ropa y zapatillas de trail.

---

## REGLA PERMANENTE: QA de layout responsive

**Antes de cualquier push que toque UI, ejecutar `npm run qa:layout` y debe dar 0 fallos.**

- Script: `scripts/qa-layout.mjs` (Playwright). Hace el build, arranca `next start` en :3100 y recorre 14 rutas: home, calendario, centros, calculadoras, blog y un artículo, rankings y un ranking, Madrid, guía, sobre nosotros, plan y 404.
- Anchos: 360, 390, 768, 1024, 1280, 1440 y 1920 px.
- Falla si `scrollWidth` supera el viewport o si algún elemento visible se sale por la derecha. No cuenta los contenedores con `overflow-x: auto`.
- Capturas en `qa-screenshots/` (ignorado en git).
- Opciones: `-- --no-build`, `-- --no-shots` o `-- https://hybridracehub.com` para revisar producción.
- Si el Chromium de Playwright no está instalado, usa el Chrome del sistema. El 14-10-2026 la instalación falló por falta de espacio en C:.

### Incidente 14-10-2026: el calendario se cortaba a 1920 px

- **Causa:** `.body` usaba `grid-template-columns: 300px 1fr`. Con `1fr` (= `minmax(auto, 1fr)`), la columna principal no podía encoger por debajo del ancho mínimo de su contenido. La fila de chips (`nowrap`) la ensanchaba hasta 2.100 px y `overflow-x: hidden` en `html`/`body` lo ocultaba, cortando la 4ª columna, el buscador y los chips.
- **QA antes:** 10 fallos. `/calendario` en los 7 anchos; `/centros-entrenamiento` a 360 y 390 px por el menú propio; home y calendario a 768 px porque el menú no cabía.
- **Arreglo:**
  - `minmax(0, 1fr)` y `min-width: 0` en los hijos del grid.
  - Se quita `overflow-x: hidden` de `html`/`body`.
  - Tarjetas en `auto-fill minmax(280px, 1fr)`: 2 columnas en tablet y 1 en móvil.
  - Arriba del calendario solo quedan el buscador y el selector de año. Modalidad, meses y comunidades pasan al panel.
  - Panel sticky en escritorio. Por debajo de 1024 px se abre desde abajo a pantalla completa, con "Aplicar" y "Limpiar" y el botón "Filtros (n)".
  - Menú hamburguesa por debajo de 1024 px, también en las 6 páginas que tenían menú propio.
  - Lugar de la tarjeta en 2 líneas; el nombre nunca se corta.
- **QA después:** 0 fallos en las 98 combinaciones.
