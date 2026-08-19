<script lang="ts">
  import type { ResumeCategory } from '$lib/data/resume-items';

  let { category }: { category: ResumeCategory } = $props();

  function getStatusColor(status: string): string {
    if (status === 'Complete' || status === 'Active') return '#22c55e';
    if (status === 'In Progress') return '#eab308';
    return '#6b7280';
  }
</script>

<div class="resume-detail-panel">
  <div class="resume-detail-top">
    <div class="resume-detail-top-index">{category.badge}</div>
    <div class="resume-detail-top-title">{category.title} LOG</div>
    <div class="resume-detail-top-progress">{category.rows.length}/{category.rank}</div>
  </div>

  <div class="resume-detail-list">
    {#each category.rows as row}
      <div class="resume-detail-row">
        <div class="resume-detail-row-index">{row.index}</div>
        <div class="resume-detail-row-title">{row.title}</div>
        <div class="resume-detail-status" style:background={getStatusColor(row.status)}>
          {row.status}
        </div>
      </div>
    {/each}
  </div>

  <div class="resume-detail-bottom">
    <div class="resume-detail-bottom-title">DETAILS</div>
    <div class="resume-detail-bullets">
      <div class="resume-detail-bullet">- Maintain progress across required items and supporting work.</div>
      <div class="resume-detail-bullet">- Track portfolio-ready projects tied to this category.</div>
      <div class="resume-detail-bullet">- Keep materials prepared for review and evaluation.</div>
    </div>
  </div>
</div>

<style>
  .resume-detail-panel {
    position: absolute;
    top: 9.5vh;
    right: 4.5vw;
    width: min(39vw, 620px);
    min-height: 74vh;
    z-index: 12;
    padding: 22px 24px 24px 24px;
    background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
    clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
    box-shadow:
      inset 0 0 0 1px rgba(133, 244, 255, 0.16),
      16px 16px 0 rgba(0, 6, 30, 0.55);
    overflow: hidden;
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
    padding: 0 14px;
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
    font-family: 'Anton', sans-serif;
    font-size: 28px;
    line-height: 1;
    color: #f2fcff;
  }

  .resume-detail-status {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    line-height: 1;
    letter-spacing: 1.1px;
    color: #fff;
    padding: 7px 12px;
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
</style>
