/**
 * Dominio canónico del sitio. Única fuente de verdad para canonicals, og:url,
 * sitemap, robots.txt y JSON-LD.
 *
 * Se configura con la variable de entorno NEXT_PUBLIC_SITE_URL (Vercel → Settings
 * → Environment Variables). Fallback: el dominio que hoy resuelve por DNS.
 * Cuando www.hybridracehub.com tenga registro DNS, poner
 * NEXT_PUBLIC_SITE_URL=https://www.hybridracehub.com y redesplegar: next.config.js
 * activa entonces la redirección 301 del dominio sin www hacia www.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hybridracehub.com").replace(/\/+$/, "");
export const SITE_NAME = "Hybrid Race Hub";
export const SITE_EMAIL = "hola@hybridracehub.com";
export const SITE_INSTAGRAM = "https://www.instagram.com/hybridracehub_spain";
