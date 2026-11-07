# Reels de Instagram (Remotion)

Proyecto aparte de la web: tiene su propio `package.json` y no entra en el build de Next ni en Vercel
(está en `.vercelignore`, en los `ignores` de ESLint y no hay `tsconfig` que lo incluya).

- Formato: 1080 x 1920, 30 fps, H.264 (CRF 20, preset x264 `veryfast`), AAC 128 kbps, yuv420p, faststart.
- Zona segura: nada importante en el 10 % superior, el 18 % inferior ni en los 140 px de la derecha.
- Guiones: `instagram/reels/*.json`. Música: `instagram/music/` (licencias en `LICENCIAS.md`).

## Regla de oro

El humano **siempre** es vídeo real de stock con licencia (Pexels). Está prohibido dibujar o animar
personas con código (SVG, siluetas, muñecos, avatares). Si no hay un clip bueno para un movimiento,
la escena pasa a texto y gráfica sobre un fondo neutro sin personas.

## Comandos (desde `video/`)

```bash
npm ci
node scripts/fetch-clips.mjs r102-carbohidratos-en-carrera   # busca y descarga clips en Pexels (necesita PEXELS_API_KEY)
node scripts/fetch-clips.mjs --all
node scripts/frames.mjs clips r102-carbohidratos-en-carrera  # 3 fotogramas por clip para revisarlos
node scripts/render.mjs r102-carbohidratos-en-carrera         # MP4 + portada JPG en video/out/
node scripts/frames.mjs video out/r102-carbohidratos-en-carrera.mp4   # 1 fotograma por segundo (control de calidad)
npm run studio                                                # editor visual de Remotion
```

## Licencias

- **Remotion**: uso gratuito permitido. La licencia de Remotion es gratuita para particulares y
  empresas de hasta 3 empleados; Hybrid Race Hub es un proyecto de una persona (menos de 4),
  así que no necesita licencia de empresa. Si el equipo creciera a 4 personas o más, habría que
  comprar la Company License (https://www.remotion.dev/license).
- **Pexels**: uso comercial y modificación permitidos sin atribución obligatoria
  (https://www.pexels.com/license/). Aun así el caption lleva "Vídeo: Pexels" y nunca se insinúa
  que las personas que salen recomiendan Hybrid Race Hub. Los clips no se suben al repo
  (`video/cache/`, ignorado): se descargan en cada render a partir del id guardado en el guion.
- **Música**: ver `instagram/music/LICENCIAS.md`.
- **Fuentes**: Barlow y Barlow Condensed (SIL Open Font License), copiadas de `instagram/fonts/`.
