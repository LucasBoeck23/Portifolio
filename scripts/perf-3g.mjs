// Mede a landing em Fast 3G, N vezes, e reporta a MEDIANA (mais confiável
// que uma única captura, que sofre com o ruído da rede). Cache sempre OFF.
//
// Uso: node scripts/perf-3g.mjs [url] [runs]
import { chromium } from 'playwright';

const URL = process.argv[2] || 'https://lucasboeck23.github.io/Portifolio/';
const RUNS = Number(process.argv[3] || 5);

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 300,
};

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const ms = (n) => `${Math.round(n)} ms`;

async function oneRun(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.emulateNetworkConditions', FAST_3G);

  let bytes = 0;
  const finishes = new Map();
  const starts = new Map();
  const urls = new Map();
  client.on('Network.requestWillBeSent', (e) => {
    starts.set(e.requestId, Date.now());
    urls.set(e.requestId, e.request.url);
  });
  client.on('Network.loadingFinished', (e) => {
    bytes += e.encodedDataLength || 0;
    finishes.set(e.requestId, Date.now());
  });

  const t0 = Date.now();
  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
  // espera o vídeo poder tocar (mede quando a experiência de fundo começa)
  let videoReady = null;
  try {
    videoReady = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const v = document.querySelector('video');
          if (!v) return resolve(null);
          if (v.readyState >= 3) return resolve(performance.now());
          v.addEventListener('canplay', () => resolve(performance.now()), { once: true });
          setTimeout(() => resolve(null), 30000);
        }),
      { timeout: 35000 }
    );
  } catch {}
  await page.waitForTimeout(1000);

  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paints = {};
    for (const p of performance.getEntriesByType('paint')) paints[p.name] = p.startTime;
    return {
      fcp: paints['first-contentful-paint'],
      dcl: nav.domContentLoadedEventEnd,
      load: nav.loadEventEnd,
      ttfb: nav.responseStart,
    };
  });

  await context.close();
  return { ...m, videoReady, bytes };
}

(async () => {
  console.log(`3G audit: ${URL}  (${RUNS} execuções, mediana) — cache OFF`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome-stable' });
  }
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await oneRun(browser);
    runs.push(r);
    console.log(
      `  run ${i + 1}: FCP ${ms(r.fcp)} | DCL ${ms(r.dcl)} | load ${ms(r.load)} | ` +
        `video-canplay ${r.videoReady ? ms(r.videoReady) : '—'}`
    );
  }
  await browser.close();

  console.log('\nMEDIANAS (Fast 3G):');
  console.log(`  TTFB:            ${ms(median(runs.map((r) => r.ttfb)))}`);
  console.log(`  FCP:             ${ms(median(runs.map((r) => r.fcp)))}`);
  console.log(`  DOMContentLoaded:${ms(median(runs.map((r) => r.dcl)))}`);
  console.log(`  load:            ${ms(median(runs.map((r) => r.load)))}`);
  const vr = runs.map((r) => r.videoReady).filter(Boolean);
  console.log(`  vídeo canplay:   ${vr.length ? ms(median(vr)) : '—'}`);
  console.log(`  bytes (mediana): ${(median(runs.map((r) => r.bytes)) / 1024).toFixed(0)} KB`);
})();
