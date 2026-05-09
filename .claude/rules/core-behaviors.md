# Core Behaviors

## Repo Analysis (triggered by: "analyze", "analiz et", "repo", or GitHub URLs/repo names)

1. Read `ANALYSIS_TEMPLATE.md`
2. Spawn subagents in parallel (max 3 concurrent, pass file paths not contents)
3. When complete, read YAML headers (~30 lines each)
4. **IMMEDIATELY** update `CAPABILITY_MAP.md` -- never leave analyses unintegrated
5. **IMMEDIATELY** update relevant `patterns/*.md` files -- add to YAML sources + sub-topic map
6. Run **Cross-Artifact Consistency** check after integration
7. Report summary to user

## Video Analysis (triggered by: YouTube URLs, "video analiz et")

1. Run `scripts/fetch-transcript.sh <url>` to get transcript + metadata
2. Read `VIDEO_ANALYSIS_TEMPLATE.md`
3. Spawn subagent with transcript file path + template
4. Output goes to `analyses/videos/<video-id>.md`
5. Integrate insights into relevant pattern files (add to YAML sources with `[video]` tag)
6. Report summary to user — highlight "new ideas not in existing analyses"

**Key difference from repos:** Video claims are classified as proven/experience/speculative. Only proven claims get weight in architecture decisions.

## X/Twitter Analysis (triggered by: X/Twitter URLs, tweet links)

1. Run `scripts/fetch-tweet.sh <url>` to get tweet content + thread
2. If tweet contains GitHub repo links → offer to run full repo analysis
3. If tweet contains ideas/insights → quick analysis against 12 core needs (no full template needed for single tweets)
4. For tweet threads or long-form content → use VIDEO_ANALYSIS_TEMPLATE.md adapted for text
5. Output goes to `analyses/tweets/<tweet-id>.md` (only for substantial content worth preserving)

## Building / Designing (triggered by: "build", "design", "create", "implement")

1. Enter **Research mode** -> Run Verification Step 0 + Step 1
2. Enter **Design mode** -> Read MAP + patterns, compose solution
3. **Show your work**: for each design choice, cite `[repo: score]` (GSD REQ-ID traceability)
4. **DESIGN GATE**: Present to Emre for approval -> WAIT. Do NOT proceed without approval.
5. **INTEGRATION TEST GATE**: Before wiring any external tool/CLI/API to the system:
   - Test the raw command/API manually
   - Test the spawn/call in a standalone script (e.g., `node -e`)
   - Verify output format matches parser assumptions
   - THEN build the wrapper and connect to UI
   (Proven failure: v1 MVP session — 3 bugs from untested Claude CLI assumptions)
6. Enter **Verification mode** -> Run Goal-Backward Verification (3 levels)
7. Enter **Execution mode** -> implement using the **Evaluator Loop Pipeline**

## Evaluator Loop Pipeline (CK-56 — triggered during Execution mode)

Source: Anthropic "Harness Design for Long-Running Apps" — GAN-inspired generator-evaluator pattern.

### Complexity-Adaptive Pipeline Selection

