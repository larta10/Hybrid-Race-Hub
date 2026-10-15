# Informe de enlaces de afiliado (Amazon)

Revisión: 15 de octubre de 2026. Comprobación de cada ASIN abriendo `https://www.amazon.es/dp/<ASIN>`. Amazon respondió con normalidad (sin captcha ni 503), así que se distingue entre fichas que existen (200) y fichas inexistentes (404).

## Resumen

| | Antes | Después |
|---|---|---|
| Enlaces a Amazon en el código | 53 (31 en rankings + 22 en artículos) | 0 escritos a mano: todos salen de `buildAmazonUrl` (lib/affiliate.js) |
| Enlaces que llevaban a una ficha inexistente (404) | **21** | 0: usan la búsqueda de amazon.es con el tag |
| Enlaces a un modelo distinto del que se recomienda | **2** | 0: usan la búsqueda del modelo correcto |
| Enlaces sin tag o a otro dominio (amazon.com, amzn.to) | 0 en la web · 4 en `supabase/seed_products.sql` (sin tag; la tabla está vacía) | 0. Lo que venga de Supabase se normaliza con `normalizeAmazonUrl` |
| Precios de Amazon escritos a mano | 31 en rankings (fichas + columna de tabla) + 19 en artículos + 5 menciones sueltas | 0. Botón "Ver precio en Amazon" |
| rel | mezcla de "nofollow sponsored noopener noreferrer" | siempre `sponsored nofollow noopener` + `target="_blank"` |
| Schema Product con precio inventado (Offer) | 31 | 0 (ItemList sin precios) |

Productos centralizados en `data/products.js`: 49 (20 con ASIN verificado, 29 con búsqueda).

## Detalle de cada enlace encontrado

