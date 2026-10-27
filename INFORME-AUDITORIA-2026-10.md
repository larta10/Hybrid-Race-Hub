# Informe de auditoría SEO/SEM — hybridracehub.com (27/10/2026)

## 1. Resumen en 10 líneas

1. La web funcionaba bien en lo básico: ningún enlace interno roto, ninguna imagen rota y los enlaces de Amazon bien etiquetados.
2. Se arreglaron 31 enlaces externos rotos del directorio de centros (webs que ya no existen o con certificado caducado).
3. En móvil, que es el 76 % de tus visitas, se agrandaron botones y textos que eran demasiado pequeños para el dedo o para leer.
4. Casi todas las páginas tenían títulos demasiado largos para Google y descripciones fuera de medida: ahora las 90 URLs del sitemap cumplen.
5. La home y la guía "qué es una carrera híbrida" hablan ahora de "hybrid race", la búsqueda con más impresiones, y tienen preguntas frecuentes visibles.
6. Nuevas páginas: Galicia (con el Hybrid Day y el DEKA de Vigo), Cantabria, Castilla-La Mancha y 31 páginas de "Dónde entrenar HYROX en [ciudad]".
7. Dos artículos nuevos: "HYROX vs carrera híbrida" y "Calendario HYROX España 2026-2027" (el de Hybrid Day 2027 no se pudo hacer: aún no hay sedes publicadas).
8. La página de centros cargaba casi 500 fichas de golpe y pedía tu ubicación nada más entrar; ahora carga mucho menos y solo pide ubicación si pulsas el botón.
9. La web ya avisa a Google Tag Manager de los clics a Amazon, a inscripciones, de las búsquedas y de los formularios; falta que configures GTM siguiendo la guía.
10. Tienes listo un plan de Google Ads (CSV para importar, campañas en pausa) y otro de Meta, pero no conviene gastar hasta medir y poner un banner de cookies.

---

## 2. Problemas encontrados → corregidos

| Área | Problema | Corrección |
|---|---|---|
| Enlaces | 12 webs de centros sin DNS (crossfitgracia.com, functrack.barcelona, hydroxlab.es, wodandfit.es, sanasfitness.com, crossfitironmadrid.com, box32.es, roxzone-og.es, funcionalzaragoza.es, foctrainingcenter.com…) | Enlace quitado del JSON de centros (la ficha sigue, con botón "Buscar") |
| Enlaces | 16 centros Basic-Fit apuntaban a una URL 404 | Cambiada a basic-fit.com/es-es/gimnasios |
| Enlaces | "Spartan SGX Madrid" enlazaba a una página 404 de spartan.com | Enlace quitado |
| Enlaces | crossfitbilbao.com (certificado de otro dominio) y aftxbox.com (error TLS): el navegador muestra aviso de seguridad | Enlace quitado |
| Imágenes | 3 fotos de la home con `<img>` sin dimensiones (CLS) y de 572 KB y 303 KB | Pasadas a next/image con `sizes`; la más grande, a calidad 65 (< 300 KB) |
| Imágenes | La foto de la banda de la home decía "empujando sleds" y es una fila de SkiErg | Alt y pie de foto corregidos |
| Imágenes | `remotePatterns` permitía images.weserv.nl y m.media-amazon.com (no se usan) | Eliminados |
| Móvil | Enlaces del pie de 14 px de alto, chips de filtros de 22 px, botón de calendario de 26 px, migas pequeñas | Mínimo de 44 px de zona táctil en móvil |
| Móvil | Textos de 8-10 px en el directorio de centros y el pie | Subidos a 11-12 px (etiquetas) y 16 px en el buscador (evita el zoom de iOS) |
| Móvil | 20 chips de comunidades ocupaban media pantalla antes de los resultados | Fila deslizable en horizontal |
| CWV | /centros-entrenamiento renderizaba 468 fichas (8.162 nodos DOM, TBT 1.270 ms) | 6 por comunidad + botón "Ver los N centros" |
| UX/CWV | /centros-entrenamiento pedía la geolocalización al cargar | Solo al pulsar "Ordenar por cercanía" (y muestra los 9 más cercanos) |
| CWV | Componente gtag.js paralelo a GTM (se activaba con una variable de entorno) | Eliminado: solo GTM |
| SEO | 54 de 57 URLs con incidencias (titles de hasta 101 caracteres, descriptions de 105 a 221) | 0 incidencias en las 90 URLs del sitemap |
| SEO | FAQ de la home oculta (la respuesta no estaba en el HTML hasta hacer clic) con FAQPage schema | FAQ con `<details>` (texto en el HTML) y el schema generado desde los mismos textos |
| SEO | Event schema con organizador inventado a partir del nombre de la carrera | Quitado (Supabase no tiene ese dato). `addressRegion` con fallback a la comunidad |
| SEO | Sin BreadcrumbList en calendario, plan, calculadora, programas, comunidad, productos, organizadores y centros | Añadido (y migas visibles en centros, calendario, productos y calculadora) |
| SEO | Sin twitter:card u og:image en plan, programas, comunidad y sobre nosotros | Añadidos |
| SEO | lastmod del sitemap = fecha de hoy en todas las URLs | lastmod real: `updated_at` de Supabase para home/calendario/regiones y fecha de cambio para el resto |
| Enlazado | La home solo enlazaba 10 regiones con el nombre a secas | Todas las regiones con anchor "Carreras híbridas en X" |
| Enlazado | Posts sin enlaces fijos a calendario/regiones/rankings | Bloque al final de cada post: calendario + Madrid, Cataluña, Andalucía + ranking del tema |
| 404 | Sin enlaces a regiones | Añadidas 8 regiones |
| Lint | `npm run lint` no existía y `next lint` no funciona con ESLint 9 | `eslint.config.mjs` + script `lint`: 0 errores |

