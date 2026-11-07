import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel.jsx";
import { Calendario } from "./Calendario.jsx";
import { buildTimeline, buildCalendarTimeline, totalFrames } from "./timeline.js";
import { W, H, FPS } from "./theme.js";
import ejemplo from "../../instagram/reels/r102-carbohidratos-en-carrera.json";

export const Root = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={900}
      defaultProps={{ reel: ejemplo, assets: {} }}
      calculateMetadata={({ props }) => ({ durationInFrames: totalFrames(buildTimeline(props.reel, props.assets?.music)) })}
    />
    <Composition
      id="Calendario"
      component={Calendario}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={600}
      defaultProps={{
        carreras: [
          { dia: "14", mes: "NOV", nombre: "Carrera de ejemplo", ciudad: "Madrid" },
          { dia: "21", mes: "NOV", nombre: "Otra carrera", ciudad: "Bilbao" },
        ],
        rango: "Del 9 al 30 de noviembre",
        clips: [],
        assets: {},
      }}
      calculateMetadata={({ props }) => ({ durationInFrames: buildCalendarTimeline(props.carreras.length, props.assets?.music).at(-1).hasta })}
    />
  </>
);
