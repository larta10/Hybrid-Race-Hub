# Instagram · progreso de los carruseles científicos y los Reels

Actualizado: 7 de noviembre de 2026. Objetivo: 60 carruseles en el formato nuevo. Hechos: 21. Pendientes: 39.

## Reels (desde el 7 de noviembre de 2026)

Cada tema puede salir como Reel de 20-40 s en vez de carrusel. Proyecto de vídeo en `video/` (Remotion, ver `video/README.md`), guiones en `instagram/reels/`, música en `instagram/music/`.

**Regla de oro:** el humano siempre es vídeo real de stock (Pixabay). Nunca se dibujan ni se animan personas con código. Si no hay un clip bueno para un movimiento, esa escena se queda en texto y gráfica sobre fondo neutro (`"sin_clip": true`).

### Estado

| Qué | Estado |
|---|---|
| Guiones de Reel | 21 de 21 (`r101` a `r121`), mismas fuentes verificadas que los carruseles. `npm run ig:validate` los comprueba |
| Reels listos (clips revisados + control de calidad, `qa_ok`) | **4 + calendario**: r103, r104, r105, r109 y `_calendario` |
| Pendientes de clips y control de calidad | r102 (sale hoy como carrusel), r107, r108, r110-r121. r101 y r106 ya salieron como carrusel: sus reels no se publicarán |
| Fuente de vídeo | Pixabay (API con `PIXABAY_API_KEY`, búsquedas cacheadas 24 h). Pexels sigue soportado, desactivado sin `PEXELS_API_KEY` |
| Copia propia de los clips | Cada clip aprobado se recorta a 9:16 en su tramo y se sube al bucket `instagram/clips/`. El render nunca enlaza a Pixabay |
| Anillos de músculo | Colocados y verificados en r109 (rodilla, con keyframes). El resto de escenas con `musculo` tiene el nombre y espera clip |
| Música | 8 pistas de Openverse (5 CC0, 3 CC BY), ver `instagram/music/LICENCIAS.md`. Las CC BY añaden la atribución al caption |

Fechas previstas con el calendario semanal (el reel sale si está listo; si no, el carrusel del mismo tema): dom 8 nov r103 · lun 9 calendario · mar 10 r104 · mié 11 r105 · jue 12 al sáb 14 carruseles (112, 107, 108) · dom 15 r109.

Notas de metraje:
- Pixabay casi no tiene estaciones de HYROX (trineo, wall balls, sandbag lunges, farmers carry con mancuernas). Esas escenas van sin clip. r104 (sled push) tiene sus 11 primeros segundos sin metraje: mejoraría mucho con vídeo propio de un trineo.
- Descarta clips con logos de marcas visibles, con la persona encuadrada solo de cuello para abajo cuando no hace falta, o que no enseñen el movimiento del texto.

Vistas previas: `instagram-preview/reels/` (r103, r104, r105, r109 y `calendario-prueba`). Los archivos están en `D:\hrh-video\preview-reels`.

### Narración y subtítulos (desde el 7 de noviembre de 2026)

- **Voz activada: Kokoro-82M, voz `em_alex`** (`"activa": true` en `instagram/reels/voz.json`). Local y gratuita, sin cuentas, sin claves y sin servicios online. Tiempos por palabra con faster-whisper (modelo small).
- Licencia: pesos Apache-2.0, modelo base StyleTTS2-LJSpeech (MIT, datos de dominio público) y datos de entrenamiento permisivos según su ficha. Revisión completa, candidatas descartadas (Chatterbox: datos y modelo base sin licencia clara; Piper davefx/sharvard/mls: bases de "solo investigación" o no comerciales) y puntuaciones en `instagram/reels/VOCES.md`.
- Elegida por puntuación automática (`video/scripts/probar_voces.py`): inteligibilidad con Whisper, distinción castellana /s/-/θ/, naturalidad y términos en inglés. Muestras en `instagram-preview/voces/`.
- Ajustes: velocidad 0,9, pausas de 220 ms entre frases. Posproceso con ffmpeg (ecualización suave, compresión ligera, ~-14,7 LUFS).
- Cambiar de voz: `"voz"` (`em_alex`, `ef_dora`) o `"motor": "piper"` + `"modelo"` en `voz.json`, y `python video/scripts/narrar.py <reel_id>…`. El render rechaza un audio que no sea de la voz configurada.
- Guion hablado: campo `"narracion"` de cada guion (una frase por escena + conclusión, qué hacer y cierre; 75-100 palabras, números escritos como se dicen). Hecho en r103, r104, r105 y r109; pendiente en los demás (añádelo al revisar sus clips).
- Audio y tiempos en `instagram/reels/audio/<id>.mp3` y `<id>.words.json`, con hash del texto y la voz: el workflow solo los regenera si cambian (instala Kokoro con caché; en los dry runs hace además una prueba rápida de la voz).
- Alineación de subtítulos: transcribe cada escena con y sin pista y se queda con la que casa con el guion (`coincidencia` en words.json; avisa si baja del 70 %).
- Pronunciación: `instagram/reels/pronunciacion.json` (común) y `pronunciacion.kokoro.json` (HYROX = "Jai rox"). "sled" se dice "trineo".
- El caption añade "Voz generada con IA." cuando el reel lleva voz (Kokoro no exige más atribución). La API de Instagram no permite marcar contenido generado con IA.
- Respaldo: sin narración válida, el reel sale con texto y música; si falla el render, sale el carrusel.