| Origen | Producto / texto | ASIN | Tag | Estado en amazon.es | Título real en Amazon |
|---|---|---|---|---|---|
| lib/rankings.js (relojes #1) | Garmin Forerunner 965 | B0CFQ1NQPG | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (relojes #2) | Garmin Fenix 8 | B0D1PZBYF2 | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (relojes #3) | Suunto Race | B0C6T5BD9H | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (relojes #4) | Polar Vantage V3 | B0CFMXF3NH | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (relojes #5) | COROS PACE 3 | B0CFQQ9FDL | sí | OK (200) | COROS Pace 3 Reloj Deportivo GPS, Ligero Reloj Running- Nylon Ink / Batería de17 |
| lib/rankings.js (relojes #6) | Apple Watch Ultra 2 | B0CHX8B914 | sí | OK (200) | Apple Watch Ultra 2 GPS Cellular Smartwatch con Caja de Titanio Resistente de 49 |
| lib/rankings.js (zapatillas-trail #1) | Salomon Speedcross 6 GTX | B0CGJHZGPV | sí | ASIN de otro modelo (es la Speedcross 6 sin GTX) | SALOMON L41739000 Speedcross 6 Sneaker Male Ardiente Rojo/Negro/Blanco EU 46 : A |
| lib/rankings.js (zapatillas-trail #2) | Salomon XA Pro 3D v9 GTX | B0C9THPXGB | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-trail #3) | Hoka Speedgoat 6 GTX | B0CS5LBMHV | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-trail #4) | Brooks Cascadia 17 GTX | B0CPN3B9PP | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-trail #5) | Inov-8 Mudclaw G 260 | B07DWRBMQL | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-hyrox #1) | Nike Metcon 9 | B0CZF9KMPZ | sí | OK (200) | NIKE Metcon 9 - Zapatillas deportivas para hombre, para gimnasio y entrenamiento |
| lib/rankings.js (zapatillas-hyrox #2) | Reebok Nano X4 | B0DHPWRSM5 | sí | OK (200) | Reebok Zapatillas de entrenamiento cruzado Nano X4 para mujer, Negro/ciruela med |
| lib/rankings.js (zapatillas-hyrox #3) | New Balance FuelCell SuperComp Trainer | B0BHR41ML4 | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-hyrox #4) | On Cloudsurfer | B0B9VB86FQ | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-hyrox #5) | Saucony Kinvara Pro | B0BJVWJGXB | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-crossfit #1) | Nike Metcon 9 | B0CZF9KMPZ | sí | OK (200) | NIKE Metcon 9 - Zapatillas deportivas para hombre, para gimnasio y entrenamiento |
| lib/rankings.js (zapatillas-crossfit #2) | Reebok Nano X4 | B0DHPWRSM5 | sí | OK (200) | Reebok Zapatillas de entrenamiento cruzado Nano X4 para mujer, Negro/ciruela med |
| lib/rankings.js (zapatillas-crossfit #3) | NoBull Trainer+ | B08JQLW47K | sí | ASIN de otro modelo (es la NOBULL Canvas Trainer Mid, no la Trainer+) | NOBULL Zapatillas Canvas Trainer Mid Storm : Amazon.es: Moda |
| lib/rankings.js (zapatillas-crossfit #4) | Under Armour TriBase Reign 6 | B0CLDM2H9F | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (zapatillas-crossfit #5) | Inov-8 FastLift 360 | B07MR2R97N | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (pulsometros #1) | Garmin HRM-Pro Plus | B0B3PNFK9H | sí | OK (200) | Garmin HRM-PRO PLUS Dual - Correa para el Pecho para Registrar los valores de fr |
| lib/rankings.js (pulsometros #2) | Polar H10 | B07WHLR63Y | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (pulsometros #3) | Wahoo TICKR X | B07T64LZMB | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (pulsometros #4) | Polar Verity Sense | B08T1WV9BJ | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (pulsometros #5) | Garmin HRM-Fit | B09XL58BSY | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (ropa #1) | 2XU Core Compression Tights | B01IFKR5FY | sí | OK (200) | 2 x U Hombre Core Mallas de compresión, Hombre, Color Black/Nero, tamaño L : Ama |
| lib/rankings.js (ropa #2) | Compressport Trail shorts | B0B9VR9NKS | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (ropa #3) | Saysky Combat Tights | B07YQW6KGH | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (ropa #4) | Salomon Cross shorts | B0B4L8B75Z | sí | 404 en amazon.es | Documento no encontrado |
| lib/rankings.js (ropa #5) | Hoka Performance shorts | B0C9THXXT2 | sí | 404 en amazon.es | Documento no encontrado |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Inov-8 X-Talon 212 v2 | B0949LMWH8 | sí | OK (200) | INOV8 X-Talon 212v2 Zapatilla De Correr para Tierra - SS23-44.5 : Amazon.es: Mod |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Salomon Speedcross 6 | B0CGJHZGPV | sí | OK (200) | SALOMON L41739000 Speedcross 6 Sneaker Male Ardiente Rojo/Negro/Blanco EU 46 : A |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · New Balance Fresh Foam X Hierro v8 | B0CXK38JZN | sí | OK (200) | New Balance Fresh Foam X Hierro V8 - Tenis de Correr para Hombre : Amazon.es: Mo |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Mechanix Wear FastFit | B08CPC6ZLZ | sí | OK (200) | Mechanix Wear - Guantes FastFit (X-Grande, Negro) : Amazon.es: Bricolaje y herra |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Calleras Unbroken Grips 2.0 | B072YJCWRT | sí | OK (200) | Unbroken Grips 2.0 Calleras Agarres de Mano Protector de Manos Grips Cuero Atlet |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | 2XU Core Compression Tights — Ver precio en Amazon · Mallas de compresión largas | B01IFKR5FY | sí | OK (200) | 2 x U Hombre Core Mallas de compresión, Hombre, Color Black/Nero, tamaño L : Ama |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | CEP The Run Compression Socks — Ver precio en Amazon · Mallas de compresión largas | B0B59J2YR9 | sí | OK (200) | CEP Hombres The Run Socks Tall V4 Laufbekleidung Calcetines para Correr Blue - A |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Salomon Active Skin 8 | B0B4VZLHRN | sí | OK (200) | Salomon Active Skin 8 Chaleco de Hidratación Trail Running Senderismo Trail Runn |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Reloj GPS: Garmin Forerunner 265 | B0BS1T9J4Y | sí | OK (200) | Garmin Forerunner 265 Reloj Inteligente para Correr con GPS, Pantalla Táctil AMO |
| lib/posts.js (equipamiento-ocr-guia-compra-2026) | → Ver precio en Amazon · Alternativa económica: COROS PACE 3 | B0CFQQ9FDL | sí | OK (200) | COROS Pace 3 Reloj Deportivo GPS, Ligero Reloj Running- Nylon Ink / Batería de17 |
| lib/posts.js (zapatillas-hyrox-running-hibrido-2026) | → Ver precio en Amazon · 1. Nike Metcon 9 — La reina del box para HYROX | B0CZF9KMPZ | sí | OK (200) | NIKE Metcon 9 - Zapatillas deportivas para hombre, para gimnasio y entrenamiento |
| lib/posts.js (zapatillas-hyrox-running-hibrido-2026) | → Ver precio en Amazon · 2. Reebok Nano X4 — La alternativa fiel | B0DHPWRSM5 | sí | OK (200) | Reebok Zapatillas de entrenamiento cruzado Nano X4 para mujer, Negro/ciruela med |
| lib/posts.js (zapatillas-hyrox-running-hibrido-2026) | → Ver precio en Amazon · 3. ASICS Gel-Kayano 31 — Para los que priorizan la carrera | B0CYT531C3 | sí | OK (200) | ASICS 1011B867-401 Gel-Kayano 31 Hombre Blue Expanse/Digital Aqua EU 43.5 : Amaz |
| lib/posts.js (zapatillas-hyrox-running-hibrido-2026) | → Ver precio en Amazon · 4. On Cloudboom Echo — La opción premium de carrera | B0B9HRSP53 | sí | OK (200) | ON Cloudboom Echo - Zapatillas de correr para hombre (UE 48 - US 13) : Amazon.es |
| lib/posts.js (zapatillas-hyrox-running-hibrido-2026) | → Ver precio en Amazon · 5. NoBull Canvas Trainer — La opción de comunidad CrossFit | B08JQLW47K | sí | OK (200) | NOBULL Zapatillas Canvas Trainer Mid Storm : Amazon.es: Moda |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Garmin Forerunner 265 — El mejor equilibrio calidad/precio en 202 | B0BS1T9J4Y | sí | OK (200) | Garmin Forerunner 265 Reloj Inteligente para Correr con GPS, Pantalla Táctil AMO |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · COROS PACE 3 — La mejor opción por debajo de 250 € | B0CFQQ9FDL | sí | OK (200) | COROS Pace 3 Reloj Deportivo GPS, Ligero Reloj Running- Nylon Ink / Batería de17 |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Apple Watch Ultra 2 — Si ya estás en el ecosistema Apple | B0CHX8B914 | sí | OK (200) | Apple Watch Ultra 2 GPS Cellular Smartwatch con Caja de Titanio Resistente de 49 |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Garmin HRM-Pro Plus | B0B3PNFK9H | sí | OK (200) | Garmin HRM-PRO PLUS Dual - Correa para el Pecho para Registrar los valores de fr |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Theragun Prime — Para recuperación muscular activa | B0C4M811HS | sí | OK (200) | TheraGun Prime - Pistola de Masaje Muscular - Terapia de Masaje de Percusión con |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Alternativa económica: Hyperice Hypervolt Go 2 | B0CDMX8QBZ | sí | OK (200) | Hyperice Hypervolt Go 2 - Con tecnología Quiet Glide - Pistola de masaje de perc |
| lib/posts.js (gadgets-tecnologia-atleta-hibrido-2026) | → Ver precio en Amazon · Rodillo de espuma (foam roller) — El más subestimado | B0040EGNIU | sí | OK (200) | TRIGGERPOINT Rodillo de Espuma Grid vídeos tutoriales Gratis en línea / Negro; 8 |

## Cómo funciona ahora

- `data/products.js`: única fuente de productos (id, nombre, marca, categoría, asin, asinDisponible, searchQuery, descripcionCorta, pros, contras, imagenLocal, destacado).
- `buildAmazonUrl(product)`: `https://www.amazon.es/dp/<ASIN>?tag=hybridracehub-21` si el ASIN es válido y existe; si no, `https://www.amazon.es/s?k=<búsqueda>&tag=hybridracehub-21`.
- `<AffiliateLink>` (React) y `renderAffiliateHtml` (HTML de artículos: `<a data-product="id">`) añaden `rel="sponsored nofollow noopener"`, `target="_blank"` y los datos para el evento `amazon_click` (producto, categoría, página, posición).
- `npm run qa:links` falla si aparece una URL de Amazon escrita a mano, un producto sin searchQuery, un ASIN mal formado o, en el HTML generado, un enlace sin tag, fuera de amazon.es o sin rel sponsored/nofollow.

Para recuperar la ficha directa de un producto que ahora va a la búsqueda: busca el modelo en amazon.es, copia el ASIN de la URL, ponlo en `data/products.js` con `asinDisponible: true` y ejecuta `npm run qa:links`.
