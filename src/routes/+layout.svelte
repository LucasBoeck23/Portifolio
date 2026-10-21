<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import bgLoop from '$assets/videos/bg-main.webm';
  import bgLoopMp4 from '$assets/videos/bg-main.mp4';
  import bgPoster from '$assets/images/bg-main-poster.webp';

  // MusicPlayer é carregado de forma preguiçosa (lazy): não faz parte do
  // caminho crítico da primeira pintura. É montado após a hidratação.
  let MusicPlayer = $state<typeof import('$lib/components/MusicPlayer.svelte').default | null>(null);

  let { children } = $props();

  // Páginas que usam o vídeo de fundo principal
  let showMainBg = $derived(
    !$page.url.pathname.includes('/log') && !$page.url.pathname.includes('/resume')
  );

  onMount(() => {
    // Remove splash screen after hydration
    const splash = document.getElementById('splash');
    if (splash) {
      splash.addEventListener('animationend', () => {
        splash.remove();
      });
      setTimeout(() => splash.remove(), 3000);
    }

    // Carrega o player de música depois do primeiro paint, sem bloquear a
    // landing. requestIdleCallback quando disponível; senão, um pequeno delay.
    const loadPlayer = () =>
      import('$lib/components/MusicPlayer.svelte').then((m) => {
        MusicPlayer = m.default;
      });
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadPlayer, { timeout: 2000 });
    } else {
      setTimeout(loadPlayer, 800);
    }
  });
</script>

<svelte:head>
  {#if showMainBg}
    <!-- Dispara o download do vídeo de fundo o quanto antes, com prioridade
         alta, sem esperar o <video> ser montado na hidratação. -->
    <link rel="preload" as="video" href={bgLoop} type="video/webm" fetchpriority="high" />
  {/if}
  <!-- Pré-carrega apenas as 2 fontes do caminho crítico da landing
       (Anton = name-tag, Bebas Neue = labels do menu). As outras 10 fontes
       pertencem a sub-rotas e carregam sob demanda. -->
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    href="{base}/fonts/anton-v27-latin-regular.woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    href="{base}/fonts/bebas-neue-v16-latin-regular.woff2"
    crossorigin="anonymous"
  />
</svelte:head>

{#if showMainBg}
  <VideoBackground src={bgLoop} fallback={bgLoopMp4} poster={bgPoster} />
{/if}
{#if MusicPlayer}
  <MusicPlayer />
{/if}
{@render children()}
