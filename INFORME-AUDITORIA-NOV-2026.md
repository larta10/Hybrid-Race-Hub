# Informe de la auditoría SEO + SEM de noviembre de 2026

hybridracehub.com · 3 de noviembre de 2026 · punto de retorno: tag `pre-auditoria-nov`
Detalle técnico: `docs/seo/diagnostico-2026-11.md` (fase 1) y `AUDITORIA-PROGRESO-3.md` (fase a fase).

## 1. Resumen en 10 líneas

1. La web está técnicamente sana (cero errores, cero duplicados) y crece: de ~10 a ~214 visitas o impresiones diarias en tres meses.
2. El problema era otro: casi todo dependía de la home y las carreras no tenían página propia.
3. Ahora cada carrera tiene su ficha (79 en total), con fecha, sede, precio, inscripción oficial y dónde entrenar.
4. Hay calendario por meses (12 meses) y páginas de DEKA, Spartan y carreras de obstáculos.
5. La página de Madrid deja de competir con la home y ya es la que recibe los enlaces «Carreras híbridas en Madrid».
6. HURBAX no se había hundido tanto como parecía: el artículo hablaba de una final ya celebrada y competía con otras dos páginas. Está corregido.
7. Los rankings de Amazon se han reescrito para la compra (comparativa, criterios, preguntas) y ya no compiten con un artículo que decía lo mismo.
8. La medición sigue apagada: el contenedor de Google Tag Manager está vacío. Es la tarea nº 1 de Pablo (10 minutos).
9. Hay un plan de anuncios de 150-200 €/mes listo para importar, en pausa, que solo paga donde Google no nos pone arriba gratis.
10. Bing y Copilot ya tienen todas las URL (IndexNow); a Google le llegarán por el sitemap.

## 2. Puntos fuertes y cómo se han reforzado

| Lo que ya funcionaba | Qué se ha hecho |
|---|---|
| La home (53 % del peso) con «Carreras híbridas en España 2026-2027» | Title intacto. La lista de carreras entra en el primer pantallazo del móvil (1.ª tarjeta en y=597 de 844). Bloques nuevos: por comunidad (todas, con nº de carreras), por modalidad, dónde entrenar (8 ciudades), «Este mes / Próximo mes» y fecha «Actualizado». Así reparte autoridad hacia dentro. |
| `/que-es-una-carrera-hibrida` (title de octubre que funciona) | Title y definición intactos. Cada modalidad enlaza a su guía y a sus fechas; sección nueva «Tu primera carrera híbrida» con el artículo de principiantes y dos rankings. |
| `/centros-entrenamiento` (594) | H1 e intro más útiles, ciudades ordenadas por nº de centros encima del listado completo. Madrid, Barcelona, Valencia y Sevilla con texto propio; las de 10 o más centros, con reparto por código postal (los datos no traen barrio). |
| Regiones nuevas de octubre (Galicia, Baleares, Cantabria, Castilla-La Mancha) | Sus carreras enlazan a la ficha; FAQ «este mes» y «dónde entrenar HYROX»; enlaces al mes en curso. Pasan de 1-5 enlaces internos a 184. |
| Calendario HYROX (nuevo, 45) | Tabla de sedes con fechas, estado de inscripción y ficha. Es el hub de HYROX: no se ha creado `/calendario/hyrox`. |

## 3. Errores encontrados → corregidos

