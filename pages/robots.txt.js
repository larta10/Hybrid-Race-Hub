import { SITE_URL } from "../lib/site";

// robots.txt dinámico: usa el dominio canónico de lib/site.js.
// Se permite explícitamente a los buscadores y asistentes con IA que citan fuentes.
const AGENTS = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Applebot"];
const DISALLOW = ["/api/", "/centros-deportivos", "/calculadora$"];

export function buildRobots() {
  const rules = DISALLOW.map(d => `Disallow: ${d}`).join("\n");
  const named = AGENTS.map(a => `User-agent: ${a}\nAllow: /\n${rules}`).join("\n\n");
  return `# Hybrid Race Hub — robots.txt
# Carreras híbridas en España: calendario HYROX, OCR y funcional

User-agent: *
Allow: /
${rules}

${named}

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export default function Robots() {
  return null;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(buildRobots());
  res.end();
  return { props: {} };
}
