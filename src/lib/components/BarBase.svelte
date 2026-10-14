<script lang="ts">
  import type { Snippet } from 'svelte';
  import char1 from '$assets/images/char1.webp';
  import char2 from '$assets/images/char2.webp';
  import char3 from '$assets/images/char3.webp';

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
      role="button"
      tabindex="0"
      onmouseenter={() => onhover?.(i)}
      onclick={() => onitemclick?.(i)}
      onkeydown={(e) => { if (e.key === 'Enter') onitemclick?.(i); }}
    >
      <div class="sc-bar-red"></div>
      <div class="sc-bar">
        <div class="sc-bar-fill"></div>
        <div class="sc-bar-shade"></div>
        <div class="sc-bar-content">
          <div class="sc-role" style:color={item.role.color ?? '#ffffff'}>{item.role.text}</div>
          <img class="sc-char" src={CHARS[i]} alt="" />
          {@render content({ item, index: i, isActive })}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  /* =========================================================
     Layout: coluna de barras centralizada verticalmente,
     encostada na esquerda. Sem media queries: a largura da
     barra é fluida e tudo dentro dela escala com essa largura.
     ========================================================= */
  .sc-root {
    position: relative; /* só pra ficar acima do vídeo de fundo */
    z-index: 10;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: clamp(6px, 1.2vh, 12px);
    pointer-events: none;
  }

  .sc-bar-outer {
    /* Largura da barra:
       - celular: tela inteira menos 16px
       - tablet/dobrável: até 560px
       - desktop: 45% da tela, no máximo 900px */
    width: clamp(min(100% - 16px, 560px), 45vw, 900px);

    /* A barra vira referência de tamanho: 1cqi = 1% da largura dela.
       Todas as medidas internas abaixo derivam disso. */
    container-type: inline-size;
    --bar-h: clamp(52px, 6cqi + 32px, 68px);
    --pad: clamp(8px, 3cqi, 24px);
    --role-w: clamp(64px, 20cqi, 170px);
    --role-size: clamp(24px, 7cqi, 52px);
    --char-w: min(var(--bar-h) * 2.3, 30cqi);
    --char-overlap: clamp(6px, 3cqi, 28px);
    --main-min: clamp(96px, 24cqi, 260px);
    --label-size: clamp(16px, 4.4cqi, 28px);

    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    pointer-events: all;
    transform: translateX(-100%);
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sc-bar-outer.mounted {
    transform: translateX(0);
  }

  /* ---------- Barra preta ---------- */
  .sc-bar {
    position: relative;
    height: var(--bar-h);
    background: #111;
    clip-path: polygon(0 0, 100% 0, calc(100% - var(--bar-h) * 0.22) 100%, 0 100%);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.65);
    transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sc-bar-outer.active .sc-bar {
    height: calc(var(--bar-h) * 1.4);
  }

  /* Sombra na base da barra */
  .sc-bar::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 10%;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.55) 100%);
    z-index: 3;
    pointer-events: none;
  }

  /* ---------- Camadas decorativas (ficam atrás do conteúdo) ---------- */

  /* Faixa vermelha que aparece atrás da barra ativa */
  .sc-bar-red {
    position: absolute;
    inset: 0;
    background: #c4001a;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - var(--bar-h) * 0.16) 100%);
    transform: translateY(-11%);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .sc-bar-outer.active .sc-bar-red {
    opacity: 1;
  }

  /* Diagonal branca que preenche a barra ativa */
  .sc-bar-fill {
    position: absolute;
    inset: 0;
    background: #fff;
    clip-path: polygon(
      100% 0, 100% 0,
      calc(100% - var(--bar-h) * 0.5) 100%,
      calc(100% - var(--bar-h) * 0.5) 100%
    );
    transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .sc-bar-outer.active .sc-bar-fill {
    clip-path: polygon(
      22% 0, 100% 0,
      calc(100% - var(--bar-h) * 0.22) 100%,
      calc(22% + var(--bar-h) * 2.15) 100%
    );
  }

  .sc-bar-shade {
    position: absolute;
    inset: 0 auto 0 73%;
    width: 6%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  .sc-bar-outer.active .sc-bar-shade {
    opacity: 1;
  }

  /* ---------- Conteúdo: escalão -> imagem -> título -> extras ----------
     Linha flex com quebra. Se algum item opcional (ex.: stats do
     contato) não couber, ele desce pra 2ª linha e fica escondido
     pelo overflow. Assim a barra se adapta sem media query. */
  .sc-bar-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: flex-start;
    overflow: hidden;
    padding: 0 var(--pad);
  }

  .sc-role {
    position: relative;
    z-index: 2; /* escalão sempre legível por cima da imagem */
    flex: 0 0 var(--role-w);
    display: flex;
    justify-content: center;
    font-family: 'Anton', sans-serif;
    font-size: var(--role-size);
    letter-spacing: -0.04em;
    line-height: 1;
    transform: rotate(-30deg);
    user-select: none;
  }

  .sc-char {
    position: relative;
    z-index: 1;
    flex: 0 0 var(--char-w);
    width: var(--char-w);
    height: 100%;
    margin-left: calc(var(--char-overlap) * -1);
    object-fit: cover;
    object-position: top;
    clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
    pointer-events: none;
  }
</style>
