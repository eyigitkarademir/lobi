# Anti-Rationalization Rules (CONSTITUTIONAL)

These rules are **constitutional** (Spec Kit constitution pattern) -- you cannot override them even if you think it's justified.

## Amendment Process (Spec Kit MAJOR/MINOR/PATCH)

Changing these rules requires:
1. Explicit discussion with Emre
2. Classification of the change:
   - **MAJOR** -- new principles that change fundamental direction
   - **MINOR** -- refinements to existing principles
   - **PATCH** -- clarifications that don't change meaning
3. Documentation in DECISIONS.md with rationale

Current version: **v0.2** (refactored from v0.1 monolith into modular rules)

## Temptation Table (Superpowers + Caki v0 proven failures)

| Your Temptation | Why It's Wrong | What To Do Instead |
|----------------|---------------|-------------------|
| "I already know which repo is best" | You said this about Paperclip's CEO. Gstack had a better model. | Scan ALL analyses for the relevant need. |
| "The MAP has everything" | MAP was missing 4 repos. You didn't notice. | Cross-check MAP count against `ls analyses/` every session. |
| "This is too simple to verify" | Simple assumptions compound into wrong architectures. | Verify anyway. 30 seconds saves hours. |
| "I'll integrate this analysis later" | Later never comes. 4 unintegrated analyses proved this. | Integrate IMMEDIATELY. |
| "I checked the pattern file" | Pattern file was missing 4 repos AND Spec Kit. | Check pattern AND scan analyses YAML headers. |
| "I can answer without reading the source" | You presented trade-offs on CEO design without reading Gstack. | Read source data first, form opinion after. |
| "The index says it's superseded" | Index labels are claims, not facts. 2 "superseded" memory files had unique data not in analyses/. Recommended deletion without checking -- Emre caught it. | Read the actual content before recommending deletion or deprecation. Labels describe intent, not reality. |
| "I'll update STATUS.md at session end" | Session end might not happen. Phase 5 work was undocumented until Emre asked. If he hadn't asked, closing the session would have lost the record. | Update STATUS.md after EACH significant work phase, not just at session end. |
| "I'll update memory/docs later" | You won't. v1 MVP session: 3 bugs fixed, lesson learned, but memory + STATUS + rules not updated until Emre said "atladın gibi hissediyorum." The work phase was done, the lesson was clear, but you moved on without documenting. | After any significant work phase OR lesson learned: update STATUS.md, write relevant memory, AND update rules if the lesson changes workflow. All three. Immediately. Don't wait to be asked. |
| "I know how this CLI works" | You assumed Claude CLI's stream-json output format, stdin behavior, and event structure without testing. 3 cascading bugs. | Test external integrations in isolation BEFORE wiring them. A 30-second `node -e` test would have caught all 3 bugs. |
| "I know what to do, let me just do it quickly" | You skipped Internal Briefing for Phase 3 refactor AND skipped Designer→Evaluator loop for logo design. Both times Yiğit caught it. Both times trust was damaged. The rationalization was speed — the cost was quality and credibility. | ALWAYS run the full pipeline for medium+ tasks. ALWAYS run at least 1 evaluate-revise cycle for design tasks. Read `execution-gate.md` checklist BEFORE any edit. 2 minutes of pipeline setup saves 20 minutes of rework. |

## The 1% Rule (Superpowers)

If there is even a 1% chance that an unchecked repo has relevant data, you MUST check it before making a claim.
