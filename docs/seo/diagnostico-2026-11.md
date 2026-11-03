# Diagnóstico SEO de hybridracehub.com — noviembre de 2026

Fecha: 3 de noviembre de 2026. Fase de solo lectura: no se ha cambiado código de la web.
Datos en bruto: `docs/seo/data/` (rastreo, Supabase, Lighthouse). Scripts: `scripts/crawl-site.mjs`, `scripts/crawl-analyze.mjs`, `scripts/schema-check.mjs`, `scripts/pagespeed.mjs`, `scripts/lighthouse-run.mjs`.

## Antes de leer: la métrica del PDF de Search Console

El PDF trae una sola columna etiquetada como «impresiones», pero las cifras no cuadran con exportaciones anteriores. Hay un dato que apunta a que en realidad son **clics**: `/blog/que-es-hurbax` tenía 291 impresiones en posición 6,7 en la exportación anterior y ahora aparece con 1. Con un CTR normal en esa posición (0,5–2 %), 291 impresiones dan entre 1 y 6 clics. Es decir, el «1» encaja mejor con clics que con una caída real. Lo uso como señal relativa, como se pidió, y lo dejo anotado como hipótesis en el punto 1.5. Pablo puede salir de dudas en 30 segundos (tarea en el informe final).

---

## 1.1 Rastreo completo

Rastreo propio desde la home siguiendo todos los enlaces internos (`scripts/crawl-site.mjs`), más las URLs del sitemap que no se alcanzaban por enlaces. Resultado completo por URL (estado, canonical, robots, title y longitud, description y longitud, H1, palabras, enlaces entrantes y salientes, profundidad): `docs/seo/data/crawl-prod-antes.json`.

| Métrica | Valor |
|---|---|
| URLs rastreadas | 95 |
| Indexables (200, sin noindex, canonical a sí misma) | 91 |
| noindex, follow | 4 (`/carreras-hibridas/zaragoza`, `valladolid`, `asturias`, `murcia`: sin carreras futuras, es lo previsto) |
| Errores 4xx/5xx | 0 |
| Redirecciones internas / cadenas | 0 / 0 |
| Titles duplicados | 0 |
| Descriptions duplicadas | 0 |
| H1 ausentes o múltiples | 0 |
| Titles fuera de 25–60 caracteres | 0 |
| Descriptions fuera de 120–160 | 0 |
| Páginas a más de 3 clics de la home | 0 |
| Huérfanas indexables | 1: `/comunidad` |

La base técnica está limpia: es el resultado de las auditorías de octubre. Los problemas de noviembre no son de errores, sino de **foco, enlazado y contenido**.

### H1 mal formados (texto pegado en el HTML)
- `/productos`: «Rankingsde Equipamiento» (falta un espacio entre dos `<span>`).
- `/calculadora-hyrox`: «CalculadoraHYROX».
- `/plan-entrenamiento`: el H1 es «Tu perfil físico», que es el título del primer paso del formulario, no de la página.
- `/contacto-organizadores`: H1 «Colabora con nosotros», no dice de qué va la página.

### Páginas finas (< 250 palabras indexables, sin cabecera, menú ni pie)
| URL | Palabras | Causa |
|---|---|---|
| `/comunidad` | 20 | La lista de artículos se pinta en el navegador; además está huérfana |
| `/contacto-organizadores` | 37 | El texto está dentro del formulario y de componentes cliente |
| `/plan-entrenamiento` | 39 | Herramienta interactiva sin texto en el HTML del servidor |
| `/calculadora-hyrox` | 212 | Herramienta con poco texto alrededor |
| `/blog/categoria/podcasts` | 224 | Categoría con un solo artículo |
| 11 páginas de `/centros-entrenamiento/[ciudad]` | 209–238 | Ciudades con 3–4 centros: lista corta y plantilla común (gijon, pontevedra, valladolid, badajoz, burgos, guadalajara, las-palmas-de-gran-canaria, logrono, murcia, salamanca, san-sebastian) |