Herramientas nuevas en `scripts/`: `audit-links.mjs` (crawler), `audit-seo.mjs` (metas y schema), `audit-mobile.mjs` (capturas y comprobaciones móviles), `check-tracking.mjs` (eventos de medición) y `sem-build-csv.mjs` (CSV de Google Ads).

---

## 3. URLs externas rotas pendientes (datos de Supabase, no se han tocado)

| Carrera (tabla races) | URL | Error | Qué hacer |
|---|---|---|---|
| Farinato Hybrid Race Madrid (otoño), 14/11/2026 | https://farinatorace.es | La conexión se corta (HTTPS) y HTTP devuelve 503 | Comprobar si la web del organizador ha cambiado y actualizar `url` en Supabase |

Otras dos que dan error a los robots pero parecen funcionar en navegador (no se tocan): `underground.wodbuster.com` (400 a peticiones sin sesión) y `activaclub.es` (certificado intermedio, abre bien en Windows).

Recordatorio: muchas carreras de Supabase apuntan a la portada de carrerasocr.com (agregador). La web ya no las muestra como "web oficial", pero conviene buscar la web real del organizador.

---

## 4. Estado de las imágenes de producto de Amazon

- 49 productos en `data/products.js`, **0 con imagen** (`imagenLocal: null` en todos).
- En su lugar se ve un **recuadro gris con el icono de la categoría y el nombre del producto** (componente `ProductImage`). No rompe el layout ni en 360 px.
- No se ha intentado resolver (ni hotlink ni proxy), como pediste. La vía limpia sería subir fotos propias a `public/products/` o usar la API de Product Advertising cuando tengas acceso.

---

## 5. Lighthouse móvil (producción)

