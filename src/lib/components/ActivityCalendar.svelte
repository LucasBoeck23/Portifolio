<script lang="ts">
  import type { DayActivity } from '$lib/utils/github';

  let { activities, selectedDate, onselect }: {
    activities: Map<string, DayActivity>;
    selectedDate: string;
    onselect: (date: string) => void;
  } = $props();

  const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  let viewDate = $state(new Date());

  let calendarDays = $derived(buildCalendar(viewDate));
  let monthNum = $derived(viewDate.getMonth() + 1);
  let yearNum = $derived(viewDate.getFullYear());

  const today = new Date().toISOString().slice(0, 10);

  function buildCalendar(date: Date): (string | null)[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (string | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(iso);
    }
    return days;
  }

  function prevMonth() {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const now = new Date();
    // Não navega pra antes do ano atual
    if (prev.getFullYear() < now.getFullYear()) return;
    viewDate = prev;
  }

  function nextMonth() {
    const now = new Date();
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    // Não navega pra meses futuros
    if (next.getFullYear() > now.getFullYear() || 
        (next.getFullYear() === now.getFullYear() && next.getMonth() > now.getMonth())) return;
    viewDate = next;
  }

  function getDayOfWeek(date: string): number {
    return new Date(date + 'T12:00:00').getDay();
  }

  function hasActivity(date: string | null): boolean {
    if (!date) return false;
    return activities.has(date);
  }
</script>

<div class="p3-calendar">
  <!-- Header: CALENDAR + year -->
  <div class="cal-top">
    <span class="cal-label">CALENDAR</span>
    <span class="cal-year">{yearNum}</span>
  </div>

  <!-- Month nav: arrows + big month number -->
  <div class="cal-month-row">
    <button class="cal-arrow left" onclick={prevMonth}>◀</button>
    <div class="cal-month-num">{monthNum}</div>
    <button class="cal-arrow right" onclick={nextMonth}>▶</button>
  </div>

  <!-- Weekday headers -->
  <div class="cal-weekdays">
    {#each WEEKDAYS as day, i}
      <div class="cal-weekday" class:sun={i === 0} class:sat={i === 6}>{day}</div>
    {/each}
  </div>

  <!-- Day grid -->
  <div class="cal-grid">
    {#each calendarDays as date}
      {#if date}
        {@const dayNum = parseInt(date.slice(8))}
        {@const dow = getDayOfWeek(date)}
        {@const isToday = date === today}
        {@const isSelected = date === selectedDate}
        {@const hasAct = hasActivity(date)}
        <button
          class="cal-day"
          class:sun={dow === 0}
          class:sat={dow === 6}
          class:today={isToday}
          class:selected={isSelected}
          class:active={hasAct}
          onclick={() => onselect(date)}
        >
          {#if isToday}
            <span class="today-label">HOJE</span>
            <span class="today-triangle"></span>
          {/if}
          <span class="day-number">{dayNum}</span>
          {#if hasAct}
            <span class="activity-ring"></span>
          {/if}
        </button>
      {:else}
        <div class="cal-day empty"></div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .p3-calendar {
    width: 100%;
    max-width: 480px;
    user-select: none;
    background: rgba(5, 10, 40, 0.9);
    padding: 20px;
    border-radius: 8px;
  }

  /* Top label */
  .cal-top {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }

  .cal-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 14px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }

  .cal-year {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 2px;
  }

  /* Month row */
  .cal-month-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .cal-month-num {
    font-family: 'Montserrat', sans-serif;
    font-weight: 100;
    font-size: 120px;
    line-height: 0.85;
    color: #fff;
    letter-spacing: -4px;
  }

  .cal-arrow {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 14px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .cal-arrow:hover {
    background: rgba(196, 0, 26, 0.6);
    border-color: #c4001a;
  }

  .cal-arrow.left { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  .cal-arrow.right { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }

  /* Weekday headers */
  .cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 6px;
  }

  .cal-weekday {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding: 4px 0;
  }

  .cal-weekday.sun { color: #4a9fff; }
  .cal-weekday.sat { color: #c4001a; }

  /* Day grid */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .cal-day {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.12s ease;
  }

  .cal-day.empty {
    cursor: default;
  }

  .cal-day:not(.empty):hover {
    transform: scale(1.15);
  }

  .day-number {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1;
    z-index: 1;
  }

  .cal-day.sun .day-number { color: #4a9fff; }
  .cal-day.sat .day-number { color: #c4001a; }

  .cal-day.active .day-number {
    color: #fff;
    font-weight: 700;
  }

  .cal-day.selected .day-number {
    color: #fff;
  }

  /* Activity ring */
  .activity-ring {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 1.5px solid rgba(60, 226, 255, 0.5);
    pointer-events: none;
  }

  .cal-day.selected .activity-ring {
    border-color: rgba(196, 0, 26, 0.6);
  }

  /* Today marker */
  .cal-day.today .day-number {
    color: #fff;
    font-weight: 700;
  }

  .today-label {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 6px;
    letter-spacing: 0.5px;
    color: #ff4081;
    z-index: 2;
    transition: opacity 0.15s ease;
  }

  .cal-day.selected .today-label {
    opacity: 0;
  }

  .today-triangle {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 5px solid #ff4081;
    z-index: 0;
    transition: opacity 0.15s ease;
  }

  .cal-day.selected .today-triangle {
    opacity: 0;
  }

  /* Selected state */
  .cal-day.selected {
    transform: scale(1.05);
  }

  .cal-day.selected::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    border: 1.5px solid rgba(196, 0, 26, 0.7);
    pointer-events: none;
  }
</style>
