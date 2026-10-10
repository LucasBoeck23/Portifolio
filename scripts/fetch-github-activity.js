/**
 * Script que roda no build/CI pra buscar atividade do GitHub com token autenticado.
 * Busca commits recentes de todos os repos públicos.
 * Gera um JSON estático (array flat de eventos com timestamps UTC).
 * O agrupamento por dia é feito no frontend pelo fuso do visitante.
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
  let events = [];
  try {
    const existing = readFileSync(OUTPUT, 'utf-8');
    events = JSON.parse(existing);
    if (!Array.isArray(events)) events = [];
  } catch {}

  // Set de shas existentes pra evitar duplicatas
  const existingShas = new Set(events.map(e => e.sha));

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
      const sha = commit.sha.slice(0, 7);

      // Evita duplicatas
      if (existingShas.has(sha)) continue;
      existingShas.add(sha);

      events.push({
        type: 'PushEvent',
        time: commit.commit.author.date, // ISO UTC completo
        repo: repoName,
        sha,
        message: commit.commit.message.split('\n')[0],
      });
    }
  }

  // Remove eventos mais antigos que 90 dias
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  events = events.filter(e => e.time >= cutoff);

  // Ordena por tempo (mais recente primeiro)
  events.sort((a, b) => b.time.localeCompare(a.time));

  writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
  console.log(`Done! ${events.length} events → ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
