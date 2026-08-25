<script lang="ts">
  import SocialBars from '$lib/components/SocialBars.svelte';
  import SocialNav from '$lib/components/SocialNav.svelte';
  import SocialInfoBars from '$lib/components/SocialInfoBars.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import { SOCIAL_PLATFORMS } from '$lib/data/social-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';

  let activeInfoBar = $state(-1);
  let toastMessage = $state('');
  let toastVisible = $state(false);

  function showToast(msg: string) {
    toastMessage = msg;
    toastVisible = true;
    setTimeout(() => (toastVisible = false), 2000);
  }

  function handlePlatformClick(i: number) {
    const platform = SOCIAL_PLATFORMS[i];
    if (platform.href.startsWith('mailto:')) {
      window.location.href = platform.href;
    } else if (platform.href.startsWith('http')) {
      window.open(platform.href, '_blank');
    } else {
      navigator.clipboard.writeText(platform.handle);
      showToast(`"${platform.handle}" copiado!`);
    }
  }

  const nav = useKeyboardNav({
    itemCount: SOCIAL_PLATFORMS.length,
    onBack: () => history.back(),
    onSelect: handlePlatformClick,
  });

  let activePlatform = $derived(SOCIAL_PLATFORMS[nav.active] ?? SOCIAL_PLATFORMS[0]);
</script>

<SocialBars
  active={nav.active}
  mounted={nav.mounted}
  onhover={(i) => { nav.active = i; activeInfoBar = -1; }}
  onclick={handlePlatformClick}
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

{#if toastVisible}
  <div class="toast">{toastMessage}</div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 999;
    animation: toast-in 0.3s ease;
    pointer-events: none;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
