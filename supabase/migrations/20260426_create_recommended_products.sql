-- Tabla de productos recomendados
CREATE TABLE IF NOT EXISTS public.recommended_products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  description     TEXT,
  image_url       TEXT,
  price_approx    TEXT,                     -- "~120€", "Desde 89€"
  product_url     TEXT        NOT NULL,   -- Afiliate link
  category        TEXT,                     -- "Zapatillas", "Cinturón", "Guantes", etc.
  active          BOOLEAN      DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON public.recommended_products (active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.recommended_products (category);

ALTER TABLE public.recommended_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON public.recommended_products;
CREATE POLICY "Public read products" ON public.recommended_products FOR SELECT USING (active = true);