# Direction A — "Disciplined warmth"

## Concept (100 words)

Linear's grid-discipline meets Notion-light's domestic warmth. Lobi as the calm, sand-colored surface a user opens fifty times a day — never loud, never shouty, but distinctly *not cold*. The accent is a deep terracotta (#B5532A): warm enough to feel hand-thrown ceramic, dark enough to behave like a Linear status pill. Surfaces are sand and bone, not pure white. Borders are warm taupe, never gray. Type is Geist Sans at conservative weights — discipline carries the structure, color carries the warmth. The mark is a single confident "L" with a slight tail-curve, suggesting a chair, a shelf, a place to sit.

## Personality mix (1-4 space)

- **Linear discipline:** 45%
- **Apple/Stripe minimal:** 25%
- **Notion warmth:** 25%
- **Arc/Vercel typographic confidence:** 5%

## Color palette

### Light mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#F5F1EA` | Sand, the page surface |
| `--bg-card` | `#FBF8F2` | Bone, raised cards |
| `--bg-card-hover` | `#F1ECE2` | Card hover wash |
| `--border-subtle` | `#E4DDD0` | Default card border |
| `--border-strong` | `#C9BEAB` | Emphasized borders, hover |
| `--text-primary` | `#1F1A14` | Body and headings |
| `--text-secondary` | `#5C5247` | Labels, meta |
| `--text-tertiary` | `#8E8475` | Disabled, captions |
| `--accent` | `#B5532A` | Terracotta — single accent. **FILL/CTA backgrounds and decorative use only — NEVER use as body or paragraph text color.** On `bg-card` #FBF8F2 = 4.68:1, just above AA body (4.5:1) but reserved for non-text. For accent-on-light text, use `--accent-strong`. |
| `--accent-strong` | `#8E3A1B` | Text-safe accent. On `bg-card` #FBF8F2 = **7.15:1 (AAA)**. Use whenever accent must carry text (links, inline mentions, body-size accent labels). |
| `--accent-hover` | `#9A4422` | Pressed/hover state |
| `--accent-fg` | `#FBF8F2` | Foreground on accent fill |
| `--success` | `#5C7A3C` | Olive — keeps the warm key |
| `--warning` | `#C28A1F` | Warm amber |
| `--danger` | `#A33A2D` | Brick red — sibling to accent |

### Dark mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#15110C` | Roasted-coffee black |
| `--bg-card` | `#1E1812` | Slightly raised |
| `--bg-card-hover` | `#27201A` | Card hover wash |
| `--border-subtle` | `#332B22` | Default border |
| `--border-strong` | `#473D32` | Emphasized border |
| `--text-primary` | `#F4EFE7` | Bone-white |
| `--text-secondary` | `#B8AC9A` | Sand-gray |
| `--text-tertiary` | `#7E7464` | Muted |
| `--accent` | `#D87144` | Lighter terracotta for dark. On `bg-card` #1E1812 = 5.33:1 (passes AA body), but reserved for FILL/CTA/decorative use to mirror light-mode discipline. |
| `--accent-strong` | `#E89564` | Text-safe accent for dark. On `bg-card` #1E1812 = **7.46:1 (AAA)**. Use whenever accent must carry text on dark surfaces. |
| `--accent-hover` | `#E58559` | Hover lift |
| `--accent-fg` | `#15110C` | On-accent foreground |
| `--success` | `#8AAB60` | |
| `--warning` | `#D9A647` | |
| `--danger` | `#D5604E` | |

**Contrast (WCAG AA body):**
- Light: `#1F1A14` on `#FBF8F2` → 15.4:1 (AAA)
- Light: `#5C5247` on `#FBF8F2` → 6.7:1 (AA+)
- Light: `#B5532A` (accent, FILL ONLY) on `#FBF8F2` → 4.68:1 (just above AA body — NOT for text)
- Light: `#8E3A1B` (accent-strong, text-safe) on `#FBF8F2` → 7.15:1 (AAA)
- Dark: `#F4EFE7` on `#1E1812` → 14.8:1 (AAA)
- Dark: `#B8AC9A` on `#1E1812` → 7.9:1 (AA+)
- Dark: `#D87144` (accent, FILL ONLY) on `#1E1812` → 5.33:1 (passes AA body, but reserved for fill)
- Dark: `#E89564` (accent-strong, text-safe) on `#1E1812` → 7.46:1 (AAA)

## Type ladder

Family: **Geist Sans** (already loaded by upstream)
Weights: 400 / 500 / 600 — never bold (700+) for this direction. Discipline = restraint.

| Token | Size | Tracking | Usage |
|---|---|---|---|
| `text-xs` | 0.75rem (12px) | +0.02em | Badges, micro-meta |
| `text-sm` | 0.8125rem (13px) | +0.005em | Body, widget content |
| `text-base` | 0.9375rem (15px) | 0 | Card titles, primary list rows |
| `text-lg` | 1.0625rem (17px) | -0.005em | Section headers |
| `text-xl` | 1.3125rem (21px) | -0.012em | Widget titles in hero size |
| `text-2xl` | 1.625rem (26px) | -0.018em | Greeting / time-of-day |
| `text-3xl` | 2.125rem (34px) | -0.022em | Onboarding hero only |

Note: tighter base (13px not 14px) keeps Linear's information-dense feel; -0.022em on 3xl is the editorial trick that keeps headlines from feeling "default."

## Voice rules

1. **Greeting copy is direct, not warm-fuzzy.** "Good morning, Emre" — yes. "Hey there, friend!" — never. We greet like a butler, not a barista.
2. **Empty states explain the mechanism, never apologize.** "No events today. Add a calendar in Settings → Connections." Not "Oops, nothing here yet!"
3. **Numbers carry weight; adjectives don't.** Show "3 unread" not "a few unread emails." Lobi is a status surface; vagueness is noise.
4. **Errors name the system, not the user.** "Spotify token expired — reconnect." Not "Something went wrong, please try again."
5. **Settings copy uses verb-first labels.** "Connect Gmail," "Reorder widgets," "Reset layout." Never noun-only ("Gmail Settings") and never gerunds ("Connecting to Gmail").

## Why this is distinctive vs gethomepage / Jack

- **vs gethomepage:** They are blue-chrome sysadmin aesthetic — bright primary blues, dense status grids, server-room feel. Direction A is sand/bone/terracotta — domestic, ceramic, hand-thrown. Same information density, opposite emotional register.
- **vs Jack/Caki:** Jack is deep teal #2D7A6F + a mascot. Direction A is mascot-free, terracotta-led, and distinctly warmer in surface. Where Jack reads as a green sticker on a notebook, Lobi reads as a kraft-paper folder on a wood desk.
- **The unique move:** most "warm minimal" products end up at cream + black + a single muted accent (Notion, Are.na). Direction A is *Linear-tight* underneath the warmth — same information density as a developer tool, just dressed in domestic colors. That tension is the brand.
