-- ============================================
-- SEED COMPLETO PARA CARRERAS OCR/FUNCIONALES 2026
-- Incluye: distancia, precio, url, formato
-- ============================================

-- SPARTAN RACE ESPAÑA 2026
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,precio,url,formato,estado) VALUES
-- Madrid (9-10 Mayo)
('Spartan Race Madrid - Sprint','9 may 2026','2026-05-09','San Agustín del Guadalix','Madrid','Madrid','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr','5K + 20 obstáculos',5,'102€','https://es.spartan.com/es/races/madrid','Individual','Abierta'),
('Spartan Race Madrid - Super','9 may 2026','2026-05-09','San Agustín del Guadalix','Madrid','Madrid','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr','10K + 25 obstáculos',10,'132€','https://es.spartan.com/es/races/madrid','Individual','Abierta'),
('Spartan Race Madrid - Beast','10 may 2026','2026-05-10','San Agustín del Guadalix','Madrid','Madrid','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr','21K + 30 obstáculos',21,'168€','https://es.spartan.com/es/races/madrid','Individual','Abierta'),
-- Andorra (6-7 Junio)
('Spartan Race Andorra - Sprint','6 jun 2026','2026-06-06','Encamp','Encamp','Andorra','Encamp, Andorra','Spartan Race','ocr-spartan','ocr','5K + 20 obstáculos',5,'103€','https://es.spartan.com/es/races/encamp-andorra','Individual','Abierta'),
('Spartan Race Andorra - Super','6 jun 2026','2026-06-06','Encamp','Encamp','Andorra','Encamp, Andorra','Spartan Race','ocr-spartan','ocr','10K + 25 obstáculos',10,'143€','https://es.spartan.com/es/races/encamp-andorra','Individual','Abierta'),
('Spartan Race Andorra - Beast','7 jun 2026','2026-06-07','Encamp','Encamp','Andorra','Encamp, Andorra','Spartan Race','ocr-spartan','ocr','21K + 30 obstáculos',21,'178€','https://es.spartan.com/es/races/encamp-andorra','Individual','Abierta'),
-- Tenerife (28-29 Noviembre)
('Spartan Race Tenerife - Sprint','28 nov 2026','2026-11-28','Puerto de la Cruz','Santa Cruz de Tenerife','Canarias','Puerto de la Cruz, Tenerife','Spartan Race','ocr-spartan','ocr','5K + 20 obstáculos',5,'115€','https://es.spartan.com/es/races/tenerife','Individual','Abierta'),
('Spartan Race Tenerife - Super','28 nov 2026','2026-11-28','Puerto de la Cruz','Santa Cruz de Tenerife','Canarias','Puerto de la Cruz, Tenerife','Spartan Race','ocr-spartan','ocr','10K + 25 obstáculos',10,'144€','https://es.spartan.com/es/races/tenerife','Individual','Abierta'),
('Spartan Race Tenerife - Beast','29 nov 2026','2026-11-29','Puerto de la Cruz','Santa Cruz de Tenerife','Canarias','Puerto de la Cruz, Tenerife','Spartan Race','ocr-spartan','ocr','21K + 30 obstáculos',21,'192€','https://es.spartan.com/es/races/tenerife','Individual','Abierta'),
-- Santa Susanna Barcelona (Octubre)
('Spartan Race Barcelona - Sprint','17 oct 2026','2026-10-17','Santa Susanna','Barcelona','Cataluña','Santa Susanna, Barcelona','Spartan Race','ocr-spartan','ocr','5K + 20 obstáculos',5,'70€','https://es.spartan.com/es/races/barcelona','Individual','Abierta'),
('Spartan Race Barcelona - Super','18 oct 2026','2026-10-18','Santa Susanna','Barcelona','Cataluña','Santa Susanna, Barcelona','Spartan Race','ocr-spartan','ocr','10K + 25 obstáculos',10,'90€','https://es.spartan.com/es/races/barcelona','Individual','Abierta'),
('Spartan Race Barcelona - Beast','19 oct 2026','2026-10-19','Santa Susanna','Barcelona','Cataluña','Santa Susanna, Barcelona','Spartan Race','ocr-spartan','ocr','21K + 30 obstáculos',21,'120€','https://es.spartan.com/es/races/barcelona','Individual','Abierta');

-- TOUGH MUDDER ESPAÑA 2026
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,precio,url,formato,estado) VALUES
('Tough Mudder Madrid','27 sept 2026','2026-09-27','Cerro de San Polonia','Madrid','Madrid','Madrid','Tough Mudder','ocr-mudder','ocr','10 Millas + 25 obstáculos',16,'89€','https://toughmudder.com/es','Individual','Abierta'),
('Tough Mudder Barcelona','18 oct 2026','2026-10-18','Barcelona','Barcelona','Cataluña','Barcelona','Tough Mudder','ocr-mudder','ocr','10 Millas + 25 obstáculos',16,'89€','https://toughmudder.com/es','Individual','Abierta');

-- HYROX ESPAÑA 2026
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,precio,url,formato,estado) VALUES
('HYROX Madrid','14 feb 2026','2026-02-14','Madrid','Madrid','Madrid','Madrid','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Barcelona','21 mar 2026','2026-03-21','Barcelona','Barcelona','Cataluña','Barcelona','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Valencia','25 abr 2026','2026-04-25','Valencia','Valencia','Comunidad Valenciana','Valencia','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Sevilla','16 may 2026','2026-05-16','Sevilla','Sevilla','Andalucía','Sevilla','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Bilbao','20 jun 2026','2026-06-20','Bilbao','Bizkaia','País Vasco','Bilbao','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Málaga','27 jun 2026','2026-06-27','Málaga','Málaga','Andalucía','Málaga','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Santiago de Compostela','4 jul 2026','2026-07-04','Santiago de Compostela','A Coruña','Galicia','Santiago de Compostela','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta'),
('HYROX Zaragoza','19 sept 2026','2026-09-19','Zaragoza','Zaragoza','Aragón','Zaragoza','HYROX','func-hyrox','funcional','8 estacion + 1.5K carrera','69€','https://hyrox.com','Individual','Abierta');

-- CROSSFIT OPEN / COMPETICIONES
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,ubicacion,modalidad,modalidad_id,modalidad_parent,precio,url,formato,estado) VALUES
('CrossFit Open 26.1','27 feb 2026','2026-02-27','Varios','Varios','España','España','CrossFit','func-crossfit','funcional','50€','https://crossfit.com','Individual','Abierta'),
('CrossFit Open 26.2','6 mar 2026','2026-03-06','Varios','Varios','España','España','CrossFit','func-crossfit','funcional','50€','https://crossfit.com','Individual','Abierta'),
('CrossFit Open 26.3','13 mar 2026','2026-03-13','Varios','Varios','España','España','CrossFit','func-crossfit','funcional','50€','https://crossfit.com','Individual','Abierta');

-- Verificar inserciones
SELECT modalidad, COUNT(*) as total FROM public.races GROUP BY modalidad;