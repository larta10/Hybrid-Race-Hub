-- Tipo de publicación: carrusel (imágenes) o reel (vídeo). Las filas anteriores eran carruseles.
alter table public.ig_posts_log add column if not exists tipo text not null default 'carrusel';
alter table public.ig_posts_log drop constraint if exists ig_posts_log_tipo_check;
alter table public.ig_posts_log add constraint ig_posts_log_tipo_check check (tipo in ('carrusel', 'reel'));
