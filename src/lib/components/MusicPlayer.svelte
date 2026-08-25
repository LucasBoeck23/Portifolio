<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  interface Track {
    title: string;
    artist: string;
    file: string;
  }

  const TRACKS: Track[] = [
    {
      title: 'Mass Destruction',
      artist: 'Lotus Juice',
      file: 'mass-destruction.opus',
    },
    {
      title: 'Burn My Dread',
      artist: 'Yumi Kawamura',
      file: 'burn-my-dread.opus',
    },
    {
      title: "Moon's Reaching Out Stars",
      artist: 'Yumi Kawamura',
      file: 'moons-reaching.opus',
    },
    {
      title: 'Full Moon Full Life',
      artist: 'Azumi Takahashi',
      file: 'full-moon-full-life.opus',
    },
    {
      title: 'Color Your Night',
      artist: 'Azumi Takahashi',
      file: 'color-your-night.opus',
    },
  ];

  function trackSrc(index: number): string {
    return `${base}/audio/${TRACKS[index].file}`;
  }

  let expanded = $state(false);
  let isPlaying = $state(false);
  let currentTrack = $state(0);
  let currentTime = $state(0);
  let duration = $state(0);
  let mounted = $state(false);

  // Double-buffering: two audio elements
  let activeAudio: HTMLAudioElement | null = null;
  let preloadAudio: HTMLAudioElement | null = null;

  function formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function togglePlay() {
    if (!activeAudio) return;
    if (isPlaying) {
      activeAudio.pause();
    } else {
      activeAudio.play().catch(() => {});
    }
  }

  function switchToTrack(index: number) {
    // Stop current
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.removeAttribute('src');
      activeAudio.load();
    }

    currentTrack = index;
    currentTime = 0;
    duration = 0;

    // If preload has this track ready, swap them
    if (preloadAudio && preloadAudio.dataset.track === String(index)) {
      const temp = activeAudio;
      activeAudio = preloadAudio;
      preloadAudio = temp;
    } else {
      // Load fresh
      if (activeAudio) {
        activeAudio.src = trackSrc(index);
      }
    }

    if (activeAudio) {
      activeAudio.dataset.track = String(index);
      activeAudio.play().catch(() => {});
    }

    // Start preloading next track
    preloadNext();
  }

  function nextTrack() {
    switchToTrack((currentTrack + 1) % TRACKS.length);
  }

  function prevTrack() {
    if (currentTime > 3) {
      if (activeAudio) {
        activeAudio.currentTime = 0;
        currentTime = 0;
      }
    } else {
      switchToTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
    }
  }

  function preloadNext() {
    const nextIndex = (currentTrack + 1) % TRACKS.length;
    if (preloadAudio && preloadAudio.dataset.track !== String(nextIndex)) {
      preloadAudio.src = trackSrc(nextIndex);
      preloadAudio.dataset.track = String(nextIndex);
      preloadAudio.preload = 'auto';
    }
  }

  function handleProgressClick(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (activeAudio && duration > 0) {
      activeAudio.currentTime = ratio * duration;
    }
  }

  function setupAudioEvents(audio: HTMLAudioElement) {
    audio.addEventListener('timeupdate', () => {
      if (audio === activeAudio) {
        currentTime = audio.currentTime;
      }
    });
    audio.addEventListener('loadedmetadata', () => {
      if (audio === activeAudio) {
        duration = audio.duration;
      }
    });
    audio.addEventListener('durationchange', () => {
      if (audio === activeAudio && audio.duration) {
        duration = audio.duration;
      }
    });
    audio.addEventListener('play', () => {
      if (audio === activeAudio) isPlaying = true;
    });
    audio.addEventListener('pause', () => {
      if (audio === activeAudio) isPlaying = false;
    });
    audio.addEventListener('ended', () => {
      if (audio === activeAudio) {
        isPlaying = false;
        nextTrack();
      }
    });
  }

  onMount(() => {
    mounted = true;

    // Create two audio elements
    activeAudio = document.createElement('audio');
    preloadAudio = document.createElement('audio');

    activeAudio.preload = 'auto';
    preloadAudio.preload = 'none';

    setupAudioEvents(activeAudio);
    setupAudioEvents(preloadAudio);

    // Load first track
    activeAudio.src = trackSrc(0);
    activeAudio.dataset.track = '0';

    // Preload second track
    preloadAudio.src = trackSrc(1);
    preloadAudio.dataset.track = '1';
    preloadAudio.preload = 'auto';

    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.src = '';
      }
      if (preloadAudio) {
        preloadAudio.src = '';
      }
    };
  });

  let progressPercent = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
  let track = $derived(TRACKS[currentTrack]);
  let displayTitle = $derived(track.title.toUpperCase().replace(/ /g, '_'));
