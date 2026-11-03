# Plan SEM — noviembre de 2026

Sustituye a `PLAN-GOOGLE-ADS.md` y `PLAN-META-ADS.md` (octubre). Presupuesto: 150–200 €/mes. Archivo para Google Ads Editor: `docs/sem/google-ads-editor.csv` (generado y validado con `node scripts/sem-build-csv.mjs`; **todas las campañas en pausa**).

## Principio: pagar solo donde el orgánico no llega

Search Console dice que la web ya está arriba para lo genérico («carreras híbridas», «hybrid race», «competiciones híbridas España»: top 3 orgánico). Pagar ahí es comprar clics que ya llegan gratis. **No se puja por esas consultas**, salvo una campaña de marca muy barata para que nadie compre nuestro nombre.

Donde el orgánico no llega:
- **Dónde entrenar**: «dónde entrenar hyrox en Madrid» estaba en posición 59. Las páginas de centros por ciudad son buenas, pero tardarán meses en subir.
- **Inscripciones de una carrera concreta**: las fichas (`/carreras/...`) son nuevas desde el 3/11; hasta que posicionen, el anuncio cubre «hyrox madrid 2027», «deka toledo 2027», etc.
- **Material**: los rankings no reciben tráfico orgánico. Sí se puede pagar un poco, ahora que tienen contenido de compra (criterios, comparativa, FAQ).

## Campañas

| Campaña | Destino | Palabras clave (ejemplos) | Presupuesto/día | CPC máx. orientativo |
|---|---|---|---|---|
| A · Dónde entrenar | `/centros-entrenamiento/<ciudad>` (8 ciudades) | dónde entrenar hyrox madrid, gimnasio hyrox barcelona, box ocr valencia | 5 € (semanas 2–3) → 3,50 € desde la semana 4 | 0,40 € |
| B · Inscripciones | ficha de la carrera (10 de 2027: HYROX Bilbao, Madrid y Málaga; DEKA Torremolinos, Toledo, Barcelona, Valencia, Ibiza y Vigo; Spartan Madrid) | inscripción hyrox madrid 2027, deka toledo 2027 | 1,50 € | 0,30 € |
| C · Material | `/productos/zapatillas-hyrox` y `/productos/zapatillas-trail` | mejores zapatillas hyrox, material hyrox, zapatillas ocr | 1 € | 0,35 € |
| Marca | home | hybrid race hub | 0,30 € | 0,15 € |

Total con todo activo: 6,30 €/día ≈ 190 €/mes.

Configuración común (Google Ads Editor importa campaña, grupos, palabras clave, anuncios y negativas; lo demás se marca a mano tras importar):
- **Ubicación: España**, y en **Configuración → Ubicaciones → Opciones de ubicación → «Presencia: personas que están o suelen estar en tus ubicaciones»** (no «Presencia o interés»). Así no pagamos clics de Latinoamérica, que no monetizan.
- Idioma español. Solo red de búsqueda (sin Display ni socios de búsqueda).
- Puja: CPC manual las 4 primeras semanas; con 30 conversiones en 30 días, pasar A a «Maximizar conversiones» con CPA objetivo.
- Concordancia de frase y exacta (nunca amplia al principio).
- Negativas en todas: universidad, modalidad híbrida, curso, coche/vehículo híbrido, híbrido enchufable, bicicleta híbrida, gratis, trabajo, empleo, teletrabajo, resultados, reventa y los países latinoamericanos (México, Argentina, Colombia, Chile, Perú, Venezuela, Ecuador, Uruguay, Bolivia, Paraguay, Costa Rica, Guatemala, República Dominicana, Panamá). Lista completa en el CSV (46).
- Anuncios RSA: 15 títulos ≤ 30 caracteres y 4 descripciones ≤ 90, validados por el script, con UTM (`utm_source=google&utm_medium=cpc&utm_campaign=<campaña>&utm_content=<grupo>`) en todas las URL finales.
- **Sin marcas de terceros en el texto de los anuncios** (HYROX, DEKA, Spartan, Hyatlón, HURBAX…): el script bloquea el CSV si aparece alguna. Las marcas solo van en palabras clave, que está permitido; si Google rechaza alguna por reclamación de la marca, se pausa esa palabra.

