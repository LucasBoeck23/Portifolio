<script lang="ts">
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import AboutBars from '$lib/components/AboutBars.svelte';
  import RevealPanel from '$lib/components/RevealPanel.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { ABOUT_ITEMS } from '$lib/data/about-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';
  import bgLoop from '$assets/videos/p3-bg-loop.webm';

  let revealed = $state(false);

  const nav = useKeyboardNav({
    itemCount: ABOUT_ITEMS.length,
    onBack: () => history.back(),
  });
</script>

<VideoBackground src={bgLoop} />
<AboutBars
  active={nav.active}
  mounted={nav.mounted}
  onhover={(i) => (nav.active = i)}
  onclick={() => (revealed = true)}
/>
<RevealPanel item={ABOUT_ITEMS[nav.active] ?? ABOUT_ITEMS[0]} visible={revealed} onclose={() => (revealed = false)} />
<BackButton />
