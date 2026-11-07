# Instagram · progreso de los carruseles científicos y los Reels

Actualizado: 7 de noviembre de 2026. Objetivo: 60 carruseles en el formato nuevo. Hechos: 21. Pendientes: 39.

## Reels (desde el 7 de noviembre de 2026)

Cada tema puede salir como Reel de 20-40 s en vez de carrusel. Proyecto de vídeo en `video/` (Remotion, ver `video/README.md`), guiones en `instagram/reels/`, música en `instagram/music/`.

**Regla de oro:** el humano siempre es vídeo real de stock (Pexels). Nunca se dibujan ni se animan personas con código. Si no hay un clip bueno para un movimiento, esa escena se queda en texto y gráfica sobre fondo neutro (`"sin_clip": true` en el clip).

### Estado

| Qué | Estado |
|---|---|
| Guiones de Reel | 21 de 21 (`r101` a `r121`), uno por carrusel, mismas fuentes verificadas. `npm run ig:validate` los comprueba |
| Clips de Pexels elegidos y revisados | **0 de 21**: falta `PEXELS_API_KEY` (no estaba en `.env.local` ni en los secretos) |
| Coordenadas de músculos | Pendientes: cada escena con `musculo` tiene los nombres, falta colocar `x`, `y` y `pexels_id` sobre el clip elegido |
| Control de calidad del vídeo final (`qa_ok`) | 0 de 21 |
| Calendario de los lunes (`_calendario.json`) | Composición lista; clips de competición pendientes |
| Música | 3 pistas de reserva generadas por código (sin derechos). Pistas de Pixabay pendientes: ver `instagram/music/LICENCIAS.md` |
| Publicador | Listo. Un reel solo se publica si todos sus clips tienen `"revisado": true` y el guion tiene `"qa_ok": true`. Si no, ese día sale el carrusel del mismo tema, como hasta ahora |

Vistas previas (sin metraje todavía, con fondo neutro): `instagram-preview/reels/` (r102, r103, r104 y un calendario de prueba).

Como 101 y 106 ya salieron como carrusel, sus reels no se publicarán (el tema cuenta como hecho). El primer reel que podría salir es el del siguiente tema pendiente en cuanto tenga sus clips revisados.

### Cómo continuar (instrucciones para la siguiente sesión)

Pega esto en Claude Code dentro del repo:

> Continúa los Reels siguiendo instagram/PROGRESO.md: elige y revisa los clips de Pexels de los próximos reels pendientes, coloca los músculos, renderiza, haz el control de calidad y marca qa_ok.

Pasos por reel (empieza por los que tocan antes en el calendario):

1. `cd video && node scripts/fetch-clips.mjs r1NN-slug` (necesita `PEXELS_API_KEY` en `.env.local`). Elige el primer candidato de cada escena y lo descarga a `video/cache/`.
2. `node scripts/frames.mjs clips r1NN-slug` y abre los fotogramas de `video/out/frames/clips/`. Descarta (`--cambiar=N`) los que no enseñen claramente el movimiento del guion, tengan mala técnica (salvo en escenas de "Error:"), estén borrosos o tengan logos o texto. Si no hay ninguno bueno tras varios intentos, cambia la `query` o pon `"sin_clip": true`. Ajusta `inicio` y `recorte.centro_x` para que el atleta quede dentro del 9:16. Marca `"revisado": true` en los buenos.
3. Músculos: en las escenas con `musculo`, pon `pexels_id` del clip y `x`, `y` (0-1 sobre el fotograma 1080x1920 recortado) y, si el atleta se mueve, `keyframes: [{t, x, y}]`. Comprueba fotograma a fotograma que el anillo cae sobre el músculo.
4. `node scripts/render.mjs r1NN-slug --solo-revisados` y `node scripts/frames.mjs video out/r1NN-slug.mp4`. Revisa la hoja de contactos y los fotogramas: texto legible y dentro de la zona segura, anillos bien puestos, clips coherentes con el texto, ningún humano dibujado.
5. Si todo está bien, `"qa_ok": true` en el guion, `npm run ig:validate` y commit.

En Windows, el disco C: de este equipo estaba lleno: las dependencias de vídeo, el navegador de Remotion, la caché de clips, los renders y `instagram-preview/reels` están en `D:\hrh-video` con enlaces de directorio. Renderiza con `TEMP` y `TMP` apuntando a `D:\hrh-video\tmp`.

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
