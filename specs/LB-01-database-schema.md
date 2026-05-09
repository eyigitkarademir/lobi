# LB-01: Database schema + Drizzle setup

## Goal
Set up libsql (local SQLite) + Drizzle ORM with the core schema Lobi needs: users, widgets (per-user, with config blob + position), oauth_tokens (encrypted refresh tokens per provider), usage_events (for smart reordering AI).

## WHY — Business Context
- **Problem:** Without a schema, no widget can persist anything. The grid won't survive refresh.
- **Impact:** Every other LB-* spec depends on this. Pre-req for LB-04 (grid), LB-07 (auth), LB-15 (settings).
- **Without this:** Nothing persists; we're a static demo.

## User Journey
N/A — pure infrastructure spec.

## Locked Constraints
- libsql (local SQLite via @libsql/client) — DEC-002
- Drizzle ORM — DEC-002
- Single-user mode at MVP (one user row, no multi-tenant) — DEC-004
- OAuth tokens MUST be encrypted at rest (AES-GCM with master password)

## Discretionary
- Migration strategy (single bootstrap script vs. drizzle-kit migrations)
- Master password storage (env var? prompt on first run? OS keychain?)
- usage_events retention (30d default? configurable?)

## Read First
- `architecture/DECISIONS.md` — DEC-002 stack, DEC-006 BYOK
- `architecture/VISION.md` — V0.1 promise

## Tables (initial sketch)
```ts
users         (id, created_at, master_password_hash, anthropic_api_key_encrypted, theme_accent, layout_template)
widgets       (id, user_id, type, config_json, x, y, w, h, created_at, updated_at)
oauth_tokens  (id, user_id, provider, access_token_encrypted, refresh_token_encrypted, expires_at, scope)
usage_events  (id, user_id, widget_id, event, occurred_at)  -- for smart reordering
```

## Verification Checklist
- [ ] `npm run db:init` creates lobi.db with all 4 tables
- [ ] Drizzle types are correctly inferred from schema
- [ ] Insert + select round-trip works for each table (vitest)
- [ ] Encryption helper round-trips a token (AES-GCM)
- [ ] DB file is `.gitignore`d

## Phase 1: Schema
- [ ] `src/lib/db/schema.ts`
- [ ] `src/lib/db/client.ts` (libsql client + Drizzle init)
- [ ] `src/lib/db/encryption.ts` (AES-GCM wrap/unwrap)

## Phase 2: Migrations
- [ ] `drizzle.config.ts`
- [ ] `npm run db:generate` and `db:migrate` scripts
- [ ] Initial migration committed

## Phase 3: Tests
- [ ] `src/lib/db/db.test.ts` — round-trip per table
- [ ] `src/lib/db/encryption.test.ts`

## Verification
- [ ] `npm run test` green
- [ ] `npm run db:init && sqlite3 lobi.db ".schema"` shows expected tables

## Agent Config
- **Autonomy:** full-auto
- **Model:** sonnet
- **Escalation:** 3 failed attempts → ask Emre
