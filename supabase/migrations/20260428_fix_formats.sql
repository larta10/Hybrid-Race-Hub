-- Actualizar formato para permitir Individual y Parejas en todas las modalidades
-- Ejecutar en Supabase SQL Editor

-- HYROX - debe tener Individual y Parejas
UPDATE public.races SET formato = 'Individual'
WHERE modalidad ILIKE '%hyrox%' AND (formato IS NULL OR formato = '');

-- SPARTAN - Individual, Parejas, Equipos, Elite
UPDATE public.races SET formato = 'Individual, Parejas, Equipos, Elite'
WHERE modalidad ILIKE '%spartan%' AND (formato IS NULL OR formato = '');

-- TOUGH MUDDER - Individual y Parejas
UPDATE public.races SET formato = 'Individual, Parejas'
WHERE modalidad ILIKE '%mudder%' AND (formato IS NULL OR formato = '');

-- CROSSFIT
UPDATE public.races SET formato = 'Individual, Parejas, Equipos'
WHERE modalidad ILIKE '%crossfit%' AND (formato IS NULL OR formato = '');

-- OCR General
UPDATE public.races SET formato = 'Individual, Parejas, Equipos'
WHERE modalidad ILIKE '%ocr%' AND (formato IS NULL OR formato = '');

-- FITNESS FUNCIONAL
UPDATE public.races SET formato = 'Individual, Parejas'
WHERE modalidad ILIKE '%funcional%' OR modalidad ILIKE '%fitness%' AND (formato IS NULL OR formato = '');

-- Ver resultado
SELECT modalidad, formato, COUNT(*) as total 
FROM public.races 
GROUP BY modalidad, formato
ORDER BY modalidad;