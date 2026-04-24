-- Migración: añadir columnas faltantes a la tabla races
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE public.races
  ADD COLUMN IF NOT EXISTS municipio    TEXT,
  ADD COLUMN IF NOT EXISTS provincia    TEXT,
  ADD COLUMN IF NOT EXISTS formato      TEXT,
  ADD COLUMN IF NOT EXISTS distancia_km NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS source       TEXT,
  ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Índices opcionales
CREATE INDEX IF NOT EXISTS idx_races_provincia ON public.races (provincia);
CREATE INDEX IF NOT EXISTS idx_races_source    ON public.races (source);

-- Trigger updated_at (por si no existe aún)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS races_updated_at ON public.races;
CREATE TRIGGER races_updated_at
  BEFORE UPDATE ON public.races
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
