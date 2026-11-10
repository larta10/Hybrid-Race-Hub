# Reels de Instagram (Remotion)

Proyecto aparte de la web: tiene su propio `package.json` y no entra en el build de Next ni en Vercel
(está en `.vercelignore`, en los `ignores` de ESLint y no hay `tsconfig` que lo incluya).

- Formato: 1080 x 1920, 30 fps, H.264 (CRF 20, preset x264 `veryfast`), AAC 128 kbps, yuv420p, faststart.
- Zona segura: nada importante en el 10 % superior, el 18 % inferior ni en los 140 px de la derecha.
- Guiones: `instagram/reels/*.json`. Música: `instagram/music/` (licencias en `LICENCIAS.md`).

## Regla de oro

El humano principal **siempre** es vídeo real de stock con licencia (Pixabay o Pexels). Desde el 10 de noviembre
de 2026 Pablo autoriza una única excepción: el **monigote de técnica** (`src/components/Monigote.jsx`), una figura
articulada estilo diagrama de biomecánica (líneas blancas, articulaciones en círculos, cabeza sin cara, fondo oscuro
con rejilla) que solo se usa en escenas de técnica (postura, error frente a correcto, ángulos, trayectorias):

- Solo en escenas `"tecnica": { "pose", "comparar", "marcas" }` (con `clip.sin_clip: true`).
- Nunca en el gancho (el validador lo impide) ni como protagonista del reel: el resto de escenas son vídeo real.
- Se usa cuando no hay un clip real que enseñe bien el gesto. Si tampoco es una escena de técnica, la escena pasa a
  texto y gráfica sobre fondo neutro (como mucho el 20 % de las escenas, nunca dos seguidas).
- Prohibido cualquier otro dibujo o animación de personas (siluetas, avatares, muñecos de estilo infantil).

Poses en `src/poses.js` (ángulos articulares de cadera, rodilla, tobillo, hombro, codo y tronco, con keyframes e
interpolación suave): wall_ball, sled_push (tronco a ~45°), sled_pull, sandbag_lunge, farmers_carry, remo
(catch/drive/finish), ski_erg, burpee_broad_jump, carrera y cuerda. Cada una tiene su "así no" para la comparativa
(`"comparar": true`: "✗ Así no" en rojo apagado arriba y "✓ Así sí" en verde apagado abajo). Marcas: `angulo`
(rodilla, cadera, codo o tronco, con grados), `espalda` (línea de alineación), `trayectoria` (balón o mano) y
`texto`. Revisión: `node scripts/poses-hoja.mjs <pose> [--comparar]` → `out/frames/poses/`.

## Ritmo, gancho y sonido

- Gancho (0-1,5 s): el clip más potente desde el primer fotograma, texto grande con entrada de golpe y un golpe de
  sonido; sin logo (la marca aparece después del gancho). Abre una pregunta, un error o una cifra.
- Cortes cada 1,5-2,5 s: cada escena se divide en planos de ~2,1 s que alternan sus clips (`escena.cortes`) o, con
  un solo clip, hacen punch-in del 10 %; cada corte entra con un zoom de 5 fotogramas. Barra de progreso fina arriba.
  Las escenas con anillos de músculo no se cortan (los anillos van colocados sobre el clip).
- Efectos (`instagram/sfx/`, generados con `node scripts/make-sfx.mjs`, CC0): impacto en el gancho, whoosh en
  cada cambio de escena y click al entrar "qué hacer".
- Mezcla: con voz, la música se mezcla fuera de Remotion con ducking real (`sidechaincompress` con la voz como
  cadena lateral) y todo sale a -14 LUFS / -1 dBTP (`mezclar` en `scripts/render.mjs`).
- Imagen: el mismo tratamiento de color en todos los clips (`FILTRO` en `src/components/Fondo.jsx`).

## Comandos (desde `video/`)

```bash
npm ci
node scripts/fetch-clips.mjs buscar r102-carbohidratos-en-carrera   # candidatos de Pixabay (+ Pexels si hay PEXELS_API_KEY)
node scripts/fetch-clips.mjs elegir/aprobar/sinclip …          # ver instagram/PROGRESO.md
node scripts/fetch-clips.mjs elegir r1NN-slug p3=pixabay-123:0.5   # plano extra en la escena 3 (escena.cortes)
node scripts/poses-hoja.mjs wall_ball --comparar               # hoja de control de una pose del monigote
node scripts/render.mjs r102-carbohidratos-en-carrera         # MP4 + portada JPG en video/out/
node scripts/frames.mjs video out/r102-carbohidratos-en-carrera.mp4   # 1 fotograma por segundo (control de calidad)
npm run studio                                                # editor visual de Remotion
```

## Licencias

- **Remotion**: uso gratuito permitido. La licencia de Remotion es gratuita para particulares y
  empresas de hasta 3 empleados; Hybrid Race Hub es un proyecto de una persona (menos de 4),
  así que no necesita licencia de empresa. Si el equipo creciera a 4 personas o más, habría que
  comprar la Company License (https://www.remotion.dev/license).
- **Pixabay** (vídeo): licencia de contenido de Pixabay, uso comercial y modificación permitidos sin
  atribución obligatoria (https://pixabay.com/service/license-summary/). Normas de la API: búsquedas
  cacheadas 24 h y nada de enlazar a sus URLs: cada clip aprobado se descarga, se recorta y se sube a
  nuestro bucket (`clips/`). El caption lleva "Vídeo: Pixabay" y nunca se insinúa que las personas que
  salen recomiendan Hybrid Race Hub.
- **Pexels** (vídeo, si hay `PEXELS_API_KEY`): licencia de Pexels (https://www.pexels.com/license/), uso comercial y
  modificación permitidos sin atribución obligatoria; no se puede revender el clip tal cual ni dar a entender que las
  personas que salen respaldan la marca. Mismo tratamiento que Pixabay: se descarga, se recorta y se sube a nuestro
  bucket. El caption termina en "Vídeo: Pixabay", "Vídeo: Pexels" o "Vídeo: Pixabay / Pexels" según las fuentes de los
  clips del reel (lo exige `npm run ig:validate`).

## Variedad del metraje

Reglas en `scripts/instagram/lib/variedad.mjs`, comprobadas por `npm run ig:validate` (también en CI) y por el
publicador (un reel que no las cumple no está listo y sale el carrusel):
- Al menos el 80 % de las escenas con vídeo real o con el monigote de técnica; nunca dos escenas seguidas de solo texto.
- Ningún clip (fuente + id) repetido dentro de un reel ni en los 30 reels siguientes de la cola (orden r###; los
  publicados, `"publicado"`, y los descartados, `"descartado"`, no cuentan; `_calendario` y `x##` van aparte).
- Al menos 5 clips distintos por reel (escenas, planos extra y fondo final).
- Las búsquedas (`clip.queries`, 3-4 en inglés) describen lo que se VE, no lo que se dice, y `buscar` ya excluye los
  clips que usa otro reel de la cola. La relevancia exige que las palabras de la búsqueda estén en las etiquetas y
  penaliza estudio, retratos, logos, animales y vehículos. Cada clip se recorta con un tramo de al menos 7 s
  (`tramo`) para no tener que ir a cámara lenta si la voz alarga la escena.
- **Música**: ver `instagram/music/LICENCIAS.md`.
- **Fuentes**: Barlow y Barlow Condensed (SIL Open Font License), copiadas de `instagram/fonts/`.
