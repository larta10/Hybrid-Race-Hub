# Informe 10/11/2026: afiliación fuera, colaboración con Buscar Pareja Híbrida y análisis de Meta Híbrida

Commits: `d30d720` (aviso sonoro) · `4e431b1` (afiliación) · `569ac12` (colaboración) · `05169d7` (reel) · `4172d8b` (metahibrida) y este informe.
`npm run build` sin errores. `npm run lint` sin errores; quedan 142 avisos, los mismos que antes de empezar.

## Bloque 0: aviso al terminar

- `.claude/settings.local.json` con el hook `Stop` (dos pitidos). `.claude/` ya estaba en `.gitignore` y he añadido la línea explícita `.claude/settings.local.json`.

## Bloque 1: afiliación eliminada

### Lo que había (búsqueda en todo el repo)

| Dónde | Qué |
|---|---|
| `lib/affiliate.js`, `components/AffiliateLink.js`, `components/ProductImage.js` | Constructor de URLs de Amazon con el tag `hybridracehub-21`, botón "Ver precio en Amazon" y tarjeta de producto |
| `data/products.js`, `lib/rankings.js`, `lib/rankings-seo.js` | Catálogo de productos con ASIN y rankings A-F |
| `pages/productos.js`, `pages/productos/[categoria].js` | Rankings con botones de compra y avisos de afiliado |
| `lib/posts.js`, `content/blog/material-hyrox-carreras-obstaculos.js`, `content/blog/mejores-podcasts-hyrox-deporte-hibrido.js` | 43 enlaces `data-product` ("Ver precio en Amazon") y avisos "Como afiliado de Amazon…" |
| `pages/blog/[slug].js`, `lib/article-server.js` | Aviso automático de afiliación en artículos |
| `pages/comunidad.js` | Sección "Productos recomendados" (tabla `recommended_products` de Supabase) con enlaces a Amazon |
| `pages/_app.js`, `lib/track.js` | Listener `amazon_click` y evento `affiliate_click` |
| `lib/shared.js` (pie), `pages/aviso-legal.js`, `pages/privacidad.js`, `pages/politica-cookies.js`, `pages/sobre-nosotros.js`, `pages/index.js`, `lib/blog-categories.js` | Textos de afiliación |
| `scripts/check-affiliate-links.mjs` (+ `npm run qa:links`), `scripts/audit-links.mjs`, `scripts/check-tracking.mjs`, `scripts/gtm-build-container.mjs` | QA y medición de la afiliación |
| `supabase/seed_products.sql` | Semilla de productos con URLs de Amazon |
| `styles/global.css` | Estilos `.aff-link`, `.aff-disclosure`, `.ft-amazon`, `.product-cta` |
| Solo documentación (no se toca): `docs/sem/*`, `docs/seo/*`, `docs/informe-enlaces-afiliado.md`, auditorías antiguas, `instagram/posts/_legacy/05x-*.json` | Menciones históricas |

### Lo que se ha hecho

- **Borrados**: `lib/affiliate.js`, `lib/rankings.js`, `lib/rankings-seo.js`, `data/products.js`, `components/AffiliateLink.js`, `components/ProductImage.js`, `scripts/check-affiliate-links.mjs`, `supabase/seed_products.sql` y el script `qa:links`.
- **Artículos**: fuera los 43 enlaces de compra y los avisos. Los modelos se siguen citando como ejemplo, sin enlace.
- **Comunidad**: fuera la sección de productos recomendados.
- **Medición**: fuera `amazon_click` y `affiliate_click`. GTM (`gtm-build-container.mjs`) y `check-tracking.mjs` pasan a `partner_outbound_click`. `audit-links.mjs` ahora marca como error cualquier enlace a Amazon.
- **Legales**: aviso legal, privacidad, cookies y "sobre nosotros" sin afiliación (fecha de actualización 10/11/2026). "Sobre nosotros" explica que no hay enlaces de afiliado.
- **Menús y enlaces internos**: "Rankings" pasa a "Material" en la cabecera y a "Guías de material" en el pie, la home y el 404. Los enlaces "ranking de …" de artículos, fichas, regiones y guías ahora dicen "guía de …". Las URLs no cambian, así que no hay enlaces rotos. El sitemap mantiene las mismas URL con `lastmod` 2026-11-10.

### Páginas de productos convertidas (misma URL)

