<script lang="ts">
  import { RESUME_CATEGORIES } from '$lib/data/resume-items';

  let { active = 0, mounted = false, onhover, onleave, onselect }: {
    active: number;
    mounted: boolean;
    onhover?: (index: number) => void;
    onleave?: () => void;
    onselect?: (index: number) => void;
  } = $props();

  const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV'];
</script>

<div class="resume-stack" role="list" onmouseleave={() => onleave?.()}>
  <div class="resume-list-tag" class:mounted>LISTA</div>

  {#each RESUME_CATEGORIES as category, index}
    <div
      class="resume-card-wrap"
      class:active={active === index}
      class:mounted
      style:transition-delay="{index * 55}ms"
      role="button"
      tabindex="0"
      onmouseenter={() => onhover?.(index)}
      onclick={() => onselect?.(index)}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onselect?.(index); } }}
    >
      <div class="resume-card">
        <div class="resume-badge">
          <span class="resume-badge-text">{ROMAN_NUMERALS[index]}</span>
        </div>
        <div class="resume-card-inner">
          <div class="resume-title">{category.title}</div>
          <div class="resume-rank">
            <span class="resume-rank-label">RANK</span>
            <span class="resume-rank-number">{category.rank}</span>
          </div>
        </div>
        <div class="resume-subtitle-bar">
          <span class="resume-subtitle">{category.subtitle}</span>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .resume-stack {
    position: absolute;
    top: 9vh;
    left: 2.8vw;
    width: min(47vw, 720px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    transform: scale(calc(0.9 * var(--ui-scale, 1)));
    transform-origin: top left;
    z-index: 10;
  }

  .resume-list-tag {
    font-family: 'Anton', sans-serif;
    font-size: 92px;
    line-height: 0.9;
    color: #f6fbff;
    letter-spacing: 2px;
    margin: 0 0 6px 12px;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.18);
    opacity: 0;
    transform: translateX(-24px);
    transition: opacity 0.35s ease, transform 0.35s ease;
  }

  .resume-list-tag.mounted {
    opacity: 1;
    transform: translateX(0);
  }

  .resume-card-wrap {
    position: relative;
    opacity: 0;
    transform: translateX(-48px);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: all;
    cursor: pointer;
  }

  .resume-card-wrap.mounted {
    opacity: 1;
    transform: translateX(0);
  }

  .resume-card {
    position: relative;
    height: 112px;
    background: #0d1a3a;
    clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
    box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
    transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
    overflow: visible;
  }

  .resume-card-wrap.active .resume-card {
    background: #ffffff;
    box-shadow: 10px 8px 0 red;
    transform: translateX(6px);
  }

  .resume-card-inner {
    position: absolute;
    inset: 0;
    padding: 14px 22px 14px 62px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .resume-badge {
    position: absolute;
    top: 10px;
    left: -10px;
    width: 56px;
    height: 70px;
    background: #0b113d;
    border: 3px solid #3ce2ff;
    clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-8deg);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.28);
    transition: background 0.22s ease, border-color 0.22s ease;
  }

  .resume-badge-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    color: #d2fdff;
    letter-spacing: 1px;
    transform: rotate(8deg);
    transition: color 0.22s ease;
  }

  .resume-card-wrap.active .resume-badge {
    background: #000;
    border-color: #000;
  }

  .resume-card-wrap.active .resume-badge-text {
    color: #fff;
  }

  .resume-title {
    font-family: 'Anton', sans-serif;
    font-size: 56px;
    line-height: 0.9;
    letter-spacing: 1px;
    color: #a5f6ff;
    transition: color 0.22s ease;
  }

  .resume-card-wrap.active .resume-title {
    color: #000;
  }

  .resume-rank {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .resume-rank-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    color: #9ffbff;
    transition: color 0.22s ease;
  }

  .resume-rank-number {
    font-family: 'Anton', sans-serif;
    font-size: 70px;
    line-height: 0.82;
    color: #9ffbff;
    transition: color 0.22s ease;
  }

  .resume-card-wrap.active .resume-rank-label,
  .resume-card-wrap.active .resume-rank-number {
    color: #000;
  }

  .resume-subtitle-bar {
    position: absolute;
    left: 64px;
    right: 14px;
    bottom: 12px;
    height: 34px;
    background: #85f4ff;
    clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    display: flex;
    align-items: center;
    padding: 0 18px;
    transition: background 0.22s ease;
  }

  .resume-card-wrap.active .resume-subtitle-bar {
    background: #000;
  }

  .resume-subtitle {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    line-height: 1;
    letter-spacing: 1px;
    color: #041238;
    transition: color 0.22s ease;
  }

  .resume-card-wrap.active .resume-subtitle {
    color: #fff;
  }

  /* =====================================================
     Mobile + tablet: os cards viram abas fixas no topo.
     Toque troca a categoria e o detalhe logo abaixo
     acompanha, sem precisar rolar a lista inteira.
     ===================================================== */
  @media (max-width: 900px) {
    .resume-stack {
      position: sticky;
      top: 0;
      left: auto;
      z-index: 20;
      width: auto;
      margin: 0 -14px;
      padding: 10px 14px 12px;
      flex-direction: row;
      gap: 8px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      transform: none;
      background: linear-gradient(180deg, rgba(0, 26, 120, 0.96) 0%, rgba(0, 40, 170, 0.9) 100%);
      backdrop-filter: blur(6px);
      box-shadow: 0 6px 18px rgba(0, 0, 40, 0.35);
    }
    .resume-stack::-webkit-scrollbar {
      display: none;
    }
    .resume-list-tag {
      display: none;
    }
    .resume-card-wrap {
      flex: 0 0 auto;
      min-width: 152px;
      scroll-snap-align: start;
      transform: translateY(-12px);
      -webkit-tap-highlight-color: transparent;
    }
    .resume-card-wrap.mounted {
      transform: translateY(0);
    }
    /* Faixa vermelha embaixo da aba ativa (fora do clip-path do card) */
    .resume-card-wrap::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 14px;
      bottom: -6px;
      height: 4px;
      background: #ff2a46;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .resume-card-wrap.active::after {
      transform: scaleX(1);
    }
    .resume-card {
      height: 56px;
      clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
      box-shadow: none;
      background: rgba(6, 14, 50, 0.92);
    }
    .resume-card-wrap.active .resume-card {
      transform: none;
      box-shadow: none;
    }
    .resume-badge {
      top: 50%;
      left: 12px;
      width: 34px;
      height: 40px;
      border-width: 2px;
      transform: translateY(-50%) rotate(-8deg);
      box-shadow: none;
    }
    .resume-badge-text {
      font-size: 22px;
    }
    .resume-card-inner {
      padding: 0 20px 0 56px;
      align-items: center;
    }
    .resume-title {
      font-size: 22px;
      line-height: 1;
      white-space: nowrap;
    }
    .resume-rank,
    .resume-subtitle-bar {
      display: none;
    }
  }
  /* Tablet: as 4 abas cabem lado a lado */
  @media (min-width: 640px) and (max-width: 900px) {
    .resume-stack {
      overflow: visible;
      margin: 0 -24px;
      padding: 12px 24px 14px;
    }
    .resume-card-wrap {
      flex: 1 1 0;
      min-width: 0;
    }
    .resume-card {
      height: 64px;
    }
    .resume-title {
      font-size: clamp(18px, 2.9vw, 26px);
    }
  }
</style>
