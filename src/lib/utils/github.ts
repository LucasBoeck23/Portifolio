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

export function loadActivity(): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();
  for (const [date, day] of Object.entries(activityData as Record<string, DayActivity>)) {
    map.set(date, day);
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
