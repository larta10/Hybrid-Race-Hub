import { Html, Head, Main, NextScript } from "next/document";
import { CONSENT_DEFAULT_SCRIPT } from "../lib/consent";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Consent Mode v2: todo denegado por defecto antes de que cargue GTM (se aplica la elección guardada si existe) */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        {/* Modo oscuro elegido por el usuario, antes del primer pintado (sin parpadeo) */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("hrh_theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;}}catch(e){}` }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Blog de Hybrid Race Hub" href="https://hybridracehub.com/rss.xml" />
        <meta name="theme-color" content="#F5F4F0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#121416" media="(prefers-color-scheme: dark)" />
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5D5D2CH9" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
