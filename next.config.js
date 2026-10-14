/** @type {import('next').NextConfig} */

// Dominio canónico (ver lib/site.js). La redirección 301 envía el otro host
// (con o sin www) al canónico. Hoy: canónico = hybridracehub.com porque
// www.hybridracehub.com no tiene DNS. Al poner NEXT_PUBLIC_SITE_URL=https://www.hybridracehub.com
// en Vercel, la regla pasa a ser hybridracehub.com -> https://www.hybridracehub.com/:path* (301).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hybridracehub.com").replace(/\/+$/, "");
const CANONICAL_HOST = new URL(SITE_URL).host;
const ALT_HOST = CANONICAL_HOST.startsWith("www.") ? CANONICAL_HOST.slice(4) : `www.${CANONICAL_HOST}`;

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.weserv.nl" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ALT_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",   value: "nosniff"                      },
          { key: "X-Frame-Options",           value: "SAMEORIGIN"                   },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        /* Explicitly allow indexing for all public content pages */
        source: "/(|calendario|blog|productos|centros-entrenamiento|calculadora-hyrox|plan-entrenamiento|race-hub|comunidad|contacto-organizadores)(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      {
        /* Stub / coming-soon pages — keep out of Google */
        source: "/(centros-deportivos|calculadora)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        /* API routes — never indexed */
        source: "/api/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
