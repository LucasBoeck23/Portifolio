import activityData from '$lib/data/github-activity.json';

export interface GitHubCommit {
  sha: string;
  message: string;
}

export interface GitHubEventEntry {
  type: string;
  time: string;
  repo: string;
  commits: GitHubCommit[];
}

export interface DayActivity {
  date: string;
  events: GitHubEventEntry[];
  commitCount: number;
  repos: string[];
}

interface RawEvent {
  type: string;
  time: string;
  repo: string;
  sha: string;
  message: string;
}

/**
 * Retorna a data local (YYYY-MM-DD) de um timestamp ISO UTC,
 * usando o fuso horário do navegador do visitante.
 */
function toLocalDate(isoUtc: string): string {
  const d = new Date(isoUtc);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna "hoje" no fuso local do navegador (YYYY-MM-DD).
 */
export function getLocalToday(): string {
  return toLocalDate(new Date().toISOString());
}

/**
 * Carrega os eventos do JSON estático e agrupa por dia
 * usando o fuso horário local do navegador.
 */
export function loadActivity(): Map<string, DayActivity> {
  const raw = activityData as RawEvent[];
  const map = new Map<string, DayActivity>();

  for (const event of raw) {
    const date = toLocalDate(event.time);

    if (!map.has(date)) {
      map.set(date, { date, events: [], commitCount: 0, repos: [] });
    }

    const day = map.get(date)!;

    // Agrupa commits do mesmo repo+hora num único EventEntry,
    // ou cria um novo entry por commit (mantém granularidade)
    day.events.push({
      type: event.type,
      time: event.time,
      repo: event.repo,
      commits: [{ sha: event.sha, message: event.message }],
    });

    day.commitCount++;

    if (!day.repos.includes(event.repo)) {
      day.repos.push(event.repo);
    }
  }

  // Ordena eventos dentro de cada dia (mais recente primeiro)
  for (const day of map.values()) {
    day.events.sort((a, b) => b.time.localeCompare(a.time));
  }

  return map;
}

export function getEventLabel(event: GitHubEventEntry): string {
  switch (event.type) {
    case 'PushEvent': {
      const count = event.commits.length;
      if (count > 0) return `${count} commit${count > 1 ? 's' : ''} em ${event.repo}`;
      return `Push em ${event.repo}`;
    }
    case 'CreateEvent':
      return `Criou branch/repo em ${event.repo}`;
    case 'DeleteEvent':
      return `Deletou branch em ${event.repo}`;
    case 'PullRequestEvent':
      return `Pull Request em ${event.repo}`;
    case 'IssuesEvent':
      return `Issue em ${event.repo}`;
    case 'WatchEvent':
      return `Starred ${event.repo}`;
    default:
      return `${event.type.replace('Event', '')} em ${event.repo}`;
  }
}
