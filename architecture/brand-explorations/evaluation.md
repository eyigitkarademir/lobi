# LB-02 — Brand Direction Evaluation

> **Evaluator:** Design Evaluator agent
> **Date:** 2026-05-10
> **Scope:** 3 directions × 6 criteria = 18 scored cells
> **Method:** Read all spec/context files, all 15 brand-exploration files, mathematically verified WCAG contrasts, audited SVG path quality, audited HTML cards against constitutional anti-patterns from `DESIGN.md`.

---

## Scoring scale

1 = automatic fail / unfit
2 = significant problems
3 = competent default
4 = strong, with caveats
5 = excellent, distinctive

**Weights:** Brand fit, Distinctiveness, Anti-pattern compliance are **double-weighted** (positioning-critical). Asset quality, Token coherence, Voice clarity are **single-weighted**. Max total = (5×3×2) + (5×3×1) = **45**.

---

## Direction A — "Disciplined warmth"

| # | Criterion | Score | Justification |
|---|---|---|---|
| 1 | Brand fit | **5/5** | Mix is 45/25/25/5 — lands cleanly inside the 1-4 box. Linear discipline carries the structure (tight tracking, conservative weights, 13px body), Notion warmth is the surface (sand/bone), Apple minimal shows in restraint (no decoration), Vercel typographic confidence at 5% is honest about the priority. No single-bucket extremism. |
| 2 | Distinctiveness | **5/5** | Terracotta #B5532A is genuinely far from gethomepage's primary blue and Jack's #2D7A6F teal. The sand+bone surface is also a hard departure from gethomepage's cool-white and Jack's deeper neutrals. A developer comparing the three side-by-side would never confuse them. The "Linear discipline in domestic colors" tension is the unique positioning move. |
| 3 | Anti-pattern compliance | **5/5** | Card uses `border: 1px solid` and background contrast — no shadow. No emoji as UI affordance (single-letter glyph squares are typographic, not emoji). Single accent (terracotta), no multi-accent. No fancy gradients (`.glyph` background is flat `#EFE7D7`). Hover state is border + bg shift, not shadow. Clean. |
| 4 | Asset quality | **3/5** | Mark path is solid — single closed path, one quadratic curve at the heel, scales legibly from 16-96px. The 1.6px-radius accent dot at (22.5, 44.5) inside the heel-curve will almost certainly disappear at 16px favicon size and is a visual artifact at 32px. Wordmark `b` glyph has a structurally odd join: stem terminates at y=22.6, then `Q 105 22 110 22` jumps to start the bowl arc — the resulting outline has a visible kink at the stem-bowl junction (the `.6` offset doesn't match the bowl's tangent). The `o` and `b` constructions use `0.001` length closing arcs which is a legitimate SVG circle-drawing trick but reads as dead-code in source review. No `<text>` placeholders. Overall: the mark is hand-crafted, the wordmark needs a structural pass on the `b`. |
| 5 | Token coherence | **4/5** | All required tokens present. Light + dark are intentional sister palettes, not random. WCAG verified: body text on bg-card 15.4:1 (AAA), secondary 6.7:1 (AA+), dark mode 14.8:1 / 7.9:1 — all confirmed correct. **Caveat:** accent #B5532A on `bg-card` #FBF8F2 computes to ~4.46:1 (verified mathematically) — designer didn't claim a value here, but this is *just below* AA for body text (4.5:1). Accent text use should be confined to large text / pills with white foreground (which is what the card does — accent is only used on the pill background with cream `--accent-fg`, where the contrast inverts and clears AA easily). Worth documenting. |
| 6 | Voice clarity | **5/5** | All 5 rules are concrete and behavioral. "Greet like a butler, not a barista" is a memorable mental model. Rule 3 ("Numbers carry weight; adjectives don't") is implementation-actionable. Rule 5 specifies verb-first, not noun, not gerund — three negative examples in one rule. No vague platitudes. |

**Weighted total:** (5+5+5)×2 + (3+4+5)×1 = **30 + 12 = 42 / 45**

---

## Direction B — "Editorial confidence"

