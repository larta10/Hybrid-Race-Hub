# Informe — rediseño, móvil y carreras (27/10/2026)

## 1. Resumen en 10 líneas

1. La web tiene diseño nuevo: fondo claro tipo papel, titulares en Archivo, texto en Source Sans 3 y un solo color de marca (verde pista). Ya no queda ni rastro de naranja.
2. A petición tuya, hay **modo oscuro**: por defecto sigue la configuración del móvil u ordenador y se puede cambiar con el botón de la luna o el sol de la cabecera.
3. Logo, favicon, iconos de la app e imágenes para redes sociales son nuevos y van a juego.
4. En móvil (el 76 % de tus visitas) hay una cabecera fija con buscador y un menú a pantalla completa con letra grande.
5. El calendario se filtra con botones deslizables (región, modalidad y mes). Cada filtro cambia la dirección de la página, así que se puede compartir.
6. Cada carrera se abre en una ficha con botones fijos abajo: **Inscribirme**, **Añadir al calendario** y **Compartir**.
7. Hay un aviso de cookies propio con Aceptar, Rechazar y Configurar al mismo nivel, como exige la AEPD. Google no guarda cookies hasta que el visitante acepta.
8. He verificado las 38 carreras futuras y he buscado carreras nuevas. **6 carreras nuevas** tienen la inscripción abierta, y he encontrado **8 correcciones** (una sede equivocada, enlaces que llevaban a un agregador y estados desactualizados).
9. **Esas 6 altas y las 8 correcciones todavía no están en la base de datos.** Este ordenador no tiene la clave de escritura de Supabase. Lo he dejado todo en un archivo que se pega en 1 minuto (tarea 1).
10. La velocidad en móvil mejora en las 4 páginas medidas, sin errores graves de accesibilidad y sin enlaces internos rotos. El contenedor de GTM queda listo para importarse en 3 minutos.

---

## 2. Carreras AÑADIDAS (pendientes de aplicar en Supabase con la tarea 1)

Las 6 cumplen los 4 criterios: web oficial que responde, edición con fecha futura, inscripción abierta hoy y ubicación concreta. Las evidencias completas están en `docs/datos/verificacion-carreras-2026-10.md`.

