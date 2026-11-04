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
   | Sábado | Nutrición y recuperación (el primer sábado de cada mes, producto) |
   | Domingo | Comunidad |

   Coge el primer post de ese tema que aún no se haya publicado (por orden de número). Si ya no quedan de ese tema, coge el primero que quede de cualquier otro.
3. Dibuja las imágenes (1080x1350), las sube a Supabase Storage (bucket `instagram`) y las publica como carrusel con la API de Instagram.
4. Apunta el resultado en la tabla `ig_posts_log` de Supabase. Si ese día ya se publicó algo, no vuelve a publicar.
5. Los domingos, si quedan menos de 10 posts sin publicar, llega un email a hola@hybridracehub.com con un texto listo para pedirle a Claude 30 posts más.

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

1. Crea un archivo nuevo en `instagram/posts/` con el siguiente número libre, por ejemplo `061-mi-tema.json` (copia uno existente como plantilla).
2. Reglas: de 5 a 8 slides; la primera `portada` y la última `cta`; título de portada de 60 caracteres como mucho; texto de cada punto de 260 como mucho; un `alt_text` por slide; de 3 a 5 hashtags; caption de 2000 caracteres como mucho. Para destacar **una** palabra en naranja, ponla entre asteriscos: `*palabra*`.
3. `npm run ig:validate` y `npm run ig:preview` para comprobarlo.
4. Haz commit y push. El sistema lo cogerá cuando le toque.

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
- `instagram/fonts/`: tipografías Barlow y Barlow Condensed (licencia OFL).
- `scripts/instagram/`: `publish.mjs` (publicar), `render.mjs` (dibujar), `preview.mjs` (vista previa), `validate.mjs` (validar), `whoami.mjs` (comprobar token y cuenta).
- `supabase/migrations/20261104_create_ig_posts_log.sql`: tabla de registro y bucket.
