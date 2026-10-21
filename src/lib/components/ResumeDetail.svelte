<script lang="ts">
  import type { ResumeCategory, ResumeTone } from '$lib/data/resume-items';

  let { category }: { category: ResumeCategory } = $props();

  const TONE_COLORS: Record<ResumeTone, string> = {
    green: '#22c55e',
    yellow: '#eab308',
    gray: '#94a3b8',
  };
</script>

{#key category.id}
<div class="resume-detail-panel">
  <div class="resume-detail-top">
    <div class="resume-detail-top-index">{category.badge}</div>
    <div class="resume-detail-top-title">
      {category.title}
      <span class="resume-detail-top-sub">{category.subtitle}</span>
    </div>
    <div class="resume-detail-top-progress">{category.rows.length}</div>
    <div class="resume-detail-top-rank">ITENS <b>{category.rows.length}</b></div>
  </div>

  <div class="resume-detail-list">
    {#each category.rows as row, i}
      <div class="resume-detail-row" style:--status={TONE_COLORS[row.tone]} style:--i={i}>
        <div class="resume-detail-row-index">{row.index}</div>
        <div class="resume-detail-row-title">
          {#if row.link}
            <a class="resume-detail-row-link" href={row.link} target="_blank" rel="noopener noreferrer">
              {row.title}<span class="resume-detail-row-ext" aria-hidden="true"> ↗</span>
            </a>
          {:else}
            {row.title}
          {/if}
          {#if row.detail}
            <span class="resume-detail-row-desc">{row.detail}</span>
          {/if}
        </div>
        <div class="resume-detail-status" style:background={TONE_COLORS[row.tone]}>
          {row.status}
        </div>
      </div>
    {/each}
  </div>

  {#if category.notes?.length}
    <div class="resume-detail-bottom">
      <div class="resume-detail-bottom-title">DETALHES</div>
      <div class="resume-detail-bullets">
        {#each category.notes as note}
          <div class="resume-detail-bullet">{note}</div>
        {/each}
      </div>
    </div>
  {/if}
</div>
{/key}

<style>
  .resume-detail-panel {
    position: absolute;
    top: 9.5vh;
    right: 4.5vw;
    width: min(39vw, 620px);
    max-height: 82vh;
    z-index: 12;
    padding: 22px 24px 24px 24px;
    background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
    box-shadow:
      inset 0 0 0 1px rgba(133, 244, 255, 0.16),
      16px 16px 0 rgba(0, 6, 30, 0.55);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(133, 244, 255, 0.4) transparent;
    transform: scale(var(--ui-scale, 1));
    transform-origin: top right;
  }

  .resume-detail-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 24%);
    pointer-events: none;
  }

  .resume-detail-top {
    position: relative;
    display: grid;
    grid-template-columns: 70px 1fr auto;
    align-items: center;
    gap: 14px;
    min-height: 92px;
    padding: 0 18px;
    background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    color: #08153f;
    box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
  }

  .resume-detail-top-index {
    font-family: 'Anton', sans-serif;
    font-size: 46px;
    line-height: 1;
  }

  .resume-detail-top-title {
    font-family: 'Anton', sans-serif;
    font-size: 42px;
    line-height: 0.92;
    letter-spacing: 1px;
  }

  .resume-detail-top-progress {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    letter-spacing: 2px;
    line-height: 1;
  }

  .resume-detail-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 18px;
  }

  .resume-detail-row {
    display: grid;
    grid-template-columns: 50px 1fr auto;
    align-items: center;
    gap: 14px;
    min-height: 56px;
    padding: 10px 14px;
    background: rgba(8, 18, 72, 0.96);
    clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
    box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
    transition: transform 0.16s ease, background 0.16s ease;
  }

  .resume-detail-row:hover {
    transform: translateX(4px);
    background: rgba(12, 26, 94, 1);
  }

  .resume-detail-row-index {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    color: #94f4ff;
  }

  .resume-detail-row-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    font-family: 'Anton', sans-serif;
    font-size: 22px;
    line-height: 1.1;
    color: #f2fcff;
  }

  .resume-detail-row-link {
    color: inherit;
    text-decoration: none;
    align-self: flex-start;
  }

  .resume-detail-row-link:hover,
  .resume-detail-row-link:focus-visible {
    color: #94f4ff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .resume-detail-row-link:focus-visible {
    outline: 2px solid #94f4ff;
    outline-offset: 2px;
  }

  .resume-detail-row-ext {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8em;
    color: #94f4ff;
  }

  /* Linha de contexto: fonte de leitura, não de título */
  .resume-detail-row-desc {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    line-height: 1.3;
    letter-spacing: 0.2px;
    color: rgba(237, 250, 255, 0.78);
  }

  .resume-detail-status {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    line-height: 1;
    letter-spacing: 1.1px;
    color: #fff;
    padding: 7px 12px;
    white-space: nowrap;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    border-radius: 2px;
  }

  .resume-detail-bottom {
    position: relative;
    margin-top: 22px;
    padding: 18px;
    background: rgba(5, 13, 57, 0.97);
    clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
  }

  .resume-detail-bottom-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px;
    letter-spacing: 2px;
    color: #91f5ff;
    margin-bottom: 14px;
  }

  .resume-detail-bullets {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .resume-detail-bullet {
    font-family: 'Anton', sans-serif;
    font-size: 21px;
    line-height: 1.15;
    color: #edfaff;
  }

  /* Extras do cabeçalho: só aparecem no mobile/tablet */
  .resume-detail-top-sub,
  .resume-detail-top-rank {
    display: none;
  }
  /* =====================================================
     Mobile + tablet: painel fluido, cabeçalho com subtítulo
     e rank, itens com a cor do status na lateral e texto
     de apoio em fonte legível.
     ===================================================== */
  @media (max-width: 900px) {
    .resume-detail-panel {
      position: relative;
      top: auto;
      right: auto;
      width: 100%;
      max-height: none;
      transform: none;
      padding: 16px 14px 18px;
      overflow: visible;
      clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
      animation: rd-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes rd-in {
      from { opacity: 0; transform: translateX(24px); }
      to { opacity: 1; transform: none; }
    }
    .resume-detail-top {
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      min-height: 76px;
      padding: 10px 22px 10px 12px;
      box-shadow: none;
    }
    .resume-detail-top-index {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 46px;
      height: 52px;
      padding: 0 8px;
      font-size: 30px;
      color: #85f4ff;
      background: #08153f;
      clip-path: polygon(12% 0, 100% 0, 88% 100%, 0 100%);
    }
    .resume-detail-top-title {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: clamp(26px, 7.4vw, 36px);
      line-height: 0.95;
    }
    .resume-detail-top-sub {
      display: block;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: rgba(8, 21, 63, 0.7);
    }
    .resume-detail-top-progress {
      display: none;
    }
    .resume-detail-top-rank {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px;
      letter-spacing: 2px;
      line-height: 1;
    }
    .resume-detail-top-rank b {
      font-family: 'Anton', sans-serif;
      font-weight: 400;
      font-size: 40px;
      line-height: 0.95;
      letter-spacing: 0;
    }
    .resume-detail-list {
      gap: 8px;
      margin-top: 16px;
    }
    .resume-detail-row {
      grid-template-columns: 34px 1fr;
      grid-template-areas:
        'idx title'
        'idx status';
      align-items: start;
      gap: 6px 12px;
      min-height: 0;
      padding: 12px 18px 12px 12px;
      border-left: 4px solid var(--status, #85f4ff);
      clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
      opacity: 0;
      animation: rd-row-in 0.3s ease forwards;
      animation-delay: calc(var(--i, 0) * 45ms + 80ms);
    }
    @keyframes rd-row-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: none; }
    }
    .resume-detail-row:hover {
      transform: none;
    }
    .resume-detail-row-index {
      grid-area: idx;
      font-size: 24px;
      line-height: 1;
      padding-top: 2px;
    }
    .resume-detail-row-title {
      grid-area: title;
      font-size: 19px;
      line-height: 1.15;
    }
    .resume-detail-status {
      grid-area: status;
      justify-self: start;
      font-size: 15px;
      letter-spacing: 1px;
      padding: 4px 12px 3px 8px;
      color: #041238;
    }
    .resume-detail-bottom {
      margin-top: 16px;
      padding: 14px 18px 16px 14px;
    }
    .resume-detail-bottom-title {
      font-size: 22px;
      margin-bottom: 10px;
    }
    .resume-detail-bullets {
      gap: 8px;
    }
    .resume-detail-bullet {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 17px;
      line-height: 1.3;
      color: rgba(237, 250, 255, 0.85);
    }
  }
  /* Tablet: status volta pra direita do título */
  @media (min-width: 640px) and (max-width: 900px) {
    .resume-detail-panel {
      padding: 20px 20px 22px;
    }
    .resume-detail-row {
      grid-template-columns: 40px 1fr auto;
      grid-template-areas: 'idx title status';
      align-items: center;
    }
    .resume-detail-status {
      justify-self: end;
    }
    .resume-detail-row-title {
      font-size: 21px;
    }
  }
</style>
