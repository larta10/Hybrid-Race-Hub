// Configuración común de los scripts de Instagram.
// En local se carga .env.local; en GitHub Actions las variables llegan como secretos.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const ENV_LOCAL = path.join(ROOT, ".env.local");
export const POSTS_DIR = path.join(ROOT, "instagram/posts");
export const FONTS_DIR = path.join(ROOT, "instagram/fonts");
export const PREVIEW_DIR = path.join(ROOT, "instagram-preview");

if (existsSync(ENV_LOCAL)) dotenv.config({ path: ENV_LOCAL, quiet: true });

// Última versión estable de la Graph API (changelog de Meta, noviembre 2026)
export const API_VERSION = process.env.IG_API_VERSION || "v27.0";
export const GRAPH = `https://graph.facebook.com/${API_VERSION}`;

export const SITE = "hybridracehub.com";
export const IG_USERNAME = "hybridracehub_spain";
export const STORAGE_BUCKET = "instagram";

export function env(name, { required = true } = {}) {
  const v = process.env[name];
  if (required && !v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export function supabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
}

/** Solo los 6 primeros caracteres: los secretos nunca se imprimen enteros */
export const mask = (s) => (s ? `${String(s).slice(0, 6)}…` : "(vacío)");

/** Escribe o reemplaza una variable en .env.local sin tocar el resto */
export function setEnvLocal(name, value) {
  const lines = existsSync(ENV_LOCAL) ? readFileSync(ENV_LOCAL, "utf8").split(/\r?\n/) : [];
  const i = lines.findIndex((l) => l.startsWith(`${name}=`));
  if (i >= 0) lines[i] = `${name}=${value}`;
  else {
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    lines.push(`${name}=${value}`);
  }
  writeFileSync(ENV_LOCAL, lines.join("\n") + "\n");
}
