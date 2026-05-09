# Lobi Design System (v0.1 — placeholder, to be filled)

> **Status:** Stub. Final tokens come from Designer agent in LB-02 (visual identity).
> **Anti-patterns below are already constitutional.**

## Design Philosophy (target)

- **Calm productivity surface.** This is the page a user opens 50+ times a day. Visual noise compounds.
- **Bento aesthetic.** Cards on a soft surface — shadowless or near-shadowless. Strong contrast inside cards, gentle outside.
- **Typographic clarity over decoration.** Information first. Weight + size do the work, not borders.
- **Mobile-aware but desktop-first.** Grid is built for 1440px+. Mobile reflow is honest, not parallel.

## Reference Aesthetic
- Bento UI (general principle, not a specific product)
- Linear settings page (typographic discipline)
- Arc Browser sidebar (calm, content-first)
- Apple Weather widget (information density done right)

## Design Tokens (PLACEHOLDER — replace in LB-02)

```css
/* Surface */
--bg-page: #FAFAF7;
--bg-card: #FFFFFF;
--bg-card-hover: #F8F7F3;
--border-subtle: #EAE8E3;

/* Text */
--text-primary: #1A1A1A;
--text-secondary: #6B6B6B;
--text-tertiary: #A0A0A0;

/* Accent (single color — user picks one) */
--accent: #2D7A6F; /* deep teal default — borrowed from Jack as starting point */
--accent-hover: #226258;

/* Spacing scale (4px base) */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Type scale */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;

/* Radius — bento cards */
--radius-card: 1rem;
--radius-button: 0.5rem;
--radius-input: 0.5rem;

/* Grid — widget tiles */
--tile-gap: 1rem;
--tile-base: 220px; /* 1x1 size at 1440px */
```

## Anti-Patterns (CONSTITUTIONAL — do not violate)

1. **No hardcoded hex colors in components.** Always use CSS variables.
2. **No drop shadows on cards by default.** Cards separate via background contrast + 1px border, not shadow.
3. **No emoji as UI affordance.** Icons via lucide-react. Emoji only when user-supplied (e.g., they label a widget).
4. **No "fancy" gradients.** Single accent color. Maximum one subtle gradient on hero/onboarding.
5. **No multiple accent colors.** Lobi has one accent at a time. Theming changes the accent, doesn't add new ones.
6. **No micro-animations on data.** Numbers don't count up. Charts don't animate in. Distraction tax.
7. **No skeleton loaders longer than 300ms** — if data is slow, show stale data + a tiny spinner, don't show skeleton.
8. **No modal-in-modal.** Ever.
9. **No 100% width inputs without max-width.** Forms cap at 480px on desktop.
10. **No widget that auto-refreshes faster than 60s.** Battery + bandwidth tax for no UX gain.

## Component Conventions (initial)

- Button: `lib/ui/button.tsx` — primary, secondary, ghost variants. No "destructive" button on this app surface (Lobi doesn't delete user data destructively from cards).
- Card (widget shell): `components/widgets/widget-shell.tsx` — handles header (title + drag handle + settings dot), padding, border, hover state.
- Grid: `components/dashboard/widget-grid.tsx` — dnd-kit sortable, 4-column responsive (4/3/2/1 at 1440/1024/768/480).
