# TaskFlow — Design Brief

## Purpose & Tone
Refined task management UI. Users sign in via Internet Identity, manage personal todo lists with confidence. Tone: capable, trustworthy, minimal cognitive load.

## Differentiation
Teal accent system (HSL 180°, cool focus) paired with warm neutral backgrounds creates personality without chaos. Serif display headings ground the interface with editorial confidence.

## Color Palette

| Role | Light | Dark | OKLCH |
|------|-------|------|-------|
| Primary (Teal) | `0.52 0.176 183` | `0.72 0.165 183` | Trusted accent for buttons, active states, focus rings |
| Background | `0.98 0 0` | `0.12 0 0` | Clean neutral, max contrast in dark mode |
| Card | `0.99 0 0` | `0.16 0 0` | Subtle elevation via background shifts, not shadows |
| Destructive (Red) | `0.55 0.22 25` | `0.65 0.19 22` | Delete/remove actions, muted in dark |
| Muted | `0.92 0 0` | `0.25 0 0` | Disabled states, borders, non-interactive text |

## Typography
- **Display**: Fraunces (serif) — H1 (2rem), H2 (1.5rem). Adds editorial authority to headers.
- **Body**: General Sans (humanist sans) — 1rem base, weight 400. Clean readability on all sizes.
- **Mono**: JetBrains Mono — 0.875rem. Code/timestamp displays (if needed).

## Structural Zones
| Zone | Light | Dark | Rationale |
|------|-------|------|-----------|
| Header | `bg-card border-b border-border` | `bg-card border-b border-border` | Card elevation with subtle border separation |
| Main Content | `bg-background` | `bg-background` | Large neutral surface, task cards pop |
| Task Card | `bg-card rounded-lg shadow-xs` | `bg-card rounded-lg shadow-xs` | Elevated via background + subtle shadow on hover |
| Footer/Status | `bg-muted/10` | `bg-muted/30` | De-emphasized zone for secondary info |

## Spacing & Rhythm
- **Micro**: 4px (gap between inline elements)
- **Small**: 8px (padding in buttons, task items)
- **Base**: 16px (padding in cards, margin between sections)
- **Large**: 24px (vertical rhythm between task groups)
- **XL**: 32px (section margins in mobile view)

Asymmetric rhythm: 16 → 24 → 32, not uniform grids. Avoids monotony.

## Component Patterns
- **Buttons**: `bg-primary text-primary-foreground rounded-md px-4 py-2 transition-smooth hover:bg-primary/90`
- **Task Items**: Checkbox + text + edit/delete icons. `task-card` utility includes hover elevation.
- **Input Fields**: `bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring`
- **Empty State**: Centered text, icon, call-to-action. Muted color until interaction.

## Motion Choreography
- **Default Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth easing)
- **Task Add/Delete**: Fade + slide (100ms in, 150ms out)
- **Checkbox Toggle**: Instant color change, no rotation/scale
- **Hover**: Subtle shadow lift on cards, background shifts on buttons

## Elevation & Depth
- **Layer 0**: Background (flat)
- **Layer 1**: Cards + inputs (shadow-xs on hover)
- **Layer 2**: Popovers/modals (shadow-md)

No gradients. Depth via layered backgrounds + strategic shadow on interaction.

## Constraints
- Avoid rounded corners > 0.625rem (avoid pill-shaped buttons)
- No shadows by default; shadow-xs on hover only
- Color must be intentional—never use 80+ shade values
- Accent teal used sparingly: active states, CTAs, focus rings, not general background

## Responsive
Mobile-first: `sm:` (640px) for tablet, `md:` (768px) for desktop. Task list adapts from full-width cards (mobile) to compact rows (desktop).

## Signature Detail
Serif headings + sans body creates visual tension (modern + editorial). Teal accent as reserved emphasis—users learn "teal = interactive" without instruction.
