# TaskFlow — Premium Glassmorphism Design

## Purpose & Tone
High-end productivity suite. Glassmorphic UI with deep dark foundation, premium depth effects, and category-based task organization. Tone: refined, capable, premium SaaS aesthetic.

## Differentiation
Frosted glass cards with backdrop blur + semi-transparent backgrounds create luxury depth. Purple accent system paired with deep navy foundation. Priority color coding (red/amber/green) embedded in glassmorphic badges. Left sidebar navigation and top progress bar establish high-productivity UI patterns.

## Color Palette

| Role | Light | Dark | OKLCH | Purpose |
|------|-------|------|-------|---------|
| Primary (Purple) | N/A | `0.68 0.18 280` | Active states, CTAs, progress bar, focus ring |
| Background | N/A | `0.08 0 0` | Deep dark foundation for premium tone |
| Card | N/A | `0.14 0.01 280` | Frosted glass base (semi-transparent), backdrop blur |
| Accent (Purple) | N/A | `0.78 0.20 280` | Secondary highlights, accents |
| Priority High (Red) | N/A | `0.63 0.24 25` | High-priority badge styling, destructive actions |
| Priority Medium (Amber) | N/A | `0.68 0.19 60` | Medium-priority badge styling, warnings |
| Priority Low (Green) | N/A | `0.72 0.18 120` | Low-priority badge styling, success states |
| Foreground | N/A | `0.98 0 0` | Primary text on dark backgrounds |
| Muted | N/A | `0.28 0.01 280` | Secondary text, disabled states |
| Border | N/A | `0.26 0.01 280` | Glass card borders, subtle structure |

## Typography
- **Display**: Fraunces (serif) — H1 (2rem), H2 (1.5rem). Editorial authority, refined aesthetic.
- **Body**: General Sans (humanist sans) — 1rem base, weight 400. Premium readability.
- **Mono**: JetBrains Mono — 0.875rem. Task metadata, timestamps.

## Structural Zones

| Zone | Styling | Rationale |
|------|---------|-----------|
| Top Bar | `glass` (purple accent gradient progress bar) | Progress indicator, mission-critical status |
| Sidebar | `glass rounded-lg` on nav items, `sidebar-item-active` for current category | Category filtering (Work, Personal, Urgent) |
| Main Content | `bg-background` (deep dark) | Neutral foundation for card elevation |
| Task Card | `glass glass-hover rounded-lg` with `priority-badge` overlay | Frosted glass appearance, priority color coding |
| Footer | `bg-secondary/20` | De-emphasized secondary actions |

## Spacing & Rhythm
- **Micro**: 4px (intra-element gaps)
- **Small**: 8px (button padding, badge padding)
- **Base**: 16px (card padding, section margins)
- **Large**: 24px (vertical rhythm between task groups)
- **XL**: 32px (major section breaks)

## Component Patterns
- **Glass Card**: `.glass .glass-hover` — `bg-card/40 backdrop-blur-md border border-white/10` + hover elevation
- **Priority Badge**: `.priority-badge .priority-{high|medium|low}` — glassmorphic coloring with status color
- **Sidebar Item**: `.sidebar-item .sidebar-item-active` — glass styling, highlights on selection
- **Progress Bar**: `.progress-bar` with `.progress-fill` gradient — `bg-gradient-to-r from-primary to-accent`
- **Button**: `bg-primary text-primary-foreground rounded-md px-4 py-2 transition-smooth hover:bg-primary/90`

## Motion Choreography
- **Default Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth easing)
- **Task Add**: `animate-fade-in animate-slide-down` (100ms)
- **Card Hover**: Subtle elevation via shadow + background opacity shift
- **Progress Update**: Smooth width transition, no jarring jumps

## Elevation & Depth
- **Layer 0**: Background (deep dark, flat)
- **Layer 1**: Glass cards + sidebar (backdrop blur, semi-transparent)
- **Layer 2**: Modals + popovers (solid with shadow-glass)

Depth achieved through layered transparency + backdrop blur, not multiple shadow layers.

## Constraints
- **Glass only in dark mode** — premium tone established by deep background + frosted foreground
- Avoid rounded corners > 0.625rem (maintain refined, not playful, aesthetic)
- **White/10 borders** — subtle structure, not high-contrast division
- Priority colors used ONLY in badges, never as primary UI element
- No full-page gradients; accent gradient only on progress bar

## Responsive
Mobile-first breakpoints: `sm:` (640px) tablet, `md:` (768px) desktop. Sidebar collapses on mobile, full-width task list. Progress bar always visible.

## Signature Detail
Frosted glass + deep dark foundation creates visual depth without visual noise. Purple accent reserved for interactive elements — users instantly recognize "purple = interactive". Priority system embedded in glassmorphic badges rather than color-blocking entire cards.
