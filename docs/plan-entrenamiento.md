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

## 3. Lo que hay ahora

| Pieza | Dónde | Qué hace |
|---|---|---|
| Motor | `lib/plan/` | Módulo puro: `buildPlan(respuestas, { today })`. Sin red, sin reloj y sin React. Tests en `lib/plan/plan.test.js` (`npm test`, también en CI). |
| Formulario | `components/plan/PlanWizard.js` | Nueve pasos, una pregunta por pantalla. No calcula nada: abre `/mi-plan?…`. |
| Plan | `pages/mi-plan.js` | Se reconstruye en el servidor con los parámetros de la URL. `noindex` y canonical a la landing. |
| Landings | `pages/plan-entrenamiento-hyrox/*`, `pages/plan-entrenamiento-ocr.js` | Generador arriba y contenido propio debajo, con `components/plan/PlanLanding.js`. |
| Descargas | `pages/api/plan-pdf.js`, `plan-excel.js`, `plan-email.js` | PDF y Excel generados en el servidor (`lib/plan-export/`). El correo usa Resend y no guarda la dirección. |
| Calendario → plan | `components/RaceList.js`, `pages/carreras/[slug].js` | Enlace «Prepárala: plan gratis» con `?prueba=&fecha=&carrera=`. |

### Cómo se calcula el plan

- **Semanas**: las completas que faltan hasta la carrera, entre 4 y 24. Sin fecha, 12. Con menos de 4, puesta a punto de 1 a 3 semanas. Con más de 24, las últimas 24.
- **Fases**: taper de 2 semanas si el plan tiene 10 o más (1 si es más corto); del resto, un 30 % específico, un 35 % construcción y lo demás base.
- **Descargas**: cada 4 semanas (cada 3 si eres principiante o tienes 50 años o más), nunca a menos de 2 semanas del taper.
- **Ritmos**: de la marca de 5 km (o del ritmo cómodo). El umbral sale de proyectar la marca con la fórmula de Riegel al ritmo de una hora.
- **Fuerza**: peso corporal × ratio por nivel, +2,5 % por semana de carga (tope +20 %), menos en descarga y taper.
- **Material**: cada estación tiene sustituto para gimnasio básico y para casa (`lib/plan/material.js`).
- **Altura**: se pide, viaja en el enlace y no cambia el plan. La edad solo decide la frecuencia de las descargas.

### Parámetros de la URL

`prueba`, `fecha` (AAAA-MM-DD), `nivel`, `t5k` (segundos) o `rc` (segundos por km), `dias`, `min`, `material`, `debiles` (separadas por comas), `edad`, `peso`, `altura`, `carrera` (slug de la ficha). Lo que no es válido se ignora; si falta algo imprescindible, `/mi-plan` devuelve al formulario.

## 4. URLs y redirecciones

| URL | Qué es |
|---|---|
| `/plan-entrenamiento-hyrox` | Página pilar |
| `/plan-entrenamiento-hyrox/principiantes` | Variante: primera HYROX |
| `/plan-entrenamiento-hyrox/12-semanas` | Variante: bloque de 12 semanas |
| `/plan-entrenamiento-hyrox/dobles` | Variante: parejas |
| `/plan-entrenamiento-ocr` | Carreras de obstáculos |
| `/mi-plan?…` | Plan generado (noindex) |
| `/plan-entrenamiento` | **301** a `/plan-entrenamiento-hyrox` |

A vigilar en Search Console: `/plan-entrenamiento-hyrox/12-semanas` y el artículo `/blog/plan-entrenamiento-hyrox-12-semanas` responden a la misma búsqueda. Están diferenciados (uno es el generador; el otro, una tabla fija) y se enlazan entre sí. Si a los dos meses Google alterna entre los dos, lo más limpio es redirigir el artículo a la variante.

## 5. Medición: qué crear en Google Tag Manager

La web ya envía estos avisos a GTM cada vez que alguien usa el plan. Falta decirle a GTM que los reenvíe a Google Analytics. Se hace una vez y son unos 15 minutos.

| Aviso (evento) | Cuándo salta | Datos que lleva |
|---|---|---|
| `plan_start` | Primera respuesta del formulario | `prueba` |
| `plan_step` | Cada paso completado | `step` (1 a 9), `step_name` |
| `plan_generated` | Al pulsar «Ver mi plan» | `prueba`, `semanas`, `nivel`, `dias`, `con_fecha` |
| `plan_download` | Descarga o envío por correo | `formato` (pdf, excel, email), `prueba` |
| `plan_share` | Al compartir | `method` (web_share, copy_link) |
| `plan_from_race` | Al llegar desde una carrera del calendario | `race`, `prueba` |

### Paso 1: crear las variables (los datos)

