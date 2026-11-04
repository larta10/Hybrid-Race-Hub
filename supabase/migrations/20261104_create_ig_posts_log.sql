-- Registro de publicaciones automáticas en Instagram (scripts/instagram/publish.mjs).
-- Solo lo usa el service_role desde GitHub Actions: RLS activado y sin políticas.
create table if not exists public.ig_posts_log (
  id bigserial primary key,
  post_id text not null,
  fecha date not null,
  ig_media_id text,
  status text not null check (status in ('published', 'failed', 'dry_run')),
  error text,
  created_at timestamptz not null default now()
);

-- Un mismo post no se publica dos veces
create unique index if not exists ig_posts_log_post_published_uniq
  on public.ig_posts_log (post_id) where status = 'published';

create index if not exists ig_posts_log_fecha_idx on public.ig_posts_log (fecha);

alter table public.ig_posts_log enable row level security;

-- Bucket público para las imágenes de los carruseles (Instagram las descarga por URL)
insert into storage.buckets (id, name, public)
values ('instagram', 'instagram', true)
on conflict (id) do update set public = true;
