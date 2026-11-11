/* Descargas del plan (PDF y Excel, enlaces directos a /api) y envío opcional por correo. */
import { useState } from "react";
import { trackPlan } from "../../lib/track";
import s from "./plan.module.css";

export function DownloadLinks({ qs, prueba, solid = true }) {
  const hit = formato => () => trackPlan("plan_download", { formato, prueba });
  return (
    <>
      <a className={solid ? "btn-solid" : "btn-line"} href={`/api/plan-pdf?${qs}`} download rel="nofollow" onClick={hit("pdf")}>Descargar PDF</a>
      <a className="btn-line" href={`/api/plan-excel?${qs}`} download rel="nofollow" onClick={hit("excel")}>Descargar Excel</a>
    </>
  );
}

export function EmailPlan({ qs, prueba }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState({ status: "idle", msg: "" });
  async function send(e) {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    try {
      const r = await fetch("/api/plan-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, qs, website: trap }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "No se ha podido enviar.");
      trackPlan("plan_download", { formato: "email", prueba });
      setState({ status: "ok", msg: "Enviado. Mira también en la carpeta de correo no deseado." });
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  }
  return (
    <section aria-labelledby="plan-email">
      <h2 className={s.h2} id="plan-email">Envíamelo por correo</h2>
      <p className={s.p}>Te mandamos el PDF y el Excel una vez. No guardamos tu dirección ni te apuntamos a ninguna lista.</p>
      {state.status === "ok"
        ? <p className={s.ok} role="status">{state.msg}</p>
        : (
          <form className={s.mail} onSubmit={send}>
            <label className="sr-only" htmlFor="plan-email-input">Tu correo</label>
            <input id="plan-email-input" className={s.input} type="email" inputMode="email" autoComplete="email" required placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
            <input className={s.hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={e => setTrap(e.target.value)} />
            <button type="submit" className="btn-line" disabled={state.status === "sending"}>{state.status === "sending" ? "Enviando…" : "Enviar"}</button>
            {state.status === "error" && <p className={s.error} role="alert">{state.msg}</p>}
          </form>
        )}
    </section>
  );
}
