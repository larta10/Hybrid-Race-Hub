# hibrid-sport-calendar
Calendario de pruebas deportivas 2026

## IndexNow (Bing, Copilot, Yandex)

Avisa a los buscadores que usan IndexNow de que hay URLs nuevas o cambiadas. La clave está en `public/93eff6d8563ee7911d5e7fdf1e62f7bf.txt` (no la cambies sin cambiar también `scripts/indexnow.mjs`).

```bash
node scripts/indexnow.mjs            # envía todas las URLs del sitemap de producción
node scripts/indexnow.mjs /carreras/hyrox-madrid-2027 /calendario/2026/noviembre   # solo esas
node scripts/indexnow.mjs --dry      # muestra la lista sin enviar
```

Lánzalo después de cada despliegue con contenido nuevo (carreras nuevas, artículos). No hace falta más de una vez al día; Google no usa IndexNow (para Google, el sitemap y Search Console).
