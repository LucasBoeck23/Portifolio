# Design Document: Persona 3 Portfolio (SvelteKit)

## Overview

Migração do portfólio Persona 3 de React+framer-motion para SvelteKit 5 com runes e CSS @keyframes. A arquitetura segue o modelo de file-based routing do SvelteKit, componentes Svelte com scoped styles, e estado reativo via $state/$derived/$effect.

## Architecture

## Technology Stack

- **Framework:** SvelteKit (Vite bundler)
- **Language:** Svelte 5 (runes)
- **Routing:** SvelteKit file-based routing
- **Animations:** CSS @keyframes + Svelte transition/in/out directives
- **Fonts:** Google Fonts (Anton, Bebas Neue, Barlow Condensed, Montserrat)
- **Assets:** Static MP4 videos, PNG/JPEG images from reference project

---

## Project Structure

```
src/
├── app.html                     # HTML shell with Google Fonts link
├── app.css                      # Global styles (reset, body, video base)
├── routes/
│   ├── +layout.svelte           # Root layout with transition wrapper
│   ├── +page.svelte             # Menu Principal (home route "/")
│   ├── about/
│   │   └── +page.svelte         # About Me page
│   ├── resume/
│   │   └── +page.svelte         # Resume page
│   └── socials/
│       └── +page.svelte         # Socials page
├── lib/
│   ├── components/
│   │   ├── P3Menu.svelte        # Menu component with items
│   │   ├── AboutBars.svelte     # About page bar list
│   │   ├── RevealPanel.svelte   # About page reveal overlay
│   │   ├── ResumeCards.svelte   # Resume page card stack
│   │   ├── ResumeDetail.svelte  # Resume detail panel
│   │   ├── SocialBars.svelte    # Socials left panel bars
│   │   ├── SocialInfoBars.svelte# Socials right panel info bars
│   │   ├── SocialNav.svelte     # Socials right-side nav header
│   │   ├── VideoBackground.svelte# Reusable video background
│   │   ├── KeyboardHints.svelte # Reusable keyboard hint overlay
│   │   └── transitions/
│   │       ├── TransitionOverlay.svelte  # Dispatcher component
│   │       ├── DefaultTransition.svelte
│   │       ├── AboutTransition.svelte
│   │       ├── SocialsTransition.svelte
│   │       └── ResumeTransition.svelte
│   ├── data/
│   │   ├── menu-items.ts        # Menu items config (labels, sizes, skews)
│   │   ├── about-items.ts       # About page bars data + reveal content
│   │   ├── resume-items.ts      # Resume categories + detail rows
│   │   └── social-items.ts      # Social platforms + stats + info bars
│   ├── stores/
│   │   └── navigation.svelte.ts # Navigation state (transition variant)
│   └── utils/
│       ├── keyboard.ts          # Keyboard navigation helpers
│       └── transition-map.ts    # Route → transition variant mapping
├── assets/
│   ├── videos/                  # MP4 background videos
│   └── images/                  # PNG/JPEG character/icon assets
└── static/
    └── favicon.svg
```

---

## Components and Interfaces

### Component Hierarchy

