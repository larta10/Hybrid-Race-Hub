// Aviso por email (Resend) cuando quedan pocas publicaciones estáticas sin publicar.
// El texto remite a instagram/PROGRESO.md, donde están las reglas y la lista de posts pendientes.

export function reservePrompt(n) {
  return `Quedan ${n} posts sin publicar en el Instagram de Hybrid Race Hub (@hybridracehub_spain).

Abre instagram/PROGRESO.md en este repo y sigue sus "Instrucciones para la siguiente sesión": genera la siguiente tanda de carruseles científicos (7-10 slides con gráficas o ilustraciones, fuentes comprobadas en PubMed/doi.org con verificado=true y doi o pmid, caption con limitaciones y bloque "Fuentes:"), usando la lista de posts pendientes de ese archivo.

Antes de hacer commit: npm run ig:alt, npm run ig:validate (cero errores), npm run ig:sources (todas las fuentes en verde) y npm run ig:preview, y revisa las imágenes. Actualiza PROGRESO.md al terminar.`;
}

export async function sendReserveEmail(n, apiKey) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Hybrid Race Hub <hola@hybridracehub.com>",
      to: ["hola@hybridracehub.com"],
      subject: `Instagram: quedan ${n} publicaciones`,
      text: `Quedan ${n} publicaciones estáticas sin publicar en Instagram.\n\nPega este texto en Claude Code dentro del repo para generar la siguiente tanda:\n\n----\n${reservePrompt(n)}\n----\n`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