| URL | Nuevo title |
|---|---|
| `/productos` | Guías de material para HYROX y OCR: cómo elegir |
| `/productos/zapatillas-hyrox` | Cómo elegir zapatillas para HYROX: guía 2026 |
| `/productos/zapatillas-trail` | Cómo elegir zapatillas de trail para OCR: guía 2026 |
| `/productos/zapatillas-crossfit` | Cómo elegir zapatillas de CrossFit y funcional: guía 2026 |
| `/productos/relojes` | Cómo elegir reloj GPS para HYROX y OCR: guía 2026 |
| `/productos/pulsometros` | Cómo elegir pulsómetro para HYROX y OCR: guía 2026 |
| `/productos/ropa` | Cómo elegir ropa para HYROX y OCR: guía 2026 |

Cada guía tiene: qué mirar, **errores comunes** (nuevo), **qué conviene según tu perfil** (nuevo), tabla de modelos de referencia sin notas ni precios, preguntas frecuentes y enlaces internos a calendario, guías de entrenamiento, calculadora o centros. Schema: **Article + BreadcrumbList** (+ FAQPage). Ya no hay ItemList de productos, ni Product, ni Offer. Datos en `lib/guias-material.js`.

**Candidatas a 301:** ninguna. Las seis guías tienen contenido propio suficiente. Si en Search Console alguna pierde clics por cambiar de intención de búsqueda ("mejores X" frente a "cómo elegir X"), la candidata más débil es `/productos/ropa`.

## Bloque 2: Buscar Pareja Híbrida

- `components/PartnerBuscarPareja.jsx` con dos variantes:
  - **compacta** en las fichas de carrera (debajo de los datos de inscripción),
  - **destacada** ("Proyectos amigos") en `/calendario` (tras el listado) y en la home (zona "Próximas carreras").
- Enlace "Buscar pareja para competir" en el pie (grupo "Proyecto").
- Todos los enlaces llevan UTM, `target="_blank"` y `rel="noopener"`, sin nofollow. Cada clic envía `{event: "partner_outbound_click", partner: "buscarparejahibrida", placement}` al dataLayer. Placements: `ficha_carrera`, `calendario_web`, `calendario_instagram`, `home_web`, `home_instagram`, `footer`. Comprobado con Playwright.
- Revisado a 375 px: sin scroll horizontal y botón a ancho completo. He usado los colores del sistema actual de la web (fondo papel, borde fino, sin naranja), porque la web hoy no es oscura.
- **Detección** (`lib/partners.js`, `isTeamRace`): sale si `formato` o `nombre` dicen parejas, dobles, doubles, relevos, relay, equipos, team, mixto o mixed. Además sale en **todas las HYROX y DEKA**, porque varias DEKA tienen `formato` vacío y todas tienen dobles o relevos. Resultado: el bloque aparece en 28 de las 66 carreras futuras (20 por formato o nombre y 8 por ser HYROX o DEKA).
- Sin Schema para el partner.

## Bloque 3: Reel

- **Publicado**: https://www.instagram.com/reel/DfklcKpjfEz/ (media `17990981276874511`, 10/11/2026 18:48 UTC). Comprobado con la API: tipo REELS y caption idéntico al pedido.
- **Invitación de colaboración**: la API la aceptó. `/collaborators` devuelve `buscarparejahibrida · invite_status: Pending`. Monica tiene que aceptarla desde su app.
- Vídeo de 29,4 s, 1080x1920, con la narración literal (Kokoro `em_alex`; Whisper la reconoce al 100 % palabra a palabra) y subtítulos quemados. El rótulo final muestra "@buscarparejahibrida" y "hybridracehub.com".
- Clips de Pixabay (personas reales): pareja corriendo, salida de una carrera popular y pelotón de maratón. La escena de las cuerdas de batalla queda de fondo del cierre. Pixabay no tiene clips buenos de wall balls, trineo o remo en pareja (lo mismo que ya pasaba con los otros reels), así que **"Y es gratis" va como texto sobre fondo neutro**. Con un clip propio de dos personas en un box mejoraría mucho.
- Música CC0 ("Free Uplifting Music") para no tener que añadir atribución al caption exacto.
- **Sin duplicados con el post diario**: hoy ya había un reel publicado (r104, registrado con fecha 10/11), así que el cron de hoy no publica nada más. El reel especial se registra como `x01-colab-buscarpareja`, y `publish.mjs` ahora ignora los ids `x…` al comprobar si ya se publicó hoy. El guion `instagram/reels/x01-…` no entra en la cola (`loadReels` solo carga `r###`).
- Reutilizado el pipeline: Remotion (`video/`), `narrar.py`, el bucket de Supabase y `graph.mjs`. Nuevo: `scripts/instagram/publish-extra.mjs`, para publicar reels sueltos con caption exacto y `collaborators` (con respaldo sin ellos), y tres opciones de guion en el motor (`aplicacion_titulo`, `tarjeta_final`, `pronunciacion` por guion).
- No se ha usado `gh workflow run`: el workflow solo publica la cola diaria. Publicado en local con las credenciales de `.env.local` y sin imprimir tokens.

