# Requirements Document

## Introduction

Migração do portfólio estilo Persona 3, originalmente construído em React com framer-motion e react-router-dom, para uma aplicação SvelteKit com Svelte 5 (runes). O projeto replica fielmente a experiência visual e interativa do original: menu principal com navegação por teclado, páginas About Me, Resume e Socials com animações elaboradas, e 4 variantes de transição entre páginas. Os assets (vídeos MP4, imagens PNG/JPEG, ícones) são copiados diretamente do projeto de referência.

## Glossary

- **App**: A aplicação SvelteKit completa que serve o portfólio Persona 3
- **Menu_Principal**: Página inicial com vídeo de fundo e menu interativo com labels skewed, clip-path triangles e efeitos glow
- **About_Page**: Página "About Me" com barras interativas de personagens, reveal panel system com painéis diagonais e retratos
- **Resume_Page**: Página "Resume" com cards interativos, badges, painel de detalhes e animação circle-reveal na entrada
- **Socials_Page**: Página "Socials" com barras animadas, personagens, stats, info bars e navegação lateral direita
- **Transition_System**: Sistema de transições entre páginas com 4 variantes (default, about, socials, resume)
- **Default_Transition**: Transição com blocos coloridos que expandem e contraem horizontalmente
- **About_Transition**: Transição com painéis diagonais que deslizam da esquerda
- **Socials_Transition**: Transição com stripes verticais que descem de cima
- **Resume_Transition**: Transição com cards parallelogram que deslizam da esquerda
- **Keyboard_Navigation**: Sistema de navegação por teclado usando setas (↑↓←→), Enter e Escape
- **Runes**: Primitivas reativas do Svelte 5 ($state, $derived, $effect)

## Requirements

### Requirement 1: Scaffold do Projeto SvelteKit

**User Story:** As a developer, I want a properly configured SvelteKit project with Svelte 5, so that I can build the portfolio on a modern framework.

#### Acceptance Criteria

1. THE App SHALL use SvelteKit with file-based routing (+page.svelte, +layout.svelte)
2. THE App SHALL use Svelte 5 with Runes ($state, $derived, $effect) for gerenciamento de estado reativo
3. THE App SHALL load the fonts Anton, Bebas Neue, Barlow Condensed and Montserrat via Google Fonts
4. THE App SHALL apply global styles that set body background to black, remove default margin/padding, and set overflow hidden
5. THE App SHALL copy all assets (vídeos MP4, imagens PNG, imagens JPEG, ícones PNG) from the reference project into the static or src assets directory

### Requirement 2: Menu Principal

**User Story:** As a visitor, I want an interactive Persona 3 styled main menu with video background, so that I can navigate to different sections of the portfolio.

#### Acceptance Criteria

