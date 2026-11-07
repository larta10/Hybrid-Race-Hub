import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Fondo } from "./components/Fondo.jsx";
import { Gancho, TextoCinetico, FuenteChip, Marca } from "./components/Texto.jsx";
import { GraficaAnimada } from "./components/GraficaAnimada.jsx";
import { SenalarMusculo } from "./components/SenalarMusculo.jsx";
import { Conclusion, Aplicacion, TarjetaFinal } from "./components/Bloques.jsx";
import { buildTimeline, totalFrames } from "./timeline.js";
import { cargarFuentes } from "./fonts.js";
import { SAFE } from "./theme.js";

cargarFuentes();

/** Música: normalizada a -14 LUFS en origen; aquí volumen bajo, fundido de entrada y salida */
export function Musica({ music, total }) {
  if (!music?.file) return null;
  return (
    <Audio
      src={staticFile(music.file)}
      startFrom={Math.round((music.inicio || 0) * 30)}
      volume={(f) => interpolate(f, [0, 15, total - 36, total - 2], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  );
}

function Escena({ s, assets, reel }) {
  const dur = s.hasta - s.desde;
  const e = s.escena;
  const src = assets?.clips?.[String(s.i)];
  // Los anillos solo se dibujan sobre el clip para el que se colocaron a mano
  const clave = e.clip?.fuente && e.clip?.id ? `${e.clip.fuente}-${e.clip.id}` : null;
  const musculos = (e.musculo || []).filter((m) => src && m.clip && m.clip === clave && typeof m.x === "number");
  return (
    <AbsoluteFill>
      <Fondo src={src} duracion={dur} semilla={s.i} oscuro={s.tipo === "grafica" ? 0.5 : 0.4} desenfoque={s.tipo === "grafica" ? 6 : 0} />
      {musculos.length > 0 && <SenalarMusculo musculos={musculos} />}
      {s.tipo === "gancho" && <Gancho texto={reel.gancho} duracion={dur} />}
      {s.tipo === "grafica" && <GraficaAnimada grafica={e.grafica} duracion={dur} />}
      {(s.items || []).map((it, k) => (
        <Sequence key={k} from={it.desde - s.desde} durationInFrames={it.hasta - it.desde} layout="none">
          <TextoCinetico texto={it.texto} duracion={it.hasta - it.desde} posicion={e.texto_posicion} />
        </Sequence>
      ))}
      {e.fuente && !e.grafica && <FuenteChip texto={e.fuente} top={SAFE.top + 48} />}
    </AbsoluteFill>
  );
}

export function Reel({ reel, assets }) {
  const frame = useCurrentFrame();
  const segs = buildTimeline(reel, assets?.music);
  const total = totalFrames(segs);
  const cierre = segs.find((s) => s.tipo === "cierre");
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0F" }}>
      {segs.map((s, k) => (
        <Sequence key={k} from={s.desde} durationInFrames={s.hasta - s.desde}>
          {s.escena ? (
            <Escena s={s} assets={assets} reel={reel} />
          ) : (
            <AbsoluteFill>
              <Fondo src={assets?.clips?.final} duracion={s.hasta - s.desde} semilla={k} oscuro={0.5} desenfoque={8} />
              {s.tipo === "conclusion" && <Conclusion lineas={reel.conclusion} duracion={s.hasta - s.desde} />}
              {s.tipo === "aplicacion" && <Aplicacion puntos={reel.aplicacion} duracion={s.hasta - s.desde} />}
              {s.tipo === "cierre" && <TarjetaFinal duracion={s.hasta - s.desde} />}
            </AbsoluteFill>
          )}
        </Sequence>
      ))}
      <Marca progreso={frame / Math.max(1, total - 1)} mostrarMarca={frame < cierre.desde} />
      <Musica music={assets?.music} total={total} />
    </AbsoluteFill>
  );
}