Dependencias locales en este equipo (todo en D:): Python 3.12 en `D:\hrh-video\py` (creado con `D:\hrh-video\uv\uv.exe`), modelo de Kokoro en `D:\hrh-video\models\kokoro`, voces de Piper en `D:\hrh-video\voces`, Whisper en `D:\hrh-video\whisper`. Para generar: `WHISPER_MODELS_DIR=D:\hrh-video\whisper D:\hrh-video\py\Scripts\python.exe video\scripts\narrar.py r1NN-slug`.

### Cómo continuar (instrucciones para la siguiente sesión)

Pega esto en Claude Code dentro del repo:

> Continúa los Reels siguiendo instagram/PROGRESO.md: elige y revisa los clips de Pixabay de los próximos reels pendientes, coloca los músculos, escribe su narración y genera la voz, renderiza, haz el control de calidad y marca qa_ok.

Pasos por reel (empieza por los que tocan antes en el calendario), desde `video/`:

1. `node scripts/fetch-clips.mjs buscar r1NN-slug` → hoja de candidatos en `video/out/frames/candidatos/r1NN-slug.jpg` (una fila por escena, el último hueco es el fondo final). Para repetir un hueco con otra búsqueda: `--rehacer=N --q="otra búsqueda"`.
2. `node scripts/fetch-clips.mjs elegir r1NN-slug 1=3:0.5 2=pixabay-12345:0.4:2 …` (hueco=candidato o id:centro_x:inicio:zoom) → hoja de 3 fotogramas por clip vertical en `video/out/frames/clips/`. Revísala: movimiento claro, sin borrosidad, sin logos, coherente con el texto. `sinclip r1NN-slug N` si no hay nada adecuado.
3. Músculos: en las escenas con `musculo`, pon `clip` ("pixabay-ID"), `x`, `y` (0-1 sobre el fotograma vertical) y `keyframes: [{t, x, y}]`. Verifica renderizando y sacando un fotograma cada 0,25 s de la escena.
4. `node scripts/fetch-clips.mjs aprobar r1NN-slug todos` (recorta y sube a nuestro bucket).
5. `node scripts/render.mjs r1NN-slug --out=../instagram-preview/reels --solo-revisados` y `node scripts/frames.mjs video ../instagram-preview/reels/r1NN-slug.mp4`. Revisa la hoja de contactos.
6. Narración: añade `"narracion"` al guion (mira r103 como modelo) y genera la voz con `narrar.py` (ver arriba).
7. Si todo está bien, `"qa_ok": true` en el guion, `npm run ig:validate` y commit.

En este equipo el disco C: va justo: todo lo pesado está en `D:\hrh-video` (dependencias de vídeo, navegador de Remotion, caché de clips, renders, vistas previas y un Node portátil en `D:\hrh-video\node`). Renderiza con `TEMP` y `TMP` apuntando a `D:\hrh-video\tmp`.

## Qué hay ahora

- Formato nuevo: carruseles de 7-10 slides, con gráficas e ilustraciones generadas en SVG y estudios comprobados. Motor en `scripts/instagram/lib/design.mjs`, ilustraciones en `instagram/assets/svg/` (se generan con `npm run ig:illustrations`).
- Los posts antiguos sin publicar están en `instagram/posts/_legacy/` y el ya publicado (013) en `instagram/posts/_publicados/`. El publicador ignora las dos carpetas.
- Los ids nuevos empiezan en 101 para no chocar con los antiguos registrados en `ig_posts_log`.

## Posts terminados (tanda 1)

