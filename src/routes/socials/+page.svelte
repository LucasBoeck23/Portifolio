<script lang="ts">
  import VideoBackground from '$lib/components/VideoBackground.svelte';
  import SocialBars from '$lib/components/SocialBars.svelte';
  import SocialNav from '$lib/components/SocialNav.svelte';
  import SocialInfoBars from '$lib/components/SocialInfoBars.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { SOCIAL_PLATFORMS } from '$lib/data/social-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';
  import bgLoop from '$assets/videos/p3-bg-loop.webm';

  let activeInfoBar = $state(-1);

  const nav = useKeyboardNav({
    itemCount: SOCIAL_PLATFORMS.length,
    onBack: () => history.back(),
    onSelect: (i) => window.open(SOCIAL_PLATFORMS[i].href, '_blank'),
  });

  let activePlatform = $derived(SOCIAL_PLATFORMS[nav.active] ?? SOCIAL_PLATFORMS[0]);
</script>

<VideoBackground src={bgLoop} />
<SocialBars
  active={nav.active}
  mounted={nav.mounted}
  onhover={(i) => { nav.active = i; activeInfoBar = -1; }}
  onclick={(i) => window.open(SOCIAL_PLATFORMS[i].href, '_blank')}
/>
<SocialNav platformLabel={activePlatform.label} />
<SocialInfoBars
  infoBars={activePlatform.infoBars}
  activeIndex={activeInfoBar}
  focused={true}
  onhover={(i) => (activeInfoBar = i)}
  onleave={() => (activeInfoBar = -1)}
  onclick={(i) => {
    const bar = activePlatform.infoBars[i];
    if (bar) window.open('https://' + bar.link, '_blank');
  }}
/>
<BackButton />
