# Lobi Design System (v1 — locked LB-02, direction "Editorial confidence")

> **Brand direction:** B — Editorial confidence (selected 2026-05-10, see DEC-012)
> **Anti-patterns are constitutional.**

## Design Philosophy

Lobi is a **wordmark-led editorial identity** in productivity-tool clothing. The page reads like a small magazine someone hand-set: zinc + ink + oxblood, hairline rules, tabular figures, display sizes that go full serif. Confident, bookish, never loud.

- **Calm productivity surface.** This is the page a user opens 50+ times a day. Visual noise compounds.
- **Bento aesthetic, editorial register.** Cards have hairline borders on near-paper surface — no shadows. The arrangement is grid; the rendering is masthead.
- **Typography does the heavy lifting.** Weight, size, and tracking carry hierarchy — not color, not chrome.
- **Mobile-aware, desktop-first.** Grid is built for 1440px+. Mobile reflow is honest, not parallel.

## Reference Aesthetic
- Vintage Penguin paperback spines (oxblood + ink + cream)
- The masthead of a small print magazine — Apartamento, Wallpaper, Eye
- Vercel/Arc-style typographic confidence, executed with a serif display
- Linear settings page (hairline discipline)

---

## Design Tokens (LOCKED — DEC-012)

### Light mode

```css
/* Surface */
--bg-page: #F4F4F2;        /* Newsprint zinc — cool, never blue */
--bg-card: #FFFFFF;         /* True paper */
--bg-card-hover: #F0F0EE;   /* Subtle hover wash */
--border-subtle: #E2E2DF;   /* Hairline rules */
--border-strong: #1A1A18;   /* Editorial divider — the strong rule */

/* Text */
--text-primary: #0E0E0C;    /* Near-ink, 19.6:1 AAA on white */
--text-secondary: #4A4A47;  /* Body meta, 8.5:1 AAA on white */
--text-tertiary: #7E7E7A;   /* Captions */

/* Accent (oxblood — Vintage Penguin spine) */
--accent: #7C2233;          /* 9.7:1 AAA on white — safe for text */
--accent-hover: #601926;    /* Pressed state */
--accent-fg: #FFFFFF;       /* Foreground on accent fill */

/* Status (full editorial palette) */
--success: #3D6643;         /* Bottle green — magazine palette */
--warning: #A8761A;         /* Vintage mustard */
--danger: #7C2233;          /* Same as accent — danger is editorial, not panicked */
```

### Dark mode

```css
/* Surface */
--bg-page: #0D0D0C;         /* Press-black */
--bg-card: #161614;         /* Slight raise */
--bg-card-hover: #1F1F1C;   /* Hover */
--border-subtle: #2A2A27;   /* Hairline */
--border-strong: #E7E7E2;   /* Inverted strong rule */

/* Text */
--text-primary: #F2F2EE;    /* Off-white — pure white is too cold, 14.7:1 AAA */
--text-secondary: #A9A9A4;  /* 6.6:1 AA+ */
--text-tertiary: #6E6E6A;

/* Accent */
--accent: #C44A5C;          /* Lifted oxblood — 3.8:1 AA-Large only, FILL/CTA only, never body text */
--accent-hover: #D5677A;    /* Pressed */
--accent-strong: #E69CAA;   /* 8.5:1 AAA — use for accent-on-dark TEXT (e.g., link labels) */
--accent-fg: #0D0D0C;       /* Foreground on accent fill */

/* Status */
--success: #7AA382;
--warning: #D4A04D;
--danger: #C44A5C;
```

> **Accent discipline:** In light mode, `--accent` is AAA-safe for any use. In dark mode, `--accent` is for FILL/CTA backgrounds only — for accent-colored text on dark, use `--accent-strong`. Never use `--accent` as body text color in dark mode.