Fechas previstas con el calendario semanal, si el workflow publica cada día y los lunes hay al menos 2 carreras para el calendario dinámico. Si el 5 de noviembre no llega a publicarse, todo se corre un hueco y la tanda termina el 29.

| Fecha prevista | Id | Título | Fuentes |
|---|---|---|---|
| jue 5 nov | 106-error-primer-km | El primer km engaña: el ritmo cae del 1 al 8 | Gutiérrez-Hellín et al., 2026, Int J Sports Physiol Perform (PMID 42697540) |
| vie 6 nov | 101-ocr-monkey-bars | Monkey bars: cuélgate largo y usa la cadera | Técnica, sin estudio |
| sáb 7 nov | 102-carbohidratos-en-carrera | Carbohidratos en carrera según la duración | Jeukendrup, 2014, Sports Med (PMID 24791914) |
| dom 8 nov | 103-tu-primer-hyrox | Tu primer HYROX: cuánto dura y dónde se va el tiempo | Brandt et al., 2025, Front Physiol (PMID 40230601) |
| lun 9 nov | calendario | Calendario dinámico | Tabla `races` |
| mar 10 nov | 104-sled-push-postura | Sled push: postura correcta e incorrecta | Brandt et al., 2025 (tiempos de contexto) |
| mié 11 nov | 105-efecto-interferencia | Efecto interferencia | Schumann et al., 2022, Sports Med (PMID 34757594) |
| jue 12 nov | 112-mito-estirar-lesiones | Mito: estirar previene lesiones | Lauersen et al., 2014, Br J Sports Med (PMID 24100287) |
| vie 13 nov | 107-ocr-muro | El muro se sube con las piernas | Técnica, sin estudio |
| sáb 14 nov | 108-cafeina | Cafeína: dosis y momento | Guest et al., 2021, J Int Soc Sports Nutr (PMID 33388079) |
| dom 15 nov | 109-lesiones-hyrox | Lesiones en HYROX | Chittenden et al., 2026, Front Sports Act Living (PMID 42780891) |
| lun 16 nov | calendario | Calendario dinámico | Tabla `races` |
| mar 17 nov | 110-wall-balls | Wall balls: técnica, respiración y bloques | Brandt et al., 2025 |
| mié 18 nov | 111-correr-mitad-hyrox | La carrera es la mitad de tu HYROX | Rappelt et al., 2026, Front Physiol (PMID 42524284) |
| jue 19 nov | 118-error-calentar-mal | Error: salir sin calentar | Fradkin et al., 2010, J Strength Cond Res (PMID 19996770) |
| vie 20 nov | 113-ocr-cuerda | Cuerda: el bloqueo de pies | Técnica, sin estudio |
| sáb 21 nov | 114-sueno-rendimiento | Sueño y rendimiento | Craven et al., 2022, Sports Med (PMID 35708888); Mah et al., 2011, Sleep (PMID 21731144) |
| dom 22 nov | 115-habitos-constancia | Un mal día no rompe un hábito | Lally et al., 2010, Eur J Soc Psychol (doi 10.1002/ejsp.674) |
| lun 23 nov | calendario | Calendario dinámico | Tabla `races` |
| mar 24 nov | 116-farmers-carry | Farmers carry: agarre, postura y paradas | Técnica, sin estudio |
| mié 25 nov | 117-fuerza-economia-carrera | La fuerza mejora la economía de carrera | Balsalobre-Fernández et al., 2016, J Strength Cond Res (PMID 26694507) |
| jue 26 nov | 120-error-ritmo-medio | Error: siempre a ritmo medio (reserva) | Stöggl y Sperlich, 2014, Front Physiol (PMID 24550842) |
| vie 27 nov | 119-tapering | Tapering (reserva; sale un viernes porque no quedan de OCR) | Bosquet et al., 2007, Med Sci Sports Exerc (PMID 17762369) |
| sáb 28 nov | 121-proteina-diaria | Proteína diaria (reserva) | Morton et al., 2018, Br J Sports Med (PMID 28698222) |

17 de los 21 posts se apoyan en estudios verificados (dos veces: lectura del resumen en PubMed/Crossref y `npm run ig:sources`). Los 4 de técnica (monkey bars, muro, cuerda y farmers carry) no citan estudios y lo dicen en el caption.

## Posts pendientes hasta llegar a 60

Cada fuente está **sin verificar**: es una pista de búsqueda. Antes de usarla hay que abrirla en PubMed o doi.org, leer el resumen y comprobar que dice lo que vamos a afirmar. Si no se puede, se descarta o el post se hace sin estudio.

