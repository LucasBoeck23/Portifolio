<script lang="ts">
  let { src, fallback, poster }: { src: string; fallback?: string; poster?: string } = $props();
</script>

<video loop muted playsinline autoplay preload="metadata" class="video-bg" poster={poster}>
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
  }
</style>
