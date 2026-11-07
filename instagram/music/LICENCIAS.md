# Música de los Reels

Catálogo en `pistas.json` (lo lee `video/scripts/lib/music.mjs`). Todas las pistas están
normalizadas a unos -14 LUFS (loudnorm de ffmpeg), suenan bajas bajo el texto y llevan fundido
de entrada y salida. La pista se elige por rotación diaria, así que dos días seguidos nunca repiten
si hay al menos dos pistas.

## Pistas en uso

| Archivo | Título | Autor | URL | Licencia |
|---|---|---|---|---|
| reserva-1-am.m4a | Pista de reserva 1 (La menor, 120 BPM) | Hybrid Race Hub, generada por código (`video/scripts/make-music.mjs`) | — | Propia, sin derechos de terceros |
| reserva-2-dm.m4a | Pista de reserva 2 (Re menor, 120 BPM) | Hybrid Race Hub, generada por código | — | Propia, sin derechos de terceros |
| reserva-3-em.m4a | Pista de reserva 3 (Mi menor, 120 BPM) | Hybrid Race Hub, generada por código | — | Propia, sin derechos de terceros |

Las pistas de reserva son un ambiente rítmico simple (bombo, palmas, hi-hat, bajo y pad)
sintetizado nota a nota. No usan muestras ni grabaciones de nadie.

## Pistas de Pixabay pendientes de añadir

Pixabay bloquea las descargas automáticas (responde 403 a los scripts), así que hay que bajarlas
a mano. Licencia: Pixabay Content License (https://pixabay.com/service/license-summary/):
uso gratuito, también comercial, se puede editar y no exige atribución. No se puede revender la
pista sola ni usarla como marca.

Cómo elegir (6-8 pistas):

1. Busca en https://pixabay.com/music/search/energetic%20workout/ ,
   https://pixabay.com/music/search/gym%20instrumental/ y https://pixabay.com/music/search/workout%20sport/
2. Filtra por pistas instrumentales (sin voz), enérgicas, de al menos 45 s.
3. Descarga el MP3 y ejecuta, desde `video/`:
   `node scripts/add-track.mjs ~/Downloads/pista.mp3 "Título" "Autor" "https://pixabay.com/music/…/" 128`
4. Añade una fila a la tabla de arriba con título, autor, URL y licencia.

Con dos o más pistas de Pixabay en el catálogo, las de reserva dejan de usarse solas.

Aviso: algunas pistas de Pixabay están registradas en sistemas de identificación de contenido.
Si Instagram marcara un Reel, en la página de la pista está el certificado de licencia para
reclamarlo; guárdalo al descargarla.
