# Medición en 10 minutos (GTM + GA4 + píxel de Meta + Search Console)

La web ya envía los eventos y ya pide permiso de cookies (Consent Mode v2, todo denegado por defecto). Solo falta cargar en GTM la configuración preparada en `docs/sem/gtm-container-import.json`.

> Comprobado el 03/11/2026 (igual que el 27/10): el contenedor **GTM-5D5D2CH9** está publicado (versión 2) pero **vacío**: sin GA4, sin activadores de eventos y sin píxel. Mientras no se importe, no se mide nada.

## Antes: tu ID de GA4 (30 segundos)

1. [analytics.google.com](https://analytics.google.com) → **Administrar** (rueda, abajo a la izquierda) → **Flujos de datos** → el flujo de hybridracehub.com.
2. Copia el **ID de medición** (empieza por `G-`).
3. ¿No tienes propiedad? **Administrar → Crear → Propiedad** → nombre "Hybrid Race Hub", España, euro → **Web** → `https://hybridracehub.com`. Copia el `G-`.

## 1. Importar en Google Tag Manager (2 minutos)

1. [tagmanager.google.com](https://tagmanager.google.com) → contenedor **GTM-5D5D2CH9**.
2. **Administrar** → **Importar contenedor** → **Seleccionar archivo** → `docs/sem/gtm-container-import.json`.
3. Espacio de trabajo: **Existente** → "Default Workspace". Opción: **Combinar** → **Cambiar el nombre de los conflictivos** → **Confirmar**.
4. **Variables** → **GA4 Measurement ID** → cambia `G-XXXXXXXXXX` por tu ID → **Guardar**.
5. Píxel de Meta: si todavía no lo tienes, **deja la variable "Meta Pixel ID" como está** y pausa las 4 etiquetas "Meta Pixel - …" (clic derecho en cada una → Pausar). Si ya lo tienes: **Variables → Meta Pixel ID** → pon el ID numérico → **Guardar**.
6. **Enviar** → nombre: "Medición 11/2026" → **Publicar**.

Qué se importa (11 etiquetas, 6 activadores, 13 variables):

| Etiqueta | Se dispara con | Consentimiento que exige |
|---|---|---|
| Etiqueta de Google - GA4 | Todas las páginas | `analytics_storage` |
| GA4 - affiliate_click | clic en un enlace de Amazon | `analytics_storage` |
| GA4 - race_outbound_click | clic en «Inscribirme en la web oficial» de una ficha | `analytics_storage` |
| GA4 - contact_form_submit | envío del formulario de organizadores | `analytics_storage` |
| GA4 - center_outbound_click | clic en «Web» o «Llamar» de un centro (**nuevo**) | `analytics_storage` |
| GA4 - search_used / region_view | buscador y visita a una región | `analytics_storage` |
| Meta Pixel - base (PageView) | Todas las páginas | `ad_storage` y `ad_user_data` |
| Meta Pixel - contact_form_submit (Lead) / race_outbound_click / affiliate_click | los mismos eventos | `ad_storage` y `ad_user_data` |

El banner concede `ad_storage` solo si el visitante acepta «Publicidad». Si rechaza, el píxel no se carga ni manda nada.

## 2. Marcar las conversiones en GA4 (1 minuto, al día siguiente)

GA4 → **Administrar** → **Eventos clave** → **Nuevo evento clave** → `affiliate_click` → Guardar. Repite con `race_outbound_click`, `center_outbound_click` y `contact_form_submit`.

## 3. Sitemap en Search Console (30 segundos)

Search Console → **Sitemaps** → `sitemap.xml` → **Enviar** (ya tiene fichas, meses y hubs).

## Comprobarlo

- GTM **Vista previa** → `https://hybridracehub.com` → acepta las cookies → abre una ficha (p. ej. `/carreras/hyrox-madrid-2027`) y pulsa «Inscribirme en la web oficial»: en Tag Assistant debe saltar «GA4 - race_outbound_click».
- En el proyecto: `node scripts/check-tracking.mjs` y `node scripts/check-consent.mjs`.
- Regenerar con tus ID ya puestos: `node scripts/gtm-build-container.mjs G-TUID 123456789012345`.

## Google Ads (cuando se lancen campañas)

GA4 → **Administrar → Vinculaciones de productos → Google Ads → Vincular**. En Google Ads: **Objetivos → Conversiones → Crear acción → Importar → Google Analytics 4 → Web** y marca `race_outbound_click`, `center_outbound_click` y `affiliate_click`. Plan: `docs/sem/PLAN-SEM-NOV-2026.md`.
