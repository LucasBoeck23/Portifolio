<script lang="ts">
  import ResumeCards from '$lib/components/ResumeCards.svelte';
  import ResumeDetail from '$lib/components/ResumeDetail.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { RESUME_CATEGORIES } from '$lib/data/resume-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';

  let circleRevealed = $state(false);

  const nav = useKeyboardNav({
    itemCount: RESUME_CATEGORIES.length,
    onBack: () => history.back(),
  });

  $effect(() => {
    const timer = setTimeout(() => (circleRevealed = true), 100);
    return () => clearTimeout(timer);
  });

  // Permite abrir direto numa seção: /resume?secao=projetos
  // (lido no cliente porque a página é pré-renderizada)
  $effect(() => {
    const secao = new URLSearchParams(location.search).get('secao');
    if (!secao) return;
    const idx = RESUME_CATEGORIES.findIndex(
      (c) => c.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === secao.toLowerCase()
    );
    if (idx >= 0) nav.active = idx;
  });
</script>

<svelte:head>
  <title>Currículo · Lucas Boeck</title>
</svelte:head>

<div class="resume-page" class:circle-revealed={circleRevealed}>
  <div class="circle-bg"></div>
  <!-- Cabeçalho só no mobile/tablet (no desktop o "LISTA" dos cards cumpre esse papel) -->
  <header class="resume-mobile-head" class:mounted={nav.mounted}>
    <span class="resume-mobile-kicker">LISTA</span>
    <h1 class="resume-mobile-title">CURRÍCULO</h1>
  </header>
  <ResumeCards
    active={nav.active}
    mounted={nav.mounted}
    onhover={(i) => (nav.active = i)}
    onselect={(i) => (nav.active = i)}
  />
  <ResumeDetail category={RESUME_CATEGORIES[nav.active] ?? RESUME_CATEGORIES[0]} />
</div>
<BackButton />

<style>
  .resume-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .circle-bg {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300vmax;
    height: 300vmax;
    margin-top: -150vmax;
    margin-left: -150vmax;
    background: #0047FF;
    z-index: 1;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
  }

  .resume-page.circle-revealed .circle-bg {
    transform: scale(1);
  }

  .resume-mobile-head {
    display: none;
  }
  /* ===== Mobile + foldable/tablet: título, abas fixas e detalhe ===== */
  @media (max-width: 900px) {
    .resume-page {
      height: auto;
      min-height: 100vh;
      overflow: visible;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 48px 14px 96px;
    }
    .resume-mobile-head {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      padding: 0 4px;
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .resume-mobile-head.mounted {
      opacity: 1;
      transform: none;
    }
    .resume-mobile-kicker {
      align-self: flex-start;
      margin-bottom: 6px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 4px;
      color: #041238;
      background: #85f4ff;
      padding: 2px 14px 0 10px;
      clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    }
    .resume-mobile-title {
      font-family: 'Anton', sans-serif;
      font-weight: 400;
      font-size: clamp(48px, 14vw, 84px);
      line-height: 0.92;
      letter-spacing: 1px;
      color: #f6fbff;
      text-shadow: 4px 4px 0 rgba(4, 18, 56, 0.55);
    }
  }
  @media (min-width: 640px) and (max-width: 900px) {
    .resume-page {
      padding: 56px 24px 104px;
    }
  }
</style>
