/* Aviso de cookies propio. Aceptar, Rechazar y Configurar con el mismo peso visual (criterio AEPD). */
import { useEffect, useState } from "react";
import { readConsent, saveConsent, OPEN_EVENT } from "../lib/consent";

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [a, setA] = useState(false);
  const [p, setP] = useState(false);

  useEffect(() => {
    const c = readConsent();
    // Primera visita (o versión antigua del aviso): se muestra el banner
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!c) setOpen(true);
    else { setA(c.a); setP(c.p); }
    const reopen = () => {
      const cur = readConsent();
      setA(!!cur?.a); setP(!!cur?.p);
      setSettings(true); setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const choose = choice => { saveConsent(choice); setOpen(false); setSettings(false); };

  return (
    <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <div className="consent-inner">
        <p id="consent-title" className="consent-title">Cookies</p>
        <p className="consent-text">
          Usamos cookies técnicas y, si aceptas, de analítica (Google Analytics) y publicidad (Google Ads).
        </p>
        <p className="consent-text">
          Puedes cambiarlo cuando quieras en «Configurar cookies», al pie. <a href="/politica-cookies">Política de cookies</a>.
        </p>

        {settings && (
          <fieldset className="consent-options">
            <legend className="sr-only">Tipos de cookies</legend>
            <label className="consent-row">
              <input type="checkbox" checked disabled />
              <span><strong>Técnicas</strong> · Siempre activas. Guardan tu elección y hacen que la web funcione.</span>
            </label>
            <label className="consent-row">
              <input type="checkbox" checked={a} onChange={e => setA(e.target.checked)} />
              <span><strong>Analítica</strong> · Google Analytics 4: páginas vistas y clics, sin identificarte.</span>
            </label>
            <label className="consent-row">
              <input type="checkbox" checked={p} onChange={e => setP(e.target.checked)} />
              <span><strong>Publicidad</strong> · Google Ads: medir si un anuncio acaba en una visita útil.</span>
            </label>
          </fieldset>
        )}

        <div className="consent-actions">
          <button type="button" className="consent-btn" onClick={() => choose({ a: false, p: false })}>Rechazar</button>
          {settings
            ? <button type="button" className="consent-btn" onClick={() => choose({ a, p })}>Guardar selección</button>
            : <button type="button" className="consent-btn" onClick={() => setSettings(true)}>Configurar</button>}
          <button type="button" className="consent-btn" onClick={() => choose({ a: true, p: true })}>Aceptar</button>
        </div>
      </div>
    </div>
  );
}