## Conversiones y cuánto se puede pagar por ellas

| Conversión | Qué vale para nosotros | CPA máximo razonable |
|---|---|---|
| `affiliate_click` (clic a Amazon) | Comisión media ~4 % de ~100 € = 4 € por venta; 1 de cada 10–15 clics compra → 0,25–0,40 € por clic | **0,40 €** |
| `race_outbound_click` (clic a la inscripción oficial) | No paga directamente; sirve para negociar con organizadores y para retargeting | **0,60 €** |
| `center_outbound_click` (web o teléfono de un centro) | Igual: valor de audiencia y argumento para fichas destacadas de centros | **0,50 €** |
| `contact_form_submit` (organizador) | El más valioso: posible acuerdo de difusión | 5 € |

## Criterios para cortar (revisión semanal)

- **Pausar un grupo de anuncios** si gasta más de **6 € en 14 días sin ninguna conversión**.
- **Pausar una palabra clave** con más de 40 impresiones y CTR < 1 %, o con CPC medio > 0,60 €.
- **Bajar puja un 20 %** si el CPA de 14 días supera en un 50 % el máximo de la tabla.
- **Cortar la campaña C** si en 30 días el coste por `affiliate_click` pasa de 0,40 € (los márgenes de Amazon no dan para más).
- Si una consulta empieza a salir en top 3 orgánico (Search Console), quitarla de la campaña de pago.

## Calendario

| Semana | Qué se hace |
|---|---|
| 1 (3–9 nov) | Medición: importar el contenedor (`GTM-CONFIG.md`), poner el ID de GA4, publicar, marcar eventos clave. Importar el CSV en Google Ads Editor **sin activar nada**. |
| 2 (10–16 nov) | Activar **solo la campaña A** a 5 €/día. Marcar «Presencia». Revisar el informe de términos de búsqueda a los 3 días y añadir negativas. |
| 3 (17–23 nov) | Seguir con A. Quitar palabras sin impresiones y añadir las variantes que aparezcan en términos de búsqueda. |
| 4 (24–30 nov) | Revisión: aplicar los criterios de corte. Si A cumple el CPA, bajarla a 3,50 € y activar B (1,50 €), C (1 €) y Marca (0,30 €). |

## Meta Ads

- **No antes de que el píxel lleve 2–3 semanas recogiendo datos con consentimiento** (solo dispara si el visitante acepta «Publicidad»). Con el tráfico actual, eso da un público de retargeting pequeño: empezar cuando tenga ≥ 1.000 personas.
- Solo dos usos: **retargeting** (visitantes de fichas y rankings de los últimos 30 días que no han hecho `race_outbound_click`) y **públicos similares** al 1 % en España a partir de quienes sí lo han hecho.
- Presupuesto: sale del mismo total. Si se activa, 2 €/día y se recorta de C.
- Formatos verticales 9:16 (Reels e Historias) y 4:5 para el feed, con texto grande y una sola idea. Sin marcas de terceros en el texto.

Cinco textos:
1. «¿Ya tienes carrera para la primavera? Fechas, sede y enlace a la inscripción oficial, todo en una ficha.»
2. «Carreras híbridas en Madrid este invierno: mira cuáles tienen la inscripción abierta.»
3. «Antes de pagar el dorsal, compara: precio, formato y dónde entrenar cerca de la carrera.»
4. «¿Tu box tiene trineo y SkiErg? Busca gimnasios para preparar tu carrera híbrida en tu ciudad.»
5. «Zapatillas para tu primera carrera híbrida: cuáles agarran en el trineo y aguantan los kilómetros.»

Piezas: (a) vídeo vertical de 8–10 s con tres fechas que pasan en pantalla y el texto 1; (b) carrusel 4:5 con las 4 próximas carreras de la zona; (c) imagen 9:16 del mapa de centros de una ciudad con el texto 4.
