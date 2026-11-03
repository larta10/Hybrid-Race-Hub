-- Correcciones de la tabla races comprobadas el 03-11-2026 en la web oficial.
-- ORDEN: ejecuta primero docs/datos/cambios-races-2026-10-27.sql (correcciones y 6 altas del 27/10,
-- incluidos los dos Hyatlón) y después este. Supabase > SQL Editor > New query > pegar > Run.
-- Solo UPDATE; no borra nada. Cuando estén los dos aplicados, se pueden quitar RACE_FIXES
-- (lib/races-server.js) y los eventos de lib/verified-events.js que ya estén en la tabla.

-- HYROX Barcelona 26/27: el programa oficial va del miércoles 11 al domingo 15 de noviembre
-- (https://hyrox.es/eventos/hyrox-barcelona-26-27/)
update races set fecha_iso = '2026-11-11', fecha = '11 Nov 2026',
  notas = 'Fira Barcelona Gran Via. Del 11 al 15 de noviembre. Temporada 26/27 (Season 9).',
  updated_at = now()
where id = 153;
