<script lang="ts">
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import AboutBars from '$lib/components/AboutBars.svelte';
  import RevealPanel from '$lib/components/RevealPanel.svelte';
  import { ABOUT_ITEMS } from '$lib/data/about-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';
  import bgLoop from '$assets/videos/p3-bg-loop.webm';

  let revealed = $state(false);

  const nav = useKeyboardNav({
    itemCount: ABOUT_ITEMS.length,
    onBack: () => history.back(),
  });

  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (revealed) {
        if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault();
          revealed = false;
        }
        return;
      }
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        revealed = true;
        return;
      }
      if (nav.handleKey(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<VideoBackground src={bgLoop} />
<AboutBars active={nav.active} mounted={nav.mounted} />
<RevealPanel item={ABOUT_ITEMS[nav.active]} visible={revealed} />