| Error | Corrección |
|---|---|
| Schema `Product` sin precio ni valoraciones en los 6 rankings (Google lo da como error) | `ItemList` simple con nombre y URL de cada producto |
| `SportsEvent` sin `endDate`, organizador, imagen ni disponibilidad | Completo: fin de la carrera (deducido de las notas del organizador en 18 carreras), organizador, imagen, descripción, `offers` con `availability`, URL de la ficha; solo carreras futuras |
| H1 rotos: «Rankingsde Equipamiento», «CalculadoraHYROX», «Tu perfil físico», «Colabora con nosotros» | Corregidos; el plan de entrenamiento tiene H1 real y texto en el servidor |
| `/comunidad` huérfana, con 20 palabras y en el sitemap | `noindex` y fuera del sitemap |
| Robots desigual y `lang="es"` | `index, follow, max-image-preview:large, max-snippet:-1` en todas las indexables, `lang="es-ES"`, `og:locale` único |
| LCP móvil 3,2-3,5 s | Fuentes con `display: optional` (la causa real: el repintado al llegar la fuente), imagen del hero más ligera en móvil, portada de artículos a calidad 55, fuera la precarga del logo. Resultado en el punto 8 |
| Home: «más de 140 pruebas» (había 37 futuras) | Cifra real, calculada |
| HYROX Barcelona con fecha de inicio errónea (12/11; la oficial es 11/11) | Corregida en código con fuente y fecha; SQL para Supabase |
| SQL de correcciones del 27/10 sin aplicar (Strong Race, Desafío Vega Baja, Bestial Race, Farinato…) | Correcciones aplicadas en código (`RACE_FIXES`) hasta que se ejecute el SQL |
| Faltaban en la web el Hyatlón de Gran Canaria (14-15/11) y Zaragoza (28-29/11), Hybrid Games Valencia y Survivor Madrid y Barcelona | Añadidos como eventos verificados (hyatlon.org comprobado hoy; el resto, el 27/10) |
| Pulsar «Web» o «Llamar» en un centro no se medía | Evento nuevo `center_outbound_click` |

Estado final (rastreo de producción tras el despliegue): 190 URL, 182 indexables, **0 enlaces rotos, 0 huérfanas, 0 páginas a más de 3 clics**, sitemap = rastreo, 0 titles o descriptions fuera de rango. Quedan 4 páginas con menos de 250 palabras (plan de entrenamiento, calculadora, formulario de organizadores y la categoría de podcasts), que son herramientas o formularios.

## 4. Páginas nuevas

| Tipo | URL | Cuántas |
|---|---|---|
| Fichas de carrera | `/carreras/<nombre-ciudad-año>` (p. ej. `/carreras/hyrox-madrid-2027`) | 79 en el sitemap (43 futuras + 36 celebradas hace menos de 60 días; a los 60 días pasan a `noindex`) |
| Calendario mensual | `/calendario/2026/noviembre` … `/calendario/2027/octubre` | 12; 7 indexables y 5 con `noindex` por tener menos de 3 carreras |
| Hubs por modalidad | `/calendario/deka`, `/calendario/spartan`, `/calendario/ocr` | 3 (HURBAX 0, Hyatlón 2 e Hybrid Day 1 carreras: no llegan a 3, no se crean) |
| Confianza | `/como-verificamos-las-carreras` | 1 |
| Organizadores | `/organizadores` (con sello SVG y generador del código por carrera) | 1 |
| Madrid | `/carreras-hibridas/madrid` **ya existía** con ese mismo patrón de slug: no se ha duplicado ni hace falta 301. Se ha reforzado: title «Carreras híbridas en Madrid 2026-2027: HYROX, OCR y más», intro de toda la Comunidad, FAQ propia y enlace desde la home con el anchor «Carreras híbridas en Madrid» | — |

No falta ninguna comunidad con carreras futuras: el País Vasco solo tiene carreras en Bizkaia, que cubre `/carreras-hibridas/bilbao`.

## 5. Canibalización: antes → después

