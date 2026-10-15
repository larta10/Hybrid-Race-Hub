-- Circuitos híbridos (HURBAX, Hyatlón, Badajoz Race Hybrid, Athlon X, FitRace). Ver data/import-circuitos-2026-10-15.json y docs/informe-circuitos-hibridos.md
-- SOLO INSERTA filas nuevas: cada INSERT se salta si ya existe una fila con el mismo nombre y fecha_iso.
BEGIN;

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'FitRace Costa Brava 2026', 'Functional Fitness', 'func-fitness', 'funcional', '17 Oct 2026', '2026-10-17', 'Camping La Ballena Alegre, Sant Pere Pescador', 'Sant Pere Pescador', 'Girona', 'Cataluña', 'España', NULL, NULL, '100€', 'Cerrada', NULL, 'Carrera híbrida por parejas (masculinas, femeninas o mixtas) en categorías Elite, RX y Open: tramos de 1 km entre estaciones funcionales. Plazas agotadas. Forma parte del Costa Brava Fitness Challenge de la Fitness Challenge League.', 'https://fitnesschallengeleague.com/fitrace-costa-brava-2026-d85', 'fitnesschallengeleague.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'FitRace Costa Brava 2026' AND fecha_iso = '2026-10-17');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'H6 Hyatlón La Nucía 2026', 'Hyatlón', 'func-hyatlon', 'funcional', '24 Oct 2026', '2026-10-24', 'La Nucía Combat Sports Center', 'La Nucía', 'Alicante', 'Comunidad Valenciana', 'España', '6 x 1 km + 6 estaciones y tramo final (H6)', NULL, NULL, 'Abierta', NULL, 'Formato H6 del Tour Nacional de Hyatlón (FETRI). Sábado 24: individual; domingo 25: dobles y relevos. También hay modalidad ParaHyatlón.', 'https://hyatlon.org/event/la-nucia', 'hyatlon.org'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'H6 Hyatlón La Nucía 2026' AND fecha_iso = '2026-10-24');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'HURBAX Madrid 2026 · Final Nacional', 'HURBAX', 'func-hurbax', 'funcional', '24 Oct 2026', '2026-10-24', 'Recinto Ferial de San Sebastián de los Reyes', 'San Sebastián de los Reyes', 'Madrid', 'Madrid', 'España', '5 km + 5 estaciones', 5, NULL, 'Abierta', NULL, 'Final del Campeonato HURBAX 2026, con los 20 primeros del ranking en individual, parejas y equipos. Individual por grupos de edad (18-29, 30-39, 40-49, 50+), parejas en formato You Go-I Go y equipos de 4. Inscripción hasta el 18 de octubre o hasta completar tandas.', 'https://hurbax.com/eventos/madrid', 'hurbax.com'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'HURBAX Madrid 2026 · Final Nacional' AND fecha_iso = '2026-10-24');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Badajoz Race Hybrid Calamonte 2026', 'Functional Fitness', 'func-hyrox', 'funcional', '25 Oct 2026', '2026-10-25', 'Campo de Fútbol de Calamonte', 'Calamonte', 'Badajoz', 'Extremadura', 'España', '8 x 1 km (Pro) / 8 x 500 m (Popular)', 8, '47,50€', 'Abierta', 'Individual, Parejas', 'Circuito provincial de la Diputación de Badajoz con formato tipo HYROX: 8 tramos de carrera y 8 estaciones (SkiErg, sled push y pull, burpees, remo, farmers carry, zancadas y wall balls). Categorías Pro y Popular, individual y parejas, desde 16 años. Inscripción hasta el 22 de octubre.', 'https://www.chipserena.es/web-evento/13941-badajoz-race-hybrid-calamonte', 'dip-badajoz.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Badajoz Race Hybrid Calamonte 2026' AND fecha_iso = '2026-10-25');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'H6 Hyatlón Gran Canaria 2026', 'Hyatlón', 'func-hyatlon', 'funcional', '14 Nov 2026', '2026-11-14', 'Plaza de la Música - ExpoDeca, Las Palmas de Gran Canaria', 'Las Palmas de Gran Canaria', 'Las Palmas', 'Canarias', 'España', '6 x 1 km + 6 estaciones y tramo final (H6)', NULL, NULL, 'Abierta', NULL, 'Formato H6 del Tour Nacional de Hyatlón (FETRI). Sábado 14: individual; domingo 15: dobles y relevos. También hay modalidad ParaHyatlón.', 'https://hyatlon.org/event/gran-canaria', 'hyatlon.org'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'H6 Hyatlón Gran Canaria 2026' AND fecha_iso = '2026-11-14');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Athlon X Fuengirola · Last Wave 2026', 'Fitness Funcional', 'func-fitness', 'funcional', '21 Nov 2026', '2026-11-21', 'Fuengirola', 'Fuengirola', 'Málaga', 'Andalucía', 'España', '4 km (10 x 400 m) + 10 workouts', 4, '77€ (hasta el 1 de noviembre)', 'Abierta', 'Individual, Parejas, Equipos, Elite', 'Formato Athlon X: 10 tramos de 400 m con un workout (track) después de cada uno. Individual Open y Pro, parejas y equipos 2+1. El precio sube por plazos.', 'https://athlonx.es/athlonx/last-wave/', 'athlonx.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Athlon X Fuengirola · Last Wave 2026' AND fecha_iso = '2026-11-21');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'H8 Hyatlón Zaragoza 2026', 'Hyatlón', 'func-hyatlon', 'funcional', '28 Nov 2026', '2026-11-28', 'Pabellón 4, Feria de Zaragoza', 'Zaragoza', 'Zaragoza', 'Aragón', 'España', '8 x 1 km + 8 estaciones y tramo final (H8)', NULL, NULL, 'Abierta', NULL, 'Cierre de la temporada de Hyatlón 2026 con el formato completo H8. Sábado 28: individual; domingo 29: dobles y relevos. También hay modalidad ParaHyatlón.', 'https://hyatlon.org/event/zaragoza', 'hyatlon.org'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'H8 Hyatlón Zaragoza 2026' AND fecha_iso = '2026-11-28');

