# Direction B — "Editorial confidence"

## Concept (100 words)

A wordmark-led brand. The word "Lobi" is the logo — a custom serif/sans hybrid where the L's terminal carries a flat slab and the i's dot is a square ink-block. Mark exists but is the secondary asset. Surfaces are cool zinc — never blue, never warm — pulled toward a graphite key. The accent is oxblood (#7C2233): editorial, unmistakable, the color of a Vintage Penguin spine. Type does the heavy lifting: tight tracking on display sizes, near-invisible borders on cards. Lobi reads like the masthead of a small magazine someone hand-set — confident, bookish, not loud.

## Personality mix (1-4 space)

- **Linear discipline:** 30%
- **Apple/Stripe minimal:** 5%
- **Notion warmth:** 5%
- **Arc/Vercel typographic confidence:** 60%

## Color palette

### Light mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#F4F4F2` | Newsprint zinc — cool but not blue |
| `--bg-card` | `#FFFFFF` | True paper |
| `--bg-card-hover` | `#F0F0EE` | Card hover |
| `--border-subtle` | `#E2E2DF` | Hairline rules |
| `--border-strong` | `#1A1A18` | Editorial divider — the strong rule |
| `--text-primary` | `#0E0E0C` | Near-ink |
| `--text-secondary` | `#4A4A47` | Body meta |
| `--text-tertiary` | `#7E7E7A` | Captions |
| `--accent` | `#7C2233` | Oxblood — display + interactive |
| `--accent-hover` | `#601926` | Pressed |
| `--accent-fg` | `#FFFFFF` | On-accent foreground |
| `--success` | `#3D6643` | Bottle green — magazine palette |
| `--warning` | `#A8761A` | Vintage mustard |
| `--danger` | `#7C2233` | Same as accent — danger is editorial |

### Dark mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#0D0D0C` | Press-black |
| `--bg-card` | `#161614` | Slight raise |
| `--bg-card-hover` | `#1F1F1C` | Hover |
| `--border-subtle` | `#2A2A27` | Hairline |
| `--border-strong` | `#E7E7E2` | Inverted strong rule |
| `--text-primary` | `#F2F2EE` | Off-white (no pure white — too cold) |
| `--text-secondary` | `#A9A9A4` | |
| `--text-tertiary` | `#6E6E6A` | |
| `--accent` | `#C44A5C` | Lifted oxblood for dark |
| `--accent-hover` | `#D5677A` | |
| `--accent-fg` | `#0D0D0C` | |
| `--success` | `#7AA382` | |
| `--warning` | `#D4A04D` | |
| `--danger` | `#C44A5C` | |

**Contrast (WCAG AA body):**
- Light: `#0E0E0C` on `#FFFFFF` → 19.6:1 (AAA)
- Light: `#4A4A47` on `#FFFFFF` → 8.5:1 (AAA)
- Dark: `#F2F2EE` on `#161614` → 14.7:1 (AAA)
- Dark: `#A9A9A4` on `#161614` → 6.6:1 (AA+)
- Accent on white: `#7C2233` → 9.2:1 (AAA — passes for any text size)

## Type ladder

Family: **Geist Sans** for body + UI; **Tiempos** *(or `ui-serif` fallback Charter / Iowan)* for display only.
Weights: 400 / 500 / 600 (Geist), 400 (Tiempos display).

| Token | Size | Family | Tracking | Usage |
|---|---|---|---|---|
| `text-xs` | 0.75rem (12px) | Geist | +0.02em | Captions, kicker labels |
| `text-sm` | 0.875rem (14px) | Geist | 0 | Body, list rows |
| `text-base` | 1rem (16px) | Geist | -0.005em | Card titles |
| `text-lg` | 1.125rem (18px) | Geist | -0.012em | Section headers |
| `text-xl` | 1.5rem (24px) | Tiempos | -0.018em | Widget hero titles |
| `text-2xl` | 2rem (32px) | Tiempos | -0.024em | Greeting / time |
| `text-3xl` | 2.75rem (44px) | Tiempos | -0.030em | Onboarding masthead |

The Tiempos drop at `text-xl` is the brand signature — display sizes go editorial, body stays grotesque. This is the Vercel/Arc move, executed with a serif instead of an oversized sans.

## Voice rules

1. **Headlines have a point of view.** "Today's calendar is light." Not "You have 3 events." We write it like a magazine subhead, not a status counter.
2. **Lowercase is intentional, never reflexive.** Use sentence case for everything below `text-xl`. Display sizes (xl+) stay sentence case too — but with no period. The masthead doesn't punctuate.
3. **Connection labels are nouns, never verbs.** The Gmail card is labeled "Mail," not "Gmail" or "Connect Gmail." The system is editorial; the brand of the underlying service is a footnote.
4. **Errors are stated, never apologized for.** "Spotify is unreachable. Last sync 14 minutes ago." Not "Sorry, we couldn't reach Spotify."
5. **Numbers and dates set in tabular figures, always.** No proportional digits in any data view. This is a typographic rule, not a vibe — enforce in CSS with `font-variant-numeric: tabular-nums`.

## Why this is distinctive vs gethomepage / Jack

- **vs gethomepage:** They are sysadmin-utility — gauges, status pills, dashboard chrome. Direction B is the opposite register: a *magazine cover* aesthetic. Same data, but framed as editorial rather than diagnostic. The Tiempos display + oxblood is unmistakable.
- **vs Jack/Caki:** Jack is rounded, teal, mascot-friendly — built for warmth. Direction B is bookish and confident, no mascot, no rounded glyphs in the wordmark. The masthead-style "Lobi" wordmark cannot be confused with Jack's circular mark.
- **The unique move:** wordmark-led identity is rare in productivity SaaS — most reach for an icon first. Lobi B says: the brand IS the word, set in type that someone clearly chose. Vercel did this with their geometric sans; Arc did it with their wordmark-only nav. Direction B applies the same logic with a serif display key, which is the actual untaken position.