1. THE Menu_Principal SHALL display a looping muted MP4 video as full-screen background covering the entire viewport
2. THE Menu_Principal SHALL render 5 menu items (ABOUT ME, RESUME, GITHUB LINK, SOCIALS, SIDE PROJECTS) with individual font sizes, skewX/skewY transforms, and offsets
3. THE Menu_Principal SHALL highlight the active menu item with a white clip-path triangle, a pink shadow triangle with pop animation, and red label color
4. THE Menu_Principal SHALL display non-active items with cyan (#3ce2ff) label color and reduced opacity based on distance from the active item
5. THE Menu_Principal SHALL display a radial gradient glow effect behind the active menu item
6. WHEN a visitor presses ArrowUp, THE Menu_Principal SHALL move the active selection to the previous menu item
7. WHEN a visitor presses ArrowDown, THE Menu_Principal SHALL move the active selection to the next menu item
8. WHEN a visitor presses Enter, THE Menu_Principal SHALL navigate to the page corresponding to the active menu item
9. WHEN a visitor hovers over a menu item, THE Menu_Principal SHALL set that item as active
10. THE Menu_Principal SHALL display a name tag ("jade's persona") rotated 18 degrees in the top-left corner
11. THE Menu_Principal SHALL display a vertical red stripe (5px) and a secondary pink stripe (2px) on the right edge
12. THE Menu_Principal SHALL animate menu items entrance with staggered translateX and opacity transitions after mount

### Requirement 3: About Me Page

**User Story:** As a visitor, I want to see personal information presented in an interactive Persona 3 party-member style, so that I can learn about the portfolio owner.

#### Acceptance Criteria

1. THE About_Page SHALL display a looping muted MP4 video as full-screen background
2. THE About_Page SHALL render 3 interactive bars (ABOUT ME, FUN FACT ABOUT ME, WIRED FACT ABOUT ME) that slide in from the left with staggered delays
3. THE About_Page SHALL display a character PNG inside each bar with a parallelogram clip-path
4. THE About_Page SHALL expand the active bar height from 64px to 90px and show a red underlay and white fill animation
5. THE About_Page SHALL display a "LEADER" or "PARTY" role label rotated -30 degrees on the left side of each bar
6. WHEN a visitor presses ArrowUp or ArrowDown, THE About_Page SHALL change the active bar selection
7. WHEN a visitor presses Enter or ArrowRight, THE About_Page SHALL reveal the detail panel with diagonal panel animation, upper/lower content bars, and portrait image
8. WHEN a visitor presses ArrowLeft while the reveal panel is visible, THE About_Page SHALL hide the reveal panel
9. WHEN a visitor presses Escape or Backspace, THE About_Page SHALL navigate back to the previous page
10. THE About_Page SHALL display a dimming overlay (rgba 40,45,54, 0.68) behind the reveal panel when visible
11. THE About_Page SHALL show a portrait image on the right side (43vw width) with a skewX transform and fade-in animation when the reveal panel is active
12. THE About_Page SHALL display LB/RB navigation indicators with animated arrows when the reveal panel is visible

### Requirement 4: Resume Page

**User Story:** As a visitor, I want to see resume categories presented as interactive cards with detailed panels, so that I can explore the portfolio owner's qualifications.

#### Acceptance Criteria

1. THE Resume_Page SHALL display a looping muted MP4 video as full-screen background
2. THE Resume_Page SHALL play a circle-reveal entry animation (clip-path circle expanding from center to 150vmax) with a blue (#0047FF) background on mount
3. THE Resume_Page SHALL render 4 cards (EDUCATION, SKILLS, PROJECTS, EXPERIENCE) with parallelogram clip-path, dark blue background, and staggered slide-in animations
4. THE Resume_Page SHALL display a roman numeral badge (I, II, III, IV) on each card rotated -8 degrees with a cyan border
5. THE Resume_Page SHALL highlight the active card with white background, red box-shadow offset (10px 8px), and black badge/text colors
6. WHEN a visitor presses ArrowUp or ArrowDown, THE Resume_Page SHALL change the active card selection
7. WHEN a visitor presses ArrowLeft, Escape, or Backspace, THE Resume_Page SHALL navigate back to the previous page
8. THE Resume_Page SHALL display a detail panel on the right side (39vw width) with a gradient blue background, clip-path parallelogram, and drop shadow
9. THE Resume_Page SHALL render detail rows inside the panel with index, title, and status badge for the active category
10. THE Resume_Page SHALL display a "LIST" title tag above the cards with Anton font at 92px

### Requirement 5: Socials Page

**User Story:** As a visitor, I want to see social media links presented in a Persona 3 party-member style with stats and info bars, so that I can connect on other platforms.

#### Acceptance Criteria

1. THE Socials_Page SHALL display a looping muted MP4 video as full-screen background
2. THE Socials_Page SHALL render 3 interactive bars (TWITCH, INSTAGRAM, TIKTOK) that slide in from the left with staggered delays
3. THE Socials_Page SHALL display a character PNG inside each bar with a parallelogram clip-path
4. THE Socials_Page SHALL show stat badges (FOL, VWR, PST, LKS) with platform-specific colors and numeric values on each bar
5. THE Socials_Page SHALL expand the active bar to 90px height and display a white fill, red underlay, and shade effect
6. WHEN a visitor presses ArrowUp or ArrowDown with focus on the left panel, THE Socials_Page SHALL change the active bar selection
7. WHEN a visitor presses ArrowRight, THE Socials_Page SHALL move focus to the right-side info bars
8. WHEN a visitor presses ArrowLeft while focus is on the right panel, THE Socials_Page SHALL move focus back to the left bars
9. WHEN a visitor presses Enter with focus on the left panel, THE Socials_Page SHALL open the active social link in a new browser tab
10. WHEN a visitor presses Enter with focus on the right panel, THE Socials_Page SHALL open the active info bar link in a new browser tab
11. THE Socials_Page SHALL display a right-side navigation header with the active platform label, LB/RB indicators, and animated arrows
12. THE Socials_Page SHALL render info bars (varying count per platform) on the right side with icon, link text, views box, and count
13. THE Socials_Page SHALL mark certain info bars with a "NEW" sign image overlay
14. WHEN a visitor presses Escape or Backspace, THE Socials_Page SHALL navigate back to the previous page
15. THE Socials_Page SHALL display keyboard hint labels (↑↓ SELECT, ↵ OPEN, ESC BACK) in the bottom-right corner

### Requirement 6: Transition System

**User Story:** As a visitor, I want visually distinct page transitions styled after Persona 3, so that navigation between pages feels immersive.

#### Acceptance Criteria

1. THE Transition_System SHALL play a transition animation overlay before rendering page content on each route change
2. THE Default_Transition SHALL animate 3 colored blocks (#0d1a3a, #1a6aff, #7dd4fc) with scaleX from 0 to 1 and back to 0 with staggered delays of 50ms, completing in 450ms total
3. THE About_Transition SHALL animate 3 diagonal panels (dark blue, cyan, white) rotated -18 degrees sliding from x:-500 to x:0 with a clip-path parallelogram, completing in 520ms
4. THE Socials_Transition SHALL animate 3 vertical stripes (dark blue, cyan, white) skewed -16 degrees descending from y:-1200 to y:0 then to y:1200 with staggered delays, completing in 560ms
5. THE Resume_Transition SHALL animate 4 parallelogram cards (dark blue, cyan, white, dark blue) sliding from x:-900 to x:0 then to x:900 with staggered delays of 50ms, completing in 600ms
6. WHEN navigating to the About_Page, THE Transition_System SHALL use the About_Transition variant
7. WHEN navigating to the Socials_Page, THE Transition_System SHALL use the Socials_Transition variant
8. WHEN navigating to the Resume_Page, THE Transition_System SHALL use the Resume_Transition variant
9. WHEN navigating to any other page, THE Transition_System SHALL use the Default_Transition variant
10. THE Transition_System SHALL fade in page content with opacity 0 to 1 after a 180ms delay following the transition overlay start

### Requirement 7: Implementação com Svelte 5 e CSS Animations

**User Story:** As a developer, I want all interactive state and animations implemented using Svelte 5 runes and CSS keyframes, so that the project uses modern Svelte patterns without third-party animation libraries.

#### Acceptance Criteria

1. THE App SHALL use $state rune for all mutable component state (active indices, mounted flags, focus tracking, revealed states)
2. THE App SHALL use $effect rune for side effects (keyboard listeners, mount timers, navigation)
3. THE App SHALL use $derived rune for computed values derived from state (opacity calculations, conditional classes)
4. THE App SHALL implement all animations using CSS @keyframes and Svelte transition:/in:/out: directives instead of framer-motion
5. THE App SHALL use Svelte scoped style blocks instead of inline JSX style objects or injected style tags
6. THE App SHALL use SvelteKit goto() function or anchor elements for programmatic navigation instead of react-router-dom useNavigate
7. IF a CSS animation fails to load, THEN THE App SHALL display the target page content without the transition animation
