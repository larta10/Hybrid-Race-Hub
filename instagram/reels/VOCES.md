# Voz de la narración

**Voz elegida: Kokoro-82M, voz `em_alex` (masculina), activada.** Local, gratuita, sin cuentas, sin claves y sin
servicios online: se ejecuta en el ordenador y en GitHub Actions. Revisión hecha el 7 de noviembre de 2026.

## 1. Reglas de licencia

Una voz solo es válida si **todos** los eslabones (código, pesos del modelo, modelo base y datos de entrenamiento
según su ficha) son MIT, Apache-2.0, BSD, CC0, CC BY o equivalente que permita uso comercial. Se descarta lo que
tenga NC/no comercial, "solo investigación", licencias propias restrictivas, acceso con login, servicios online no
oficiales o clonación de una persona real identificable, y también **cualquier eslabón cuya licencia no esté clara**.

Nota sobre GPL-3.0 (Piper, espeak-ng, phonemizer): es una licencia libre que permite uso comercial; sus condiciones
solo se aplican al redistribuir el programa, cosa que no hacemos (solo lo ejecutamos), y no alcanzan al audio
generado. Se considera equivalente comercial para el código. Los pesos y los datos sí tienen que ser permisivos.

## 2. Candidatas revisadas

### A) Chatterbox Multilingual (Resemble AI) — DESCARTADA

| Eslabón | Lo que dice la fuente | ¿Cumple? |
|---|---|---|
| Código (github.com/resemble-ai/chatterbox) | MIT | Sí |
| Pesos (`ResembleAI/chatterbox`, multilingüe V2/V3) | MIT | Sí |
| Pesos del paquete de castellano (`ResembleAI/Chatterbox-Multilingual-es-es`) | MIT, afinado desde `ResembleAI/chatterbox` | Sí |
| Modelo base | "0.5B Llama backbone"; los agradecimientos citan Llama 3 y CosyVoice sin aclarar si se usan sus pesos (Llama 3 tiene licencia propia de Meta) | **No está claro** |
| Datos de entrenamiento | Solo "0.5M hours of cleaned data"; ninguna ficha dice qué datos ni con qué licencia | **No está claro** |
| Voz | No incluye voces de referencia en español: hay que darle una grabación (clonación) | Riesgo |

Motivo: la licencia de los datos y del modelo base no consta en ninguna ficha → regla "si no está clara, se
descarta". No se ha descargado ni probado.

### B) Kokoro-82M (hexgrad) — VÁLIDA, ELEGIDA

| Eslabón | Lo que dice la fuente | ¿Cumple? |
|---|---|---|
| Pesos (`hexgrad/Kokoro-82M`, público, sin login) | Apache-2.0 | Sí |
| Pesos en ONNX que usamos (releases de GitHub de `thewh1teagle/kokoro-onnx`, `model-files-v1.0`) | Conversión de los pesos Apache-2.0 (la licencia permite redistribuir derivados); SHA-256 fijado en `video/scripts/motores.py` | Sí |
| Modelo base | `yl4579/StyleTTS2-LJSpeech`: código MIT; datos LJSpeech de dominio público. La única condición de los modelos de StyleTTS2 es avisar de que la voz es sintética, que cumplimos con "Voz generada con IA." en cada caption | Sí |
| Datos de entrenamiento | Ficha: "trained exclusively on permissive/non-copyrighted audio data": dominio público, audio Apache/MIT, audio CC BY (SIWIS, CC BY 4.0, francés; Koniwa tnc, CC BY 3.0, japonés) y audio sintético de TTS comerciales (sin copyright según la guía de la US Copyright Office que cita), "no custom voice clones" | Sí |
| Voz `em_alex` | Voz del propio modelo, no es la clonación de una persona real | Sí |
| Código | kokoro-onnx (MIT), onnxruntime (MIT), phonemizer (GPL-3.0), espeak-ng vía espeakng-loader (GPL-3.0, fonemas castellanos con /θ/ y /ʎ/) | Sí (ver nota GPL) |
| Atribución en el caption | Apache-2.0 no la exige para el audio generado; los datos CC BY son de otros idiomas y su atribución no se extiende al audio que produce el modelo | No hace falta |

### C) Piper es_ES (rhasspy/piper-voices) — solo carlfm es válida

| Voz | Datos | Modelo de partida | ¿Válida? |
|---|---|---|---|
| es_ES-carlfm-x_low | Dominio público | Ninguno ("Trained from scratch") | **Sí** (16 kHz, calidad baja) |
| es_ES-davefx-medium | CC0 | lessac (Blizzard 2013: solo investigación) | No |
| es_ES-sharvard-medium | CC BY 3.0 | lessac (solo investigación) | No |
| es_ES-mls_10246-low | MLS, CC BY 4.0 | ryan (CC BY-NC-SA 4.0: no comercial) | No |
| es_ES-mls_9972-low | MLS, CC BY 4.0 | ryan (no comercial) | No |

