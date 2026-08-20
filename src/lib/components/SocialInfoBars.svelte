<script lang="ts">
  import type { SocialInfoBar } from '$lib/data/social-items';
  import newsign from '$assets/images/newsign.png';

  let { infoBars = [], activeIndex = 0, focused = false, onhover, onleave, onclick: onitemclick }: {
    infoBars: SocialInfoBar[];
    activeIndex: number;
    focused: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onclick?: (index: number) => void;
  } = $props();
</script>

<div class="info-bars-container" onmouseleave={() => onleave?.()}>
  {#each infoBars as bar, i}
    <div
      class="info-bar-wrap"
      class:selected={activeIndex === i}
      style:animation-delay="{i * 50}ms"
      onmouseenter={() => onhover?.(i)}
      onclick={() => onitemclick?.(i)}
    >
      {#if bar.isNew}
        <img class="info-bar-new" src={newsign} alt="NEW" />
      {/if}
      <div class="info-bar">
        <span class="info-bar-text">{bar.link.length > 28 ? bar.link.slice(0, 28) + '...' : bar.link}</span>
        <span class="info-bar-box">VIEWS</span>
        <span class="info-bar-count">{bar.count}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  @keyframes infobar-in {
    0%   { opacity: 0; transform: translateX(40px); }
    60%  { opacity: 1; transform: translateX(-4px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  .info-bars-container {
    position: fixed;
    top: 155px;
    right: 0;
    left: 65%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 50;
    overflow: visible;
    transform: scale(var(--ui-scale, 1));
    transform-origin: top right;
  }

  .info-bar-wrap {
    position: relative;
    height: 46px;
    background: transparent;
    pointer-events: all;
    cursor: pointer;
    padding: 0;
    animation: infobar-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .info-bar-wrap.selected {
    background: #111;
    padding: 1.5px;
    border-radius: 8px;
  }

  .info-bar {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(20, 20, 30, 0.85);
    display: flex;
    align-items: center;
    overflow: visible;
    clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  }

  .info-bar-wrap.selected .info-bar {
    background: #fff;
    border-radius: 7px;
    clip-path: none;
  }

  .info-bar-wrap.selected .info-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #c4001a;
    z-index: 1;
  }

  .info-bar-new {
    position: absolute;
    left: -40px;
    bottom: 0;
    height: 65%;
    width: auto;
    pointer-events: none;
    z-index: 3;
  }

  .info-bar-text {
    flex: 1;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: #7dd4fc;
    padding: 0 14px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info-bar-wrap.selected .info-bar-text {
    color: #111;
  }

  .info-bar-box {
    height: 70%;
    background: #000;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    color: #fff;
    flex-shrink: 0;
    border-radius: 6px;
    margin-right: 4px;
    user-select: none;
  }

  .info-bar-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1px;
    color: #7dd4fc;
    margin-right: 80px;
    flex-shrink: 0;
    user-select: none;
  }

  .info-bar-wrap.selected .info-bar-count {
    color: #111;
  }
</style>