### Spacing (4px base)
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
```

### Type ladder

**Families:**
- **Geist Sans** — body, UI, labels (already loaded by upstream)
- **Tiempos** — display only (xl+), with `ui-serif, Charter, Iowan Old Style` fallback chain

**Weights:** Geist 400 / 500 / 600. Tiempos 400 (display).

```css
--text-xs:    0.750rem;  /* 12px — captions, kicker labels — Geist + tracking +0.02em */
--text-sm:    0.875rem;  /* 14px — body, list rows — Geist, tracking 0 */
--text-base:  1.000rem;  /* 16px — card titles — Geist, tracking -0.005em */
--text-lg:    1.125rem;  /* 18px — section headers — Geist, tracking -0.012em */
--text-xl:    1.500rem;  /* 24px — widget hero titles — Tiempos, tracking -0.018em */
--text-2xl:   2.000rem;  /* 32px — greeting / time — Tiempos, tracking -0.024em */
--text-3xl:   2.750rem;  /* 44px — onboarding masthead — Tiempos, tracking -0.030em */
```

**The brand signature:** body stays grotesque; display goes serif at `text-xl` and up. Vercel/Arc move executed with a serif key instead of a giant sans. This is what makes Lobi look like a magazine.

**Tabular numerics — always.** Any data view (clock, counts, percentages, dates) MUST set `font-variant-numeric: tabular-nums`. This is a typographic rule, not a vibe.

### Radius
```css
--radius-card:   1rem;     /* Bento cards — soft, readable */
--radius-button: 0.5rem;   /* CTAs */
--radius-input:  0.5rem;
```

> Lobi avoids fully-rounded pill shapes. Cards and buttons have meaningful corners. No rounded-everything.

### Grid (widget tiles)
```css
--tile-gap: 1rem;      /* 16px between tiles */
--tile-base: 220px;    /* 1x1 size at 1440px */
```

---

## Voice Rules (LOCKED — DEC-012)

These are **brand voice contracts** — every piece of copy in Lobi UI must respect them. Add to spec verification checklists.

1. **Headlines have a point of view.** "Today's calendar is light." Not "You have 3 events." Write like a magazine subhead, not a status counter.
2. **Lowercase is intentional, never reflexive.** Sentence case for everything below `text-xl`. Display sizes (xl+) stay sentence case too — but with **no terminal period**. The masthead doesn't punctuate.
3. **Connection labels are nouns, never verbs.** The Gmail card is labeled "Mail," not "Gmail" or "Connect Gmail." The system is editorial; the brand of the underlying service is a footnote.
4. **Errors are stated, never apologized for.** "Spotify is unreachable. Last sync 14 minutes ago." Not "Sorry, we couldn't reach Spotify."
5. **Numbers and dates set in tabular figures, always.** No proportional digits in any data view. Enforce in CSS with `font-variant-numeric: tabular-nums`.

---

## Anti-Patterns (CONSTITUTIONAL — do not violate)

1. **No hardcoded hex colors in components.** Always use CSS variables.
2. **No drop shadows on cards by default.** Cards separate via background contrast + 1px border, not shadow.
3. **No emoji as UI affordance.** Icons via lucide-react. Emoji only when user-supplied.
4. **No "fancy" gradients.** Single accent color. Maximum one subtle gradient on hero/onboarding.
5. **No multiple accent colors.** Lobi has one accent at a time. Theming changes the accent.
6. **No micro-animations on data.** Numbers don't count up. Charts don't animate in.
7. **No skeleton loaders longer than 300ms.** Show stale data + tiny spinner instead.
8. **No modal-in-modal.** Ever.
9. **No 100% width inputs without max-width.** Forms cap at 480px on desktop.
10. **No widget that auto-refreshes faster than 60s.** Battery + bandwidth tax.
11. **No proportional digits in data views.** Use `tabular-nums` (voice rule #5 enforced as a styling rule).
12. **No accent as body text in dark mode.** Use `--accent-strong` instead.

---

## Component Conventions

- **Button** (`src/lib/ui/button.tsx` — to be added): primary (oxblood fill), secondary (outline), ghost. No "destructive" button — Lobi doesn't ship destructive surface CTAs.
- **Card** (`src/components/lobi/widget-shell.tsx` — to be added): header (title text-base + drag handle + settings dot), padding `--space-4`, 1px `--border-subtle`, hover `--bg-card-hover`. No shadow.
- **Grid** (`src/components/lobi/widget-grid.tsx` — to be added): dnd-kit sortable, 4-column responsive (4/3/2/1 at 1440/1024/768/480), gap `--tile-gap`.
- **Display headlines** (greeting, hero): always Tiempos, no period.

---

## Logo Files

Locked logo lives in `/public/`:
- `public/logo-mark.svg` — square mark (use sparingly; B is wordmark-led, not mark-led)
- `public/logo-wordmark.svg` — primary brand asset
- `public/logo-lockup.svg` — mark + wordmark combined
- `public/favicon.svg` — favicon (browser-supported SVG)

**Usage rules:**
- Default to wordmark for brand placement (header, README, OG image, etc.)
- Use mark only at sizes where wordmark would be illegible (16-32px favicon territory)
- Never recolor the mark or wordmark outside `--accent` or `--text-primary`
- Never apply effects (shadow, glow, outline) to the logo