### Reparto del enlazado interno (lo más importante del rastreo)
Casi todo el enlazado sale del menú y del pie, que apuntan a las mismas ~30 URLs. Fuera de eso, el reparto está muy desequilibrado:

| URL | Enlaces internos entrantes | Peso en Search Console |
|---|---|---|
| `/carreras-hibridas/madrid` | 83 (casi todos desde el pie, anchor «Madrid») | 0, no aparece |
| `/carreras-hibridas/comunidad-valenciana` | 9 | 22 |
| `/carreras-hibridas/canarias`, `baleares` | 5 | 29 y 19 |
| `/carreras-hibridas/castilla-la-mancha` | 2 | 3 |
| `/carreras-hibridas/cantabria` | 1 | 13 |
| `/centros-entrenamiento/madrid` | **3** | 2 |
| `/centros-entrenamiento/sevilla`, `malaga` | 10 | 10 y 4 |
| `/blog/calendario-hyrox-espana-2026-2027` | 9 | 45 |
| `/blog/que-es-hurbax` | 7 | 1 |
| `/blog/mejores-eventos-ocr-hyrox-espana-2026` | 2 (a 3 clics) | — |

Las regiones que entraron en octubre (Cantabria, Castilla-La Mancha, Baleares, Canarias) dependen de la home y de muy pocos enlaces más. `/centros-entrenamiento/madrid`, con 32 centros y 619 palabras, es la ciudad mejor dotada después de Barcelona y una de las peor enlazadas.

## 1.2 Sitemap frente a rastreo

- Sitemap: 91 URLs. Todas responden 200 y todas son indexables.
- En el sitemap pero sin ningún enlace interno: **`/comunidad`** (además fina, 20 palabras).
- Enlazadas, indexables y fuera del sitemap: **ninguna**.
- Con noindex dentro del sitemap: **ninguna** (las 4 regiones sin carreras ya se excluyen).
- Falta en el sitemap todo lo que se cree en la fase 4 (fichas, calendarios mensuales, hubs). Hoy no existe una URL por carrera: cada carrera solo vive dentro de listas, en una ventana emergente sin URL propia.

## 1.3 Mapa de canibalización

