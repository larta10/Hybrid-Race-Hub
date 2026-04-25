/**
 * Genera public/favicon.ico con PNG incrustado usando solo módulos built-in de Node.
 * Ejecutar: node scripts/generate-favicon.mjs
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dir, "..", "public");

/* ── CRC32 ──────────────────────────────────────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/* ── PNG builder ─────────────────────────────────────────────────────────── */
function pngChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function makePNG(w, h, pixelFn) {
  // Raw scanlines: filter=0 + RGBA per pixel
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // filter byte: None
    for (let x = 0; x < w; x++) {
      const [r, g, b, a = 255] = pixelFn(x, y);
      const i = y * (1 + w * 4) + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA color type
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── ICO builder ─────────────────────────────────────────────────────────── */
function makeICO(sizes) {
  // sizes: array of { size, png }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  const dirEntries = sizes.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e[0] = size === 256 ? 0 : size;
    e[1] = size === 256 ? 0 : size;
    e[2] = 0; e[3] = 0;
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bit count
    e.writeUInt32LE(png.length, 8);
    return e; // offset filled below
  });

  let offset = 6 + 16 * sizes.length;
  dirEntries.forEach((e, i) => {
    e.writeUInt32LE(offset, 12);
    offset += sizes[i].png.length;
  });

  return Buffer.concat([header, ...dirEntries, ...sizes.map((s) => s.png)]);
}

/* ── Favicon pixel art ───────────────────────────────────────────────────── */
const BG     = [0x13, 0x15, 0x1c, 255];
const ORANGE = [0xfb, 0x92, 0x3c, 255];
const WHITE  = [0xf5, 0xf5, 0xf7, 255];

// 16×16 pixel grid for "HRH" – hand-crafted 5×9 glyphs on dark background
// Each glyph: H(5w), gap(1), R(5w), gap(1), H(5w) → total 17 → scale to fit 16 ≈ compact 4w+gap
// Simplified: draw pixel art at 16×16
function pixel16(x, y) {
  // Orange bar: bottom 2 rows (y=14,15)
  if (y >= 14) return ORANGE;

  // "H" left (cols 1-3, rows 2-11)
  const inH_left  = x >= 1 && x <= 3 && y >= 2 && y <= 11;
  // "H" crossbar left (cols 1-3, rows 6-7)
  const hcross_l  = x >= 1 && x <= 3 && y >= 6 && y <= 7;
  // "R" middle letter (cols 6-8, rows 2-11)
  const inR_left  = x >= 6 && x <= 8 && y >= 2 && y <= 11;
  // "R" top arch right (cols 9-10, rows 2-4)
  const inR_arch  = x >= 9 && x <= 10 && y >= 2 && y <= 4;
  // "R" arch bottom (col 9, rows 5-6)
  const inR_mid   = x === 9 && y >= 5 && y <= 6;
  // "R" leg (cols 9-10, rows 7-11)
  const inR_leg   = x >= 9 && x <= 10 && y >= 7 && y <= 11;
  // "H" right (cols 12-14, rows 2-11)
  const inH_right = x >= 12 && x <= 14 && y >= 2 && y <= 11;
  // crossbars of both H's
  const hcross_r  = x >= 12 && x <= 14 && y >= 6 && y <= 7;

  if (inH_left || inR_left || inR_arch || inR_mid || inR_leg || inH_right) return WHITE;
  // H crossbars drawn inside the vertical bars above, nothing extra needed

  return BG;
}

// 32×32 version — scaled up 2× from 16×16
function pixel32(x, y) {
  return pixel16(Math.floor(x / 2), Math.floor(y / 2));
}

// 48×48 version — scaled 3×
function pixel48(x, y) {
  return pixel16(Math.floor(x / 3), Math.floor(y / 3));
}

/* ── Generate and write ─────────────────────────────────────────────────── */
const png16 = makePNG(16, 16, pixel16);
const png32 = makePNG(32, 32, pixel32);
const png48 = makePNG(48, 48, pixel48);

const ico = makeICO([
  { size: 16, png: png16 },
  { size: 32, png: png32 },
  { size: 48, png: png48 },
]);

writeFileSync(join(PUBLIC, "favicon.ico"), ico);
console.log(`✓ favicon.ico written (${ico.length} bytes, 3 sizes: 16×16, 32×32, 48×48)`);