## Bloque 4: Meta Híbrida

- **metahibrida.es no existe** (DNS NXDOMAIN). La web es **metahibrida.com** y su Instagram, **@metahibrida.es**.
- Análisis completo en `docs/competencia/metahibrida.md`.
- **Instagram no se ha podido ver**: la web pública muestra el muro de inicio de sesión y la API Business Discovery responde "Application does not have permission". No he insistido.

### Pruebas importadas (26, todas comprobadas en la web oficial o en su plataforma de inscripción)

| id | Prueba | Fecha | Lugar |
|---|---|---|---|
| 205 | Hunting Teguise 003 | 14/11/2026 | Teguise (Las Palmas) |
| 206 | KGM StrongFit Race 5ª edición | 21/11/2026 | Elda (Alicante) |
| 207 | Isla Race Son Moix 2026 | 22/11/2026 | Palma |
| 208 | Playa Cambriles Race 2026 | 22/11/2026 | Lújar (Granada) |
| 209 | Hyrace Crevillente 2026 | 28/11/2026 | Crevillent (Alicante) |
| 210 | II Nexum Hybrid Project Alcoy | 05/12/2026 | Alcoy (Alicante) |
| 211 | Neptune Race 2026 | 05/12/2026 | Torrenueva Costa (Granada) |
| 212 | The Hybrid Run Antequera 2026 | 07/12/2026 | Antequera (Málaga) |
| 213 | KGM Hybrid Race Teams 2026 | 12/12/2026 | Elda (Alicante) |
| 214 | Animal Conquest 2026 | 19/12/2026 | Fuencaliente de La Palma |
| 215 | KGM Hybrid Race 13ª edición | 23/01/2027 | Elda (Alicante) |
| 216 | ATHX Valencia 2027 | 20/02/2027 | Valencia |
| 217 | Skull MiniHollywood 2027 | 03/04/2027 | Tabernas (Almería) |
| 218 | Talavera Hybrid Race (TAHYRA) 2027 | 17/04/2027 | Talavera de la Reina (Toledo) |
| 219 | WildCross Pinto 2027 | 18/04/2027 | Pinto (Madrid) |
| 220 | KGM Hybrid Race Teams 2027 | 24/04/2027 | Elda (Alicante) |
| 221 | La Última Fortaleza 2027 | 01/05/2027 | Lanjarón (Granada) |
| 222 | Hybrid T3st Race Mallorca 2027 | 08/05/2027 | Sineu (Mallorca) |
| 223 | WildCross Almería 2027 | 16/05/2027 | Almería |
| 224 | WildCross Las Rozas 2027 | 06/06/2027 | Las Rozas de Madrid |
| 225 | WildCross Valencia 2027 | 19/09/2027 | Valencia |
| 226 | Spartan Santa Susanna Weekend 2027 | 16-17/10/2027 | Santa Susanna (Barcelona) |
| 227 | FitRace Costa Brava 2027 | 17/10/2027 | Sant Pere Pescador (Girona) |
| 228 | DEKA FIT Guadalajara 2027 | 23-24/10/2027 | Guadalajara |
| 229 | Desafío de Guerreros Málaga 2027 | 24/10/2027 | Málaga |
| 230 | ATHX Bilbao 2027 | 06/11/2027 | Barakaldo (BEC) |

Comprobado en local: salen en `/calendario`, sus fichas se generan y el bloque de pareja aparece en las de parejas o equipos (ATHX, KGM Teams, DEKA) y no en las individuales. Las fichas usan ISR (1 hora) y el push redespliega la web, así que se ven sin revalidar a mano.

