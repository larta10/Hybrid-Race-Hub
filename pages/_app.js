import { useEffect } from "react";
import { trackAffiliateClick } from "../lib/track";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import "../styles/global.css";

// Tipografía (rediseño 10/2026): Archivo variable con eje de anchura para titulares
// y Source Sans 3 para el texto. Solo se precargan estas dos; display swap y métricas de reserva ajustadas (sin CLS).
// Archivo: solo la instancia que se usa (anchura 112 %, peso 800, latín), 37 KB en vez de 88 KB de la variable completa
const display = localFont({ src: "../assets/fonts/archivo-112-800-latin.woff2", weight: "800", style: "normal", display: "swap", adjustFontFallback: "Arial", variable: "--ff-archivo" });
const body = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600"], display: "swap", adjustFontFallback: true });

const GTM_ID = "GTM-5D5D2CH9";
// El aviso de cookies no es crítico para el primer pintado: se carga aparte, solo en el navegador
const ConsentBanner = dynamic(() => import("../components/ConsentBanner"), { ssr: false });

export default function App({ Component, pageProps }) {
  const router = useRouter();
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

  // Tablas escritas en JSX: mismo data-label que las del blog para apilarlas en móvil
  useEffect(() => {
    const label = () => document.querySelectorAll("table").forEach(t => {
      const heads = [...t.querySelectorAll("thead th")].map(th => th.textContent.trim());
      if (!heads.length) return;
      t.querySelectorAll("tbody tr").forEach(tr => [...tr.children].forEach((td, i) => { if (!td.dataset.label && heads[i]) td.dataset.label = heads[i]; }));
    });
    label();
    router.events.on("routeChangeComplete", label);
    return () => router.events.off("routeChangeComplete", label);
  }, [router.events]);

  return (
    <>
      <style jsx global>{`
        :root {
          --ff-display: ${display.style.fontFamily};
          --ff-body: ${body.style.fontFamily};
        }
      `}</style>
      {/* Google Tag Manager: después de que la página sea interactiva */}
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
      <Component {...pageProps} />
      <ConsentBanner />
    </>
  );
}
