<script lang="ts">
  import type { DayActivity } from '$lib/utils/github';
  import { getEventLabel } from '$lib/utils/github';

  let { day }: { day: DayActivity | null } = $props();

  const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  function formatDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00');
    const weekday = WEEKDAYS_FULL[d.getDay()];
    const dayNum = d.getDate();
    const month = d.getMonth() + 1;
    return `${weekday}, ${String(dayNum).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
  }
</script>

{#if day}
  <div class="detail-panel">
    <!-- Header bar -->
    <div class="detail-top">
      <div class="detail-top-left">
        <div class="detail-date">{formatDate(day.date)}</div>
        <div class="detail-badges">
          <span class="badge push">{day.commitCount} commit{day.commitCount !== 1 ? 's' : ''}</span>
          <span class="badge repo">{day.repos.length} repositório{day.repos.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div class="detail-top-right">
        <div class="detail-repos-list">
          {#each day.repos as repo}
            <span class="repo-chip">{repo}</span>
          {/each}
        </div>
      </div>
    </div>

    <!-- Event list -->
    <div class="event-list">
      {#each day.events as event, i}
        <div class="event-item" style:animation-delay="{i * 40}ms">
          <div class="event-index">{String(i + 1).padStart(2, '0')}</div>
          <div class="event-bar">
            <div class="event-bar-header">
              <span class="event-time">{event.time}</span>
              <span class="event-type">{getEventLabel(event)}</span>
            </div>
            {#if event.type === 'PushEvent' && event.commits.length > 0}
              <div class="event-commits">
                {#each event.commits.slice(0, 4) as commit}
                  <div class="commit-line">
                    <span class="commit-sha">{commit.sha}</span>
                    <span class="commit-msg">{commit.message}</span>
                  </div>
                {/each}
                {#if event.commits.length > 4}
                  <div class="commit-line more">+{event.commits.length - 4} mais</div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .detail-panel {
    background: rgba(5, 10, 40, 0.9);
    clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    padding: 0;
    overflow-y: auto;
    max-height: 75vh;
    scrollbar-width: thin;
    scrollbar-color: rgba(60, 226, 255, 0.4) transparent;
  }

  /* Top header */
  .detail-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 22px 14px;
    background: linear-gradient(90deg, #3ce2ff 0%, #7af0ff 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
  }

  .detail-top-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .detail-date {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 1px;
    color: #0a0e2a;
    line-height: 1;
  }

  .detail-badges {
    display: flex;
    gap: 6px;
  }

  .badge {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    color: #fff;
    clip-path: polygon(0 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
  }

  .badge.push { background: #c4001a; }
  .badge.repo { background: #0a0e2a; }

  .detail-top-right {
    display: flex;
    align-items: center;
  }

  .detail-repos-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .repo-chip {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0a0e2a;
    background: rgba(255, 255, 255, 0.6);
    padding: 2px 8px;
    border-radius: 2px;
    letter-spacing: 0.5px;
  }

  /* Event list */
  .event-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 8px 16px;
  }

  .event-item {
    display: flex;
    align-items: stretch;
    gap: 0;
    opacity: 0;
    animation: event-slide-in 0.3s ease forwards;
  }

  @keyframes event-slide-in {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .event-index {
    flex-shrink: 0;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    color: #3ce2ff;
    letter-spacing: 1px;
  }

  .event-bar {
    flex: 1;
    background: rgba(10, 18, 60, 0.4);
    border-left: 3px solid #3ce2ff;
    padding: 10px 14px;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    transition: background 0.15s ease;
  }

  .event-bar:hover {
    background: rgba(20, 35, 100, 0.6);
  }

  .event-bar-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .event-time {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    color: #3ce2ff;
    letter-spacing: 1px;
    flex-shrink: 0;
  }

  .event-type {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 0.3px;
  }

  /* Commits inside event */
  .event-commits {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(60, 226, 255, 0.12);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .commit-line {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 0;
  }

  .commit-sha {
    font-family: 'Montserrat', monospace;
    font-size: 11px;
    font-weight: 400;
    color: rgba(60, 226, 255, 0.6);
    flex-shrink: 0;
    background: rgba(60, 226, 255, 0.08);
    padding: 1px 6px;
    border-radius: 2px;
  }

  .commit-msg {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.65);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .commit-line.more {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
    padding-left: 4px;
  }
</style>
