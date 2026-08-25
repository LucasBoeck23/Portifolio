<script lang="ts">
  import ActivityCalendar from '$lib/components/ActivityCalendar.svelte';
  import ActivityDetail from '$lib/components/ActivityDetail.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { loadActivity, type DayActivity } from '$lib/utils/github';
  import trainBg from '$assets/videos/bg-log.webm';

  const activities = loadActivity();
  let selectedDate = $state(new Date().toISOString().slice(0, 10));

  let selectedDay = $derived(activities.get(selectedDate) ?? null);
</script>

<div class="log-page">
  <video class="log-bg-video" autoplay loop muted playsinline preload="auto">
    <source src={trainBg} type="video/webm" />
  </video>

  <div class="log-header">
    <div class="log-title">DIÁRIO DE BORDO</div>
    <div class="log-subtitle">Registro de atividades no GitHub</div>
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
    z-index: 0;
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
</style>
