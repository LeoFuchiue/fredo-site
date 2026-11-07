import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [dir, out, mime, bitrate] = process.argv.slice(2);
const LAST = 98, crop = { x: 46, y: 48, w: 470, h: 852 };
const html = `<!doctype html><body><canvas id=c width=${crop.w} height=${crop.h}></canvas><script>
async function record(mime, bps) {
  const c = document.getElementById('c'), ctx = c.getContext('2d');
  const imgs = await Promise.all(Array.from({ length: ${LAST + 1} }, (_, k) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = '/k-' + String(k).padStart(3, '0') + '.png'; })));
  if (!MediaRecorder.isTypeSupported(mime)) return 'unsupported ' + mime;
  const stream = c.captureStream(0); const track = stream.getVideoTracks()[0];
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bps }); const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  rec.start();
  for (let k = 0; k <= ${LAST}; k++) {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(imgs[k], -${crop.x}, -${crop.y});
    track.requestFrame();
    await new Promise(r => setTimeout(r, 1000 / 15));
  }
  rec.stop(); await done;
  const blob = new Blob(chunks, { type: mime }); const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}
</script></body>`;
const srv = createServer((req, res) => {
  if (req.url === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(html); }
  if (!/^\/k-\d{3}\.png$/.test(req.url)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": "image/png" }); res.end(readFileSync(join(dir, req.url.slice(1))));
}).listen(0);
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9400 + Math.floor(Math.random() * 100);
const proc = spawn(edge, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} if (!t) await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.navigate", { url: `http://127.0.0.1:${srv.address().port}/` }); await sleep(1200);
const r = await send("Runtime.evaluate", { expression: `record(${JSON.stringify(mime)}, ${bitrate})`, awaitPromise: true, returnByValue: true });
const v = r.result?.value;
if (!v || v.startsWith("unsupported")) console.log("RESULT", v ?? JSON.stringify(r.exceptionDetails));
else { writeFileSync(out, Buffer.from(v, "base64")); console.log("wrote", out, (Buffer.from(v, "base64").length / 1024).toFixed(0) + " KB"); }
ws.close(); proc.kill(); srv.close(); process.exit(0);

