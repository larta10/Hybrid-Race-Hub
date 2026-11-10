// Hoja de control de las poses del monigote: 6 fotogramas por pose (y su "así no" si se pide).
//   node scripts/poses-hoja.mjs [pose…] [--comparar]   → out/frames/poses/<pose>.jpg
import path from "node:path";
import { rmSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, ensureBrowser } from "@remotion/renderer";
import { VIDEO, OUT, mkdirp, ffmpeg } from "./lib/common.mjs";
import { POSES } from "../src/poses.js";

const args = process.argv.slice(2);
const comparar = args.includes("--comparar");
const poses = args.filter((a) => !a.startsWith("--"));
await ensureBrowser();
const serveUrl = await bundle({ entryPoint: path.join(VIDEO, "src/index.jsx"), onProgress: () => {} });
for (const pose of poses.length ? poses : Object.keys(POSES)) {
  const dir = mkdirp(path.join(OUT, "frames", "poses", `${pose}-celdas`));
  const inputProps = { tecnica: { pose, comparar } };
  const composition = await selectComposition({ serveUrl, id: "Tecnica", inputProps });
  const ciclo = POSES[pose].ciclo * 30;
  for (let i = 0; i < 6; i++) {
    const frame = Math.round(20 + (ciclo * i) / 6);
    await renderStill({ serveUrl, composition, inputProps, frame, output: path.join(dir, `c${String(i).padStart(3, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, scale: 0.4 });
  }
  const out = path.join(OUT, "frames", "poses", `${pose}${comparar ? "-comparar" : ""}.jpg`);
  ffmpeg(["-framerate", "1", "-i", path.join(dir, "c%03d.jpg"), "-vf", "tile=6x1:padding=6:margin=6:color=white", "-frames:v", "1", "-q:v", "3", out]);
  rmSync(dir, { recursive: true, force: true });
  console.log(out);
}
