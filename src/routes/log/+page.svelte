<script lang="ts">
  import ActivityCalendar from '$lib/components/ActivityCalendar.svelte';
  import ActivityDetail from '$lib/components/ActivityDetail.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { loadActivity, getLocalToday, type DayActivity } from '$lib/utils/github';
  import trainBg from '$assets/videos/bg-log.webm';

  const activities = loadActivity();

  // Abre em hoje se houver atividade; senão, no último dia com atividade
  // (evita a primeira impressão de "SEM REGISTROS").
  const today = getLocalToday();
  const activeDates = [...activities.keys()].sort();
  const latestActive = activeDates.filter((d) => d <= today).at(-1);
  let selectedDate = $state(activities.has(today) || !latestActive ? today : latestActive);

  let selectedDay = $derived(activities.get(selectedDate) ?? null);

  // Resumo do período coberto pelos dados
  const totalCommits = [...activities.values()].reduce((sum, d) => sum + d.commitCount, 0);
  const totalRepos = new Set([...activities.values()].flatMap((d) => d.repos)).size;
</script>

<svelte:head>
  <title>Diário de Bordo · Lucas Boeck</title>
</svelte:head>

<div class="log-page">
  <video class="log-bg-video" autoplay loop muted playsinline preload="auto">
    <source src={trainBg} type="video/webm" />
  </video>

  <div class="log-header">
    <div class="log-title">DIÁRIO DE BORDO</div>
    <div class="log-subtitle">Atividade em repositórios públicos do GitHub</div>
    {#if totalCommits > 0}
      <div class="log-summary">
        {totalCommits} commit{totalCommits !== 1 ? 's' : ''} em {totalRepos} repositório{totalRepos !== 1 ? 's' : ''} nos últimos meses
      </div>
    {/if}
  </div>

  <div class="log-content">
    <div class="log-left">
      <ActivityCalendar {activities} {selectedDate} onselect={(d) => (selectedDate = d)} />
    </div>

    <div class="log-right">
      <ActivityDetail day={selectedDay} />
    </div>
  </div>
</div>
<BackButton />

<style>
  .log-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .log-bg-video {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .log-header {
    position: relative;
    z-index: 10;
    padding: 32px 40px 16px;
    background: rgba(0, 0, 0, 0.6);
    transform: scale(var(--ui-scale, 1));
    transform-origin: top left;
    animation: header-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    opacity: 0;
  }

  @keyframes header-in {
    from { opacity: 0; transform: scale(var(--ui-scale, 1)) translateX(-30px); }
    to { opacity: 1; transform: scale(var(--ui-scale, 1)) translateX(0); }
  }

  .log-title {
    font-family: 'Anton', sans-serif;
    font-size: 64px;
    line-height: 0.9;
    color: #fff;
    letter-spacing: 2px;
    text-shadow: 4px 4px 0 rgba(196, 0, 26, 0.6);
  }

  .log-subtitle {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    color: #fff;
    letter-spacing: 2px;
    margin-top: 4px;
    text-transform: uppercase;
  }

  .log-summary {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  .log-content {
    position: relative;
    z-index: 10;
    flex: 1;
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 24px;
    padding: 16px 40px 40px;
    overflow: hidden;
    transform: scale(var(--ui-scale, 1));
    transform-origin: top left;
  }

  .log-left {
    display: flex;
    flex-direction: column;
    animation: left-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
    opacity: 0;
  }

  @keyframes left-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .log-right {
    min-width: 0;
    animation: right-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
    opacity: 0;
  }

  @keyframes right-in {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* ===== Mobile + foldable/tablet: single column, scrollable ===== */
  @media (max-width: 900px) {
    .log-page {
      height: auto;
      min-height: 100vh;
      overflow: visible;
    }
    /* Vídeo mais escuro embaixo pra dar contraste com o conteúdo */
    .log-page::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 1;
      background: linear-gradient(180deg, rgba(0, 8, 30, 0.15) 0%, rgba(0, 8, 30, 0.65) 55%, rgba(0, 8, 30, 0.85) 100%);
      pointer-events: none;
    }
    .log-header {
      margin: 48px 40px 0 0;
      padding: 14px 32px 12px 16px;
      background: rgba(5, 10, 40, 0.92);
      border-left: 6px solid #c4001a;
      clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
      transform: none;
      animation: header-in-mobile 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes header-in-mobile {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .log-title {
      font-size: clamp(36px, 11vw, 60px);
      text-shadow: 3px 3px 0 rgba(196, 0, 26, 0.75);
    }
    .log-subtitle {
      font-size: 13px;
      letter-spacing: 1.5px;
      color: #3ce2ff;
    }
    .log-content {
      grid-template-columns: 1fr;
      gap: 14px;
      padding: 14px 14px 96px;
      transform: none;
      overflow: visible;
    }
  }
  @media (min-width: 640px) and (max-width: 900px) {
    .log-header {
      margin: 56px 30% 0 0;
      padding: 18px 36px 16px 24px;
    }
    .log-content {
      padding: 18px 24px 104px;
      gap: 18px;
    }
  }
</style>
