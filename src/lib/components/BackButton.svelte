<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
</script>

<button class="back-btn" onclick={() => goto(base + '/')}>
  ◄ VOLTAR
</button>

<style>
  .back-btn {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 50;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 18px;
    cursor: pointer;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .back-btn:hover {
    background: rgba(196, 0, 26, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }
</style>