| Página | Antes (27/10, mañana) | Después (27/10, tras el despliegue) |
|---|---|---|
| Home | Rendimiento 76 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · LCP 4,5 s · TBT 310 ms · CLS 0 | Rendimiento 73 y 84 en dos pasadas · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · LCP 4,4 s · TBT 430 ms / 40 ms · CLS 0 / 0,021 |
| /centros-entrenamiento | Rendimiento 71 · Accesibilidad 100 · Buenas prácticas 93 · SEO 100 · LCP 2,8 s · TBT 1.270 ms · CLS 0 · 8.162 nodos DOM | Rendimiento 82 y 84 · Accesibilidad 100 · Buenas prácticas 96 · SEO 100 · LCP 3,8 s / 3,7 s · TBT 290 ms / 240 ms · CLS 0 · 2.295 nodos DOM |

Lighthouse varía bastante entre ejecuciones (red y CPU simuladas), por eso hay dos pasadas en "después".

- **Centros**: el bloqueo del hilo principal (TBT) baja de 1.270 ms a 240-290 ms y el DOM de 8.162 a 2.295 nodos; buenas prácticas sube de 93 a 96 (ya no pide la ubicación al entrar). El **LCP empeora de 2,8 s a 3,7-3,8 s**, probablemente porque el bloque nuevo "Centros por ciudad" queda por encima del listado. Si en Search Console el LCP móvil de esta página pasa a "Necesita mejorar", la solución es moverlo debajo de las primeras fichas.
- **Home**: el LCP sigue en ~4,4 s. Lighthouse no identificó el elemento LCP en estas pasadas; lo que más JS sin usar aporta es GTM (~78 KB). Mejorarlo de verdad pasaría por cargar GTM con `lazyOnload`, a costa de perder algunas visitas rápidas en la analítica: no lo he cambiado.

---

## 6. Páginas nuevas

**Regiones** (misma plantilla, solo comunidades con ≥1 carrera futura):
- https://hybridracehub.com/carreras-hibridas/galicia — DEKA Vigo 2027 (Supabase) + Hybrid Day Vigo 12-13/12/2026 (verificado en hybrid-day.com)
- https://hybridracehub.com/carreras-hibridas/cantabria — Hybrid Zone Torrelavega 2027
- https://hybridracehub.com/carreras-hibridas/castilla-la-mancha — DEKA Toledo 2027

**Artículos**:
- https://hybridracehub.com/blog/hyrox-vs-carrera-hibrida-diferencias
- https://hybridracehub.com/blog/calendario-hyrox-espana-2026-2027

**Dónde entrenar HYROX en [ciudad]** (31 ciudades con ≥3 centros distintos): https://hybridracehub.com/centros-entrenamiento/ + `barcelona`, `madrid`, `zaragoza`, `sevilla`, `valencia`, `malaga`, `alicante`, `bilbao`, `gijon`, `marbella`, `palma`, `pontevedra`, `valladolid`, `vigo`, `badajoz`, `burgos`, `chiclana-de-la-frontera`, `cordoba`, `fuengirola`, `guadalajara`, `jerez-de-la-frontera`, `las-palmas-de-gran-canaria`, `logrono`, `mataro`, `murcia`, `pozuelo-de-alarcon`, `reus`, `sabadell`, `salamanca`, `san-sebastian`, `torremolinos`.

No se han creado (menos de 3 centros en el directorio): Alcalá de Henares (1), Torrejón de Ardoz (1), Valls (1), Torrent (1), Igualada (1), Tarragona (2).

---

## 7. Titles y metas cambiados (antes → después)

