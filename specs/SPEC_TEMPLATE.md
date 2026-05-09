# LB-XX: [Title]
<!-- File naming: `LB-XX-topic.md`. No Linear — get the next number from `ls specs/LB-*.md | sort -V | tail -1` and increment. -->

## Goal
[What will be done and WHY — 2-3 sentences]

## WHY — Business Context
- **Problem:** [What user pain or business gap does this solve?]
- **Impact:** [What changes for the user when this is done?]
- **Without this:** [What happens if we DON'T build it?]

## User Journey
1. **Entry:** [How does the user discover/access this feature?]
2. **Interaction:** [What does the user do?]
3. **Result:** [What does the user see/get?]
4. **Edge paths:** [What if user cancels? Goes back? Has no data? Has too much data?]

## Locked Constraints
- [Emre's decisions — agent cannot change these]
- [Tech stack constraints]
- [Out of scope — explicit exclusions]

## Discretionary
- [Implementation details Claude/agent chooses]

## Read First
- `path/to/file.ts` — [why this file matters]
- `specs/LB-YY-dependency.md` — [prior dependency context]

## Design / Reference
[Wireframes, design tokens references, architecture diagrams]

## State Machine (REQUIRED for UI tasks)
| State | Description | Entry trigger | Exit transitions |
|-------|-------------|---------------|-----------------|
| A | [e.g. Empty — no widgets] | [App load] | A→B: [add widget] |
| B | [e.g. Widgets visible] | [Add action] | B→A: [remove all] |

**For each transition:**
- What visual change happens?
- Can the user reverse this? How?
- What state is preserved/lost?

## Edge Case Checklist (REQUIRED for UI tasks)
- [ ] Every closeable thing can be reopened
- [ ] z-index layers don't block interactive elements
- [ ] Layout works without horizontal scroll at 1440px and 1024px
- [ ] All interactive elements have hover + title/aria for accessibility
- [ ] Empty / loading / error / success states handled

## Verification Checklist (REQUIRED — written BEFORE coding starts)
- [ ] [Specific observable behavior]
- [ ] [Edge case]
- [ ] [Professional default — loading state]
- [ ] [Professional default — error state]

## Affected Files
- `path/to/file.ts` — [what changes here and why]

## Checklist
### Phase 1: [Infrastructure]
- [ ] [Concrete step + file path]

### Phase 2: [Core]
- [ ] [Concrete step + file path]

### Phase 3: [Visual QA Gate — HARD BLOCK]
- [ ] Screenshot every state in the State Machine
- [ ] Verify every transition works
- [ ] Edge case checklist passed

### Phase 4: [Tests]
- [ ] [Test path + scenario]

## Verification
- [ ] [Automated test/command — under 60 seconds]
- [ ] [Observable done condition]
- [ ] Visual QA screenshots reviewed

## Agent Config
- **Autonomy:** [full-auto | checkpoint-at-phase | every-step-approval]
- **Model:** [haiku | sonnet | opus]
- **Escalation:** 3 failed attempts → ask Emre
