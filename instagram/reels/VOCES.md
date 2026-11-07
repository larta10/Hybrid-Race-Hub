# Voces de la narración (Piper)

Motor: [Piper](https://github.com/OHF-Voice/piper1-gpl) (paquete `piper-tts` 1.8.0, la continuación oficial del proyecto),
local y gratuito. Voces del repositorio oficial `rhasspy/piper-voices` en Hugging Face. Sin servicios externos, sin
cuentas y sin claves.

## Voces es_ES (castellano de España) revisadas

Revisadas el 7 de noviembre de 2026 leyendo el `MODEL_CARD` de cada una:

| Voz | Calidad | Licencia de sus datos | Modelo de partida | Licencia del modelo de partida | ¿Válida? |
|---|---|---|---|---|---|
| es_ES-davefx-medium | medium | CC0 | lessac (inglés, EE. UU.) | Blizzard 2013 Lessac: **solo investigación**, excluye uso comercial | Dudosa |
| es_ES-sharvard-medium | medium (2 voces) | CC BY 3.0 (corpus Sharvard, Aubanel et al., 2014) | lessac | Ídem: **solo investigación** | Dudosa |
| es_ES-carlfm-x_low | x_low (16 kHz) | Dominio público | Ninguno (entrenada desde cero) | — | Sí, pero calidad por debajo de la pedida |
| es_ES-mls_10246-low | low | CC BY 4.0 | ryan (inglés) | CC BY-NC-SA 4.0: **no comercial** | Dudosa y calidad baja |
| es_ES-mls_9972-low | low | CC BY 4.0 | ryan (inglés) | CC BY-NC-SA 4.0: **no comercial** | Dudosa y calidad baja |

Lo dudoso: las voces medium se entrenaron "afinando" un modelo inglés cuyos datos solo permiten investigación
(https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html). La licencia no dice si un
modelo derivado hereda esa restricción. No hay una respuesta segura, así que **la publicación con voz está
desactivada** hasta que Pablo decida (`"activa": false` en `voz.json`). En las pruebas (DRY_RUN) y en las vistas
previas sí se usa, para que se pueda escuchar y probar todo el sistema.

## Voz elegida por defecto

**es_ES-davefx-medium**: datos CC0 (no exige atribución) y la más natural de las medium según la comunidad de Piper.
Ajustes en `voz.json`: `length_scale` 1,06 (algo más pausada), `noise_scale` 0,62 y `noise_w` 0,85 (menos monótona),
pausas de 220 ms entre frases. Posproceso: corte por debajo de 80 Hz, realce suave de presencia en 3 kHz, compresión
ligera, reverberación casi nula y -14 LUFS.

Prueba de claridad (Whisper, sin darle el texto, muestra de 16-18 s): las tres voces de `instagram-preview/voces/`
se entienden palabra por palabra. Elegir "la más natural" de oído no lo puede hacer un script: escucha las muestras.

- `voz-1.wav`: davefx (medium)
- `voz-2.wav`: sharvard (medium, voz 0)
- `voz-3.wav`: carlfm (x_low)

## Cómo cambiar de voz

1. En `instagram/reels/voz.json`, cambia `"modelo"` (por ejemplo `"es_ES-sharvard-medium"`). Si la licencia exige
   atribución (sharvard: CC BY 3.0), pon en `"atribucion"` el texto, por ejemplo
   `"Voz: Piper (sharvard, corpus Sharvard, CC BY 3.0)"`: se añade solo al caption.
2. Para publicar con voz: `"activa": true`.
3. Regenera: `python video/scripts/narrar.py <reel_id>…` (el workflow también lo hace solo si el texto o la voz cambian).

## Transparencia

Cada reel con voz añade al caption "Voz generada con IA." (y la atribución de la voz si hace falta). La API de
publicación de Instagram (Graph API, contenedores REELS) no tiene ningún parámetro para marcar contenido generado con
IA, así que no se puede activar desde el publicador; si Instagram lo añade, se pondrá en `publishReel`.

## Pronunciación

`pronunciacion.json` cambia los términos en inglés antes de pasarlos a Piper (los subtítulos muestran el original).
Comprobado transcribiendo con Whisper sin darle el texto: "Jáirocs" es la grafía que mejor se entiende para HYROX;
"sled" no se entiende con ninguna grafía, así que en la narración se dice "trineo" (empuje y arrastre de trineo).
