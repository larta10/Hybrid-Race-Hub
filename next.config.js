/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.weserv.nl" },
    ],
  },

  // Las antiguas páginas /calendario/<ciudad> pasan a /carreras-hibridas/<ciudad> (301).
  // Solo redirecciones de ruta: el dominio no se toca desde el código.
  async redirects() {
    return ["bilbao", "barcelona", "madrid", "valencia", "malaga", "sevilla", "zaragoza", "murcia"].map(slug => ({
      source: `/calendario/${slug}`,
      destination: `/carreras-hibridas/${slug}`,
      permanent: true,
    }));
  },

  // Imágenes Open Graph del blog: URL pública /og (fuera de /api, que está bloqueado en robots.txt)
  async rewrites() {
    return [{ source: "/og", destination: "/api/og" }];
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
