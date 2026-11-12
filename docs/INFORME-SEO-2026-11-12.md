# Informe SEO — 12 de noviembre de 2026

Datos de Search Console, últimos 28 días: **2.459 clics · 32.000 impresiones · CTR 7,7 % · posición media 6,8**. El 52 % de los clics entra por la home.

El problema que ataca este trabajo: páginas con muchas impresiones y CTR bajo (guías, calendario HYROX y centros).

## DAFO

| | |
|---|---|
| **Fortalezas** | Dominio de «carreras hibridas españa 2027/2026» (posición 1-2). Crecimiento ×3 en cuatro semanas. Páginas de comunidad con CTR del 13-25 %. |
| **Debilidades** | Dependencia de la home (52 % de los clics). CTR bajo en guías y centros. CI roto desde `d241150` (arreglado en este trabajo). |
| **Oportunidades** | Hybrid Day 2027 (cuando se anuncie España). HYROX 2027 («hyrox españa 2027», «hyrox barcelona 2027»). A Coruña. Liga híbrida Andalucía 2027. Centros que nos escriben para aparecer (Sport Training Murcia). |
| **Amenazas** | hybridracemap.com y otros agregadores. Next sin parchear (resuelto: 14.2.35). Fichas de carreras caducadas si no se enlaza la siguiente edición. |

## Títulos: antes y después

| Página | Antes | Ahora |
|---|---|---|
| `/que-es-una-carrera-hibrida` | Qué es una carrera híbrida (hybrid race) y cómo funciona | Qué es una carrera híbrida: formato, estaciones y cómo empezar |
| `/blog/calendario-hyrox-espana-2026-2027` | Calendario HYROX España 2026-2027: sedes y fechas | Calendario HYROX España 2027: Barcelona, Bilbao, Madrid y Málaga |
| `/blog/que-es-el-hyatlon` | Qué es el Hyatlón: formatos H6 y H8 y próximas fechas | Hyatlón: qué es, formatos H6 y H8 y próximas pruebas |
| `/blog/que-es-hurbax` | Qué es HURBAX y HURBAX 2027: formato, sedes y fechas | HURBAX: qué es, formato y fechas de HURBAX 2027 |
| `/centros-entrenamiento` | Dónde entrenar HYROX y OCR en España \| Hybrid Race Hub | Centros para entrenar HYROX y carreras híbridas en España |
| `/centros-entrenamiento/{ciudad}` | Dónde entrenar HYROX en {Ciudad}: gimnasios y boxes | HYROX en {Ciudad}: {N} centros para entrenar \| Hybrid Race Hub (sin marca si pasa de 60) |
| `/carreras/{slug}` (futuras) | {Carrera}: fecha e inscripción | {Carrera}: {12-13 dic}, inscripción y categorías (si no cabe: «{fecha} e inscripción») |
| `/carreras/hybrid-day-vigo-2026` | Hybrid Day Vigo 2026: fecha e inscripción \| Hybrid Race Hub | Hybrid Day Vigo 2026: 12-13 dic, inscripción y categorías |

Dos títulos pasan de 60 caracteres porque se pidieron literales: la guía (62) y el calendario HYROX (64). Google los puede cortar por la derecha; lo importante va al principio.

H1 nuevos: «Dónde entrenar HYROX en {Ciudad}» en centros por ciudad y «Centros para entrenar HYROX y carreras híbridas en España» en el índice.

## Qué más cambia

- **Guía «Qué es una carrera híbrida»**: definición directa de 55 palabras justo bajo el H1 (candidata a fragmento destacado) y una línea de enlaces al calendario, al plan de entrenamiento y a seis comunidades. El FAQPage ya existía; no se ha duplicado.
- **Calendario HYROX**: la tabla de sedes (sede, fechas, recinto, inscripción, enlace a la ficha) sube al principio y sale de Supabase. Un H2 por sede: HYROX Barcelona 2027, Bilbao 2027, Madrid 2027 y Málaga 2027. En Barcelona se dice la verdad: la edición de esta temporada es del 11 al 15 de noviembre de 2026 y la fecha de 2027 no está publicada.
- **Hyatlón y HURBAX**: el bloque «Próximas pruebas» enlaza al hub `/calendario/hyatlon` o `/calendario/hurbax` cuando existe (hacen falta 3 carreras con fecha) y, mientras no, al calendario general. Hoy ninguno de los dos hubs está publicado, así que enlazan a `/calendario`. Ya no queda ningún enlace interno a `/calendario?modalidad=…`.
- **Centros por ciudad**: meta con el número de centros y la próxima carrera de su comunidad; sección «Próximas carreras cerca de {Ciudad}» (4 como mucho, con enlace a la ficha) y enlace a `/carreras-hibridas/{comunidad}`. El schema ItemList se mantiene.
- **Fichas de carrera**: «Dónde entrenar en {ciudad}» (primero la ciudad de la propia carrera) y «Otras carreras en {comunidad}». Las ya celebradas siguen dando 200 con el aviso «Esta edición ya se celebró» y el enlace a la próxima edición si la hay.
- **Home**: lista de texto con las seis fichas más próximas y, en «Dónde entrenar», primero Madrid, Vigo, Barcelona, Palma, Zaragoza y Sevilla.
- **Sitemap**: `lastmod` del 12/11/2026 en las plantillas tocadas; incluye las 11 fichas nuevas y `/centros-entrenamiento/murcia`.

