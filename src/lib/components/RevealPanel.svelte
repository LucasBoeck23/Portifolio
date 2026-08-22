<script lang="ts">
  import type { AboutItem } from '$lib/data/about-items';

  let { item, visible = false, onclose }: { item: AboutItem; visible: boolean; onclose?: () => void } = $props();
</script>

{#if visible}
  <div class="reveal-overlay" onclick={() => onclose?.()}>
    <!-- Dimming overlay -->
    <div class="reveal-dim"></div>

    <!-- Diagonal panel with upper/lower content bars -->
    <div class="reveal-panel">
      <div class="reveal-upper">
        {#each item.revealContent.upper as line}
          <div class="reveal-line">{line}</div>
        {/each}
      </div>
      <div class="reveal-lower">{item.revealContent.lower}</div>
    </div>

    <!-- LB/RB navigation indicators -->
    <div class="reveal-nav">
      <span class="reveal-nav-arrow left">◄</span>
      <span class="reveal-nav-btn">LB</span>
      <span class="reveal-nav-dot"></span>
      <span class="reveal-nav-btn">RB</span>
      <span class="reveal-nav-arrow right">►</span>
    </div>

    <!-- Portrait image -->
    <div class="reveal-portrait-shell">
      <img class="reveal-portrait" src={item.portrait} alt="" />
    </div>
  </div>
{/if}

<style>
  .reveal-overlay {
    position: absolute;
    inset: 0;
    z-index: 12;
    pointer-events: all;
    cursor: pointer;
    transform: scale(var(--ui-scale, 1));
    transform-origin: center center;
  }

  /* Dimming overlay - requirement 3.10 */
  .reveal-dim {
    position: absolute;
    inset: 0;
    z-index: 12;
    background: rgba(40, 45, 54, 0.68);
    pointer-events: none;
    animation: dim-in 0.32s ease-out;
  }

  @keyframes dim-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Diagonal panel - requirement 3.7 */
  .reveal-panel {
    position: absolute;
    top: 44vh;
    left: -6vw;
    width: 88vw;
    height: 60vh;
    z-index: 12;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(243, 246, 252, 0.98) 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 88px) 100%, 0 100%);
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.18),
      18px 0 0 rgba(215, 13, 44, 0.82),
      28px 0 0 rgba(255, 255, 255, 0.26);
    transform-origin: left bottom;
    animation: reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .reveal-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(180deg, #e03d31 0%, #eb3333 100%);
    clip-path: inherit;
  }

  @keyframes reveal-bar-in {
    0% {
      opacity: 0;
      transform: translateX(-120px) rotate(-20deg) scaleX(0.72);
    }
    60% {
      opacity: 0.96;
      transform: translateX(18px) rotate(-20deg) scaleX(1.03);
    }
    100% {
      opacity: 0.92;
      transform: translateX(0) rotate(-20deg) scaleX(1);
    }
  }

  /* Upper content bar */
  .reveal-upper {
    position: absolute;
    top: 10%;
    left: 0;
    width: 100%;
    height: 40%;
    background: rgba(0, 0, 0, 0.92);
    clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
    text-align: center;
  }

  .reveal-line {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 20px;
    letter-spacing: 0.5px;
    line-height: 1.15;
  }

  /* Lower content bar */
  .reveal-lower {
    position: absolute;
    top: 58%;
    right: 0;
    width: 48%;
    height: 20%;
    background: rgba(0, 0, 0, 0.92);
    clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 22px;
    letter-spacing: 0.4px;
    text-transform: lowercase;
    padding-left: 22px;
  }

  /* LB/RB navigation - requirement 3.12 */
  .reveal-nav {
    position: absolute;
    top: 10vh;
    left: 6vw;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    z-index: 14;
    transform: translateX(-40px) rotate(-20deg);
    transform-origin: left bottom;
    animation: nav-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes nav-pop {
    0% { opacity: 0; transform: scale(0.55) translateY(-10px); }
    65% { opacity: 1; transform: scale(1.1) translateY(2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  .reveal-nav-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 100px;
    letter-spacing: 3px;
    line-height: 1;
    user-select: none;
    color: #fff;
    -webkit-text-stroke: 2px #000;
    paint-order: stroke fill;
    background: none;
    border: none;
    padding: 0 6px;
  }

  .reveal-nav-dot {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #111;
    margin: 0 10px;
    flex-shrink: 0;
  }

  .reveal-nav-arrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #c4001a;
    display: inline-block;
    user-select: none;
  }

  .reveal-nav-arrow.left {
    animation: arrow-left 0.8s ease-in-out infinite;
  }

  .reveal-nav-arrow.right {
    animation: arrow-right 0.8s ease-in-out infinite;
  }

  @keyframes arrow-left {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50% { transform: translateX(-5px); opacity: 0.4; }
  }

  @keyframes arrow-right {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50% { transform: translateX(5px); opacity: 0.4; }
  }

  /* Portrait image - requirement 3.11 */
  .reveal-portrait-shell {
    position: absolute;
    top: 0;
    right: -3vw;
    z-index: 13;
    pointer-events: none;
    width: 43vw;
    height: 100vh;
    overflow: hidden;
    animation: portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes portrait-in {
    0% {
      opacity: 0;
      transform: translateX(78px) skewX(-8deg) scale(0.94);
      filter: blur(8px);
    }
    55% {
      opacity: 0.9;
      transform: translateX(-8px) skewX(-8deg) scale(1.015);
      filter: blur(0);
    }
    100% {
      opacity: 0.96;
      transform: translateX(0) skewX(-8deg) scale(1);
      filter: blur(0);
    }
  }

  .reveal-portrait {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: bottom right;
    transform: skewX(8deg) scale(1.08);
    transform-origin: bottom right;
  }
</style>
