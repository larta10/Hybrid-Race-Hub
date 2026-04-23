-- ─────────────────────────────────────────────────────────────────────────────
-- Hibrid Sport Calendar — races table
-- Run once in Supabase SQL Editor (or via supabase db push)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.races (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT        NOT NULL,
  fecha            TEXT,                     -- display: "15 abr 2026"
  fecha_iso        DATE,                     -- ISO: 2026-04-15
  ubicacion        TEXT,                     -- "Artajona, Navarra"
  municipio        TEXT,
  provincia        TEXT,
  comunidad        TEXT,
  pais             TEXT        NOT NULL DEFAULT 'España',
  modalidad        TEXT,                     -- label: "OCR", "Running"…
  modalidad_id     TEXT,                     -- "ocr-general", "running-road"…
  modalidad_parent TEXT,                     -- "ocr", "running"…
  distancia        TEXT,                     -- "42 km", "10K + 20 obstáculos"
  distancia_km     NUMERIC(8,2),             -- numeric for range slider filter
  precio           TEXT,
  estado           TEXT        DEFAULT 'Abierta',
  url              TEXT,
  formato          TEXT,                     -- "individual", "pairs", "team", "elite"
  notas            TEXT,
  source           TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes used by the frontend filters
CREATE INDEX IF NOT EXISTS idx_races_fecha_iso        ON public.races (fecha_iso);
CREATE INDEX IF NOT EXISTS idx_races_comunidad        ON public.races (comunidad);
CREATE INDEX IF NOT EXISTS idx_races_pais             ON public.races (pais);
CREATE INDEX IF NOT EXISTS idx_races_modalidad_id     ON public.races (modalidad_id);
CREATE INDEX IF NOT EXISTS idx_races_modalidad_parent ON public.races (modalidad_parent);
CREATE INDEX IF NOT EXISTS idx_races_distancia_km     ON public.races (distancia_km);
CREATE INDEX IF NOT EXISTS idx_races_formato          ON public.races (formato);

-- Row Level Security: public read, service-role write
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON public.races;
CREATE POLICY "Public read" ON public.races FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service write" ON public.races;
CREATE POLICY "Service write" ON public.races
  FOR ALL USING (auth.role() = 'service_role');

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS races_updated_at ON public.races;
CREATE TRIGGER races_updated_at
  BEFORE UPDATE ON public.races
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
