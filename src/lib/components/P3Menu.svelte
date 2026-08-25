<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { MENU_ITEMS } from '$lib/data/menu-items';
  import { useKeyboardNav } from '$lib/utils/use-keyboard-nav.svelte';

  const nav = useKeyboardNav({
    itemCount: MENU_ITEMS.length,
    onSelect: (i) => navigateTo(MENU_ITEMS[i]),
  });

  // Alias for template readability
  let active = $derived(nav.active);
  let mounted = $derived(nav.mounted);

  function getOpacity(index: number): number {
    if (index === active) return 1;
    return Math.max(0.5, 1 - Math.abs(index - active) * 0.2);
  }

  function getClipPath(width: number, height: number): string {
    return `polygon(0px 0px, ${width}px ${height * 0.5}px, 0px ${height}px)`;
  }

  function estimateWidth(label: string, fontSize: number): number {
    return label.length * fontSize * 0.6 + 80;
  }

  function estimateHeight(fontSize: number): number {
    return fontSize * 0.94;
  }

  function navigateTo(item: typeof MENU_ITEMS[number]) {
    if (item.external) {
      window.open(item.page, '_blank');
    } else {
      goto(base + item.page);
    }
  }
</script>

<div class="p3-overlay">
  <div class="p3-name-tag">
    <span class="p3-name-first">Portifolio</span>
    <span>do Boeck</span>
  </div>



  <nav class="p3-menu">
    {#each MENU_ITEMS as item, i}
      {@const isActive = active === i}
      {@const opacity = getOpacity(i)}
      {@const estW = estimateWidth(item.label, item.fontSize)}
      {@const estH = estimateHeight(item.fontSize)}
      {@const clipPath = getClipPath(estW, estH)}
      <div
        class="p3-row"
        class:active={isActive}
        class:mounted
        style:margin-right="{item.offsetX}px"
        style:margin-top="{item.offsetY}px"
        style:transition-delay="{i * 80}ms"
        role="menuitem"
        tabindex="-1"
        onmouseenter={() => (nav.active = i)}
        onclick={() => navigateTo(item)}
        onkeydown={(e) => { if (e.key === 'Enter') navigateTo(item); }}
      >
        <div class="p3-glow"></div>
        <div
          class="p3-skew-wrap"
          style:transform="skewX({item.skewX}deg) skewY({item.skewY}deg)"
        >
          <div
            class="p3-shadow-tri"
            class:pop={isActive}
            style:width="{estW}px"
            style:height="{estH}px"
            style:clip-path={clipPath}
          ></div>
          <div
            class="p3-highlight"
            style:width="{estW}px"
            style:height="{estH}px"
            style:clip-path={clipPath}
            style:transform="translateY(-50%) scaleX({isActive ? 1 : 0})"
          ></div>
          <div class="p3-label-wrap" style:opacity={opacity}>
            <span
              class="p3-label-base p3-label-dark"
              style:font-size="{item.fontSize}px"
            >
              {item.label}
            </span>
            <span
              class="p3-label-base p3-label-bright"
              style:font-size="{item.fontSize}px"
              style:clip-path={clipPath}
            >
              {item.label}
            </span>
          </div>
        </div>
      </div>
    {/each}
  </nav>
</div>

<style>
  .p3-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .p3-name-tag {
    position: absolute;
    top: 18px;
    left: 22px;
    z-index: 20;
    font-family: 'Anton', sans-serif;
    font-style: italic;
    font-size: clamp(48px, 8vw, 108px);
    line-height: 0.88;
    letter-spacing: 2px;
    color: rgba(10, 10, 14, 0.64);
    transform: rotate(18deg);
    transform-origin: left top;
    user-select: none;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .p3-name-first {
    color: rgba(0, 0, 0, 0.86);
  }



  .p3-menu {
    position: relative;
    z-index: 20;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: all;
    transform: scale(var(--ui-scale, 1));
    transform-origin: center center;
  }

  .p3-row {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    text-decoration: none;
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .p3-row.mounted {
    opacity: 1;
    transform: translateX(0);
  }

  .p3-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(255, 100, 180, 0.35) 0%, transparent 70%);
    filter: blur(18px);
    z-index: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .p3-row.active .p3-glow {
    opacity: 1;
  }

  .p3-skew-wrap {
    position: relative;
    display: flex;
    align-items: center;
    isolation: isolate;
  }

  @keyframes p3-shadow-pop {
    0% {
      transform: translateY(-40%) translateX(-12px) scaleX(0) scaleY(1);
    }
    55% {
      transform: translateY(-46%) translateX(-15px) scaleX(1.22) scaleY(1.18);
    }
    75% {
      transform: translateY(-39%) translateX(-11px) scaleX(0.96) scaleY(0.97);
    }
    100% {
      transform: translateY(-40%) translateX(-12px) scaleX(1) scaleY(1);
    }
  }

  .p3-shadow-tri {
    position: absolute;
    top: 50%;
    transform-origin: left center;
    background: rgba(235, 80, 120, 0.85);
    z-index: 1;
    pointer-events: none;
    transform: translateY(-40%) translateX(-12px) scaleX(0);
    transition: transform 0.18s ease;
  }

  .p3-shadow-tri.pop {
    animation: p3-shadow-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .p3-highlight {
    position: absolute;
    top: 50%;
    transform-origin: left center;
    background: #ffffff;
    z-index: 2;
    transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }

  .p3-label-wrap {
    position: relative;
    z-index: 3;
  }

  .p3-label-base {
    font-family: 'Bebas Neue', sans-serif;
    font-style: italic;
    letter-spacing: 2px;
    line-height: 0.85;
    display: block;
    white-space: nowrap;
    user-select: none;
  }

  .p3-label-dark {
    color: #3ce2ff;
    transition: color 0.12s ease;
  }

  .p3-row.active .p3-label-dark {
    color: #6b0010;
  }

  .p3-label-bright {
    color: #ff2a2a;
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.12s ease;
  }

  .p3-row.active .p3-label-bright {
    opacity: 1;
  }
</style>
