/**
 * Script que roda no build/CI pra buscar atividade do GitHub com token autenticado.
 * Busca commits recentes de todos os repos públicos.
 * Gera um JSON estático em src/lib/data/github-activity.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Carrega .env local se existir
try {
  const envPath = resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  }
} catch {}

const GITHUB_USER = 'LucasBoeck23';
const TOKEN = process.env.GH_ACTIVITY_TOKEN;
const OUTPUT = 'src/lib/data/github-activity.json';

const headers = { 'Accept': 'application/vnd.github+json' };
if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  return res.json();
}

async function main() {
  console.log(`Fetching GitHub activity for ${GITHUB_USER}...`);
  console.log(`Token: ${TOKEN ? 'present' : 'missing (using public API)'}`);

  // Carrega dados existentes pra acumular histórico
  let byDay = {};
  try {
    const existing = readFileSync(OUTPUT, 'utf-8');
    byDay = JSON.parse(existing);
  } catch {}

  // 1. Busca repos públicos
  const repos = await fetchJSON(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=50&sort=pushed`);
  console.log(`Found ${repos.length} repos`);

  // 2. Busca commits recentes de cada repo (últimos 90 dias)
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  for (const repo of repos) {
    const repoName = repo.name;
    const commits = await fetchJSON(
      `https://api.github.com/repos/${GITHUB_USER}/${repoName}/commits?per_page=100&since=${since}`
    );

    if (!Array.isArray(commits)) continue;

    for (const commit of commits) {
      const utcDate = commit.commit.author.date;
      // Agrupa pela data local (America/Sao_Paulo) pra exibir corretamente
      const localDate = new Date(utcDate).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      const date = localDate; // YYYY-MM-DD no fuso BR
      const sha = commit.sha.slice(0, 7);

      if (!byDay[date]) {
        byDay[date] = { date, events: [], commitCount: 0, repos: [] };
      }

      const day = byDay[date];

      // Evita duplicatas (mesmo sha)
      const exists = day.events.some(e => e.commits.some(c => c.sha === sha));
      if (exists) continue;

      day.commitCount++;

      if (!day.repos.includes(repoName)) {
        day.repos.push(repoName);
      }

      day.events.push({
        type: 'PushEvent',
        time: utcDate, // ISO completo, browser converte pro local
        repo: repoName,
        commits: [{
          sha,
          message: commit.commit.message.split('\n')[0],
        }],
      });
    }
  }

  // Ordena eventos por hora dentro de cada dia (mais recente primeiro)
  for (const day of Object.values(byDay)) {
    day.events.sort((a, b) => b.time.localeCompare(a.time));
    // Recalcula commitCount
    day.commitCount = day.events.reduce((sum, e) => sum + e.commits.length, 0);
  }

  const days = Object.keys(byDay).length;
  const totalCommits = Object.values(byDay).reduce((sum, d) => sum + d.commitCount, 0);

  writeFileSync(OUTPUT, JSON.stringify(byDay, null, 2));
  console.log(`Done! ${days} days, ${totalCommits} commits → ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