### Estaciones (martes)
1. SkiErg: cadera y brazos, correcto/incorrecto (`skierg-correcto` / `skierg-incorrecto`). Sin estudio o con tiempos de Brandt et al., 2025.
2. Sled pull: cadera baja y mano sobre mano (`sled-pull-*`). Brandt et al., 2025 (155 s de mediana, ya verificado).
3. Burpee broad jumps: aterrizar con rodillas y cadera flexionadas (`burpee-broad-jump-*`). Sin estudio.
4. Remo: final de la palada (`remo-*`). Sin estudio.
5. Sandbag lunges: tronco vertical y rodilla trasera (`sandbag-lunge-*`). Sin estudio.
6. Roxzone y transiciones: el tramo más lento de la carrera. Gutiérrez-Hellín et al., 2026 (Roxzone a 10,52 km/h, ya verificado).
7. Qué tiempo es bueno en cada estación. Fernández-Navarrete et al., 2026, J Sports Med Phys Fitness (PMID 42189569): tablas por percentiles; el resumen no trae cifras, hay que sacarlas del texto completo.

### Entrenamiento (miércoles)
8. Correr después de una estación (sesiones tipo brick). Hausswirth et al., 1997, Int J Sports Med (PMID 9298772) sobre la economía de carrera al final de un triatlón.
9. HIIT y VO2máx. Buscar metaanálisis: Milanović et al., 2015, Sports Med.
10. VO2máx y rendimiento en HYROX. Brandt et al., 2025 (correlación con VO2máx, ya verificado) + revisión clásica de Bassett y Howley, 2000, Med Sci Sports Exerc.
11. Umbral de lactato explicado para atletas. Faude et al., 2009, Sports Med.
12. Calor: aclimatarse antes de una carrera en verano. Tyler et al., 2016, Sports Med (metaanálisis de aclimatación).
13. Pliometría para corredores. Buscar revisión sistemática reciente sobre saltos y economía de carrera.
14. Semanas de descarga y sobreentrenamiento. Meeusen et al., 2013, consenso ECSS/ACSM (Med Sci Sports Exerc).

### Errores y mitos (jueves)
15. Mito: el lactato es un desecho y causa agujetas. Brooks, 2018, Cell Metabolism.
16. Error: beber de más o de menos. Consenso sobre hiponatremia de Hew-Butler et al., 2015, Clin J Sport Med.
17. Mito: entrenar en ayunas mejora el rendimiento. Aird et al., 2018, Scand J Med Sci Sports (metaanálisis).
18. Mito: estirar antes de la fuerza te debilita. Behm et al., 2016, Appl Physiol Nutr Metab.
19. Error: estrenar zapatillas o material el día de carrera. Sin estudio, con ilustración.
20. Error: hacer la última sesión dura dos días antes. Bosquet et al., 2007 (ya verificado) visto desde otro ángulo.

### OCR (viernes)
21. Bajadas y terreno técnico. Sin estudio.
22. Qué exige una OCR al cuerpo. Baghurst et al., 2019, Int J Environ Res Public Health (PMID 31430849); es un estudio de caso, decirlo claro.
23. Agarre: colgados y fuerza de agarre. Comprobar qué midió Brandt et al., 2025 sobre fuerza de agarre (no salió entre los factores asociados al tiempo).
24. Frío y agua en las OCR de invierno. Castellani et al., 2006, posicionamiento ACSM sobre frío.
25. Penalizaciones y burpees de castigo: cómo no perder la carrera ahí. Sin estudio.
26. Transportes de cubo y saco. Sin estudio.
27. Travesías y muros inclinados. Sin estudio.

### Nutrición y recuperación (sábado)
28. Hidratación según tu sudor. Sawka et al., 2007, posicionamiento ACSM.
29. Creatina para atletas híbridos. Kreider et al., 2017, posicionamiento ISSN.
30. Bicarbonato: para quién sí y para quién no. Grgic et al., 2021, posicionamiento ISSN.
31. Qué comer antes de competir. Thomas et al., 2016, posicionamiento ACSM/AND/DC.
32. Siestas y rendimiento. Buscar revisión sistemática reciente (Souabni et al., 2021 o similar).
33. Baños de hielo después de la fuerza. Roberts et al., 2015, J Physiol.
34. Alcohol y recuperación. Parr et al., 2014, PLoS One.

