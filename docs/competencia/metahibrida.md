# Competencia: Meta Híbrida (metahibrida.com)

Revisado el 10 de noviembre de 2026. Solo hechos e ideas, sin copiar textos.

> El dominio del encargo, **metahibrida.es, no existe** (NXDOMAIN). La web está en **metahibrida.com**, y su Instagram es **@metahibrida.es**.

## 1. Qué es

Web en español para debutantes de HYROX y carreras híbridas. El negocio son **planes de pago**: "Plan Debutante 12 semanas" (24 €) y "Puesta a punto 21 días" (9 €), más una muestra gratis de 3 días a cambio del email. El calendario y las guías sirven para atraer tráfico hacia esos planes, que aparecen en el menú, en la home y en la FAQ de cada ficha de carrera.

Tecnología: sitio estático (sitemap `sitemap-index.xml` de Astro), HTML servido en ~0,15 s de TTFB, 3-4 scripts por página y mapas con Leaflet + OpenStreetMap.

## 2. Estructura y tipos de página (306 URL en el sitemap)

| Tipo | URL | Nº | Notas |
|---|---|---|---|
| Home | `/` | 1 | Muy poco texto. Propuesta: guías, calculadora, plan de pago y calendario |
| Calendario general | `/calendario/` | 1 | 173 pruebas en una sola página: búsqueda, filtros (modalidad, comunidad), vistas mapa / lista / mes |
| Calendario por año | `/calendario/2026/`, `/2027/` | 2 | |
| Por modalidad | `/calendario/hyrox/`, `/deka/`, `/ocr/`, `/hyatlon/`, `/athx/`, `/crossfit/`, `/hibridas/`, `/carreras/` | 8 | |
| **Modalidad × formato o sexo** | `/calendario/hyrox/dobles/`, `/crossfit/mixto/`, `/athx/femenino/`… | ~35 | Páginas programáticas para búsquedas como "HYROX dobles 2026" |
| Por zona | comunidades, provincias y ciudades (`/calendario/madrid/`, `/calendario/bizkaia/`, `/calendario/arucas/`…) | ~45 | Mezclan los tres niveles al mismo nivel de URL |
| Ficha de prueba | `/calendario/evento/<slug>-<año>/` | 173 | Ver abajo |
| Guías | `/guias/<slug>/` | 27 | Todas de HYROX: pesos, dobles, relevos, pacing, Roxzone, tapering, sled push, wall balls, zapatillas, plan 12 semanas… |
| Herramientas | `/calculadora-ritmos/`, `/elige-tu-nivel/` | 2 + 2 en el menú ("Plan de carrera por partes", "¿Dónde me deja mi tiempo?") | |
| Captación | `/lista-de-espera/`, `/calendario/enviar-evento/` | 2 | Email a cambio de 3 días de plan; formulario para organizadores |
| Venta | `/puesta-a-punto-21-dias/` y plan 12 semanas | 2 | Schema Product + Offer |
| Legales | aviso legal, privacidad, cookies, condiciones de venta, aviso de salud | 5 | |

### La ficha de carrera

- Fecha, estado ("Confirmada: figura en la web de la organización" frente a "prevista"), sede con dirección y coordenadas.
- Formato (individual, parejas, relevos), categoría por sexo, **divisiones** (Open, Pro, Doubles…), distancia o estaciones, **nivel orientativo**.
- Botones: web oficial, inscribirse, **añadir a Google Calendar / Apple / Outlook**, **cómo llegar** (Google Maps y OSM), compartir por WhatsApp.
- FAQ con Schema FAQPage (¿cuándo?, ¿dónde?, ¿qué formatos?, ¿qué plan me sirve?). La última pregunta vende su plan.
- Title tipo "HYROX Madrid: fecha, lugar, categorías y precios (2027)".

## 3. SEO

- **Titles**: muy orientados a la búsqueda ("Calendario HYROX España 2026/27: fechas, ciudades y mapa", "HYROX Parejas / dobles en España 2026/27: fechas y eventos"). Año de temporada en casi todos.
- **H1** únicos y descriptivos en todas las páginas revisadas.
- **Schema**: SportsEvent con `sameAs` (web oficial), Place + PostalAddress + GeoCoordinates y BreadcrumbList en fichas; ItemList + FAQPage en listados; Article + FAQPage en guías; Product + Offer (con detalles de envío y devolución en un producto digital) en home y planes.
- **URLs** limpias y en español. Zonas de distinto nivel (comunidad, provincia, ciudad) cuelgan todas de `/calendario/<zona>/`.
- **Enlazado interno**: menú con 6 guías y 3 calculadoras en todas las páginas; el listado general tiene ~440 enlaces internos.
- **Sitemap**: un único sitemap con 306 URL. Nosotros publicamos ~210.
- **Velocidad en móvil (aparente)**: buena en fichas y guías (40-90 KB de HTML). El **calendario general pesa 1,3 MB de HTML** y `/calendario/2027/` 0,8 MB, porque mete los 173 eventos con todos sus detalles en la página. En móvil con mala cobertura se nota.
- Enlace "Mes" en el menú del calendario, pero `/calendario/mes/` da 404.

## 4. Funcionalidades que tienen y nosotros no

