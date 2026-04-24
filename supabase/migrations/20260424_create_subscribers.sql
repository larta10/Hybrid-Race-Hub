-- Tabla de suscriptores al newsletter
CREATE TABLE IF NOT EXISTS public.subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT subscribers_email_unique UNIQUE (email)
);

-- Habilitar RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Permitir inserciones anónimas (para el formulario del frontend)
CREATE POLICY "public_can_subscribe" ON public.subscribers
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Índice para consultas por email
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON public.subscribers (active) WHERE active = TRUE;
