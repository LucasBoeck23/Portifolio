// Visual check script — captura screenshots das rotas em vários viewports
// usando o Google Chrome já instalado no sistema (sem baixar Chromium).
//
// Uso:
//   node scripts/visual-check.mjs            -> captura todos os viewports
//   node scripts/visual-check.mjs mobile     -> só o viewport mobile
//
// Pré-requisito: dev server rodando em http://localhost:5173

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'visual-snapshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'log', path: '/log' },
  { name: 'resume', path: '/resume' },
  { name: 'socials', path: '/socials' },
];

const VIEWPORTS = [
  { name: 'mobile-sm', width: 320, height: 568, isMobile: true },  // celular pequeno (iPhone SE 1)
  { name: 'iphone-se', width: 375, height: 667, isMobile: true },  // celular baixo (iPhone SE 2/3)
  { name: 'mobile', width: 375, height: 812, isMobile: true },     // celular padrão
  { name: 'mobile-lg', width: 430, height: 932, isMobile: true },  // celular grande (Pro Max)
  { name: 'fold-closed', width: 344, height: 882, isMobile: true },// dobrável fechado (Z Fold)
  { name: 'fold', width: 884, height: 1104, isMobile: true },      // dobrável aberto
  { name: 'tablet', width: 768, height: 1024, isMobile: true },
  { name: 'laptop', width: 1366, height: 657, isMobile: false },   // notebook baixo (viewport real)
  { name: 'desktop', width: 1280, height: 800, isMobile: false },
  { name: 'desktop-lg', width: 1920, height: 1080, isMobile: false },
];

// Filtros: node visual-check.mjs [viewport,viewport] [rota,rota]
const vpFilter = process.argv[2]?.split(',');
const routeFilter = process.argv[3]?.split(',');
const viewports = vpFilter && vpFilter[0] !== 'all'
  ? VIEWPORTS.filter((v) => vpFilter.includes(v.name))
  : VIEWPORTS;

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const problems = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      // Evita que vídeos/áudio autoplay atrapalhem a captura
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    const routes = routeFilter ? ROUTES.filter((r) => routeFilter.includes(r.name)) : ROUTES;
    for (const route of routes) {
      const url = BASE_URL + route.path;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      } catch {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      }
      // Dá tempo pra fontes/animações assentarem
      await page.waitForTimeout(1200);

      // Detecta overflow horizontal (sintoma clássico de quebra no mobile)
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          scrollW: de.scrollWidth,
          clientW: de.clientWidth,
          hasHorizontal: de.scrollWidth > de.clientWidth + 1,
        };
      });
      if (overflow.hasHorizontal) {
        problems.push(
          `[${vp.name}] ${route.path}: overflow horizontal (scrollW=${overflow.scrollW} > clientW=${overflow.clientW})`
        );
      }

      // Checagem das barras (about/socials): título cortado, título
      // escondido pela quebra de linha, barra saindo da tela e colisão
      // com a lista de links / nav.
      const barIssues = await page.evaluate(() => {
        const out = [];
        const vw = document.documentElement.clientWidth;
        const rect = (el) => el.getBoundingClientRect();
        const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        const bars = [...document.querySelectorAll('.sc-bar-content')];
        bars.forEach((content, i) => {
          const c = rect(content);
          const bar = rect(content.closest('.sc-bar-outer'));
          if (bar.right > vw + 1) out.push(`barra ${i} sai da tela (${Math.round(bar.right)} > ${vw})`);
          const main = content.querySelector('.sc-main');
          const label = content.querySelector('.sc-label');
          if (main && rect(main).top >= c.bottom - 1) out.push(`barra ${i}: título escondido (quebrou linha)`);
          if (main && label) {
            const m = rect(main), l = rect(label);
            if (l.left < m.left - 1 || l.right > m.right + 1) out.push(`barra ${i}: título "${label.textContent.trim()}" maior que a área (${Math.round(l.width)} > ${Math.round(m.width)})`);
          }
          const stats = content.querySelector('.sc-stats');
          if (stats) out.push(`barra ${i}: stats ${rect(stats).top >= c.bottom - 1 ? 'ocultos' : 'visíveis'}`);
        });
        const info = document.querySelector('.info-bars-container');
        const nav = document.querySelector('.social-nav');
        const outers = [...document.querySelectorAll('.sc-bar-outer')].map(rect);
        if (info && outers.some((b) => hit(b, rect(info)))) out.push('lista de links colide com as barras');
        if (nav && info && hit(rect(nav), rect(info))) out.push('nav colide com a lista de links');
        return out;
      });
      for (const issue of barIssues) {
        const tag = issue.includes('stats') ? 'info' : 'PROBLEMA';
        if (tag === 'PROBLEMA') problems.push(`[${vp.name}] ${route.path}: ${issue}`);
        else console.log(`  [${vp.name}] ${route.path}: ${issue}`);
      }

      const file = join(OUT_DIR, `${route.name}--${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });

      // Também captura a "dobra" (viewport real) para ver elementos fixos
      // como o usuário os vê, sem o efeito de fullPage.
      if (process.env.FOLD === '1') {
        await page.evaluate(() => window.scrollTo(0, 0));
        const foldFile = join(OUT_DIR, `${route.name}--${vp.name}--fold.png`);
        await page.screenshot({ path: foldFile, fullPage: false });
      }
      console.log(`captured ${route.name} @ ${vp.name}`);
    }

    await context.close();
  }

  await browser.close();

  console.log('\n==== RESUMO ====');
  if (problems.length === 0) {
    console.log('Nenhum overflow horizontal detectado.');
  } else {
    console.log('Problemas detectados:');
    for (const p of problems) console.log('  - ' + p);
  }
  console.log(`\nScreenshots salvos em: ${OUT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