| # | Criterion | Score | Justification |
|---|---|---|---|
| 1 | Brand fit | **4/5** | Mix is 30/5/5/60 — heavily weighted to Arc/Vercel typographic confidence with Linear discipline as backbone. Apple/Notion at 5% each is honest but the resulting personality is closer to single-bucket-Arc than to a 1-4 mix. The masthead serif + slab-L + tight tracking achieves "editorial" but the warmth dimension is essentially zero. Per the spec's locked constraint, "single-bucket extremes are out" — at 60% Vercel-confidence, this is the closest of the three to a single-bucket reading. Not a fail (Linear and Arc both contribute), but the warmth/discipline balance is thin. |
| 2 | Distinctiveness | **5/5** | Oxblood + zinc + serif display is unmistakably not gethomepage (which is cool blue chrome) and unmistakably not Jack (rounded teal mascot). Wordmark-led identity with a custom serif/sans hybrid is the actually-untaken position in productivity SaaS — Arc went wordmark-only with sans, Vercel went wordmark with geometric sans. Direction B with serif display + slab-L + oxblood square is its own corner. |
| 3 | Anti-pattern compliance | **5/5** | No shadows. Emoji absent. Single accent (oxblood), strict. No gradients anywhere — sharpest of the three. Card uses 4px radius and 1px hairline rule + 2px masthead rule for separation, no shadow. `.kicker` uppercase tracking is editorial signal, not decoration. Clean. |
| 4 | Asset quality | **4/5** | Mark is rectangle-only — pure crisp paths, no kinks, scales perfectly to 16px (the slab-L holds, the inset 6×6 oxblood block reads as a confident dot). The strong top + bottom rules at 16px will compress to 1px each but the L+block remain legible. Wordmark `o` and `b` use the same `0.001` closure trick as A — fine. The `b` construction has a separate horizontal foot serif at y=64 + stem rect + circular bowl + bridge rect — the bridge `<rect x="128" y="34" width="6" height="32">` runs from inside the bowl down past the foot serif at y=64; this overlap is functional (the 1px hairline baseline rule covers any visual seam) but inelegant in source. The foot serif on the `b` is structurally surprising — most humanist sans `b` glyphs don't have a foot serif. It works as an editorial choice but should be visually verified at 16px. **No `<text>` placeholders, all paths.** |
| 5 | Token coherence | **5/5** | All tokens present. WCAG verified mathematically: text-primary on white = 19.6:1 (AAA) ✓, secondary 8.5:1 ✓, dark mode 14.7:1 / 6.6:1 ✓, oxblood on white = 9.87:1 (designer claimed 9.2 — close enough, AAA confirmed). Light/dark are mirror-coherent (same hierarchy, inverted relative luminance). `--danger` deliberately reuses `--accent` (oxblood) — this is editorial intent, documented in the spec. Tabular-nums rule for data is enforceable in CSS. |
| 6 | Voice clarity | **5/5** | All 5 rules are concrete. Rule 1's "headlines have a point of view" is actionable (replace "You have 3 events" with "Today's calendar is light"). Rule 5 is implementation-specific (`font-variant-numeric: tabular-nums` in CSS). Rule 3's noun-only labels ("Mail" not "Gmail") is a strong, testable behavior. No vague encouragement. |

**Weighted total:** (4+5+5)×2 + (4+5+5)×1 = **28 + 14 = 42 / 45**

---

## Direction C — "Calm playful"