### Comunidad (domingo)
35. Entrenar acompañado rinde más. Buscar estudios sobre el efecto Köhler en ejercicio (Feltz y colaboradores).
36. Elegir compañero de dobles. Sin estudio.
37. Las mujeres en HYROX: cómo han mejorado. Rappelt et al., 2026 (ya verificado).
38. Música y rendimiento. Terry et al., 2020, Psychological Bulletin (metaanálisis).
39. Cómo duermen los atletas híbridos. Buoite Stella et al., 2026, Eur J Appl Physiol (PMID 41762273): 8 atletas, decirlo claro.

## Instrucciones para la siguiente sesión

Pega esto en Claude Code dentro del repo:

> Continúa los carruseles científicos de Instagram siguiendo instagram/PROGRESO.md. Genera los siguientes posts pendientes respetando el calendario (martes estaciones, miércoles entrenamiento, jueves errores/mitos, viernes OCR, sábado nutrición/recuperación, domingo comunidad).

Reglas que hay que mantener:

1. **Esquema**: un JSON por post en `instagram/posts/NNN-slug.json`, continuando la numeración (el siguiente es 122). Campos: `id`, `pilar`, `titulo_interno`, `fuentes`, `slides`, `caption`, `hashtags`, `url_destino` (ruta real de la web). El `alt_text` lo rellena `npm run ig:alt`. Usa los posts 101-121 como plantilla.
2. **Estructura**: 7-10 slides. Portada (titular en 2 líneas, una palabra destacada con `*asteriscos*`) → contexto → 2-4 slides de datos o ilustraciones → `conclusion` → `aplicacion` (3 puntos) → `referencias` (si hay estudios) → `cta`.
3. **Tipos de slide**: `portada`, `contexto`, `grafica_linea`, `grafica_area`, `grafica_barras` (vertical u horizontal; `referencia: true` para un valor de referencia), `barras_agrupadas`, `comparativa`, `donut`, `linea_temporal`, `tabla`, `dato_grande`, `conclusion`, `aplicacion`, `ilustracion`, `correcto_incorrecto`, `referencias`, `cta`. Ilustraciones disponibles y sus zonas resaltables: mira las clases `z-*` de cada archivo en `instagram/assets/svg/` (por ejemplo `cuerpo-zonas` tiene glúteos, cuádriceps, isquios, gemelos, rodillas, antebrazos, manos, hombros...).
4. **Ciencia**:
   - Cada estudio se comprueba en PubMed (la web bloquea bots: usa la API `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=PMID&rettype=abstract&retmode=text`) o en Crossref/doi.org. Si no se puede comprobar que existe y dice lo que afirmas, no se usa.
   - Prioridad: metaanálisis, revisiones sistemáticas, posicionamientos (ISSN, ACSM) y ensayos controlados. Ya hay estudios específicos de HYROX (2025-2026): úsalos cuando encajen.
   - Las gráficas con `etiqueta: "estudio"` solo llevan números que salen del estudio. Si solo tienes la idea, usa `etiqueta: "ilustrativo"` con fuente "Elaboración propia", "Esquema basado en..." o "Ejemplo basado en...". Si haces un cálculo propio (un ritmo, un porcentaje), dilo en la slide.
   - En el caption: qué se estudió y qué se encontró, en llano; limitaciones (muestra, población, tipo de estudio); nunca "la ciencia demuestra" con un único estudio.
   - Formato HYROX: 8 x 1 km + SkiErg 1000 m, Sled Push 50 m, Sled Pull 50 m, Burpee Broad Jumps 80 m, Remo 1000 m, Farmers Carry 200 m, Sandbag Lunges 100 m, Wall Balls 100. Pesos: "según categoría".
   - Los posts de técnica pueden ir sin estudio, diciéndolo en el caption y sin inventar cifras.
5. **Voz**: de atleta a atleta, tuteo, español de España. Nada de "descubre", "sumérgete", "desbloquea", "la clave del éxito", guiones largos ni listas de emojis; como mucho 2 emojis. Caption: gancho de menos de 125 caracteres → estudio en llano → limitaciones → cómo aplicarlo → pregunta → "Más en hybridracehub.com (enlace en la bio)" → "Fuentes:" con autor, año y revista. 3-5 hashtags.
6. **Comprobaciones antes del commit** (las cuatro sin errores):
   - `npm run ig:alt`
   - `npm run ig:validate`
   - `npm run ig:sources` (segunda verificación automática contra PubMed, Crossref y doi.org)
   - `npm run ig:preview` y abrir las imágenes de `instagram-preview/` para revisar solapamientos, textos cortados y gráficas.
7. Commit cada 7 posts, push al final y actualiza este archivo (tabla de terminados y lista de pendientes).
