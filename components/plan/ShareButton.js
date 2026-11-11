/* Compartir el plan: hoja nativa del móvil (Web Share API) o copiar el enlace en escritorio. */
import { useState } from "react";
import { trackPlan } from "../../lib/track";

export default function ShareButton({ title, className = "btn-line" }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} · Hybrid Race Hub`, url });
        trackPlan("plan_share", { method: "web_share" });
      } catch { /* el usuario cerró la hoja de compartir */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      trackPlan("plan_share", { method: "copy_link" });
    } catch {
      window.prompt("Copia el enlace de tu plan:", url);
    }
  }
  return (
    <button type="button" className={className} onClick={share} aria-live="polite">
      {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}