| Carrera | Fecha | Lugar | Inscripción | Lo que prueba que está abierta |
|---|---|---|---|---|
| Hybrid Day Vigo 2026 | 12-13/12/2026 | IFEVI, Vigo | [tickettailor.com/events/hybridday/2353350](https://www.tickettailor.com/events/hybridday/2353350) | "Buy tickets / Comprar tickets" activo |
| Hyatlón H6 Gran Canaria 2026 | 14-15/11/2026 | Plaza de la Música (ExpoDeca), Las Palmas | [event.addon-sport.com/es/hyatlon-gran-canaria-2026/registration](https://event.addon-sport.com/es/hyatlon-gran-canaria-2026/registration) | Cuotas a la venta (79 €), 117 inscritos en Open masculino |
| Hyatlón H8 Zaragoza 2026 | 28-29/11/2026 | Pabellón 4, Feria de Zaragoza | [event.addon-sport.com/es/hyatlon-zaragoza-2026/registration](https://event.addon-sport.com/es/hyatlon-zaragoza-2026/registration) | Cuotas a la venta (89 €), 192 inscritos en Open masculino |
| The Hybrid Games Valencia 2027 | 22-23/05/2027 | Tinglados, La Marina de Valencia | [thehybridgames.fit/es/](https://thehybridgames.fit/es/) | Categorías con precio (Singles 85 €) y carrito que llega a "Place order" |
| Survivor Race Madrid 2027 | 05-06/06/2027 | Colmenar Viejo | [survivor-race.com/carreras/survivor-madrid/](https://survivor-race.com/carreras/survivor-madrid/) | Selector de día, distancia y hora "Desde 51 €" |
| Survivor Race Barcelona 2027 | 19-20/06/2027 | Castellar del Vallès | [survivor-race.com/carreras/survivor-barcelona/](https://survivor-race.com/carreras/survivor-barcelona/) | Selector de día, distancia y hora con precios |

El Hybrid Day de Vigo ya se ve en la página de Galicia (desde `lib/verified-events.js`). Cuando apliques el SQL, la web lo detecta y deja de mostrarlo desde ese archivo, así que no saldrá dos veces.

## 3. Carreras ACTUALIZADAS (pendientes de aplicar con la tarea 1)

| id | Antes | Después | Por qué |
|---|---|---|---|
| 24 | Strong Race Otoño 2026 · "Mallorca" · web theboxinthebox.com · "Próximamente" | Velódromo Illes Balears, Palma · ficha oficial en eventos.strongrace.com · "Abierta" | La web oficial anuncia la 5ª edición del 7-8/11 con el carrito activo |
| 137 | Desafío Costa Blanca **Mutxamel** 22/11 · carrerasocr.com | **Desafío Vega Baja Redován 2026** · Redován · desde 45 € · inscripción oficial · "Abierta" | La web oficial anuncia esa fecha en Redován, no en Mutxamel |
| 139 | Bestial Race Arucas · carrerasocr.com · "Consultar" | Inscripción oficial en Chronotrack · desde 30 € · 3, 6 y 12 km | Inscripción abierta hasta el 30/11 |
| 136 | Monster Race · carrerasocr.com | monsterace.com | Web del organizador |
| 166 | Farinato Hybrid Race Madrid (otoño) · "inscripciones abiertas" | "Pendiente verificar" + nota | farinatorace.es no responde, y los calendarios públicos sitúan esa fecha en Umbrete (Sevilla). No he cambiado la sede sin una fuente oficial |
| 134, 135 | OCR Mencey, Gollizno · "Abierta" | "Pendiente verificar" | Solo tienen Instagram; no hay web que lo confirme |

Las otras 30 carreras futuras responden bien y su estado coincide con lo que dice su web.

## 4. Candidatas pendientes (no se insertan)

| Carrera | Motivo |
|---|---|
| Desafío de Guerreros Málaga (24/10/2027) | Tiene fecha, pero su página de inscripción da error 404 |
| Eolos Race Agoncillo, Torrejón y Zamora | La plataforma de inscripción bloquea la comprobación (403) |
| Farinato Race Umbrete (14-15/11/2026) | Web oficial caída |
| Supera't Alcoy (8/11/2026) | Sin web oficial |
| Fungo Race (14/03/2027) | Su inscripción muestra la edición de 2024, cerrada |
| Adrenaline Race (25/09/2027) | La web no responde |
| HURBAX 2027 | Solo hay "acceso prioritario"; aún no hay sedes |
| Hybrid Day de wezone.es (4 filas sin fecha, ids 141-144) | No se pudo leer su web; no las he tocado |
| Nuevas sedes HYROX / Spartan / DEKA | No hay más sedes españolas que las que ya están en la base |

## 5. Qué ha cambiado en el diseño

- **Fuentes**: Archivo (anchura 112 %, peso 800) para titulares y Source Sans 3 (400 y 600) para el texto. Fuera Barlow Condensed, Inter y JetBrains Mono.
- **Colores**: papel #F5F4F0, tinta #14161A y verde pista #1F5C46 como único color de marca, con versión oscura. Están todos como variables en `styles/global.css`.
- **Logo**: una "H" sobria en tinta con una línea verde de pista. El favicon, los iconos de la app y las imágenes para redes sociales siguen el mismo estilo.
- **Fuera**: degradados, desenfoques, mayúsculas espaciadas en todas partes, contadores en el hero y emojis usados como iconos.
- **Textos**: botones y etiquetas en lenguaje directo ("Ver el calendario", "Inscribirme", "Enviar mi carrera"). No he tocado titles, metas, H1 ni FAQ.

Capturas (antes → después):
- Home en móvil: [antes](docs/rediseno/antes-home-390.png) · [después](docs/rediseno/despues-home-390.png)
- Centros en móvil: [antes](docs/rediseno/antes-centros-entrenamiento-390.png) · [después](docs/rediseno/despues-centros-entrenamiento-390.png)
- Ranking en escritorio: [antes](docs/rediseno/antes-productos_zapatillas-hyrox-1440.png) · [después](docs/rediseno/despues-productos_zapatillas-hyrox-1440.png)

## 6. Lighthouse móvil, antes y después

Ambas versiones se midieron en el mismo ordenador y con la misma red simulada: la versión del tag `pre-rediseno` y la versión actual.

| Página | Rendimiento | LCP | CLS | Accesibilidad | SEO |
|---|---|---|---|---|---|
| Home | 95 → **98** | 2,7 s → **2,5 s** | 0,021 → **0** | 100 → 100 | 100 → 100 |
| /centros-entrenamiento | 89 → **93** | 3,1 s → **2,8 s** | 0 → 0 | 100 → 100 | 100 → 100 |
| /carreras-hibridas/andalucia | 96 → **99** | 2,6 s → **2,3 s** | 0,010 → **0** | 100 → 100 | 100 → 100 |
| /blog/que-es-hyrox | 94 → **97** | 2,9 s → **2,6 s** | 0,001 → **0** | 100 → 100 | 100 → 100 |

El objetivo era un LCP por debajo de 2,5 s en home y centros:
- **Home**: está justo en el límite (2,4–2,5 s según la pasada).
- **Centros**: queda en 2,8 s. La propia página carga los 468 centros para que el buscador funcione sin esperas.

Otras comprobaciones, todas correctas:
- axe-core: 0 errores críticos o graves de accesibilidad.
- 360, 390 y 1440 px: sin scroll horizontal, zonas táctiles de 44 px como mínimo y texto de 14 px o más. La única excepción es la letra oculta del logo del pie.
- Consentimiento: 13 de 13 pruebas pasan, entre ellas que no se crean cookies `_ga` antes de aceptar.
- Medición: los 6 eventos llegan a GTM.
- Producción: 0 enlaces internos rotos, y los datos estructurados (Event, FAQ, Breadcrumb, Article e ItemList) están presentes y son válidos.

## 7. Decisiones tomadas sin preguntar

1. **Supabase sin escribir.** `.env.local` solo tiene la clave de Resend, la clave pública no puede escribir y el acceso de escritura no se llegó a autorizar. Los cambios quedan en `docs/datos/cambios-races-2026-10-27.sql`. Ese archivo solo hace INSERT y UPDATE, no duplica si se ejecuta dos veces, y antes hice el backup en `backups/races-2026-10-27.json`.
2. **Valores de las altas.** Uso solo valores que ya existen en la tabla: Hyatlón e Hybrid Day van como "Functional Fitness"/`func-fitness` y el formato como "Individual, Parejas". Los relevos se explican en las notas.
3. **Farinato.** No cambio la sede (Madrid → Umbrete) sin fuente oficial: la marco "Pendiente verificar".
4. **Desafío Costa Blanca.** La corrijo a Redován porque la web oficial anuncia esa fecha allí.
5. **GA4 no estaba configurado.** El contenedor publicado está vacío. El archivo de importación incluye la etiqueta de Google con el ID `G-XXXXXXXXXX`, que hay que sustituir.
6. **Contenedor de GTM.** Añadí dos variables más de las pedidas (`search_location` y `form`) porque los eventos ya las envían.
7. **Modo oscuro (lo pediste a mitad de trabajo).** Sigue al sistema por defecto y recuerda la elección en el navegador. Lo hice con una paleta propia y sobria, sin reutilizar el tema oscuro antiguo.
8. **Archivo.** Se sirve solo la instancia que usamos (37 KB en vez de 88 KB) para no retrasar la carga.
9. **Calendario.** Ahora filtra en el navegador sobre las carreras que ya vienen en la página, y he eliminado tres consultas a Supabase en cada visita. Los enlaces antiguos tipo `?modalidad=func-hyatlon` siguen funcionando.
10. **Aviso de cookies.** Su texto es más corto y está en dos párrafos, para que no cuente como el elemento más grande de la pantalla y empeore el LCP.
11. **Lint.** Dejé como avisos los 108 `<a>` que Next sugiere cambiar por `<Link>`: no afecta a SEO y sería un refactor aparte.
12. **Brief de diseño.** Sustituí `CLAUDE_CODE_BRIEF.md` (describía el diseño antiguo, con naranja y Barlow) por el brief del diseño actual.

## 8. LO ÚNICO QUE QUEDA PARA PABLO

**1. Aplicar los cambios de carreras en Supabase (2 minutos)**
1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard) → proyecto de Hybrid Race Hub.
2. Menú izquierdo → **SQL Editor** → **New query**.
3. Abre `docs/datos/cambios-races-2026-10-27.sql`, copia todo, pégalo y pulsa **Run**.
4. En menos de una hora, las 6 carreras nuevas aparecen solas en la home, el calendario, sus regiones y el sitemap.

**2. Importar la medición en Google Tag Manager (3 minutos)**
Sigue `docs/sem/GTM-CONFIG.md`. En resumen: GTM → **Administrar** → **Importar contenedor** → archivo `docs/sem/gtm-container-import.json` → espacio de trabajo existente → **Combinar** → **Cambiar el nombre de los conflictivos** → **Confirmar**. Después: **Variables** → "GA4 Measurement ID" → pon tu `G-…` → **Enviar** → **Publicar**. Al día siguiente, en GA4 → **Administrar** → **Eventos clave**, marca `affiliate_click`, `race_outbound_click` y `contact_form_submit`.

**3. Enviar el sitemap en Search Console (30 segundos)**
[search.google.com/search-console](https://search.google.com/search-console) → **Sitemaps** → escribe `sitemap.xml` → **Enviar**.

## 9. Cómo deshacer el rediseño si no te gusta

- **Solo el aspecto visual** (fase 4): `git revert 0bbe0b7 && git push`. Puede dar conflictos porque la fase 5 se construyó encima; en ese caso, usa la opción siguiente.
- **Todo lo de hoy** (diseño, móvil, cookies y medición): `git checkout -b vuelta pre-rediseno`, comprueba que es lo que quieres y luego `git checkout main && git reset --hard pre-rediseno && git push --force`. Ojo: así también se pierden el aviso de cookies y el contenedor de GTM.
- El tag `pre-rediseno` está en GitHub y marca el estado justo antes de empezar.
