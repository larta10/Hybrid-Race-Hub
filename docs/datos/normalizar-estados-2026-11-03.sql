-- Unifica los textos de races.estado en los 5 estados canónicos que usa la web (lib/race-estado.js).
-- NO se ha ejecutado. Solo UPDATE, sin DELETE ni cambios de esquema.
-- Cómo aplicarlo: Supabase → SQL Editor → New query → pegar todo → Run. Se puede ejecutar dos veces sin efecto.
--
-- Recuento a 3/11/2026 (SELECT estado, count(*) FROM races GROUP BY estado):
--   Abierta 159 · inscripciones abiertas 21 · Próximamente 10 · Pendiente verificar 4 · Cerrada 3 · fecha pendiente 1
--
-- Texto canónico en la tabla → estado en la web:
--   'Abierta'             → abierta
--   'Agotada'             → agotada
--   'Cerrada'             → cerrada
--   'Próximamente'        → proximamente
--   'Pendiente verificar' → por_confirmar (se mantiene este texto porque es el que escribe pages/api/verify-links.js)
--
-- Afecta a 22 filas: 21 'inscripciones abiertas' y 1 'fecha pendiente'.

begin;

update races set estado = 'Abierta', updated_at = now()
where estado is distinct from 'Abierta'
  and lower(estado) in ('inscripciones abiertas', 'inscripción abierta', 'inscripcion abierta', 'abierto', 'abierta', 'últimas plazas', 'ultimas plazas');

update races set estado = 'Agotada', updated_at = now()
where estado is distinct from 'Agotada'
  and lower(estado) in ('agotado', 'agotada', 'agotadas', 'sold out', 'completo');

update races set estado = 'Cerrada', updated_at = now()
where estado is distinct from 'Cerrada'
  and lower(estado) in ('cerrado', 'cerrada', 'inscripciones cerradas', 'inscripción cerrada', 'inscripcion cerrada', 'finalizada');

update races set estado = 'Próximamente', updated_at = now()
where estado is distinct from 'Próximamente'
  and lower(estado) in ('proximamente', 'próximamente', 'próximamente abiertas', 'aún no abierta');

update races set estado = 'Pendiente verificar', updated_at = now()
where estado is distinct from 'Pendiente verificar'
  and (estado is null or trim(estado) = '' or lower(estado) in ('fecha pendiente', 'pendiente', 'por confirmar', 'pendiente de verificar', 'sin confirmar'));

-- Comprobación: solo deberían quedar los 5 textos canónicos
select estado, count(*) from races group by estado order by 2 desc;

commit;