</script>

<!-- NW-S205F Player -->
<div
  class="mp3-player"
  class:expanded
  class:mounted
  role="region"
  aria-label="Music Player"
  onmouseenter={() => (expanded = true)}
  onmouseleave={() => (expanded = false)}
>
  <div class="player-inner">
    <div class="player-body">
      <!-- Black cap (left) -->
      <div class="cap-black">
        <div class="clip-ring"></div>
        <div class="clip-arm"></div>
      </div>

      <!-- Silver body -->
      <div class="body-silver">
        <!-- LCD Display -->
        <div class="lcd-screen">
          <div class="lcd-row lcd-row-title">
            <span class="lcd-play-icon">{isPlaying ? '▶' : '■'}</span>
            <span class="lcd-title-text">{displayTitle}</span>
          </div>
          <div class="lcd-row lcd-row-time">
            <span class="lcd-time-display">{formatTime(currentTime)}</span>
            <span class="lcd-time-total">{formatTime(duration)}</span>
          </div>
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="lcd-row lcd-row-progress" onclick={handleProgressClick}>
            <div class="lcd-progress-track">
              <div class="lcd-progress-fill" style:width="{progressPercent}%"></div>
            </div>
            <span class="lcd-vol">VOL.</span>
            <span class="lcd-vol-bars">██████</span>
          </div>
        </div>

        <!-- Right section -->
        <div class="body-buttons">
          <div class="btn-dot"></div>
        </div>
      </div>

      <!-- Silver end cap (right) -->
      <div class="cap-silver"></div>
    </div>

    <!-- Controls -->
    {#if expanded}
      <div class="controls">
        <button class="ctrl-btn" onclick={prevTrack} aria-label="Previous track">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        <button class="ctrl-btn ctrl-play" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {#if isPlaying}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          {:else}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          {/if}
        </button>
        <button class="ctrl-btn" onclick={nextTrack} aria-label="Next track">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');

  .mp3-player {
    position: fixed;
    top: 20px;
    right: 0;
    z-index: 9999;
    transform: translateX(calc(100% - 50px));
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
  }

  .mp3-player.mounted {
    opacity: 1;
  }

  .mp3-player.expanded {
    transform: translateX(-16px);
  }

  .player-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  /* === PLAYER BODY === */
  .player-body {
    display: flex;
    align-items: center;
    height: 52px;
    filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.55));
  }

  /* --- Black cap (left) --- */
  .cap-black {
    position: relative;
    width: 42px;
    height: 52px;
    background: linear-gradient(
      to bottom,
      #3a3a3a 0%,
      #2a2a2a 20%,
      #1a1a1a 50%,
      #111 80%,
      #0a0a0a 100%
    );
    border-radius: 26px 0 0 26px;
    margin-right: -4px;
    z-index: 2;
    box-shadow:
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      inset 0 -2px 4px rgba(0, 0, 0, 0.4);
  }

  .clip-ring {
    position: absolute;
    top: 4px;
    left: 12px;
    width: 10px;
    height: 10px;
    border: 2px solid #555;
    border-radius: 50%;
  }

  .clip-arm {
    position: absolute;
    top: 14px;
    left: 8px;
    width: 5px;
    height: 24px;
    background: linear-gradient(to bottom, #333, #1a1a1a);
    border-radius: 2px;
    box-shadow: 1px 0 2px rgba(0, 0, 0, 0.4);
  }

  /* --- Silver body (center) --- */
  .body-silver {
    display: flex;
    align-items: center;
    height: 52px;
    background: linear-gradient(
      to bottom,
      #9a9a9a 0%,
      #b0b0b0 10%,
      #a0a0a0 25%,
      #858585 50%,
      #6a6a6a 75%,
      #4a4a4a 90%,
      #3a3a3a 100%
    );
    padding: 0 8px 0 10px;
    gap: 8px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  /* --- LCD Screen --- */
  .lcd-screen {
    width: 185px;
    height: 42px;
    background: #c2d9a1;
    border: 2px solid #111;
    border-radius: 3px;
    padding: 3px 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.5);
  }

  .lcd-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .lcd-row-title {
    overflow: hidden;
    white-space: nowrap;
  }

  .lcd-play-icon {
    font-family: 'Silkscreen', monospace;
    font-size: 7px;
    color: #2a4a2a;
    flex-shrink: 0;
  }

  .lcd-title-text {
    font-family: 'Silkscreen', monospace;
    font-size: 7px;
    font-weight: 700;
    color: #2a4a2a;
    letter-spacing: 0.3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lcd-row-time {
    justify-content: space-between;
    align-items: baseline;
  }

  .lcd-time-display {
    font-family: 'Silkscreen', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #2a4a2a;
    letter-spacing: 1.5px;
  }

  .lcd-time-total {
    font-family: 'Silkscreen', monospace;
    font-size: 7px;
    color: #4a6a4a;
    letter-spacing: 0.5px;
  }

  .lcd-row-progress {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  .lcd-progress-track {
    flex: 1;
    height: 3px;
    background: #9ab88a;
    overflow: hidden;
  }

  .lcd-progress-fill {
    height: 100%;
    background: #2a4a2a;
    transition: width 0.4s linear;
  }

  .lcd-vol {
    font-family: 'Silkscreen', monospace;
    font-size: 6px;
    color: #4a6a4a;
    flex-shrink: 0;
  }

  .lcd-vol-bars {
    font-family: 'Silkscreen', monospace;
    font-size: 6px;
    color: #2a4a2a;
    letter-spacing: -0.5px;
    flex-shrink: 0;
  }

  /* --- Buttons area --- */
  .body-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
  }

  .btn-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  /* --- Silver end cap (right) --- */
  .cap-silver {
    width: 24px;
    height: 52px;
    background: linear-gradient(
      to bottom,
      #9a9a9a 0%,
      #b5b5b5 15%,
      #a0a0a0 30%,
      #858585 55%,
      #666 80%,
      #4a4a4a 100%
    );
    border-radius: 0 26px 26px 0;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  /* === CONTROLS === */
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    opacity: 0;
    transform: translateY(-2px);
    animation: fade-in 0.25s ease 0.1s forwards;
    background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
    border-radius: 14px;
    padding: 4px 8px;
    border: 1px solid #3a3a3a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @keyframes fade-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ctrl-btn {
    background: linear-gradient(to bottom, #4a4a4a, #2a2a2a);
    border: 1px solid #555;
    color: #bbb;
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .ctrl-btn:hover {
    color: #fff;
    background: linear-gradient(to bottom, #5a5a5a, #3a3a3a);
    border-color: #777;
  }

  .ctrl-btn:active {
    transform: scale(0.92);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }

  .ctrl-play {
    width: 32px;
    height: 32px;
    background: linear-gradient(to bottom, #5a5a5a, #333);
    border-color: #666;
  }

  .ctrl-play:hover {
    background: linear-gradient(to bottom, #6a6a6a, #444);
    border-color: #888;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .mp3-player {
      top: 10px;
      transform: translateX(calc(100% - 35px));
    }

    .lcd-screen {
      width: 150px;
    }
  }
</style>
