# Plan de Google Ads — Hybrid Race Hub (octubre 2026)

Presupuesto: **150-200 €/mes**, solo **España**, idioma **español**, solo red de **Búsqueda** (sin Display ni Partners de búsqueda).
Archivo para importar: `docs/sem/google-ads-editor.csv` (lo genera y valida `node scripts/sem-build-csv.mjs`).

## Regla número uno: no gastar antes de medir

No actives ninguna campaña hasta que:
1. GTM, GA4 y la importación de conversiones estén hechos según `docs/sem/GTM-CONFIG.md`, y veas `affiliate_click` y `race_outbound_click` llegando a Google Ads (columna "Conversiones").
2. Tengas el banner de consentimiento (Consent Mode v2) funcionando.

Por eso todas las campañas del CSV se importan **en pausa**.

## Objetivo

Llevar tráfico cualificado a las páginas que ya convierten (calendario, regiones y centros) para generar clics a inscripciones (`race_outbound_click`) y a Amazon (`affiliate_click`), y aprender qué búsquedas funcionan antes de que el SEO las posicione. No es una campaña de marca: el volumen de búsqueda del sector es pequeño y el CPC, bajo.

## Estructura

| Campaña | Grupos de anuncios | Landing | Presupuesto diario (reparto 60/40) | Solo Google |
|---|---|---|---|---|
| 1. Calendario genérico | Carreras híbridas · Hybrid race · Competiciones 2027 | `/` y `/calendario` | 2,00 € | 3,00 € |
| 2. Regional | Madrid · Andalucía · Cataluña · Galicia | `/carreras-hibridas/<zona>` | 1,20 € | 1,80 € |
| 3. Centros por ciudad | Madrid, Barcelona, Valencia, Sevilla, Pozuelo, Reus, Palma, Murcia, Alicante, Málaga, Zaragoza, Bilbao | `/centros-entrenamiento/<ciudad>` | 0,80 € | 1,20 € |
| **Total** | 19 grupos | | **4,00 €/día ≈ 122 €/mes** | **6,00 €/día ≈ 183 €/mes** |

- **Reparto 60/40**: con 200 €/mes en total, 120 € van a Google (columna "reparto 60/40", que es la que lleva el CSV) y 80 € a Meta (ver `PLAN-META-ADS.md`).
- **Solo Google**: si decides no hacer Meta, sube los presupuestos diarios a la última columna (≈183 €/mes).

## Pujas

- **Estrategia inicial: CPC manual** (CPC máximo en el CSV: 0,35 € en Calendario, 0,30 € en Regional y Centros). Con tan poco presupuesto y sin historial, las estrategias automáticas no tienen datos para aprender.
- Revisa a la semana: si un grupo no gasta nada, sube su CPC máximo de 0,05 en 0,05 € hasta 0,60 €. Si una palabra clave gasta sin conversiones tras unos 40 clics, páusala.
- **Cuando la cuenta acumule ~30 conversiones en 30 días**, cambia la campaña 1 a **"Maximizar conversiones"** y, más adelante, a "CPA objetivo".
- CPC orientativo en España para estas búsquedas: 0,15-0,50 €. Son búsquedas informativas de nicho con poca competencia; si ves CPC por encima de 0,80 €, algo está mal (concordancia demasiado amplia o términos de búsqueda irrelevantes).

## Palabras clave

Todas en **concordancia de frase y exacta** (cada keyword va dos veces en el CSV). Nada de concordancia amplia hasta tener conversiones.

- **Calendario genérico**: carreras híbridas / carreras hibridas / carrera híbrida / calendario carreras hibridas / carreras hibridas españa · hybrid race / hybrid races / hybrid race españa / hybrid race spain / que es hybrid race · carreras hibridas 2027 / carreras hibridas españa 2027 / competiciones hibridas (2027, españa).
- **Regional**: carreras hibridas + madrid, andalucia, sevilla, malaga, cataluña, barcelona, galicia · hybrid race + madrid, andalucia, malaga, barcelona, galicia, vigo · competiciones hibridas madrid/barcelona · hybrid day vigo.
  - *No* se puja por "hybrid race coruña": no hay ninguna carrera verificada en A Coruña y el anuncio llevaría a una página sin lo que se busca. Revísalo si aparece una prueba allí.
- **Centros**: donde entrenar hyrox [ciudad] / donde entrenar hyrox en [ciudad] / hyrox [ciudad] donde entrenar / gimnasio hyrox [ciudad] / box hyrox [ciudad] / entrenar hyrox [ciudad] / gimnasio ocr [ciudad]. Además "hyrox pozuelo" y "hyrox reus" (en Search Console esas búsquedas llegan a la página de centros). No se puja por "hyrox madrid" o "hyrox barcelona" a secas: quien busca eso quiere la carrera, no un gimnasio.

## Palabras clave negativas (en las 3 campañas)

crossfit cerca de mi · universidad · modalidad hibrida / modalidad híbrida · clases hibridas · educacion hibrida · curso / cursos · master · grado · oposiciones · coche hibrido / coche híbrido / coches hibridos · toyota · hibrido enchufable · bicicleta hibrida · trabajo hibrido · teletrabajo · entradas oficiales · reventa · resultados · clasificacion · ranking hyrox · gratis online · pdf · mexico · argentina · colombia · chile · peru · hybrid car · planta hibrida · semillas.

Revisa cada semana **Palabras clave → Términos de búsqueda** y añade como negativa todo lo que no tenga que ver.

