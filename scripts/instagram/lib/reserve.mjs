// Aviso por email (Resend) cuando quedan pocas publicaciones estáticas sin publicar.

export function reservePrompt(n) {
  return `Genera 30 posts nuevos para el Instagram de Hybrid Race Hub (@hybridracehub_spain), uno por archivo JSON en instagram/posts/, continuando la numeración (quedan ${n} sin publicar).

Esquema de cada archivo (instagram/posts/NNN-slug.json):
{
  "id": "NNN-slug",
  "pilar": "estaciones|entrenamiento|errores|ocr|nutricion|producto|comunidad",
  "slides": [
    {"tipo":"portada","titulo":"...","subtitulo":"..."},
    {"tipo":"punto","numero":"01","titulo":"...","texto":"..."},
    {"tipo":"cita","texto":"...","autor":"opcional"},
    {"tipo":"cta","titulo":"Guárdalo para tu próximo entreno","texto":"Más guías en hybridracehub.com · enlace en la bio"}
  ],
  "alt_text": ["una descripción por slide"],
  "caption": "...",
  "hashtags": ["#hyrox","#hyroxspain","#carrerashibridas"],
  "url_destino": "/ruta-real-de-la-web (opcional)"
}

Reglas:
- Carruseles de 5 a 8 slides; la primera es portada y la última cta. portada.titulo ≤ 60 caracteres, punto.texto ≤ 260.
- Como mucho una palabra destacada por slide, marcada con *asteriscos*. Sin emojis en las slides.
- Reparto aproximado: estaciones 6, entrenamiento 6, errores/mitos 5, ocr 5, nutrición/recuperación 4, producto 2, comunidad 2.
- Español de España, de atleta a atleta, tuteo, frases cortas y directas.
- Prohibido: "descubre", "sumérgete", "desbloquea", "en el apasionante mundo", "la clave del éxito", "¡Vamos allá!", guiones largos (—) y listas de emojis. Máximo 2 emojis por caption.
- Solo hechos verificables y ampliamente aceptados. Nada de estadísticas, estudios, récords, fechas ni citas atribuidas inventadas. Formato Hyrox: 8 x 1 km de carrera + SkiErg 1000 m, Sled Push 50 m, Sled Pull 50 m, Burpee Broad Jumps 80 m, Remo 1000 m, Farmers Carry 200 m, Sandbag Lunges 100 m, Wall Balls 100 repeticiones. Pesos: "según categoría", sin cifras.
- Nada de anécdotas inventadas en primera persona; usa situaciones típicas reconocibles.
- Caption (máx. 2000 caracteres con hashtags): línea 1 con gancho (< 125 caracteres), 3-6 líneas de valor, una pregunta a la comunidad y "Más en hybridracehub.com (enlace en la bio)". 3-5 hashtags mezclando nicho y generales.
- Los posts de producto terminan con: "Como afiliado de Amazon, gano con las compras que cumplen los requisitos."
- No repitas temas de los posts que ya existen. Usa rutas reales de la web en url_destino.
- Al terminar, ejecuta npm run ig:validate y npm run ig:preview, revisa las imágenes y haz commit.`;
}

export async function sendReserveEmail(n, apiKey) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Hybrid Race Hub <hola@hybridracehub.com>",
      to: ["hola@hybridracehub.com"],
      subject: `Instagram: quedan ${n} publicaciones`,
      text: `Quedan ${n} publicaciones estáticas sin publicar en Instagram.\n\nPega este texto en Claude Code dentro del repo para generar 30 más:\n\n----\n${reservePrompt(n)}\n----\n`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