```
+layout.svelte
├── TransitionOverlay (plays on route change)
└── <slot /> (page content fades in after delay)
    ├── +page.svelte (Menu Principal)
    │   ├── VideoBackground
    │   └── P3Menu
    ├── about/+page.svelte
    │   ├── VideoBackground
    │   ├── AboutBars
    │   ├── RevealPanel (conditional)
    │   └── KeyboardHints
    ├── resume/+page.svelte
    │   ├── VideoBackground (with circle-reveal mask)
    │   ├── ResumeCards
    │   └── ResumeDetail
    └── socials/+page.svelte
        ├── VideoBackground
        ├── SocialBars
        ├── SocialNav
        ├── SocialInfoBars
        └── KeyboardHints
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `VideoBackground` | Renders a looping muted MP4 video covering the viewport |
| `P3Menu` | Menu items with skew transforms, glow, triangles, keyboard nav |
| `TransitionOverlay` | Dispatches correct transition variant based on route |
| `AboutBars` | 3 interactive bars with character PNGs, role labels |
| `RevealPanel` | Diagonal panel with upper/lower bars, portrait, LB/RB nav |
| `ResumeCards` | 4 parallelogram cards with badges, stagger animation |
| `ResumeDetail` | Right-side panel with rows for active category |
| `SocialBars` | 3 platform bars with stats, characters |
| `SocialInfoBars` | Right-side info bars with icons, links, NEW signs |
| `SocialNav` | LB/RB navigation header with platform label |
| `KeyboardHints` | ↑↓/↵/ESC hints in bottom-right corner |

---

## State Management with Runes

### Per-Page State Pattern

Each page component manages its own local state using Svelte 5 runes. No global store is needed for page-level UI state since pages are independent.

```svelte
<script>
  // Mutable state
  let active = $state(0);
  let mounted = $state(false);
  let revealed = $state(false);
  let focus = $state('left'); // for Socials dual-panel

  // Derived values
  let opacity = $derived(
    (index) => active === index ? 1 : Math.max(0.5, 1 - Math.abs(index - active) * 0.2)
  );
  let activeItem = $derived(items[active]);

  // Side effects
  $effect(() => {
    const timer = setTimeout(() => mounted = true, 60);
    return () => clearTimeout(timer);
  });

  $effect(() => {
    const onKey = (e) => { /* keyboard handler */ };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>
```

### Navigation Store (Shared)

The transition variant needs to be shared between the layout (which renders the overlay) and the navigation trigger. This uses a module-level reactive store:

```typescript
// src/lib/stores/navigation.svelte.ts
let transitionVariant = $state('default');

export function getTransitionVariant() {
  return transitionVariant;
}

export function setTransitionVariant(variant: string) {
  transitionVariant = variant;
}
```

---

## Transition System Design

### How Transitions Work (without framer-motion)

The transition system replaces AnimatePresence + motion.div with CSS @keyframes animations triggered by Svelte's reactive mount/unmount lifecycle.

**Flow:**
1. User triggers navigation (Enter key, click)
2. `setTransitionVariant(variant)` is called based on target route
3. Layout component shows `TransitionOverlay` with the selected variant
4. Overlay plays CSS @keyframes animation (450-600ms depending on variant)
5. After overlay starts (180ms delay), page content fades in via CSS opacity transition
6. Overlay animation completes and overlay is removed

### Route-to-Variant Mapping

```typescript
// src/lib/utils/transition-map.ts
export function getVariantForRoute(path: string): string {
  if (path === '/about') return 'about';
  if (path === '/resume') return 'resume';
  if (path === '/socials') return 'socials';
  return 'default';
}
```

### TransitionOverlay Component

```svelte
<!-- src/lib/components/transitions/TransitionOverlay.svelte -->
<script>
  let { variant = 'default' } = $props();
</script>

{#if variant === 'about'}
  <AboutTransition />
{:else if variant === 'resume'}
  <ResumeTransition />
{:else if variant === 'socials'}
  <SocialsTransition />
{:else}
  <DefaultTransition />
{/if}
```

### Transition Animation Pattern (DefaultTransition example)

```svelte
<script>
  const blocks = [
    { color: '#0d1a3a', delay: 0 },
    { color: '#1a6aff', delay: 50 },
    { color: '#7dd4fc', delay: 100 },
  ];
</script>

{#each blocks as block, i}
  <div
    class="block"
    style="background: {block.color}; animation-delay: {block.delay}ms;"
  />
{/each}

<style>
  .block {
    position: fixed;
    inset: 0;
    z-index: 999;
    transform-origin: left;
    animation: scaleBlock 450ms cubic-bezier(0.76, 0, 0.24, 1) forwards;
  }

  @keyframes scaleBlock {
    0%   { transform: scaleX(0); }
    40%  { transform: scaleX(1); }
    60%  { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }
</style>
```

---

## Navigation/Routing Strategy

### SvelteKit Programmatic Navigation

```svelte
<script>
  import { goto } from '$app/navigation';
  import { getVariantForRoute } from '$lib/utils/transition-map';
  import { setTransitionVariant } from '$lib/stores/navigation.svelte';

  function navigateTo(path: string) {
    setTransitionVariant(getVariantForRoute(path));
    // Small delay to let transition overlay start before route changes
    setTimeout(() => goto(path), 50);
  }

  function goBack() {
    history.back();
  }
</script>
```

### Layout with Transition Integration

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import TransitionOverlay from '$lib/components/transitions/TransitionOverlay.svelte';
  import { getTransitionVariant } from '$lib/stores/navigation.svelte';
  import { page } from '$app/stores';

  let showTransition = $state(false);
  let variant = $derived(getTransitionVariant());

  // Watch for route changes
  $effect(() => {
    // Track page path to trigger on route change
    const _path = $page.url.pathname;
    showTransition = true;
    const timer = setTimeout(() => showTransition = false, 700);
    return () => clearTimeout(timer);
  });
</script>

{#if showTransition}
  <TransitionOverlay {variant} />
{/if}

<div class="page-content" class:fade-in={!showTransition}>
  <slot />
</div>

<style>
  .page-content {
    opacity: 0;
    transition: opacity 200ms ease;
    transition-delay: 180ms;
  }
  .page-content.fade-in {
    opacity: 1;
  }
</style>
```

### External Links (GitHub, Side Projects)

Menu items that link externally (GITHUB LINK, SIDE PROJECTS) use `window.open(url, '_blank')` instead of SvelteKit navigation.

---

## CSS/Styling Architecture

### Global Styles (app.css)

```css
/* src/app.css */
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&family=Montserrat:wght@300&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}
```

### Scoped Styles per Component

Each `.svelte` component uses `<style>` blocks for scoped CSS. No global CSS classes beyond the reset. This replaces the injected `<style>` tags from the React reference.

### Animation Patterns

All animations use CSS @keyframes with these patterns:

| Pattern | Usage |
|---------|-------|
| `scaleX(0→1→0)` | Default page transition blocks |
| `translateX(-N→0)` | Bar slide-in, card slide-in, About diagonal panels |
| `translateY(-N→0→N)` | Socials vertical stripes |
| `clip-path circle(0→150vmax)` | Resume entry reveal |
| `opacity 0→1` | Page content fade-in, mount animations |
| `translateX + opacity` | Staggered menu item entrance |

### Svelte Transition Directives

For mount/unmount animations, use Svelte's built-in transition system:

```svelte
{#if revealed}
  <div transition:fade={{ duration: 320 }}>
    <!-- reveal panel content -->
  </div>
{/if}
```

For complex animations not covered by built-in transitions, use CSS class toggling with `mounted` state:

```svelte
<div class="bar" class:mounted>...</div>

<style>
  .bar {
    transform: translateX(-100%);
    transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .bar.mounted {
    transform: translateX(0);
  }
</style>
```

---

## Data Models

### Menu Item

```typescript
// src/lib/data/menu-items.ts
export interface MenuItem {
  id: string;
  label: string;
  page: string;       // route path or external URL
  fontSize: number;
  offsetX: number;
  offsetY: number;
  skewX: number;
  skewY: number;
  external?: boolean; // true for GitHub, Side Projects
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'about', label: 'ABOUT ME', page: '/about', fontSize: 80, offsetX: 0, offsetY: 0, skewX: -6, skewY: 10 },
  { id: 'resume', label: 'RESUME', page: '/resume', fontSize: 66, offsetX: 20, offsetY: 8, skewX: -11, skewY: -10 },
  { id: 'github', label: 'GITHUB LINK', page: 'https://github.com/...', fontSize: 68, offsetX: 8, offsetY: 6, skewX: 0, skewY: -4, external: true },
  { id: 'socials', label: 'SOCIALS', page: '/socials', fontSize: 74, offsetX: 16, offsetY: 8, skewX: -3, skewY: 5 },
  { id: 'sideproj', label: 'SIDE PROJECTS', page: 'https://...', fontSize: 56, offsetX: 10, offsetY: 6, skewX: -4, skewY: 7, external: true },
];
```

### About Item

```typescript
// src/lib/data/about-items.ts
export interface AboutItem {
  id: string;
  label: string;
  role: { text: string; color: string };
  character: string; // asset path
  revealContent: {
    upper: string[];
    lower: string;
  };
  portrait: string;  // asset path
}
```

### Resume Item

```typescript
// src/lib/data/resume-items.ts
export interface ResumeCategory {
  id: string;
  badge: string;    // Roman numeral
  title: string;
  subtitle: string;
  rank: number;
  rows: ResumeRow[];
}

export interface ResumeRow {
  index: string;
  title: string;
  status: string;
}
```

### Social Item

```typescript
// src/lib/data/social-items.ts
export interface SocialPlatform {
  id: string;
  label: string;
  handle: string;
  href: string;
  icon: string;
  barIcon: string;  // asset path
  character: string; // asset path
  role: { text: string; color: string };
  stats: SocialStat[];
  infoBars: SocialInfoBar[];
}

export interface SocialStat {
  tag: string;    // FOL, VWR, PST, LKS
  value: string;
  color: string;
}

export interface SocialInfoBar {
  link: string;
  count: string;
  isNew: boolean;
}
```

---

## Keyboard Navigation System

### Shared Pattern

All pages follow the same bounded-index keyboard navigation pattern:

```typescript
// src/lib/utils/keyboard.ts
export function clampIndex(current: number, direction: 'up' | 'down', max: number): number {
  if (direction === 'up') return Math.max(0, current - 1);
  if (direction === 'down') return Math.min(max, current + 1);
  return current;
}
```

Each page registers a `$effect` with `window.addEventListener('keydown', handler)` and cleans up on unmount. The handler maps:

- `ArrowUp` / `ArrowDown` → change active index within bounds
- `Enter` → primary action (navigate, reveal, open link)
- `ArrowLeft` → go back or close panel
- `ArrowRight` → reveal panel or switch focus panel
- `Escape` / `Backspace` → navigate back to previous page

### Socials Dual-Panel Focus

The Socials page adds a `focus` state (`'left' | 'right'`) that determines which panel receives keyboard events:

```svelte
<script>
  let focus = $state('left');
  let activeBar = $state(0);
  let activeInfoBar = $state(0);

  $effect(() => {
    const onKey = (e) => {
      if (focus === 'left') {
        if (e.key === 'ArrowRight') { focus = 'right'; activeInfoBar = 0; }
        // ... left panel handlers
      } else {
        if (e.key === 'ArrowLeft') { focus = 'left'; }
        // ... right panel handlers
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>
```

---

## Error Handling

### Animation Graceful Degradation

If CSS animations fail to load or are disabled (e.g., `prefers-reduced-motion`), the page content still renders after the transition timeout expires. The `showTransition` flag is always set to `false` after the maximum transition duration (700ms), ensuring content appears regardless of animation state.

### Asset Loading

Video backgrounds use `playsinline` and `muted` attributes for autoplay compatibility. If a video fails to load, the page background falls back to the black body background.

### Navigation Fallback

External links (GitHub, Side Projects) use `window.open` with `'_blank'` target. If popup is blocked, the URL is still accessible via the menu item's data.

---

## Testing Strategy

- **Unit tests (Vitest):** Verify data model integrity, keyboard navigation utility functions, transition variant mapping, opacity calculation
- **Property tests (fast-check + Vitest):** Validate universal properties across generated inputs for navigation logic, data rendering, state transitions
- **Manual testing:** Visual animations, video playback, responsive behavior, cross-browser video autoplay

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Bounded Keyboard Navigation

*For any* list-based page (Menu, About, Resume, Socials) with N items, and *for any* current active index i, pressing ArrowDown SHALL produce `min(i + 1, N - 1)` and pressing ArrowUp SHALL produce `max(i - 1, 0)`, never exceeding the list bounds.

**Validates: Requirements 2.6, 2.7, 3.6, 4.6, 5.6**

### Property 2: Opacity Decreases with Distance from Active

*For any* menu with N items and *for any* active index a, the opacity of item at index i (where i ≠ a) SHALL equal `max(0.5, 1 - |i - a| * 0.2)`, and items closer to the active item SHALL always have opacity ≥ items farther from it.

**Validates: Requirements 2.4**

### Property 3: Menu Enter Navigates to Correct Route

*For any* active menu item index, pressing Enter SHALL trigger navigation to the route defined in that item's `page` property (internal goto for non-external items, window.open for external items).

**Validates: Requirements 2.8**

### Property 4: Hover Sets Active Index

*For any* menu item at index i, when a hover event occurs on that item, the active state SHALL become i.

**Validates: Requirements 2.9**

### Property 5: Stagger Delay Proportional to Index

*For any* list of items with staggered entrance animations, the transition-delay for item at index i SHALL equal `i * staggerInterval` milliseconds, where staggerInterval is a positive constant (80ms for menu, 55ms for resume cards, 80ms for bars).

**Validates: Requirements 2.12**

### Property 6: Active Item Visual State Toggle

*For any* page with selectable items (About bars, Resume cards, Social bars) and *for any* item index, if the item is active its rendered height/style SHALL reflect the "expanded" state (90px for bars, white background for cards), and if not active it SHALL reflect the "default" state (64px for bars, dark blue for cards).

**Validates: Requirements 3.4, 4.5, 5.5**

### Property 7: Reveal Panel Round-Trip

*For any* state where the About page is showing with `revealed = false`, pressing Enter or ArrowRight SHALL set `revealed = true`. Subsequently pressing ArrowLeft SHALL set `revealed = false`, returning to the original state.

**Validates: Requirements 3.7, 3.8**

### Property 8: Focus Panel Round-Trip

*For any* state on the Socials page, if focus is `'left'`, pressing ArrowRight SHALL set focus to `'right'`. Subsequently pressing ArrowLeft SHALL set focus to `'left'`, returning to the original panel.

**Validates: Requirements 5.7, 5.8**

### Property 9: Route-to-Transition Variant Mapping

*For any* navigation target route, the transition variant SHALL be deterministically selected: `/about` → 'about', `/resume` → 'resume', `/socials` → 'socials', all other routes → 'default'.

**Validates: Requirements 6.6, 6.7, 6.8, 6.9**

### Property 10: Platform Data Integrity for Info Bars

*For any* active social platform, the number of rendered info bars SHALL equal that platform's defined bar count, each bar's `isNew` status SHALL match the platform's `newBars` indices, and each bar's count SHALL match the platform's `counts` array at the corresponding index.

**Validates: Requirements 5.4, 5.12, 5.13**

### Property 11: Enter Opens Correct Link Based on Focus

*For any* active platform and active info bar index on the Socials page, pressing Enter with focus `'left'` SHALL open the platform's `href`, and pressing Enter with focus `'right'` SHALL open the info bar's link at the active info bar index.

**Validates: Requirements 5.9, 5.10**

### Property 12: Detail Panel Shows Active Category Data

*For any* active Resume category index, the detail panel SHALL render exactly the rows defined in that category's `rows` array, with each row displaying its index, title, and status values.

**Validates: Requirements 4.9**
