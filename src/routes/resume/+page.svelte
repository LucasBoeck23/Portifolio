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
</script>

<div class="resume-page" class:circle-revealed={circleRevealed}>
  <div class="circle-bg"></div>
  <ResumeCards active={nav.active} mounted={nav.mounted} onhover={(i) => (nav.active = i)} />
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
</style>
