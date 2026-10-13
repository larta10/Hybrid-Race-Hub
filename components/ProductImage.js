import { useState } from "react";
import Image from "next/image";

const CATEGORY_ICONS = {
  relojes: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="24" cy="24" r="16"/>
      <path d="M24 16v8l5 5"/>
      <line x1="24" y1="6" x2="24" y2="10"/>
      <line x1="24" y1="38" x2="24" y2="42"/>
      <line x1="6" y1="24" x2="10" y2="24"/>
      <line x1="38" y1="24" x2="42" y2="24"/>
    </svg>
  ),
  "zapatillas-trail": (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 30c2-4 5-7 9-8l8-2 8-2c3 0 6 1 9 3l2 3-2 2H8l-2-4z"/>
      <path d="M8 32l2 4h28l2-4"/>
    </svg>
  ),
  "zapatillas-hyrox": (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 30c2-4 5-7 9-8l8-2 8-2c3 0 6 1 9 3l2 3-2 2H8l-2-4z"/>
      <path d="M8 32l2 4h28l2-4"/>
    </svg>
  ),
  "zapatillas-crossfit": (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 30c2-4 5-7 9-8l8-2 8-2c3 0 6 1 9 3l2 3-2 2H8l-2-4z"/>
      <path d="M8 32l2 4h28l2-4"/>
    </svg>
  ),
  pulsometros: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M24 36S10 26 10 18a8 8 0 0114 0 8 8 0 0114 0c0 8-14 18-14 18z"/>
      <path d="M8 24h6l4-6 4 12 4-8 4 4h8"/>
    </svg>
  ),
  ropa: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M18 8l-10 8 4 4 2-2v22h20V18l2 2 4-4-10-8-6 4-6-4z"/>
    </svg>
  ),
};

export default function ProductImage({ src, name, category, width = 220, height = 220, className = "" }) {
  const [imgError, setImgError] = useState(false);
  const effectiveSrc = !imgError && src;

  if (effectiveSrc) {
    return (
      <Image
        src={effectiveSrc}
        alt={name || "Producto"}
        width={width}
        height={height}
        className={className}
        onError={() => setImgError(true)}
        style={{ objectFit: "contain" }}
      />
    );
  }

  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.relojes;

  return (
    <div className="product-ph" style={{
      width: "100%",
      height: height,
      background: "var(--surface)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: "1rem",
      borderRadius: 4,
    }}>
      {icon}
      <span style={{
        fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--text-muted)",
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: "90%",
      }}>
        {name}
      </span>
    </div>
  );
}