| Página | Title antes | Title después |
|---|---|---|
| / | Carreras híbridas en España 2026-2027: calendario Hyrox y OCR \| Hybrid Race Hub (79) | Carreras híbridas en España 2026-2027 \| Hybrid Race Hub (55) |
| /que-es-una-carrera-hibrida | Qué es una carrera híbrida: HYROX, OCR y Spartan explicados (2026-2027) \| Hybrid Race Hub (89) | Qué es una carrera híbrida (hybrid race) y cómo funciona (57) |
| /centros-entrenamiento | Dónde Entrenar: OCR, HYROX y CrossFit en España \| Hybrid Race Hub (65) | Dónde entrenar HYROX y OCR en España \| Hybrid Race Hub (54) |
| /calendario | Calendario de carreras híbridas 2026-2027: HYROX, OCR y Spartan \| Hybrid Race Hub (81) | Calendario de carreras híbridas 2026-2027 \| Hybrid Race Hub (59) |
| /carreras-hibridas/[región] | Carreras híbridas en Andalucía 2026-2027: HYROX y OCR \| Hybrid Race Hub (71) | Carreras híbridas en Andalucía 2026-2027 \| Hybrid Race Hub (58) |
| /blog/que-es-hurbax | Qué es HURBAX: 5 km y 5 estaciones, modalidades, campeonato y sedes \| Hybrid Race Hub (85) | Qué es HURBAX: formato, estaciones y temporada 2027 (51) |
| /blog/que-es-el-hyatlon | Qué es el Hyatlón: formatos H6 y H8, estaciones, diferencias con HYROX y calendario \| … (101) | Qué es el Hyatlón: formatos H6 y H8 y próximas fechas (53) |
| /blog/que-es-hyrox | Qué es HYROX: formato, estaciones, pesos, categorías e inscripción \| … (84) | Qué es HYROX: estaciones, pesos y sedes 2026-2027 (49) |
| /plan-entrenamiento | Plan de Entrenamiento Personalizado OCR, HYROX, CrossFit \| Hybrid Race Hub (74) | Plan de entrenamiento HYROX, OCR y CrossFit gratis |
| /race-hub | Plan de Entrenamiento HYROX — Programas Fundamentos a Elite \| … (77) | Programas HYROX: de fundamentos a élite \| Hybrid Race Hub |
| /productos/zapatillas-trail | Mejores Zapatillas Trail OCR Gore-Tex 2026 \| Hybrid Race Hub | Mejores zapatillas trail para OCR 2026 \| Hybrid Race Hub |
| /productos/zapatillas-crossfit | Mejores Zapatillas CrossFit y Halterofilia 2026 \| Hybrid Race Hub (65) | Mejores zapatillas de CrossFit 2026 \| Hybrid Race Hub |

Descriptions principales (después):
- **Home**: "Calendario de carreras híbridas 2026-2027 en España: HYROX, OCR, Spartan y DEKA con fechas, precios e inscripción. Mira las de 2027 y elige la tuya." (antes no mencionaba 2027 ni tenía llamada a la acción).
- **Guía**: "Una carrera híbrida mezcla tramos de carrera con ejercicios de fuerza o con obstáculos. Te explicamos HYROX, OCR, Spartan, Hurbax e Hyatlón y sus fechas." (antes: enumeración sin respuesta directa).
- **Centros**: "Directorio de boxes y gimnasios para entrenar HYROX, OCR y fitness híbrido en España, con sled, SkiErg y remo. Busca por ciudad o código postal y llama." (antes 175 caracteres y con "CrossFit").
- **Regiones**: se generan con datos reales, entre 140 y 155 caracteres (p. ej. "5 carreras híbridas en Andalucía en 2026-2027: HYROX, OCR, Spartan y DEKA con fechas, precios e inscripción. Próxima: Gollizno Race Olivares 2026.").
- **Blog**: titles y descriptions de los 19 artículos en `lib/blog-seo.js`; rankings en `lib/rankings.js`; resto de páginas en su propio archivo.

---

## 8. Decisiones que tomé sin preguntarte

