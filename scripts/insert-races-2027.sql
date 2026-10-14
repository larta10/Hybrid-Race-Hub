-- Carreras 2027 verificadas en webs oficiales (ver data/import-2027-2026-10-14.json y docs/informe-carreras-2027.md)
-- SOLO INSERTA filas nuevas. Cada INSERT se salta si ya existe una fila con el mismo nombre y fecha_iso.
-- Ejecutar en Supabase > SQL Editor. Alternativa: node scripts/insert-races-2027.mjs con SUPABASE_SERVICE_KEY.
BEGIN;

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Heart Fit Challenge Hybrid Race Sevilla 2027', 'Functional Fitness', 'func-fitness', 'funcional', '16 Ene 2027', '2027-01-16', 'Centro Deportivo Bellavista, Sevilla', 'Sevilla', 'Sevilla', 'Andalucía', 'España', NULL, NULL, NULL, 'Abierta', NULL, 'Carrera híbrida. Precios y categorías en la página de inscripción.', 'https://my.weezevent.com/heart-fit-challenge-hybrid-race-sevilla-2', 'weezevent.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Heart Fit Challenge Hybrid Race Sevilla 2027' AND fecha_iso = '2027-01-16');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'HYROX Bilbao 2027', 'HYROX', 'func-hyrox', 'funcional', '6 Feb 2027', '2027-02-06', 'Bilbao Exhibition Centre, Barakaldo', 'Barakaldo', 'Bizkaia', 'País Vasco', 'España', NULL, NULL, NULL, 'Abierta', 'Individual, Parejas', '6 y 7 de febrero. Categorías individual, Pro, Doubles (masculina, femenina y mixta) y relevos. Hay lista de espera en la web oficial.', 'https://hyrox.es/eventos/hyrox-bilbao-26-27/', 'hyrox.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'HYROX Bilbao 2027' AND fecha_iso = '2027-02-06');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Hybrid League — Ronda Febrero 2027', 'Functional Fitness', 'func-fitness', 'funcional', '20 Feb 2027', '2027-02-20', 'Pinto, Madrid', 'Pinto', 'Madrid', 'Madrid', 'España', NULL, NULL, NULL, 'Abierta', NULL, 'Ronda de la liga híbrida por parejas (masculinas, femeninas y mixtas) en categorías Pro y Amateur.', 'https://hybridleague.es/evento/entradas-hybrid-league-20-febrero-2027/', 'hybridleague.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Hybrid League — Ronda Febrero 2027' AND fecha_iso = '2027-02-20');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Medieval Xtreme Race Polop 2027', 'OCR', 'ocr-general', 'ocr', '21 Feb 2027', '2027-02-21', 'Polop, Alicante', 'Polop', 'Alicante', 'Comunidad Valenciana', 'España', '5 km / 9 km', 9, 'Desde 39€', 'Abierta', 'Individual, Parejas, Equipos, Elite', 'Dos distancias: 5 km (popular, sub-16 y equipos) y 9 km (popular, élite, grupos de edad, parejas y equipos). Tanda Family para ir con menores de 12 años. El precio sube por plazos.', 'https://medievalxtremrace.com/inscripciones-polop/', 'medievalxtremrace.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Medieval Xtreme Race Polop 2027' AND fecha_iso = '2027-02-21');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Torremolinos 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '27 Feb 2027', '2027-02-27', 'Campo de Fútbol Ciudad de Torremolinos', 'Torremolinos', 'Málaga', 'Andalucía', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '27 y 28 de febrero. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA FIT (89 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-torremolinos', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Torremolinos 2027' AND fecha_iso = '2027-02-27');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Toledo 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '6 Mar 2027', '2027-03-06', 'Universidad de Castilla-La Mancha, Campus de la Fábrica de Armas, Toledo', 'Toledo', 'Toledo', 'Castilla-La Mancha', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '6 y 7 de marzo. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA FIT (89 €) y DEKA MILE (72 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-toledo-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Toledo 2027' AND fecha_iso = '2027-03-06');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'HYROX Madrid 2027', 'HYROX', 'func-hyrox', 'funcional', '17 Mar 2027', '2027-03-17', 'IFEMA Madrid', 'Madrid', 'Madrid', 'Madrid', 'España', NULL, NULL, NULL, 'Abierta', 'Individual, Parejas', 'Del 17 al 21 de marzo. Categorías individual, Pro, Doubles, Pro Doubles y relevos (masculinos, femeninos y mixtos). Horario provisional.', 'https://hyrox.es/eventos/hyrox-madrid-26-27/', 'hyrox.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'HYROX Madrid 2027' AND fecha_iso = '2027-03-17');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Barcelona Primavera 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '20 Mar 2027', '2027-03-20', 'Complejo Deportivo Municipal Mar Bella, Barcelona', 'Barcelona', 'Barcelona', 'Cataluña', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '20 y 21 de marzo. Sábado: DEKA FIT Teams (72 €), DEKA MILE (72 €) y DEKA STRONG (50 €). Domingo: DEKA FIT (89 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-barcelona-primavera', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Barcelona Primavera 2027' AND fecha_iso = '2027-03-20');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Valencia 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '3 Abr 2027', '2027-04-03', 'Tinglado nº2, La Marina de Valencia', 'Valencia', 'Valencia', 'Comunidad Valenciana', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '3 y 4 de abril. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA MILE (72 €) y DEKA FIT (89 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-valencia-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Valencia 2027' AND fecha_iso = '2027-04-03');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Survivor Race Alicante 2027', 'OCR', 'ocr-general', 'ocr', '10 Abr 2027', '2027-04-10', 'Av. Jaime I, Alicante', 'Alicante', 'Alicante', 'Comunidad Valenciana', 'España', '3 km / 6 km / 10 km', 10, 'Desde 51€', 'Abierta', 'Individual', '10 y 11 de abril. Distancias XPLORER 3K (15 obstáculos), HUMAN 6K (20) y HERO 10K (25). 10 % de descuento para equipos de 10 o más personas. Edad mínima: 16 años.', 'https://survivor-race.com/carreras/survivor-alicante/', 'survivor-race.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Survivor Race Alicante 2027' AND fecha_iso = '2027-04-10');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Hybrid Zone Torrelavega 2027', 'Functional Fitness', 'func-fitness', 'funcional', '10 Abr 2027', '2027-04-10', 'Mercado Nacional de Ganados, Torrelavega', 'Torrelavega', 'Cantabria', 'Cantabria', 'España', '4,8 km / 7,2 km', 7.2, 'Desde 65€', 'Abierta', 'Individual, Parejas', 'Dos formatos: HZ6 (4.800 m) y HZ9 (7.200 m, con 800 m de carrera entre 9 zonas). Individual, parejas y, como novedad en 2027, relevos «I Go You Go». El primer tramo de precio ya se agotó.', 'https://hybridzone.es/', 'hybridzone.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Hybrid Zone Torrelavega 2027' AND fecha_iso = '2027-04-10');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'HYROX Málaga 2027', 'HYROX', 'func-hyrox', 'funcional', '14 Abr 2027', '2027-04-14', 'Palacio de Ferias y Congresos de Málaga (FYCMA)', 'Málaga', 'Málaga', 'Andalucía', 'España', NULL, NULL, NULL, 'Abierta', 'Individual, Parejas', 'Del 14 al 18 de abril. Individual, Doubles y relevos, con plazas de clasificación para el Campeonato del Mundo. Horario por confirmar.', 'https://hyrox.es/eventos/hyrox-malaga-26-27/', 'hyrox.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'HYROX Málaga 2027' AND fecha_iso = '2027-04-14');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Ibiza 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '17 Abr 2027', '2027-04-17', 'Camp Municipal d''Esports de Sant Agustí, Sant Agustí des Vedrà', 'Sant Agustí des Vedrà', 'Islas Baleares', 'Baleares', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '17 y 18 de abril. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA FIT (89 €) y DEKA MILE (72 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-ibiza-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Ibiza 2027' AND fecha_iso = '2027-04-17');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Desafío de Guerreros Valencia 2027', 'OCR', 'ocr-general', 'ocr', '18 Abr 2027', '2027-04-18', 'Valencia', 'Valencia', 'Valencia', 'Comunidad Valenciana', 'España', '6 km / 10 km', 10, 'Desde 47,11€', 'Abierta', 'Individual, Parejas, Equipos, Elite', '6 km con 20 obstáculos o 10 km con 25. La tanda Élite tiene 150 dorsales y el 10 km clasifica para el OCR World Championship. Se puede correr en pareja o en equipo. El precio sube cada mes.', 'https://www.desafiodeguerreros.com.es/carreras/p/desafio-valencia', 'desafiodeguerreros.com.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Desafío de Guerreros Valencia 2027' AND fecha_iso = '2027-04-18');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Spartan Race Madrid 2027 - Sprint', 'Spartan Race', 'ocr-spartan', 'ocr', '8 May 2027', '2027-05-08', 'San Agustín del Guadalix, Madrid', 'San Agustín del Guadalix', 'Madrid', 'Madrid', 'España', '5K + 20 obstáculos', 5, '94,98€', 'Abierta', NULL, 'Madrid Spartan Weekend, 8 y 9 de mayo. El Sprint y el Beast se corren el sábado; el Super, el domingo. También hay Kids Race (1-3 km).', 'https://es.spartan.com/es/races/madrid', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Spartan Race Madrid 2027 - Sprint' AND fecha_iso = '2027-05-08');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Spartan Race Madrid 2027 - Beast', 'Spartan Race', 'ocr-spartan', 'ocr', '8 May 2027', '2027-05-08', 'San Agustín del Guadalix, Madrid', 'San Agustín del Guadalix', 'Madrid', 'Madrid', 'España', '21K + 30 obstáculos', 21, '189,98€', 'Abierta', NULL, 'Madrid Spartan Weekend, 8 y 9 de mayo. El Beast se corre el sábado 8.', 'https://es.spartan.com/es/races/madrid', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Spartan Race Madrid 2027 - Beast' AND fecha_iso = '2027-05-08');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Spartan Race Madrid 2027 - Super', 'Spartan Race', 'ocr-spartan', 'ocr', '9 May 2027', '2027-05-09', 'San Agustín del Guadalix, Madrid', 'San Agustín del Guadalix', 'Madrid', 'Madrid', 'España', '10K + 25 obstáculos', 10, '139,99€', 'Abierta', NULL, 'Madrid Spartan Weekend, 8 y 9 de mayo. El Super se corre el domingo 9.', 'https://es.spartan.com/es/races/madrid', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Spartan Race Madrid 2027 - Super' AND fecha_iso = '2027-05-09');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Desafío de Guerreros Barcelona 2027', 'OCR', 'ocr-general', 'ocr', '16 May 2027', '2027-05-16', 'Pineda de Mar, Barcelona', 'Pineda de Mar', 'Barcelona', 'Cataluña', 'España', '6 km / 10 km', 10, 'Desde 47,11€', 'Abierta', 'Individual, Parejas, Equipos, Elite', '11.ª edición. 6 km con 20 obstáculos o 10 km con 25, con tanda Élite. El precio sube cada mes.', 'https://www.desafiodeguerreros.com.es/carreras/p/desafio-barcelona', 'desafiodeguerreros.com.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Desafío de Guerreros Barcelona 2027' AND fecha_iso = '2027-05-16');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Sacaba Summer Games 2027', 'CrossFit', 'func-crossfit', 'funcional', '29 May 2027', '2027-05-29', 'Playa de la Misericordia, Málaga', 'Málaga', 'Málaga', 'Andalucía', 'España', NULL, NULL, NULL, 'Próximamente', NULL, '29 y 30 de mayo. Competición de cross training por parejas en la playa, con categorías Escalado, Intermedio, RX y Máster. Las inscripciones abren el 1 de diciembre de 2026.', 'https://www.sacabasummergames.com/', 'sacabasummergames.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Sacaba Summer Games 2027' AND fecha_iso = '2027-05-29');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Madrid Fitness Challenge 2027', 'CrossFit', 'func-crossfit', 'funcional', '4 Jun 2027', '2027-06-04', 'Majadahonda, Madrid', 'Majadahonda', 'Madrid', 'Madrid', 'España', NULL, NULL, NULL, 'Abierta', NULL, '4, 5 y 6 de junio. Competición de fitness con dos arenas y categorías Élite, RX, Intermedio y Scaled.', 'https://madridfitnesschallenge.com/', 'madridfitnesschallenge.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Madrid Fitness Challenge 2027' AND fecha_iso = '2027-06-04');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Desafío de Guerreros Gernika 2027', 'OCR', 'ocr-general', 'ocr', '13 Jun 2027', '2027-06-13', 'Gernika-Lumo, Bizkaia', 'Gernika-Lumo', 'Bizkaia', 'País Vasco', 'España', '6 km / 10 km', 10, 'Desde 47,11€', 'Abierta', 'Individual, Parejas, Equipos, Elite', '6 km con 20 obstáculos o 10 km con 25. La tanda Élite tiene 150 dorsales y el 10 km clasifica para el OCR World Championship. El precio sube cada mes.', 'https://www.desafiodeguerreros.com.es/carreras/p/desafio-bizkaia', 'desafiodeguerreros.com.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Desafío de Guerreros Gernika 2027' AND fecha_iso = '2027-06-13');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'BOLD Series Madrid 2027', 'Functional Fitness', 'func-fitness', 'funcional', '18 Jun 2027', '2027-06-18', 'Madrid Arena, Casa de Campo', 'Madrid', 'Madrid', 'Madrid', 'España', NULL, NULL, '440€ por equipo', 'Abierta', NULL, 'Del 18 al 20 de junio. Competición de fitness solo por equipos de cuatro, con seis categorías por nivel y edad. 440 € por equipo hasta el 30 de noviembre de 2026; luego sube. La inscripción cierra el 31 de marzo de 2027.', 'https://www.theboldseries.com/', 'theboldseries.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'BOLD Series Madrid 2027' AND fecha_iso = '2027-06-18');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Vigo 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '26 Jun 2027', '2027-06-26', 'IFEVI – Instituto Ferial de Vigo', 'Vigo', 'Pontevedra', 'Galicia', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '26 y 27 de junio. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA FIT (89 €) y DEKA MILE (72 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-vigo-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Vigo 2027' AND fecha_iso = '2027-06-26');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Madrid 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '10 Jul 2027', '2027-07-10', 'Madrid Arena', 'Madrid', 'Madrid', 'Madrid', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '10 y 11 de julio. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). DEKA STRONG ambos días (50 €). Domingo: DEKA MILE (72 €) y DEKA FIT (89 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-madrid-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Madrid 2027' AND fecha_iso = '2027-07-10');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'DEKA Barcelona Otoño 2027', 'DEKA FIT', 'func-hyrox', 'funcional', '25 Sep 2027', '2027-09-25', 'Complejo Deportivo Municipal Mar Bella, Barcelona', 'Barcelona', 'Barcelona', 'Cataluña', 'España', NULL, NULL, 'Desde 50€', 'Abierta', NULL, '25 y 26 de septiembre. Sábado: DEKA FIT Teams (72 €) y DEKA MILE Teams (50 €). Domingo: DEKA FIT (89 €) y DEKA MILE (72 €). Precios iniciales.', 'https://es.spartan.com/es/races/deka-barcelona-otono-2027', 'es.spartan.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'DEKA Barcelona Otoño 2027' AND fecha_iso = '2027-09-25');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Desafío de Guerreros Madrid 2027', 'OCR', 'ocr-general', 'ocr', '26 Sep 2027', '2027-09-26', 'Madrid', 'Madrid', 'Madrid', 'Madrid', 'España', '6 km / 10 km', 10, 'Desde 47,11€', 'Abierta', 'Individual, Parejas, Equipos, Elite', '11.ª edición. 6 km con 20 obstáculos o 10 km con 25, con tanda Élite de 150 dorsales. El precio sube cada mes.', 'https://www.desafiodeguerreros.com.es/carreras/p/desafio-madrid', 'desafiodeguerreros.com.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Desafío de Guerreros Madrid 2027' AND fecha_iso = '2027-09-26');

COMMIT;

-- Verificación
SELECT id, fecha_iso, nombre, municipio FROM public.races WHERE fecha_iso >= '2027-01-01' ORDER BY fecha_iso;
