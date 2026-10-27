# Plan de Meta Ads (Instagram y Facebook) — Hybrid Race Hub (octubre 2026)

## Cuándo NO invertir

No gastes ni un euro en Meta hasta que se cumplan las tres cosas:

1. **La medición funciona**: `affiliate_click` y `race_outbound_click` llegan a GA4 (ver `docs/sem/GTM-CONFIG.md`). Sin eso no sabrás si los clics de Instagram sirven para algo.
2. **Hay banner de consentimiento** con Consent Mode v2. Si además instalas el píxel de Meta (opcional, desde GTM), solo puede dispararse con consentimiento.
3. **Google Ads lleva al menos 2-3 semanas activo** y ya sabes qué páginas convierten mejor. Meta llega a gente que no está buscando: es más barato por clic pero convierte peor, y conviene llevar ese tráfico a páginas probadas.

Tampoco inviertas en Meta en las semanas en las que no haya carreras próximas que enseñar (por ejemplo, agosto): el mensaje "la próxima carrera cerca de ti" pierde fuerza.

## Presupuesto

Reparto sugerido sobre **200 €/mes**: **60 % Google (120 €) / 40 % Meta (80 €)**.
En Meta: **2,60 €/día** en una sola campaña, o 80 € concentrados en las 3-4 semanas previas a una gran fecha (por ejemplo, HYROX Madrid en marzo de 2027).

Con presupuestos así de pequeños, mejor **una campaña y dos conjuntos de anuncios** que muchos conjuntos sin datos.

## Objetivo de campaña

- **Tráfico** (optimizado para "visitas a la página de destino"), mientras no tengas el píxel con eventos.
- Si instalas el píxel de Meta desde GTM con consentimiento y envías `affiliate_click` / `race_outbound_click` como eventos personalizados, pasa a **Ventas/Clientes potenciales → conversión personalizada** cuando acumules unas 50 por semana (difícil con este presupuesto: probablemente te quedes en Tráfico, y está bien).

## Públicos

País: **España**. Edad: **22-45 años**. Idioma: español. Ubicaciones: **Instagram (feed, stories y reels)**; Facebook solo si el CPC de Instagram se dispara.

| Conjunto | Intereses (segmentación detallada) | Destino |
|---|---|---|
| A. Fitness híbrido | HYROX, CrossFit, entrenamiento funcional, Spartan Race, carrera de obstáculos (OCR), Tough Mudder | `/calendario` o la página de la región si segmentas por provincia |
| B. Runners que quieren algo nuevo | Running, trail running, carrera de montaña, media maratón, Strava | `/que-es-una-carrera-hibrida` |

- Si Meta no ofrece "HYROX" como interés, usa CrossFit + entrenamiento funcional + Spartan Race, y deja que Advantage+ amplíe.
- Para anuncios regionales (por ejemplo, "Carreras híbridas en Andalucía"), segmenta por **provincias** y lleva a la página de esa región.
- Excluye a quien ya haya visitado la web en 30 días solo cuando tengas el píxel y bastante tráfico; antes no aporta.

## Formatos

1. **Reel o story vertical (9:16), 10-15 segundos**: vídeo propio de una carrera o de un entreno (trineo, wall balls, barro). Es lo que mejor funciona en este nicho. No uses vídeo de terceros sin permiso.
2. **Carrusel** de 3-5 tarjetas: "Las próximas carreras híbridas en [zona]" con fecha y ciudad en cada tarjeta (datos del calendario, nunca inventados).
3. **Imagen única 1:1 o 4:5** con un dato claro: "Ya hay 26 carreras híbridas con fecha en 2027" (dato del 27/10/2026) (actualiza el número con el calendario antes de lanzar).

Texto sobre la imagen: poco y legible. Nada de naranja chillón ni efectos: misma línea sobria que la web.

## 5 textos de anuncio

1. **Calendario**
   "¿Buscas tu próxima carrera híbrida? HYROX, DEKA, Spartan y OCR en un solo calendario, con fecha, precio y el enlace a la inscripción oficial. Elige ciudad y apúntate antes de que suban los precios."
   Botón: *Más información* → `/calendario`

2. **2027**
   "Ya hay carreras híbridas con fecha en 2027 en España. Si quieres prepararla con tiempo, aquí las tienes ordenadas por mes y por comunidad."
   Botón: *Más información* → `/calendario`

3. **Primera carrera (runners)**
   "Si ya corres, estás a medio camino de una carrera híbrida. Te explicamos en qué se diferencian HYROX, DEKA, el Hyatlón y las carreras de obstáculos, y cuál encaja contigo."
   Botón: *Más información* → `/que-es-una-carrera-hibrida`

4. **Regional (ejemplo Andalucía)**
   "Carreras híbridas en Andalucía: HYROX y DEKA en Málaga, OCR en Granada y una hybrid race en Sevilla. Todas las fechas en una página y los centros donde entrenar cerca de ti."
   Botón: *Más información* → `/carreras-hibridas/andalucia`
   (Comprueba antes de lanzar que esas carreras siguen en el calendario.)

5. **Dónde entrenar**
   "¿Preparas HYROX y en tu gimnasio no hay trineo ni SkiErg? Más de 400 boxes y gimnasios en España, con dirección y teléfono. Busca el tuyo por ciudad."
   Botón: *Más información* → `/centros-entrenamiento`

Todas las URLs con UTM: `?utm_source=meta&utm_medium=paid_social&utm_campaign=<calendario|2027|guia|andalucia|centros>`.

## Qué mirar

- **CPC en enlace** < 0,25 € y **CTR en enlace** > 1 % son buenas cifras para este nicho. Por encima de 0,50 €, cambia la creatividad antes que el público.
- En GA4: sesiones con `utm_source=meta` y su tasa de `race_outbound_click` / `affiliate_click`. Si después de 4 semanas el coste por conversión de Meta es más del doble que el de Google, mueve ese presupuesto a Google.
- Renueva las creatividades cada 3-4 semanas: con públicos pequeños, la frecuencia sube rápido (más de 3 = cansancio).