1. **Mapa** de pruebas (Leaflet + OSM) con filtro.
2. **Suscripción al calendario** (Google y Apple) que se actualiza sola, por modalidad.
3. Páginas **modalidad × formato** (dobles, mixto, equipos) y **modalidad × sexo**.
4. En la ficha: **divisiones y categorías**, nivel orientativo, **cómo llegar**, compartir por WhatsApp y coordenadas.
5. Distinción visible **confirmada / prevista** con recuento en la cabecera ("132 confirmadas por el organizador y 41 previstas").
6. Calculadoras extra: "Plan de carrera por partes" y "¿Dónde me deja mi tiempo?" (percentil), y "Elige tu nivel" con tiempos de referencia.
7. **Formulario público "Enviar evento"** enlazado desde el calendario.
8. Captación de email con una muestra gratis del plan.

Lo que tenemos nosotros y ellos no: directorio de **centros de entrenamiento** por ciudad, páginas de **calendario por mes**, guía pilar "qué es una carrera híbrida", blog más amplio (OCR, Hyatlón, HURBAX, material) y un Instagram que publica a diario con reels.

## 5. Instagram (@metahibrida.es)

No se ha podido ver. La web pública de Instagram devuelve el muro de inicio de sesión y la API (Business Discovery) responde "Application does not have permission". No he insistido. Lo único seguro es que la web enlaza a @metahibrida.es. Para revisarlo hay que entrar con la app.

## 6. Puntos débiles (donde podemos ganarles)

- **Calendario general muy pesado en móvil** (1,3 MB de HTML). El nuestro pesa ~90 KB.
- **Mezcla de nicho**: incluyen maratones, medias, San Silvestres y casi 50 *throwdowns* de CrossFit. El calendario de "carreras híbridas" se llena de ruido.
- **41 de 173 pruebas sin confirmar**, y varias "webs oficiales" son agregadores (carrerasocr.com) o perfiles de Instagram.
- **Guías solo de HYROX**: nada de OCR, Spartan, DEKA a fondo, Hyatlón ni HURBAX.
- **Home casi sin texto** y Schema Product con envío y devoluciones en un producto digital (Google puede ignorarlo o marcarlo).
- **Todo empuja a vender el plan**: menos neutral que una guía independiente. Nosotros no vendemos nada y podemos decirlo.
- Sin directorio de dónde entrenar ni contenido por ciudad más allá del listado.
- Enlace roto a `/calendario/mes/`.

## 7. Top 10 ideas para Hybrid Race Hub (de más a menos impacto por esfuerzo)

| # | Idea | Objetivo | Esfuerzo |
|---|---|---|---|
| 1 | **Páginas "carreras por parejas / dobles / equipos"**: una general y una por modalidad (HYROX dobles, DEKA parejas, OCR por equipos), generadas desde `formato` y con el bloque de Buscar Pareja Híbrida | Tráfico orgánico + referencia (partner) | Bajo-medio: los datos ya existen (`isTeamRace`) |
| 2 | **Suscripción .ics al calendario** (todo, por modalidad y por comunidad) con botón "Añadir a Google / Apple" | Referencia y recurrencia | Bajo: ya generamos `.ics` por carrera |
| 3 | **Ficha más completa**: divisiones y categorías, "cómo llegar" (Google Maps), compartir por WhatsApp y FAQ propia con FAQPage (cuándo, dónde, qué formatos, cómo prepararla) | Tráfico long tail ("HYROX Madrid 2027 fecha") | Medio |
| 4 | **Sello "confirmada por el organizador" frente a "por confirmar"** y recuento en la cabecera del calendario | Confianza y CTR | Bajo: ya tenemos `estado` y la página de cómo verificamos |
| 5 | **Guía "HYROX dobles: cómo repartir las estaciones"** y otra de relevos, enlazadas desde las fichas de dobles y desde Buscar Pareja | Tráfico orgánico + Instagram (carrusel/reel) | Medio |
| 6 | **Mapa ligero** solo en `/calendario` (cargado al pulsar "Ver mapa", para no penalizar el móvil) | UX y enlaces naturales | Medio |
| 7 | **"Enviar tu carrera"** visible en el calendario y en cada región, apuntando a contacto-organizadores | Referencia (organizadores) y datos frescos | Bajo |
| 8 | **Reels "carreras de este finde"** y "nuevas carreras del mes" por zona, con colaboración (`collaborators`) del organizador, que ya hemos probado que funciona | Instagram | Bajo-medio: el pipeline ya existe |
| 9 | **Calculadora "¿dónde me deja mi tiempo?"** (percentil por categoría) junto a la calculadora HYROX actual | Tráfico orgánico + enlaces | Medio |
| 10 | **Contenido que ellos no cubren**: OCR (Spartan por distancias, cómo elegir tu primera OCR por región), DEKA y Hyatlón a fondo | Tráfico orgánico | Medio, sostenido |

## 8. Pruebas importadas

Comparación de sus 173 pruebas con nuestra tabla `races` (normalizando nombre, fecha y ciudad): 41 coincidían, 128 no estaban. De las 62 del núcleo (híbridas, OCR, DEKA, ATHX, Spartan), **26 confirmadas en la web oficial** del organizador o de su plataforma de inscripción se han insertado (ids 205-230). El resto queda pendiente de verificar. Detalle en `docs/informes/2026-11-10-colaboracion-afiliacion-metahibrida.md`.

Quedan fuera a propósito 49 competiciones de CrossFit (*throwdowns*) y 17 maratones y carreras populares: no son el foco de la web. Si se quieren, hay que verificarlas una a una igual que las demás.
