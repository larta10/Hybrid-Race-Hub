import { useEffect } from "react";
import Script from "next/script";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import "../styles/global.css";

// Tipografía (rediseño 10/2026): Archivo variable con eje de anchura para titulares
// y Source Sans 3 para el texto. Solo se precargan estas dos, con métricas de reserva ajustadas (sin CLS).
// display "optional" (11/2026): con swap, el repintado al llegar la fuente ocurría después del JS y retrasaba el LCP
// móvil a más de 3 s; con optional la primera pintura es la definitiva. Al estar precargadas, casi siempre llegan a tiempo.
// Archivo: solo la instancia que se usa (anchura 112 %, peso 800, latín), 37 KB en vez de 88 KB de la variable completa
const display = localFont({ src: "../assets/fonts/archivo-112-800-latin.woff2", weight: "800", style: "normal", display: "optional", adjustFontFallback: "Arial", variable: "--ff-archivo" });
const body = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600"], display: "optional", adjustFontFallback: true });

const GTM_ID = "GTM-5D5D2CH9";
// El aviso de cookies no es crítico para el primer pintado: se carga aparte, solo en el navegador
const ConsentBanner = dynamic(() => import("../components/ConsentBanner"), { ssr: false });

export default function App({ Component, pageProps }) {
  const router = useRouter();
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
      {/* Idioma y país para todas las páginas (cada página pone el resto de metas Open Graph) */}
      <Head><meta property="og:locale" content="es_ES" key="og-locale" /></Head>
      <Component {...pageProps} />
      <ConsentBanner />
    </>
  );
}
