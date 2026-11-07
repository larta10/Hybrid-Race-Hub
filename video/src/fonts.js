// Barlow y Barlow Condensed desde public/fonts (copiadas de instagram/fonts por prepare-public.mjs)
import { continueRender, delayRender, staticFile } from "remotion";

const FUENTES = [
  ["Barlow Condensed", "BarlowCondensed-SemiBold.ttf", "600"],
  ["Barlow Condensed", "BarlowCondensed-Bold.ttf", "700"],
  ["Barlow Condensed", "BarlowCondensed-ExtraBold.ttf", "800"],
  ["Barlow", "Barlow-Regular.ttf", "400"],
  ["Barlow", "Barlow-Medium.ttf", "500"],
  ["Barlow", "Barlow-Medium.ttf", "600"],
];

let cargadas = false;
export function cargarFuentes() {
  if (cargadas || typeof document === "undefined") return;
  cargadas = true;
  const h = delayRender("Cargando fuentes Barlow");
  Promise.all(
    FUENTES.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight });
      return f.load().then((ff) => document.fonts.add(ff));
    }),
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error("No se pudieron cargar las fuentes", e);
      continueRender(h);
    });
}