| Consulta | URLs que la trabajan hoy (title / H1 / contenido) | Debería ser la principal | Problema |
|---|---|---|---|
| carreras híbridas / hybrid race | `/` (title y H1 «Carreras híbridas en España 2026-2027»), `/calendario` («Calendario de carreras híbridas 2026-2027»), `/que-es-una-carrera-hibrida` | `/` para la consulta genérica y de calendario; `/que-es-una-carrera-hibrida` para la informativa («qué es», «hybrid race») | `/` y `/calendario` tienen title y H1 casi iguales y el mismo listado. Hoy gana la home (53 % del peso). No conviene tocar la home: hay que diferenciar `/calendario` hacia «filtrar por mes, región y modalidad» |
| competiciones híbridas España 2027 | `/`, `/calendario`, las 14 regiones (todas «2026-2027»), `/blog/mejores-eventos-ocr-hyrox-espana-2026` | `/` | Señal repartida; el post de «mejores eventos 2026» está desfasado y compite sin aportar |
| carreras híbridas Madrid | `/carreras-hibridas/madrid`, `/` (FAQ «¿Cuáles son las próximas carreras híbridas en Madrid?» con la lista), `/centros-entrenamiento/madrid` | `/carreras-hibridas/madrid` | La home responde la pregunta en su FAQ y además tiene toda la autoridad; la página de Madrid solo recibe el anchor genérico «Madrid» del pie. Por eso Google sirve la home (pos. 3,5) |
| hyrox [ciudad] / hyrox Madrid 2027 | `/blog/calendario-hyrox-espana-2026-2027`, `/blog/que-es-hyrox` (title con «sedes 2026-2027»), regiones | `/blog/calendario-hyrox-espana-2026-2027` como hub y una ficha por sede (fase 4.2) | `que-es-hyrox` también promete sedes en el title |
| hurbax / qué es hurbax / hurbax 2027 | `/blog/que-es-hurbax`, `/blog/hyrox-vs-carrera-hibrida-diferencias` (desde el 27/10 lleva «Hurbax» en title y H1), `/que-es-una-carrera-hibrida` (Hurbax en la description y una sección) | `/blog/que-es-hurbax` | Canibalización nueva desde el 27/10, ver 1.5 |
| hyatlón | `/blog/que-es-el-hyatlon` | la misma | Sin conflicto |
| dónde entrenar HYROX Madrid | `/centros-entrenamiento` (title «Dónde entrenar HYROX y OCR en España», 594 de peso), `/centros-entrenamiento/madrid` | `/centros-entrenamiento/madrid` | El directorio general es la página fuerte y se lleva las consultas locales; la de Madrid casi no recibe enlaces (3) |
| zapatillas HYROX | `/productos/zapatillas-hyrox` («Mejores zapatillas para HYROX 2026»), **`/blog/zapatillas-hyrox-running-hibrido-2026`** («Mejores zapatillas para HYROX y running híbrido 2026») | `/productos/zapatillas-hyrox` | **Canibalización directa**: dos URLs con casi el mismo title. El ranking, que es el que monetiza, no aparece |
| material HYROX / guantes HYROX | `/blog/material-hyrox-carreras-obstaculos`, `/blog/equipamiento-ocr-guia-compra-2026`, `/blog/categoria/material`, `/productos` | `/blog/material-hyrox-carreras-obstaculos` (informativa) que reparte hacia los rankings | No hay ranking de guantes: la consulta transaccional no tiene página |
| primera carrera / principiantes | `/blog/carreras-hibridas-principiantes-primera-prueba`, `/blog/primera-carrera-obstaculos-guia`, `/blog/plan-entrenamiento-hyrox-12-semanas` | la de principiantes (general) y la de OCR (específica) | Aceptable: intenciones distintas, ya se enlazan entre sí |
| carrera híbrida septiembre (por mes) | ninguna | `/calendario/2027/septiembre` (fase 4.3) | No existe página por mes |

## 1.4 Rankings de Amazon

| URL | Indexable | Sitemap | Enlaces entrantes | Title | H1 | Palabras |
|---|---|---|---|---|---|---|
| `/productos` | Sí | Sí | 91 | Rankings de material OCR y HYROX 2026 | «Rankingsde Equipamiento» (roto) | 4.813 |
| `/productos/relojes` | Sí | Sí | 84 | Mejores relojes GPS para OCR y HYROX 2026 | Relojes deportivos para OCR + HYROX | 1.075 |
| `/productos/zapatillas-hyrox` | Sí | Sí | 83 | Mejores zapatillas para HYROX 2026 | Zapatillas para pruebas híbridas tipo HYROX | 978 |
| `/productos/zapatillas-trail` | Sí | Sí | 83 | Mejores zapatillas trail para OCR 2026 | Zapatillas trail running para OCR — con Gore-Tex | 1.018 |
| `/productos/zapatillas-crossfit` | Sí | Sí | 83 | Mejores zapatillas de CrossFit 2026 | Zapatillas crossfit / halterofilia | 948 |
| `/productos/pulsometros` | Sí | Sí | 83 | Mejores pulsómetros para HYROX y OCR 2026 | Pulsómetros / bandas de frecuencia cardíaca | 926 |
| `/productos/ropa` | Sí | Sí | 83 | Mejor ropa deportiva para OCR y HYROX 2026 | Ropa deportiva funcional (pantalones, shorts y mallas) | 914 |

