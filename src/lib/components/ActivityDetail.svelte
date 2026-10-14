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

  function formatTime(isoOrTime: string): string {
    // Se for ISO completo, converte pro fuso local
    if (isoOrTime.length > 5) {
      const d = new Date(isoOrTime);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    // Fallback: já é HH:MM
    return isoOrTime;
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
              <span class="event-time">{formatTime(event.time)}</span>
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
{:else}
  <!-- Estado vazio: antes o painel simplesmente sumia -->
  <div class="detail-empty">
    <span class="detail-empty-tag">SEM REGISTROS</span>
    <p class="detail-empty-text">Nenhuma atividade no GitHub neste dia.</p>
    <p class="detail-empty-hint">Os dias com atividade aparecem marcados no calendário.</p>
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

  /* Estado vazio */
  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 20px 22px 22px;
    background: rgba(5, 10, 40, 0.9);
    border-left: 4px solid #c4001a;
    clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
  }
  .detail-empty-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 3px;
    color: #fff;
    background: #c4001a;
    padding: 2px 12px 0 8px;
    clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  }
  .detail-empty-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    line-height: 1.05;
    color: #fff;
  }
  .detail-empty-hint {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
  }
  .commit-line.more {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
    padding-left: 4px;
  }

  /* =====================================================
     Mobile + tablet: painel cresce com o conteúdo (a página
     rola), cabeçalho empilhado e textos maiores pra toque.
     ===================================================== */
  @media (max-width: 900px) {
    .detail-panel {
      max-height: none;
      overflow: visible;
      clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
    }
    .detail-top {
      flex-direction: column;
      gap: 10px;
      padding: 14px 24px 14px 16px;
      clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
    }
    .detail-date {
      font-size: 30px;
    }
    .badge {
      font-size: 13px;
      padding: 3px 10px 3px 8px;
    }
    .repo-chip {
      font-size: 13px;
      background: rgba(10, 14, 42, 0.85);
      color: #7af0ff;
    }
    .event-list {
      gap: 8px;
      padding: 12px 10px 16px 6px;
    }
    .event-index {
      width: 30px;
      align-items: flex-start;
      padding-top: 12px;
      font-size: 17px;
    }
    .event-bar {
      background: rgba(10, 18, 60, 0.75);
      padding: 10px 18px 10px 12px;
    }
    .event-bar-header {
      flex-wrap: wrap;
      gap: 2px 10px;
    }
    .event-type {
      font-size: 16px;
    }
    .commit-line {
      align-items: flex-start;
    }
    .commit-sha {
      margin-top: 2px;
    }
    /* No celular a mensagem quebra em até 2 linhas em vez de cortar */
    .commit-msg {
      font-size: 15px;
      line-height: 1.25;
      color: rgba(255, 255, 255, 0.8);
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .detail-empty {
      padding: 16px 22px 18px 16px;
    }
    .detail-empty-text {
      font-size: 24px;
    }
  }
</style>
