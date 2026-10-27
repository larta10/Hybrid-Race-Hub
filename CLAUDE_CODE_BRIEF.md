# Brief de diseño — Hybrid Race Hub (vigente desde el 27/10/2026)

El brief anterior (tema oscuro, condensada en mayúsculas y acento de color fuerte) se retiró en el rediseño de octubre de 2026. Está en el historial de git, en el tag `pre-rediseno`.

## Idea
Publicación deportiva editorial hecha por personas: fondo papel, texto tinta, un solo color de marca, jerarquía tipográfica y separadores finos en lugar de cajas con sombra.

## Color (tokens en `:root` de `styles/global.css`; nada de colores sueltos en componentes)
| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | #F5F4F0 | #121416 | Fondo |
| `--surface` | #FFFFFF | #1A1D20 | Tarjetas |
| `--ink` | #14161A | #ECEBE7 | Texto |
| `--ink-2` | #4A4F57 | #A9AEB5 | Texto secundario |
| `--line` | #E2E0DA | #2A2E33 | Separadores de 1 px |
| `--accent` | #1F5C46 | #6FBF9A | Único color de marca (verde pista) |
| `--accent-soft` | #E3EDE8 | #1C3229 | Fondo de "Inscripción abierta" |

Estados de inscripción: abierta (verde sobre verde suave), últimas plazas (#8A5A00 sobre #F8EED6), cerrada o agotado (`--ink-2` sobre #ECEBE7).
El modo oscuro sigue al sistema y se puede forzar con el botón de la cabecera (`localStorage.hrh_theme`).

## Tipografía
- Titulares: **Archivo** anchura 112 %, peso 800 (instancia estática en `assets/fonts/`), interletraje ligeramente negativo, sin mayúsculas forzadas.
- Texto: **Source Sans 3** (400 y 600), 17 px / 1,55 en móvil, 68 caracteres de ancho máximo de lectura.
- Cifras tabulares en fechas, precios y tiempos. Mayúsculas solo en etiquetas pequeñas (14 px).

## Forma
Tarjetas con radio de 8 px, botones de 6 px, zonas táctiles de 44 px como mínimo. Sin degradados decorativos, brillos, desenfoques, sombras de neón ni animaciones de entrada.

## Tono de los textos
Directo y concreto, de alguien que compite: "Ver el calendario", "Inscribirme", "Enviar mi carrera". Nada de "Descubre", "Sumérgete" ni exclamaciones en serie.
