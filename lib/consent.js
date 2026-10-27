/**
 * Consentimiento de cookies (Consent Mode v2).
 * El valor por defecto (todo denegado) se fija en pages/_document.js antes de que cargue GTM.
 * Aquí se guarda la elección y se envía el "update" a Google.
 *
 * Elección guardada: { a: analítica, p: publicidad, v: versión, t: fecha ISO }
 * en localStorage ("hrh_consent") y en una cookie propia de 12 meses con el mismo nombre.
 */
export const CONSENT_KEY = "hrh_consent";
export const CONSENT_VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 365; // 12 meses
export const OPEN_EVENT = "hrh:open-consent";

export function readConsent() {
  if (typeof window === "undefined") return null;
  let raw = null;
  try { raw = localStorage.getItem(CONSENT_KEY); } catch {}
  if (!raw) {
    try {
      const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_KEY}=([^;]+)`));
      if (m) raw = decodeURIComponent(m[1]);
    } catch {}
  }
  if (!raw) return null;
  try {
    const c = JSON.parse(raw);
    return c && c.v === CONSENT_VERSION ? c : null;
  } catch { return null; }
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // Consent Mode necesita el objeto arguments, no un array
  window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
}

export function applyConsent(c) {
  if (typeof window === "undefined" || !c) return;
  const ads = c.p ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: c.a ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function saveConsent({ a, p }) {
  const c = { a: !!a, p: !!p, v: CONSENT_VERSION, t: new Date().toISOString() };
  const raw = JSON.stringify(c);
  try { localStorage.setItem(CONSENT_KEY, raw); } catch {}
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(raw)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {}
  applyConsent(c);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "consent_update", consent_analytics: c.a ? "granted" : "denied", consent_ads: c.p ? "granted" : "denied" });
  return c;
}

export function openConsentSettings() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Script en línea para <head>: valor por defecto + elección guardada, antes de GTM. */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{var r=null;try{r=localStorage.getItem('${CONSENT_KEY}')}catch(e){}
if(!r){var m=document.cookie.match(/(?:^|; )${CONSENT_KEY}=([^;]+)/);if(m)r=decodeURIComponent(m[1]);}
if(r){var c=JSON.parse(r);if(c&&c.v===${CONSENT_VERSION}){var s=c.p?'granted':'denied';gtag('consent','update',{analytics_storage:c.a?'granted':'denied',ad_storage:s,ad_user_data:s,ad_personalization:s});}}}catch(e){}`;
