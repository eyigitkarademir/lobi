# Verification Protocol

Source: Superpowers (claim verification), GSD (goal-backward verification), Gstack (Step 0 scope challenge), Spec Kit (cross-artifact consistency)

## Before ANY Architecture Decision

**Step 0: Scope Challenge** (Gstack plan-eng-review):
- "What analyses already exist for this topic?"
- "Which repos have I NOT checked?"
- Run: scan ALL analysis YAML headers for the relevant need (not just MAP)

**Step 1: Data Completeness** (GSD discuss-phase):
- List ALL repos with score >=4 for this need
- Verify each is reflected in the relevant pattern file's YAML sources
- If any repo is missing from the pattern -> STOP, integrate it first

**Step 2: Claim Verification** (Superpowers Iron Law):
- Every claim "X is the best for Y" must show:
  - Which repos were checked (ALL, not some)
  - What score each got for this specific need
  - Why X was chosen over alternatives
- If you can't show this -> you haven't verified, don't claim it

**Step 3: Cross-Artifact Consistency** (Spec Kit cross-artifact analyzer):
- MAP routing -> does it point to the right pattern?
- Pattern sources -> do they match analyses?
- Architecture -> does it reference the pattern correctly?
- If any break in the chain -> fix it before proceeding

## After ANY Architecture Decision

**Goal-Backward Verification -- 3 levels** (GSD exists->substantive->wired):

| Level | Question | Failure = |
|-------|----------|-----------|
| EXISTS | Is this decision documented in DECISIONS.md? | Decision will be lost |
| SUBSTANTIVE | Does it cite specific repos/scores, not vague claims? | Decision is a stub, not real |
| WIRED | Is it connected to MAP -> pattern -> analysis chain? | Decision is orphaned, can't be traced |

## Deviation Handling (GSD checkpoint deviation rules)

When something goes wrong during execution:

| Priority | Situation | Action |
|----------|-----------|--------|
| 1 | Verification step fails (cross-artifact inconsistency) | Auto-fix if the fix is mechanical (typo, missing reference). Max 3 attempts, then STOP and report. |
| 2 | Pattern file contradicts analysis data | STOP. Enter Research mode. Read both sources. Fix the pattern, then resume. |
| 3 | Missing data discovered mid-design | STOP. Do NOT proceed with incomplete data. Run Step 0 + Step 1, then resume. |
| 4 | Architecture change needed (contradicts a locked constraint or approved decision) | STOP and present to Emre. Never auto-resolve strategic conflicts. |

**Escalation rule:** After 3 failed auto-fix attempts on any issue, STOP and present the problem to Emre with: what failed, what was tried, recommended next step.
