<script lang="ts">
  let visible = $state(false);

  $effect(() => {
    // Small delay to trigger the CSS animation after mount
    const raf = requestAnimationFrame(() => {
      visible = true;
    });
    return () => cancelAnimationFrame(raf);
  });
</script>

<div class="overlay" class:visible>
  <div class="circle-wipe"></div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    overflow: hidden;
  }

  .circle-wipe {
    position: absolute;
    inset: 0;
    background: #0a0a12;
    clip-path: circle(0% at 50% 50%);
    animation: none;
  }

  .overlay.visible .circle-wipe {
    animation: circle-transition 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes circle-transition {
    0% {
      clip-path: circle(0% at 50% 50%);
      opacity: 1;
    }
    40% {
      clip-path: circle(150% at 50% 50%);
      opacity: 1;
    }
    60% {
      clip-path: circle(150% at 50% 50%);
      opacity: 1;
    }
    100% {
      clip-path: circle(150% at 50% 50%);
      opacity: 0;
    }
  }
</style>
