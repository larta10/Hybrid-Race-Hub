-- Corrige enlaces de carreras que apuntan a la portada de carrerasocr.com
-- (agregador, no es la web del organizador). Revisado el 2026-10-14.
-- Ejecutar en Supabase → SQL Editor (requiere permisos de escritura).
-- Mientras no se ejecute, la web ya oculta esos enlaces (lib/race-links.js).

begin;

-- 1) Webs oficiales verificadas
update races set url = 'https://www.gladiusrace.com/',    updated_at = now() where id = 130; -- Gladius Race Santacara 2026
update races set url = 'https://desafiocostablanca.com/', updated_at = now() where id = 137; -- Desafío Costa Blanca Mutxamel
update races set url = 'https://bestialrace.com/',        updated_at = now() where id = 139; -- Bestial Race Arucas 2026

-- 2) El resto de enlaces a carrerasocr.com no son oficiales: se vacían para
--    que la web muestre "Sin web oficial" hasta encontrar la buena.
--    Revisa antes la lista con:
--    select id, nombre, fecha_iso, url from races where url ilike '%carrerasocr.com%' order by fecha_iso;
update races set url = null, updated_at = now()
where url ilike '%carrerasocr.com%' and id not in (130, 137, 139);

commit;
