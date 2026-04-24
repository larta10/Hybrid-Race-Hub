-- Script completo para actualizar TODAS las carreras
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar todas las que NO tienen url
UPDATE public.races 
SET url = 'https://www.google.com/search?q=carreras+ocr+espana'
WHERE url IS NULL OR url = '';

-- 2. Spartan Race
UPDATE public.races 
SET url = 'https://es.spartan.com/es/races', precio = 'Desde 99€', formato = 'Individual'
WHERE modalidad ILIKE '%spartan%';

-- 3. Tough Mudder
UPDATE public.races 
SET url = 'https://toughmudder.com/es', precio = 'Desde 89€', formato = 'Individual'
WHERE modalidad ILIKE '%mudder%';

-- 4. HYROX
UPDATE public.races 
SET url = 'https://hyrox.com', precio = 'Desde 69€', formato = 'Individual'
WHERE modalidad ILIKE '%hyrox%';

-- 5. CrossFit
UPDATE public.races 
SET url = 'https://crossfit.com', precio = 'Desde 50€', formato = 'Individual'
WHERE modalidad ILIKE '%crossfit%';

-- 6. OCR General / Otras carreras
UPDATE public.races 
SET url = 'https://carrerasocr.com', precio = 'Consultar', formato = 'Individual'
WHERE modalidad ILIKE '%ocr%' AND (url IS NULL OR url = '');

-- 7. Funcional / Fitness
UPDATE public.races 
SET url = 'https://www.google.com/search?q=box+crossfit+espana', precio = 'Consultar', formato = 'Individual'
WHERE modalidad ILIKE '%funcional%' OR modalidad ILIKE '%fitness%';

-- 8. Ver estadísticas finales
SELECT 
  modalidad,
  COUNT(*) as total,
  SUM(CASE WHEN url IS NOT NULL AND url != '' AND url != 'https://www.google.com/search?q=carreras+ocr+espana' AND url != 'https://www.google.com/search?q=box+crossfit+espana' THEN 1 ELSE 0 END) as con_enlace_real,
  SUM(CASE WHEN precio IS NOT NULL AND precio != '' AND precio != 'Consultar' THEN 1 ELSE 0 END) as con_precio,
  SUM(CASE WHEN distancia IS NOT NULL AND distancia != '' THEN 1 ELSE 0 END) as con_distancia
FROM public.races 
GROUP BY modalidad
ORDER BY total DESC;

-- 9. Ver carreras SIN información
SELECT nombre, modalidad, fecha, ubicacion 
FROM public.races 
WHERE (url IS NULL OR url = '' OR url LIKE '%google.com%') 
   AND (precio IS NULL OR precio = '' OR precio = 'Consultar')
LIMIT 30;