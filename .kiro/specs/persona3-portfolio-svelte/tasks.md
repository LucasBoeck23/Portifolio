# Implementation Plan: Persona 3 Portfolio (SvelteKit)

## Overview

Migração incremental do portfólio estilo Persona 3 de React para SvelteKit 5 com runes. O plano segue a ordem: scaffold → dados → componentes utilitários → transições → páginas → integração, garantindo que cada etapa constrói sobre a anterior sem código órfão.

## Tasks

- [x] 1. Scaffold do Projeto e Infraestrutura Base
  - [x] 1.1 Criar o projeto SvelteKit com Svelte 5, configurar `app.html` com Google Fonts (Anton, Bebas Neue, Barlow Condensed, Montserrat), criar `app.css` com reset global (body background black, overflow hidden, box-sizing), e configurar aliases em `svelte.config.js`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Copiar todos os assets (vídeos MP4, imagens PNG/JPEG) de `REFERENCIA/persona3-website/src/assets/` para `src/assets/` organizados em subpastas `videos/` e `images/`, e copiar `favicon.svg` para `static/`
    - _Requirements: 1.5_

  - [x] 1.3 Criar os arquivos de dados tipados: `src/lib/data/menu-items.ts`, `src/lib/data/about-items.ts`, `src/lib/data/resume-items.ts`, `src/lib/data/social-items.ts` com interfaces TypeScript e arrays de dados conforme design
    - _Requirements: 2.2, 3.2, 4.3, 5.2_

  - [x] 1.4 Criar os utilitários: `src/lib/utils/keyboard.ts` (clampIndex function), `src/lib/utils/transition-map.ts` (getVariantForRoute function), e `src/lib/stores/navigation.svelte.ts` (transitionVariant store com get/set)
    - _Requirements: 6.6, 6.7, 6.8, 6.9, 7.1_

  - [x] 1.5 Write property tests for utility functions
    - **Property 1: Bounded Keyboard Navigation** — clampIndex never exceeds [0, N-1] for any input
    - **Property 9: Route-to-Transition Variant Mapping** — getVariantForRoute deterministically maps /about→'about', /resume→'resume', /socials→'socials', else→'default'
    - **Validates: Requirements 2.6, 2.7, 3.6, 4.6, 5.6, 6.6, 6.7, 6.8, 6.9**

- [x] 2. Componentes Utilitários Compartilhados
  - [x] 2.1 Criar `src/lib/components/VideoBackground.svelte` — componente reutilizável que renderiza um `<video>` loop, muted, playsinline, autoplay cobrindo todo o viewport com `object-fit: cover` e position fixed
    - _Requirements: 2.1, 3.1, 4.1, 5.1_

  - [x] 2.2 Criar `src/lib/components/KeyboardHints.svelte` — componente que renderiza labels de hint (↑↓ SELECT, ↵ OPEN, ESC BACK) posicionados no canto inferior direito
    - _Requirements: 5.15_