Por qué no posicionan, aunque técnicamente están bien:
1. **Casi todos sus enlaces salen del pie y del menú** (anchors cortos tipo «Relojes GPS»). Desde el cuerpo de los artículos apenas reciben enlaces contextuales; y el artículo `zapatillas-hyrox-running-hibrido-2026` compite directamente con el ranking de zapatillas HYROX.
2. **El H1 no coincide con la intención de compra** («Zapatillas crossfit / halterofilia», «Pulsómetros / bandas…») ni con el title. No hay año ni «mejores» en el H1.
3. **Schema Product sin `offers`, `review` ni `aggregateRating`**: Google lo considera un fragmento de producto incompleto y lo marca como error en el informe «Fragmentos de productos» de Search Console. Hay que pasar a `ItemList` con elementos simples (nombre y URL), sin `Product`.
4. **Notas /10 en las tablas**: son valoraciones editoriales sin método publicado. No están en el schema (bien), pero en la tabla parecen datos. Mejor sustituirlas por criterios verificables (peso, drop, autonomía, tipo de suela) o explicar el criterio.
5. **Sin FAQ ni criterios de elección** en la mayoría, y la fecha visible es la de la última revisión de los ASIN (13/10).
6. **Útil sin imágenes**: sí, a medias. Las tarjetas ya no dependen de la foto de Amazon (icono por categoría), y las descripciones son largas y concretas. Lo que falta es una tarjeta que diga en una línea para quién es cada producto y un botón claro «Ver precio en Amazon».
7. 29 de los 49 productos enlazan a una **búsqueda** de Amazon, no a la ficha (`asinDisponible: false`), porque el ASIN no se pudo verificar en octubre. Funciona y lleva el tag, pero convierte peor.

## 1.5 HURBAX: qué ha pasado

Historial: el artículo se publicó el 15/10 (`f4f2bfc`). Su contenido no se ha tocado después. El 27/10 (`64d9c3b`, fase 2 de la auditoría anterior) se le sobrescribió el title y la description desde `lib/blog-seo.js`.

| | Antes (15/10 → 27/10) | Después (desde el 27/10) |
|---|---|---|
| Title | «Qué es HURBAX: 5 km y 5 estaciones, modalidades, campeonato y sedes» (68 caracteres: Google lo cortaba) | «Qué es HURBAX: formato, estaciones y temporada 2027» (51) |
| Description | «Qué es HURBAX: circuito de carreras híbridas al aire libre con 5 km de carrera y 5 estaciones. Modalidades, campeonato…» (>155) | «HURBAX es un circuito español de carreras híbridas al aire libre: 1 km de carrera y un ejercicio, cinco veces. Formato, ranking, final y temporada 2027.» |
| H1 | «Qué es HURBAX: formato, modalidades, campeonato y sedes» | igual |
| Primer párrafo | Definición + «la Final Nacional, que en 2026 se celebra el 24 de octubre en San Sebastián de los Reyes» | igual (hoy ya es pasado) |

Diagnóstico, de más a menos probable:
1. **La caída puede no ser tal.** El «1» del PDF encaja con clics, no con impresiones (ver nota inicial). Si es así, la página sigue donde estaba y lo que hay es un problema de CTR, no de ranking.
2. **El contenido caducó el 24/10.** El primer párrafo y la FAQ giran alrededor de la Final Nacional del 24 de octubre. Gran parte del interés de octubre era por esa final («hurbax final», «hurbax madrid», «hurbax san sebastián de los reyes»). Pasada la fecha, esas consultas desaparecen y el artículo habla en futuro de algo que ya ocurrió. No hay ninguna prueba HURBAX futura en Supabase y la web oficial aún no ha publicado sedes 2027: el bloque «Próximas pruebas» sale vacío.
3. **Canibalización creada el 27/10.** El mismo día que se cambió el title, se publicó `/blog/hyrox-vs-carrera-hibrida-diferencias` con «Hurbax» en el title y en el H1, y `/que-es-una-carrera-hibrida` añadió «Hurbax» a su description y una sección propia. Para «hurbax» Google tiene ahora tres candidatas; dos de ellas con mucha más autoridad.
4. **Title**: el nuevo es más corto y correcto en longitud, pero promete «temporada 2027» sin ninguna fecha 2027 en la página. Si el usuario busca «hurbax 2027» y no encuentra fechas, rebota. El H1 no dice ni «2027» ni «qué es» en primera posición del mismo modo que el title, lo cual no es grave.

