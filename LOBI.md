# Lobi — Fork relationship & divergence intent

This repo is a fork of **[gethomepage/homepage](https://github.com/gethomepage/homepage)** (~30k stars, GPL-3.0, the actively maintained successor to benphelps/homepage). Upstream's `README.md` is preserved verbatim — read it for the original project's identity, install instructions, and widget catalog.

## Why fork instead of building from scratch

gethomepage is the most mature personal-dashboard codebase available, with five years of:
- 180+ working service widgets and a clean widget abstraction
- Server-side API proxy pattern (API keys never reach the browser)
- Docker-first self-host distribution
- 40+ language translations
- Robust theming engine
- Active community + maintenance

Rebuilding this base from scratch would take 6-12 months. Forking and adding our differentiators on top takes weeks.

## What Lobi diverges on

gethomepage targets **homelab/sysadmin users** with **YAML-driven config** for **self-hosted services**. Of their 180+ widgets, ~3 are consumer-facing.

Lobi targets **tech-savvy individuals** (V0.1) → **broader consumers** (V1+ via hosted SaaS) with **chat-driven config** for **consumer services**. We add:

| Layer | What we add |
|-------|-------------|
| **Config UX** | Chat-based onboarding agent — natural-language setup builds the dashboard, no YAML required |
| **Auth + per-user state** | better-auth + libsql for OAuth tokens, usage tracking, theme prefs (upstream has none — single shared dashboard) |
| **Consumer widgets** | Gmail, Google Calendar, YouTube subscriptions, Spotify recent/playing, RSS reader with AI summaries, deep-link bento for Yemeksepeti / Trendyol / Uber Eats / banks |
| **AI integrations** | Onboarding agent, smart reordering (time-of-day surfacing), AI search mode |
| **Drag-drop layout** | dnd-kit on top of their CSS grid |
| **App Router** | New flows (chat-config, OAuth, AI) in `src/app/`. Their existing widgets/services stay in `src/pages/`. Both routers coexist (officially supported by Next.js). |

## What Lobi does NOT change in upstream

We don't touch:
- `src/widgets/` (their widget catalog — keep as-is)
- `src/pages/` (their routing — keep as-is, but ADD `src/app/` alongside)
- `src/components/` (their components — keep, but ADD our own in `src/components/lobi/`)
- `Dockerfile`, `docker-entrypoint.sh` (their distribution path)
- `docs/`, `crowdin.yml`, `.github/`
- ESLint, Prettier, jsconfig.json (their conventions)

This minimizes upstream merge conflicts when we sync.

## Directory ownership cheat-sheet

See `CLAUDE.md` "Upstream Sync Strategy" section for the authoritative ownership table.

## License

GPL-3.0, inherited from gethomepage. Code stays open forever. Hosted-SaaS revenue model is compatible (SaaS hosting is not "distribution" under GPL-3.0), but no closed-source variants.
