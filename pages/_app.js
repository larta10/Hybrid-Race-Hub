import { useEffect } from "react";
import { trackAffiliateClick } from "../lib/track";
import Script from "next/script";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "../styles/global.css";

// Fuentes autoalojadas con next/font: se precargan, no bloquean y la fuente de
// reserva se ajusta a las métricas de la final (evita saltos de diseño / CLS).
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["700", "800"], display: "swap", adjustFontFallback: true, preload: false });
// Inter es variable: un solo archivo cubre todos los pesos
const body = Inter({ subsets: ["latin"], display: "swap", preload: false });
// La mono solo se usa en etiquetas pequeñas: no se precarga para no retrasar el primer pintado
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false });

const GTM_ID = "GTM-5D5D2CH9";

export default function App({ Component, pageProps }) {
  // amazon_click: un único listener delegado cubre rankings, artículos y comunidad
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || !/(^|\.)amazon\.[a-z.]+\//i.test(a.href.replace(/^https?:\/\//, ""))) return;
      // Los enlaces de AffiliateLink / renderAffiliateHtml traen producto, categoría y posición en data-aff-*
      const card = a.closest("li, .product-row, .product-card, article");
      const name = a.dataset.affName || card?.querySelector(".product-name, h2, h3")?.textContent?.trim() || a.textContent.trim();
      const all = [...document.querySelectorAll("a[data-aff]")];
      const position = Number(a.dataset.affPos) || (all.indexOf(a) + 1) || undefined;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "amazon_click",
        product_name: name.slice(0, 100),
        product_id: a.dataset.aff || undefined,
        product_category: a.dataset.affCat || undefined,
        position,
        link_url: a.href,
        page_path: window.location.pathname,
      });
      // Conversión principal (ver docs/sem/GTM-CONFIG.md)
      const rankingFromPath = (window.location.pathname.match(/^\/productos\/([^/]+)/) || [])[1];
      trackAffiliateClick({ product: name, ranking: rankingFromPath || a.dataset.affCat || "articulo", position });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --ff-display: ${display.style.fontFamily};
          --ff-body: ${body.style.fontFamily};
          --ff-mono: ${mono.style.fontFamily};
        }
      `}</style>
      {/* Google Tag Manager: después de que la página sea interactiva */}
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
      <Component {...pageProps} />
    </>
  );
}
