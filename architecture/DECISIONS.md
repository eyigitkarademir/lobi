# Lobi — Architecture Decisions

Each decision uses the DEC-NNN format. Once approved, decisions are locked unless explicitly superseded with a new DEC-NNN.

---

### DEC-001: Fork Caki's agent infrastructure (one-time copy)
- **Date:** 2026-05-09
- **Status:** approved
- **Decision:** One-time copy of Caki's `.claude/rules/`, generic `src/skills/`, `e2e/` smoke pattern, `scripts/dev.sh`, `playwright.config.ts`, `specs/SPEC_TEMPLATE.md`. After fork, both repos evolve independently.
- **Rationale:** Lobi is a different product, different domain. Sharing rules/skills is fine but downstream divergence is expected.
- **Locked by:** Emre

### DEC-002: Stack (Lobi additions)
- **Date:** 2026-05-09 (pre-pivot) / 2026-05-10 (re-scoped)
- **Status:** approved (re-scoped by DEC-009)
- **Decision:** Lobi-specific additions on top of upstream gethomepage stack: libsql + Drizzle ORM (local DB for user data), better-auth (OAuth providers), dnd-kit (drag-drop), @playwright/test (smoke). Upstream provides Next 16, React 19, Tailwind v4, vitest, eslint, pnpm.

### DEC-003: 10-widget MVP — Lobi divergence layer
- **Date:** 2026-05-09 (re-scoped 2026-05-10)
- **Status:** approved (re-scoped by DEC-009)
- **Decision:** V0.1 ships **10 NEW Lobi widgets** as the divergence layer on top of gethomepage's existing 180+. The 10: bookmarks (with chat-config wrapper), weather (extend their existing), time/greeting, search w/ AI mode, RSS w/ AI summary, Google Calendar, Gmail, YouTube subs, Spotify, deep-link bento. Existing 180+ upstream widgets stay available for power users.

### DEC-004: Audience — tech-savvy individual first, broad consumer V1+
- **Date:** 2026-05-09
- **Status:** approved (still valid post-pivot)

### DEC-005: Desktop-first, mobile responsive only at MVP
- **Date:** 2026-05-09
- **Status:** approved (still valid post-pivot)

### DEC-006: AI = BYOK (user supplies own API key) at MVP
- **Date:** 2026-05-09
- **Status:** approved (still valid post-pivot)

