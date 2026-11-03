-- Correcciones de la tabla races comprobadas el 03-11-2026 en la web oficial.
-- Pegar en Supabase > SQL Editor. Solo UPDATE e INSERT; no borra nada.
-- Cuando se ejecute, quitar la entrada 153 de RACE_FIXES (lib/races-server.js)
-- y los dos Hyatlón de lib/verified-events.js.

-- HYROX Barcelona 26/27: el programa oficial va del miércoles 11 al domingo 15 de noviembre
-- (https://hyrox.es/eventos/hyrox-barcelona-26-27/)
UPDATE races SET fecha_iso = '2026-11-11', fecha = '2026-11-11',
  notas = 'Fira Barcelona Gran Via. Del 11 al 15 de noviembre. Temporada 26/27 (Season 9).',
  updated_at = now()
WHERE id = 153;

-- Hyatlón (FETRI): dos pruebas que no estaban en la tabla (https://hyatlon.org/event/gran-canaria y /zaragoza)
INSERT INTO races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, municipio, provincia, comunidad, pais, formato, distancia, url, estado, notas, source)
VALUES
 ('Hyatlón H6 Gran Canaria 2026', 'Hyatlón', 'func-hyatlon', 'funcional', '2026-11-14', '2026-11-14', 'Plaza de la Música - ExpoDeca', 'Las Palmas de Gran Canaria', 'Las Palmas', 'Canarias', 'España',
  'Individual (sábado), dobles y relevos (domingo)', 'H6: 6 tramos de 1 km + 6 estaciones', 'https://hyatlon.org/event/gran-canaria', 'Abierta', '14 y 15 de noviembre.', 'hyatlon.org'),
 ('Hyatlón H8 Zaragoza 2026', 'Hyatlón', 'func-hyatlon', 'funcional', '2026-11-28', '2026-11-28', 'Pabellón 4, Feria de Zaragoza', 'Zaragoza', 'Zaragoza', 'Aragón', 'España',
  'Individual (sábado), dobles y relevos (domingo)', 'H8: 8 tramos de 1 km + 8 estaciones', 'https://hyatlon.org/event/zaragoza', 'Abierta', '28 y 29 de noviembre.', 'hyatlon.org');