## Anuncios (RSA)

Un anuncio adaptable por grupo, con **15 títulos (≤30 caracteres)** y **4 descripciones (≤90)**. Las longitudes las comprueba el script al generar el CSV. Ejemplo del grupo "Carreras híbridas":

- Títulos: Carreras híbridas en España · Calendario 2026-2027 · HYROX, DEKA, Spartan y OCR · Fechas y precios revisados · Enlace a la inscripción · Carreras híbridas 2027 · Elige fecha y ciudad · Calendario gratis · Hybrid Race Hub · Busca por comunidad · Más de 35 carreras · Tu próxima hybrid race · Competiciones híbridas · Guía para principiantes · Plan de entrenamiento gratis
- Descripciones: "Calendario de carreras híbridas en España: HYROX, DEKA, Spartan y OCR con fecha y precio." · "Fechas revisadas a diario y enlace directo a la inscripción oficial de cada carrera." · "Busca por comunidad y mes. Ya hay carreras con fecha en 2027. Sin registro y gratis." · "Guías para tu primera carrera, plan de entrenamiento gratis y centros donde entrenar."

Fija (anclar) en la posición 1 el título que contiene la búsqueda principal del grupo ("Carreras híbridas en España", "Carreras híbridas en Madrid", "Entrenar HYROX en Valencia"…).

> **Marcas de terceros**: "HYROX", "Spartan" o "DEKA" en el texto del anuncio pueden ser rechazados si el titular de la marca lo ha restringido en Google Ads. Si te rechazan un título por marca, sustitúyelo por "Carreras de fitness híbrido" o "Carreras de obstáculos". Pujar por esas palabras como keyword sí está permitido.
> "Más de 35 carreras" es correcto a 27/10/2026 (38 carreras futuras). Revísalo si el calendario baja de 35.

## Recursos (extensiones): añadir a mano a nivel de cuenta

Google Ads Editor no importa bien los recursos desde este CSV, así que créalos en **Recursos → + → Enlace de sitio / Texto destacado**:

**Enlaces de sitio** (texto ≤25, dos líneas de descripción ≤35):

| Texto | Descripción 1 | Descripción 2 | URL |
|---|---|---|---|
| Calendario completo | Todas las carreras con fecha | HYROX, DEKA, Spartan y OCR | `https://hybridracehub.com/calendario?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=calendario` |
| Guía de carreras híbridas | Formatos y diferencias | Guía para empezar | `https://hybridracehub.com/que-es-una-carrera-hibrida?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=guia` |
| Calendario HYROX 2027 | Sedes y fechas en España | Y alternativas con fecha | `https://hybridracehub.com/blog/calendario-hyrox-espana-2026-2027?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=hyrox` |
| Dónde entrenar | Boxes y gimnasios por ciudad | Con trineo, SkiErg y remo | `https://hybridracehub.com/centros-entrenamiento?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=centros` |
| Plan de entrenamiento | Gratis en Excel o PDF | Para HYROX, OCR o CrossFit | `https://hybridracehub.com/plan-entrenamiento?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=plan` |
| Zapatillas para HYROX | Ranking con pros y contras | Elegidas para el trineo | `https://hybridracehub.com/productos/zapatillas-hyrox?utm_source=google&utm_medium=cpc&utm_campaign=sitelink&utm_content=zapatillas` |

**Textos destacados** (≤25): Calendario gratuito · Fechas revisadas a diario · Inscripción oficial · Carreras ya en 2027 · Más de 400 centros · Sin registro · Guías para principiantes · Por comunidad autónoma.

## URLs finales y UTM

Cada anuncio lleva su URL final con UTM: `utm_source=google&utm_medium=cpc&utm_campaign=<calendario|regional|centros>&utm_content=<grupo>`. Los canonicals de la web ignoran los parámetros, así que no generan contenido duplicado. Activa además el **etiquetado automático** (gclid) en Configuración de la cuenta.

## Importar el CSV en Google Ads Editor

1. Descarga e instala [Google Ads Editor](https://ads.google.com/intl/es_es/home/tools/ads-editor/) y entra con tu cuenta.
2. **Cuenta → Obtener cambios recientes** para tener la cuenta al día.
3. **Cuenta → Importar → Desde archivo…** → elige `docs/sem/google-ads-editor.csv`.
4. Revisa la vista previa: deben aparecer 3 campañas (en pausa), 19 grupos, 250 palabras clave, 102 negativas y 19 anuncios. Pulsa **Finalizar y revisar cambios → Conservar**.
5. Si la columna "Location" no se aplica, abre cada campaña en Editor → **Segmentación por ubicación → Añadir España**. Comprueba también **Idioma: español** y **Redes: solo Búsqueda de Google**.
6. En cada campaña, **Opciones de ubicación → Presencia: personas que están o suelen estar en tus ubicaciones** (no "interés").
7. **Publicar**. Las campañas quedan en pausa hasta que las actives.

## Calendario de revisión

- **Semana 1**: términos de búsqueda diarios, negativas nuevas, comprobar que entran conversiones.
- **Semanas 2-4**: pausar keywords con >40 clics y 0 conversiones; mover presupuesto al grupo con mejor coste por conversión.
- **Mes 2**: si hay ~30 conversiones/mes, probar "Maximizar conversiones" en Calendario genérico.
- **Siempre**: si el CTR de un grupo baja del 3 %, reescribe los títulos; si la página de destino tiene rebote alto en móvil, revísala antes de seguir pagando.