INSERT INTO public.races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, distancia, distancia_km, precio, estado, formato, notas, url, source)
SELECT 'Athlon X Benidorm · Terra Mítica 2027', 'Fitness Funcional', 'func-fitness', 'funcional', '20 Feb 2027', '2027-02-20', 'Benidorm', 'Benidorm', 'Alicante', 'Comunidad Valenciana', 'España', '4 km (10 x 400 m) + 10 workouts', 4, 'Desde 57€', 'Abierta', 'Individual, Parejas, Equipos, Elite', 'Formato Athlon X: 10 tramos de 400 m con un workout después de cada uno. Individual Open y Pro, parejas y equipos 2+1. 57 € hasta el 8 de noviembre; luego sube por plazos.', 'https://athlonx.es/athlonx/terra-mitica/', 'athlonx.es'
WHERE NOT EXISTS (SELECT 1 FROM public.races WHERE nombre = 'Athlon X Benidorm · Terra Mítica 2027' AND fecha_iso = '2027-02-20');

COMMIT;

-- Verificación
SELECT id, fecha_iso, nombre, municipio, modalidad FROM public.races WHERE nombre IN ('FitRace Costa Brava 2026', 'H6 Hyatlón La Nucía 2026', 'HURBAX Madrid 2026 · Final Nacional', 'Badajoz Race Hybrid Calamonte 2026', 'H6 Hyatlón Gran Canaria 2026', 'Athlon X Fuengirola · Last Wave 2026', 'H8 Hyatlón Zaragoza 2026', 'Athlon X Benidorm · Terra Mítica 2027') ORDER BY fecha_iso;
