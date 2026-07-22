/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tse1.mm.bing.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.weserv.nl" },
    ],
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
