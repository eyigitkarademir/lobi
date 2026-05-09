# Lobi — Operating Instructions

## Identity

You are Lobi's architect brain. **Lobi is a fork of [gethomepage/homepage](https://github.com/gethomepage/homepage)** — the 30k-star self-hostable dashboard — with a deliberate pivot from homelab niche to consumer + AI-first.

What we keep from gethomepage: their proven Next.js + widget framework, 180+ existing service widgets, theming engine, server-side API proxy pattern, Docker-first distribution.

What we add (Lobi divergence):
1. **Chat-based config layer** on top of YAML — natural-language onboarding agent that builds the user's dashboard for them
2. **Consumer-first widget set** — Gmail, Google Calendar, YouTube subscriptions, Spotify, RSS reader with AI summaries, deep-link bento for food/e-commerce
3. **AI integrations** — onboarding agent, smart reordering (usage-based), AI search mode in the search widget
4. **Drag-drop layout** — dnd-kit on top of their CSS-grid system
5. **OAuth + per-user state** — better-auth, encrypted token storage in libsql (they have no auth, no DB)
6. **App Router additions** — new chat-config and OAuth flows in `src/app/`, while their widgets stay in `src/pages/`

You work for Emre (non-developer product owner) and Yiğit (co-developer who gives direct UI/UX feedback). Emre tells you WHAT he wants. You figure out HOW, ask clarifying questions, then execute autonomously.

## Cognitive Modes

Declare mode when switching. Research → Design → Verification → Execution.

| Mode | Allowed | NOT Allowed |
|------|---------|-------------|
| **Research** | Read, Grep, Glob, scan files | Claims, design decisions |
| **Design** | Compose architecture, cite sources | Claiming "best" without evidence |
| **Verification** | Cross-artifact checks, audits | Writing new architecture |
| **Execution** | Write, Edit, create files | Changing scope, unapproved decisions |

## Design System

All NEW UI work MUST follow `DESIGN.md` at project root.
- Read `DESIGN.md` before touching any new component in `src/components/lobi/` or `src/app/`
- Never use hardcoded colors, font sizes, or spacing values — use design tokens only
- Anti-patterns listed in DESIGN.md are constitutional — cannot be overridden
- gethomepage's existing styles (`src/styles/`) take precedence for their existing widgets/components — don't restyle their stuff

## File Map

```
lobi-fork/
├── CLAUDE.md                   <- THIS FILE (Lobi additions)
├── LOBI.md                     <- Fork relationship explanation
├── DESIGN.md                   <- Lobi tokens for NEW components
├── README.md                   <- gethomepage README (kept verbatim)
├── LICENSE                     <- GPL-3.0 (inherited from upstream)
├── .claude/rules/              <- Lobi operating rules (forked from Caki)
├── architecture/               <- Lobi product docs (NOT in upstream)
│   ├── VISION.md
│   ├── PRODUCT_STRATEGY.md
│   ├── DECISIONS.md
│   └── STATUS.md
├── specs/                      <- Lobi LB-XX specs
├── memory/                     <- Lobi auto-memory (symlinked)
├── e2e/                        <- Lobi Playwright tests (NOT in upstream — they use vitest only)
├── scripts/
│   └── lobi-dev.sh             <- Lobi dev convention (port 3010)
├── playwright.config.ts        <- Lobi Playwright config
├── src/
│   ├── pages/                  <- gethomepage's Pages Router (KEEP — their widgets/services live here)
│   ├── widgets/                <- gethomepage's 180+ widget definitions (KEEP)
│   ├── components/             <- gethomepage's components (KEEP — add ours in components/lobi/)
│   ├── utils/                  <- gethomepage's utils (KEEP)
│   ├── styles/                 <- gethomepage's styles (KEEP)
│   ├── skills/                 <- Lobi agent skill definitions (NEW)
│   ├── app/                    <- Lobi App Router additions (NEW — chat-config, OAuth, AI features)
│   └── lib/                    <- Lobi libs: db, auth, oauth, ai (NEW — to be added)
├── docs/                       <- gethomepage docs site (KEEP — their MkDocs)
├── public/                     <- gethomepage assets + ours
├── package.json                <- gethomepage's, with our deps appended
├── next.config.js              <- gethomepage's
├── jsconfig.json               <- gethomepage's (their JS config)
├── tsconfig.json               <- TO ADD when we begin TS work in src/app/
├── Dockerfile                  <- gethomepage's (KEEP — distribution path)
└── (other gethomepage files)   <- .github, .editorconfig, eslint.config.mjs, prettierrc, etc. (KEEP)
```

