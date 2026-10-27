-- Cambios en la tabla races verificados el 27/10/2026 (evidencia en docs/datos/verificacion-carreras-2026-10.md).
-- Solo INSERT y UPDATE. Sin DELETE ni cambios de esquema. Backup previo: backups/races-2026-10-27.json
-- Cómo aplicarlo: Supabase → SQL Editor → New query → pegar todo → Run.
-- Es seguro ejecutarlo dos veces: los INSERT comprueban que la carrera no exista ya (mismo nombre y fecha).

begin;

-- ─── CORRECCIONES ───────────────────────────────────────────────────────────

-- Strong Race (id 24): web oficial del evento, sede concreta e inscripción abierta (carrito activo).
update races set
  url = 'https://eventos.strongrace.com/evento/strong-race-mallorca-5a-edicion-open/',
  ubicacion = 'Velódromo Illes Balears, Palma',
  municipio = 'Palma',
  estado = 'Abierta',
  source = 'strongrace.com',
  notas = '5ª edición. 7 y 8 de noviembre de 2026 en el Velódromo Illes Balears.',
  updated_at = now()
where id = 24;

-- Desafío Costa Blanca (id 137): la web oficial anuncia la prueba del 22/11/2026 en Redován, no en Mutxamel.
-- La organiza Medieval Xtrem Race como "II Desafío Vega Baja"; inscripción abierta desde 45 € (hasta el 10/11).
update races set
  nombre = 'Desafío Vega Baja Redován 2026',
  ubicacion = 'Redován',
  municipio = 'Redován',
  url = 'https://medievalxtremrace.com/inscripciones-redovan',
  precio = 'Desde 45€',
  distancia = '5 km y 8 km',
  estado = 'Abierta',
  source = 'medievalxtremrace.com',
  notas = 'II Desafío Vega Baja (circuito Desafío Costa Blanca). Precio de 45 € hasta el 10/11 y de 48 € hasta el 17/11.',
  updated_at = now()
where id = 137;

-- Bestial Race Gran Canaria (id 139): inscripción oficial abierta hasta el 30/11/2026.
update races set
  url = 'https://inscripciones.chronotrackcanarias.com/inscripcion/bestial-race-gran-canaria-2026/',
  precio = 'Desde 30€',
  distancia = '3, 6 y 12 km',
  estado = 'Abierta',
  source = 'ocrbestial.com',
  notas = 'XIII Gran Canaria Bestial Race. Modalidades 12K Elite, Starter y T-Rex, 6K Hell y 3K Fun. Inscripción hasta el 30/11.',
  updated_at = now()
where id = 139;

-- Monster Race (id 136): sustituye la portada del agregador por la web del organizador.
update races set
  url = 'https://monsterace.com/',
  source = 'monsterace.com',
  updated_at = now()
where id = 136;

-- Farinato (id 166): la web oficial (farinatorace.es) no responde y los calendarios públicos sitúan
-- la Farinato del 14-15/11/2026 en Umbrete (Sevilla), no en Madrid. No se cambia la sede sin fuente oficial.
update races set
  estado = 'Pendiente verificar',
  notas = 'Revisar: la web oficial no responde (27/10/2026) y los calendarios públicos sitúan la Farinato del 14-15 de noviembre en Umbrete (Sevilla).',
  updated_at = now()
where id = 166;

-- Gollizno Race (id 135) y OCR Mencey Los Realejos (id 134): sin web oficial (solo Instagram); no se puede verificar.
update races set estado = 'Pendiente verificar', updated_at = now() where id in (134, 135);

-- ─── CARRERAS NUEVAS (inscripción abierta comprobada el 27/10/2026) ─────────

insert into races (nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, comunidad, provincia, municipio, pais, distancia, precio, formato, estado, notas, url, source)
select * from (values
  ('Hybrid Day Vigo 2026', 'Functional Fitness', 'func-fitness', 'funcional', '12 Dic 2026', '2026-12-12'::date,
   'IFEVI – Instituto Ferial de Vigo', 'Galicia', 'Pontevedra', 'Vigo', 'España', '8 km + 8 estaciones', null, 'Individual, Parejas', 'Abierta',
   '12 y 13 de diciembre. Mismo formato que HYROX: 8 tramos de 1 km y 8 estaciones. Categorías individuales, parejas y relevos.',
   'https://hybrid-day.com/hybrid-day-vigo-2026/', 'hybrid-day.com'),
  ('Hyatlón H6 Gran Canaria 2026', 'Functional Fitness', 'func-fitness', 'funcional', '14 Nov 2026', '2026-11-14'::date,
   'Plaza de la Música (ExpoDeca), Las Palmas de Gran Canaria', 'Canarias', 'Las Palmas', 'Las Palmas de Gran Canaria', 'España', '6 × 1 km + 6 estaciones', 'Desde 79€', 'Individual, Parejas', 'Abierta',
   'Carrera híbrida oficial de la FETRI, formato H6. Sábado 14 individual; domingo 15 dobles y relevos.',
   'https://hyatlon.org/event/gran-canaria', 'hyatlon.org'),
  ('Hyatlón H8 Zaragoza 2026', 'Functional Fitness', 'func-fitness', 'funcional', '28 Nov 2026', '2026-11-28'::date,
   'Pabellón 4, Feria de Zaragoza', 'Aragón', 'Zaragoza', 'Zaragoza', 'España', '8 × 1 km + 8 estaciones', 'Desde 89€', 'Individual, Parejas', 'Abierta',
   'Final de la temporada 2026 de Hyatlón con el formato completo H8. Sábado 28 individual; domingo 29 dobles y relevos.',
   'https://hyatlon.org/event/zaragoza', 'hyatlon.org'),
  ('The Hybrid Games Valencia 2027', 'Functional Fitness', 'func-fitness', 'funcional', '22 May 2027', '2027-05-22'::date,
   'Tinglados, La Marina de Valencia', 'Comunidad Valenciana', 'Valencia', 'Valencia', 'España', null, 'Desde 85€', 'Individual, Parejas', 'Abierta',
   'IV edición. 22 y 23 de mayo. Singles 85 €, Doubles 160 €, Team Relay 230 €.',
   'https://thehybridgames.fit/', 'thehybridgames.fit'),
  ('Survivor Race Madrid 2027', 'OCR', 'ocr-general', 'ocr', '5 Jun 2027', '2027-06-05'::date,
   'Colmenar Viejo', 'Madrid', 'Madrid', 'Colmenar Viejo', 'España', '3, 6 y 10 km', 'Desde 51€', 'Individual', 'Abierta',
   '5 y 6 de junio. De 15 a 25 obstáculos según la distancia. Descuento del 10 % para grupos.',
   'https://survivor-race.com/carreras/survivor-madrid/', 'survivor-race.com'),
  ('Survivor Race Barcelona 2027', 'OCR', 'ocr-general', 'ocr', '19 Jun 2027', '2027-06-19'::date,
   'Castellar del Vallès', 'Cataluña', 'Barcelona', 'Castellar del Vallès', 'España', '3, 6 y 10 km', 'Desde 51€', 'Individual', 'Abierta',
   '19 y 20 de junio. De 15 a 25 obstáculos según la distancia. Descuento del 10 % para grupos.',
   'https://survivor-race.com/carreras/survivor-barcelona/', 'survivor-race.com')
) as v(nombre, modalidad, modalidad_id, modalidad_parent, fecha, fecha_iso, ubicacion, comunidad, provincia, municipio, pais, distancia, precio, formato, estado, notas, url, source)
where not exists (select 1 from races r where r.nombre = v.nombre and r.fecha_iso::text = v.fecha_iso::text);

commit;
