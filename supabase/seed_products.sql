-- seed_products.sql
-- Productos de ejemplo recomendados

INSERT INTO public.recommended_products (name, description, image_url, price_approx, product_url, category) VALUES
(
  'Salomon Speedcross 7',
  'Zapatilla trail con máximo agarre para barro y terrenos mixtos. Refuerzo toe cap protector.',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  '~130€',
  'https://www.amazon.es/s?k=salomon+speedcross+7',
  'Zapatillas'
),
(
  'Guantes Ninja Grip',
  'Guantes técnicos con agarre reforzado para obstáculos y paredes.',
  'https://images.unsplash.com/photo-1588850561407-ed0ee50a2d61?w=400',
  '~15€',
  'https://www.amazon.es/s?k=guantes+ocr',
  'Guantes'
),
(
  'Cinturón lastrado 20kg',
  'Cinturón delastrado para entrenamiento de fuerza específica OCR.',
  'https://images.unsplash.com/photo-1517836328461-58f529a2f?w=400',
  '~45€',
  'https://www.amazon.es/s?k=cinturon+lastrado',
  'Entrenamiento'
),
(
  'Kettlebell 16kg',
  'Pesa rusa para entrenamiento functional e híbridos.',
  'https://images.unsplash.com/photo-1584735935689-2f6fe6c2eb?w=400',
  'Desde 35€',
  'https://www.amazon.es/s?k=kettlebell+16kg',
  'Entrenamiento'
);