| Consulta | Antes | Después |
|---|---|---|
| carreras híbridas Madrid | La home respondía con su FAQ y tenía toda la autoridad; Madrid solo recibía el anchor «Madrid» del pie | La FAQ de la home resume y enlaza a la página de Madrid; Madrid recibe «Carreras híbridas en Madrid» desde home, pie, fichas y centros |
| zapatillas HYROX | Ranking y artículo con casi el mismo title («Mejores zapatillas para HYROX…») | El artículo pasa a «Cómo elegir zapatillas para HYROX…» y enlaza al ranking como página de compra |
| HURBAX | Su guía, el comparativo HYROX vs carrera híbrida (Hurbax en title y H1) y la guía general (Hurbax en la description) | Solo la guía de HURBAX lo lleva en title y H1 |
| HYROX [ciudad] 2027 | Solo listas | Ficha por sede + calendario HYROX como hub |
| dónde entrenar HYROX Madrid | El directorio general se lo llevaba todo; la página de Madrid tenía 3 enlaces | Madrid con 185 enlaces internos, texto propio y carreras de la Comunidad |
| carreras por mes («carrera híbrida septiembre») | No había página | `/calendario/<año>/<mes>` |
| home vs `/calendario` | Title y H1 casi iguales | `/calendario` pasa a «…por mes» y añade meses, modalidades, zonas y celebradas recientemente |

## 6. Qué pasó con HURBAX

- **Puede que no haya caído tanto.** El PDF trae una métrica que no cuadra: 291 impresiones en posición 6,7 dan, con un CTR normal, entre 1 y 6 clics. El «1» del PDF encaja mejor con clics que con impresiones. Conviene confirmarlo en Search Console (tarea 3).
- **El contenido caducó el 24/10.** El primer párrafo y la FAQ hablaban en futuro de la Final Nacional del 24 de octubre; el interés de octubre era por esa final y se acabó con ella.
- **Canibalización desde el 27/10**: ese día se publicó el comparativo con «Hurbax» en title y H1, y la guía general lo metió en su description.
- **Qué se ha hecho**: title «Qué es HURBAX y HURBAX 2027: formato, sedes y fechas», H1 «Qué es HURBAX: formato, campeonato y temporada 2027», primer párrafo con la temporada 2027, tabla de las 6 pruebas de 2026 verificada hoy en hurbax.com/eventos y lo que se sabe de 2027 (hurbax.com/2027: sin sedes, «en las próximas semanas», acceso prioritario). No se inventa ninguna fecha 2027. Fuera «Hurbax» del comparativo y de la guía general.
- **Preventivo en Hyatlón y HYROX**: Hyatlón con sus dos próximas pruebas verificadas hoy en el primer párrafo; HYROX con la FAQ al día (Valencia ya celebrada, Barcelona del 11 al 15) y enlace al hub del calendario.

## 7. Rankings: estado y pendientes

- Los 6 rankings: title y H1 «Mejores … 2026: comparativa», intro de unas 100 palabras escrita desde la experiencia de competir, criterios de elección, tabla comparativa sin la columna «Nota /10» (era una valoración sin método), FAQ con `FAQPage`, `ItemList` sin `Product`, «Actualizado: 3 de noviembre de 2026», aviso de afiliación y enlaces `rel="sponsored nofollow noopener"`.
- Tarjeta sin foto: nombre, marca, «Para quién», descripción, a favor / en contra y botón «Ver precio en Amazon». Ninguna imagen de Amazon.
- Enlaces nuevos hacia los rankings desde principiantes, material, gadgets, qué es HYROX, HYROX vs carrera híbrida, calendario HYROX, guía general, fichas (bloque de material según modalidad) y pie.
- **Pendiente**: los datos técnicos de las tablas (pesos, autonomías) vienen de octubre y no se han vuelto a comprobar uno a uno; 29 de 49 productos siguen enlazando a una búsqueda de Amazon porque su ASIN no se verificó.
- **Rankings nuevos** (guantes, zapatillas para barro, chaleco lastrado, material para casa): Amazon.es sí dejó verificar fichas (4 ASIN comprobados hoy), pero no se publican porque ordenar productos que no conocemos sería inventar la valoración. Borradores con huecos en `docs/seo/rankings-pendientes.md`.
- **Imágenes de producto**: la vía conforme es la **Product Advertising API 5.0**, que Amazon solo concede con al menos 3 ventas cualificadas en los últimos 180 días, o las imágenes que genera **SiteStripe** (HTML que da Amazon, no una descarga). **Recomendación**: con los rankings sin tráfico todavía, seguir sin imágenes; cuando la cuenta tenga esas 3 ventas, pedir acceso a la API y traer las imágenes desde ella. SiteStripe solo si su barra muestra la opción «Imagen» para cada producto, porque es manual y no se actualiza sola.