- [x] 3. Transition System
  - [x] 3.1 Criar `src/lib/components/transitions/DefaultTransition.svelte` — 3 blocos coloridos (#0d1a3a, #1a6aff, #7dd4fc) com animação `scaleX(0→1→0)`, stagger delays de 50ms, duração total 450ms
    - _Requirements: 6.2_

  - [x] 3.2 Criar `src/lib/components/transitions/AboutTransition.svelte` — 3 painéis diagonais (dark blue, cyan, white) rotados -18deg, translateX(-500→0), clip-path parallelogram, duração 520ms
    - _Requirements: 6.3_

  - [x] 3.3 Criar `src/lib/components/transitions/SocialsTransition.svelte` — 3 stripes verticais (dark blue, cyan, white) skewadas -16deg, translateY(-1200→0→1200), stagger delays, duração 560ms
    - _Requirements: 6.4_

  - [x] 3.4 Criar `src/lib/components/transitions/ResumeTransition.svelte` — 4 cards parallelogram (dark blue, cyan, white, dark blue) translateX(-900→0→900), stagger delays 50ms, duração 600ms
    - _Requirements: 6.5_

  - [x] 3.5 Criar `src/lib/components/transitions/TransitionOverlay.svelte` — dispatcher component que recebe `variant` via $props e renderiza o componente de transição correto via {#if}
    - _Requirements: 6.1, 6.6, 6.7, 6.8, 6.9_

  - [x] 3.6 Criar `src/routes/+layout.svelte` — root layout que importa TransitionOverlay, observa mudanças de rota via $page, controla showTransition state, e aplica fade-in no conteúdo da página (opacity 0→1, delay 180ms)
    - _Requirements: 6.1, 6.10, 7.2, 7.4, 7.7_

- [x] 4. Checkpoint - Verificar scaffold e transições
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Menu Principal (Home Page)
  - [x] 5.1 Criar `src/lib/components/P3Menu.svelte` — renderiza 5 menu items com font sizes, skewX/skewY transforms, offsets individuais; item ativo com clip-path triangle branco, triangle rosa com pop animation, cor vermelha; itens inativos com cor cyan (#3ce2ff) e opacidade baseada em distância; glow radial gradient atrás do item ativo; name tag rotado 18deg no canto superior esquerdo; stripes vermelho/rosa na borda direita
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.10, 2.11_

  - [x] 5.2 Implementar keyboard navigation e mouse hover no P3Menu — $effect com keydown listener para ArrowUp/ArrowDown (clampIndex), Enter (navigateTo com goto ou window.open para external), hover set active; animação de entrada staggered com translateX e opacity após mount
    - _Requirements: 2.6, 2.7, 2.8, 2.9, 2.12, 7.1, 7.2, 7.6_

  - [x] 5.3 Criar `src/routes/+page.svelte` — página home que compõe VideoBackground (main1.mp4) + P3Menu
    - _Requirements: 2.1_

  - [x] 5.4 Write property tests for Menu component logic
    - **Property 2: Opacity Decreases with Distance from Active** — opacity(i) = max(0.5, 1 - |i - active| * 0.2) for all indices
    - **Property 3: Menu Enter Navigates to Correct Route** — enter on index i triggers navigation to MENU_ITEMS[i].page
    - **Property 4: Hover Sets Active Index** — hover on item i sets active = i
    - **Property 5: Stagger Delay Proportional to Index** — delay(i) = i * 80ms for menu items
    - **Validates: Requirements 2.4, 2.8, 2.9, 2.12**

- [x] 6. About Me Page
  - [x] 6.1 Criar `src/lib/components/AboutBars.svelte` — 3 barras interativas que deslizam da esquerda com stagger delays, character PNG com parallelogram clip-path, role label rotado -30deg, barra ativa expande de 64px para 90px com red underlay e white fill animation
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 6.2 Criar `src/lib/components/RevealPanel.svelte` — painel diagonal com animação de entrada, upper/lower content bars, portrait image (43vw, skewX, fade-in), dimming overlay (rgba 40,45,54,0.68), LB/RB navigation indicators com animated arrows
    - _Requirements: 3.7, 3.10, 3.11, 3.12_

  - [x] 6.3 Criar `src/routes/about/+page.svelte` — compõe VideoBackground + AboutBars + RevealPanel (condicional); keyboard navigation com $effect: ArrowUp/Down (change bar), Enter/ArrowRight (reveal), ArrowLeft (hide reveal), Escape/Backspace (goBack)
    - _Requirements: 3.1, 3.6, 3.7, 3.8, 3.9, 7.1, 7.2_

  - [x] 6.4 Write property tests for About page logic
    - **Property 6: Active Item Visual State Toggle** — active bar renders at 90px, non-active at 64px
    - **Property 7: Reveal Panel Round-Trip** — Enter sets revealed=true, ArrowLeft sets revealed=false
    - **Validates: Requirements 3.4, 3.7, 3.8**

- [x] 7. Resume Page
  - [x] 7.1 Criar `src/lib/components/ResumeCards.svelte` — 4 cards com parallelogram clip-path, dark blue background, staggered slide-in; roman numeral badge (I-IV) rotado -8deg com cyan border; card ativo com white background, red box-shadow (10px 8px), black badge/text; "LIST" title tag com Anton 92px
    - _Requirements: 4.3, 4.4, 4.5, 4.10_

  - [x] 7.2 Criar `src/lib/components/ResumeDetail.svelte` — painel direito (39vw) com gradient blue background, clip-path parallelogram, drop shadow; renderiza detail rows (index, title, status badge) para a categoria ativa
    - _Requirements: 4.8, 4.9_

  - [x] 7.3 Criar `src/routes/resume/+page.svelte` — compõe VideoBackground (com circle-reveal clip-path circle 0→150vmax, blue #0047FF background) + ResumeCards + ResumeDetail; keyboard: ArrowUp/Down (change card), ArrowLeft/Escape/Backspace (goBack)
    - _Requirements: 4.1, 4.2, 4.6, 4.7, 7.1, 7.2_

  - [x] 7.4 Write property tests for Resume page logic
    - **Property 12: Detail Panel Shows Active Category Data** — detail rows count and content match active category's rows array
    - **Property 5: Stagger Delay Proportional to Index** — delay(i) = i * 55ms for resume cards
    - **Validates: Requirements 4.9, 4.3**

- [x] 8. Checkpoint - Verificar Menu, About e Resume
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Socials Page
  - [x] 9.1 Criar `src/lib/components/SocialBars.svelte` — 3 barras (TWITCH, INSTAGRAM, TIKTOK) com slide-in staggered, character PNG com parallelogram clip-path, stat badges (FOL, VWR, PST, LKS) com cores e valores, barra ativa 90px com white fill, red underlay, shade effect
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 9.2 Criar `src/lib/components/SocialNav.svelte` — header direito com label da plataforma ativa, LB/RB indicators com animated arrows
    - _Requirements: 5.11_

  - [x] 9.3 Criar `src/lib/components/SocialInfoBars.svelte` — info bars no lado direito com icon, link text, views box, count; overlay "NEW" sign image em barras marcadas como isNew
    - _Requirements: 5.12, 5.13_

  - [x] 9.4 Criar `src/routes/socials/+page.svelte` — compõe VideoBackground + SocialBars + SocialNav + SocialInfoBars + KeyboardHints; dual-panel focus state ('left'|'right'); keyboard: ArrowUp/Down (change bar em left, change info bar em right), ArrowRight (focus right), ArrowLeft (focus left), Enter (open link based on focus), Escape/Backspace (goBack)
    - _Requirements: 5.1, 5.6, 5.7, 5.8, 5.9, 5.10, 5.14, 5.15, 7.1, 7.2_

  - [x] 9.5 Write property tests for Socials page logic
    - **Property 8: Focus Panel Round-Trip** — ArrowRight sets focus='right', ArrowLeft sets focus='left'
    - **Property 10: Platform Data Integrity for Info Bars** — info bars count equals platform's defined count, isNew matches indices
    - **Property 11: Enter Opens Correct Link Based on Focus** — enter with focus 'left' opens platform href, with focus 'right' opens info bar link
    - **Validates: Requirements 5.7, 5.8, 5.4, 5.12, 5.13, 5.9, 5.10**

- [x] 10. Integração Final e Polimento
  - [x] 10.1 Conectar navigation do Menu para todas as páginas internas (About, Resume, Socials) verificando que setTransitionVariant é chamado antes de goto(), e que links externos (GitHub, Side Projects) usam window.open; verificar que goBack() funciona em todas as páginas com history.back()
    - _Requirements: 2.8, 6.1, 6.6, 6.7, 6.8, 6.9, 7.6_

  - [x] 10.2 Garantir que todos os componentes usam Svelte scoped styles (sem inline style objects), $state/$derived/$effect corretamente, e que animações CSS degradam gracefully (conteúdo aparece mesmo se animação falhar via timeout de 700ms)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_

  - [x] 10.3 Write integration tests validating full navigation flow
    - Test transition overlay appears on route change and disappears after timeout
    - Test page content fades in after 180ms delay
    - Test keyboard navigation works end-to-end across all pages
    - _Requirements: 6.1, 6.10, 7.7_

- [x] 11. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses Svelte 5 runes ($state, $derived, $effect) — no legacy stores API
- All animations use CSS @keyframes and Svelte transition directives — no framer-motion or third-party animation libs
- Assets are copied directly from REFERENCIA/persona3-website/src/assets/

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5", "2.1", "2.2"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3", "3.4"] },
    { "id": 4, "tasks": ["3.5", "3.6"] },
    { "id": 5, "tasks": ["5.1", "6.1", "7.1", "9.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "6.2", "7.2", "9.2", "9.3"] },
    { "id": 7, "tasks": ["5.4", "6.3", "7.3", "9.4"] },
    { "id": 8, "tasks": ["6.4", "7.4", "9.5"] },
    { "id": 9, "tasks": ["10.1", "10.2"] },
    { "id": 10, "tasks": ["10.3"] }
  ]
}
```
