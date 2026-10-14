<script lang="ts">
  import { SOCIAL_PLATFORMS } from '$lib/data/social-items';
  import BarBase from './BarBase.svelte';

  let { active = 0, mounted = false, onhover, onleave, onclick }: {
    active: number;
    mounted: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onclick?: (index: number) => void;
  } = $props();
</script>

<BarBase items={SOCIAL_PLATFORMS} {active} {mounted} {onhover} {onleave} onclick={onclick}>
  {#snippet content({ item })}
    <div class="sc-main">
      <div class="sc-main-top">
        <span class="sc-icon">{item.icon}</span>
        <span class="sc-label">{item.label}</span>
      </div>
    </div>

    <div class="sc-stats">
      {#each item.stats as stat}
        <div class="sc-stat">
          <div class="sc-stat-top">
            <span
              class="sc-stat-tag"
              style:color={stat.color}
              style:border-color={stat.color}
            >{stat.tag}</span>
            <span class="sc-stat-num">{stat.value}</span>
          </div>
          <div class="sc-stat-bars">
            <div class="sc-stat-bar-color" style:background={stat.color}></div>
            <div class="sc-stat-bar-black"></div>
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
</BarBase>

<style>
  /* Área do título: ocupa o resto da barra e centraliza ícone + nome.
     As variáveis (--main-min, --label-size, --pad) vêm do BarBase. */
  .sc-main {
    flex: 1 1 0;
    min-width: var(--main-min);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 var(--pad);
  }

  .sc-main-top {
    display: flex;
    align-items: center;
    gap: 0.4em;
  }

  .sc-icon {
    font-size: calc(var(--label-size) * 0.8);
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.15);
    transition: color 0.2s ease;
    user-select: none;
  }

  :global(.sc-bar-outer.active) .sc-icon {
    color: rgba(255, 255, 255, 0.25);
  }

  .sc-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: var(--label-size);
    letter-spacing: 0.14em;
    line-height: 1;
    color: rgba(255, 255, 255, 0.85);
    transition: color 0.2s ease;
    user-select: none;
  }

  :global(.sc-bar-outer.active) .sc-label {
    color: #111111;
  }

  /* Stats opcionais: largura fixa em relação à barra. Quando não
     sobra espaço (celular), o bloco quebra pra 2ª linha da barra
     e some sozinho — mesma regra pra todas as barras. */
  .sc-stats {
    flex: 0 0 clamp(120px, 22cqi, 200px);
    min-width: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: var(--pad);
  }

  .sc-stat {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .sc-stat-top {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 0.3em;
  }

  .sc-stat-tag {
    flex-shrink: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8px, 1.3cqi, 11px);
    letter-spacing: 0.15em;
    padding: 0.1em 0.4em;
    border-width: 1px;
    border-style: solid;
    line-height: 1.4;
    user-select: none;
  }

  .sc-stat-num {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(14px, 3.2cqi, 26px);
    font-style: italic;
    line-height: 1;
    color: #ffffff;
    letter-spacing: 0.04em;
    user-select: none;
    transition: color 0.2s ease;
  }

  :global(.sc-bar-outer.active) .sc-stat-num {
    color: #111111;
  }

  .sc-stat-bars {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-top: 2px;
  }

  .sc-stat-bar-color {
    height: 3px;
    width: 100%;
  }

  .sc-stat-bar-black {
    height: 2px;
    width: 100%;
    background: #000;
  }
</style>