Solución (fase 3.3): devolver el foco a «qué es HURBAX» y «HURBAX 2027» en title, H1 y primer párrafo; reescribir el primer párrafo en pasado para la final 2026 (con lo que ya se sabe); dejar claro qué se sabe de 2027 (solo lo que publique la web oficial); quitar «Hurbax» del title/H1 del comparativo y de la description de la guía general.

## 1.6 Velocidad

La API pública de PageSpeed Insights devolvió **429 «Quota exceeded… Queries per day»** en todas las llamadas (la cuota sin clave es compartida y estaba agotada). Plan B: Lighthouse 12.6.1, el mismo motor de laboratorio que usa PageSpeed, ejecutado en local contra producción (`scripts/lighthouse-run.mjs`). Datos de campo (CrUX): no se pueden consultar sin clave de API; con el tráfico actual es muy probable que la URL no tenga datos de campo propios. INP es una métrica de campo: en laboratorio se usa TBT como aproximación.

| URL | Disp. | Puntuación | LCP | TBT (≈INP) | CLS | Elemento LCP |
|---|---|---|---|---|---|---|
| / | móvil | 91 | 3,4 s | 61 ms | 0 | `img` |
| / | escritorio | 100 | 0,5 s | 0 ms | 0,009 | `img` |
| /centros-entrenamiento | móvil | 91 | 3,3 s | 118 ms | 0 | `h1` |
| /centros-entrenamiento | escritorio | 100 | 0,6 s | 0 ms | 0 | `h1` |
| /que-es-una-carrera-hibrida | móvil | 93 | 3,2 s | 31 ms | 0 | `p` |
| /que-es-una-carrera-hibrida | escritorio | 100 | 0,5 s | 0 ms | 0 | `h1` |
| /carreras-hibridas/andalucia | móvil | 99 | 1,9 s | 9 ms | 0 | `p` |
| /carreras-hibridas/andalucia | escritorio | 100 | 0,6 s | 0 ms | 0 | `p` |
| /blog/calendario-hyrox-espana-2026-2027 | móvil | 91 | 3,5 s | 40 ms | 0 | `img` |
| /blog/calendario-hyrox-espana-2026-2027 | escritorio | 100 | 0,6 s | 0 ms | 0,016 | `img` |
| /productos/zapatillas-hyrox | móvil | 92 | 3,4 s | 11 ms | 0 | `p` |
| /productos/zapatillas-hyrox | escritorio | 100 | 0,5 s | 0 ms | 0 | `h1` |

Lectura:
- **Escritorio: todo en 100**, LCP de 0,5–0,6 s.
- **Móvil: 5 de 6 URLs con LCP de 3,2–3,5 s (> 2,5 s)**. TBT bajo en todas (≤ 118 ms), así que la interactividad no es el problema; CLS en 0.
- Patrón común en móvil: el primer pintado llega en ~1 s, pero el elemento LCP no se da por pintado hasta ~2 s después. Causas encontradas en el HTML:
  1. **Hoja de estilos única de 94 KB** que bloquea el renderizado en todas las páginas (incluye estilos de calendario, plan, calculadora, rankings…).
  2. En la home y en artículos con foto, **la imagen de cabecera** (hero con capa oscura) es el LCP y se pide en 828 px a calidad 60 aunque está tapada al 60 % por la capa.
  3. Precarga con prioridad alta del logo SVG de la cabecera (`logo-icon.svg`), que compite con la imagen LCP.
  4. `/centros-entrenamiento` mete los 468 centros en el JavaScript de la página (TBT 118 ms) y el HTML pesa 147 KB.
- La región de Andalucía (1,9 s) demuestra que la plantilla sin foto y con poco JS cumple.


