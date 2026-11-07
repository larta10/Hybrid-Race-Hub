import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Fondo } from "./components/Fondo.jsx";
import { Gancho, Marca } from "./components/Texto.jsx";
import { Conclusion, TarjetaFinal } from "./components/Bloques.jsx";
import { Musica } from "./Reel.jsx";
import { buildCalendarTimeline } from "./timeline.js";
import { cargarFuentes } from "./fonts.js";
import { C, F, SAFE, SPRING } from "./theme.js";

cargarFuentes();

/** Lista animada de las carreras de las próximas 3 semanas */
function Lista({ carreras, rango }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const alto = carreras.length > 5 ? 136 : 156;
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: SAFE.width, top: SAFE.top + 70 }}>
      <div style={{ fontFamily: F.titular, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.acero }}>{rango.toUpperCase()}</div>
      <div style={{ marginTop: 26 }}>
        {carreras.map((r, i) => {
          const p = spring({ frame: frame - 6 - i * 12, fps, config: SPRING, durationInFrames: 16 });
          return (
            <div key={i} style={{ display: "flex", gap: 26, alignItems: "center", height: alto - 16, marginBottom: 16, background: C.tarjeta, borderRadius: 20, padding: "0 28px", opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
              <div style={{ width: 110, flexShrink: 0, textAlign: "center", fontFamily: F.titular, lineHeight: 0.9 }}>
                <div style={{ fontWeight: 800, fontSize: 64, color: i === 0 ? C.naranja : C.hueso }}>{r.dia}</div>
                <div style={{ fontWeight: 600, fontSize: 28, letterSpacing: 3, color: C.suave }}>{r.mes}</div>
              </div>
              <div style={{ overflow: "hidden", minWidth: 0 }}>
                <div style={{ fontFamily: F.titular, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: C.hueso, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: 650 }}>{r.nombre}</div>
                <div style={{ fontFamily: F.texto, fontSize: 30, color: C.suave }}>{r.ciudad}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Calendario({ carreras, rango, assets }) {
  const frame = useCurrentFrame();
  const segs = buildCalendarTimeline(carreras.length, assets?.music);
  const total = segs[segs.length - 1].hasta;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0F" }}>
      {segs.map((s, k) => (
        <Sequence key={k} from={s.desde} durationInFrames={s.hasta - s.desde}>
          <Fondo src={assets?.clips?.[String(k)]} duracion={s.hasta - s.desde} semilla={k} oscuro={s.tipo === "gancho" ? 0.4 : 0.55} desenfoque={s.tipo === "gancho" ? 0 : 6} />
          {s.tipo === "gancho" && <Gancho texto={`${carreras.length} carreras *híbridas* en 3 semanas`} duracion={s.hasta - s.desde} />}
          {s.tipo === "lista" && <Lista carreras={carreras} rango={rango} />}
          {s.tipo === "conclusion" && <Conclusion lineas={["¿Ya tienes", "*dorsal*?"]} duracion={s.hasta - s.desde} />}
          {s.tipo === "cierre" && <TarjetaFinal titulo="Calendario completo" duracion={s.hasta - s.desde} />}
        </Sequence>
      ))}
      <Marca progreso={frame / Math.max(1, total - 1)} mostrarMarca={frame < segs[segs.length - 1].desde} />
      <Musica music={assets?.music} total={total} />
    </AbsoluteFill>
  );
}