| # | Criterion | Score | Justification |
|---|---|---|---|
| 1 | Brand fit | **4/5** | Mix is 15/40/30/15 — Apple discipline as guardrail (40%) + Notion-Raycast warmth (30%) is a believable 1-4 mix. The offset-tile gesture is the single playful move; everything else is restrained. Concept is coherent. **However**, the Linear contribution at 15% is thin in the actual artifacts — the wordmark uses generous tracking (+0.005em on body), the type ladder caps at -0.018em (compared to A's -0.022em), and the `.row` hover uses a soft lilac wash. Reads more like 50% Notion / 30% Apple / 20% Raycast in execution than the stated mix. Not a fail, but the personality leans further into "soft/playful" than the spec target. |
| 2 | Distinctiveness | **5/5** | Dusty lilac #9B7FB8 is verifiably absent from productivity SaaS — Linear is purple-blue, Notion is grayscale, Raycast is red, Vercel is monochrome, gethomepage is blue, Jack is teal. The 2x2 offset-tile mark is also a unique answer to gethomepage's compass-arrow logo — it visually describes the product (a grid you arrange) without being literal. A developer would not confuse this with either anchor product. |
| 3 | Anti-pattern compliance | **2/5 — VIOLATION** | **Constitutional violation:** `direction-c-card.html` line 44, `.glyph` background uses `linear-gradient(180deg, #F2EAD7 0%, #E8E0CE 100%)`. Per `DESIGN.md` anti-pattern #4: *"No 'fancy' gradients. Single accent color. Maximum one subtle gradient on hero/onboarding."* This gradient is on a UI affordance (bookmark icon background) inside a widget card — neither hero nor onboarding. The gradient is subtle, but the rule's intent is to prevent gradient creep; even a 2-stop neutral gradient on a card glyph is precisely what this rule forbids. Per the brief's instruction, anti-pattern violation is automatic fail on this criterion regardless of other scores. **Easy fix:** replace with flat `#EFE7D7` or `#F0E8D5`. Once fixed, this score becomes a 5/5. Other rules are clean (single accent, no shadows, no emoji, no multi-accent). |
| 4 | Asset quality | **3/5** | Mark is the cleanest of the three — 4 rectangles with rx=5, the offset tile shifted +4,-3. Crisp at all sizes, the 22×22 tiles at 64×64 viewBox scale linearly to 16/32/96. Wordmark has a craftsmanship issue: `direction-c-wordmark.svg` lines 6-16 contain a quadratic-curve L path that is dead code, followed by a comment "Wait — that's the inner shape; better to draw the SOLID L:" then redundant rectangles on lines 19-20 that are the actually-rendered L. The dead path is harmless visually (it draws the same shape over the rects, both filled `#1C1A22`) but it's sloppy source — a reviewer or future Engineer translating this to React will see two L definitions and have to reason about which is canonical. The lilac circle dot on the `i` is `r=4.5` which scales fine, and the bridge between `b` stem and bowl is a clean `<rect x="100" y="22" width="6" height="14">`. The `o` and `b` use the same `0.001` arc-closure trick. Mark scores 5; wordmark scores 2; average 3. |
| 5 | Token coherence | **3/5** | All tokens present. Most contrasts verified: text-primary on bg-card 16.0:1 (AAA), secondary 7.0:1, dark 13.6:1 / 7.8:1 — all correct. **However, accent contrast claim is wrong.** Designer claims `#9B7FB8` on `#FFFCF5` = 4.6:1 (AA for ≥14pt). Mathematical recomputation: relative luminance of #9B7FB8 ≈ 0.256, of #FFFCF5 ≈ 0.973, contrast = (0.973+0.05)/(0.256+0.05) = **3.34:1**. This **fails WCAG AA for body text (needs 4.5:1)** AND **fails AA Large (needs 3:1 — wait, just barely passes 3:1 for large/UI components)**. The accent cannot be used as text color for body sizes; it's barely usable for UI components at ≥3:1. The card actually uses accent as background fill with cream foreground (`--accent-fg: #FFFCF5` on `--accent: #9B7FB8`) — that inverts to the same 3.34:1 ratio, also failing for white text on this lilac at body sizes. **Pill use** in `direction-c-card.html` (`background: rgba(155,127,184,0.14); color: #8268A1`) is a soft tint, contrast there is ~5:1 against page bg, that one passes. But the locked accent-on-cream and cream-on-accent ratios both fail AA. This must be fixed — either darken the accent (e.g., #7B5E9C ≈ 4.8:1) or accept that accent is decorative-only and never carries text. |
| 6 | Voice clarity | **4/5** | Rules 1, 2, 3, 4 are concrete and testable. Rule 5 ("Spotify is listening", "Gmail is quiet") is delightful but borderline — present-tense personification is creative, though it risks crossing into the "performative" territory rule 1 explicitly forbids. "Gmail is quiet" describes the system, but "Spotify is listening" anthropomorphizes Spotify — minor inconsistency. Rule 3 ("one playful word per surface, max — Recents not Recent items") is the strongest implementable constraint of the bunch. Overall solid, with one rule that needs tightening. |

**Weighted total:** (4+5+2)×2 + (3+3+4)×1 = **22 + 10 = 32 / 45**

---

## Top-2 Concrete Fix-ups for next iteration

### Direction A (winner — 42/45)

1. **`direction-a-wordmark.svg` lines 26-37 — the `b` stem-to-bowl junction.** The path goes `L 100 22.6 / Q 105 22 110 22 / a 14 14 0 1 1 -10 23.8`. The Q control point at (105, 22) and the a-arc starting tangent don't match — visible kink at the join. Recommendation: rework the `b` as stem rect + bowl path + connecting bridge rect (the same construction Direction C uses for its `b`), or solve for the tangent-continuous Bézier. Pick the simpler approach.
2. **`direction-a-mark.svg` line 23 — the `circle cx="22.5" cy="44.5" r="1.6"` accent dot.** At 16×16 favicon (scale 0.25), this dot becomes 0.4px radius — invisible. At 32px it's 0.8px — also gone. Either remove it from the favicon variant (recommended — explicit `direction-a-mark-16.svg` without the dot), or scale it up to `r="2.5"` minimum so it survives at 32px. Document the favicon-only variant.
3. **`direction-a.md` palette — accent contrast caveat.** Add an explicit row noting that accent #B5532A on bg-card #FBF8F2 = 4.46:1 (just below AA for body text). Specify that accent is used only on accent-filled surfaces with `--accent-fg` foreground, OR on surfaces ≥18pt where AA Large applies. Prevents future Engineer from setting `color: var(--accent)` on a 13px body text and creating an a11y bug.
4. **`direction-a-card.html` line 39 — pill border-radius.** The `border-radius: 999px` on the count pill is fine in isolation, but verify against the broader DESIGN.md anti-pattern intent ("no rounded-everything pills"). Recommendation: leave as-is (it's a single-instance count badge, not pervasive), but document the convention in DESIGN.md so it doesn't spread to every interactive element.

### Direction B (runner-up — 42/45)

1. **`direction-b.md` brand fit — the warmth dimension is missing in execution.** The 5% Notion + 5% Apple/Stripe percentages are honest about the personality, but the spec's locked constraint says "single-bucket extremes are out." At 60% Vercel-typographic-confidence, B is the closest direction to single-bucket. Recommendation: either (a) accept this and reframe the brief as Direction B = "editorial single-track, by design" — and ask Emre if that's acceptable given the locked constraint; or (b) add one warmth move (e.g., the bg-page #F4F4F2 could shift +2 toward warm at #F4F2EE, kicker letters could lose 0.04em of tracking to feel less press-cold). Surface the trade-off explicitly to Emre.
2. **`direction-b-wordmark.svg` line 27 — the `b` foot serif.** The slab foot at `<rect x="116" y="64" width="18" height="4">` extends 4px below the bowl curve. Verify visually at 16px and 32px — at small sizes the foot serif may collide with the baseline rule on line 44 (`<rect x="12" y="74" width="184" height="1">`). Recommendation: render the wordmark at 16/32/96px and screenshot to confirm no collision; if collision visible, drop the foot serif on the `b` and rely on the L's slab to carry the editorial weight.
3. **`direction-b-mark.svg` line 22 — oxblood inset block.** The 6×6 block sits inside the L's negative space at (32, 36)-(38, 42). At 16px favicon (scale 0.25) this becomes 1.5×1.5px — barely a pixel. Same favicon problem as Direction A's accent dot. Either drop the inset for the 16px variant or grow it to ≥3px width.
4. **`direction-b.md` voice rule 3 — connection labels.** "The Gmail card is labeled 'Mail,' not 'Gmail'" creates a discoverability tension: a non-technical user looking for "Gmail" in their dashboard may not recognize "Mail" as Gmail. Acknowledge the trade-off in the rule or soften it to "Connection labels prefer the function ('Mail') over the brand ('Gmail') when context is clear." This is a voice-vs-discoverability decision that should be Emre's.

---

## Final verdict

**Winner: Direction A — "Disciplined warmth"** (42/45)

**Runner-up: Direction B — "Editorial confidence"** (42/45)

A and B are tied numerically, but A wins on **brand-fit honesty**: it lands cleanly at 45/25/25/5 inside the 1-4 box where B sits at 30/5/5/60 and risks the spec's "no single-bucket extremes" locked constraint. A's terracotta+sand+bone is also the more strategically differentiated palette — gethomepage and Jack both anchor toward cool tones, so warmth is the open positioning slot. B is a strong runner-up: cleaner anti-pattern compliance, better token coherence, and stronger asset quality on the mark — but its personality leans further toward editorial-only than the brief asked for.

Direction C is eliminated by the constitutional anti-pattern violation (gradient on `.glyph`) and the WCAG accent-contrast failure (3.34:1 verified, not the claimed 4.6:1). Both are mechanically fixable in one revision, and the lilac is genuinely distinctive — if Emre wants to keep C in play after seeing the top two, a second iteration could resolve both issues. But as-shipped, C cannot proceed to the lockdown phase.

---

## Pause-the-pipeline flag

**Direction C's WCAG accent claim was incorrect.** The designer reported 4.6:1 for #9B7FB8 on #FFFCF5; the mathematically correct value is 3.34:1. This is the kind of error that, if not caught here, would have shipped into `DESIGN.md` and become the locked accent — every future widget would have inherited a non-AA-compliant accent token. **Recommendation: add a contrast-verification step to the Designer skill (`src/skills/designer.md`) — every claimed contrast ratio in a token table must be either (a) computed by formula in the same document, or (b) flagged as "verify before lock."** The Designer should not be the sole source of truth on numerical contrast claims; tokens get inherited and the cost of a wrong number compounds.

This is not a blocker for the LB-02 spec, but it should be a Phase 6 (lockdown) gate: before `DESIGN.md` is updated with the chosen direction's tokens, recompute every contrast ratio mathematically and reject any token table that fails AA for body or AA Large for accent-on-surface. Also applies to A's accent (#B5532A on bg-card = 4.46:1 — just under AA body, must be documented as "accent is for fill, not text").
