<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import MusicPlayer from '$lib/components/MusicPlayer.svelte';
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import bgLoop from '$assets/videos/bg-main.webm';

  let { children } = $props();

  // Páginas que usam o vídeo de fundo principal
  let showMainBg = $derived(
    !$page.url.pathname.includes('/log') && !$page.url.pathname.includes('/resume')
  );

  // Remove splash screen after hydration
  onMount(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.addEventListener('animationend', () => {
        splash.remove();
      });
      setTimeout(() => splash.remove(), 3000);
    }
  });
</script>

<svelte:head>
  {#if showMainBg}
    <!-- Dispara o download do vídeo de fundo o quanto antes, com prioridade
         alta, sem esperar o <video> ser montado na hidratação. -->
    <link rel="preload" as="video" href={bgLoop} type="video/webm" fetchpriority="high" />
  {/if}
</svelte:head>

{#if showMainBg}
  <VideoBackground src={bgLoop} />
{/if}
<MusicPlayer />
{@render children()}
