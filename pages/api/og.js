// Imagen Open Graph de los artículos (1200×630). Se sirve como /og?title=…&cat=… (rewrite en next.config.js).
// Estilo editorial del rediseño 10/2026: fondo papel, titular en Archivo, un solo acento verde.
import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

const display = fetch(new URL("../../assets/fonts/Archivo-Expanded-ExtraBold.ttf", import.meta.url)).then(r => r.arrayBuffer());
const text = fetch(new URL("../../assets/fonts/SourceSans3-SemiBold.ttf", import.meta.url)).then(r => r.arrayBuffer());

const PAPER = "#F5F4F0", INK = "#14161A", INK2 = "#4A4F57", LINE = "#E2E0DA", ACCENT = "#1F5C46";

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Hybrid Race Hub").slice(0, 120);
  const cat = (searchParams.get("cat") || "Blog").slice(0, 30).toUpperCase();
  const size = title.length > 80 ? 60 : title.length > 50 ? 70 : 82;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: PAPER, padding: "64px 72px" }}>
        <div style={{ display: "flex", fontFamily: "Source Sans 3", fontSize: 26, color: ACCENT, letterSpacing: 1 }}>{cat}</div>
        <div style={{ display: "flex", fontFamily: "Archivo", fontSize: size, lineHeight: 1.06, color: INK, letterSpacing: -1, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${LINE}`, paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="44" height="44" viewBox="0 0 40 40"><rect x="8" y="7" width="7" height="24" fill={INK} /><rect x="25" y="7" width="7" height="24" fill={INK} /><rect x="15" y="16" width="10" height="5" fill={INK} /><rect x="8" y="34" width="24" height="3" fill={ACCENT} /></svg>
            <div style={{ fontFamily: "Archivo", fontSize: 32, color: INK }}>Hybrid Race Hub</div>
          </div>
          <div style={{ fontFamily: "Source Sans 3", fontSize: 26, color: INK2 }}>hybridracehub.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Archivo", data: await display, weight: 800, style: "normal" },
        { name: "Source Sans 3", data: await text, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    }
  );
}
