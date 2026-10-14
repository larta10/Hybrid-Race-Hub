# Informe: carreras de 2027 en España

Fecha de la revisión: 14 de octubre de 2026.

## Importante: las carreras aún no están en Supabase

La tabla `races` solo admite escrituras con la clave **service_role** (política RLS "Service write"). Esa clave no está en el equipo: `.env.local` solo tiene `RESEND_API_KEY` y no hay MCP de Supabase conectado. Con la clave pública (anon) solo se puede leer.

Por eso las 26 carreras están preparadas pero **no insertadas**. Para insertarlas elige una opción (las dos solo añaden filas nuevas y se saltan las que ya existan):

1. **SQL Editor de Supabase**: pega y ejecuta `scripts/insert-races-2027.sql`. Al final hay un `SELECT` que lista las carreras de 2027 para comprobarlo.
2. **Script con verificación por lotes**: en PowerShell, `$env:SUPABASE_SERVICE_KEY="<service_role>"; node scripts/insert-races-2027.mjs`. Inserta en lotes de 5 y verifica cada lote con un `SELECT`. Con `--dry-run` muestra lo que haría sin escribir nada.

Cuando estén insertadas, el calendario, las páginas de ciudad, el sitemap y el schema Event las mostrarán solos, en un máximo de una hora (ISR).

Copia de seguridad previa de la tabla `races` (166 filas): `backups/races-backup-2026-10-14.json`. La carpeta `backups/` está en `.gitignore`.

Registro completo con la fuente de cada carrera: `data/import-2027-2026-10-14.json`.

## Criterio

- Solo se ha añadido una carrera cuando su fecha y su sede aparecen en la web oficial del organizador o en su plataforma oficial de inscripción (hyrox.es, es.spartan.com, Weezevent, la web propia de la serie).
- Los agregadores (carrerasocr.com, calendariocarrerasobstaculos.es, running.life, gotrail.run, theboxinthebox.com) se han usado solo para descubrir carreras.
- No se ha copiado ningún dato de la edición de 2026. Si un dato no está publicado, queda en `null`.
- En las pruebas de varios días, `fecha_iso` es el primer día y los demás días se indican en `notas`.
- Convenciones copiadas de la tabla:
  - fecha en texto "6 Feb 2027";
  - estado "Abierta" o "Próximamente", que ya existen;
  - DEKA como `DEKA FIT` / `func-hyrox`;
  - Spartan como `Spartan Race` / `ocr-spartan`, con una fila por distancia (como en 2026);
  - Hybrid Zone, Hybrid League y BOLD como `Functional Fitness` / `func-fitness`, igual que sus filas de 2026;
  - competiciones de cross training como `CrossFit` / `func-crossfit`.

## Carreras añadidas (26)

