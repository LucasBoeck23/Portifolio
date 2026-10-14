<script lang="ts">
  import { ABOUT_ITEMS } from '$lib/data/about-items';
  import BarBase from './BarBase.svelte';

  let { active = 0, mounted = false, onhover, onleave, onclick }: {
    active: number;
    mounted: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onclick?: (index: number) => void;
  } = $props();
</script>

<BarBase items={ABOUT_ITEMS} {active} {mounted} {onhover} {onleave} onclick={onclick}>
  {#snippet content({ item })}
    <div class="sc-main">
      <div class="sc-main-top">
        <div class="sc-label">{item.label}</div>
      </div>
    </div>
  {/snippet}
</BarBase>

<style>
  /* Área do título: ocupa o resto da barra e centraliza o texto.
     As variáveis (--main-min, --label-size) vêm do BarBase e
     escalam com a largura da barra. */
  .sc-main {
    flex: 1 1 0;
    min-width: var(--main-min);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 var(--pad);
    text-align: center;
  }

  .sc-main-top {
    display: flex;
    align-items: center;
    gap: 0.4em;
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
</style>