## Carreras añadidas (ids 231-241 en `races`)

| Carrera | Fecha | Lugar | Verificación |
|---|---|---|---|
| Fungo Hybrid Race Jerez 2026 | 28 nov 2026 | Recinto Ferial, Jerez | runnink.com |
| Battle Cancer Barcelona 2026 | 12 dic 2026 | Fira de Barcelona, Montjuïc | battlecancer.com |
| Echo Hy-Race Santa Cruz 2026 | 12 dic 2026 | Santa Cruz de Tenerife | chronotrackcanarias.com |
| ATHX Madrid 2027 | 8-9 may 2027 | IFEMA Madrid | athxgames.com |
| FURA Los Llanos 2027 | 24 jul 2027 | Los Llanos de Aridane | sportmaniacs.com y furaworld.com |
| DEKA Alicante 2027 | 30-31 oct 2027 | Alicante (recinto por anunciar) | tienda de entradas de Spartan; la ficha de es.spartan.com aún enseña 2026 |
| ACRON10 Murcia 2027 | 27-28 feb 2027 | Palacio de los Deportes de Murcia | acron10.es confirma formato e inscripciones del 28 de febrero; recinto y reparto por días, de hybridracemap |
| MFC Hybrid Series Mijas — Febrero 2027 | 13 feb 2027 | Hipódromo de Mijas | **sin fuente oficial** (ver abajo) |
| MFC Hybrid Series Mijas — Mayo 2027 | 15 may 2027 | Hipódromo de Mijas | **sin fuente oficial** |
| MFC Hybrid Series Mijas — Noviembre 2027 | 6 nov 2027 | Hipódromo de Mijas | **sin fuente oficial** |
| Gladiators Arena Games Pamplona 2027 | 27 feb 2027 | Navarra Arena | fecha en el calendario de OCR Aragón; la web oficial y la agenda del Navarra Arena aún no la tienen |

Las cuatro últimas filas sin confirmación del organizador están insertadas con estado «Próximamente», no «Abierta».

## Pendientes de confirmar (no insertado)

- **Hybrid Day 2027 en España** (Madrid, Valencia, Sevilla): hybrid-day.com solo anuncia Vigo (12-13 dic 2026, ya en el calendario) y dos citas en Portugal: Aveiro (23 ene 2027) y Santa Maria da Feira (26-27 mar 2027).
- **Liga Híbrida Andalucía 2027**: la web oficial tiene abiertas las inscripciones, pero no publica sedes ni fechas. En prensa se habla de Sevilla el 23-24 de enero y final en La Cartuja el 25-26 de septiembre, con Jaén, Marbella y Córdoba en medio.
- **A Coruña / Galicia**: ninguna carrera híbrida anunciada para 2026-2027 en fuente oficial, aparte de las de Vigo que ya están.
- **MFC Hybrid Series Mijas**: mijasfitnesschallenger.com no resolvía el 12/11 y el Instagram del organizador solo hablaba del evento de octubre de 2026. Conviene pedir confirmación de las tres fechas.
- **Gladiators Arena Games 2027**: confirmar fecha e inscripción cuando la organización actualice su web.

## Qué medir dentro de 4 semanas (hacia el 10 de diciembre)

1. **CTR de `/que-es-una-carrera-hibrida`** (hoy 1,3 % con 2.833 impresiones). Objetivo: por encima del 3 %. Mirar si «que es una carrera hibrida» (posición 2,8) empieza a dar clics o si aparece fragmento destacado.
2. **Calendario HYROX** (3,2 % con 3.545 impresiones): clics de «hyrox españa 2027», «hyrox barcelona 2027» y «calendario hyrox 2027». Objetivo: CTR del 5 % y posición por debajo de 6 en «hyrox españa 2027».
3. **Hyatlón y HURBAX** (0,9 % y 0,6 %): clics de «hurbax» y «hurbax 2027».
4. **Centros por ciudad**: impresiones, posición y CTR de «hyrox zaragoza», «hyrox sevilla», «hyrox murcia», «hyrox vigo», «hyrox valladolid» y «hyrox cordoba». Objetivo: pasar de posición 8-9 al top 5 y CTR por encima del 4 %.
5. **Índice de centros**: posición de «hyrox cerca de mi» (hoy 12).
6. **Hybrid Day Vigo 2026**: CTR de la ficha (hoy 4 %) hasta la semana de la carrera.
7. **Reparto del tráfico**: porcentaje de clics que entra por la home (hoy 52 %). Debería bajar si suben guías, centros y fichas.
8. **Indexación**: que las 11 fichas nuevas estén indexadas y que `/calendario?modalidad=func-hurbax` deje de aparecer en el informe de páginas.
9. **CI**: que GitHub Actions siga en verde.
