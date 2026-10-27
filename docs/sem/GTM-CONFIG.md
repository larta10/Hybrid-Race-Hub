# Configurar la medición en Google Tag Manager, GA4 y Google Ads

Guía paso a paso para dejar midiendo las conversiones de hybridracehub.com. No hace falta tocar código: la web ya envía los eventos a Google Tag Manager (contenedor **GTM-5D5D2CH9**). Solo hay que decirle a GTM qué hacer con ellos.

Tiempo estimado: 45-60 minutos la primera vez.

---

## 0. Qué envía la web (ya funciona, comprobado el 27/10/2026)

| Evento | Cuándo se dispara | Datos que lleva |
|---|---|---|
| `affiliate_click` | Clic en cualquier enlace de Amazon (rankings, artículos, comunidad) | `product` (nombre del producto), `ranking` (relojes, zapatillas-hyrox… o "articulo"), `position` (puesto en el ranking) |
| `race_outbound_click` | Clic en "Web oficial" o "Inscribirme" de una carrera | `race_name`, `region` (comunidad autónoma) |
| `contact_form_submit` | Envío correcto del formulario de organizadores o del de la home | `form` ("organizadores" o "home") |
| `search_used` | Alguien busca en el calendario o en el directorio de centros (se envía al dejar de escribir) | `term`, `search_location` ("calendario" o "centros") |
| `region_view` | Visita a una página de región (`/carreras-hibridas/...`) o de centros por ciudad | `region` (p. ej. "madrid" o "centros:valencia") |

Todos llevan además `page_path` (la página donde ocurrió).

> Eventos antiguos que siguen existiendo: `amazon_click`, `organizer_click`, `search`, `city_page_view`, `ics_download`, `whatsapp_share`, `calendar_filter`. Puedes dejarlos, pero **no marques `amazon_click` ni `organizer_click` como conversión**: miden lo mismo que `affiliate_click` y `race_outbound_click` y contarías dos veces.

Puedes comprobarlo tú mismo en cualquier momento: en el proyecto, con la web arrancada, `node scripts/check-tracking.mjs`.

---

## 1. Antes de empezar: el ID de GA4