Código: piper-tts 1.8.0 (GPL-3.0). No hay ninguna voz es_ES afinada desde una base con licencia comercial clara.

## 3. Prueba y puntuación

Script: `video/scripts/probar_voces.py` (reproducible). Muestras en `instagram-preview/voces/` (fuera del repo):
`<voz>-muestra.wav` (gancho y escenas 1-4 de r103, ~22 s), `<voz>-terminos.wav` (frase con HYROX, SkiErg, wall
balls y Roxzone) y `<voz>-acento.wav` (sien/cien, sumo/zumo…). Resultados completos en `resultados.json`.

Cómo se mide:
- **Inteligibilidad (30 %)**: faster-whisper `small` en español, sin darle el texto, frente al texto original (WER).
  Antes de comparar, las cifras se pasan a letras y lo que suena al término inglés (p. ej. "High Rocks") cuenta como
  acierto.
- **Acento (25 %)**: pares mínimos /s/-/θ/ (sien-cien, sumo-zumo, sierra-cierra, seta-zeta…, 16 pares). Con la
  distinción castellana la palabra con /s/ empieza con más energía aguda que la de /θ/; con seseo (acento
  latinoamericano) la diferencia es ~0 dB. Referencias castellanas (no candidatas): davefx 0-4 dB, sharvard 15-17 dB.
  La /s/ castellana es apical y menos aguda, por eso una voz castellana puede dar solo 3-4 dB. La medida tiene ruido
  (sobre todo en Piper, que varía entre ejecuciones), pero ninguna candidata sale en 0 dB.
- **Naturalidad (30 %)**: variación de la entonación (semitonos), velocidad (2-3 palabras/s), silencios raros
  dentro de la frase (> 450 ms), clics (saltos bruscos en la forma de onda), saturación y ancho de banda.
- **Términos (15 %)**: HYROX, SkiErg, wall balls y Roxzone reconocidos por Whisper sin pista y con el vocabulario
  como pista.

| Voz | WER | Distinción θ/s | Tono (st) | Pal./s | Términos sin pista | Intelig. | Acento | Natural. | Términos | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|
| kokoro-ef_dora | 1,7 % | 3,3 dB | 3,17 | 2,64 | 4/4 | 9,0 | 8,9 | 9,3 | 10,0 | **9,23** |
| kokoro-em_alex | 3,3 % | 3,4 dB | 3,72 | 2,58 | 4/4 | 8,0 | 9,1 | 10,0 | 10,0 | **9,18** |
| piper-carlfm | 10,0 % | 10,9 dB | 2,16 | 2,64 | 4/4 | 4,0 | 10,0 | 5,3 | 10,0 | **6,80** |

Ninguna tiene clics, saturación ni silencios raros. carlfm suena apagada (16 kHz) y monótona (2,2 semitonos) y se
entiende peor.

**Desempate** entre las dos de Kokoro (la diferencia de la tabla es una sola palabra): narraciones completas de r103,
r104 y r109 (290 palabras). em_alex: WER 3,8 % y entonación 3,5 st; ef_dora: WER 4,1 % y 3,1 st. Los únicos fallos
son de Whisper, no de la voz ("ficio" por "fisio", "Grávate" por "Grábate", alguna palabra inventada al empezar).

### Elección: **kokoro-em_alex**

La que mejor se entiende en textos largos y la más expresiva; distingue /s/ y /θ/ como una voz castellana (Kokoro
recibe fonemas de castellano de espeak-ng) y pronuncia los términos en inglés de forma reconocible.

## 4. Ajustes de la voz elegida (`voz.json`)

- `velocidad` 0,9 (algo pausada; probadas 0,86, 0,90 y 0,94: misma claridad, 0,9 queda más natural de ritmo).
- `pausa_frases` 0,22 s entre frases y 0,25 s entre escenas.
- Kokoro no tiene un parámetro de expresividad; su entonación natural ya varía 3,5 semitonos.
- Posproceso con ffmpeg (igual que antes): corte por debajo de 80 Hz, realce suave en 3 kHz, compresión ligera,
  reverberación casi nula y -14 LUFS. Audio guardado en el repo en MP3 de 128 kbps.

## 5. Pronunciación

`pronunciacion.json` es común a todos los motores; `pronunciacion.<motor>.json` lo ajusta para uno concreto. Con
Kokoro, HYROX se escribe "Jai rox" (Whisper lo oye como "High Rocks", es decir, como en inglés; con "Jáirocs"
oía "hírox"). SkiErg ("Ski Erg"), wall balls ("wol bols") y Roxzone ("Rox zon") funcionan con el diccionario común.
"sled" sigue como "trineo". Los subtítulos siempre muestran el texto original.

## 6. Transparencia

