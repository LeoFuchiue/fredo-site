import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream, statSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [videoPath, outDir, startS, endS, fpsS] = process.argv.slice(2);
const START = +startS, END = +endS, FPS = +fpsS;
const CROP = { x: 330, y: 140, w: 560, h: 940 };
const size = statSync(videoPath).size;
const html = `<!doctype html><body><video id=v src="/v.mp4" muted playsinline preload=auto></video><canvas id=c width=${CROP.w} height=${CROP.h}></canvas>
<script>
function keyFrame() {
  const v = document.getElementById('v'), c = document.getElementById('c'), ctx = c.getContext('2d', { willReadFrequently: true });
  const W = ${CROP.w}, H = ${CROP.h}, N = W * H;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(v, ${CROP.x}, ${CROP.y}, W, H, 0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  const bl = new Float32Array(N), lum = new Float32Array(N);
  for (let i = 0; i < N; i++) { const r = d[i*4], g = d[i*4+1], b = d[i*4+2]; bl[i] = b - (r + g) / 2; lum[i] = .3*r + .59*g + .11*b; }
  const cand = (i) => bl[i] >= 14 && lum[i] < 120;
  // fundo = candidatos conectados à borda
  const bg = new Uint8Array(N); const st = [];
  for (let x = 0; x < W; x++) st.push(x, (H-1)*W + x);
  for (let y = 0; y < H; y++) st.push(y*W, y*W + W - 1);
  while (st.length) { const i = st.pop(); if (bg[i] || !cand(i)) continue; bg[i] = 1; const x = i % W;
    if (x > 0) st.push(i-1); if (x < W-1) st.push(i+1); if (i >= W) st.push(i-W); if (i < N-W) st.push(i+W); }
  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) alpha[i] = bg[i] ? 0 : 1;
  const out = new Uint8ClampedArray(N * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y*W + x;
    // borda: algum vizinho (raio 2) do outro lado
    let edge = false, sr = 0, sg = 0, sb = 0, n = 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy*W + xx; if (bg[j] !== bg[i]) edge = true;
      if (bg[j] && j !== i) { sr += d[j*4]; sg += d[j*4+1]; sb += d[j*4+2]; n++; }
    }
    let a = alpha[i], r = d[i*4], g = d[i*4+1], b = d[i*4+2];
    if (edge && n > 0) {
      const Br = sr/n, Bg = sg/n, Bb = sb/n, blB = Bb - (Br + Bg)/2, blF = 4;
      if (blB > 8) {
        let est = (blB - bl[i]) / (blB - blF);
        est = Math.max(0, Math.min(1, est));
        a = bg[i] ? Math.min(est, 0.5) : Math.max(est, 0.15);
        if (a > 0.04) { r = (r - (1-a)*Br) / a; g = (g - (1-a)*Bg) / a; b = (b - (1-a)*Bb) / a; }
      }
    }
    out[i*4] = r; out[i*4+1] = g; out[i*4+2] = b; out[i*4+3] = Math.round(a * 255);
  }
  ctx.putImageData(new ImageData(out, W, H), 0, 0);
  return c.toDataURL('image/png');
}
</script></body>`;
const srv = createServer((req, res) => {
  if (req.url === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(html); }
  const range = req.headers.range;
  if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s0 = +a, e0 = b ? +b : size - 1;
    res.writeHead(206, { "content-type": "video/mp4", "content-range": `bytes ${s0}-${e0}/${size}`, "accept-ranges": "bytes", "content-length": e0 - s0 + 1 });
    return createReadStream(videoPath, { start: s0, end: e0 }).pipe(res); }
  res.writeHead(200, { "content-type": "video/mp4", "content-length": size }); createReadStream(videoPath).pipe(res);
}).listen(0);
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9500 + Math.floor(Math.random() * 100);
const proc = spawn(edge, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} if (!t) await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => { const r = await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description); return r.result.value; };
await send("Page.navigate", { url: `http://127.0.0.1:${srv.address().port}/` }); await sleep(1500);
await ev(`new Promise(r => { const v = document.getElementById('v'); v.readyState >= 2 ? r() : v.oncanplay = r; })`);
const count = Math.round((END - START) * FPS);
for (let k = 0; k <= count; k++) {
  const time = START + k / FPS;
  const data = await ev(`new Promise(r => { const v = document.getElementById('v'); v.onseeked = () => r(keyFrame()); v.currentTime = ${time.toFixed(4)}; })`);
  writeFileSync(join(outDir, `k-${String(k).padStart(3, "0")}.png`), Buffer.from(data.split(",")[1], "base64"));
}
console.log("frames", count + 1);
ws.close(); proc.kill(); srv.close(); process.exit(0);