## 8. PageSpeed antes / después

| URL | Disp. | Puntuación | LCP | TBT (≈INP) | CLS | Elemento LCP |
|---|---|---|---|---|---|---|
| / | móvil | 91 → 88 | 3,4 s → 3,4 s | 61 ms → 130 ms | 0 | `img` |
| / | escritorio | 100 → 100 | 0,5 s → 0,5 s | 0 ms | 0,009 | `img` |
| /centros-entrenamiento | móvil | 91 → 99 | 3,3 s → 1,9 s | 118 ms → 90 ms | 0 | `h1` |
| /centros-entrenamiento | escritorio | 100 → 100 | 0,6 s → 0,5 s | 0 ms | 0 | `h1` |
| /que-es-una-carrera-hibrida | móvil | 93 → 78 | 3,2 s → 3,6 s | 31 ms → 413 ms | 0 | `p` |
| /que-es-una-carrera-hibrida | escritorio | 100 → 100 | 0,5 s → 0,4 s | 0 ms | 0 | `h1` |
| /carreras-hibridas/andalucia | móvil | 99 → 98 | 1,9 s → 1,6 s | 9 ms → 132 ms | 0 | `p` |
| /carreras-hibridas/andalucia | escritorio | 100 → 100 | 0,6 s → 0,5 s | 0 ms | 0 | `p` |
| /blog/calendario-hyrox-espana-2026-2027 | móvil | 91 → 87 | 3,5 s → 2,2 s | 40 ms → 320 ms | 0 | `img` |
| /blog/calendario-hyrox-espana-2026-2027 | escritorio | 100 → 100 | 0,6 s → 0,5 s | 0 ms | 0,016 | `img` |
| /productos/zapatillas-hyrox | móvil | 92 → 96 | 3,4 s → 2,1 s | 11 ms → 200 ms | 0 | `p` |
| /productos/zapatillas-hyrox | escritorio | 100 → 100 | 0,5 s → 0,5 s | 0 ms | 0 | `h1` |

Medido con Lighthouse 12.6.1 en local contra producción (la API de PageSpeed dio 429 por cuota en las dos tandas). Una ejecución por URL: en este equipo la variación entre ejecuciones es de hasta ±1 s en LCP y de cientos de ms en TBT, así que hay que leer tendencias, no décimas. Sin datos de campo (CrUX necesita clave de API).

Lectura:
- **Escritorio**: 100 en todas, antes y después.
- **Móvil, mejora clara** en centros (3,3 → 1,9 s), calendario HYROX (3,5 → 2,2 s) y ranking de zapatillas (3,4 → 2,1 s), y Andalucía sigue por debajo de 2 s. La causa era el repintado de la fuente; con `font-display: optional` la primera pintura es la definitiva.
- **Guía `/que-es-una-carrera-hibrida`**: una medición aislada justo tras el cambio dio 2,05 s (puntuación 99) y la tanda completa, 3,6 s con TBT alto: es ruido de la máquina o el peso extra de la página (más secciones y pie más largo). Hay que confirmarlo con PageSpeed cuando vuelva la cuota.
- **Home**: sigue en 3,4 s. El LCP es la foto del hero: pesa 10 KB y llega a los 0,25 s, pero se pinta tarde porque `next/image` la decodifica en asíncrono mientras se ejecuta el JS. Arreglarlo del todo pide quitar la foto en móvil o pasarla a fondo CSS: es un cambio de diseño y queda como propuesta.
- **TBT** sube en móvil (de 10-120 ms a 90-410 ms) con más contenido y un pie con más enlaces. Sigue lejos de los 600 ms que penalizan mucho, pero conviene vigilarlo con datos reales de INP cuando GA4 o CrUX los tengan.


## 9. Estado de la medición

