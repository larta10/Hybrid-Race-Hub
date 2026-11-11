# Plan de entrenamiento gratis

Documento de trabajo del generador de planes. Empieza por la auditoría de lo que había (11-11-2026) y sigue con lo que se ha construido encima.

## 1. Auditoría: lo que había el 11-11-2026

### Qué había

| Pieza | Archivo | Qué hacía |
|---|---|---|
| Página | `pages/plan-entrenamiento.js` (1.006 líneas) | Formulario de 6 pasos y el plan en la misma URL, `/plan-entrenamiento`. Todo en un componente, con su propio CSS dentro de la página. |
| Motor | `lib/training-plans.js` (857 líneas) | Biblioteca de sesiones fijas por objetivo y nivel, repartidas en fases por porcentaje del total de semanas. |
| Excel | `pages/api/generate-excel.js` | Recibía las respuestas por POST, regeneraba el plan y devolvía un `.xlsx` (ExcelJS): portada, una hoja por semana y "Mi Progreso". |
| PDF | dentro de la página | jsPDF + autotable en el navegador: portada, una página por semana y hoja de progreso. |
| Sobrecarga progresiva | duplicada en la página y en la API | Peso corporal × ratio por nivel, en ciclos fijos de 4 semanas: base, +5 %, +10 %, descarga al 80 %. |

### Qué pedía

Edad, peso y altura · objetivo (OCR Sprint, OCR Pro, OCR Ultra, HYROX, CrossFit, Funcional) · nivel y días por semana (3 a 6) · horizonte (4, 8, 12 o 16 semanas, o "sin fecha" = 12) · equipamiento (box, gimnasio, casa, aire libre) · puntos débiles (fuerza, resistencia, velocidad, obstáculos, movilidad, potencia).

### Qué generaba

Un plan por semanas con fases (base, desarrollo, intensidad, descarga), sesiones sacadas de una lista fija y un consejo semanal según el punto débil. Limitaciones:

- **No conocía la fecha de la carrera.** Se elegía un número de semanas; no había cuenta atrás ni taper pegado al día de la prueba.
- **Sin ritmos de carrera.** No pedía marca ni ritmo; las sesiones hablaban de "zona 2" o "ritmo tempo" sin números.
- **La altura y la edad no se usaban.** El peso solo servía para las cargas.
- **Las cargas iban por libre**: el ciclo de 4 semanas no coincidía con las fases del plan (podía tocar "+10 %" en la semana de la carrera).
- **El material casi no cambiaba nada**: las sesiones eran las mismas con una nota de "o sustituto".
- **El plan no se podía compartir ni recuperar**: vivía en la memoria de la página; al recargar se perdía.
- **Sin medición**: ningún evento al dataLayer.

### Desde dónde se enlazaba

Menú desplegable de la cabecera ("Plan de entrenamiento"), hero de la home ("Crear plan gratis"), índice de secciones y paso 02 de "Cómo funciona" en la home, pie ("Plan de entrenamiento gratis"), la guía `/que-es-una-carrera-hibrida`, dos guías de material (`lib/guias-material.js`) y el sitemap. **Ninguna ficha de carrera ni tarjeta del calendario enlazaba al plan.**

### Qué fallaba en móvil (390 px)

- La página no llevaba la cabecera ni el pie del sitio: solo un enlace "← Inicio". Se perdía el menú y el modo oscuro.
- Las opciones eran `<div onClick>`: no se podían recorrer con teclado ni las anunciaba un lector de pantalla, y no había estado de foco.
- Etiquetas de 9 y 10 px (el mínimo del sitio son 14 px) y chips de puntos débiles de unos 30 px de alto, por debajo de los 44 px táctiles.
- La barra de fases pintaba texto negro sobre el color de texto (negro sobre casi negro): no se leía.
- En la cabecera de cada semana, el consejo compartía fila con el número, la etiqueta y la flecha: en 390 px quedaba en una columna de tres o cuatro palabras por línea.
- Paso 1 con tres campos numéricos y sin poder saltarlos; el botón "Continuar" quedaba por debajo del teclado.
- El CSS de la página redefinía `body` y `a` para todo el documento.
- El PDF y el Excel seguían con la marca antigua (rojo sobre negro).

### Muro de pago (Stripe)

**No queda nada que quitar.** Hubo un pago de 2,99 € con Stripe (commit `81e9241`) y se retiró en `d9a948d`, que dejó la descarga gratis. Comprobado hoy:

- Ninguna ruta, webhook ni componente menciona Stripe (`grep -ri stripe` solo encuentra "SiteStripe" de Amazon en un informe).
- `package.json` no tiene `stripe` ni `@stripe/*`.
- `.env.example` no tiene variables de Stripe.

**Variables que Pablo puede borrar en Vercel** (Settings → Environment Variables), si siguen ahí de aquella época: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` y cualquier otra que empiece por `STRIPE_`. El código no lee ninguna. Si en el panel de Stripe quedó un webhook apuntando a `hybridracehub.com/api/...`, también se puede borrar: esa ruta ya no existe.

## 2. Decisiones

- **Diseño: manda el brief vigente del repo** (`CLAUDE_CODE_BRIEF.md`, 27-10-2026): papel y tinta, Archivo + Source Sans 3, verde pista, modo oscuro automático. El encargo pedía "oscuro, industrial, Barlow Condensed, naranja", pero ese es el tema que el rediseño de octubre retiró; meterlo solo en el plan habría dejado dos webs distintas. El plan usa los tokens de `styles/global.css` y se ve oscuro cuando el sistema o el botón de la cabecera lo piden.
- **URL**: la página pilar es `/plan-entrenamiento-hyrox`. `/plan-entrenamiento` redirige con 301 (no hay 404).
- **El plan generado vive en `/mi-plan?…`**: se reconstruye en el servidor a partir de los parámetros, sin base de datos. Lleva `noindex` y canonical a la landing.
- **Se quita CrossFit como objetivo**: el generador se centra en carreras del calendario (HYROX, OCR, DEKA y otras híbridas).
