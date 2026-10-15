// Imagen Open Graph de los artículos (1200×630). Se sirve como /og?title=…&cat=… (rewrite en next.config.js).
import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

const font = fetch(new URL("../../assets/fonts/BarlowCondensed-ExtraBold.ttf", import.meta.url)).then(r => r.arrayBuffer());

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Hybrid Race Hub").slice(0, 120);
  const cat = (searchParams.get("cat") || "Blog").slice(0, 30).toUpperCase();
  const size = title.length > 80 ? 64 : title.length > 50 ? 76 : 90;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B0B0C", padding: "64px 72px", fontFamily: "Barlow" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 12, height: 40, background: "#E10600" }} />
          <div style={{ fontSize: 32, color: "#9A9A9E", letterSpacing: 4 }}>{cat}</div>
        </div>
        <div style={{ display: "flex", fontSize: size, lineHeight: 1.02, color: "#F2F2F0", textTransform: "uppercase", letterSpacing: -1, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #26262A", paddingTop: 24 }}>
          <div style={{ fontSize: 34, color: "#F2F2F0", letterSpacing: 1 }}>HYBRID RACE HUB</div>
          <div style={{ fontSize: 28, color: "#9A9A9E" }}>hybridracehub.com/blog</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Barlow", data: await font, weight: 800, style: "normal" }],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    }
  );
}
