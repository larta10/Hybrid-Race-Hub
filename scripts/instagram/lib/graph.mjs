// Cliente mínimo de la Graph API con reintentos para errores transitorios.
import { GRAPH } from "./config.mjs";

export class GraphError extends Error {
  constructor(message, { status, code, transient } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.transient = transient;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Códigos de error de Meta que indican fallo temporal o límite de uso
const TRANSIENT_CODES = new Set([1, 2, 4, 17, 32, 341, 613, 9004, 2207001, 2207003]);

async function once(method, pathname, params, token) {
  const url = new URL(GRAPH + pathname);
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null) continue;
    (method === "GET" ? url.searchParams : body).set(k, String(v));
  }
  (method === "GET" ? url.searchParams : body).set("access_token", token);

  let res;
  try {
    res = await fetch(url, method === "GET" ? {} : { method, body });
  } catch (e) {
    throw new GraphError(`Red: ${e.message}`, { transient: true });
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const err = json.error || {};
    const transient = res.status >= 500 || res.status === 429 || err.is_transient === true || TRANSIENT_CODES.has(err.code);
    // El mensaje de Meta nunca contiene el token: se puede registrar tal cual
    throw new GraphError(`${res.status} ${err.type || ""} (${err.code ?? "?"}/${err.error_subcode ?? "-"}): ${err.error_user_msg || err.message || "error desconocido"}`, {
      status: res.status,
      code: err.code,
      transient,
    });
  }
  return json;
}

/** 3 reintentos con espera progresiva (5 s, 15 s, 30 s) solo ante errores transitorios */
export async function graph(method, pathname, params, token, { retries = 3 } = {}) {
  const waits = [5000, 15000, 30000];
  for (let attempt = 0; ; attempt++) {
    try {
      return await once(method, pathname, params, token);
    } catch (e) {
      if (!(e instanceof GraphError) || !e.transient || attempt >= retries) throw e;
      console.warn(`  Error transitorio (${e.message}). Reintento ${attempt + 1}/${retries} en ${waits[attempt] / 1000} s`);
      await sleep(waits[attempt]);
    }
  }
}
