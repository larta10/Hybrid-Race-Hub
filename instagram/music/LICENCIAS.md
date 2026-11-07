# Música de los Reels

Pistas de Openverse (https://openverse.org) con licencias que permiten uso comercial: primero CC0
(dominio público, sin atribución) y después CC BY (uso comercial permitido citando al autor).
Nunca NC (no comercial) ni ND (sin obras derivadas). Catálogo en `pistas.json`.

- Normalizadas a unos -14 LUFS (loudnorm de ffmpeg); suenan bajas bajo el texto, con fundido de entrada y salida.
- Cada pista empieza en su campo `inicio` para saltar intros tranquilas.
- Rotación diaria: dos días seguidos nunca llevan la misma pista.
- Las CC BY añaden solas al caption del reel la línea "Música: Título – Autor (CC BY)".
- Se eligieron por sus etiquetas (instrumental, energética, deporte) y descartando las marcadas
  como "vocal". Si alguna resulta tener voz al escucharla, pon `"activa": false` en `pistas.json`.

Importar más: `node scripts/fetch-music.mjs <id de Openverse>` (desde `video/`).

| Archivo | Título | Autor | URL | Licencia | Texto de atribución |
|---|---|---|---|---|---|
| cc0-free-uplifting-music.m4a | Free Uplifting Music | Seth_Makes_Sounds | https://freesound.org/people/Seth_Makes_Sounds/sounds/670819 | CC0 1.0 (dominio público) | No hace falta (CC0) |
| cc0-city-loop.m4a | city-loop.mp3 | wi-photos | https://freesound.org/people/wi-photos/sounds/513827 | CC0 1.0 (dominio público) | No hace falta (CC0) |
| cc0-synth-metal-rock-loop.m4a | Synth Metal Rock Loop.wav | furbyguy | https://freesound.org/people/furbyguy/sounds/361424 | CC0 1.0 (dominio público) | No hace falta (CC0) |
| cc0-bell-beats.m4a | Bell Beats.wav | BuytheField | https://freesound.org/people/BuytheField/sounds/414441 | CC0 1.0 (dominio público) | No hace falta (CC0) |
| cc0-60s-style-rock-loop.m4a | 60s Style Rock Loop.wav | BaDoink | https://freesound.org/people/BaDoink/sounds/532829 | CC0 1.0 (dominio público) | No hace falta (CC0) |
| ccby-pulse-of-life-free-music.m4a | Pulse of Life - FREE MUSIC | ANtarcticbreeze | https://www.jamendo.com/track/1210828 | CC BY 3.0 | Música: Pulse of Life - FREE MUSIC – ANtarcticbreeze (CC BY) |
| ccby-high-voltage-free-music.m4a | High Voltage - FREE MUSIC | ANtarcticbreeze | https://www.jamendo.com/track/1210825 | CC BY 3.0 | Música: High Voltage - FREE MUSIC – ANtarcticbreeze (CC BY) |
| ccby-banger.m4a | Banger | e s c p | https://www.jamendo.com/track/1608512 | CC BY 3.0 | Música: Banger – e s c p (CC BY) |

Texto de atribución completo de cada pista (CC BY) en el campo `atribucion_completa` de `pistas.json`.