### Corregidas (según la web oficial)

- **HYROX Málaga 2027** (id 184): 14/04 → **15/04/2027**. La web oficial publica horarios del jueves 15 al domingo 18. Notas actualizadas.
- **Hybrid League, ronda de febrero de 2027** (id 175): 20/02 → **21/02/2027**, según la propia página del evento.

### Pendientes de verificar (36, sin insertar)

| Prueba | Fecha según Meta Híbrida | Lugar | Motivo | Fuente indicada |
|---|---|---|---|---|
| 520 Hybrid Game 2026 | 2026-12-05 | El Viso del Alcor | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/competition.aspx?id=4552 |
| Alma Guerrera 2027 | 2027-04-11 | Castañeda | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/alma-guerrera-2027/ |
| Animalada Coripe Race 2027 | 2027-03-14 | Coripe | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/animalada-coripe-race-2027/ |
| Bestial Race Gran Canaria 2027 | 2027-12-04 | Arucas | la web oficial no publica aún el día | https://ocrbestial.com/ |
| Bestial Race Tenerife – V El Secreto del Teide 2027 | 2027-03-07 | Tenerife | la web oficial muestra dos fechas (7 y 11 de marzo) | https://ocrbestial.com/ |
| Campeonato Nacional OCRA – Iberus Race 2027 | 2027-05-29 | Milagro | solo Instagram | https://www.instagram.com/iberusraceocr/ |
| Cavernícola Race 2027 | 2027-05-08 | Barbadas | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/cavernicola-race-2027/ |
| CrossHybrid Throwdown Logroño 2026 | 2026-12-12 | Logroño | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/register.aspx?id=4545 |
| Denontzat Hybrid Games Irún 2026 | 2026-11-29 | Irun | la web oficial no publica aún el día | https://denontzat.com/eventos/ |
| Desafío BootCamp Vigo 2027 | 2027-10-03 | Vigo | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/desafio-bootcamp-2026-2/ |
| Echo Hy-Race Santa Cruz | 2026-12-12 | Santa Cruz de Tenerife | web sin datos legibles | https://echohyrace.com/ |
| Farinato Race Alcobendas 2027 | 2027-05-15 | Alcobendas | web oficial no responde | https://farinatorace.es/ |
| Fungo Hybrid Race Jerez | 2026-11-28 | Jerez de la Frontera | la web oficial no publica aún el día | https://fungorace.com/ |
| Fungo Race OCR 2027 (V edición) | 2027-03-14 | El Puerto de Santa María | la web oficial no publica aún el día | https://fungorace.com/ |
| FURA Los Llanos 2027 | 2027-07-24 | Los Llanos de Aridane | web oficial no responde | https://furaworld.com/ |
| Gladiator's Arena Games 2027 (Hybrid) | 2027-02-27 | Noáin (Pamplona) | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/register.aspx?id=4415 |
| Heroican Race 2027 | 2027-06-27 | Ribadeo | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/heroican-race-2027/ |
| Hybrid Race Evolution Test Especial 2027 | 2027-01-23 | Ibi | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/register.aspx?id=4450 |
| Hybridx Games 2027 | 2027-04-03 | Vic | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/register.aspx?id=4236 |
| La Furiosa Race 2027 | 2027-05-08 | Palafrugell | solo Instagram | https://www.instagram.com/lafuriosarace/ |
| Legion Race 2027 | 2027-05-29 | Oller de Mas | web oficial no responde | https://www.legionrace.com/ |
| Llanera Race 2027 | 2027-03-21 | Llanera | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/llanera-race-2027/ |
| Me Hybrid Marbella 2027 | 2027-02-19 | Marbella | solo Instagram | https://www.instagram.com/mehybrid.events/ |
| MetCon Bigastro Games Xperience 2027 | 2027-03-21 | Bigastro | fuente es un calendario de cronometraje, no el organizador | https://www.alcanzatumeta.es/metcon-bigastro-games-xperience-2027/ |
| Pirates Race Bétera 2027 | 2027-09-25 | Bétera | web sin datos legibles | https://www.piratesrace.com/ |
| Pirates Race Cortes de Pallás 2027 | 2027-04-25 | Cortes de Pallás | web sin datos legibles | https://www.piratesrace.com/ |
| Poseidon Race 2027 | 2027-05-22 | Cerceda | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/poseidon-race-2027/ |
| Pretorian Race Lugo 2027 | 2027-05-01 | Lugo | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/pretorian-race-2027/ |
| Rustica Race 2027 | 2027-03-06 | Loja | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/rustica-race-2027/ |
| Salas Lobo Race 2027 | 2027-09-05 | Salas | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/salas-lobo-race-2027/ |
| Samurai Xtreme Race 2027 | 2027-07-02 | As Pontes de García Rodríguez | la web oficial no publica aún el día | https://samuraixtremerace.es/ |
| SOM Urban Race 2026 | 2026-11-15 | Palma | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://sportmaniacs.com/es/services/inscription/som-urban-race-2026 |
| Steelman H12/24 Race Fuerteventura 2027 | 2027-07-02 | Fuerteventura | fecha confirmada, pero no está claro que sea carrera híbrida | https://www.steelmanrace.com/es/races/fuerteventura/h24-team |
| The Last Race – Hybrid Niwala 2026 | 2026-12-19 | Novelda | plataforma bloquea la consulta (WodBuster/Sportmaniacs) | https://arena.wodbuster.com/register.aspx?id=4507 |
| Uros Race 2027 | 2027-09-12 | Toén | solo en agregador (carrerasocr.com) | https://carrerasocr.com/events/uros-race-2027/ |
| Wave Hybrid Race 2027 | 2027-01-30 | Torroella de Montgrí | WodBuster confirma 30/01/2027 pero no el lugar | https://arena.wodbuster.com/register.aspx?id=4469 |

