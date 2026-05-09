# Execution Gate — Mandatory Pre-Work Checklist

**This gate is CONSTITUTIONAL. It cannot be bypassed for any reason, including perceived simplicity.**

## Before ANY Code Edit or File Creation

You MUST explicitly work through this checklist. Not in your head — in your output. If you cannot check a box, you cannot proceed.

### Gate 1: Pipeline Classification

Before writing a single line, declare the task complexity and required pipeline:

| Complexity | Pipeline | Agents Required |
|-----------|----------|-----------------|
| **trivial** (config, typo) | Engineer only | None |
| **simple** (single-file fix) | Engineer → QA | QA |
| **medium** (multi-file feature) | Engineer → Reviewer → QA → Evaluator | All 4 |
| **complex** (cross-system) | Engineer → Reviewer → QA → Evaluator | All 4, max 3 iterations |
| **design** (UI/visual output) | Designer → Evaluator → revision loop → Engineer | Designer + Design Evaluator + full pipeline |

**Write the classification explicitly.** "This is a [complexity] task, pipeline: [X → Y → Z]."

### Gate 2: Internal Briefing (medium+ only)

Before entering the iteration loop:

- [ ] Impact Analysis complete? (files affected, scope)
- [ ] Professional Expansion done? (error states, edge cases, consistency)
- [ ] Test Plan written? (concrete scenarios)
- [ ] Decision Classification done? (HIGH confidence = decide silently, LOW = ask user)

### Gate 3: Design Tasks — No Raw Output to User

For ANY design task (logo, UI component, layout):

- [ ] Designer agent has produced initial output
- [ ] Design Evaluator has reviewed and given feedback
- [ ] Designer has revised based on feedback (at least 1 iteration)
- [ ] Only Evaluator-approved output is presented to user

**NEVER present a first draft to the user.** The user should only see work that has been through at least one evaluate-revise cycle.

### Gate 4: Presentation Check

Before showing ANY work to the user:

- [ ] Has this output been reviewed by the appropriate agent(s)?
- [ ] Am I presenting raw first-pass output or evaluated/refined output?
- [ ] If raw → STOP. Run the review/evaluation first.

## The Speed Trap

The most common failure mode is: "I know the answer, let me just do it quickly."

This is ALWAYS wrong for medium+ tasks. The 2 minutes spent on proper pipeline setup saves the 20 minutes of rework after the user catches the quality gap.

**Proven failures (this project):**
1. Phase 3 component refactor — jumped to Edit without Internal Briefing or agents. User caught it.
2. Logo design — presented raw SVG drafts without Designer → Evaluator loop. User caught it.
3. Both times, the rationalization was "I know what needs to be done." Both times, quality suffered.
