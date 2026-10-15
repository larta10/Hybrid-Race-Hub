# Informe: circuitos y franquicias híbridas en España

Revisión: 15 de octubre de 2026. Solo cuentan los circuitos con al menos 2 pruebas en España y solo las carreras futuras con fecha y sede confirmadas en la web oficial del organizador o en su plataforma oficial de inscripción.

**Estado de la inserción:** pendiente. El MCP de Supabase no está conectado, así que el SQL está en `scripts/insert-races-hibridas-2026-10-15.sql`. Solo añade filas nuevas y se salta las que ya existan. Registro con la fuente de cada carrera: `data/import-circuitos-2026-10-15.json`. Copia de seguridad previa: `backups/races-backup-2026-10-15-18-24.json` (192 filas).

## Carreras añadidas (8)

| Circuito | Carrera | Fecha | Ciudad | Modalidad | Fuente |
|---|---|---|---|---|---|
| FitRace (Fitness Challenge League) | FitRace Costa Brava 2026 (plazas agotadas) | 17 oct 2026 | Sant Pere Pescador (Girona) | Functional Fitness | [fitnesschallengeleague.com](https://fitnesschallengeleague.com/fitrace-costa-brava-2026-d85) |
| Hyatlón (FETRI) | H6 Hyatlón La Nucía 2026 | 24-25 oct 2026 | La Nucía (Alicante) | Hyatlón | [hyatlon.org](https://hyatlon.org/event/la-nucia) |
| HURBAX | HURBAX Madrid 2026 · Final Nacional | 24 oct 2026 | San Sebastián de los Reyes (Madrid) | HURBAX | [hurbax.com](https://hurbax.com/eventos/madrid) |
| Badajoz Race Hybrid (Diputación de Badajoz) | Badajoz Race Hybrid Calamonte 2026 | 25 oct 2026 | Calamonte (Badajoz) | Functional Fitness | [dip-badajoz.es](https://www.dip-badajoz.es/badajozrace/) y [chipserena.es](https://www.chipserena.es/web-evento/13941-badajoz-race-hybrid-calamonte) |
| Hyatlón (FETRI) | H6 Hyatlón Gran Canaria 2026 | 14-15 nov 2026 | Las Palmas de Gran Canaria | Hyatlón | [hyatlon.org](https://hyatlon.org/event/gran-canaria) |
| Athlon X | Athlon X Fuengirola · Last Wave 2026 | 21 nov 2026 | Fuengirola (Málaga) | Fitness Funcional | [athlonx.es](https://athlonx.es/athlonx/last-wave/) |
| Hyatlón (FETRI) | H8 Hyatlón Zaragoza 2026 | 28-29 nov 2026 | Zaragoza | Hyatlón | [hyatlon.org](https://hyatlon.org/event/zaragoza) |
| Athlon X | Athlon X Benidorm · Terra Mítica 2027 | 20 feb 2027 | Benidorm (Alicante) | Fitness Funcional | [athlonx.es](https://athlonx.es/athlonx/terra-mitica/) |

Por circuito: Hyatlón 3, Athlon X 2, HURBAX 1, Badajoz Race Hybrid 1 y FitRace 1.

### Modalidades nuevas

Se crean dos modalidades dentro del grupo "HYROX / Funcional": **Hyatlón** (`func-hyatlon`) y **HURBAX** (`func-hurbax`). Aparecen en los filtros del calendario y en la etiqueta de las tarjetas, y el calendario admite el filtro por URL: `/calendario?modalidad=func-hyatlon`.

Las tres filas antiguas de HURBAX (Pontevedra, Oviedo y Madrid, ids 169-171) siguen como "Fitness Funcional" porque no se modifican filas existentes. El enlace a la guía de HURBAX les sale igual, porque se detecta por el nombre.

Badajoz Race Hybrid usa `func-hyrox` porque replica las 8 estaciones de HYROX, igual que Hybrid Day. Athlon X sigue la convención de sus filas anteriores (`Fitness Funcional` / `func-fitness`).

## Aviso sobre filas existentes (no modificadas)

- **Fila 171, "Hurbax Madrid":** dice 10 de octubre de 2026 en Madrid, pero la web oficial anuncia la Final Nacional el **24 de octubre de 2026 en San Sebastián de los Reyes**. La fila venía de carrerasocr.com. Conviene borrarla o corregirla a mano para que no salga duplicada con la nueva.

## Pruebas anunciadas sin fecha confirmada

| Circuito | Qué se sabe | Fuente |
|---|---|---|
| HURBAX temporada 2027 | "Nuevas sedes muy pronto" | [hurbax.com](https://hurbax.com/) |
| Hyatlón 2027 | La web oficial no tiene aún pruebas de 2027 | [hyatlon.org](https://hyatlon.org/) |
| Fungo Race Hybrid (Jerez de la Frontera) | "Noviembre 2026", sin día | [fungorace.com](https://fungorace.com/) |
| FitRace Costa Dorada y FitRace Hybrid Challenge 2027 | Aparecen en la web de FCL sin fecha | [fitnesschallengeleague.com](https://fitnesschallengeleague.com/) |
| Badajoz Race Hybrid 2027 | La web de la Diputación solo tiene las cuatro sedes de 2026 | [dip-badajoz.es](https://www.dip-badajoz.es/badajozrace/) |

## Circuitos revisados y descartados

| Circuito o prueba | Motivo |
|---|---|
| Mega Hyatlón (MegaSport, Palma) | Fue el 3 y 4 de octubre de 2026: ya ha pasado. |
| Hyatlón Madrid | Fue el 10 de octubre de 2026: ya ha pasado. |
| HURBAX Gijón, Oviedo, Pontevedra, Valladolid y Santander | Sedes de 2026 ya celebradas (Gijón el 26 de septiembre). |
| Badajoz Race Hybrid Villanueva de la Serena, Santa Amalia y Almendralejo | Ya celebradas (15 de marzo, 18 de julio y 12 de septiembre de 2026). En la web, Almendralejo aparece como "sábado, 12 de septiembre", pero ese día era miércoles. |
| Liga Híbrida Andalucía (Jaén, 24 de octubre de 2026) | Ya está en la base de datos (fila 50). |
| Tarraco Hybrid Games (Tarragona, 24 de octubre de 2026) | Prueba única, no es circuito. Además, la fecha solo aparece en un agregador. |
| Deadly Dozen España (Cártama) | Franquicia internacional sin página oficial de la prueba en España; solo aparece en un agregador. |
| FURA y ATHX | No hay pruebas en España publicadas en sus calendarios. |
| Northfit (Irun, Donostia, Zarautz) | La web oficial da meses sin año. |
| DEKA, HYROX, Hybrid Day, Hybrid Zone, Hybrid League, Liga Híbrida Andalucía | Ya estaban en el calendario (las de 2027 se añadieron el 14-10-2026). |

## Contenido nuevo

- `/blog/que-es-el-hyatlon`:
  - qué es, origen (FETRI y World Triathlon) y tabla con las estaciones de H6 y H8;
  - modalidades, tabla comparativa con HYROX y sedes de 2026;
  - próximas pruebas en un bloque dinámico desde Supabase (se regenera cada hora) y 5 preguntas frecuentes.
- `/blog/que-es-hurbax`:
  - formato con las estaciones de Gijón 2026, modalidades, campeonato (top 20, final, premios y clubes) y sedes;
  - tabla HURBAX frente a HYROX e Hyatlón;
  - próximas pruebas dinámicas y 5 preguntas frecuentes.
- **Guía pilar:** Hyatlón y HURBAX añadidos a los tipos de carrera y a la tabla comparativa.
- **Calendario y páginas de ciudad:** cada carrera de Hyatlón, HURBAX o HYROX enlaza a su guía.
- **Sitemap:** las dos URLs nuevas entran solas, con su fecha de actualización.
