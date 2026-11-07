/**
 * Gera as versões visuais do Fredo a partir da foto original (fundo branco).
 * A foto original NÃO é alterada. Nenhuma IA generativa é usada:
 * só recorte, ajuste de tons e composição, então o produto fica idêntico.
 *
 * Uso: node scripts/fredo-images.mjs
 *
 * Saídas em public/fredo/:
 *   fredo-isolado.png / .webp   Versão B: fundo transparente
 *   fredo-hero-escuro.jpg/.webp Versão A: cenário escuro 16:9
 *   fredo-estudio-claro.jpg/.webp Versão C: estúdio claro
 * E src/app/opengraph-image.png (prévia de compartilhamento, 1200x630).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "images/fredo/original/fredo-fundo-branco.png";
const OUT = "public/fredo";
await mkdir(OUT, { recursive: true });

// ---------- 1. Recorte ----------
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const N = W * H;
const lum = new Uint8Array(N); // canal mais escuro de cada pixel
for (let i = 0; i < N; i++) lum[i] = Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);

// Fundo = pixels quase brancos conectados à borda (o robô não tem furos para fora).
const BG_T = 244;
const bg = new Uint8Array(N);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || lum[i] < BG_T) continue;
  bg[i] = 1;
  const x = i % W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (i >= W) stack.push(i - W);
  if (i < N - W) stack.push(i + W);
}

// Alfa: 0 no fundo, 1 no produto. Na borda, alfa proporcional ao quanto o
// pixel se afasta do branco (antisserrilhado natural da foto).
const alpha = new Float32Array(N);
for (let i = 0; i < N; i++) alpha[i] = bg[i] ? 0 : 1;
/** Pixel na fronteira: algum vizinho é do outro lado (fundo x produto). */
const nearBg = (i) => {
  const x = i % W;
  const me = bg[i];
  return (
    (x > 0 && bg[i - 1] !== me) ||
    (x < W - 1 && bg[i + 1] !== me) ||
    (i >= W && bg[i - W] !== me) ||
    (i < N - W && bg[i + W] !== me)
  );
};
for (let i = 0; i < N; i++) {
  if (!nearBg(i)) continue;
  const a = Math.min(1, Math.max(0, (255 - lum[i]) / (255 - 200)));
  alpha[i] = bg[i] ? Math.min(a, 0.6) : Math.max(a, 0.35);
}
// Suaviza a borda 1 px (média 3x3 só onde já é borda).
const soft = Float32Array.from(alpha);
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (alpha[i] === 0 || alpha[i] === 1) {
      if (!nearBg(i)) continue;
    }
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += alpha[i + dy * W + dx];
    soft[i] = s / 9;
  }

// Remove o "halo" branco da borda (descontaminação de cor).
const rgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const a = soft[i];
  for (let c = 0; c < 3; c++) {
    const v = data[i * 3 + c];
    rgba[i * 4 + c] = a > 0.02 && a < 1 ? Math.max(0, Math.min(255, Math.round((v - (1 - a) * 255) / a))) : v;
  }
  rgba[i * 4 + 3] = Math.round(a * 255);
}

// ---------- 2. Tratamento leve (sem mudar cores nem formas) ----------
// Contraste suave, um pouco mais de definição e nitidez fina.
const cutout = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .linear(1.05, -6)
  .sharpen({ sigma: 0.7, m1: 0.5, m2: 1.2 })
  .trim({ threshold: 1 })
  .png()
  .toBuffer();
const cutMeta = await sharp(cutout).metadata();
console.log("recorte:", cutMeta.width, "x", cutMeta.height);

// Versão B: fundo transparente, com margem.
const padded = await sharp(cutout)
  .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp(padded).png({ compressionLevel: 9 }).toFile(`${OUT}/fredo-isolado.png`);
await sharp(padded).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/fredo-isolado.webp`);

// ---------- 3. Composições ----------
/** Sombra de apoio: elipse desfocada sob a base do produto. */
function shadowSvg(w, h, cx, cy, rx, ry, opacity) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${ry * 0.6}"/></filter>
      <filter id="c" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${ry * 0.18}"/></filter></defs>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${opacity * 0.55}" filter="url(#b)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.62}" ry="${ry * 0.38}" fill="#000" opacity="${opacity}" filter="url(#c)"/>
    </svg>`,
  );
}

async function compose({ w, h, bgSvg, productH, shadowOpacity, file, formats }) {
  const prod = await sharp(cutout).resize({ height: productH }).toBuffer();
  const pm = await sharp(prod).metadata();
  const left = Math.round((w - pm.width) / 2);
  const top = Math.round(h * 0.88 - pm.height); // base do produto a 88% da altura
  const baseY = top + pm.height;
  const img = sharp(Buffer.from(bgSvg)).composite([
    { input: shadowSvg(w, h, w / 2, baseY - pm.height * 0.012, pm.width * 0.42, pm.height * 0.035, shadowOpacity), top: 0, left: 0 },
    { input: prod, top, left },
  ]);
  const flat = await img.png().toBuffer();
  if (formats.includes("jpg")) await sharp(flat).jpeg({ quality: 88, mozjpeg: true }).toFile(`${file}.jpg`);
  if (formats.includes("webp")) await sharp(flat).webp({ quality: 86 }).toFile(`${file}.webp`);
  if (formats.includes("png")) await sharp(flat).png({ compressionLevel: 9 }).toFile(`${file}.png`);
}

// Versão A: cenário escuro, luz suave atrás do produto, linhas finas.
const darkBg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="46%" r="60%">
      <stop offset="0" stop-color="#3a3a3a"/><stop offset="0.45" stop-color="#1c1c1c"/><stop offset="1" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="warm" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#C56A37" stop-opacity="0.16"/><stop offset="1" stop-color="#C56A37" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <ellipse cx="${w / 2}" cy="${h * 0.5}" rx="${h * 0.55}" ry="${h * 0.55}" fill="url(#warm)"/>
  <g fill="none" stroke="#fff" stroke-opacity="0.07">
    <circle cx="${w / 2}" cy="${h * 0.48}" r="${h * 0.36}"/>
    <circle cx="${w / 2}" cy="${h * 0.48}" r="${h * 0.46}" stroke-dasharray="2 8"/>
    <line x1="0" y1="${h * 0.86}" x2="${w}" y2="${h * 0.86}"/>
  </g>
  <rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="url(#floor)"/>
</svg>`;

// Versão C: estúdio claro (off-white), luz suave.
const lightBg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="70%">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#F7F6F2"/><stop offset="1" stop-color="#ECECEC"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>`;

// O produto fica com a base na linha do "chão" (86% da altura).
await compose({ w: 1920, h: 1080, bgSvg: darkBg(1920, 1080), productH: 760, shadowOpacity: 0.85, file: `${OUT}/fredo-hero-escuro`, formats: ["jpg", "webp"] });
await compose({ w: 1600, h: 1200, bgSvg: lightBg(1600, 1200), productH: 960, shadowOpacity: 0.35, file: `${OUT}/fredo-estudio-claro`, formats: ["jpg", "webp"] });
await compose({ w: 1200, h: 630, bgSvg: darkBg(1200, 630), productH: 450, shadowOpacity: 0.85, file: "src/app/opengraph-image", formats: ["png"] });

console.log("pronto");
