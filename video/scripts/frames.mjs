// Fotogramas para revisar a ojo.
//   node scripts/frames.mjs video <mp4>       → 1 fotograma por segundo + hoja de contactos
import { rmSync } from "node:fs";
import path from "node:path";
import { ffmpeg, mediaDuration, OUT, mkdirp } from "./lib/common.mjs";

const [modo, objetivo] = process.argv.slice(2);

if (modo === "clips") {
  console.log("Usa: node scripts/fetch-clips.mjs hoja "+objetivo+" (3 fotogramas por clip vertical)");
} else if (modo === "video") {
  const file = path.resolve(objetivo);
  const name = path.basename(file, path.extname(file));
  const dir = path.join(OUT, "frames", name);
  rmSync(dir, { recursive: true, force: true });
  mkdirp(dir);
  ffmpeg(["-i", file, "-vf", "fps=1,scale=540:960", "-q:v", "3", path.join(dir, "s%02d.jpg")]);
  const n = Math.ceil(mediaDuration(file) || 30);
  const cols = 6;
  ffmpeg(["-i", file, "-vf", `fps=1,scale=270:480,tile=${cols}x${Math.ceil(n / cols)}:padding=6:color=white`, "-frames:v", "1", "-q:v", "3", path.join(dir, "hoja.jpg")]);
  console.log(dir);
} else {
  console.log("Uso: node scripts/frames.mjs clips <reel_id> | video <archivo.mp4>");
  process.exit(1);
}