Before starting, determine task complexity (from spec's effort estimate or Planner output):

| Complexity | Pipeline | Max Iterations |
|-----------|----------|----------------|
| **trivial** (config, typo, single-line fix) | Engineer only | 0 |
| **simple** (single-file bug fix, minor feature) | Engineer → QA | 0 |
| **medium** (multi-file feature, UI component) | Engineer → Reviewer → QA → Evaluator | 2 |
| **complex** (multi-phase, cross-system) | Engineer → Reviewer → QA → Evaluator | 3 |
| **design** (UI/UX heavy, visual output) | Designer → Engineer → Reviewer → QA → Evaluator + Design Evaluator | General: 2, Design: 5 |

### Internal Briefing (MANDATORY before coding — the "agency huddle")

After spec is approved by Emre, BEFORE entering the iteration loop:

```
INTERNAL BRIEFING (Emre is NOT involved — agents decide professionally):

  Step 1: Impact Analysis (Planner or Engineer subagent)
    - Grep codebase for all files related to the feature area
    - List EVERY file that needs modification
    - Write to spec's "Affected Files" section
    - If >8 files affected → flag complexity, consider splitting

  Step 2: Professional Expansion (Engineer subagent)
    - Read spec's User Journey → identify ALL states the feature touches
    - Add professional defaults that spec didn't mention:
      * Error states, loading states, empty states
      * State persistence (refresh, navigation)
      * Consistency across all views (not just the obvious one)
      * Edge cases (concurrent actions, rapid clicks, network failure)
    - Write expanded items to spec's "Verification Checklist"

  Step 3: Test Plan (QA subagent)
    - Read Verification Checklist → write concrete test scenarios
    - Each scenario: precondition → action → expected result
    - Include negative tests (what should NOT happen)
    - Append to spec's "Verification Checklist" if QA finds gaps

  Step 3.5: Design Direction (only for complexity=design — Designer subagent)
    - Read spec's Style DNA / visual references / anti-patterns
    - Scan existing components for reuse (Glob src/components/)
    - Produce initial HTML+Tailwind prototype(s)
    - Save to spec file's "Design Prototype" section
    - This prototype goes to Emre for approval BEFORE iteration loop starts

  Step 4: Decision Classification
    - For each decision surfaced during Steps 1-3:
      * HIGH confidence + professional standard → decide silently
        (e.g., "write tests" → yes, "handle errors" → yes)
      * HIGH confidence + derivable from Emre's input → decide silently
        (e.g., Emre said "10K users" → use proper caching)
      * LOW confidence + information gap → route to Emre
        (e.g., "these two user flows conflict — which is priority?")
    - Only LOW confidence questions go to Emre. Everything else is
      the team's professional responsibility.

  Output: Updated spec with Verification Checklist + Affected Files filled in.
  Gate: If LOW confidence questions exist → ask Emre before proceeding.
        If none → proceed directly to iteration loop.
```

### Pipeline Execution

```
iteration = 0

DESIGN PHASE (only for complexity=design):
  0. Spawn Designer subagent (with spec + designer.md as persona)
     - Designer reads codebase (globals.css, existing components, design tokens)
     - Produces HTML+Tailwind prototype(s) — saved to spec or temp file
     - Present prototype to Emre for approval
     - If approved → prototype becomes Engineer's visual reference
     - If rejected → Designer iterates (max 3 rounds, then escalate)
     - Designer is READ-ONLY: no Edit/Write on src/ files

LOOP:
  1. Spawn Engineer subagent (with spec + approved design + evaluator feedback if iteration > 0)
  2. Spawn Reviewer subagent
     - If CRITICAL findings → Spawn Engineer to fix → Reviewer again (max 2 inner loops)
     - If PASS → continue
  3. Spawn QA subagent (with Playwright MCP — tests running app)
     - If bugs found → Spawn Engineer to fix → QA again (max 2 inner loops)
     - If PASS → continue
  4. Spawn Evaluator subagent (with Playwright MCP — product quality gate)
     - If "SHIP READY" → exit loop, present to Emre
     - If "ITERATE" → save evaluator feedback, iteration++, go to LOOP
     - If "BLOCKED" (no dev server) → skip evaluator, present to Emre with QA report only
  5. Spawn Design Evaluator (only for complexity=design)
     - If visual issues found → Spawn Designer to revise prototype → Engineer updates → back to step 2
     - If "PASS" → continue to Evaluator verdict

  BLOCKED TRIGGERS (exit loop immediately):
  - Dev server not running (connection refused)
  - Playwright browser launch fails (Chromium not found, launch timeout)
  - Any MCP tool returns "Error: ### Error" on first attempt
  - Max 1 retry for browser errors — if second attempt fails, BLOCKED

  If iteration >= max_iterations:
     → Present to Emre with evaluator's last report
     → Note: "Bu kadar iyileştirebildim, şu noktalar kaldı: [evaluator feedback]"
```

### Key Rules
- Each agent runs in a **separate subagent** (fresh context, no shared state)
- Communication is via **files** (spec, code, review findings, evaluator report)
- Engineer reads evaluator feedback from previous iteration as FIRST step
- Evaluator feedback must be **specific** (file:line + what to fix), not vague
- Never skip Reviewer for medium+ tasks — code quality matters even in loops
- If dev server is not running, evaluator is skipped (QA automated checks still run)
- **Prerequisite check before Playwright pipeline:** Verify `npx playwright install chromium` has been run. If browser binary missing → BLOCKED, do not enter loop.
- **Browser errors are non-retryable:** Chromium not found, launch timeout, MCP connection failure → BLOCKED after max 1 retry. Never infinite loop on infrastructure errors.
- **Designer is read-only:** Designer subagent uses `designer.md` as persona. It reads codebase (globals.css, components, tokens) but NEVER writes to `src/`. Its output is HTML+Tailwind prototypes saved to spec files. Engineer translates prototypes to production React code.
- **Design Evaluator → Designer feedback loop:** When Design Evaluator flags visual issues during iteration, feedback goes to Designer first (for revised prototype), then to Engineer (for implementation). Designer doesn't talk to Engineer directly — communication is via updated prototype in spec file.

## Pre-Commit Smoke Test (MANDATORY — no exceptions)

Before EVERY commit that touches `src/`, run this sequence. Build pass alone is NOT sufficient — proven failure: CSS 404 caused fully broken page, build passed, curl returned 200, but zero styles loaded.

```
1. Ensure dev server is running on :3003
2. npx playwright test e2e/smoke.spec.ts   ← MUST PASS before commit
3. If smoke fails → fix first, then commit
```

If Playwright is not available (browser binary missing), run the manual fallback:
```
1. curl homepage → extract CSS URL from HTML → curl CSS URL → must return 200 + size > 1000
2. curl /api/action-items → must return valid JSON array
3. If either fails → do NOT commit, fix first
```

**Rule:** NEVER say "temiz" or "build geçti" based only on `npm run build` or `curl` status code. The page must actually render with styles.

## Architecture Decisions (triggered by: "should we", "which approach", "how should", "karar ver")

1. Enter **Research mode** -> Run Step 0: "What have I NOT checked?"
2. Read MAP + pattern + scan ALL analyses YAML headers for the need
3. **List ALL repos with score >=3** -- not just the top ones
4. Enter **Design mode** -> Present trade-offs with recommendation
5. Reference repos with scores: "Symphony (5/5), Paperclip (4/5), I recommend X because..."
6. Enter **Verification mode** -> Goal-Backward Verification before finalizing
7. Save decision to `architecture/DECISIONS.md` using the Decision Record format

## Decision Record Format (for DECISIONS.md)

Each decision follows this structure:

```
### DEC-NNN: [Topic]
- **Date:** YYYY-MM-DD
- **Status:** proposed | approved | superseded
- **Alternatives Checked:**
  - [Repo A] (score/5): [what it offers]
  - [Repo B] (score/5): [what it offers]
  - ...
- **Decision:** [What was decided]
- **Rationale:** [Why this over alternatives]
- **Locked by:** Emre | Claude (discretionary)
- **Traces to:** [MAP need] -> [pattern file] -> [analysis files]
```

## Confidence Signal Protocol

Every recommendation, claim, or decision MUST include a confidence signal. This is non-negotiable — Emre is a non-developer and cannot independently verify technical claims.

| Signal | Label | Meaning | When to Use |
|--------|-------|---------|-------------|
| **[Doğrulandı]** | Verified | Multiple sources confirm, data exists | Checked 2+ repos/analyses, cross-referenced |
| **[Güçlü tahmin]** | Strong inference | One source + logical reasoning | Seen in one repo, extrapolated with reasoning |
| **[Spekülasyon]** | Speculation | Experience-based guess, unverified | No direct source, based on general knowledge |

**Rules:**
- Default is **[Spekülasyon]** — you must EARN higher confidence by showing sources
- Mixing levels is fine: "X is true [Doğrulandı] but Y might follow [Spekülasyon]"
- If Emre asks "emin misin?" and you're not [Doğrulandı], say so immediately — do not defend
- Architecture decisions require [Doğrulandı] level — if you can't reach it, flag the gap

## Freshness Protocol

- Pattern files and analyses are snapshots from a specific date (check YAML `last_synthesized`)
- If Emre mentions upstream repo changes or new versions -> trigger re-analysis
- If a design decision relies on a repo capability -> verify the capability still exists in the repo
- Re-check triggers are listed in each pattern file's Freshness section
