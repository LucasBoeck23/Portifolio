<script lang="ts">
  import { SOCIAL_PLATFORMS } from '$lib/data/social-items';
  import BarBase from './BarBase.svelte';

  let { active = 0, mounted = false }: { active: number; mounted: boolean } = $props();
</script>

<BarBase items={SOCIAL_PLATFORMS} {active} {mounted}>
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
  .sc-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }

  .sc-main-top {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sc-icon {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    width: 32px;
    text-align: center;
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

  .sc-stats {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-right: 24px;
    flex-shrink: 0;
  }

  .sc-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .sc-stat-top {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .sc-stat-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 9px;
    letter-spacing: 1.5px;
    padding: 1px 4px;
    border-width: 1px;
    border-style: solid;
    line-height: 1.4;
    user-select: none;
  }

  .sc-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    font-style: italic;
    line-height: 1;
    color: #ffffff;
    letter-spacing: 1px;
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
