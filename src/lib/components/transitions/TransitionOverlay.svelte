<script lang="ts">
  import transitionVideo from '$assets/videos/circletransition.webm';

  let videoEl: HTMLVideoElement;
  let canvasEl: HTMLCanvasElement;
  let animationId: number;
  let visible = $state(false);

  $effect(() => {
    if (!videoEl || !canvasEl) return;

    videoEl.currentTime = 0.5;
    visible = false;

    videoEl.addEventListener('seeked', () => {
      visible = true;
      videoEl.play();
    }, { once: true });

    const ctx = canvasEl.getContext('2d', { willReadFrequently: true })!;

    function processFrame() {
      if (videoEl.paused || videoEl.ended) return;

      canvasEl.width = videoEl.videoWidth || 1920;
      canvasEl.height = videoEl.videoHeight || 1080;

      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

      const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detecta verde: G é dominante e R/B são baixos
        if (g > 80 && g > r * 1.4 && g > b * 1.4) {
          data[i + 3] = 0; // torna transparente
        }
      }

      ctx.putImageData(frame, 0, 0);

      animationId = requestAnimationFrame(processFrame);
    }

    videoEl.addEventListener('play', () => {
      processFrame();
    });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  });
</script>

<div class="overlay">
  <video
    bind:this={videoEl}
    src={transitionVideo}
    muted
    playsinline
    class="video-hidden"
  ></video>
  <canvas bind:this={canvasEl} class="canvas" class:visible></canvas>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    pointer-events: none;
  }

  .video-hidden {
    display: none;
  }

  .canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
  }

  .canvas.visible {
    opacity: 1;
  }
</style>