### DEC-007: Drag-drop in MVP
- **Date:** 2026-05-09
- **Status:** approved (still valid — added on top of upstream's CSS-grid layout)

### DEC-008: Port 3010 for Lobi dev (re-scoped by DEC-010)
- **Date:** 2026-05-09
- **Status:** superseded by DEC-010

### DEC-009: PIVOT — fork gethomepage instead of building from scratch
- **Date:** 2026-05-10
- **Status:** approved
- **Alternatives Checked:**
  - Continue scratch build (lobi-scratch direction) — rejected: 6-12 months to reach gethomepage feature parity
  - Hybrid (cherry-pick patterns from upstream into scratch) — rejected: same as scratch but with extra integration cost
  - Fork benphelps/homepage (the original) — rejected: archived ~3 years ago, gethomepage is the active fork
  - Fork gethomepage/homepage — **chosen**: 30k stars, active maintenance, Next 16, GPL-3.0
- **Decision:** Replace scratch direction with fork of gethomepage/homepage. Existing scratch repo preserved as `/Users/eyigitkarademir/lobi-scratch/` for reference, not active development. Active repo is `/Users/eyigitkarademir/lobi-fork/`.
- **Rationale:**
  - Faster time-to-MVP: their widget framework, theming, API proxy, Docker dist all ready
  - Lobi's differentiation (chat-config, AI, consumer widgets, OAuth) doesn't depend on owning the base layer — we add on top
  - GPL-3.0 viral copyleft accepted: Lobi forever open-source, hosted SaaS revenue still compatible
- **Locked by:** Emre (this session)
- **Implications:**
  - Pages Router exists (their pattern); we add App Router alongside for new features (officially Next.js-supported)
  - Package manager: pnpm (their preinstall enforces it)
  - JavaScript primary; TypeScript available; new Lobi code in TS
  - `src/widgets/`, `src/pages/`, `src/components/` are upstream-owned (don't modify, only add new in `src/components/lobi/` etc.)
  - Upstream sync via `upstream` remote and conflict-resolution table in CLAUDE.md
- **Traces to:** CLAUDE.md (file map + sync strategy), LOBI.md (divergence intent)

### DEC-010: Port convention post-pivot
- **Date:** 2026-05-10
- **Status:** approved
- **Decision:** When developing **Lobi-specific features**, run dev server on port 3010 via `bash scripts/lobi-dev.sh`. When testing upstream parity / Docker compatibility, use port 3000 via standard `pnpm dev`. Both available.
- **Rationale:** preserves upstream's port-3000 expectation for Docker/docs compatibility while keeping Lobi's 3010 convention to avoid Caki collision.
- **Locked by:** Claude (discretionary, post-DEC-009)

### DEC-011: License accepted — GPL-3.0
- **Date:** 2026-05-10
- **Status:** approved
- **Decision:** Lobi inherits GPL-3.0 from gethomepage and stays open-source forever.
- **Trade-offs accepted:**
  - All Lobi modifications must be GPL-3.0 compatible
  - No closed-source variants possible
  - Hosted SaaS subscription revenue still works (SaaS ≠ distribution under GPL-3.0)
- **Locked by:** Emre (this session)

### DEC-012: Brand identity v1 — Direction B "Editorial confidence"
- **Date:** 2026-05-10
- **Status:** approved (locked)
- **Alternatives Checked (LB-02):**
  - Direction A "Disciplined warmth" — sand + terracotta, 45/25/25/5 mix, Evaluator scored 42/45 (winner). Rejected by Emre.
  - Direction B "Editorial confidence" — zinc + oxblood, 30/5/5/60 mix (Vercel-heavy), Evaluator scored 42/45 (runner-up). **Chosen.**
  - Direction C "Calm playful" — cream + dusty lilac, 15/40/30/15 mix. Eliminated for anti-pattern violation (gradient on .glyph) + WCAG AA failure (3.34:1 vs claimed 4.6:1).
- **Decision:** Lobi v1 brand = Direction B. Wordmark-led editorial identity. Surfaces zinc (`#F4F4F2` light / `#0D0D0C` dark), accent oxblood (`#7C2233` light / `#C44A5C` dark), display type Tiempos, body type Geist.
- **Rationale (Emre's choice):** B's typographic boldness creates stronger product personality than A's quieter warmth. Spec's "no single-bucket extreme" caveat acknowledged — Emre accepts the 60% Vercel weight as deliberate brand choice, not as drift.
- **Implications:**
  - `DESIGN.md` tokens locked (light + dark mode, full type ladder, voice rules)
  - Logo files committed: `public/logo-mark.svg`, `public/logo-wordmark.svg`, `public/logo-lockup.svg`, `public/favicon.svg`
  - Tiempos serif font dependency added (display-only, with `ui-serif` fallback chain)
  - Voice rules: 5 contracts (headlines have a POV, lowercase intentional, connection labels are nouns, errors stated never apologized for, tabular numerics always)
  - Anti-pattern #11 + #12 added (proportional digits banned, accent-as-text banned in dark mode)
- **Math verification (post-Designer revision):**
  - Light: `--accent` #7C2233 on white → 9.7:1 (AAA) — safe for any text
  - Dark: `--accent` #C44A5C on `#161614` → 3.83:1 (AA Large only) — fill/CTA only
  - Dark: `--accent-strong` #E69CAA introduced → 8.5:1 (AAA) — for accent text in dark mode
  - All text-primary/secondary/tertiary tokens verified AAA in both modes
- **Locked by:** Emre (selection 2026-05-10)
- **Traces to:** `specs/LB-02-visual-identity.md`, `architecture/brand-explorations/` (B kept, A+C archived), `DESIGN.md` (tokens + voice rules), `public/logo-*.svg`

### DEC-013: Import scanner + CLI auto-setup from emrekaraoglu96/homepage
- **Date:** 2026-05-10
- **Status:** approved
- **Decision:** Merge `emre/dev` (7 commits, ~14.8k LOC, 16 files) into `eyigitkarademir/lobi:dev`. Adds: `src/cli/{setup,generate,scanner}.mjs`, browser history widget + utilities, browser-history API routes. Adds `better-sqlite3` runtime dep alongside our `@libsql/client`.
- **What this enables:**
  - Zero-auth local-machine scanning (browser history, bookmarks, Docker, battery, 12 data sources)
  - Auto-generated gethomepage-compatible config from scan results
  - Browser history widget surfaces top-visited domains
  - "30-second to populated dashboard" promise via CLI setup
- **Alternatives Checked:**
  - Cherry-pick (commit-by-commit) — rejected: more conflict-resolution per commit with no benefit; 7 commits can't be split logically without losing the OAuth-add/OAuth-remove arc
  - Selective import (only CLI, not browser history widget) — rejected: the widget surfaces scanner data; without it the scanner output isn't visible
  - Build from scratch in Lobi — rejected: emre's branch already shipped this with ~14.8k LOC of working code
- **Rationale:**
  - Emre had already prototyped this in another session; importing > rebuilding
  - Lobi's "30-second populated dashboard" promise is largely realized by this CLI — chat onboarding (LB-03) becomes refinement, not the only path to value
  - Zero-auth approach is local-first; OAuth (LB-04) becomes Lobi's own divergence layer on top
- **License:** GPL-3.0 (consistent — emre's branch was already a gethomepage fork, same license inheritance)
- **What was NOT imported:** OAuth integration was added in commit `c0ae2257` and reverted in `bcd7aabd`. Net effect = zero-auth state. Re-adding OAuth becomes Lobi's own work (LB-04 spec, future).
- **Two SQLite drivers now present** (intentional, documented):
  - `@libsql/client` — Lobi's user-state DB (async, our LB-01 spec target)
  - `better-sqlite3` — emre's scanner reads browser history files (sync, native)
  - Could consolidate later but not blocking
- **Locked by:** Emre (this session, post-fork)
- **Traces to:** Merge commit `b600b14b`, `architecture/STATUS.md` updated capability inventory
- **Future:** LB-03 onboarding chat agent will need to integrate with scanner output (chat agent reviews/refines scanner-generated config rather than starting from blank). LB-04 OAuth adds cloud-service widgets on top of local-first scanner.
