<script lang="ts">
  import ResumeCards from '$lib/components/ResumeCards.svelte';
  import ResumeDetail from '$lib/components/ResumeDetail.svelte';
  import { RESUME_CATEGORIES } from '$lib/data/resume-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';

  let circleRevealed = $state(false);

  const nav = useKeyboardNav({
    itemCount: RESUME_CATEGORIES.length,
    onBack: () => history.back(),
  });

  // Circle reveal animation on mount
  $effect(() => {
    const timer = setTimeout(() => (circleRevealed = true), 100);
    return () => clearTimeout(timer);
  });

  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        history.back();
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

<div class="resume-page" class:circle-revealed={circleRevealed}>
  <div class="circle-bg"></div>
  <ResumeCards active={nav.active} mounted={nav.mounted} />
  <ResumeDetail category={RESUME_CATEGORIES[nav.active]} />
</div>

<style>
  .resume-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .circle-bg {
    position: fixed;
    inset: 0;
    background: #0047FF;
    z-index: 1;
    clip-path: circle(0% at 50% 50%);
    transition: clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .resume-page.circle-revealed .circle-bg {
    clip-path: circle(150vmax at 50% 50%);
  }
</style>
