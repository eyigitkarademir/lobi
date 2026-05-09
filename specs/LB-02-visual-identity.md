# LB-02: Visual identity — logo, brand voice, design tokens

## Goal
Produce Lobi's visual identity v1: logo (mark + wordmark), accent palette + neutrals, typography ladder, voice guidelines, and `DESIGN.md` tokens. The output unblocks every subsequent Lobi UI task — anything we build after this references LB-02 tokens.

## WHY — Business Context
- **Problem:** Current `DESIGN.md` is a placeholder with Jack's borrowed teal. Without our own brand, every UI task requires a re-decision on color/type/voice. Visual differentiation from gethomepage (sysadmin-functional) and Jack/Caki (mascot-driven teal) is a positioning need, not just aesthetic.
- **Impact:** A locked brand lets the Engineer + future Designer agents work without re-inventing tokens. It also gives the open-source repo a face — important since we're public on day 1 and want stars.
- **Without this:** Drift. Each widget gets slightly different styling. README has a generic title. GitHub OG card looks like the upstream's. Lobi has no recognizable identity.

## User Journey
N/A — this is a design-artifact spec. Output is files (logo SVGs, `DESIGN.md` tokens) consumed by other specs.

## Locked Constraints
- **Brand personality:** combination of 1-4 from the brief — Linear's discipline + Apple/Stripe's minimal cleanliness + Notion-light's warmth + Arc/Vercel's typographic confidence. Single-bucket extremes (e.g., pure Slack-cute or pure Vercel-edgy) are out.
- **Scope:** logo (mark + wordmark + lockup), accent + neutral palette (light + dark mode), typography ladder, voice principles (3-5 rules), and updated `DESIGN.md` tokens.
- **Anti-patterns** from current `DESIGN.md` are constitutional — do not violate (no shadows on cards, no emoji as UI affordance, no multi-accent themes, no fancy gradients beyond a single subtle hero gradient, no drop shadows, etc.).
- **License:** all new logo work is original by us. No upstream gethomepage logo modifications. No AI-generated logos that risk training-data attribution issues.
- **Differentiation:** must visually feel **distinct from** gethomepage's blue-ish chrome AND Jack/Caki's deep teal. Default new accent must NOT be teal/blue.
- **Format:** logo as SVG (mark + wordmark + horizontal lockup + favicon). Tokens as CSS custom properties in `DESIGN.md` and `src/app/globals.css` (when App Router shell lands).

