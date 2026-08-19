<script lang="ts">
  import { ABOUT_ITEMS } from '$lib/data/about-items';
  import BarBase from './BarBase.svelte';

  let { active = 0, mounted = false }: { active: number; mounted: boolean } = $props();
</script>

<BarBase items={ABOUT_ITEMS} {active} {mounted}>
  {#snippet content({ item })}
    <div class="sc-main">
      <div class="sc-main-top">
        <div class="sc-label">{item.label}</div>
      </div>
    </div>
  {/snippet}
</BarBase>

<style>
  .sc-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding-left: 78px;
  }

  .sc-main-top {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sc-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 4px;
    line-height: 1;
    color: rgba(255, 255, 255, 0.85);
    transition: color 0.2s ease;
    user-select: none;
  }

  :global(.sc-bar-outer.active) .sc-label {
    color: #111111;
  }
</style>
