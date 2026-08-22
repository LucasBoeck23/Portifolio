<script lang="ts">
  let { src, fallback }: { src: string; fallback?: string } = $props();
</script>

<video loop muted playsinline autoplay preload="auto" class="video-bg">
  <source {src} type="video/webm" />
  {#if fallback}
    <source src={fallback} type="video/mp4" />
  {/if}
</video>

<style>
  .video-bg {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    background: #000;
  }
</style>