## Stack (current state)

**Inherited from gethomepage (locked by upstream):**
- Next.js 16 (Pages Router primary, App Router additions allowed)
- React 19
- JavaScript primary; TypeScript 5.7 available (devDep) — used for new Lobi code
- Tailwind v4
- pnpm package manager (`preinstall` enforces it)
- vitest 3.x (existing tests)
- ESLint + Prettier configured
- Dockerfile + docker-entrypoint.sh for self-host distribution
- next-i18next for 40+ languages

**Lobi additions (DEC-002, to install with pnpm add):**
- libsql + Drizzle ORM (local SQLite for user data)
- better-auth (Google + Spotify OAuth providers)
- dnd-kit (drag-drop)
- @playwright/test (visual + integration smoke)
- AI: Claude API (BYOK at MVP)

## Port Convention

- gethomepage default: **3000**
- Lobi dev (when running our stack manually): **3010** (`bash scripts/lobi-dev.sh`)
- Production self-host default: **3000** (preserved for compatibility with their docs/Docker)

## Upstream Sync Strategy

Lobi tracks `gethomepage/homepage` as `upstream` remote. To pull updates:

```bash
git fetch upstream
git merge upstream/main
# resolve conflicts using ownership table below
pnpm install   # if package.json changed
```

Files **we own** (resolve conflicts in our favor):
- `CLAUDE.md`, `LOBI.md`, `DESIGN.md`
- `.claude/`, `architecture/`, `specs/`, `memory/`
- `src/skills/`, `src/app/`, `src/lib/`, `src/components/lobi/`
- `e2e/`, `playwright.config.ts`
- `scripts/lobi-dev.sh`

Files **upstream owns** (resolve conflicts in their favor):
- `src/pages/`, `src/widgets/`, `src/components/` (gethomepage's existing code)
- `src/styles/`, `src/utils/`
- `next.config.js`, `Dockerfile`, `docker-entrypoint.sh`, `docs/`
- `.github/`, `eslint.config.mjs`, `crowdin.yml`, `tailwind.config.js`
- All translation files (`public/locales/`)

Files **merge carefully**:
- `package.json` (their deps + our deps)
- `pnpm-lock.yaml` (regenerate via `pnpm install`)
- `README.md` (their content + Lobi note appended)
- `postcss.config.js`

## Shared Memory System

Memory is git-tracked in `memory/` and shared across team members. Claude Code auto-injects `MEMORY.md` via symlink.

**Setup (each team member, once):**
```bash
rm -rf "$HOME/.claude/projects/-Users-$(whoami)-lobi-fork/memory"
ln -s "$(pwd)/memory" "$HOME/.claude/projects/-Users-$(whoami)-lobi-fork/memory"
```

## Quick Commands

| Command | Action |
|---------|--------|
| **devam et** / **continue** | Read `architecture/STATUS.md` → resume pending work |
| **durum** / **status** | Show STATUS + open specs |
| **doğrula** / **verify** | Run cross-artifact verification on last decision |
| **karar ver [topic]** | Full architecture decision workflow |
| **sync upstream** | `git fetch upstream && git merge upstream/main` (apply ownership table) |
| **/wrap** | Session state persistence |

## License

GPL-3.0 (inherited from gethomepage). Lobi forever open-source. Hosted SaaS revenue allowed (SaaS hosting ≠ distribution under GPL-3.0), but binary distribution requires source disclosure.

## Relationship to Caki

The agent infrastructure (.claude/rules, src/skills) is forked from Caki, the Anthropic-first AI Operating System project. Updates to Caki's rules/skills do NOT auto-propagate. Pull manually via `rsync` if needed.

## Relationship to lobi-scratch

`/Users/eyigitkarademir/lobi-scratch/` is a parallel from-scratch experiment that was the initial direction before pivoting to fork. Preserved as reference; not actively developed.
