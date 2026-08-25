<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import MusicPlayer from '$lib/components/MusicPlayer.svelte';

  let { children } = $props();

  // Remove splash screen after hydration
  onMount(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      // Wait for CSS animation to finish, then remove from DOM
      splash.addEventListener('animationend', () => {
        splash.remove();
      });
      // Fallback: remove after 3s even if animationend didn't fire
      setTimeout(() => splash.remove(), 3000);
    }
  });
</script>

<MusicPlayer />
{@render children()}
