# Rankings nuevos propuestos (sin publicar)

Fecha: 3 de noviembre de 2026. Amazon.es sí respondió a la verificación de fichas (`/dp/<ASIN>` con el título real del producto), pero **no se publica ningún ranking nuevo**: para ordenar productos y decir «para quién es» cada uno hace falta haberlos usado o tener una fuente fiable de cada modelo, y no queremos rellenar con valoraciones inventadas. Cada propuesta lleva el texto listo y los huecos marcados como `[ASIN]` y `[PRODUCTO]`.

Cómo publicar uno: (1) completa los huecos con productos que conozcas, (2) comprueba cada ASIN en `https://www.amazon.es/dp/<ASIN>` (debe abrir la ficha del mismo modelo), (3) añádelos a `data/products.js` con `asinDisponible: true` y crea la entrada en `lib/rankings.js` y en `lib/rankings-seo.js` siguiendo los seis que ya existen. Sin fotos de Amazon: la tarjeta ya funciona sin imagen.

ASIN comprobados hoy (abren la ficha correcta):

| Producto | ASIN | Título en Amazon.es (3/11/2026) |
|---|---|---|
| Unbroken Grips 2.0 | B072YJCWRT | Unbroken Grips 2.0 Calleras Agarres de Mano Protector de Manos Grips Cuero… |
| Mechanix Wear FastFit | B08CPC6ZLZ | Mechanix Wear - Guantes FastFit (X-Grande, Negro) |
| Inov-8 X-Talon 212 v2 | B0949LMWH8 | INOV8 X-Talon 212v2 Zapatilla De Correr para Tierra |
| Salomon Speedcross 6 (sin GTX) | B0CGJHZGPV | SALOMON Speedcross 6 Sneaker Male… |

---

## 1. Mejores guantes para HYROX y carreras de obstáculos 2026

Consulta que lo pide: «guantes para hyrox» (histórico de Search Console), «guantes ocr».
URL propuesta: `/productos/guantes`.

**Intro (≈100 palabras):** En HYROX los guantes son opcionales y mucha gente compite sin ellos. Donde más se nota la diferencia es en el sled pull, con la cuerda quemando las palmas, y en el farmers carry, si sudas mucho. En una OCR, en cambio, unos guantes finos con buen agarre pueden salvarte los monkey bars mojados y los arrastres por grava, aunque algunos obstáculos de agarre se hacen mejor a mano desnuda. Lo que miramos: que no resten tacto, que sequen rápido y que no se escurran al mojarse. Y para el box, calleras para dominadas y toes to bar.

**Criterios:** tacto y grosor · agarre en mojado · secado · ajuste en la muñeca · si permiten usar el reloj.

**Productos:**
1. Mechanix Wear FastFit · B08CPC6ZLZ ✓ · Para quién: [completar]
2. Unbroken Grips 2.0 (calleras) · B072YJCWRT ✓ · Para quién: [completar]
3. [PRODUCTO] · [ASIN] · guante de OCR con palma de silicona
4. [PRODUCTO] · [ASIN] · guante de entrenamiento con dedos cortados

**FAQ:** ¿Se pueden usar guantes en HYROX? (sí, el reglamento no los prohíbe; confírmalo en la normativa de la temporada) · ¿Guantes o magnesio para OCR? · ¿Calleras o guantes para el box?

## 2. Zapatillas para OCR con barro (sin membrana)

Consulta: «zapatillas ocr», «zapatillas para barro». Complementa a `/productos/zapatillas-trail`, que es de Gore-Tex. Antes de publicar, decidir si se amplía ese ranking (mejor para no canibalizar) o se crea uno nuevo.

**Intro:** En carreras con zanjas y ríos, la membrana impermeable juega en contra: el agua entra por el tobillo y no sale. Para esas pruebas buscamos taco profundo, malla que drene y poco peso mojado.

**Productos:** Inov-8 X-Talon 212 v2 · B0949LMWH8 ✓ · Salomon Speedcross 6 · B0CGJHZGPV ✓ · Inov-8 Mudclaw G 260 (ASIN en `data/products.js` marcado como no disponible: buscar el actual) · [PRODUCTO] · [ASIN].

## 3. Mejores chalecos lastrados para HYROX y OCR

Consulta: «chaleco lastrado hyrox». En `data/products.js` existe `chaleco-lastrado` sin ASIN.

**Intro:** El chaleco lastrado sirve para dos cosas: acostumbrar las piernas a correr cargadas y hacer burpees y zancadas con más peso del que tendrás el día de la carrera. No es imprescindible para una primera HYROX.

**Criterios:** peso fijo o ajustable · sujeción al correr (que no rebote) · ancho de hombros · lavable.
**Productos:** [PRODUCTO] · [ASIN] × 4 (uno de peso fijo ~5 kg, uno ajustable, uno de placas).

## 4. Material para entrenar HYROX en casa (para empezar)

Consulta: «hyrox material», «material hyrox». Ojo: ya existe el artículo `/blog/material-hyrox-carreras-obstaculos`, que es la página informativa. Este ranking sería solo de compra y debe enlazarse desde ese artículo, no competir con él (title con «comprar» / «kit para casa»).

**Productos (en `data/products.js`, todos sin ASIN):** balón medicinal para wall balls · kettlebell de 16 kg · cuerda de saltar · chaleco lastrado → `[ASIN]` en cada uno.