## 1.7 Medición en producción

Contenedor descargado de `https://www.googletagmanager.com/gtm.js?id=GTM-5D5D2CH9` (335 KB, `"version":"2"`):

| Comprobación | Resultado |
|---|---|
| Etiqueta GA4 (`G-…`) | **No existe** |
| Activadores `affiliate_click`, `race_outbound_click`, `contact_form_submit` | **No existen** |
| Píxel de Meta (`fbq`, `connect.facebook.net`) | **No existe** |
| Google Ads (`AW-…`) | No existe |

Conclusión: **Pablo no ha importado el contenedor** `docs/sem/gtm-container-import.json` que se preparó en octubre. GTM carga, pero no mide nada. Todo el tráfico de octubre y noviembre está sin analítica.

Lo que sí funciona (Playwright contra producción, `scripts/check-consent.mjs` y `scripts/check-tracking.mjs`):
- Consentimiento por defecto **denied** en `ad_storage`, `ad_user_data`, `ad_personalization` y `analytics_storage`, antes de `gtm.js` (posición 2 del dataLayer). 13/13 comprobaciones del banner OK.
- Los pushes al dataLayer llegan con sus parámetros: `affiliate_click` (ranking relojes), `region_view` y `race_outbound_click` (región Madrid), `search_used` (calendario y centros), `contact_form_submit` (organizadores).

## 1.8 Schema (JSON-LD)

Revisadas 11 URLs representativas (`scripts/schema-check.mjs`): `/`, `/calendario`, `/que-es-una-carrera-hibrida`, `/carreras-hibridas/madrid`, `/carreras-hibridas/galicia`, `/centros-entrenamiento`, `/centros-entrenamiento/madrid`, `/blog/que-es-hurbax`, `/blog/calendario-hyrox-espana-2026-2027`, `/productos/zapatillas-hyrox`, `/sobre-nosotros`. Todas con JSON válido.

| Tipo | Dónde | Estado |
|---|---|---|
| SportsEvent | home, guía, regiones | Válido en lo obligatorio. Faltan `endDate`, `organizer`, `image` y `offers` en la mayoría; `startDate` sin hora ni zona horaria; `offers` sin `availability`. Google pide `endDate` y recomienda el resto para el resultado enriquecido de eventos |
| FAQPage | home, guía, regiones, artículos | Correcto |
| BreadcrumbList | todas salvo la home | Correcto |
| Article | artículos y guía | Correcto. Dentro, `author` es una Organization con `url`, bien; el `publisher` es otra Organization con `@id` pero sin `url` (aviso menor) |
| ItemList + Product | rankings | **Error**: `Product` sin `offers`, `review` ni `aggregateRating`, que Google exige en fragmentos de producto |
| ItemList + LocalBusiness / SportsActivityLocation | centros | Correcto |
| Organization / WebSite | home, sobre nosotros | Correcto; el logo de la home es un SVG (Google recomienda PNG/JPG de al menos 112 px) |
| `/calendario` | — | Solo BreadcrumbList: la página con todas las carreras no tiene ni un `SportsEvent` ni `ItemList` |

## 1.9 Comunidades con carreras futuras sin página regional

37 carreras futuras en Supabase (OCR y funcional) + 1 evento verificado a mano (Hybrid Day Vigo). Reparto por comunidad: Madrid 10, Cataluña 5, Comunidad Valenciana 6, Andalucía 5, Canarias 4, Baleares 2, País Vasco 2, Castilla-La Mancha 1, Cantabria 1, Galicia 1 (+1 verificada).

| Comunidad | Carreras futuras | Página |
|---|---|---|
| Madrid | 10 | `/carreras-hibridas/madrid` (existe, es «ciudad» pero cruza toda la provincia: cubre la Comunidad) |
| País Vasco | 2 (ambas en Bizkaia) | Solo `/carreras-hibridas/bilbao` (provincia Bizkaia). Cubre ambas; no hay página «País Vasco» |
| Resto (8) | ≥1 | Todas tienen página |

