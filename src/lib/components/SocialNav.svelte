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

  /* Canto superior direito, sempre afastado da "gaveta" do player
     de música (que ocupa ~50px da borda direita). */
  .social-nav {
    position: fixed;
    top: clamp(16px, 4vh, 40px);
    right: max(64px, 4vw);
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 50;
    animation: nav-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top right;
  }

  .social-nav-arrows {
    display: flex;
    align-items: center;
    gap: 0.3em;
  }

  .nav-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(18px, 1vw + 14px, 28px);
    letter-spacing: 0.11em;
    line-height: 1;
    user-select: none;
    color: #111;
    padding: 0 0.3em;
  }

  .arrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(14px, 0.8vw + 11px, 22px);
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