1. **La tabla `sport_centers` no existe** en Supabase (error PGRST205). Usé `lib/centros-entrenamiento.json`, que es de donde ya salía el directorio.
2. **Ciudades del JSON mal escritas** ("Palmas", "Real", "Rozas", "María"…): las normalicé con un mapa de alias + código postal y conté como uno los centros repetidos (mismo nombre y CP). Por eso Málaga sale con 12 centros y no 17.
3. **Hybrid Day Vigo** no está en Supabase: lo publiqué en la página de Galicia porque está verificado en su web oficial (`lib/verified-events.js`, con fuente y fecha de comprobación visibles). Se oculta solo cuando pasa la fecha. Si lo das de alta en Supabase, bórralo de ese archivo.
4. **Coruña**: no hay ninguna carrera verificada en A Coruña, así que no aparece en el title de Galicia ni en los anuncios. La página explica que ahora mismo no hay fechas allí.
5. **Hybrid Day 2027**: su web no publica sedes de 2027, así que escribí "Calendario HYROX España 2026-2027" e incluí ahí lo verificado de Hybrid Day (y que 2027 está pendiente).
6. **País Vasco** no tiene página propia: sus 2 carreras (Bizkaia) ya salen en la página de Bilbao.
7. **Title de la home**: la propuesta con "calendario HYROX y OCR" no cabía en 60 caracteres; prioricé "Carreras híbridas" + "2026-2027" + marca (la marca ya contiene "Hybrid Race").
8. **Organizador en el schema Event**: lo quité. Antes se deducía del nombre de la carrera; Supabase no tiene ese campo y Google penaliza datos inexactos.
9. **Enlaces externos con TLS roto** del directorio (crossfitbilbao.com, aftxbox.com): los quité porque el navegador muestra aviso de seguridad. Las fichas siguen.
10. **Fotos de los artículos nuevos**: la API de Unsplash pide clave, así que reutilicé dos fotos ya verificadas del sitio que encajan (corredores en un evento híbrido y público en una HYROX).
11. **Lint**: la regla `no-html-link-for-pages` (95 avisos) queda como aviso. Todo el sitio usa `<a>` para enlaces internos; pasarlo a `<Link>` es un refactor aparte sin efecto SEO. Dos `setState` dentro de `useEffect` son intencionados (leen localStorage y la URL tras hidratar) y llevan comentario.
12. **Eventos antiguos** (`amazon_click`, `organizer_click`…): los mantuve para no romper lo que tengas en GTM; los nuevos (`affiliate_click`, `race_outbound_click`) son los que hay que marcar como conversión.
13. **Presupuestos del CSV**: 4 €/día en total (reparto 60 % Google / 40 % Meta sobre 200 €/mes). Si no haces Meta, el plan indica cómo subir a ~6 €/día.
14. **Keywords "hyrox [ciudad]" a secas**: no se pujan en ciudades grandes (quien busca "hyrox madrid" quiere la carrera, no un gimnasio); solo en Pozuelo y Reus, donde Search Console muestra que llegan a la página de centros.
15. **Etiquetas en mayúsculas** a 11 px: las dejé así (estilo de la marca); el texto corrido está a 14-16 px.
16. **Cookies**: no instalé ningún banner de consentimiento porque implica textos legales y elegir proveedor; lo dejo como tarea tuya (ver abajo).

---

## 9. TAREAS MANUALES PARA PABLO