| # | Nombre | Fecha | Ciudad | Modalidad | Fuente |
|---|---|---|---|---|---|
| 1 | Heart Fit Challenge Hybrid Race Sevilla 2027 | 16 ene 2027 | Sevilla | Functional Fitness | [weezevent.com](https://my.weezevent.com/heart-fit-challenge-hybrid-race-sevilla-2) |
| 2 | HYROX Bilbao 2027 | 6–7 feb 2027 | Barakaldo (BEC) | HYROX | [hyrox.es](https://hyrox.es/eventos/hyrox-bilbao-26-27/) |
| 3 | Hybrid League — Ronda Febrero 2027 | 20 feb 2027 | Pinto (Madrid) | Functional Fitness | [hybridleague.es](https://hybridleague.es/evento/entradas-hybrid-league-20-febrero-2027/) |
| 4 | Medieval Xtreme Race Polop 2027 | 21 feb 2027 | Polop (Alicante) | OCR | [medievalxtremrace.com](https://medievalxtremrace.com/inscripciones-polop/) |
| 5 | DEKA Torremolinos 2027 | 27–28 feb 2027 | Torremolinos (Málaga) | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-torremolinos) |
| 6 | DEKA Toledo 2027 | 6–7 mar 2027 | Toledo | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-toledo-2027) |
| 7 | HYROX Madrid 2027 | 17–21 mar 2027 | Madrid (IFEMA) | HYROX | [hyrox.es](https://hyrox.es/eventos/hyrox-madrid-26-27/) |
| 8 | DEKA Barcelona Primavera 2027 | 20–21 mar 2027 | Barcelona | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-barcelona-primavera) |
| 9 | DEKA Valencia 2027 | 3–4 abr 2027 | Valencia | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-valencia-2027) |
| 10 | Survivor Race Alicante 2027 | 10–11 abr 2027 | Alicante | OCR | [survivor-race.com](https://survivor-race.com/carreras/survivor-alicante/) |
| 11 | Hybrid Zone Torrelavega 2027 | 10 abr 2027 | Torrelavega (Cantabria) | Functional Fitness | [hybridzone.es](https://hybridzone.es/) |
| 12 | HYROX Málaga 2027 | 14–18 abr 2027 | Málaga (FYCMA) | HYROX | [hyrox.es](https://hyrox.es/eventos/hyrox-malaga-26-27/) |
| 13 | DEKA Ibiza 2027 | 17–18 abr 2027 | Sant Agustí des Vedrà (Ibiza) | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-ibiza-2027) |
| 14 | Desafío de Guerreros Valencia 2027 | 18 abr 2027 | Valencia | OCR | [desafiodeguerreros.com.es](https://www.desafiodeguerreros.com.es/carreras/p/desafio-valencia) |
| 15 | Spartan Race Madrid 2027 - Sprint | 8 may 2027 | San Agustín del Guadalix | Spartan | [es.spartan.com](https://es.spartan.com/es/races/madrid) |
| 16 | Spartan Race Madrid 2027 - Beast | 8 may 2027 | San Agustín del Guadalix | Spartan | [es.spartan.com](https://es.spartan.com/es/races/madrid) |
| 17 | Spartan Race Madrid 2027 - Super | 9 may 2027 | San Agustín del Guadalix | Spartan | [es.spartan.com](https://es.spartan.com/es/races/madrid) |
| 18 | Desafío de Guerreros Barcelona 2027 | 16 may 2027 | Pineda de Mar (Barcelona) | OCR | [desafiodeguerreros.com.es](https://www.desafiodeguerreros.com.es/carreras/p/desafio-barcelona) |
| 19 | Sacaba Summer Games 2027 | 29–30 may 2027 | Málaga | CrossFit | [sacabasummergames.com](https://www.sacabasummergames.com/) |
| 20 | Madrid Fitness Challenge 2027 | 4–6 jun 2027 | Majadahonda (Madrid) | CrossFit | [madridfitnesschallenge.com](https://madridfitnesschallenge.com/) |
| 21 | Desafío de Guerreros Gernika 2027 | 13 jun 2027 | Gernika-Lumo (Bizkaia) | OCR | [desafiodeguerreros.com.es](https://www.desafiodeguerreros.com.es/carreras/p/desafio-bizkaia) |
| 22 | BOLD Series Madrid 2027 | 18–20 jun 2027 | Madrid (Madrid Arena) | Functional Fitness | [theboldseries.com](https://www.theboldseries.com/) |
| 23 | DEKA Vigo 2027 | 26–27 jun 2027 | Vigo (IFEVI) | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-vigo-2027) |
| 24 | DEKA Madrid 2027 | 10–11 jul 2027 | Madrid (Madrid Arena) | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-madrid-2027) |
| 25 | DEKA Barcelona Otoño 2027 | 25–26 sep 2027 | Barcelona | DEKA | [es.spartan.com](https://es.spartan.com/es/races/deka-barcelona-otono-2027) |
| 26 | Desafío de Guerreros Madrid 2027 | 26 sep 2027 | Madrid | OCR | [desafiodeguerreros.com.es](https://www.desafiodeguerreros.com.es/carreras/p/desafio-madrid) |

Por modalidad:

- 8 DEKA
- 6 OCR
- 3 HYROX
- 3 Spartan (una fila por distancia del mismo fin de semana)
- 4 Functional Fitness
- 2 CrossFit

Estas carreras afectan a las páginas de ciudad:

- Bilbao: entran HYROX Bilbao (Barakaldo) y Desafío de Guerreros Gernika, porque la página cuenta toda Bizkaia. Dejará de ser `noindex` y entrará en el sitemap en cuanto se inserten.
- Madrid, Málaga, Valencia, Barcelona, Andalucía, Cataluña, Comunidad Valenciana y Baleares (DEKA Ibiza) suman carreras nuevas.
- Zaragoza, Valladolid, Asturias y Murcia siguen sin carreras de 2027 confirmadas y continúan como `noindex`.

## Anunciadas para 2027, pero sin fecha o sede confirmada (pendiente de fecha)

| Carrera | Qué se sabe | Fuente |
|---|---|---|
| Fungo Race OCR (El Puerto de Santa María) | "Marzo de 2027 (día por confirmar)", inscripción abierta. Los agregadores dicen 14 de marzo, pero la web oficial no lo confirma. | [fungorace.com/race](https://fungorace.com/race/) |
| The Hybrid Games (Valencia) | Solo "Valencia, May 2027". | [thehybridgames.fit](https://thehybridgames.fit/) |
| La Híbrida Caballa (Ceuta) | La prueba del 19-09-2026 se aplaza a la "primavera de 2027", en el Parque Marítimo del Mediterráneo. | [hibridacaballa.es](https://hibridacaballa.es/) |
| Northfit Zarautz | La web oficial solo dice "ENERO". theboxinthebox habla de 9-10 de enero de 2027 en el Polideportivo Aritzbatalde. | [northfitevents.com](https://northfitevents.com/) |
| HURBAX temporada 2027 | "Nuevas sedes muy pronto". | [hurbax.com](https://hurbax.com/) |
| La Furiosa Race 2027 (Palafrugell) | La página oficial solo lleva el título, sin fecha. | [página de La Furiosa](https://we-are-nude-sl.myklpages.com/l/WRnSpZ) |
| FCL Festival MAD 2027 (Alcobendas) | La web oficial no da fecha. FCL Festival BCN, FCL Games y FitRace Hybrid Challenge 2027 tampoco. | [fitnesschallengeleague.com](https://fitnesschallengeleague.com/) |

## Casos dudosos que no se han insertado

| Carrera | Motivo |
|---|---|
| Survivor Race Barcelona, 19-20 jun 2027 | La web oficial se contradice en la sede: la cabecera dice "Castellar del Vallès" y el texto habla de "Nuevo Territorio Survivor: Cardona". Hay que confirmar el municipio. [Ficha](https://survivor-race.com/carreras/survivor-barcelona/) |
| Poseidon Race Cerceda, 22 may 2027 | La fecha solo aparece en Instagram y en agregadores (gotrail.run, running.life). No hay web ni inscripción oficial de 2027. |
| Adrenaline Race Zahara de los Atunes, 25 sep 2027 | Solo aparece en calendariocarrerasobstaculos.es. La web adrenalinerace.es no respondía. |
| Cavernícola Race (8 may 2027), Samurai Xtreme Race (2-4 jul 2027), Rustica Race (6 mar 2027), Gladiators Arena Games (27 feb 2027) | Solo aparecen en carrerasocr.com, sin web oficial con la fecha. |
| Campeonato de Europa OCR 2027 (30 jun-4 jul) | Solo en carrerasocr.com. No se encontró sede ni fecha oficiales. |
| Desafío de los 300 (Ceuta), 24 abr 2027 | Solo en running.life. La organización (Regulares de Ceuta / ICD) no ha publicado la edición de 2027. |
| Me Hybrid Marbella (19 feb 2027), Tagoror Games (30 abr 2027), Ocean Games (20 feb 2027), February Challenge (22 ene 2027), EFC Ruster Jaén (12 feb 2027), Nexo Throwdown Zamora y Castilla Throwdown (24 abr 2027), Pacific Games 3.0 (17 abr 2027), GetStrong Championship (1 may 2027), Flamingo Invitational (15 may 2027), La Batalla de Guisando (28 may 2027), Salamanca Games (26 jun 2027) | Fechas sacadas de theboxinthebox.com. Solo enlazan a Instagram o a WodBuster, que pide iniciar sesión, así que no se pudo confirmar en una web oficial. |
| Valencia Throwdown 2027 (5 mar 2027) | Solo en theboxinthebox. La inscripción en WodBuster no es accesible sin sesión. |
| Consuegra Throwdown 2027 (5 jun 2027) | El propio listado dice "Sede: Por confirmar". |
| Vitoria Arena Games 2027 | theboxinthebox da 1 y 17 de abril de 2027 en dos fichas distintas, y la web oficial aún muestra la edición de 2026. |
| Spartan Race Andorra (5-6 jun 2027) | Está confirmada en es.spartan.com, pero es en Andorra (Encamp), no en España. |
| Valmeinier Throwdown (8-11 jul 2027) | Es en Francia. |
| XXI Subida Vertical Gran Hotel Bali (3 abr 2027) | Es una subida de escaleras, no una carrera híbrida. |

Aviso, sin tocar la base de datos: la web de Medieval Xtreme Race anuncia **Peñíscola el 13 de diciembre de 2026**, y la fila 133 dice 25 de octubre de 2026. Conviene revisarla a mano.

## Series que todavía no han publicado su calendario de 2027

Revisadas el 14 de octubre de 2026 en sus webs oficiales:

- **HYROX**: las sedes españolas de la temporada 26/27 con fecha en 2027 son solo Bilbao, Madrid y Málaga. Tenerife, Valencia, Barcelona y Palma (temporada 27/28) aún no tienen fecha de 2027.
- **Spartan Race España**: solo está Madrid. Barcelona (Santa Susanna) y Tenerife 2027 no aparecen.
- **DEKA**: Sevilla, Guadalajara, Alicante y Tenerife no tienen edición de 2027 publicada.
- **Farinato Race / Farinato Hybrid**: farinatorace.es no respondía y no hay ninguna fecha de 2027 en sus inscripciones de tucrono.
- **Survivor Race**: falta Madrid. Barcelona está en dudosos.
- **Desafío de Guerreros**: falta Málaga.
- **Medieval Xtreme Race**: Alginet y Torreblanca.
- **Bestial Race (Canarias)**: su web solo tiene ediciones de 2026.
- **Ninguna fecha de 2027 en su web**:
  - Gladius Race, Gladiator's Day, Desafío Costa Blanca, HUNTER, Athlon X, Hybrid Day (WeZone) y Gladiator Race Pontevedra;
  - The Battle Games, Gijón Throwdown, RNC Hybrid Race y Liga Híbrida Andalucía;
  - Strong Race y Berserker Xtreme Race.
- **Unas 60 OCR locales** que venían de calendariocarrerasobstaculos.es (Liga AOCO, North Finals y otras): solo tienen 2026. La AOCO no ha publicado aún su liga de 2027.
