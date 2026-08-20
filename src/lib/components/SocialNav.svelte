<script lang="ts">
  let { platformLabel = '' }: { platformLabel: string } = $props();
</script>

<div class="social-nav">
  <div class="social-nav-arrows">
    <span class="arrow left">◄</span>
    <span class="nav-label">{platformLabel}</span>
    <span class="arrow right">►</span>
  </div>
</div>

<style>
  @keyframes arrow-bounce-left {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50%      { transform: translateX(-5px); opacity: 0.4; }
  }

  @keyframes arrow-bounce-right {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50%      { transform: translateX(5px); opacity: 0.4; }
  }

  @keyframes nav-pop {
    0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
    65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  .social-nav {
    position: fixed;
    top: 40px;
    right: 40px;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    z-index: 50;
    animation: nav-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top right;
    scale: var(--ui-scale, 1);
  }

  .social-nav-arrows {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 100px;
    letter-spacing: 3px;
    line-height: 1;
    user-select: none;
    color: #fff;
    -webkit-text-stroke: 2px #000;
    paint-order: stroke fill;
    background: none;
    border: none;
    padding: 0 6px;
  }

  .nav-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 3px;
    line-height: 1;
    user-select: none;
    color: #111;
    padding: 0 8px;
  }

  .arrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #c4001a;
    display: inline-block;
    user-select: none;
  }

  .arrow.left {
    animation: arrow-bounce-left 0.8s ease-in-out infinite;
  }

  .arrow.right {
    animation: arrow-bounce-right 0.8s ease-in-out infinite;
  }
</style>
