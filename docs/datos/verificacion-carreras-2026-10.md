# Verificación de carreras — 27/10/2026

Todas las comprobaciones se hicieron el **27/10/2026** con peticiones directas a las webs oficiales (y navegador automatizado cuando la inscripción se carga dentro de un iframe).
Cambios para Supabase: `docs/datos/cambios-races-2026-10-27.sql`. Backup previo: `backups/races-2026-10-27.json` (192 filas, no se sube a git).
Script de verificación reutilizable (solo lectura): `node scripts/verify-races.mjs`.

## Carreras nuevas (cumplen los 4 criterios)

| Nombre | Fecha | Ciudad | URL oficial | URL de inscripción | Qué prueba que está abierta | Comprobado |
|---|---|---|---|---|---|---|
| Hybrid Day Vigo 2026 | 12-13/12/2026 | Vigo (IFEVI) | https://hybrid-day.com/hybrid-day-vigo-2026/ | https://www.tickettailor.com/events/hybridday/2353350 | Botón "Inscrever" en la ficha y página de Tickettailor con "Buy tickets / Comprar tickets" activo para el 12/12/2026, Av. do Aeroporto 772, Vigo | 27/10/2026 |
| Hyatlón H6 Gran Canaria 2026 | 14-15/11/2026 | Las Palmas de Gran Canaria (Plaza de la Música, ExpoDeca) | https://hyatlon.org/event/gran-canaria | https://event.addon-sport.com/es/hyatlon-gran-canaria-2026/registration | Formulario "Selecciona una cuota de inscripción" con cuotas a la venta: Open/Elite individual 79 €, dobles 139 €; 117 inscritos en Open masculino | 27/10/2026 |
| Hyatlón H8 Zaragoza 2026 | 28-29/11/2026 | Zaragoza (Pabellón 4, Feria de Zaragoza) | https://hyatlon.org/event/zaragoza | https://event.addon-sport.com/es/hyatlon-zaragoza-2026/registration | Cuotas a la venta: individual 89 €, dobles 159 €; 192 inscritos en Open masculino | 27/10/2026 |
| The Hybrid Games Valencia 2027 | 22-23/05/2027 | Valencia (Tinglados, La Marina) | https://thehybridgames.fit/ | https://thehybridgames.fit/es/ (checkout `?buy-now=`) | Selector de categorías con precio (Singles 85 €, Doubles 160 €, Team Relay 230 €) y carrito que llega a "Place order" | 27/10/2026 |
| Survivor Race Madrid 2027 | 05-06/06/2027 | Colmenar Viejo | https://survivor-race.com/carreras/survivor-madrid/ | La misma ficha (selector día/distancia/hora) | "Elige el día 5/06/2027 · 6/06/2027", distancias 3K/6K/10K "Desde 51 €" con botón "Seleccionar" y horas de salida | 27/10/2026 |
| Survivor Race Barcelona 2027 | 19-20/06/2027 | Castellar del Vallès | https://survivor-race.com/carreras/survivor-barcelona/ | La misma ficha | "Elige el día 19/06/2027 · 20/06/2027", distancias con precio y horas de salida seleccionables | 27/10/2026 |

## Carreras existentes corregidas

| id | Carrera | Antes | Después | Evidencia |
|---|---|---|---|---|
| 24 | Strong Race | url theboxinthebox.com (portada), ubicación "Mallorca", estado Próximamente | url de la ficha oficial, Velódromo Illes Balears (Palma), estado Abierta | eventos.strongrace.com: "STRONG RACE MALLORCA – 5ª EDICIÓN – OPEN 07/11/2026 - 08/11/2026 Velódromo Illes Balears", carrito activo, inscripción abierta desde el 3 de mayo |
| 137 | Desafío Costa Blanca Mutxamel Nov 2026 | Mutxamel, url carrerasocr.com | "Desafío Vega Baja Redován 2026", Redován, url de inscripción oficial, desde 45 €, Abierta | desafiocostablanca.com: "Próximos Desafíos Redovan (Alicante) 22 Noviembre 2026 · Inscríbete"; medievalxtremrace.com/inscripciones-redovan: "22 noviembre 2026", precios por plazo |
| 139 | Bestial Race Arucas 2026 | url carrerasocr.com, precio "Consultar" | url de inscripción de Chronotrack, desde 30 €, 3/6/12 km, Abierta | Chronotrack: "Fin de inscripciones: lunes, 30 de noviembre de 2026… INICIO DEL EVENTO: sábado, 5 de diciembre de 2026", cuotas de 30 € a 60 € |
| 136 | Monster Race Sant Miquel de Campmajor 2026 | url carrerasocr.com | https://monsterace.com/ | Web del organizador indicada por calendariocarrerasobstaculos.es; responde 200 |
| 166 | Farinato Hybrid Race Madrid (otoño) | estado "inscripciones abiertas" | "Pendiente verificar" + nota | farinatorace.com redirige a farinatorace.es, que corta la conexión (curl y fetch). Calendarios públicos sitúan la Farinato del 14-15/11 en Umbrete (Sevilla). No se cambia la sede sin fuente oficial |
| 134, 135 | OCR Mencey Los Realejos 2026, Gollizno Race Olivares 2026 | "Abierta" | "Pendiente verificar" | Solo tienen Instagram; no hay web oficial que confirme fecha ni inscripción |

Las otras 30 carreras futuras responden 200 y su página muestra señales de inscripción coherentes con el estado guardado; no se tocan. Sacaba Summer Games 2027 sigue en "Próximamente" (su web: "INICIO INSCRIPCIÓN 01/12/26").

## Candidatas pendientes (no se insertan)

| Carrera | Fecha | Motivo |
|---|---|---|
| Desafío de Guerreros Málaga 2027 | 24/10/2027 | Fecha publicada en la web oficial, pero la página de inscripción `/carreras/p/desafio-malaga` da 404 |
| Eolos Race Agoncillo | 7-8/11/2026 | La web oficial muestra la edición de junio; la inscripción (deporticket) responde 403 y no se pudo comprobar |
| Eolos Race Torrejón de Ardoz y Zamora | sin fecha visible | Igual: deporticket 403 |
| Farinato Race Umbrete | 14-15/11/2026 | Web oficial caída |
| Supera't Alcoy | 8/11/2026 | Sin web oficial (solo Instagram) |
| Fungo Race (El Puerto de Santa María) | 14/03/2027 | La página de inscripción de Avaibook muestra la edición de 2024, cerrada |
| Adrenaline Race (Zahara de los Atunes) | 25/09/2027 | adrenalinerace.es no responde |
| HURBAX 2027 | — | La web solo ofrece "acceso prioritario 2027"; sin sedes ni fechas |
| Hybrid Day (wezone.es) Madrid, Valencia, Sevilla, Málaga | — | 4 filas antiguas en Supabase sin fecha (ids 141-144); wezone.es no muestra contenido legible. No se tocan |
| HYROX: nuevas sedes en España | — | hyrox.es solo tiene páginas de temporada para Barcelona, Bilbao, Madrid y Málaga (ya en la base); Valencia, Tenerife, Sevilla, Mallorca, Gran Canaria y Coruña dan 404 |
| Spartan / DEKA | — | Todas las sedes españolas de es.spartan.com ya están en la base (Encamp es Andorra) |
