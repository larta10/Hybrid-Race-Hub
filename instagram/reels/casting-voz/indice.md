# Casting de voces (castellano de España)

Generado con `python video/scripts/probar_voces.py --casting` (Whisper `small` para medir el WER). Mismo texto para todas (~15 s, con una pregunta, una cifra y términos en inglés), con las pausas por puntuación (coma 0,12 s, punto 0,28 s, pregunta 0,32 s) y la cadena de voz de la narración (corte de 80 Hz, de-esser, +2 dB en 3 kHz, compresión suave, -14 LUFS / -1 dBTP). Para cada voz se probó una rejilla de parámetros y queda la combinación con menos errores de Whisper y más entonación, sin clics ni silencios raros.

> ¿Sabes cuánto tiempo pierdes en la Roxzone? En tu primer HYROX, unos ocho minutos entre estaciones. Entra en los wall balls con calma, respira por la nariz y sal corriendo sin pararte.

| Voz | Archivo | Licencia | Parámetros elegidos | Inteligibilidad (WER) | Observaciones |
|---|---|---|---|---|---|
| Kokoro ef_dora (mujer) | [kokoro-ef_dora.mp3](kokoro-ef_dora.mp3) | Apache-2.0 (pesos); base StyleTTS2-LJSpeech MIT + dominio público; datos permisivos según la ficha | velocidad 0.9 | 0.0 % | 11.9 s; 2.77 pal/s; entonación 3.27 st; -14.8 LUFS / -1.6 dBTP |
| Kokoro em_alex (hombre) | [kokoro-em_alex.mp3](kokoro-em_alex.mp3) | Apache-2.0 (pesos); base StyleTTS2-LJSpeech MIT + dominio público; datos permisivos según la ficha | velocidad 0.9 | 3.1 % | 12.2 s; 2.87 pal/s; entonación 3.38 st; -14.6 LUFS / -1.6 dBTP |
| Kokoro em_santa (hombre) | [kokoro-em_santa.mp3](kokoro-em_santa.mp3) | Apache-2.0 (pesos); base StyleTTS2-LJSpeech MIT + dominio público; datos permisivos según la ficha | velocidad 0.9 | 3.1 % | 12.3 s; 2.86 pal/s; entonación 4.6 st; -14.7 LUFS / -1.6 dBTP |
| Piper es_ES-carlfm-x_low (hombre) | [piper-carlfm.mp3](piper-carlfm.mp3) | Pesos MIT; datos de dominio público; entrenada desde cero (sin modelo base); piper-tts GPL-3.0 (solo se ejecuta) | length_scale 0.95, noise_scale 0.6, noise_w 0.9 | 9.4 % | 11.7 s; 2.74 pal/s; entonación 2.14 st; modelo a 16 kHz: suena más apagada; -15.3 LUFS / -1.6 dBTP |

## Recomendadas

1. **Kokoro ef_dora (mujer)** (`kokoro-ef_dora.mp3`): la que mejor se entiende (0 % de WER en el casting y la mejor en
   la prueba anterior de VOCES.md), entonación natural (3,3 semitonos) y distinción castellana /s/-/θ/ (3,3 dB).
2. **Kokoro em_santa (hombre)** (`kokoro-em_santa.mp3`): la más expresiva (4,6 semitonos de variación, frente a 3,4
   de em_alex) con la misma inteligibilidad que em_alex (3,1 % de WER) y la distinción /s/-/θ/ más clara de las tres
   (4,4 dB; em_alex 3,4 dB). Es la alternativa masculina a la voz actual.

La voz actual (em_alex) sigue siendo válida: se entiende igual que em_santa, pero es algo más plana.
Piper carlfm se queda como reserva: se entiende peor (9,4 % de WER), suena apagada (modelo a 16 kHz) y es monótona.

Medida de la distinción /s/-/θ/ (pares mínimos sien-cien, sumo-zumo…; mediana de la diferencia de energía aguda al
empezar la palabra; con seseo da ~0 dB): em_santa 4,4 dB · em_alex 3,4 dB · ef_dora 3,3 dB.

Las cuatro salen a -14,6/-15,3 LUFS integrados y -1,6 dBTP de pico: el limitador a -1 dBTP deja la sonoridad algo
por debajo de -14 en un texto tan corto; en una narración completa queda en -14 ± 0,5.

La decisión es de Pablo escuchando los MP3. Para cambiar: edita `instagram/reels/voz.json` (motor, voz o modelo y los parámetros de la tabla). La huella de cada narración incluye la configuración de la voz, así que el workflow regenera las narraciones afectadas en la siguiente ejecución (y el render rechaza un audio de otra voz).

## Revisadas y descartadas por licencia (no se generan)

| Voz | Motivo |
|---|---|
| Piper es_ES-davefx-medium | Afinada desde lessac (Blizzard 2013, solo investigación) |
| Piper es_ES-sharvard-medium (hablantes F y M) | Afinada desde lessac (solo investigación) |
| Piper es_ES-mls_10246-low | Afinada desde ryan (CC BY-NC-SA 4.0, no comercial) |
| Piper es_ES-mls_9972-low | Afinada desde ryan (CC BY-NC-SA 4.0, no comercial) |
| MeloTTS Spanish (myshell-ai/MeloTTS-Spanish) | Código y pesos MIT, pero la ficha no dice con qué datos se entrenó ni con qué licencia |
| Chatterbox Multilingual | Datos y modelo base sin licencia clara (ver VOCES.md) |
| XTTS-v2 (Coqui) | Coqui Public Model License: no comercial |
| MMS-TTS spa (Meta) | CC BY-NC 4.0: no comercial |

## Transcripciones de Whisper

- kokoro-ef_dora: "¿Sabes cuánto tiempo pierdes en la Rockstone? En tu primer High Rocks, unos ocho minutos entre estaciones. Entra en los wallballs con calma, respira por la nariz y sal corriendo sin pararte."
- kokoro-em_alex: "Sabes cuánto tiempo pierdes en la rock zone. En tu primer high rocks, unos ocho minutos entre estaciones. Entra en los wall bowls con calma, respira por la nariz y sal corriendo sin pararte."
- kokoro-em_santa: "¿Sabes cuánto tiempo pierdes en la rock zone? En tu primer high rocks, unos ocho minutos entre estaciones. Entra en los wall bowls con calma, respira por la nariz y sal corriendo sin pararte."
- piper-carlfm: "¿Sabes cuánto tiempo pierdes en la Rockstone? En tu primer Jair, unos ocho minutos entre estaciones. Entra en los walls con calma, respira por la nariz y sal corriendo sin pararte."
