<script lang="ts">
  import type { SocialInfoBar } from '$lib/data/social-items';
  import newsign from '$assets/images/newsign.webp';

  let { infoBars = [], activeIndex = 0, focused = false, onhover, onleave, onclick: onitemclick }: {
    infoBars: SocialInfoBar[];
    activeIndex: number;
    focused: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onclick?: (index: number) => void;
  } = $props();
</script>

<div class="info-bars-container" role="list" onmouseleave={() => onleave?.()}>
  {#each infoBars as bar, i}
    <div
      class="info-bar-wrap"
      class:selected={activeIndex === i}
      style:animation-delay="{i * 50}ms"
      role="button"
      tabindex="0"
      onmouseenter={() => onhover?.(i)}
      onclick={() => onitemclick?.(i)}
      onkeydown={(e) => { if (e.key === 'Enter') onitemclick?.(i); }}
    >
      {#if bar.isNew}
        <img class="info-bar-new" src={newsign} alt="NEW" />
      {/if}
      <div class="info-bar">
        <span class="info-bar-text">{bar.link.length > 28 ? bar.link.slice(0, 28) + '...' : bar.link}</span>
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

  /* Lista de links presa à direita, abaixo da nav.
     Largura: celular ~300px, desktop 34% da tela (máx. 620px). */
  .info-bars-container {
    position: fixed;
    top: clamp(88px, 15vh, 160px);
    right: 0;
    width: clamp(min(100% - 24px, 300px), 34vw, 620px);
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 1vh, 10px);
    z-index: 50;
  }

  .info-bar-wrap {
    position: relative;
    height: clamp(38px, 2vw + 30px, 48px);
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

  /* Selo "NEW" encostado do lado de fora, à esquerda da barra */
  .info-bar-new {
    position: absolute;
    right: 100%;
    bottom: 0;
    height: 65%;
    width: auto;
    pointer-events: none;
    z-index: 3;
  }

  .info-bar-text {
    flex: 1;
    min-width: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(16px, 0.8vw + 13px, 22px);
    letter-spacing: 0.1em;
    color: #7dd4fc;
    padding: 0 0.7em;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info-bar-wrap.selected .info-bar-text {
    color: #111;
  }
</style>