1. **Enviar el sitemap a Search Console**
   1. Entra en [search.google.com/search-console](https://search.google.com/search-console) → propiedad hybridracehub.com.
   2. Menú izquierdo → **Sitemaps** → escribe `sitemap.xml` → **Enviar**. Si ya estaba, pulsa sobre él y comprueba que pone "Correcto" y 90 URLs descubiertas.

2. **Solicitar indexación de las URLs nuevas** (máximo ~10 al día, empieza por estas):
   1. En Search Console, arriba, pega la URL en **"Inspeccionar cualquier URL"** → **Solicitar indexación**.
   2. Orden recomendado: `/carreras-hibridas/galicia`, `/centros-entrenamiento/madrid`, `/blog/calendario-hyrox-espana-2026-2027`, `/blog/hyrox-vs-carrera-hibrida-diferencias`, `/centros-entrenamiento/pozuelo-de-alarcon`, `/centros-entrenamiento/reus`, `/centros-entrenamiento/barcelona`, `/centros-entrenamiento/valencia`, `/centros-entrenamiento/sevilla`, `/centros-entrenamiento/palma`. Al día siguiente: `/carreras-hibridas/cantabria`, `/carreras-hibridas/castilla-la-mancha`, `/` y `/que-es-una-carrera-hibrida` (para que Google vea antes los titles nuevos).

3. **Configurar GTM, GA4 y Google Ads** siguiendo `docs/sem/GTM-CONFIG.md` (45-60 min). Al final, en GA4 marca `affiliate_click`, `race_outbound_click` y `contact_form_submit` como eventos clave e impórtalos en Google Ads.

4. **Banner de cookies con Consent Mode v2** antes de lanzar anuncios: elige una CMP (Cookiebot, CookieYes, Complianz…), instálala desde GTM y cambia el texto del pie y del aviso de cookies, que ahora dice "solo cookies técnicas".

5. **Importar el CSV en Google Ads Editor**
   1. Instala Google Ads Editor y descarga tu cuenta (**Obtener cambios recientes**).
   2. **Cuenta → Importar → Desde archivo** → `docs/sem/google-ads-editor.csv`.
   3. Revisa: 3 campañas en pausa, 19 grupos, 250 keywords, 102 negativas y 19 anuncios. Comprueba ubicación España, idioma español y solo Búsqueda.
   4. **Publicar**. Crea a mano los enlaces de sitio y textos destacados de `docs/sem/PLAN-GOOGLE-ADS.md`.
   5. **No actives** las campañas hasta cumplir los puntos 3 y 4.

6. **Revisar la URL rota en Supabase**: carrera "Farinato Hybrid Race Madrid (otoño)" → `https://farinatorace.es` no responde. Busca la web actual del organizador y actualiza el campo `url`. Aprovecha para revisar las que apuntan a carrerasocr.com.

7. **Dar de alta el Hybrid Day Vigo en Supabase** si quieres que salga también en el calendario general; después bórralo de `lib/verified-events.js`.

8. **Antes de cada campaña de Meta**, comprueba los datos que citan los textos de `docs/sem/PLAN-META-ADS.md` (número de carreras de 2027, carreras de Andalucía).

---

## 10. Qué mirar en Search Console

**A las 2 semanas (≈10/11/2026)**
- **Páginas → Indexadas**: que aparezcan Galicia, Cantabria, Castilla-La Mancha, los 2 artículos y la mayoría de las 31 páginas de centros. Si alguna sale como "Descubierta: actualmente sin indexar", vuelve a pedir indexación.
- **Rendimiento → Consultas** (últimos 7 días frente a los 7 anteriores): CTR de "carreras híbridas" (con tilde, estaba en 0,8 %), "hybrid race" (2,9 %) y "que es una carrera hibrida". Lo normal es ver primero el cambio de CTR, porque Google ya muestra los titles nuevos.
- **Rendimiento → Páginas**: CTR de `/que-es-una-carrera-hibrida` (estaba en 0,8 %) y de `/blog/que-es-hurbax` (1 %).
- **Mejoras → Preguntas frecuentes / Fragmentos de reseñas / Eventos y Rutas de navegación**: que no haya errores nuevos de datos estructurados.

**A las 6 semanas (≈8/12/2026)**
- Impresiones y posición de "hybrid race galicia", "hybrid race vigo", "carreras hibridas galicia" (antes posición 18-35 y sin página).
- Consultas "donde entrenar hyrox [ciudad]", "hyrox pozuelo", "hyrox reus", "gimnasio ocr madrid": deben empezar a llegar a `/centros-entrenamiento/[ciudad]` en vez de al directorio general.
- Clics totales de `/centros-entrenamiento` + sus páginas de ciudad frente a septiembre (venía de -28 %).
- **Experiencia → Core Web Vitals (móvil)**: que /centros-entrenamiento no aparezca como "Necesita mejorar" por INP.
- En GA4 (si ya está configurado): `affiliate_click` y `race_outbound_click` por página de destino, para decidir qué landings usar en Google Ads.
