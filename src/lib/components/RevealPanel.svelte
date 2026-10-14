<script lang="ts">
  import type { AboutItem } from '$lib/data/about-items';

  let { item, visible = false, onclose }: { item: AboutItem; visible: boolean; onclose?: () => void } = $props();
</script>

{#if visible}
  <div class="reveal-overlay" role="button" tabindex="-1" onclick={() => onclose?.()} onkeydown={(e) => { if (e.key === 'Escape') onclose?.(); }}>
    <!-- Dimming overlay -->
    <div class="reveal-dim"></div>

    <!-- Diagonal panel with upper/lower content bars -->
    <div class="reveal-panel">
      <!-- Cabeçalho só aparece no layout mobile/tablet (as barras ficam escondidas atrás do overlay) -->
      <div class="reveal-head">
        <span class="reveal-head-role" style:color={item.role.color}>{item.role.text}</span>
        <span class="reveal-head-label">{item.label}</span>
      </div>
      <div class="reveal-upper">
        {#each item.revealContent.upper as line}
          <div class="reveal-line">{line}</div>
        {/each}
      </div>
      <div class="reveal-lower">{item.revealContent.lower}</div>
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
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 400;
    font-size: 24px;
    letter-spacing: 0.3px;
    line-height: 1.4;
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
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 400;
    font-size: 18px;
    letter-spacing: 0.4px;
    text-transform: lowercase;
    padding-left: 22px;
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
    }
    55% {
      opacity: 0.9;
      transform: translateX(-8px) skewX(-8deg) scale(1.015);
    }
    100% {
      opacity: 0.96;
      transform: translateX(0) skewX(-8deg) scale(1);
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
  /* Cabeçalho escondido no desktop */
  .reveal-head {
    display: none;
  }

  /* =====================================================
     Mobile + tablet: layout empilhado em "card".
     Retrato em cima numa moldura inclinada, cabeçalho com
     escalão + título, e as falas em faixas pretas legíveis
     (sem rotação de -20deg, que cortava o texto).
     ===================================================== */
  @media (max-width: 900px) {
    .reveal-overlay {
      position: fixed;
      inset: 0;
      transform: none;
      overflow-y: auto;
      overscroll-behavior: contain;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 56px 16px 96px; /* espaço p/ player (topo) e botão voltar (base) */
      -webkit-overflow-scrolling: touch;
    }
    .reveal-dim {
      position: fixed;
      background:
        linear-gradient(160deg, rgba(0, 71, 255, 0.35) 0%, transparent 45%),
        rgba(20, 24, 32, 0.82);
    }

    /* ---------- Retrato ---------- */
    .reveal-portrait-shell {
      order: 1;
      position: relative;
      top: auto;
      right: auto;
      flex-shrink: 0;
      width: 100%;
      max-width: 520px;
      height: min(46vh, 420px);
      margin: 0 auto -28px;
      overflow: hidden;
      background: linear-gradient(180deg, #00d0ff 0%, #0047ff 100%);
      clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
      animation: portrait-in-m 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .reveal-portrait-shell::after {
      /* faixa vermelha diagonal atrás do personagem */
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 58%, rgba(215, 13, 44, 0.85) 58%, rgba(215, 13, 44, 0.85) 66%, transparent 66%);
      z-index: 0;
    }
    .reveal-portrait {
      position: relative;
      z-index: 1;
      object-position: bottom center;
      transform: none;
    }
    @keyframes portrait-in-m {
      0% { opacity: 0; transform: translateX(60px); }
      100% { opacity: 1; transform: translateX(0); }
    }

    /* ---------- Card de conteúdo ---------- */
    .reveal-panel {
      order: 2;
      position: relative;
      top: auto;
      left: auto;
      z-index: 14;
      width: 100%;
      max-width: 620px;
      height: auto;
      margin: 0 auto;
      padding: 0 0 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      clip-path: polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%);
      box-shadow: none;
      transform: rotate(-2deg);
      transform-origin: center;
      animation: reveal-card-in 0.46s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .reveal-panel::before {
      height: 6px;
    }
    @keyframes reveal-card-in {
      0% { opacity: 0; transform: translateX(-80px) rotate(-2deg); }
      100% { opacity: 1; transform: translateX(0) rotate(-2deg); }
    }

    .reveal-head {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding: 18px 18px 0;
    }
    .reveal-head-role {
      font-family: 'Anton', sans-serif;
      font-size: 34px;
      line-height: 1;
      letter-spacing: -0.03em;
      transform: rotate(-12deg);
      -webkit-text-stroke: 1px #111;
    }
    .reveal-head-label {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 30px;
      letter-spacing: 0.1em;
      line-height: 1;
      color: #111;
    }

    .reveal-upper {
      position: static;
      width: auto;
      height: auto;
      margin: 0 12px 0 0;
      padding: 16px 28px 16px 18px;
      clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
      align-items: flex-start;
      text-align: left;
      gap: 10px;
    }
    .reveal-line {
      font-size: clamp(18px, 4.6vw, 24px);
      line-height: 1.3;
      padding-left: 12px;
      border-left: 3px solid #d70d2c;
    }

    .reveal-lower {
      position: static;
      align-self: flex-end;
      width: auto;
      height: auto;
      min-height: 44px;
      margin-right: 22px;
      padding: 10px 34px 10px 20px;
      clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
      font-size: 20px;
    }
  }

  /* Tablet: retrato e card lado a lado quando há largura */
  @media (min-width: 640px) and (max-width: 900px) {
    .reveal-overlay {
      display: grid;
      grid-template-columns: 1fr 0.8fr;
      align-items: center;
      align-content: center;
      gap: 0;
      padding: 72px 24px 96px;
    }
    .reveal-panel {
      grid-column: 1;
      grid-row: 1;
      max-width: none;
      margin: 0 -40px 0 0;
    }
    .reveal-portrait-shell {
      grid-column: 2;
      grid-row: 1;
      height: min(70vh, 640px);
      max-width: none;
      margin: 0;
    }
    /* Moldura alta: preenche sem sobrar faixa vazia em cima */
    .reveal-portrait {
      object-fit: cover;
      object-position: top center;
    }
  }

  /* Celular deitado: pouca altura, então lado a lado e retrato menor */
  @media (max-width: 900px) and (orientation: landscape) and (max-height: 560px) {
    .reveal-overlay {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      align-items: center;
      padding: 16px 24px 72px;
    }
    .reveal-panel {
      grid-column: 1;
      grid-row: 1;
      margin: 0 -24px 0 0;
    }
    .reveal-portrait-shell {
      grid-column: 2;
      grid-row: 1;
      height: calc(100vh - 88px);
      margin: 0;
    }
    .reveal-line {
      font-size: 17px;
    }
  }
</style>
