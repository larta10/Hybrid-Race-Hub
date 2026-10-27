// Genera el logo, los iconos y el manifest del rediseño 10/2026.
//   node scripts/generate-brand.mjs
// H sobria en tinta (#14161A) con una línea de pista verde (#1F5C46) como único detalle.
import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";

const INK = "#14161A", ACCENT = "#1F5C46", PAPER = "#F5F4F0";
const mark = (fg, accent) => `<rect x="8" y="7" width="7" height="24" fill="${fg}"/><rect x="25" y="7" width="7" height="24" fill="${fg}"/><rect x="15" y="16" width="10" height="5" fill="${fg}"/><rect x="8" y="34" width="24" height="3" fill="${accent}"/>`;
const icon = (fg = INK, accent = ACCENT) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">${mark(fg, accent)}</svg>\n`;
const square = (bg, pad = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${40 + pad * 2} ${40 + pad * 2}"><rect x="${-pad}" y="${-pad}" width="${40 + pad * 2}" height="${40 + pad * 2}" fill="${bg}"/>${mark(INK, ACCENT)}</svg>`;

writeFileSync("public/logo-icon.svg", icon());
writeFileSync("public/logo-icon-light.svg", icon("#FFFFFF", "#8FC4AC"));
writeFileSync("public/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="${PAPER}"/>${mark(INK, ACCENT)}</svg>\n`);
writeFileSync("public/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 48" width="300" height="48">
  <g transform="translate(0,4)">${mark(INK, ACCENT)}</g>
  <text x="50" y="33" font-family="Archivo, 'Arial Narrow', Arial, sans-serif" font-weight="800" font-size="26" letter-spacing="-0.4" fill="${INK}">Hybrid Race Hub</text>
</svg>\n`);

const png = async (svg, size, file) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
await png(square(PAPER, 2), 32, "public/icon-32.png");
await png(square(PAPER, 4), 180, "public/apple-touch-icon.png");
await png(square(PAPER, 4), 192, "public/icon-192.png");
await png(square(PAPER, 4), 512, "public/icon-512.png");
await png(square(PAPER, 14), 512, "public/icon-maskable-512.png"); // zona segura del 80 %

// favicon.ico con PNG de 16, 32 y 48 px dentro (formato ICO con entradas PNG)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(s => sharp(Buffer.from(square(PAPER, 2))).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length; return e;
});
writeFileSync("public/favicon.ico", Buffer.concat([header, ...dir, ...pngs]));

for (const f of ["public/manifest.json", "public/site.webmanifest"]) {
  const m = JSON.parse(readFileSync(f, "utf8"));
  m.background_color = PAPER; m.theme_color = PAPER;
  m.icons = [
    { src: "/icon-32.png", sizes: "32x32", type: "image/png", purpose: "any" },
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
  ];
  writeFileSync(f, JSON.stringify(m, null, 2) + "\n");
}
console.log("Logo, iconos, favicon.ico y manifest generados.");
