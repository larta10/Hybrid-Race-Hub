// ESLint 9 (config plana). `next lint` de Next 14 no es compatible con ESLint 9,
// así que `npm run lint` llama a eslint directamente con las reglas de Next (core web vitals).
import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    rules: {
      // El sitio usa <a> para los enlaces internos en todas las páginas (navegación completa,
      // HTML idéntico para buscadores). Migrar a <Link> es un cambio aparte: se deja como aviso.
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
  { ignores: [".next/**", "node_modules/**", "backups/**", "pr/**", "public/**", "audit-screenshots/**", "qa-screenshots/**"] },
];

export default config;
