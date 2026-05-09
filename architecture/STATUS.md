# Lobi — Current Status

**Last updated:** 2026-05-10 (post-pivot to fork)

## Current Phase
**V0.1 fork base** — gethomepage cloned, Caki infra layered, Lobi divergence not yet implemented.

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
- [ ] Set upstream remote (`git remote add upstream https://github.com/gethomepage/homepage.git`)
- [ ] First commit on lobi-fork (Caki infra layer)
- [ ] Memory symlink for `/Users/eyigitkarademir/lobi-fork`
- [ ] Verify upstream `pnpm dev` still runs cleanly (port 3000)
- [ ] Add Lobi deps via `pnpm add` (drizzle-orm, @libsql/client, better-auth, @dnd-kit/*, @playwright/test)

## Not Started (next sprint — Lobi divergence layer)
Specs to be written/refined:
- LB-01: Database schema + Drizzle setup (already drafted, needs pnpm/fork-context refresh)
- LB-02: Visual identity — Designer agent produces Lobi DESIGN.md tokens
- LB-03: Onboarding chat agent (App Router page in `src/app/(onboarding)/`)
- LB-04: better-auth setup + Google OAuth flow
- LB-05: First Lobi widget — Gmail unread
- LB-06: Google Calendar widget
- LB-07: YouTube subscriptions widget
- LB-08: Spotify recent/playing widget
- LB-09: RSS reader with AI summary
- LB-10: AI search mode
- LB-11: Drag-drop layout (dnd-kit on top of their grid)
- LB-12: Templates — Minimalist, Productivity, News Junkie, Creator
- LB-13: Settings + theme picker
- LB-14: Deep-link bento (Yemeksepeti / Trendyol / Uber Eats / banks)

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
