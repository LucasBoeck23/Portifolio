<script lang="ts">
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import SocialBars from '$lib/components/SocialBars.svelte';
  import SocialNav from '$lib/components/SocialNav.svelte';
  import SocialInfoBars from '$lib/components/SocialInfoBars.svelte';
  import KeyboardHints from '$lib/components/KeyboardHints.svelte';
  import { SOCIAL_PLATFORMS } from '$lib/data/social-items';
  import { clampIndex } from '$lib/utils/keyboard';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';
  import bgLoop from '$assets/videos/p3-bg-loop.webm';

  let focus = $state<'left' | 'right'>('left');
  let activeInfoBar = $state(0);

  const nav = useKeyboardNav({
    itemCount: SOCIAL_PLATFORMS.length,
    onBack: () => history.back(),
  });

  let activePlatform = $derived(SOCIAL_PLATFORMS[nav.active]);

  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (focus === 'left') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          focus = 'right';
          activeInfoBar = 0;
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          window.open(activePlatform.href, '_blank');
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          if (nav.handleKey(e.key)) {
            e.preventDefault();
            activeInfoBar = 0; // reset right panel when changing platform
          }
          return;
        }
        if (nav.handleKey(e.key)) {
          e.preventDefault();
        }
      } else {
        // focus === 'right'
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeInfoBar = clampIndex(activeInfoBar, 'up', activePlatform.infoBars.length - 1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeInfoBar = clampIndex(activeInfoBar, 'down', activePlatform.infoBars.length - 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          focus = 'left';
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const bar = activePlatform.infoBars[activeInfoBar];
          if (bar) window.open('https://' + bar.link, '_blank');
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault();
          focus = 'left';
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<VideoBackground src={bgLoop} />
<SocialBars active={nav.active} mounted={nav.mounted} />
<SocialNav platformLabel={activePlatform.label} />
<SocialInfoBars infoBars={activePlatform.infoBars} activeIndex={activeInfoBar} focused={focus === 'right'} />
<KeyboardHints />
