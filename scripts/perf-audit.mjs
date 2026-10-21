// Perf audit: mede o waterfall de rede da URL de produção em diferentes
// condições de rede, SEMPRE sem cache (cache desabilitado via CDP).
//
// Uso: node scripts/perf-audit.mjs [url]
import { chromium } from 'playwright';

const URL = process.argv[2] || 'https://lucasboeck23.github.io/Portifolio/';

// Perfis de rede (valores em bytes/s e ms). Baseados nos presets do DevTools.
const PROFILES = {
  'No throttle': { offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0 },
  'Fast 4G': {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
  'Slow 4G': {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  },
  'Fast 3G': {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 300,
  },
};

function fmtBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
function fmtMs(n) {
  if (n == null) return '—';
  return `${Math.round(n)} ms`;
}

async function runProfile(browser, name, profile) {
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send('Network.enable');
  // SEM CACHE: desabilita o cache do navegador por completo
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.emulateNetworkConditions', profile);

  const requests = new Map(); // requestId -> record
  const navStart = Date.now();

  client.on('Network.requestWillBeSent', (e) => {
    requests.set(e.requestId, {
      url: e.request.url,
      type: e.type,
      start: e.timestamp * 1000,
      startWall: Date.now() - navStart,
      encodedBytes: 0,
      status: null,
      fromCache: false,
      finish: null,
      mime: null,
    });
  });
  client.on('Network.responseReceived', (e) => {
    const r = requests.get(e.requestId);
    if (r) {
      r.status = e.response.status;
      r.mime = e.response.mimeType;
      r.fromCache = e.response.fromDiskCache || e.response.fromPrefetchCache || false;
      r.timing = e.response.timing;
    }
  });
  client.on('Network.dataReceived', (e) => {
    const r = requests.get(e.requestId);
    if (r) r.encodedBytes += e.encodedDataLength || e.dataLength || 0;
  });
  client.on('Network.loadingFinished', (e) => {
    const r = requests.get(e.requestId);
    if (r) {
      r.finish = Date.now() - navStart;
      if (e.encodedDataLength) r.encodedBytes = e.encodedDataLength;
    }
  });

  const t0 = Date.now();
  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });

  // dá um tempo pra assets disparados pós-load (vídeo/imagens) baixarem
  await page.waitForTimeout(8000);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paints = {};
    for (const p of performance.getEntriesByType('paint')) paints[p.name] = p.startTime;
    return {
      domContentLoaded: nav.domContentLoadedEventEnd,
      loadEvent: nav.loadEventEnd,
      firstPaint: paints['first-paint'],
      firstContentfulPaint: paints['first-contentful-paint'],
      ttfb: nav.responseStart,
    };
  });

  const totalWall = Date.now() - t0;
  const recs = [...requests.values()];

  await context.close();
  return { name, profile, metrics, totalWall, recs };
}

function report(result) {
  const { name, metrics, totalWall, recs } = result;
  console.log('\n' + '='.repeat(72));
  console.log(`PERFIL: ${name}`);
  console.log('='.repeat(72));
  console.log(
    `TTFB: ${fmtMs(metrics.ttfb)} | FCP: ${fmtMs(metrics.firstContentfulPaint)} | ` +
      `DOMContentLoaded: ${fmtMs(metrics.domContentLoaded)} | load: ${fmtMs(metrics.loadEvent)}`
  );
  console.log(`Tempo total de captura (wall): ${fmtMs(totalWall)}`);

  const byType = {};
  let totalBytes = 0;
  for (const r of recs) {
    byType[r.type] = (byType[r.type] || 0) + (r.encodedBytes || 0);
    totalBytes += r.encodedBytes || 0;
  }
  console.log(`\nTotal transferido: ${fmtBytes(totalBytes)} em ${recs.length} requests`);
  console.log(
    'Por tipo: ' +
      Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}=${fmtBytes(v)}`)
        .join('  ')
  );

  // Os 15 requests mais lentos (do início até terminar de baixar)
  const slow = recs
    .filter((r) => r.finish != null)
    .map((r) => ({ ...r, dur: r.finish - r.startWall }))
    .sort((a, b) => b.finish - a.finish)
    .slice(0, 15);

  console.log('\nRequests que terminam por último (start → finish):');
  console.log(
    'start'.padStart(8) +
      ' ' +
      'finish'.padStart(8) +
      ' ' +
      'dur'.padStart(8) +
      ' ' +
      'size'.padStart(10) +
      '  file'
  );
  for (const r of slow) {
    const file = r.url.replace(/^https?:\/\/[^/]+/, '').slice(-54);
    console.log(
      `${fmtMs(r.startWall).padStart(8)} ${fmtMs(r.finish).padStart(8)} ${fmtMs(r.dur).padStart(8)} ${fmtBytes(
        r.encodedBytes
      ).padStart(10)}  ${file}`
    );
  }
}

(async () => {
  console.log(`Auditando: ${URL}`);
  console.log('Cache: DESABILITADO em todos os perfis (Network.setCacheDisabled=true)');
  // Usa o Google Chrome do sistema (channel) pra não depender do download do Chromium.
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch (e) {
    console.log('channel=chrome falhou, tentando executablePath do sistema...', e.message);
    browser = await chromium.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
    });
  }
  const summary = [];
  for (const [name, profile] of Object.entries(PROFILES)) {
    const result = await runProfile(browser, name, profile);
    report(result);
    summary.push(result);
  }
  await browser.close();

  // Resumo comparativo
  console.log('\n\n' + '#'.repeat(72));
  console.log('RESUMO COMPARATIVO');
  console.log('#'.repeat(72));
  console.log(
    'perfil'.padEnd(14) +
      'FCP'.padStart(10) +
      'load'.padStart(10) +
      'total MB'.padStart(12)
  );
  for (const r of summary) {
    const total = r.recs.reduce((s, x) => s + (x.encodedBytes || 0), 0);
    console.log(
      r.name.padEnd(14) +
        fmtMs(r.metrics.firstContentfulPaint).padStart(10) +
        fmtMs(r.metrics.loadEvent).padStart(10) +
        fmtBytes(total).padStart(12)
    );
  }
})();