Cada reel con voz añade al caption "Voz generada con IA." (también cumple la condición de StyleTTS2 de avisar de
que la voz es sintética). La API de Instagram no tiene parámetro para marcar contenido generado con IA.

## 7. Cómo cambiar de voz

En `voz.json`: `"voz"` (`em_alex`, `ef_dora`) y `"velocidad"`. Para volver a Piper: `"motor": "piper"`,
`"modelo": "es_ES-carlfm-x_low"` y `length_scale`, `noise_scale`, `noise_w`. Después:
`python video/scripts/narrar.py <reel_id>…` (el workflow también lo hace solo si cambia el texto o la voz). El
render comprueba que el audio guardado sea de la voz configurada; si no, el reel sale sin voz.

## 8. Casting del 10 de noviembre de 2026

`python video/scripts/probar_voces.py --casting` genera `instagram/reels/casting-voz/` (un MP3 por voz válida con el
mismo texto de ~12 s, con pregunta, cifra y términos en inglés) e `indice.md` con la tabla (voz, licencia,
parámetros, WER con Whisper y observaciones). **`voz.json` no se ha cambiado**: la elección es de Pablo escuchando.

Voces revisadas eslabón a eslabón:

| Voz | Código | Pesos | Modelo base | Datos | ¿Válida? |
|---|---|---|---|---|---|
| Kokoro em_alex, ef_dora, em_santa | kokoro-onnx MIT, onnxruntime MIT, espeak-ng/phonemizer GPL-3.0 | Apache-2.0 | StyleTTS2-LJSpeech (MIT, dominio público) | Permisivos o sin copyright según la ficha | **Sí** (em_santa es nueva: mismo modelo y licencia que las otras dos) |
| Piper es_ES-carlfm-x_low | piper-tts GPL-3.0 | MIT | Ninguno (desde cero) | Dominio público | **Sí** |
| Piper es_ES-davefx-medium | GPL-3.0 | — | lessac (Blizzard 2013: solo investigación) | CC0 | No |
| Piper es_ES-sharvard-medium (F y M) | GPL-3.0 | — | lessac (solo investigación) | CC BY 3.0 | No |
| Piper es_ES-mls_10246-low / mls_9972-low | GPL-3.0 | — | ryan (CC BY-NC-SA 4.0) | MLS CC BY 4.0 | No |
| MeloTTS Spanish | MIT | MIT | — | La ficha no dice qué datos ni con qué licencia | No (dudosa) |
| XTTS-v2 (Coqui) | MPL-2.0 | Coqui Public Model License (no comercial) | — | — | No |
| MMS-TTS spa (Meta) | — | CC BY-NC 4.0 | — | — | No |

Resultados (detalle en `casting-voz/indice.md`): ef_dora 0 % de WER; em_alex y em_santa 3,1 %; carlfm 9,4 % y apagada
(16 kHz). em_santa es la más expresiva (4,6 semitonos) y la de distinción /s/-/θ/ más clara (4,4 dB).
**Recomendadas: ef_dora y em_santa.**

### Naturalidad (vale para cualquier motor, en `video/scripts/motores.py`)

- Pausas según la puntuación: coma 0,12 s, punto 0,28 s, interrogación/exclamación 0,32 s (`motores.trozos`). En
  Kokoro las comas no se cortan (hace bien la entonación dentro de la frase); en Piper sí (`dividir_comas`).
- Piper: rejilla length_scale 0,95-1,05 × noise_scale 0,6-0,75 × noise_w 0,7-0,9; para carlfm gana 0,95 / 0,6 / 0,9.
  Kokoro: velocidad 0,9 en las tres voces (0,95 y 1,0 se entienden igual o peor).
- Cadena de voz (`motores.CADENA_VOZ` + `motores.postproceso`): highpass 80 Hz, de-esser suave, +2 dB en 3 kHz,
  compresión 2,5:1 y normalización a -14 LUFS / -1 dBTP (medida y ganancia fija + limitador). Sustituye a la cadena
  anterior (ya no lleva reverberación).
- Diccionario por motor: `pronunciacion.kokoro.json` y `pronunciacion.piper.json` con HYROX, wall balls, SkiErg,
  Roxzone, burpee broad jump y farmers carry ("sled push" se dice "empuje de trineo" en todos, desde el común).

### Cambiar de voz regenera solo lo necesario

La huella de cada narración (`narrar.huella`) incluye todo `voz.json` salvo licencia, atribución, activa y whisper, el
diccionario, el texto y la versión del proceso. Cambiar `voz.json` cambia la huella de todos los reels con
narración, y el paso "Narración" del workflow los regenera en la siguiente ejecución; el render rechaza un audio de
otra voz. Comprobado el 10/11/2026: con `--voz=` apuntando a una copia con `"voz": "em_santa"` la huella de r105
cambia y con el `voz.json` actual no.
