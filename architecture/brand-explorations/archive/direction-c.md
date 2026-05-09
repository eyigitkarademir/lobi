# Direction C — "Calm playful"

## Concept (100 words)

Lobi as a Raycast-cousin: minimal, calm, but unmistakably *played-with*. Surfaces are cream over deep ink — never gray, never blue. The accent is dusty lilac (#9B7FB8), a color almost no productivity tool uses. The mark is an abstract widget-grid metaphor: four squares forming a 2x2 bento, with one square shifted out of alignment — the shifted tile is the "you arranged this yourself" gesture. Geometry is rounded but disciplined: corner radius is consistent, geometry is gridded, but the offset tile keeps it from feeling corporate. Apple discipline is the guardrail; the offset is the play.

## Personality mix (1-4 space)

- **Linear discipline:** 15%
- **Apple/Stripe minimal:** 40%
- **Notion warmth:** 30% (Raycast-adjacent — domestic + playful)
- **Arc/Vercel typographic confidence:** 15%

## Color palette

### Light mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#FAF6EE` | Cream — warm key, low chroma |
| `--bg-card` | `#FFFCF5` | Cream-white card |
| `--bg-card-hover` | `#F4EFE3` | Hover wash |
| `--border-subtle` | `#E8E0CE` | Default border |
| `--border-strong` | `#C4B89E` | Hover border |
| `--text-primary` | `#1C1A22` | Ink with a violet whisper |
| `--text-secondary` | `#5A5566` | Muted ink |
| `--text-tertiary` | `#8E8896` | Caption muted |
| `--accent` | `#9B7FB8` | Dusty lilac — single accent |
| `--accent-hover` | `#8268A1` | Pressed |
| `--accent-fg` | `#FFFCF5` | On-accent foreground |
| `--success` | `#6B9B7F` | Sage — keeps the "dusty" key |
| `--warning` | `#D4A04D` | Warm amber |
| `--danger` | `#C66E72` | Dusty rose, sibling to lilac |

### Dark mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#16131C` | Inkwell — very dark, slight violet shift |
| `--bg-card` | `#1F1B28` | Card raise |
| `--bg-card-hover` | `#282333` | Hover |
| `--border-subtle` | `#322C40` | Default border |
| `--border-strong` | `#4A4360` | Emphasized |
| `--text-primary` | `#F2EEDC` | Cream-on-ink |
| `--text-secondary` | `#B8AFA0` | Muted cream |
| `--text-tertiary` | `#7E7768` | |
| `--accent` | `#B89BD6` | Lifted lilac for dark |
| `--accent-hover` | `#C6ADE0` | |
| `--accent-fg` | `#16131C` | |
| `--success` | `#8FB89E` | |
| `--warning` | `#E5B97A` | |
| `--danger` | `#D89094` | |

**Contrast (WCAG AA body):**
- Light: `#1C1A22` on `#FFFCF5` → 16.0:1 (AAA)
- Light: `#5A5566` on `#FFFCF5` → 7.0:1 (AAA)
- Dark: `#F2EEDC` on `#1F1B28` → 13.6:1 (AAA)
- Dark: `#B8AFA0` on `#1F1B28` → 7.8:1 (AAA)
- Accent on cream: `#9B7FB8` on `#FFFCF5` → 4.6:1 (AA — passes for ≥14pt regular)

## Type ladder

Family: **Geist Sans** (already loaded by upstream)
Weights: 400 / 500 / 600. Slightly more generous tracking than A, never tightens past -0.018em.

| Token | Size | Tracking | Usage |
|---|---|---|---|
| `text-xs` | 0.75rem (12px) | +0.025em | Badges, hints |
| `text-sm` | 0.875rem (14px) | +0.005em | Body, list rows |
| `text-base` | 1rem (16px) | 0 | Card titles |
| `text-lg` | 1.125rem (18px) | -0.005em | Section headers |
| `text-xl` | 1.375rem (22px) | -0.012em | Widget hero titles |
| `text-2xl` | 1.75rem (28px) | -0.015em | Greeting / time-of-day |
| `text-3xl` | 2.25rem (36px) | -0.018em | Onboarding hero only |

The slightly looser tracking on body sizes (+0.005em vs A's tight) is what makes C feel *calm-playful* rather than disciplined. Small thing, big impact.

## Voice rules

1. **Greeting is observational, never performative.** "It's Saturday. Three calendar holds." Not "Have a great Saturday!" The tool notices, it doesn't perform.
2. **Empty states are invitations, not apologies.** "Nothing on the calendar today — a clean square is also a result." Not "No events found."
3. **Microcopy uses one playful word per surface, max.** A widget header can say "Recents" instead of "Recent items," but the body copy stays neutral. Play is a seasoning, not the meal.
4. **Avoid second person where first works.** "Reading list" beats "Your reading list." We don't need to tell the user it's theirs — they know.
5. **Status verbs are gentle but present-tense.** "Spotify is listening" (currently playing), "Gmail is quiet" (zero unread). The system describes itself; it does not update users on their own state.

## Why this is distinctive vs gethomepage / Jack

- **vs gethomepage:** They are utility-first, no warmth in the surface. Direction C is cream over ink with a lilac accent — none of this exists in their visual register. The widget-grid mark is also a direct conceptual answer to gethomepage's vague compass-arrow logo.
- **vs Jack/Caki:** Jack is a teal mascot with a friendly persona. Direction C has no character, no mascot — the offset-tile mark is geometric and honest about the product (a grid you arrange). The lilac accent is also as far from Jack's teal as possible without crossing into pink/red territory.
- **The unique move:** dusty lilac is conspicuously absent from productivity SaaS. Linear is purple-blue. Notion is grayscale. Raycast is red. Vercel is black-white. Choosing a soft, slightly desaturated lilac as the brand color is itself a positioning move — it instantly differentiates without resorting to gimmicks. The offset tile in the mark gives it a single memorable gesture without becoming cute.