1. Entra en [tagmanager.google.com](https://tagmanager.google.com) y abre el contenedor **GTM-5D5D2CH9**.
2. Menú izquierdo → **Variables** → abajo, en «Variables definidas por el usuario», pulsa **Nueva**.
3. Tipo de variable: **Variable de capa de datos**. En «Nombre de la variable de capa de datos» escribe `prueba`. Ponle de nombre `dlv - prueba` y guarda.
4. Repite el paso 3 para: `semanas`, `nivel`, `dias`, `con_fecha`, `step`, `step_name`, `formato`, `method` y `race`. Diez variables en total.

### Paso 2: crear un solo activador para los seis avisos

1. Menú izquierdo → **Activadores** → **Nuevo**.
2. Tipo: **Evento personalizado**.
3. En «Nombre del evento» escribe `^plan_(start|step|generated|download|share|from_race)$` y marca la casilla **Usar coincidencia de expresiones regulares**.
4. Nombre del activador: `Plan - todos los eventos`. Guarda.

### Paso 3: crear la etiqueta que lo manda a Analytics

1. Menú izquierdo → **Etiquetas** → **Nueva**.
2. Tipo: **Google Analytics: evento de GA4**.
3. ID de medición: el mismo que ya usan tus otras etiquetas de GA4 (empieza por `G-`).
4. En «Nombre del evento» pulsa el icono del bloque de construcción y elige la variable integrada **Event**. Así cada aviso llega a Analytics con su propio nombre.
5. En **Parámetros de evento** añade diez filas. En cada una, el nombre a la izquierda y la variable del paso 1 a la derecha: `prueba` → `{{dlv - prueba}}`, `semanas` → `{{dlv - semanas}}`, y así con `nivel`, `dias`, `con_fecha`, `step`, `step_name`, `formato`, `method` y `race`.
6. En **Activación** elige `Plan - todos los eventos`.
7. Nombre de la etiqueta: `GA4 - Plan de entrenamiento`. Guarda.

### Paso 4: probar y publicar

1. Arriba a la derecha, **Vista previa**. Escribe `https://hybridracehub.com/plan-entrenamiento-hyrox` y conecta.
2. En la web, rellena el formulario hasta ver el plan y descarga el PDF.
3. Vuelve a la pestaña de vista previa: en la columna izquierda tienen que aparecer `plan_start`, varios `plan_step`, `plan_generated` y `plan_download`, y en cada uno la etiqueta `GA4 - Plan de entrenamiento` como «activada».
4. Si todo sale, pulsa **Enviar** → **Publicar**.

### Paso 5: en Google Analytics

1. **Administrar → Visualización de datos → Eventos**: al día siguiente aparecen los seis. Marca `plan_generated` y `plan_download` como **evento clave** (son las dos conversiones del plan).
2. **Administrar → Visualización de datos → Definiciones personalizadas → Crear dimensión personalizada**: crea una por cada dato que quieras ver en los informes. Las útiles son `prueba`, `formato`, `step_name` y `semanas` (ámbito: evento; el parámetro se llama igual). Sin este paso los datos llegan, pero no se pueden usar en los informes.
3. Para ver en qué pregunta se va la gente: **Explorar → Exploración de embudo**, con los pasos `plan_start` → `plan_step` con `step_name` igual a cada pregunta → `plan_generated`.

Nota: los avisos solo llegan a Analytics si el visitante ha aceptado las cookies de analítica, como el resto de la medición del sitio.

## 6. Variables de entorno

- `RESEND_API_KEY` (ya existe): activa «Envíamelo por correo». Sin ella, el bloque no se muestra y las descargas siguen funcionando.
- `PIXABAY_API_KEY` (solo en local): la usa `scripts/blog-photos.mjs` para las dos fotos de carreras de obstáculos.
- **Se pueden borrar en Vercel**: todo lo que empiece por `STRIPE_` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## 7. Rendimiento y revisión (11-11-2026)

Medido en local con Edge, móvil de 390 px, CPU ×4 y red 4G lenta. Son medidas de laboratorio: los datos reales salen en PageSpeed una vez publicado.

| URL | LCP | CLS |
|---|---|---|
| `/plan-entrenamiento-hyrox` | 2,15 s | 0 |
| `/plan-entrenamiento-hyrox/principiantes` | 1,42 s | 0 |
| `/plan-entrenamiento-hyrox/12-semanas` | 1,45 s | 0 |
| `/plan-entrenamiento-hyrox/dobles` | 1,46 s | 0 |
| `/plan-entrenamiento-ocr` | 1,43 s | 0 |
| `/mi-plan?…` | 1,90 s | 0 |

El generador va dentro del HTML del servidor (pesa poco: no lleva el motor del plan ni las librerías de PDF y Excel, que solo corren en el servidor), así que no hizo falta cargarlo aparte.

Revisado con capturas a 390 × 844 y 1440 px, en claro y oscuro: sin desbordes horizontales ni errores de consola. El PDF se revisó abierto: portada, una semana por página y hoja final con los principios. En planes de 6 días y 90 minutos, alguna semana ocupa dos hojas.

Sin probar: el envío real de un correo (solo la validación), porque habría mandado un mensaje desde la cuenta de Resend.

## 8. Fotos del blog

Las portadas y fotos de los artículos salen de `lib/blog-photos.js`, que guarda para cada una la fuente, el autor y la licencia. Los archivos están en `public/blog/` y se regeneran con `node scripts/blog-photos.mjs`.

- **Dominio público**: fotos del ejército de EE. UU. de dos competiciones HYROX internas (Fort Myer, enero de 2026, y Vilseck, mayo de 2026). Son las que cubren casi todas las estaciones. Su uso no implica respaldo del ejército.
- **CC BY 4.0**: remo y zancadas en campeonatos HYROX (autor: HybridFitty). Obliga a citar autor y licencia: va en el pie de foto.
- **CC0**: meta de HYROX Estambul 2026.
- **Pixabay**: dos fotos de carreras de obstáculos para los artículos de OCR.

Unsplash, de donde venían las cuatro portadas anteriores, bloquea las búsquedas automáticas; Pixabay no tiene ninguna foto etiquetada como HYROX. Los artículos del Hyatlón y de HURBAX llevan fotos de competiciones HYROX: el texto alternativo dice lo que se ve y no las presenta como fotos de esas pruebas.
