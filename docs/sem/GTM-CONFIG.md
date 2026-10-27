# Medición en 3 minutos (GTM + GA4 + Search Console)

La web ya envía los eventos y ya pide permiso de cookies (Consent Mode v2). Solo falta cargar en GTM la configuración que está preparada en `docs/sem/gtm-container-import.json`.

> Comprobado el 27/10/2026: el contenedor **GTM-5D5D2CH9** está publicado pero **vacío** (sin etiquetas ni ID de GA4). Por eso el archivo trae también la etiqueta de Google.

## Antes: tu ID de GA4 (30 segundos)

1. [analytics.google.com](https://analytics.google.com) → **Administrar** (rueda, abajo a la izquierda) → **Flujos de datos** → el flujo de hybridracehub.com.
2. Copia el **ID de medición** (empieza por `G-`).
3. ¿No tienes propiedad? **Administrar → Crear → Propiedad** → nombre "Hybrid Race Hub", España, euro → **Web** → `https://hybridracehub.com`. Copia el `G-`.

## 1. Importar en Google Tag Manager (1,5 minutos)

1. [tagmanager.google.com](https://tagmanager.google.com) → contenedor **GTM-5D5D2CH9**.
2. **Administrar** (pestaña de arriba) → **Importar contenedor**.
3. **Seleccionar archivo** → `docs/sem/gtm-container-import.json`.
4. Espacio de trabajo: **Existente** → "Default Workspace".
5. Opción de importación: **Combinar** → **Cambiar el nombre de las etiquetas, activadores y variables conflictivos**.
6. **Confirmar**.
7. Menú **Variables** → abre **GA4 Measurement ID** → cambia `G-XXXXXXXXXX` por tu ID → **Guardar**.
8. Botón **Enviar** (arriba a la derecha) → nombre: "Medición GA4 10/2026" → **Publicar**.

Qué se ha importado: la etiqueta de Google (todas las páginas), 5 etiquetas de evento GA4 (`affiliate_click`, `race_outbound_click`, `contact_form_submit`, `search_used`, `region_view`) con sus parámetros, sus 5 activadores y las variables. Todas las etiquetas exigen consentimiento de analítica: si el visitante rechaza las cookies, no se envía nada que las use.

## 2. Marcar las conversiones en GA4 (1 minuto, al día siguiente)

Los eventos aparecen en GA4 cuando alguien los hace, así que espera unas horas o un día.

1. GA4 → **Administrar** → **Eventos clave** → **Nuevo evento clave**.
2. Escribe `affiliate_click` → **Guardar**.
3. Repite con `race_outbound_click` y `contact_form_submit`.

## 3. Sitemap en Search Console (30 segundos)

1. [search.google.com/search-console](https://search.google.com/search-console) → propiedad hybridracehub.com.
2. **Sitemaps** → escribe `sitemap.xml` → **Enviar**.

---

### Si quieres comprobarlo

- En GTM, **Vista previa** → `https://hybridracehub.com` → acepta las cookies en el aviso → entra en `/productos/relojes` y pulsa "Ver precio en Amazon": en Tag Assistant debe aparecer `affiliate_click` con la etiqueta "GA4 - affiliate_click" disparada.
- En el proyecto: `node scripts/check-tracking.mjs` (eventos) y `node scripts/check-consent.mjs` (aviso de cookies).
- Para regenerar el archivo con tu ID ya puesto: `node scripts/gtm-build-container.mjs G-TUID`.

### Google Ads (cuando vayas a lanzar campañas)

GA4 → **Administrar → Vinculaciones de productos → Google Ads → Vincular**. Después, en Google Ads: **Objetivos → Conversiones → Crear acción → Importar → Google Analytics 4 → Web** y marca `affiliate_click` y `race_outbound_click`. El plan completo está en `docs/sem/PLAN-GOOGLE-ADS.md`.
