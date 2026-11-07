import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Fondo } from "./components/Fondo.jsx";
import { Gancho, TextoCinetico, FuenteChip, Marca } from "./components/Texto.jsx";
import { GraficaAnimada } from "./components/GraficaAnimada.jsx";
import { SenalarMusculo } from "./components/SenalarMusculo.jsx";
import { Conclusion, Aplicacion, TarjetaFinal } from "./components/Bloques.jsx";
import { Subtitulos } from "./components/Subtitulos.jsx";
import { buildTimeline, totalFrames, FPS } from "./timeline.js";
import { cargarFuentes } from "./fonts.js";
import { SAFE } from "./theme.js";

cargarFuentes();

const BASE_MUSICA = 0.55;
const BAJO_VOZ = BASE_MUSICA * Math.pow(10, -18 / 20); // unos -18 dB bajo la voz

/** Tramos con voz (se unen huecos de menos de 0,35 s) para el ducking de la música */
function tramosVoz(palabras = []) {
  const out = [];
  for (const p of palabras) {
    const last = out[out.length - 1];
    if (last && p.desde - last[1] < 0.35) last[1] = Math.max(last[1], p.hasta);
    else out.push([p.desde, p.hasta]);
  }
  return out;
}

/** Música: normalizada a -14 LUFS en origen; fundidos y, si hay voz, ducking automático */
export function Musica({ music, total, palabras }) {
  const tramos = React.useMemo(() => tramosVoz(palabras), [palabras]);
  if (!music?.file) return null;
  const rampa = 0.18;
  const nivel = (t) => {
    if (!tramos.length) return BASE_MUSICA;
    // Factor 0 (sin voz) → 1 (voz), con rampas suaves de 0,18 s en los bordes de cada tramo
    let f = 0;
    for (const [a, b] of tramos) {
      if (t >= a - rampa && t <= b + rampa) {
        f = Math.max(f, Math.min(1, (t - (a - rampa)) / rampa, (b + rampa - t) / rampa));
      }
    }
    return BASE_MUSICA + (BAJO_VOZ - BASE_MUSICA) * f;
  };
  return (
    <Audio
      src={staticFile(music.file)}
      startFrom={Math.round((music.inicio || 0) * FPS)}
      volume={(fr) => nivel(fr / FPS) * interpolate(fr, [0, 15, total - 36, total - 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  );
}

function Escena({ s, assets, reel, conVoz }) {
  const dur = s.hasta - s.desde;
  const e = s.escena;
  const src = assets?.clips?.[String(s.i)];
  // Los anillos solo se dibujan sobre el clip para el que se colocaron a mano
  const clave = e.clip?.fuente && e.clip?.id ? `${e.clip.fuente}-${e.clip.id}` : null;
  const musculos = (e.musculo || []).filter((m) => src && m.clip && m.clip === clave && typeof m.x === "number");
  return (
    <AbsoluteFill>
      <Fondo src={src} clipSeg={assets?.clipSeg?.[String(s.i)]} duracion={dur} semilla={s.i} oscuro={s.tipo === "grafica" ? 0.5 : 0.4} desenfoque={s.tipo === "grafica" ? 6 : 0} />
      {musculos.length > 0 && <SenalarMusculo musculos={musculos} ritmo={assets?.clipSeg?.[String(s.i)] ? Math.min(1, assets.clipSeg[String(s.i)] / (dur / 30)) : 1} />}
      {s.tipo === "gancho" && <Gancho texto={reel.gancho} duracion={dur} />}
      {s.tipo === "grafica" && <GraficaAnimada grafica={e.grafica} duracion={dur} />}
      {/* Con voz, los textos que repetirían la narración se quitan: quedan datos, gráficas y fuentes */}
      {!conVoz &&
        (s.items || []).map((it, k) => (
          <Sequence key={k} from={it.desde - s.desde} durationInFrames={it.hasta - it.desde} layout="none">
            <TextoCinetico texto={it.texto} duracion={it.hasta - it.desde} posicion={e.texto_posicion} />
          </Sequence>
        ))}
      {/* Con voz y sin metraje, la frase clave queda arriba como titular para que la escena no quede vacía */}
      {conVoz && !src && !e.grafica && s.tipo !== "gancho" && (e.texto || []).length > 0 && (
        <TextoCinetico texto={e.texto[0]} duracion={dur} posicion="arriba" />
      )}
      {e.fuente && !e.grafica && <FuenteChip texto={e.fuente} top={SAFE.top + 48} />}
    </AbsoluteFill>
  );
}

/** Altura de los subtítulos según lo que haya en pantalla (fracción de 1920) */
function alturaSubtitulos(segs, reel, assets) {
  return (t) => {
    const f = t * FPS;
    const s = segs.find((x) => f >= x.desde && f < x.hasta);
    if (!s) return 0.65;
    if (s.tipo === "grafica") return 0.77; // debajo de la tarjeta
    if (s.tipo === "aplicacion") return 0.77; // debajo de las tarjetas de "qué hacer"
    if (s.tipo === "conclusion") return 0.77; // debajo del bloque de conclusión
    const ms = (s.escena?.musculo || []).filter((m) => typeof m.x === "number" && assets?.clips?.[String(s.i)]);
    if (ms.length) {
      const ys = ms.flatMap((m) => [m.y, ...(m.keyframes || []).map((k) => k.y)]);
      if (ys.some((y) => y > 0.5 && y < 0.8)) return 0.32; // el anillo va abajo: subtítulos arriba
    }
    return 0.65;
  };
}

export function Reel({ reel, assets }) {
  const frame = useCurrentFrame();
  const narr = assets?.voz?.words || null;
  const segs = buildTimeline(reel, assets?.music, narr);
  const total = totalFrames(segs);
  const cierre = segs.find((s) => s.tipo === "cierre");
  const posY = React.useMemo(() => alturaSubtitulos(segs, reel, assets), [segs, reel, assets]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0F" }}>
      {segs.map((s, k) => (
        <Sequence key={k} from={s.desde} durationInFrames={s.hasta - s.desde}>
          {s.escena ? (
            <Escena s={s} assets={assets} reel={reel} conVoz={Boolean(narr)} />
          ) : (
            <AbsoluteFill>
              <Fondo src={assets?.clips?.final} clipSeg={assets?.clipSeg?.final} duracion={s.hasta - s.desde} semilla={k} oscuro={0.5} desenfoque={8} />
              {s.tipo === "conclusion" && <Conclusion lineas={reel.conclusion} duracion={s.hasta - s.desde} />}
              {s.tipo === "aplicacion" && <Aplicacion puntos={reel.aplicacion} duracion={s.hasta - s.desde} />}
              {s.tipo === "cierre" && <TarjetaFinal duracion={s.hasta - s.desde} />}
            </AbsoluteFill>
          )}
        </Sequence>
      ))}
      <Marca progreso={frame / Math.max(1, total - 1)} mostrarMarca={frame < cierre.desde} />
      {narr && <Subtitulos palabras={narr.palabras} posicionY={posY} />}
      {narr && <Audio src={staticFile(assets.voz.file)} volume={1} />}
      <Musica music={assets?.music} total={total} palabras={narr?.palabras} />
    </AbsoluteFill>
  );
}
