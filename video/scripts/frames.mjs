// Fotogramas para revisar a ojo.
//   node scripts/frames.mjs clips <reel_id>   → 3 fotogramas por clip (inicio, mitad y final del tramo usado)
//   node scripts/frames.mjs video <mp4>       → 1 fotograma por segundo + hoja de contactos
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { ffmpeg, mediaDuration, loadReel, clipSlots, OUT, CACHE, mkdirp } from "./lib/common.mjs";

const [modo, objetivo] = process.argv.slice(2);

if (modo === "clips") {
  const reel = loadReel(objetivo);
  const dir = mkdirp(path.join(OUT, "frames", "clips", reel.id));
  for (const [i, s] of clipSlots(reel).entries()) {
    const c = s.clip;
    const file = c.pexels_id && path.join(CACHE, `${c.pexels_id}.mp4`);
    if (!file || !existsSync(file)) {
      console.log(`  ${s.donde}: sin clip descargado`);
      continue;
    }
    const t0 = c.inicio || 0;
    for (const [k, t] of [t0, t0 + s.duracion / 2, t0 + s.duracion - 0.1].entries()) {
      const out = path.join(dir, `${String(i + 1).padStart(2, "0")}-${c.pexels_id}-${k + 1}.jpg`);
      ffmpeg(["-ss", String(t), "-i", file, "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", out]);
      console.log(out);
    }
  }
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
