# Lobi — Current Status

**Last updated:** 2026-05-10 (post-pivot to fork)

## Current Phase
**V0.1 fork base — brand locked, divergence implementation not yet started.**

## Completed
- [x] **Pivot decision** (DEC-009) — switched from scratch build (lobi-scratch) to fork of gethomepage/homepage (lobi-fork)
- [x] Cloned `gethomepage/homepage` to `/Users/eyigitkarademir/lobi-fork/`
- [x] `pnpm install` successful (Next 16.2.6, React 19, Tailwind v4 ready)
- [x] **Caki infra layered onto fork:**
  - `.claude/rules/` (8 operating rules)
  - `src/skills/` (11 generic agents)
  - `architecture/` (VISION, PRODUCT_STRATEGY, DECISIONS, STATUS)
  - `specs/` (SPEC_TEMPLATE, LB-01)
  - `memory/`, `DESIGN.md`, `CLAUDE.md`, `LOBI.md`
  - `e2e/smoke.spec.ts`, `playwright.config.ts`
  - `scripts/lobi-dev.sh`
  - `.env.example`
- [x] License clarified (GPL-3.0, DEC-011)

## In Progress
- (LB-02 complete — pending commit of brand artifacts)

## Recently Completed
- [x] Upstream remote set (`origin` = eyigitkarademir/lobi, `upstream` = gethomepage/homepage)
- [x] First commit on lobi-fork (Caki infra layer) → `e96c1119`
- [x] GitHub repo created: github.com/eyigitkarademir/lobi (PUBLIC, GPL-3.0)
- [x] `dev` branch pushed to origin
- [x] Memory symlink set for `/Users/eyigitkarademir/lobi-fork`
- [x] Upstream `pnpm dev` verified — HTTP 200 on port 3000
- [x] Lobi deps added via `pnpm add` (drizzle-orm, @libsql/client, better-auth, @dnd-kit/*, @playwright/test, drizzle-kit)
- [x] **LB-02 complete** — brand identity locked to Direction B "Editorial confidence" (DEC-012):
  - DESIGN.md updated with full token set (light + dark, type ladder, voice rules)
  - Logo files copied to `public/` (mark, wordmark, lockup, favicon.svg)
  - Direction A and C archived to `architecture/brand-explorations/archive/`
  - Math-verified all contrast ratios — AAA on all body text, dark accent gated to fill-only with `--accent-strong` for text use

- [x] **Merge from emrekaraoglu96/homepage** (DEC-013) — scanner + CLI auto-setup imported (7 commits, 14.8k LOC, 16 files):
  - `src/cli/{setup,generate,scanner}.mjs` — zero-auth local-machine scanner + config generator
  - `src/widgets/browserhistory/*` + `src/utils/browser-history/*` — auto-discovery widget reading Chrome/Safari/Firefox SQLite
  - `src/pages/api/browser-history/*` — runtime API routes for browser history
  - `better-sqlite3` runtime dep added (alongside our `@libsql/client`)
  - `pnpm-lock.yaml` regenerated cleanly
  - **Smoke verified:** `pnpm dev` returns HTTP 200 on :3000; `node src/cli/setup.mjs` runs and successfully scans (1041 bookmarks, browser detected, Docker probed)
  - 3 remotes configured: `origin` (eyigitkarademir/lobi), `upstream` (gethomepage/homepage), `emre` (emrekaraoglu96/homepage)

## Not Started (next sprint — Lobi divergence layer)

**RE-PRIORITIZED post-merge** — scanner CLI now ships local-first dashboard generation, so the order shifts:

- LB-03: **Brand B styling applied to scanner-generated dashboard** (NEW PRIORITY) — currently the scanner output renders in upstream gethomepage chrome; needs DESIGN.md tokens applied via theme override layer
- LB-01: Database schema + Drizzle (now smaller — only Lobi-specific user state, not config)
- LB-04: Onboarding chat agent — refines scanner output rather than starts from blank
- LB-05: better-auth setup + Google OAuth (cloud widgets on top of local-first scan)
- LB-06: First Lobi cloud widget — Gmail unread
- LB-07: Google Calendar widget
- LB-08: YouTube subscriptions widget
- LB-09: Spotify recent/playing widget
- LB-10: RSS reader with AI summary (extends/replaces FreshRSS-style upstream widget)
- LB-11: AI search mode
- LB-12: Drag-drop layout (dnd-kit on top of their grid)
- LB-13: Templates — Minimalist, Productivity, News Junkie, Creator
- LB-14: Settings + theme picker
- LB-15: Deep-link bento (Yemeksepeti / Trendyol / Uber Eats / banks)

## Blockers
None.

## What Did NOT Work
- **Initial scratch-build approach** (lobi-scratch) — abandoned in favor of fork. Loss: ~30 minutes scaffold time. Gain: 5+ years of upstream feature parity. Lesson: when an active mature codebase exists in the target space, fork-and-augment beats scratch-build for shipping speed, even if architecture purity suffers.

## Decisions Made (this session)
See `DECISIONS.md` DEC-001 through DEC-011. Key new ones: DEC-009 (pivot), DEC-010 (port convention post-pivot), DEC-011 (license).

## Next Steps (priority order)
1. Set upstream remote + commit Caki infra layer
2. Memory symlink for new path
3. Verify upstream dev still runs (`pnpm dev`, port 3000)
4. Add Lobi deps (`pnpm add ...`)
5. Hand off to Emre with summary
6. Next session: start LB-01 (DB schema) in fork context