Fuera del alcance a propósito: 49 competiciones de CrossFit (*throwdowns*) y 17 maratones y carreras populares de su calendario.

## Top 5 ideas del análisis

1. Páginas "carreras por parejas / dobles / equipos" por modalidad, con el bloque de Buscar Pareja Híbrida.
2. Suscripción .ics al calendario (completo, por modalidad y por comunidad).
3. Fichas más completas: divisiones, cómo llegar, compartir por WhatsApp y FAQ propia con FAQPage.
4. Sello visible "confirmada por el organizador / por confirmar" con recuento en el calendario.
5. Guía de HYROX dobles y relevos (reparto de estaciones), enlazada desde las fichas y desde Buscar Pareja.

## Decisiones tomadas por mi cuenta

- Dominio de la competencia: metahibrida.com, porque el .es no existe.
- Colores del bloque partner: los tokens actuales de la web (papel y tinta), no una estética oscura que ya no tiene.
- Bloque de pareja también en todas las HYROX y DEKA, aunque el formato esté vacío.
- Reel: música CC0 y caption exacto, **sin** las líneas automáticas "Voz generada con IA." y "Vídeo: Pixabay" que añade la cola diaria. Pixabay no exige atribución, pero lo de la voz es una práctica de transparencia del proyecto. Si se quiere, se añade en un comentario fijado.
- Reel: velocidad de voz 0,97 (en vez de 0,9) solo para este guion, para quedar en menos de 30 s.
- Reel: "Y es gratis" sin clip, porque no había metraje de pareja entrenando que fuese bueno. Descarté un clip que encuadraba solo la espalda de una chica y otro con una mano delante.
- Importación: solo el núcleo (híbridas, OCR, DEKA, ATHX, Spartan). No he dado por oficiales carrerasocr.com ni Instagram. MetCon Bigastro, Bestial Tenerife 2027 y Steelman Fuerteventura quedan pendientes aunque aparezca la fecha.
- Modalidad de WildCross: OCR (obstáculos y retos). ATHX, KGM, Hyrace, Nexum, TAHYRA, Hybrid Run, Hybrid T3st y FitRace: "Functional Fitness" (`func-fitness`), como Athlon X.
- `estado`: "Abierta" si la web muestra inscripción, "Próximamente" si no, y "Cerrada" en las KGM sin plazas.
- La sección "Productos recomendados" de /comunidad se ha quitado del código, pero la tabla `recommended_products` sigue en Supabase (sin uso). Se puede borrar cuando quieras.
- Las menciones a la afiliación en documentos antiguos (`docs/sem`, `docs/seo`, auditorías y posts `_legacy` de Instagram) se dejan como histórico. En GTM hay que **pausar la etiqueta y la conversión `affiliate_click`** y crear `partner_outbound_click` (el JSON de importación ya está actualizado en el script).