**No falta ninguna comunidad con carreras.** «Madrid» existe desde octubre y está en el sitemap: el PDF no la muestra porque no recibe tráfico, no porque no exista. Lo que falla es su posicionamiento frente a la home (1.3).

Otras observaciones de datos:
- El SQL `docs/datos/cambios-races-2026-10-27.sql` (6 altas y 8 correcciones verificadas) **sigue sin aplicarse** en Supabase.
- Ninguna carrera futura de HURBAX, Hyatlón ni Hybrid Day en Supabase (solo Hybrid Day Vigo, verificado a mano).
- 5 carreras OCR futuras tienen como URL la portada de `carrerasocr.com` (agregador): la web ya no las muestra como «oficiales», pero no tienen enlace de inscripción.
- Hubs de modalidad con ≥3 carreras futuras: DEKA (9), Spartan (4), OCR (18 con Spartan). HURBAX (0), Hyatlón (0) e Hybrid Day (1) no llegan.

## 1.10 Problemas priorizados

| # | Problema | Impacto | Esfuerzo | Fase |
|---|---|---|---|---|
| 1 | GTM sin GA4 ni conversiones: no se mide nada | Alto | Bajo (importar contenedor, 10 min de Pablo) | 7 |
| 2 | Las carreras no tienen URL propia: cero opciones para «hyrox madrid 2027», «deka toledo», etc. | Alto | Alto | 4.2 |
| 3 | `/carreras-hibridas/madrid` eclipsada por la home (FAQ de Madrid en la home, anchor «Madrid» en el pie) | Alto | Bajo | 3–4.1 |
| 4 | Canibalización ranking de zapatillas HYROX ↔ artículo de zapatillas HYROX | Alto | Bajo | 5 |
| 5 | Rankings sin enlaces contextuales, H1 sin intención de compra, schema Product inválido | Alto | Medio | 2.1 y 5 |
| 6 | HURBAX: contenido caducado (final del 24/10) y canibalización con dos páginas fuertes | Medio | Bajo | 3.3 |
| 7 | `/centros-entrenamiento/madrid` con 3 enlaces entrantes; directorio general se lleva las consultas locales | Medio | Bajo | 3.5 y 6 |
| 8 | Regiones nuevas con 1–5 enlaces entrantes | Medio | Bajo | 3.1, 3.6 y 6 |
| 9 | SportsEvent incompleto (sin endDate, hora con zona, organizer, image, availability) | Medio | Bajo | 2.2 |
| 10 | LCP móvil de la home > 2,5 s (imagen del hero) | Medio | Bajo | 2.5 |
| 11 | Sin páginas por mes ni por modalidad | Medio | Medio | 4.3 y 4.4 |
| 12 | H1 rotos («Rankingsde», «CalculadoraHYROX») y H1 sin sentido en plan y organizadores | Medio | Bajo | 2.1 |
| 13 | `/comunidad` huérfana y fina, en el sitemap | Medio | Bajo | 2.1 |
| 14 | `/calendario` y la home con title/H1 casi idénticos; `/calendario` sin schema de eventos | Medio | Bajo | 2.1 |
| 15 | Robots meta desigual (`index, follow` sin `max-image-preview:large` en home, calendario, productos, centros) | Bajo | Bajo | 2.3 |
| 16 | `html lang="es"` en vez de `es-ES` | Bajo | Bajo | 2.3 |
| 17 | Páginas finas: plan de entrenamiento, organizadores, calculadora, 11 ciudades de centros con 3–4 centros | Bajo | Medio | 2.1 / 3.5 |
| 18 | Home dice «más de 140 pruebas» cuando hay 37 futuras | Bajo | Bajo | 3.1 |
| 19 | SQL de correcciones de carreras de octubre sin aplicar | Bajo | Bajo (Pablo) | Informe |
| 20 | Sin IndexNow para Bing/Copilot | Bajo | Bajo | 2.4 |
