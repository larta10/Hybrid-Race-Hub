// Efectos de sonido generados por código con ffmpeg (sin grabaciones ni derechos de terceros: CC0, ver
// instagram/sfx/LICENCIAS.md). Mismo enfoque que make-music.mjs.
//   node scripts/make-sfx.mjs   → instagram/sfx/{whoosh,impacto,click}.wav
import { writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, ffmpeg, mkdirp } from "./lib/common.mjs";

const SFX = mkdirp(path.join(ROOT, "instagram", "sfx"));
const EFECTOS = {
  // Ruido rosa filtrado que sube y se apaga: transición entre escenas
  whoosh: ["-f", "lavfi", "-i", "anoisesrc=d=0.55:color=pink:amplitude=0.8:seed=7", "-af", "highpass=f=250,lowpass=f=6000,afade=t=in:d=0.32:curve=exp,afade=t=out:st=0.32:d=0.23:curve=exp,volume=0.9"],
  // Golpe grave con caída de tono y un poco de ruido: entrada del gancho
  impacto: ["-f", "lavfi", "-i", "aevalsrc=0.9*sin(2*PI*(42+110*exp(-t*20))*t)*exp(-t*6)+0.25*(random(0)*2-1)*exp(-t*45):d=0.7:s=44100"],
  // Tic corto y seco: entrada de las tarjetas de "qué hacer"
  click: ["-f", "lavfi", "-i", "aevalsrc=0.7*sin(2*PI*2400*t)*exp(-t*120)+0.3*sin(2*PI*1200*t)*exp(-t*80):d=0.07:s=44100"],
};
for (const [nombre, args] of Object.entries(EFECTOS)) {
  const out = path.join(SFX, `${nombre}.wav`);
  // Mono, 44,1 kHz, pico a -3 dBFS
  ffmpeg([...args, "-ac", "1", "-ar", "44100", "-af", "alimiter=limit=0.7:level=false", out]);
  console.log(out);
}
writeFileSync(
  path.join(SFX, "LICENCIAS.md"),
  `# Efectos de sonido

Generados por código con ffmpeg (\`video/scripts/make-sfx.mjs\`): ruido y osciladores sintéticos, sin grabaciones,
muestras ni material de terceros. Se publican como CC0 (dominio público); no exigen atribución.

| Archivo | Uso | Cómo se genera |
|---|---|---|
| whoosh.wav | Cambio de escena | Ruido rosa filtrado (250 Hz-6 kHz) con subida y caída exponenciales |
| impacto.wav | Entrada del gancho | Seno grave con caída de tono (152 → 42 Hz) y ráfaga corta de ruido |
| click.wav | Entrada de las tarjetas de "qué hacer" | Dos senos agudos con caída muy rápida |
`
);
