-- ─────────────────────────────────────────────────────────────────────────────
-- Hibrid Sport Calendar — seed data  (Spain 2026, ~250 pruebas)
-- Sources: calendariocarrerasobstaculos.es · soycorredor.es · runnea.com
--          labolsadelcorredor.com · triatlonchannel.com · hyroxinsider.com
--          es.spartan.com · calendarioaguasabiertas.com · buscametas.com
-- Run in Supabase SQL Editor after running the migration.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════
-- OCR / CARRERAS DE OBSTÁCULOS  (fuente: calendariocarrerasobstaculos.es)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia_km,estado,source) VALUES
-- ABRIL
('Gladiator''s Day','11 abr 2026','2026-04-11','Artajona','Navarra','Navarra','España','Artajona, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Survivor Race','11 abr 2026','2026-04-11','Alicante','Alicante','Comunidad Valenciana','España','Alicante','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('OCR Mencey','12 abr 2026','2026-04-12','Granadilla de Abona','Santa Cruz de Tenerife','Canarias','España','Granadilla de Abona, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Fungo Race','12 abr 2026','2026-04-12','El Puerto de Santa María','Cádiz','Andalucía','España','El Puerto de Santa María, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Milex Race','18 abr 2026','2026-04-18','Beniel','Murcia','Murcia','España','Beniel, Murcia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Medieval Xtreme Race','19 abr 2026','2026-04-19','Torreblanca','Castellón','Comunidad Valenciana','España','Torreblanca, Castellón','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Alma Guerrera','19 abr 2026','2026-04-19','Castañeda','Cantabria','Cantabria','España','Castañeda, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío de Guerreros','19 abr 2026','2026-04-19','Gernika-Lumo','Bizkaia','País Vasco','España','Gernika-Lumo, Bizkaia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Bull Race','25 abr 2026','2026-04-25','Quel','La Rioja','La Rioja','España','Quel, La Rioja','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('La Batalla de las Sardinas','25 abr 2026','2026-04-25','Candás','Asturias','Asturias','España','Candás, Asturias','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Pretorian Race','25 abr 2026','2026-04-25','Sarria','Lugo','Galicia','España','Sarria, Lugo','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Berserker Xtreme Race','26 abr 2026','2026-04-26','Tacoronte','Santa Cruz de Tenerife','Canarias','España','Tacoronte, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Adrenaline Race','26 abr 2026','2026-04-26','Almuñécar','Granada','Andalucía','España','Almuñécar, Granada','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- MAYO
('Desafío Sierra de Cádiz','2 may 2026','2026-05-02','Arcos de la Frontera','Cádiz','Andalucía','España','Arcos de la Frontera, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('San Isidro Xtreme','2 may 2026','2026-05-02','La Puebla de Almoradiel','Toledo','Castilla-La Mancha','España','La Puebla de Almoradiel, Toledo','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Pinar Extremo','3 may 2026','2026-05-03','San Roque','Cádiz','Andalucía','España','San Roque, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Farinato Race León','3 may 2026','2026-05-03','León','León','Castilla y León','España','León','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Spartan Race Madrid — Sprint','9 may 2026','2026-05-09','San Agustín del Guadalix','Madrid','Madrid','España','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr',5.00,'Abierta','es.spartan.com'),
('Spartan Race Madrid — Super','9 may 2026','2026-05-09','San Agustín del Guadalix','Madrid','Madrid','España','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr',10.00,'Abierta','es.spartan.com'),
('Spartan Race Madrid — Beast','10 may 2026','2026-05-10','San Agustín del Guadalix','Madrid','Madrid','España','San Agustín del Guadalix, Madrid','Spartan Race','ocr-spartan','ocr',21.00,'Abierta','es.spartan.com'),
('Rabiosa Race','9 may 2026','2026-05-09','Marcilla','Navarra','Navarra','España','Marcilla, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Cavernícola Race','9 may 2026','2026-05-09','Barbadás','Ourense','Galicia','España','Barbadás, Ourense','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Estorbo Race','9 may 2026','2026-05-09','La Cartuja Baja','Zaragoza','Aragón','España','La Cartuja Baja, Zaragoza','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Salvando Race','10 may 2026','2026-05-10','Villanueva de Córdoba','Córdoba','Andalucía','España','Villanueva de Córdoba, Córdoba','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Crazy Run','10 may 2026','2026-05-10','Archena','Murcia','Murcia','España','Archena, Murcia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Edelweiss Race','10 may 2026','2026-05-10','Sabiñánigo','Huesca','Aragón','España','Sabiñánigo, Huesca','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Poseidon Race','16 may 2026','2026-05-16','Cerceda','A Coruña','Galicia','España','Cerceda, A Coruña','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Farinato Race Alcobendas','16 may 2026','2026-05-16','Alcobendas','Madrid','Madrid','España','Alcobendas, Madrid','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Survivor Race Barcelona','16 may 2026','2026-05-16','Barcelona','Barcelona','Cataluña','España','Barcelona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Isla Race','17 may 2026','2026-05-17','Port Adriano','Baleares','Baleares','España','Port Adriano, Baleares','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Calvarian Race','23 may 2026','2026-05-23','Alcorisa','Teruel','Aragón','España','Alcorisa, Teruel','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Costa Blanca Mayo','24 may 2026','2026-05-24','Mutxamel','Alicante','Comunidad Valenciana','España','Mutxamel, Alicante','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío de Guerreros Pineda','24 may 2026','2026-05-24','Pineda de Mar','Barcelona','Cataluña','España','Pineda de Mar, Barcelona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Denontzat Race','30 may 2026','2026-05-30','Irún','Gipuzkoa','País Vasco','España','Irún, Gipuzkoa','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Fan-Pin Race','30 may 2026','2026-05-30','San Fernando','Cádiz','Andalucía','España','San Fernando, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Rural Warrior','30 may 2026','2026-05-30','Tobarra','Albacete','Castilla-La Mancha','España','Tobarra, Albacete','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Faraon Race','30 may 2026','2026-05-30','Buñuel','Navarra','Navarra','España','Buñuel, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- JUNIO
('Desafío Arcilasis','6 jun 2026','2026-06-06','Archivel','Murcia','Murcia','España','Archivel, Murcia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Survivor Race Madrid Junio','6 jun 2026','2026-06-06','Madrid','Madrid','Madrid','España','Madrid','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Gladiator Race Pontevedra','6 jun 2026','2026-06-06','Pontevedra','Pontevedra','Galicia','España','Pontevedra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Pinatarius Obstaculum Cursus','6 jun 2026','2026-06-06','San Pedro del Pinatar','Murcia','Murcia','España','San Pedro del Pinatar, Murcia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('1 y 1 Aguas de Teror','13 jun 2026','2026-06-13','Teror','Las Palmas','Canarias','España','Teror, Las Palmas','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Medieval Xtreme Race Valencia','13 jun 2026','2026-06-13','Alginet','Valencia','Comunidad Valenciana','España','Alginet, Valencia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Wolf Race','13 jun 2026','2026-06-13','Caparroso','Navarra','Navarra','España','Caparroso, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Legion Race Manresa','13 jun 2026','2026-06-13','Manresa','Barcelona','Cataluña','España','Manresa, Barcelona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Farinato Race Gijón','13 jun 2026','2026-06-13','Gijón','Asturias','Asturias','España','Gijón, Asturias','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Unbroken Race','13 jun 2026','2026-06-13','Onda','Castellón','Comunidad Valenciana','España','Onda, Castellón','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('OCR Mencey La Gomera','13 jun 2026','2026-06-13','La Gomera','Santa Cruz de Tenerife','Canarias','España','La Gomera, Santa Cruz de Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('A Revolta Irmandiña','14 jun 2026','2026-06-14','Verín','Ourense','Galicia','España','Verín, Ourense','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Argoños OCR','14 jun 2026','2026-06-14','Argoños','Cantabria','Cantabria','España','Argoños, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Hard Running Jarama','14 jun 2026','2026-06-14','Valdetorres de Jarama','Madrid','Madrid','España','Valdetorres de Jarama, Madrid','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Samoa Race','20 jun 2026','2026-06-20','Cogollos de la Vega','Granada','Andalucía','España','Cogollos de la Vega, Granada','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Othar Race','20 jun 2026','2026-06-20','Cózar','Ciudad Real','Castilla-La Mancha','España','Cózar, Ciudad Real','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Heracles Race','20 jun 2026','2026-06-20','Caldes de Malavella','Girona','Cataluña','España','Caldes de Malavella, Girona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Bestial Race La Palma','20 jun 2026','2026-06-20','Santa Cruz de la Palma','Santa Cruz de Tenerife','Canarias','España','Santa Cruz de la Palma','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Carrera de Combate Valladolid','20 jun 2026','2026-06-20','Santovenia de Pisuerga','Valladolid','Castilla y León','España','Santovenia de Pisuerga, Valladolid','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío de Guerreros Valencia','21 jun 2026','2026-06-21','Valencia','Valencia','Comunidad Valenciana','España','Valencia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Águila Race','21 jun 2026','2026-06-21','Aguilafuente','Segovia','Castilla y León','España','Aguilafuente, Segovia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Invader Race','27 jun 2026','2026-06-27','Alt Penedès','Barcelona','Cataluña','España','Alt Penedès, Barcelona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Zufarian Race','27 jun 2026','2026-06-27','Zuera','Zaragoza','Aragón','España','Zuera, Zaragoza','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Heroican Race','28 jun 2026','2026-06-28','Ribadeo','Lugo','Galicia','España','Ribadeo, Lugo','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- JULIO
('Desafío Ilurcis','4 jul 2026','2026-07-04','Alfaro','La Rioja','La Rioja','España','Alfaro, La Rioja','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Nao Race Naos','4 jul 2026','2026-07-04','Puerto de Naos','Las Palmas','Canarias','España','Puerto de Naos, La Palma','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Samurai Xtreme Race','4 jul 2026','2026-07-04','As Pontes de García Rodríguez','A Coruña','Galicia','España','As Pontes, A Coruña','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Conquista La Victoria','5 jul 2026','2026-07-05','La Victoria de Acentejo','Santa Cruz de Tenerife','Canarias','España','La Victoria de Acentejo, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desembarco Vikingo','11 jul 2026','2026-07-11','Colindres','Cantabria','Cantabria','España','Colindres, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Nao Race Tazacorte','18 jul 2026','2026-07-18','Tazacorte','Santa Cruz de Tenerife','Canarias','España','Tazacorte, La Palma','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Carrera del Barro','19 jul 2026','2026-07-19','La Barca de la Florida','Cádiz','Andalucía','España','La Barca de la Florida, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('OCR Mencey Julio','25 jul 2026','2026-07-25','Guía de Isora','Santa Cruz de Tenerife','Canarias','España','Guía de Isora, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- AGOSTO
('OCR Danger Extreme','1 ago 2026','2026-08-01','Fuerteventura','Las Palmas','Canarias','España','Fuerteventura, Las Palmas','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Cántabro Agosto','1 ago 2026','2026-08-01','Viérnoles','Cantabria','Cantabria','España','Viérnoles, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Xtreme Natural Tesorillo','2 ago 2026','2026-08-02','San Martín del Tesorillo','Cádiz','Andalucía','España','San Martín del Tesorillo, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Patuntos Race','15 ago 2026','2026-08-15','Ahigal de los Aceiteros','Salamanca','Castilla y León','España','Ahigal de los Aceiteros, Salamanca','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- SEPTIEMBRE
('Desafío Cántabro Noja','6 sep 2026','2026-09-06','Noja','Cantabria','Cantabria','España','Noja, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Lobo Race','6 sep 2026','2026-09-06','Salas','Asturias','Asturias','España','Salas, Asturias','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Victoria Race','12 sep 2026','2026-09-12','Nanclares de la Oca','Álava','País Vasco','España','Nanclares de la Oca, Álava','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Kong Race','12 sep 2026','2026-09-12','Calonge','Girona','Cataluña','España','Calonge, Girona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Baifo Extreme','13 sep 2026','2026-09-13','Fuerteventura','Las Palmas','Canarias','España','Fuerteventura, Las Palmas','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Uros Race','13 sep 2026','2026-09-13','Toén','Ourense','Galicia','España','Toén, Ourense','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Costa Blanca Sep','13 sep 2026','2026-09-13','Bigastro','Alicante','Comunidad Valenciana','España','Bigastro, Alicante','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Iberus Race','19 sep 2026','2026-09-19','Milagro','Navarra','Navarra','España','Milagro, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Salvaje Race','19 sep 2026','2026-09-19','San Fernando','Cádiz','Andalucía','España','San Fernando, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Atlantis Race','19 sep 2026','2026-09-19','Carballo','A Coruña','Galicia','España','Carballo, A Coruña','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Adrenaline Race Zahara','26 sep 2026','2026-09-26','Zahara de los Atunes','Cádiz','Andalucía','España','Zahara de los Atunes, Cádiz','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Valkiria Race','26 sep 2026','2026-09-26','Barreiros','Lugo','Galicia','España','Barreiros, Lugo','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Pirates Race','26 sep 2026','2026-09-26','Bétera','Valencia','Comunidad Valenciana','España','Bétera, Valencia','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Santuario Race','27 sep 2026','2026-09-27','Malpartida de Cáceres','Cáceres','Extremadura','España','Malpartida de Cáceres, Cáceres','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío de Guerreros Madrid Sep','27 sep 2026','2026-09-27','Madrid','Madrid','Madrid','España','Madrid','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- OCTUBRE
('Lince Extreme Running','3 oct 2026','2026-10-03','Punta Umbría','Huelva','Andalucía','España','Punta Umbría, Huelva','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Valhalla Race','3 oct 2026','2026-10-03','L''Alcora','Castellón','Comunidad Valenciana','España','L''Alcora, Castellón','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Hard Running Jaén','4 oct 2026','2026-10-04','La Carolina','Jaén','Andalucía','España','La Carolina, Jaén','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('OCR Crossfast Race','4 oct 2026','2026-10-04','Hoya Fría','Santa Cruz de Tenerife','Canarias','España','Hoya Fría, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Boot Camp Vigo','4 oct 2026','2026-10-04','Vigo','Pontevedra','Galicia','España','Vigo, Pontevedra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('OCR Mencey La Laguna','10 oct 2026','2026-10-10','La Laguna','Santa Cruz de Tenerife','Canarias','España','La Laguna, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Invictus Race','11 oct 2026','2026-10-11','Santoña','Cantabria','Cantabria','España','Santoña, Cantabria','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Gladius Race','17 oct 2026','2026-10-17','Santacara','Navarra','Navarra','España','Santacara, Navarra','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Spartan Race Santa Susanna — Sprint','17 oct 2026','2026-10-17','Santa Susanna','Barcelona','Cataluña','España','Santa Susanna, Barcelona','Spartan Race','ocr-spartan','ocr',5.00,'Abierta','es.spartan.com'),
('Spartan Race Santa Susanna — Super','18 oct 2026','2026-10-18','Santa Susanna','Barcelona','Cataluña','España','Santa Susanna, Barcelona','Spartan Race','ocr-spartan','ocr',10.00,'Abierta','es.spartan.com'),
('Bestial Race Canarias Oct','24 oct 2026','2026-10-24','Hoya del Morcillo','Santa Cruz de Tenerife','Canarias','España','Hoya del Morcillo, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío de Guerreros Málaga','25 oct 2026','2026-10-25','Rincón de la Victoria','Málaga','Andalucía','España','Rincón de la Victoria, Málaga','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Medieval Xtreme Race Peñíscola','25 oct 2026','2026-10-25','Peñíscola','Castellón','Comunidad Valenciana','España','Peñíscola, Castellón','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
-- NOVIEMBRE
('OCR Mencey Los Realejos','8 nov 2026','2026-11-08','Los Realejos','Santa Cruz de Tenerife','Canarias','España','Los Realejos, Tenerife','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Gollizno Race','8 nov 2026','2026-11-08','Olivares','Granada','Andalucía','España','Olivares, Granada','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Monster Race','8 nov 2026','2026-11-08','Sant Miquel de Campmajor','Girona','Cataluña','España','Sant Miquel de Campmajor, Girona','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Desafío Costa Blanca Nov','22 nov 2026','2026-11-22','Mutxamel','Alicante','Comunidad Valenciana','España','Mutxamel, Alicante','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es'),
('Spartan Race Tenerife — Sprint','28 nov 2026','2026-11-28','Santa Cruz de Tenerife','Santa Cruz de Tenerife','Canarias','España','Santa Cruz de Tenerife','Spartan Race','ocr-spartan','ocr',5.00,'Abierta','es.spartan.com'),
('Spartan Race Tenerife — Super','29 nov 2026','2026-11-29','Santa Cruz de Tenerife','Santa Cruz de Tenerife','Canarias','España','Santa Cruz de Tenerife','Spartan Race','ocr-spartan','ocr',10.00,'Abierta','es.spartan.com'),
-- DICIEMBRE
('Bestial Race Gran Canaria','5 dic 2026','2026-12-05','Arucas','Las Palmas','Canarias','España','Arucas, Las Palmas','OCR','ocr-general','ocr',NULL,'Abierta','calendariocarrerasobstaculos.es');

-- ═══════════════════════════════════════════════════════════════════════════
-- RUNNING — MARATONES 42 km  (fuente: soycorredor.es)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,precio,estado,url,source) VALUES
('Maratón de Almagro','25 ene 2026','2026-01-25','Almagro','Ciudad Real','Castilla-La Mancha','España','Almagro, Ciudad Real','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('TotalEnergies Maratón Murcia Costa Cálida','1 feb 2026','2026-02-01','Murcia','Murcia','Murcia','España','Murcia','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón Ciudad de Don Benito','8 feb 2026','2026-02-08','Don Benito','Badajoz','Extremadura','España','Don Benito, Badajoz','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Zurich Maratón Sevilla','15 feb 2026','2026-02-15','Sevilla','Sevilla','Andalucía','España','Sevilla','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta','https://www.zurichmaratondesevilla.es','soycorredor.es'),
('Maratón BP Castellón','22 feb 2026','2026-02-22','Castellón de la Plana','Castellón','Comunidad Valenciana','España','Castellón de la Plana','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Zurich Maratón Barcelona','15 mar 2026','2026-03-15','Barcelona','Barcelona','Cataluña','España','Barcelona','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta','https://www.zurichmaratonbarcelona.es','soycorredor.es'),
('Maratón Popular Ciudad de Badajoz','15 mar 2026','2026-03-15','Badajoz','Badajoz','Extremadura','España','Badajoz','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Mann-Filter Maratón Zaragoza','12 abr 2026','2026-04-12','Zaragoza','Zaragoza','Aragón','España','Zaragoza','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta','https://www.maratonzaragoza.com','soycorredor.es'),
('Santa Eulària Ibiza Marathon','18 abr 2026','2026-04-18','Santa Eularia del Riu','Baleares','Baleares','España','Santa Eularia, Ibiza','Running — Maratón','running-road','running','42 km / 22 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón Vías Verdes by Nutrisport','25 abr 2026','2026-04-25','Girona','Girona','Cataluña','España','Girona','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Zurich Rock ''n'' Roll Madrid','26 abr 2026','2026-04-26','Madrid','Madrid','Madrid','España','Madrid','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta','https://www.rocknrollmadrid.es','soycorredor.es'),
('JJP Sherry Maratón Jerez','3 may 2026','2026-05-03','Jerez de la Frontera','Cádiz','Andalucía','España','Jerez de la Frontera, Cádiz','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('TotalEnergies Maratón Martín Fiz Vitoria','10 may 2026','2026-05-10','Vitoria-Gasteiz','Álava','País Vasco','España','Vitoria-Gasteiz, Álava','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón Solidario en Pista Jaén','1 jul 2026','2026-07-01','Jaén','Jaén','Andalucía','España','Jaén','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón Internacional Ciudad de Logroño','4 oct 2026','2026-10-04','Logroño','La Rioja','La Rioja','España','Logroño, La Rioja','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('TUI Palma Marathon Mallorca','18 oct 2026','2026-10-18','Palma de Mallorca','Baleares','Baleares','España','Palma de Mallorca','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón de Toledo','15 nov 2026','2026-11-15','Toledo','Toledo','Castilla-La Mancha','España','Toledo','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Zurich Maratón San Sebastián','22 nov 2026','2026-11-22','San Sebastián','Gipuzkoa','País Vasco','España','San Sebastián, Gipuzkoa','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón Internacional Elche-Alicante','29 nov 2026','2026-11-29','Elche','Alicante','Comunidad Valenciana','España','Elche, Alicante','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Valencia Trinidad Alfonso EDP Maratón','6 dic 2026','2026-12-06','Valencia','Valencia','Comunidad Valenciana','España','Valencia','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta','https://www.valenciaciudaddelrunning.com/maraton/','soycorredor.es'),
('Generali Maratón Málaga','13 dic 2026','2026-12-13','Málaga','Málaga','Andalucía','España','Málaga','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Quijote Maratón Ciudad Real','18 oct 2026','2026-10-18','Ciudad Real','Ciudad Real','Castilla-La Mancha','España','Ciudad Real','Running — Maratón','running-road','running','42 km / 21 km',42.00,NULL,'Abierta',NULL,'soycorredor.es'),
('Maratón de Granada Dic','6 dic 2026','2026-12-06','Granada','Granada','Andalucía','España','Granada','Running — Maratón','running-road','running','42 km',42.00,NULL,'Abierta',NULL,'soycorredor.es');

-- ═══════════════════════════════════════════════════════════════════════════
-- RUNNING — MEDIAS MARATONES Y POPULARES (fuente: runnea.com, carreraspopulares.com)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,estado,url,source) VALUES
('Grup Oliva Motor Mitja de Cambrils','1 mar 2026','2026-03-01','Cambrils','Tarragona','Cataluña','España','Cambrils, Tarragona','Running — Media Maratón','running-road','running','21 km',21.00,'Abierta',NULL,'runnea.com'),
('Media Maratón Granada','25 abr 2026','2026-04-25','Granada','Granada','Andalucía','España','Granada','Running — Media Maratón','running-road','running','21 km / 10 km',21.00,'Abierta',NULL,'runnea.com'),
('Salomon Run Barcelona','11 abr 2026','2026-04-11','Barcelona','Barcelona','Cataluña','España','Barcelona','Running','running-road','running','10 km / 5 km',10.00,'Abierta',NULL,'runnea.com'),
('Subida a Aloña — Aloñako Igoera','26 abr 2026','2026-04-26','Oñati','Gipuzkoa','País Vasco','España','Oñati, Gipuzkoa','Trail','running-mont','running','22.6 km',22.60,'Abierta',NULL,'runnea.com'),
('Medio Maratón de Santander','10 may 2026','2026-05-10','Santander','Cantabria','Cantabria','España','Santander','Running — Media Maratón','running-road','running','21 km',21.00,'Abierta',NULL,'runnea.com'),
('La Cursa El Corte Inglés Barcelona','10 may 2026','2026-05-10','Barcelona','Barcelona','Cataluña','España','Barcelona','Running','running-road','running','10 km',10.00,'Abierta',NULL,'runnea.com'),
('Media Maratón de Cáceres','16 may 2026','2026-05-16','Cáceres','Cáceres','Extremadura','España','Cáceres','Running — Media Maratón','running-road','running','21 km',21.00,'Abierta',NULL,'runnea.com'),
('Media Maratón de Almansa','16 may 2026','2026-05-16','Almansa','Albacete','Castilla-La Mancha','España','Almansa, Albacete','Running — Media Maratón','running-road','running','21 km',21.00,'Abierta',NULL,'runnea.com'),
('10K Nocturna Albacete','23 may 2026','2026-05-23','Albacete','Albacete','Castilla-La Mancha','España','Albacete','Running','running-road','running','10 km',10.00,'Abierta',NULL,'runnea.com'),
('10K Huelva','6 jun 2026','2026-06-06','Huelva','Huelva','Andalucía','España','Huelva','Running','running-road','running','10 km',10.00,'Abierta',NULL,'runnea.com'),
('Burdin Hesiko Mendi Lasterketa','20 jun 2026','2026-06-20','Markina-Xemein','Bizkaia','País Vasco','España','Markina-Xemein, Bizkaia','Trail Montaña','running-mont','running','37 km / 13 km',37.00,'Abierta',NULL,'runnea.com'),
('Media Maratón Valencia','25 oct 2026','2026-10-25','Valencia','Valencia','Comunidad Valenciana','España','Valencia','Running — Media Maratón','running-road','running','21 km',21.00,'Abierta',NULL,'runnea.com'),
('VI Carrera Solidaria Anem Mes Enlla','25 abr 2026','2026-04-25','Alboraya','Valencia','Comunidad Valenciana','España','Alboraya, Valencia','Carrera Popular','running-road','running','5 km',5.00,'Abierta',NULL,'carreraspopulares.com'),
('XVI Carrera de Montaña Sierra de Salinas','17 may 2026','2026-05-17','Salinas','Alicante','Comunidad Valenciana','España','Salinas, Alicante','Trail','running-mont','running','15 km',15.00,'Abierta',NULL,'carreraspopulares.com'),
('XIV Cross 10K Geldo','23 may 2026','2026-05-23','Geldo','Castellón','Comunidad Valenciana','España','Geldo, Castellón','Running','running-road','running','10 km',10.00,'Abierta',NULL,'carreraspopulares.com');

-- ═══════════════════════════════════════════════════════════════════════════
-- TRAIL RUNNING  (fuente: labolsadelcorredor.com, runnea.com)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,estado,url,source) VALUES
('Oxox Vertical Chinte Trail','8 feb 2026','2026-02-08','Ojós','Murcia','Murcia','España','Ojós, Murcia','Trail Vertical','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('The North Face Transgrancanaria','4 mar 2026','2026-03-04','Las Palmas de Gran Canaria','Las Palmas','Canarias','España','Gran Canaria','Ultra Trail','running-trail','running','125 km / 65 km / 42 km',125.00,'Abierta','https://transgrancanaria.net','labolsadelcorredor.com'),
('Cursa 4 Termes','14 mar 2026','2026-03-14','Tarragona','Tarragona','Cataluña','España','Tarragona','Trail','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('Campeonato España Trail Running RFEA','15 mar 2026','2026-03-15','Caldas de Reis','Pontevedra','Galicia','España','Caldas de Reis, Pontevedra','Trail','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('Trail Riotuerto','22 mar 2026','2026-03-22','Riotuerto','Cantabria','Cantabria','España','Riotuerto, Cantabria','Trail','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('KV Losar de la Vera','28 mar 2026','2026-03-28','Losar de la Vera','Cáceres','Extremadura','España','Losar de la Vera, Cáceres','Kilómetro Vertical','running-mont','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('Unicaja Ultra Sierra Nevada','10 abr 2026','2026-04-10','Güéjar-Sierra','Granada','Andalucía','España','Sierra Nevada, Granada','Ultra Trail','running-trail','running','101 km / 25 km',101.00,'Abierta',NULL,'labolsadelcorredor.com'),
('Desafío Calar del Río Mundo','11 abr 2026','2026-04-11','Riópar','Albacete','Castilla-La Mancha','España','Riópar, Albacete','Ultra Trail','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com'),
('Penyagolosa Trails','18 abr 2026','2026-04-18','Vistabella del Maestrat','Castellón','Comunidad Valenciana','España','Vistabella del Maestrat, Castellón','Trail / Ultra','running-trail','running','116 km / 55 km',116.00,'Abierta','https://penyagolosatrails.com','labolsadelcorredor.com'),
('Transvulcania','9 may 2026','2026-05-09','Los Llanos de Aridane','Santa Cruz de Tenerife','Canarias','España','La Palma, Santa Cruz de Tenerife','Ultra Trail','running-trail','running','73 km / 42 km',73.00,'Abierta','https://transvulcania.es','runnea.com'),
('Zegama-Aizkorri','17 may 2026','2026-05-17','Zegama','Gipuzkoa','País Vasco','España','Zegama, Gipuzkoa','Trail Montaña','running-trail','running','42 km',42.00,'Abierta','https://zegama-aizkorri.com','runnea.com'),
('Ultratrail Torla Ordesa','26 jun 2026','2026-06-26','Torla','Huesca','Aragón','España','Torla, Huesca','Ultra Trail','running-trail','running','50 km / 25 km',50.00,'Abierta',NULL,'runnea.com'),
('Epic Trail Vall de Boí','27 jun 2026','2026-06-27','La Vall de Boí','Lleida','Cataluña','España','Vall de Boí, Lleida','Trail','running-trail','running','42 km / 24 km',42.00,'Abierta',NULL,'runnea.com'),
('Gran Trail Picos de Europa','27 jun 2026','2026-06-27','Cangas de Onís','Asturias','Asturias','España','Picos de Europa, Asturias','Ultra Trail','running-trail','running','74 km',74.00,'Abierta',NULL,'runnea.com'),
('Travesera Integral Picos de Europa','13 jun 2026','2026-06-13','Cangas de Onís','Asturias','Asturias','España','Picos de Europa, Asturias','Ultra Trail','running-mont','running','74 km',74.00,'Abierta',NULL,'runnea.com'),
('HOKA Val d''Aran by UTMB','3 jul 2026','2026-07-03','Vielha','Lleida','Cataluña','España','Val d''Aran, Lleida','Ultra Trail UTMB','running-trail','running','163 km / 55 km',163.00,'Abierta','https://valdaran.utmb.world','runnea.com'),
('Gran Trail Aneto Posets','17 jul 2026','2026-07-17','Benasque','Huesca','Aragón','España','Benasque, Huesca','Ultra Trail','running-trail','running','105 km',105.00,'Abierta',NULL,'runnea.com'),
('Trail Valle de Tena','5 sep 2026','2026-09-05','Sallent de Gállego','Huesca','Aragón','España','Sallent de Gállego, Huesca','Trail','running-trail','running','80 km',80.00,'Abierta',NULL,'runnea.com'),
('Ultra Trail Guara Somontano','2 oct 2026','2026-10-02','Alquézar','Huesca','Aragón','España','Alquézar, Huesca','Ultra Trail','running-trail','running','82 km / 40 km',82.00,'Abierta',NULL,'labolsadelcorredor.com'),
('Salomon Ultra Pirineu','2 oct 2026','2026-10-02','Bagà','Barcelona','Cataluña','España','Bagà, Barcelona','Ultra Trail','running-trail','running','110 km / 42 km',110.00,'Abierta','https://ultrapirineu.com','buscametas.com'),
('Tenerife Bluetrail','18 sep 2026','2026-09-18','Santa Cruz de Tenerife','Santa Cruz de Tenerife','Canarias','España','Tenerife','Ultra Trail','running-trail','running','117 km / 70 km',117.00,'Abierta',NULL,'labolsadelcorredor.com'),
('Campeonato Mundo ISF Trail — Gomera Paradise','18 sep 2026','2026-09-18','San Sebastián de La Gomera','Santa Cruz de Tenerife','Canarias','España','La Gomera, Canarias','Trail — Campeonato Mundial','running-trail','running',NULL,NULL,'Abierta',NULL,'labolsadelcorredor.com');

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIATLÓN / DUATLÓN / ACUATLÓN  (fuente: triatlonchannel.com, objetivotriatlon.com, triatlonasturias.es)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,estado,url,source) VALUES
('Campeonato España Triatlón de Invierno','1 feb 2026','2026-02-01','Reinosa','Cantabria','Cantabria','España','Reinosa, Cantabria','Triatlón Sprint','tri-triatlon','triatlon','Sprint',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('XXX Duatlón Ciudad de Reinosa','22 mar 2026','2026-03-22','Reinosa','Cantabria','Cantabria','España','Reinosa, Cantabria','Duatlón','tri-duatlon','triatlon',NULL,NULL,'Abierta',NULL,'triatlonasturias.es'),
('Campeonato España Duatlón MD','15 feb 2026','2026-02-15','Huesca','Huesca','Aragón','España','Huesca','Duatlón Media Distancia','tri-duatlon','triatlon','Media Distancia',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Liga FETRI — La Nucía SuperSprint','21 feb 2026','2026-02-21','La Nucía','Alicante','Comunidad Valenciana','España','La Nucía, Alicante','Duatlón SuperSprint','tri-duatlon','triatlon','SuperSprint',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Liga FETRI Duatlón — Ciudad Real','7 mar 2026','2026-03-07','Ciudad Real','Ciudad Real','Castilla-La Mancha','España','Ciudad Real','Duatlón','tri-duatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Campeonato España Duatlón — Cáceres','21 mar 2026','2026-03-21','Cáceres','Cáceres','Extremadura','España','Cáceres','Duatlón Olímpico','tri-duatlon','triatlon','Olímpico',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Camp. España Duatlón Cadete/Juvenil/Júnior — Avilés','28 mar 2026','2026-03-28','Avilés','Asturias','Asturias','España','Avilés, Asturias','Duatlón','tri-duatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonasturias.es'),
('Liga FETRI Duatlón — Albacete','11 abr 2026','2026-04-11','Albacete','Albacete','Castilla-La Mancha','España','Albacete','Duatlón por Clubes','tri-duatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Clasificatorio Camp. España Triatlón — Fuente Álamo','2 may 2026','2026-05-02','Fuente Álamo','Murcia','Murcia','España','Fuente Álamo, Murcia','Triatlón Olímpico','tri-triatlon','triatlon','Olímpico',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Tri100 Camp. Asturias MD','24 may 2026','2026-05-24','Llanes','Asturias','Asturias','España','Llanes, Asturias','Triatlón Media Distancia','tri-triatlon','triatlon','Media Distancia',NULL,'Abierta',NULL,'triatlonasturias.es'),
('Campeonato España Triatlón MD — Pamplona','23 may 2026','2026-05-23','Pamplona','Navarra','Navarra','España','Pamplona, Navarra','Triatlón Media Distancia','tri-triatlon','triatlon','Media Distancia',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Copa del Rey / Reina Iberdrola — Águilas','9 may 2026','2026-05-09','Águilas','Murcia','Murcia','España','Águilas, Murcia','Triatlón Olímpico','tri-triatlon','triatlon','Olímpico',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Liga FETRI — Roquetas de Mar','30 may 2026','2026-05-30','Roquetas de Mar','Almería','Andalucía','España','Roquetas de Mar, Almería','Triatlón por Clubes','tri-triatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Triatlón San Juan de la Canal','30 may 2026','2026-05-30','San Juan de la Canal','Asturias','Asturias','España','San Juan de la Canal, Asturias','Triatlón','tri-triatlon','triatlon',NULL,NULL,'Abierta',NULL,'triatlonasturias.es'),
('Duatlón y Triatlón Gravel — Vinuesa','6 jun 2026','2026-06-06','Vinuesa','Soria','Castilla y León','España','Vinuesa, Soria','Triatlón Gravel','tri-xterra','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Camp. España Triatlón Cadete/Juvenil/Júnior — A Coruña','20 jun 2026','2026-06-20','A Coruña','A Coruña','Galicia','España','A Coruña, Galicia','Triatlón','tri-triatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Triatlón Escolar y por Autonomías — Tudela','27 jun 2026','2026-06-27','Tudela','Navarra','Navarra','España','Tudela, Navarra','Triatlón Sprint','tri-triatlon','triatlon','Sprint',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Clasificatorio Camp. España Triatlón Sprint — Almazán','4 jul 2026','2026-07-04','Almazán','Soria','Castilla y León','España','Almazán, Soria','Triatlón Sprint','tri-triatlon','triatlon','Sprint',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Campeonato España Triatlón Cros/Acuatlón — Calahorra','25 jul 2026','2026-07-25','Calahorra','La Rioja','La Rioja','España','Calahorra, La Rioja','Acuatlón / Triatlón Cros','tri-aquatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Campeonato España Triatlón — Mérida','22 ago 2026','2026-08-22','Mérida','Badajoz','Extremadura','España','Mérida, Badajoz','Triatlón Olímpico','tri-triatlon','triatlon','Olímpico',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Campeonato España SwimRun — Mogán','5 sep 2026','2026-09-05','Mogán','Las Palmas','Canarias','España','Mogán, Gran Canaria','SwimRun','tri-aquatlon','triatlon',NULL,NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Liga FETRI — Arenales del Sol','12 sep 2026','2026-09-12','Elche','Alicante','Comunidad Valenciana','España','Arenales del Sol, Alicante','Triatlón SuperSprint','tri-triatlon','triatlon','SuperSprint',NULL,'Abierta','https://triatlon.org','triatlonchannel.com'),
('Half de Ribadeo','5 sep 2026','2026-09-05','Ribadeo','Lugo','Galicia','España','Ribadeo, Lugo','Triatlón Media Distancia','tri-triatlon','triatlon','Media Distancia',NULL,'Abierta',NULL,'triatlonasturias.es'),
('Triatlón Santa Olaya — Gijón','5 sep 2026','2026-09-05','Gijón','Asturias','Asturias','España','Gijón, Asturias','Triatlón','tri-triatlon','triatlon',NULL,NULL,'Abierta',NULL,'triatlonasturias.es'),
('Triatlón de Cadavedo','4 oct 2026','2026-10-04','Cadavedo','Asturias','Asturias','España','Cadavedo, Asturias','Triatlón','tri-triatlon','triatlon',NULL,NULL,'Abierta',NULL,'triatlonasturias.es'),
-- IRONMAN
('IronMan Alcúdia Mallorca','9 may 2026','2026-05-09','Alcúdia','Baleares','Baleares','España','Alcúdia, Mallorca','Triatlón Larga Distancia','tri-triatlon','triatlon','226 km (3.8/180/42)',226.00,'Abierta','https://www.ironman.com/races/im-alcudia','runnea.com'),
('IronMan Lanzarote','23 may 2026','2026-05-23','Lanzarote','Las Palmas','Canarias','España','Lanzarote, Las Palmas','Triatlón Larga Distancia','tri-triatlon','triatlon','226 km (3.8/180/42)',226.00,'Abierta','https://www.ironman.com/races/im-lanzarote','runnea.com'),
('IronMan Vitoria-Gasteiz','12 jul 2026','2026-07-12','Vitoria-Gasteiz','Álava','País Vasco','España','Vitoria-Gasteiz, Álava','Triatlón Larga Distancia','tri-triatlon','triatlon','226 km (3.8/180/42)',226.00,'Abierta','https://www.ironman.com/races/im-vitoria','buscametas.com');

-- ═══════════════════════════════════════════════════════════════════════════
-- HYROX  (fuente: hyroxinsider.com)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,precio,estado,url,notas,source) VALUES
('HYROX Bilbao','7 feb 2026','2026-02-07','Bilbao','Bizkaia','País Vasco','España','Guggenheim Bilbao, Bizkaia','HYROX','func-hyrox','funcional','8 × 1 km + 8 estaciones',8.00,NULL,'Abierta','https://hyrox.com/event/hyrox-bilbao/','Divisiones Open, Pro, Doubles, Relay','hyroxinsider.com'),
('HYROX Málaga','16 abr 2026','2026-04-16','Málaga','Málaga','Andalucía','España','Martín Carpena Arena, Málaga','HYROX','func-hyrox','funcional','8 × 1 km + 8 estaciones',8.00,NULL,'Abierta','https://hyrox.com/event/hyrox-malaga/','Divisiones Open, Pro, Doubles','hyroxinsider.com'),
('HYROX Barcelona','14 may 2026','2026-05-14','L''Hospitalet de Llobregat','Barcelona','Cataluña','España','Fira Gran Via, Barcelona','HYROX','func-hyrox','funcional','8 × 1 km + 8 estaciones',8.00,NULL,'Abierta','https://hyrox.com/event/hyrox-barcelona/','Divisiones Open, Pro, Doubles','hyroxinsider.com'),
('HYROX Tenerife','5 sep 2026','2026-09-05','Santa Cruz de Tenerife','Santa Cruz de Tenerife','Canarias','España','Santa Cruz de Tenerife','HYROX','func-hyrox','funcional','8 × 1 km + 8 estaciones',8.00,NULL,'Abierta',NULL,'Divisiones Open, Pro, Doubles','hyroxinsider.com'),
('HYROX Palma de Mallorca','21 oct 2026','2026-10-21','Palma de Mallorca','Baleares','Baleares','España','Palma de Mallorca','HYROX','func-hyrox','funcional','8 × 1 km + 8 estaciones',8.00,NULL,'Abierta',NULL,'Divisiones Open, Pro, Doubles','hyroxinsider.com');

-- ═══════════════════════════════════════════════════════════════════════════
-- CICLISMO  (fuente: buscametas.com, sanferbike.com, quebrantahuesos.com)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,estado,url,source) VALUES
('Ibercaja Quebrantahuesos by TotalEnergies','20 jun 2026','2026-06-20','Sabiñánigo','Huesca','Aragón','España','Sabiñánigo, Huesca','Ciclismo Granfondo','cicl-carretera','ciclismo','200 km / 85 km',200.00,'Abierta','https://www.quebrantahuesos.com','buscametas.com'),
('Marcha Cicloturista Treparriscos','20 jun 2026','2026-06-20','Sabiñánigo','Huesca','Aragón','España','Sabiñánigo, Huesca','MTB Granfondo','cicl-mtb','ciclismo','80 km',80.00,'Abierta','https://www.quebrantahuesos.com','buscametas.com'),
('Vuelta Cicloturista a Ibiza','12 abr 2026','2026-04-12','Santa Eularia del Riu','Baleares','Baleares','España','Ibiza, Baleares','Ciclismo Granfondo','cicl-carretera','ciclismo','130 km',130.00,'Abierta',NULL,'sanferbike.com'),
('Mallorca 312','25 abr 2026','2026-04-25','Alcúdia','Baleares','Baleares','España','Mallorca, Baleares','Ciclismo Granfondo','cicl-carretera','ciclismo','312 km / 167 km',312.00,'Abierta',NULL,'sanferbike.com'),
('La Induráin — Marcha Cicloturista','17 may 2026','2026-05-17','Villava','Navarra','Navarra','España','Villava, Navarra','Ciclismo Granfondo','cicl-carretera','ciclismo','185 km',185.00,'Abierta',NULL,'sanferbike.com'),
('Marcha Cicloturista L''Étape del Sol','7 jun 2026','2026-06-07','Alcalá la Real','Jaén','Andalucía','España','Alcalá la Real, Jaén','Ciclismo Granfondo','cicl-carretera','ciclismo','150 km',150.00,'Abierta',NULL,'sanferbike.com'),
('BTT Costa Dorada','18 oct 2026','2026-10-18','Salou','Tarragona','Cataluña','España','Salou, Tarragona','MTB','cicl-mtb','ciclismo','60 km / 30 km',60.00,'Abierta',NULL,'sanferbike.com');

-- ═══════════════════════════════════════════════════════════════════════════
-- NATACIÓN / AGUAS ABIERTAS  (fuente: calendarioaguasabiertas.com, fexnatacion.com)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.races (nombre,fecha,fecha_iso,municipio,provincia,comunidad,pais,ubicacion,modalidad,modalidad_id,modalidad_parent,distancia,distancia_km,estado,url,source) VALUES
('Capfico de l''Any Port de Palma','1 ene 2026','2026-01-01','Palma de Mallorca','Baleares','Baleares','España','Palma de Mallorca','Aguas Abiertas','nat-abiertas','natacion','400 m / 200 m',0.40,'Abierta',NULL,'calendarioaguasabiertas.com'),
('V San Salitre Santa Cruz de Tenerife','1 ene 2026','2026-01-01','Santa Cruz de Tenerife','Santa Cruz de Tenerife','Canarias','España','Puerto Santa Cruz, Tenerife','Aguas Abiertas','nat-abiertas','natacion','2000 m / 1000 m',2.00,'Abierta',NULL,'calendarioaguasabiertas.com'),
('VI Travesía de Navidad Triavila','3 ene 2026','2026-01-03','Ávila','Ávila','Castilla y León','España','Embalse Fuentes Claras, Ávila','Aguas Abiertas','nat-abiertas','natacion','300 m',0.30,'Abierta',NULL,'calendarioaguasabiertas.com'),
('RFEN Tour Ibiza — Copa del Mundo AA','1 jun 2026','2026-06-01','Ibiza','Baleares','Baleares','España','Ibiza, Baleares','Aguas Abiertas — Copa Mundo','nat-abiertas','natacion','10 km',10.00,'Abierta',NULL,'fexnatacion.com'),
('RFEN Tour Costa Azahar','1 jul 2026','2026-07-01','Peñíscola','Castellón','Comunidad Valenciana','España','Costa Azahar, Castellón','Aguas Abiertas','nat-abiertas','natacion',NULL,NULL,'Abierta',NULL,'fexnatacion.com'),
('RFEN Tour Ría de Navia','1 ago 2026','2026-08-01','Navia','Asturias','Asturias','España','Ría de Navia, Asturias','Aguas Abiertas','nat-abiertas','natacion',NULL,NULL,'Abierta',NULL,'fexnatacion.com'),
('RFEN Tour Isla de Palma','1 sep 2026','2026-09-01','Palma de Mallorca','Baleares','Baleares','España','Palma de Mallorca','Aguas Abiertas','nat-abiertas','natacion',NULL,NULL,'Abierta',NULL,'fexnatacion.com'),
('Travesía a Nado Río Piedras','20 jun 2026','2026-06-20','Cartaya','Huelva','Andalucía','España','Cartaya, Huelva','Aguas Abiertas','nat-abiertas','natacion','3000 m / 1000 m',3.00,'Abierta',NULL,'calendarioaguasabiertas.com'),
('Travesía Strait of Gibraltar','3 oct 2026','2026-10-03','Tarifa','Cádiz','Andalucía','España','Tarifa, Cádiz','Aguas Abiertas','nat-abiertas','natacion','14 km',14.00,'Abierta',NULL,'calendarioaguasabiertas.com');