| Pieza | Estado |
|---|---|
| GTM-5D5D2CH9 | Carga en todas las páginas, pero el contenedor publicado (versión 2) **está vacío** |
| GA4 | **No existe** ninguna etiqueta `G-` |
| Eventos en el dataLayer | Funcionan en producción: `affiliate_click`, `race_outbound_click`, `center_outbound_click` (nuevo), `contact_form_submit`, `search_used`, `region_view` (7/7) |
| Consentimiento | Denegado por defecto antes de GTM; banner 13/13 |
| Píxel de Meta | No existe; plantilla preparada con `PIXEL_ID_AQUI`, solo con `ad_storage` |
| Contenedor importable | `docs/sem/gtm-container-import.json` (11 etiquetas, 6 activadores, 13 variables), instrucciones en `docs/sem/GTM-CONFIG.md` |

## 10. Plan SEM en 5 líneas

1. No se paga por «carreras híbridas», «hybrid race» ni «competiciones híbridas España» (ya top 3 gratis); solo una campaña de marca de 0,30 €/día.
2. A · Dónde entrenar (8 ciudades → páginas de centros): sola, a 5 €/día desde la semana 2.
3. B · Inscripciones (10 fichas de 2027) y C · Material (zapatillas) se activan en la semana 4 si A cumple; total ≈ 190 €/mes.
4. España con «Presencia», 46 negativas, RSA validados sin marcas de terceros en el texto y UTM en todas las URL; CPA máximo 0,40 € por clic a Amazon y 0,60 € por clic a inscripción; pausar un grupo si gasta 6 € en 14 días sin conversión.
5. Meta solo para retargeting y similares cuando el píxel lleve 2-3 semanas con datos. Todo en `docs/sem/PLAN-SEM-NOV-2026.md` y `google-ads-editor.csv` (en pausa).

## 11. Objetivos medibles en Search Console

| Plazo | Qué mirar | Objetivo |
|---|---|---|
| 30 días (3/12) | Indexación → páginas: fichas `/carreras/…` | ≥ 40 de las 43 fichas futuras indexadas |
| 30 días | Rendimiento → página `/carreras-hibridas/madrid`, consulta «carreras hibridas madrid» | Aparece con impresiones (hoy 0) |
| 30 días | Consultas «hyrox madrid 2027», «deka toledo 2027», «hyrox bilbao 2027», «hyrox malaga 2027» | Las sirve su ficha, no la home |
| 30 días | Mejoras → Eventos y Fragmentos de productos | 0 errores |
| 60 días (2/1) | «carreras hibridas madrid» | La URL que sale es `/carreras-hibridas/madrid`, posición ≤ 5 |
| 60 días | «donde entrenar hyrox en madrid» (pos. 59) → `/centros-entrenamiento/madrid` | Posición ≤ 30 |
| 60 días | `/productos/zapatillas-hyrox` con «mejores zapatillas hyrox» | Primeras impresiones (hoy 0) |
| 60 días | `/blog/que-es-hurbax` con «hurbax 2027» y «que es hurbax» | Vuelve a posición ≤ 7 y CTR ≥ 2 % |
| 90 días (1/2) | Peso de la home sobre el total del sitio | De 53 % a menos del 45 % |
| 90 días | `/calendario/2027/febrero`, `/marzo`, `/abril` | Impresiones para «carreras hibridas [mes] 2027» |
| 90 días | «donde entrenar hyrox en madrid» | Posición ≤ 15 |

## 12. Decisiones tomadas sin preguntar