1. Entra en [analytics.google.com](https://analytics.google.com) → **Administrar** (rueda abajo a la izquierda) → **Flujos de datos** → el flujo de hybridracehub.com.
2. Copia el **ID de medición**: empieza por `G-` (por ejemplo `G-AB12CD34EF`).
3. Si no tienes propiedad de GA4, créala: **Administrar → Crear → Propiedad**, zona horaria España, moneda euro, y después **Flujo de datos → Web** con `https://hybridracehub.com`.

---

## 2. GTM: la etiqueta base de Google (si no existe ya)

1. Entra en [tagmanager.google.com](https://tagmanager.google.com) → contenedor **GTM-5D5D2CH9**.
2. **Etiquetas**: mira si ya hay una de tipo **"Etiqueta de Google"** (o "Configuración de GA4") con tu `G-...`. Si existe, salta al paso 3.
3. Si no existe: **Nueva → Configuración de la etiqueta → Etiqueta de Google**. ID de etiqueta: tu `G-...`. **Activación → Initialization - All Pages**. Nombre: `GA4 - Base`. Guardar.

---

## 3. GTM: variables (una vez)

**Variables → Variables definidas por el usuario → Nueva → Configuración de la variable → Variable de capa de datos.** Crea estas 8, cada una con el nombre exacto en "Nombre de la variable de capa de datos" y versión 2:

| Nombre de la variable en GTM | Nombre en la capa de datos |
|---|---|
| `DLV - product` | `product` |
| `DLV - ranking` | `ranking` |
| `DLV - position` | `position` |
| `DLV - race_name` | `race_name` |
| `DLV - region` | `region` |
| `DLV - term` | `term` |
| `DLV - search_location` | `search_location` |
| `DLV - form` | `form` |

---

## 4. GTM: activadores (uno por evento)

**Activadores → Nuevo → Configuración del activador → Evento personalizado.**

| Nombre del activador | Nombre del evento (exacto) |
|---|---|
| `CE - affiliate_click` | `affiliate_click` |
| `CE - race_outbound_click` | `race_outbound_click` |
| `CE - contact_form_submit` | `contact_form_submit` |
| `CE - search_used` | `search_used` |
| `CE - region_view` | `region_view` |

Deja marcado "Todos los eventos personalizados".

> Si en el pasado creaste activadores de tipo **"Clic - Solo enlaces"** para Amazon o para las webs de los organizadores, **bórralos o páusalos**: ahora la web envía el evento y contarías doble.

---

## 5. GTM: etiquetas de evento de GA4

**Etiquetas → Nueva → Evento de Google Analytics: GA4.** Crea 5 etiquetas:

| Etiqueta | Nombre del evento | Parámetros del evento (nombre → valor) | Activador |
|---|---|---|---|
| `GA4 - affiliate_click` | `affiliate_click` | `product` → `{{DLV - product}}`, `ranking` → `{{DLV - ranking}}`, `position` → `{{DLV - position}}` | `CE - affiliate_click` |
| `GA4 - race_outbound_click` | `race_outbound_click` | `race_name` → `{{DLV - race_name}}`, `region` → `{{DLV - region}}` | `CE - race_outbound_click` |
| `GA4 - contact_form_submit` | `contact_form_submit` | `form` → `{{DLV - form}}` | `CE - contact_form_submit` |
| `GA4 - search_used` | `search_used` | `term` → `{{DLV - term}}`, `search_location` → `{{DLV - search_location}}` | `CE - search_used` |
| `GA4 - region_view` | `region_view` | `region` → `{{DLV - region}}` | `CE - region_view` |

En "ID de medición" pon tu `G-...` (o elige la etiqueta `GA4 - Base` si te lo ofrece).

---

## 6. Probar antes de publicar

1. En GTM, botón **Vista previa** (arriba a la derecha) → escribe `https://hybridracehub.com` → **Connect**.
2. En la pestaña que se abre:
   - entra en `/productos/relojes` y pulsa "Ver precio en Amazon" → en Tag Assistant debe aparecer `affiliate_click` con la etiqueta `GA4 - affiliate_click` en "Tags Fired";
   - entra en `/carreras-hibridas/madrid` → debe salir `region_view`; pulsa "Web oficial" en una carrera → `race_outbound_click`;
   - busca algo en `/calendario` → a los 2 segundos, `search_used`.
3. En GA4: **Administrar → DebugView** verás los mismos eventos en directo.
4. Si todo cuadra: **Enviar → Nombre de la versión: "Eventos de conversión 10/2026" → Publicar**.

---

## 7. GA4: dimensiones personalizadas y eventos clave

Espera unas horas a que lleguen eventos reales (los eventos aparecen en GA4 tras 24-48 h).

1. **Administrar → Definiciones personalizadas → Crear dimensión personalizada**, ámbito **Evento**, una por parámetro: `product`, `ranking`, `race_name`, `region`, `term`, `search_location`, `form`. Para `position` crea una **métrica personalizada** (unidad: estándar).
2. **Administrar → Eventos** (o **Eventos clave**): busca `affiliate_click` y `race_outbound_click` y activa **"Marcar como evento clave"**. Haz lo mismo con `contact_form_submit`.
3. No marques `search_used` ni `region_view`: son útiles para analizar, no son conversiones.

---

## 8. Google Ads: importar las conversiones

1. **Vincular GA4 con Google Ads**: en GA4, **Administrar → Vinculaciones de productos → Google Ads → Vincular**, elige la cuenta de Ads y activa "Habilitar publicidad personalizada" solo si tienes banner de consentimiento (ver aviso abajo).
2. En Google Ads: **Objetivos → Conversiones → Resumen → + Crear acción de conversión → Importar → Propiedades de Google Analytics 4 → Web**.
3. Marca `affiliate_click`, `race_outbound_click` y `contact_form_submit` → **Importar y continuar**.
4. Edita cada una:
   - `affiliate_click`: categoría "Clic de salida", **acción principal**, valor fijo 0,30 € (estimación de lo que vale un clic a Amazon; ajústalo con tus comisiones reales), recuento "Una".
   - `race_outbound_click`: categoría "Clic de salida", **acción principal**, valor 0,20 €, recuento "Una".
   - `contact_form_submit`: categoría "Enviar formulario de contacto", **acción secundaria** (son pocos y no deben guiar las pujas al principio), valor 5 €.
5. Las conversiones importadas tardan hasta 24 h en aparecer y unos días en tener datos.

---

## Aviso importante: cookies y consentimiento

El pie y el aviso de cookies de la web dicen hoy que **solo se usan cookies técnicas**. Si GA4 ya mide a través de GTM, o en cuanto lo haga junto con Google Ads, eso no es cierto, y en España (LSSI y RGPD) hace falta **consentimiento previo** para cookies de analítica y publicidad.

Antes de lanzar campañas:
1. Instala una plataforma de consentimiento (CMP) certificada por Google (por ejemplo Cookiebot, CookieYes o Complianz) desde GTM, con **Consent Mode v2**.
2. Actualiza el texto del aviso de cookies y de la política de privacidad.

Sin esto, Google Ads puede limitar la medición en el EEE y la web quedaría expuesta a una reclamación ante la AEPD. Este cambio no se ha hecho en código porque afecta a textos legales y a la configuración de tu cuenta: decide tú la herramienta.
