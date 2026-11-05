# Instagram automático (@hybridracehub_spain)

Cada día se publica solo un carrusel en Instagram. No hay que hacer nada a mano.

## Cómo funciona

1. Todos los días a las **18:47 (hora de Madrid, invierno; 19:47 en verano)** GitHub lanza el workflow **"Instagram diario"** (`.github/workflows/instagram-daily.yml`).
2. El script `scripts/instagram/publish.mjs` elige el post del día según el día de la semana:

   | Día | Qué se publica |
   |---|---|
   | Lunes | Calendario de carreras de los próximos 21 días (sale de la tabla `races` de Supabase). Si hay menos de 2 carreras, un post normal |
   | Martes | Estaciones |
   | Miércoles | Entrenamiento |
   | Jueves | Errores y mitos |
   | Viernes | OCR |
   | Sábado | Nutrición y recuperación (el primer sábado de cada mes, producto si hay alguno; si no, nutrición) |
   | Domingo | Comunidad |

   Coge el primer post de ese tema que aún no se haya publicado (por orden de número). Si ya no quedan de ese tema, coge el primero que quede de cualquier otro.
3. Dibuja las imágenes (1080x1350), las sube a Supabase Storage (bucket `instagram`) y las publica como carrusel con la API de Instagram.
4. Apunta el resultado en la tabla `ig_posts_log` de Supabase. Si ese día ya se publicó algo, no vuelve a publicar.
5. Los domingos, si quedan menos de 10 posts sin publicar, llega un email a hola@hybridracehub.com con un texto listo para pedirle a Claude la siguiente tanda.

## Ver cómo quedan los posts (en tu ordenador)

```bash
npm run ig:validate   # revisa que todos los posts cumplen las reglas y que ningún texto se sale
npm run ig:preview    # dibuja todos los posts en instagram-preview/
```

Después abre `instagram-preview/index.html` en el navegador: verás cada carrusel con su texto.

## Probar sin publicar

- **En GitHub:** pestaña *Actions* → *Instagram diario* → *Run workflow*. Deja marcada la casilla **dry_run** y pulsa *Run workflow*. Sube las imágenes y lo apunta como `dry_run`, pero no publica nada.
- **En tu ordenador:** `DRY_RUN=true node scripts/instagram/publish.mjs` (lee las claves de `.env.local`).

## Pausar las publicaciones

GitHub → pestaña *Actions* → *Instagram diario* → botón **"···"** arriba a la derecha → **Disable workflow**. Para reanudar, lo mismo con **Enable workflow**.

## Añadir posts

Los posts siguen el formato de carrusel científico (7-10 slides con gráficas, ilustraciones y fuentes comprobadas). Las reglas completas, la lista de posts pendientes y el texto para pedirle a Claude la siguiente tanda están en **`instagram/PROGRESO.md`**.

Resumen:

1. Crea `instagram/posts/NNN-slug.json` con el siguiente número libre (copia uno de los posts 101-121 como plantilla).
2. `npm run ig:alt` rellena los textos alternativos de cada slide.
3. `npm run ig:validate` comprueba estructura, límites de texto, etiquetas y fuentes de las gráficas, y que nada se salga al maquetar.
4. `npm run ig:sources` comprueba cada estudio citado contra PubMed, Crossref y doi.org.
5. `npm run ig:preview` y revisa las imágenes. Después, commit y push.

Los posts antiguos (formato de texto) están en `instagram/posts/_legacy/` y el que ya se publicó en `instagram/posts/_publicados/`. El publicador no los usa.

## Si algo falla

- GitHub te manda un email cuando el workflow falla. En *Actions* → la ejecución en rojo → *Publicar carrusel* verás el error.
- En Supabase, tabla `ig_posts_log`, las filas `failed` tienen el error en la columna `error`.
- Errores típicos:
  - **Token caducado o sin permisos** (errores 190 o 10 de la API): genera un token nuevo en Meta (Facebook Login for Business) y actualiza el secreto `IG_ACCESS_TOKEN` en GitHub → *Settings* → *Secrets and variables* → *Actions*. Comprueba el token con `npm run ig:whoami`.
  - **La imagen no es pública**: revisa que el bucket `instagram` de Supabase Storage sigue siendo público.
  - **Límite de publicaciones**: Instagram limita las publicaciones por API en 24 horas; se arregla solo al día siguiente.
- Si falla un día, al día siguiente vuelve a intentarlo con el post que tocaba. Para relanzarlo el mismo día: *Run workflow* con **dry_run desmarcado**.

## Archivos

- `instagram/posts/`: un JSON por post.
- `instagram/assets/svg/`: ilustraciones (atletas en cada estación, cuerpo humano con zonas, obstáculos OCR...). Se regeneran con `npm run ig:illustrations`.
- `instagram/fonts/`: tipografías Barlow y Barlow Condensed (licencia OFL).
- `instagram/PROGRESO.md`: estado de los carruseles, pendientes y reglas.
- `scripts/instagram/`: `publish.mjs` (publicar), `render.mjs` (dibujar), `lib/design.mjs` (diseño de las slides y gráficas), `preview.mjs` (vista previa), `validate.mjs` (validar), `verify-sources.mjs` (comprobar fuentes), `fill-alt.mjs` (textos alternativos), `build-illustrations.mjs` (ilustraciones), `whoami.mjs` (comprobar token y cuenta).
- `supabase/migrations/20261104_create_ig_posts_log.sql`: tabla de registro y bucket.