1. PageSpeed Insights devolvió 429 (cuota sin clave agotada): se midió con Lighthouse 12 local contra producción, el mismo motor de laboratorio. Sin datos de campo (CrUX necesita clave).
2. Madrid ya existía como `/carreras-hibridas/madrid`: se refuerza en vez de crear otra URL; sin 301.
3. Fechas de `SportsEvent` sin hora ni zona horaria: ningún organizador publica la hora de salida de forma fiable y Google acepta fecha sola. Poner una hora sería un dato falso.
4. No se escribe en Supabase (no se pedía en ninguna fase): las correcciones verificadas se aplican en código y van en SQL para Pablo (`docs/datos/cambios-races-2026-10-27.sql` y luego `…-2026-11-03.sql`).
5. Se publican como eventos verificados las altas comprobadas el 27/10 (Hybrid Games Valencia, Survivor Madrid y Barcelona) y los dos Hyatlón comprobados hoy.
6. Las fichas de carreras celebradas hace menos de 60 días son indexables y se enlazan desde «Celebradas en los últimos 60 días» del calendario, para que no queden huérfanas.
7. Se quitó la ventana emergente de las tarjetas: ahora toda la tarjeta lleva a la ficha, donde están inscripción, calendario y compartir.
8. Se quitó la columna «Nota /10» de los rankings (valoración sin método publicado). No se publica ningún ranking nuevo.
9. El artículo de zapatillas cambia de enfoque (informativo) en lugar de redirigirse, para no perder su contenido.
10. Los anuncios no llevan marcas de terceros en el texto en ninguna campaña, no solo en la B.
11. Se añadió el evento `center_outbound_click`, necesario para medir la campaña A.
12. El pie usa listas fijas (regiones y 10 ciudades) para no cargar los 468 centros en el JavaScript de todas las páginas.
13. Fuentes con `font-display: optional` en lugar de `swap`: el repintado al llegar la fuente era lo que retrasaba el LCP móvil. En una primera visita muy lenta puede verse la fuente de reserva (con métricas ajustadas, sin saltos); en el resto, nada cambia.
14. La imagen del hero de la home sigue siendo el LCP móvil. Quitarla en móvil o pasarla a fondo CSS bajaría el LCP, pero cambia el diseño o el código de imagen: se deja como propuesta.

## 13. Tareas para Pablo

1. **Activar la medición (10 min).** [tagmanager.google.com](https://tagmanager.google.com) → GTM-5D5D2CH9 → **Administrar** → **Importar contenedor** → archivo `docs/sem/gtm-container-import.json` → espacio «Default Workspace» → **Combinar** → **Cambiar el nombre de los conflictivos** → **Confirmar**. Después **Variables** → **GA4 Measurement ID** → pon tu `G-…` → **Guardar**; pausa las 4 etiquetas «Meta Pixel» si aún no tienes píxel → **Enviar** → **Publicar**. Al día siguiente, en GA4: **Administrar → Eventos clave** → añade `affiliate_click`, `race_outbound_click`, `center_outbound_click` y `contact_form_submit`.
2. **Aplicar las correcciones de carreras (5 min).** [supabase.com](https://supabase.com) → proyecto → **SQL Editor** → **New query** → pega `docs/datos/cambios-races-2026-10-27.sql` → **Run**; otra query con `docs/datos/cambios-races-2026-11-03.sql` → **Run**.
3. **Search Console (5 min).** **Sitemaps** → `sitemap.xml` → **Enviar**. **Inspección de URLs** → `https://hybridracehub.com/carreras-hibridas/madrid` → **Solicitar indexación**; repite con `/carreras/hyrox-madrid-2027`. Y en **Rendimiento**, marca «Clics» e «Impresiones» y mira `/blog/que-es-hurbax` en los últimos 3 meses: si tiene ~1 clic y cientos de impresiones, no hubo caída, era la métrica del PDF.

(Cuando haya un rato: los emails a organizadores de `docs/seo/outreach-organizadores.md`, empezando por Spartan, HYROX y Desafío de Guerreros.)

## 14. Cómo deshacer

Todo está en `main` en commits por fase (`fase1` … `fase8`). Para volver al estado anterior a la auditoría:

```bash
git revert --no-edit pre-auditoria-nov..HEAD   # deshace los cambios con commits nuevos (recomendado)
# o, para dejar el repo exactamente como estaba:
git reset --hard pre-auditoria-nov && git push --force-with-lease
```

Vercel redespliega solo al hacer push. Supabase no se ha tocado.
