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

{#if showMainBg}
  <VideoBackground src={bgLoop} />
{/if}
<MusicPlayer />
{@render children()}
