/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Las antiguas páginas /calendario/<ciudad> pasan a /carreras-hibridas/<ciudad> (301).
  // Solo redirecciones de ruta: el dominio no se toca desde el código.
  async redirects() {
    return [
      ...["bilbao", "barcelona", "madrid", "valencia", "malaga", "sevilla", "zaragoza", "murcia"].map(slug => ({
        source: `/calendario/${slug}`,
        destination: `/carreras-hibridas/${slug}`,
        permanent: true,
      })),
      // El generador de planes se mudó a la página pilar (11/2026). 301 para no perder los enlaces ni el tráfico.
      { source: "/plan-entrenamiento", destination: "/plan-entrenamiento-hyrox", statusCode: 301 },
    ];
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
      // Landings del plan abiertas con respuestas en la URL (desde el calendario o "Cambiar respuestas"):
      // noindex; el canonical de la página ya apunta a la landing limpia.
      ...["/plan-entrenamiento-hyrox", "/plan-entrenamiento-hyrox/:variante", "/plan-entrenamiento-ocr"].map(source => ({
        source,
        has: [{ type: "query", key: "prueba" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })),
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
