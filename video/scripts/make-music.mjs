// Pistas de reserva generadas por síntesis (sin derechos de terceros): ambiente rítmico simple a 120 BPM.
// Se normalizan a -14 LUFS con ffmpeg (loudnorm) y se guardan en instagram/music/ como AAC.
//   node scripts/make-music.mjs
import { writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { MUSIC_DIR, ffmpeg, mkdirp } from "./lib/common.mjs";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const DUR = 64; // 32 compases: sobra para un Reel de 40 s

// Semilla fija: el resultado es siempre el mismo
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

function synth({ seed, raiz, acordes, brillo, hats16 }) {
  const n = Math.floor(SR * DUR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const rand = rng(seed);
  const add = (i, v, pan = 0) => {
    if (i < 0 || i >= n) return;
    L[i] += v * (1 - Math.max(0, pan));
    R[i] += v * (1 + Math.min(0, pan));
  };
  const beats = Math.floor(DUR / BEAT);
  for (let b = 0; b < beats; b++) {
    const t0 = Math.floor(b * BEAT * SR);
    const compas = Math.floor(b / 4);
    const intro = compas < 2; // los dos primeros compases sin bombo, entrada suave
    // Bombo: seno con caída de tono
    if (!intro) {
      let ph = 0;
      for (let k = 0; k < SR * 0.35; k++) {
        const t = k / SR;
        const f = 48 + 110 * Math.exp(-t * 28);
        ph += (2 * Math.PI * f) / SR;
        add(t0 + k, Math.sin(ph) * Math.exp(-t * 7) * 0.9);
      }
    }
    // Palmada suave en 2 y 4
    if (!intro && b % 2 === 1) {
      let lp = 0;
      for (let k = 0; k < SR * 0.18; k++) {
        const t = k / SR;
        const w = rand() * 2 - 1;
        lp += 0.35 * (w - lp);
        add(t0 + k, (w - lp) * Math.exp(-t * 22) * 0.22, 0.1);
      }
    }
    // Hi-hats a contratiempo (o semicorcheas)
    const subs = hats16 ? 4 : 2;
    for (let s = 1; s < subs; s += hats16 ? 1 : 2) {
      const th = t0 + Math.floor((s * BEAT * SR) / subs);
      let prev = 0;
      for (let k = 0; k < SR * 0.05; k++) {
        const w = rand() * 2 - 1;
        const hp = w - prev;
        prev = w;
        add(th + k, hp * Math.exp((-k / SR) * 70) * (s === 2 ? 0.1 : 0.07), -0.25);
      }
    }
    // Bajo en corcheas siguiendo los acordes
    const acorde = acordes[compas % acordes.length];
    for (let s = 0; s < 2; s++) {
      const tb = t0 + Math.floor((s * BEAT * SR) / 2);
      const f = midi(raiz + acorde[0] - 24);
      let ph = 0;
      for (let k = 0; k < SR * BEAT * 0.48; k++) {
        const t = k / SR;
        ph += (2 * Math.PI * f) / SR;
        const saw = 2 * ((ph / (2 * Math.PI)) % 1) - 1;
        const env = Math.min(1, t * 200) * Math.exp(-t * 6);
        add(tb + k, (0.6 * Math.sin(ph) + 0.25 * saw) * env * 0.32);
      }
    }
  }
  // Pad: acordes sostenidos con ataque lento y algo de desafinado
  const compasDur = 4 * BEAT;
  for (let c = 0; c < DUR / compasDur; c++) {
    const acorde = acordes[c % acordes.length];
    const t0 = Math.floor(c * compasDur * SR);
    const len = Math.floor(compasDur * SR);
    for (const [j, iv] of acorde.entries()) {
      const f = midi(raiz + iv);
      for (const det of [-0.12, 0.12]) {
        const ff = f * Math.pow(2, det / 12);
        for (let k = 0; k < len; k++) {
          const t = k / SR;
          const env = Math.min(1, t / 0.6) * Math.min(1, (compasDur - t) / 0.4);
          const v = (Math.sin(2 * Math.PI * ff * t) + brillo * Math.sin(4 * Math.PI * ff * t)) * env * 0.035;
          add(t0 + k, v, j % 2 ? 0.3 : -0.3);
        }
      }
    }
  }
  // Fundido final y límite suave
  for (let i = 0; i < n; i++) {
    const fade = Math.min(1, (n - i) / (SR * 2));
    L[i] = Math.tanh(L[i] * 0.9) * fade;
    R[i] = Math.tanh(R[i] * 0.9) * fade;
  }
  return [L, R];
}

function wav([L, R]) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  return buf;
}

const PISTAS = [
  { archivo: "reserva-1-am.m4a", seed: 11, raiz: 57, acordes: [[0, 3, 7], [-4, 0, 3], [-9, -5, -2], [-2, 2, 5]], brillo: 0.25, hats16: false },
  { archivo: "reserva-2-dm.m4a", seed: 23, raiz: 62, acordes: [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]], brillo: 0.35, hats16: true },
  { archivo: "reserva-3-em.m4a", seed: 37, raiz: 64, acordes: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-7, -3, 0]], brillo: 0.2, hats16: false },
];

mkdirp(MUSIC_DIR);
for (const p of PISTAS) {
  const tmp = path.join(MUSIC_DIR, `_${p.archivo}.wav`);
  writeFileSync(tmp, wav(synth(p)));
  // -14 LUFS integrados, pico real -1,5 dBTP
  ffmpeg(["-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-c:a", "aac", "-b:a", "160k", path.join(MUSIC_DIR, p.archivo)]);
  rmSync(tmp);
  console.log(path.join(MUSIC_DIR, p.archivo));
}
