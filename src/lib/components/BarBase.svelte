<script lang="ts">
  import type { Snippet } from 'svelte';
  import char1 from '$assets/images/char1.png';
  import char2 from '$assets/images/char2.png';
  import char3 from '$assets/images/char3.png';

  const CHARS = [char1, char2, char3];

  let { items, active = 0, mounted = false, onhover, onleave, onclick: onitemclick, content }: {
    items: { role: { text: string; color?: string } }[];
    active: number;
    mounted: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onclick?: (index: number) => void;
    content: Snippet<[{ item: any; index: number; isActive: boolean }]>;
  } = $props();
</script>

<div class="sc-root" role="navigation" onmouseleave={() => onleave?.()}>
  {#each items as item, i}
    {@const isActive = active === i}
    <div
      class="sc-bar-outer"
      class:active={isActive}
      class:mounted
      style:transition-delay="{i * 80}ms"
      onmouseenter={() => onhover?.(i)}
      onclick={() => onitemclick?.(i)}
    >
      <div class="sc-bar-red"></div>
      <div class="sc-bar">
        <img class="sc-char" src={CHARS[i]} alt="" />
        <div class="sc-bar-fill"></div>
        <div class="sc-bar-shade"></div>
        <div class="sc-bar-content">
          <div class="sc-role" style:color={item.role.color ?? '#ffffff'}>{item.role.text}</div>
          {@render content({ item, index: i, isActive })}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .sc-root {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 6px;
    padding-left: 0;
    transform: scale(var(--ui-scale, 1));
    transform-origin: left center;
  }

  .sc-bar-outer {
    position: relative;
    flex-shrink: 0;
    transform: translateX(-100%);
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
    pointer-events: all;
  }

  .sc-bar-outer.mounted {
    transform: translateX(0);
  }

  .sc-bar {
    position: relative;
    width: 45vw;
    height: 64px;
    transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    background: #111;
    clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.65);
    z-index: 1;
  }

  .sc-bar-outer.active .sc-bar {
    height: 90px;
  }

  .sc-bar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
    z-index: 10;
    pointer-events: none;
  }

  .sc-bar-red {
    position: absolute;
    top: 0;
    left: 0;
    width: 45vw;
    height: 64px;
    background: #c4001a;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
    transform: translateY(-7px);
    opacity: 0;
    transition: opacity 0.2s ease, height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
    pointer-events: none;
  }

  .sc-bar-outer.active .sc-bar-red {
    opacity: 1;
    height: 90px;
  }

  .sc-bar-fill {
    position: absolute;
    inset: 0;
    width: 100%;
    background: #ffffff;
    clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
    transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
  }

  .sc-bar-outer.active .sc-bar-fill {
    clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
  }

  .sc-bar-shade {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 73%;
    width: 6%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .sc-bar-outer.active .sc-bar-shade {
    opacity: 1;
  }

  .sc-char {
    position: absolute;
    top: 0;
    left: 110px;
    height: 100%;
    width: auto;
    max-width: 160px;
    object-fit: cover;
    object-position: top;
    pointer-events: none;
    z-index: 3;
    clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
  }

  .sc-bar-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .sc-role {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-family: 'Anton', sans-serif;
    font-size: 50px;
    letter-spacing: -2px;
    color: #ffffff;
    transform: rotate(-30deg);
    user-select: none;
    line-height: 1;
    padding: 0 16px 0 8px;
  }
</style>
