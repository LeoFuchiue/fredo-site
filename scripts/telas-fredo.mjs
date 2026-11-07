/**
 * Trata as fotos reais da tela do Fred.o (images/telas) para uso no site.
 * Não redesenha nada: só endireita a tela (perspectiva), uniformiza a luz
 * (tira reflexo/gradiente) e limpa o moiré do fundo branco.
 *
 * Uso: node scripts/telas-fredo.mjs   → public/fredo/telas/*.webp
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "images/telas";
const OUT = "public/fredo/telas";
mkdirSync(OUT, { recursive: true });

// foto escolhida para cada estado + intensidade da limpeza de moiré
const JOBS = [
  { name: "balanca", file: "WhatsApp Image 2026-11-07 at 19.35.11 (2).jpeg", moire: "forte" },
  { name: "comanda", file: "WhatsApp Image 2026-11-07 at 19.35.10 (2).jpeg", moire: "media" },
  { name: "processando", file: "WhatsApp Image 2026-11-07 at 19.35.10 (1).jpeg", moire: "leve" },
  { name: "concluido", file: "WhatsApp Image 2026-11-07 at 19.35.10.jpeg", moire: "leve" },
];

const OW = 1600, OH = 960; // 5:3, mesma proporção da tela
const FINAL_W = 1000;

for (const job of JOBS) {
  const { data, info } = await sharp(`${SRC}/${job.file}`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const lum = (i) => 0.3 * data[i * 3] + 0.59 * data[i * 3 + 1] + 0.11 * data[i * 3 + 2];

  // 1. Área acesa da tela: região clara conectada ao centro da foto
  const mask = new Uint8Array(N);
  const st = [Math.floor(H / 2) * W + Math.floor(W / 2)];
  while (st.length) {
    const i = st.pop();
    if (mask[i] || lum(i) < 120) continue;
    mask[i] = 1;
    const x = i % W;
    if (x > 0) st.push(i - 1);
    if (x < W - 1) st.push(i + 1);
    if (i >= W) st.push(i - W);
    if (i < N - W) st.push(i + W);
  }
  // como o texto escuro fica "furado", fechamos a máscara pelos extremos de cada linha
  let tl, tr, br, bl, sTL = Infinity, sTR = -Infinity, sBR = -Infinity, sBL = -Infinity;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (!mask[y * W + x]) continue;
      if (x + y < sTL) { sTL = x + y; tl = [x, y]; }
      if (x - y > sTR) { sTR = x - y; tr = [x, y]; }
      if (x + y > sBR) { sBR = x + y; br = [x, y]; }
      if (y - x > sBL) { sBL = y - x; bl = [x, y]; }
    }

  // 2. Homografia (quadrado unitário → quadrilátero da tela)
  const [x0, y0] = tl, [x1, y1] = tr, [x2, y2] = br, [x3, y3] = bl;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3, f = y0;
  const M = 0.012; // corta a borda do bezel
  const warped = new Float32Array(OW * OH * 3);
  for (let oy = 0; oy < OH; oy++)
    for (let ox = 0; ox < OW; ox++) {
      const u = M + (ox / (OW - 1)) * (1 - 2 * M), v = M + (oy / (OH - 1)) * (1 - 2 * M);
      const w = g * u + h * v + 1;
      const sx = (a * u + b * v + c) / w, sy = (d * u + e * v + f) / w;
      const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
      for (let ch = 0; ch < 3; ch++) {
        const p = (xx, yy) => data[(Math.min(H - 1, Math.max(0, yy)) * W + Math.min(W - 1, Math.max(0, xx))) * 3 + ch];
        warped[(oy * OW + ox) * 3 + ch] =
          p(ix, iy) * (1 - fx) * (1 - fy) + p(ix + 1, iy) * fx * (1 - fy) + p(ix, iy + 1) * (1 - fx) * fy + p(ix + 1, iy + 1) * fx * fy;
      }
    }

  // 3. Luz uniforme: estima o "branco" local (percentil 90 em blocos) e divide
  const CS = 40, GX = Math.ceil(OW / CS), GY = Math.ceil(OH / CS);
  const grid = new Float32Array(GX * GY * 3);
  for (let gy = 0; gy < GY; gy++)
    for (let gx = 0; gx < GX; gx++)
      for (let ch = 0; ch < 3; ch++) {
        const vals = [];
        for (let y = gy * CS; y < Math.min(OH, (gy + 1) * CS); y++)
          for (let x = gx * CS; x < Math.min(OW, (gx + 1) * CS); x++) vals.push(warped[(y * OW + x) * 3 + ch]);
        vals.sort((p, q) => p - q);
        grid[(gy * GX + gx) * 3 + ch] = vals[Math.floor(vals.length * 0.9)];
      }
  // suaviza a grade (3 passadas de média 3x3)
  for (let pass = 0; pass < 3; pass++) {
    const copy = Float32Array.from(grid);
    for (let gy = 0; gy < GY; gy++)
      for (let gx = 0; gx < GX; gx++)
        for (let ch = 0; ch < 3; ch++) {
          let s = 0, n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const xx = gx + dx, yy = gy + dy;
              if (xx < 0 || yy < 0 || xx >= GX || yy >= GY) continue;
              s += copy[(yy * GX + xx) * 3 + ch]; n++;
            }
          grid[(gy * GX + gx) * 3 + ch] = s / n;
        }
  }
  const bgAt = (x, y, ch) => {
    const gx = Math.min(GX - 1.001, Math.max(0, x / CS - 0.5)), gy = Math.min(GY - 1.001, Math.max(0, y / CS - 0.5));
    const ix = Math.floor(gx), iy = Math.floor(gy), fx = gx - ix, fy = gy - iy;
    const q = (xx, yy) => grid[(Math.min(GY - 1, yy) * GX + Math.min(GX - 1, xx)) * 3 + ch];
    return q(ix, iy) * (1 - fx) * (1 - fy) + q(ix + 1, iy) * fx * (1 - fy) + q(ix, iy + 1) * (1 - fx) * fy + q(ix + 1, iy + 1) * fx * fy;
  };
  const WHITE = 247;
  const out = Buffer.alloc(OW * OH * 3);
  const chroma = { leve: 0.35, media: 0.75, forte: 1 }[job.moire];
  const liftFrom = { leve: 214, media: 208, forte: 214 }[job.moire]; // mais agressivo apaga áreas cinza-claras dos desenhos
  for (let y = 0; y < OH; y++)
    for (let x = 0; x < OW; x++) {
      const i = (y * OW + x) * 3;
      let r = (warped[i] / bgAt(x, y, 0)) * WHITE, gg = (warped[i + 1] / bgAt(x, y, 1)) * WHITE, bb = (warped[i + 2] / bgAt(x, y, 2)) * WHITE;
      // 4. Moiré: perto do branco, tira o colorido e assenta o fundo
      const L = 0.3 * r + 0.59 * gg + 0.11 * bb;
      const C = Math.max(r, gg, bb) - Math.min(r, gg, bb);
      if (L > 190) {
        const k = Math.min(1, (L - 190) / 35) * (C < 70 ? 1 : 0.4) * chroma;
        r += (L - r) * k; gg += (L - gg) * k; bb += (L - bb) * k;
        const lift = Math.min(1, Math.max(0, (L - liftFrom) / 22)) * chroma;
        r += (WHITE - r) * lift; gg += (WHITE - gg) * lift; bb += (WHITE - bb) * lift;
      }
      out[i] = Math.max(0, Math.min(255, r));
      out[i + 1] = Math.max(0, Math.min(255, gg));
      out[i + 2] = Math.max(0, Math.min(255, bb));
    }

  // 5. Reduz para o tamanho final (ajuda a sumir o resto do moiré) e nitidez leve
  let img = sharp(out, { raw: { width: OW, height: OH, channels: 3 } });
  if (job.moire !== "leve") img = img.median(3);
  const final = await img.resize({ width: FINAL_W }).sharpen({ sigma: 0.8, m1: 0.6, m2: 1.6 }).png().toBuffer();
  await sharp(final).webp({ quality: 88 }).toFile(`${OUT}/fredo-tela-${job.name}.webp`);
  console.log(job.name, "cantos", [tl, tr, br, bl].map((p) => p.join(",")).join(" | "));
}

// Detalhe: só o peso e o total (lado direito da tela da balança)
await sharp(`${OUT}/fredo-tela-balanca.webp`).extract({ left: 370, top: 30, width: 590, height: 500 }).webp({ quality: 90 }).toFile(`${OUT}/fredo-tela-total.webp`);
console.log("total: recorte do peso e total");