## Discretionary
- Specific accent color (within the "not teal/blue" constraint)
- Logo concept (letterform L, abstract symbol, wordmark-only, or hybrid — Designer to explore at least 2)
- Typography choice (Geist already loaded by upstream — keep unless Designer has a strong reason to override)
- Voice/tone exact wording
- How exactly the 1-4 personalities mix in each direction (Designer's call)

## Read First
- `DESIGN.md` — current placeholder, anti-patterns are locked
- `LOBI.md` — fork relationship + divergence intent
- `architecture/VISION.md` — V0.1 promise + audience
- `architecture/PRODUCT_STRATEGY.md` — differentiation table
- `src/skills/designer.md` — Designer persona
- `src/skills/design-evaluator.md` — Evaluator persona

## Design Approach (PIPELINE — Designer + Design Evaluator)

This is a **design** task per execution-gate.md. Pipeline is mandatory:

### Phase A: Designer produces 3 directions
The Designer agent produces 3 distinct brand directions, each landing on a different point in the 1-4 personality combination:

- **Direction A: "Disciplined warmth"** — heavy Linear/Apple discipline, Notion warmth as accent. Color: warm neutral (sand/stone) + small saturated accent (e.g., deep terracotta or warm amber).
- **Direction B: "Editorial confidence"** — Arc/Vercel typographic boldness, Linear restraint underneath. Color: cool neutral (slate/zinc) + bold accent (e.g., deep magenta or oxblood). Wordmark-led.
- **Direction C: "Calm playful"** — Raycast/Notion-light playfulness with Apple discipline as guardrail. Color: warm-cool mix (cream + ink) + a single soft saturated accent (e.g., dusty lilac or warm coral).

Each direction includes:
- Logo mark (SVG outline + 3 size variants: 16px favicon, 32px nav, 96px hero)
- Wordmark "Lobi" (custom letterforms or modified Geist — designer's call)
- Lockup (mark + wordmark)
- Color palette: bg-page, bg-card, border-subtle, text-primary/secondary/tertiary, accent, accent-hover, success/warning/danger (light + dark mode)
- Type ladder: 7 sizes from text-xs to text-3xl, weight uses (regular, medium, semibold), tracking adjustments
- 1 sample widget card rendered in the brand (Bookmarks or Weather card)
- 200-word voice description (3-5 rules: e.g., "Greeting copy is direct, not cute"; "Empty states explain, never apologize")

**Output location:** `architecture/brand-explorations/` directory:
- `direction-a.md` (description + reasoning + tokens)
- `direction-a-mark.svg`, `direction-a-wordmark.svg`, `direction-a-lockup.svg`, `direction-a-card.html`
- (same for direction-b, direction-c)

### Phase B: Design Evaluator reviews each direction
For each direction, evaluator scores on:
- **Brand fit** (does it land in 1-4 combination space)
- **Distinctiveness** (does it differentiate from gethomepage + Jack)
- **Anti-pattern compliance** (no shadows, no emoji, etc.)
- **Asset quality** (clean SVG paths, proper proportions, scales correctly at 16/32/96px)
- **Token consistency** (light/dark mode parity, sufficient contrast for WCAG AA)
- **Voice clarity** (the 3-5 rules are concrete, not vague)

Output: `architecture/brand-explorations/evaluation.md` with a 1-5 score per criterion per direction + specific fix-up notes.

### Phase C: Designer revises (1+ iteration)
Designer addresses evaluator's specific findings on at least one direction (the winning candidate, but ideally all). Output revised assets in same paths.

### Phase D: Top 2 presented to Emre
Top 2 directions (winning candidate + closest runner-up) presented. Emre picks one or asks for combined revision.

### Phase E: Lock in chosen direction
Once Emre picks:
- Update `DESIGN.md` with chosen tokens (replace placeholder)
- Add `public/logo-mark.svg`, `public/logo-wordmark.svg`, `public/logo-lockup.svg`, `public/favicon.ico` (ICO from 16/32 sizes)
- Update `src/app/globals.css` (when App Router shell lands)
- Add brand voice rules to `DESIGN.md`
- Move losing directions to `architecture/brand-explorations/archive/`

## Verification Checklist (must pass before LB-02 considered done)
- [ ] 3 directions delivered in `architecture/brand-explorations/`
- [ ] Design Evaluator scoring file exists, all directions scored on 6 criteria
- [ ] At least 1 designer-revision iteration applied to top 2 directions
- [ ] Top 2 presented to Emre with clear visual + reasoning
- [ ] Chosen direction's tokens written into `DESIGN.md` (replace placeholders)
- [ ] Logo files in `public/` with proper SVG + ICO outputs
- [ ] All logos render at 16/32/96px without artifacting (manual visual check)
- [ ] Light + dark mode tokens both pass WCAG AA contrast for body text
- [ ] Voice rules added to `DESIGN.md` (3-5 concrete rules)
- [ ] Anti-pattern check passes against constitutional list in `DESIGN.md`
- [ ] No accent color is teal/blue (differentiation constraint)
- [ ] Sample widget card looks distinct from gethomepage's default widgets

## Affected Files
- `DESIGN.md` — replace placeholder tokens with chosen direction
- `architecture/brand-explorations/` (new dir) — exploration + evaluation
- `public/logo-mark.svg`, `public/logo-wordmark.svg`, `public/logo-lockup.svg`, `public/favicon.ico` (new)
- `src/app/globals.css` — only if App Router shell exists at that point; otherwise deferred to LB-03

NOT affected (preserve upstream):
- `src/styles/` (gethomepage's existing styles stay)
- `public/` upstream assets (don't replace, only add)

## Phases
### Phase 1: Setup
- [ ] Create `architecture/brand-explorations/` directory
- [ ] Pre-flight: verify Designer + Design Evaluator skills are accessible (`src/skills/designer.md`, `src/skills/design-evaluator.md`)

### Phase 2: Designer — produce 3 directions
- [ ] Spawn Designer subagent with `designer.md` persona + this spec
- [ ] Designer reads VISION + LOBI.md + DESIGN.md + PRODUCT_STRATEGY first
- [ ] Output 3 direction folders + assets

### Phase 3: Design Evaluator
- [ ] Spawn Design Evaluator subagent with `design-evaluator.md` persona
- [ ] Evaluator scores each direction on 6 criteria
- [ ] Output `evaluation.md` with concrete fix-ups

### Phase 4: Designer revision
- [ ] Designer addresses evaluator's findings on top 2 directions

### Phase 5: Present to Emre + select
- [ ] Present top 2 with reasoning
- [ ] Emre picks (or requests combined revision)

### Phase 6: Lock in
- [ ] Update DESIGN.md with chosen tokens
- [ ] Logo files committed to `public/`
- [ ] Voice rules locked
- [ ] Losing directions archived

## Verification (final)
- [ ] All checklist items above pass
- [ ] Commit message: `feat(lobi): brand identity v1 — direction <X> selected`
- [ ] STATUS.md updated, DEC-012 added (locked brand direction)

## Agent Config
- **Autonomy:** checkpoint-at-phase (stop at end of Phase 2 to confirm directions look right; stop at Phase 5 for selection)
- **Models:** designer = sonnet, design-evaluator = sonnet (visual reasoning), final lockdown = haiku-fine
- **Escalation:** if no direction lands in 1-4 space after 2 designer iterations → STOP and present to Emre with options
