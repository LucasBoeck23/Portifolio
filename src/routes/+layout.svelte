<script lang="ts">
  import '../app.css';
  import TransitionOverlay from '$lib/components/transitions/TransitionOverlay.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let { children } = $props();

  let showTransition = $state(false);
  let isFirstLoad = $state(true);

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

  $effect(() => {
    const _path = $page.url.pathname;

    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }

    showTransition = true;
    const timer = setTimeout(() => {
      showTransition = false;
    }, 3200);
    return () => clearTimeout(timer);
  });
</script>

{#if showTransition}
  <TransitionOverlay />
{/if}

{@render children()}
