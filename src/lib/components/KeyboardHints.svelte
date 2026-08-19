<script lang="ts">
  const hints = [
    { keys: '↑↓', action: 'SELECT' },
    { keys: '↵', action: 'OPEN' },
    { keys: 'ESC', action: 'BACK' },
  ];
</script>

<div class="keyboard-hints">
  {#each hints as hint}
    <div class="hint">
      <span class="keys">{hint.keys}</span>
      <span class="action">{hint.action}</span>
    </div>
  {/each}
</div>

<style>
  .keyboard-hints {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .hint {
    display: flex;
    gap: 8px;
    align-items: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }
  .keys {
    font-weight: 700;
    color: #fff;
  }
  .action {
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>
