-- sport_centers: BasicFit, DreamFit, Vivagym gyms in Spain
CREATE TABLE IF NOT EXISTS public.sport_centers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT        NOT NULL,
  direccion   TEXT,
  ciudad      TEXT,
  provincia   TEXT,
  ccaa        TEXT,
  url         TEXT,
  franquicia  TEXT,
  tipo        TEXT        DEFAULT 'gimnasio',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sport_centers_nombre_ciudad
  ON public.sport_centers (nombre, ciudad);

CREATE INDEX IF NOT EXISTS idx_sport_centers_ccaa      ON public.sport_centers (ccaa);
CREATE INDEX IF NOT EXISTS idx_sport_centers_ciudad    ON public.sport_centers (ciudad);
CREATE INDEX IF NOT EXISTS idx_sport_centers_franquicia ON public.sport_centers (franquicia);

ALTER TABLE public.sport_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON public.sport_centers;
CREATE POLICY "Public read" ON public.sport_centers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service write" ON public.sport_centers;
CREATE POLICY "Service write" ON public.sport_centers
  FOR ALL USING (auth.role() = 'service_role');

DROP TRIGGER IF EXISTS sport_centers_updated_at ON public.sport_centers;
CREATE TRIGGER sport_centers_updated_at
  BEFORE UPDATE ON public.sport_centers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
