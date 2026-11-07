/**
 * Passo 3: gera a capa estática e o WebP animado (Safari/iPhone)
 * a partir dos quadros recortados no passo 1.
 * Uso: node scripts/fredo-animacao/3-gerar-webp-e-capa.mjs <pasta-dos-quadros> public/fredo/animacao
 */
import sharp from "sharp";

const [dir, out] = process.argv.slice(2);
const LAST = 98; // último quadro do loop (12,6 s): mesma posição do primeiro
const crop = { left: 46, top: 48, width: 470, height: 852 };
const W = 380;

// Capa: primeiro quadro (igual ao início da animação, a troca fica imperceptível)
const first = await sharp(`${dir}/k-000.png`).extract(crop).png().toBuffer();
await sharp(first).webp({ quality: 88, alphaQuality: 100 }).toFile(`${out}/fredo-animado-poster.webp`);
await sharp(first).png({ compressionLevel: 9 }).toFile(`${out}/fredo-animado-poster.png`);

// WebP animado (Safari/iPhone): metade dos quadros (7,5 fps) para ficar leve
const frames = [];
for (let k = 0; k <= LAST; k += 2) {
  frames.push(
    await sharp(`${dir}/k-${String(k).padStart(3, "0")}.png`).extract(crop).resize({ width: W }).png().toBuffer(),
  );
}
const info = await sharp(frames, { join: { animated: true } })
  .webp({ quality: 62, alphaQuality: 80, effort: 6, loop: 0, delay: Array(frames.length).fill(133), minSize: true })
  .toFile(`${out}/fredo-animado.webp`);
console.log("webp animado", (info.size / 1024).toFixed(0) + " KB", W + "px");
