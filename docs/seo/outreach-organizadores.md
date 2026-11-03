# Outreach a organizadores — noviembre de 2026

Objetivo: que las webs oficiales de las carreras enlacen a su ficha en Hybrid Race Hub (enlaces externos de calidad y temáticos). Cada ficha ya existe en `https://hybridracehub.com/carreras/<slug>` y la página `/organizadores` genera el código del sello para cada carrera.

## Cómo hacerlo
1. Empieza por los organizadores con más carreras (tabla, de arriba abajo): un solo sí trae varios enlaces.
2. Manda el email desde hola@hybridracehub.com, uno por organizador, con el enlace de su ficha concreta.
3. No ofrezcas nada a cambio del enlace (ni pago ni intercambio): es un sello informativo. Si piden quitar algo o corregir un dato, se hace el mismo día.
4. Apunta la respuesta en la última columna de la tabla. Si en 10 días no contestan, un único recordatorio corto.

## Plantilla de email

**Asunto:** Vuestra carrera ya tiene ficha en Hybrid Race Hub

> Hola, equipo de {ORGANIZADOR}:
>
> Soy Pablo, de Hybrid Race Hub, un calendario de carreras híbridas y de obstáculos en España. Hemos publicado la ficha de {CARRERA} con la fecha, la sede y el enlace a vuestra inscripción:
> {URL_FICHA}
>
> La revisamos con vuestra web el {FECHA_VERIFICACIÓN}. Si algo no está bien (precio, fecha, categorías), decídmelo y lo cambio hoy.
>
> Por si os sirve, tenemos un sello pequeño de «Carrera verificada» que podéis poner en vuestra web; enlaza a la ficha y no carga nada externo. El código está aquí: https://hybridracehub.com/organizadores
>
> Y si tenéis más fechas para 2027, mandádmelas y las publicamos.
>
> Un saludo,
> Pablo · Hybrid Race Hub · hola@hybridracehub.com

**Recordatorio (a los 10 días, solo una vez):**

> Hola de nuevo. Solo para confirmar que os llegó lo de la ficha de {CARRERA} ({URL_FICHA}). Si preferís que cambie algo, me decís. Gracias.

## Organizadores de las carreras futuras

Fuente: carreras futuras de Supabase y eventos verificados a mano (fichas del sitemap a 3/11/2026). Email: solo el que aparece publicado en la portada o en la página de contacto de su web (`scripts/organizers-contacts.mjs`, datos en `docs/seo/data/organizadores.json`). Donde pone «No publicado», usa el formulario de contacto de su web o sus redes.

| Organizador | Web | Email público | Carreras | Ejemplos | Respuesta |
|---|---|---|---|---|---|
| Spartan Race España | https://es.spartan.com/ | No publicado en su web | 13 | DEKA FIT Tenerife 2026; Spartan Race Tenerife Nov 2026; DEKA Torremolinos 2027… | |
| HYROX España | https://hyrox.es/ | morena@hyrox.es | 4 | HYROX Barcelona 2026; HYROX Bilbao 2027 Barakaldo; HYROX Madrid 2027… | |
| Desafío de Guerreros | https://www.desafiodeguerreros.com.es/ | info@desafiodeguerreros.es | 4 | Desafío de Guerreros Valencia 2027; Desafío de Guerreros Barcelona 2027; Desafío de Guerreros Gernika 2027… | |
| Survivor Race | https://survivor-race.com/ | info@survivor-race.com | 3 | Survivor Race Alicante 2027; Survivor Race Madrid 2027; Survivor Race Barcelona 2027 | |
| Medieval Xtreme Race | https://medievalxtremrace.com/ | info@medievalxtremrace.com | 2 | Medieval Xtreme Race Peñíscola 2026; Medieval Xtreme Race Polop 2027 | |
| Federación Española de Triatlón (Hyatlón) | https://hyatlon.org/ | hyatlon@deporama.com | 2 | Hyatlón H6 Gran Canaria 2026; Hyatlón H8 Zaragoza 2026 | |
| eventos.strongrace.com | https://eventos.strongrace.com/ | No publicado en su web | 1 | Strong Race Otoño 2026 Palma | |
| OCR Mencey Los Realejos 2026 | Sin web oficial (solo redes) | No publicado en su web | 1 | OCR Mencey Los Realejos 2026 | |
| monsterace.com | https://monsterace.com/ | No publicado en su web | 1 | Monster Race Sant Miquel de Campmajor 2026 | |
| Gollizno Race Olivares 2026 | Sin web oficial (solo redes) | No publicado en su web | 1 | Gollizno Race Olivares 2026 | |
| Farinato Race | https://farinatorace.es/ | No publicado en su web | 1 | Farinato Hybrid Race Madrid 2026 | |
| Desafío Costa Blanca | https://desafiocostablanca.com/ | info@desafiocostablanca.com | 1 | Desafío Vega Baja Redován 2026 | |
| Bestial Race | https://bestialrace.com/ | info@bestialrace.com | 1 | Bestial Race Arucas 2026 | |
| weezevent.com | https://my.weezevent.com/ | No publicado en su web | 1 | Heart Fit Challenge Hybrid Race Sevilla 2027 | |
| Hybrid League | https://hybridleague.es/ | soporte@yacrea.com | 1 | Hybrid League — Ronda Febrero 2027 Pinto | |
| Hybrid Zone | https://hybridzone.es/ | No publicado en su web | 1 | Hybrid Zone Torrelavega 2027 | |
| sacabasummergames.com | https://www.sacabasummergames.com/ | info@sacabasummergames.com | 1 | Sacaba Summer Games 2027 Málaga | |
| madridfitnesschallenge.com | https://madridfitnesschallenge.com/ | info@madridfitnesschallenge.com | 1 | Madrid Fitness Challenge 2027 | |
| The BOLD Series | https://www.theboldseries.com/ | No publicado en su web | 1 | BOLD Series Madrid 2027 | |
| Hybrid Day | https://hybrid-day.com/ | support@hybrid-day.com | 1 | Hybrid Day Vigo 2026 | |
| thehybridgames.fit | https://thehybridgames.fit/ | No publicado en su web | 1 | The Hybrid Games Valencia 2027 | |
Notas:
- **Spartan Race España** organiza 13 de las fichas (DEKA y Spartan): es el contacto de más valor. Su web no publica email; usa el formulario de es.spartan.com o el de prensa.
- **HYROX España**: el email que aparece en hyrox.es es personal (morena@hyrox.es). Úsalo con un mensaje breve o pide en él el contacto de comunicación.
- **Hyatlón**: el email publicado (hyatlon@deporama.com) es de la agencia que lleva la web de la FETRI; sirve para el sello, pero para un enlace desde triatlon.org habría que ir a la federación.
- **Hybrid League**: el email publicado es el soporte de su plataforma (yacrea.com), no del organizador.
- Gollizno Race y OCR Mencey no tienen web: no hay dónde poner un enlace. Mejor pedirles que pongan el enlace de la ficha en la bio de Instagram.
