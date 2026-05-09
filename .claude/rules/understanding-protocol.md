# Understanding & Execution Gates

## Understanding Protocol

Before executing any significant work (Spec Kit 9-category scan + GSD locked constraints + Superpowers elicitation):

### Step 1: Receive Intent
Emre says what he wants. You figure out how.

### Step 1.5: Context Gap Analysis (ECC 6-phase prompt optimization)
Before scanning categories, ask yourself: "Bu konuda ne bilmiyorum?"

Run through these 4 checks silently:
1. **Project detection** — What kind of task is this? (architecture / implementation / research / bug fix)
2. **Intent detection** — What does Emre actually want? (not what he said — what he MEANS)
3. **Scope assessment** — How big is this? (single file / multi-file / cross-system)
4. **Context gap identification** — What information do I NOT have that I need?

If any gaps are found → these become your first clarifying questions. Do NOT assume gaps away.

### Step 2: Silent 9-Category Scan (Spec Kit clarify taxonomy)
Silently scan all 9 categories against the intent. Do NOT ask about categories that are clear.

| # | Category | What to Check |
|---|----------|--------------|
| 1 | **Scope** | What's in, what's explicitly out? |
| 2 | **Data model** | Which entities affected? New fields/tables? |
| 3 | **UX/UI** | How will users see/use this? Design exists? |
| 4 | **Performance** | Scale concerns? |
| 5 | **Security** | Auth, permissions, data exposure? |
| 6 | **Integrations** | External services affected (Linear, Claude CLI, etc.)? |
| 7 | **Edge cases** | What breaks this? |
| 8 | **Constraints** | Tech stack, timeline, backward compat? |
| 9 | **Terminology** | Any ambiguous terms? |

### Step 3: Ask Clarifying Questions — One at a Time (Superpowers + Gstack)
Ask ONE question per message. Format:

1. **Lead with your recommendation**: "A yapmanızı öneriyorum çünkü [reason]."
2. **Present alternatives as lettered options**: "(A) recommended approach, (B) alternative, (C) alternative"
3. **Wait for answer before asking the next question**

Rules:
- Never batch multiple questions in one message
- Each answer informs the next question (adaptive, not scripted)
- If the answer is obvious from context, skip the question — don't ask what you already know
- Max 5 total questions before presenting understanding summary

### Step 4: Capture Answers as Constraints (GSD 5-category discuss-phase)
Every answer goes into one of 5 categories:

| Category | Meaning | Example |
|----------|---------|---------|
| **Locked** | Emre decided this — agent cannot change without asking | "TypeScript only, no Python" |
| **Discretionary** | Agent can decide within the constraint box | "Choose any state management library" |
| **Canonical References** | Files/docs that downstream agents MUST read | "Read ARCHITECTURE.md before coding" |
| **Specific Ideas** | Emre's implementation preferences (not locked, but preferred) | "I'd like it to look like Notion's sidebar" |
| **Deferred** | Good ideas saved for later — prevents scope creep | "Dark mode is nice but not now" |

### Step 5: Write Understanding Summary (Turkish)
Present to Emre:
```
Hedef: [1-2 cümle]
Locked: [Emre'nin kararları — değiştirilemez]
Discretionary: [Claude'un karar alanı]
Canonical refs: [Okunması gereken dosyalar]
Specific ideas: [Emre'nin tercihleri — zorunlu değil ama preferred]
Deferred: [Şimdi değil, ileride]
Kapsam dışı: [explicit exclusions]
```

### Step 6: Emre Responds
- a) "Correct" / "Tamam" → proceed to spec writing
- b) "X is wrong" → correct, back to step 5
- c) "Also ask about..." → ask more, back to step 3

**Gate is opened by EMRE, not by you. You cannot self-approve understanding.**

### Step 7: Determine CK Number
Linear issue creation is **deprecated** for Caki-product dev work (decision 2026-04-10, see `SESSION_2026-04-10.md:162`). Skip Linear entirely.

Get the next CK number from the filesystem:
```bash
ls specs/CK-*.md | sort -V | tail -1
```
Increment the number. Do not guess, do not ask the user.

**Exception:** Per-project Linear (CK-66 feature — Jack's real projects like aesthetic-explorer linking to their own external Linear workspace) is a separate product feature, not Caki's internal dev tracking. Don't confuse the two.

### Step 8: Write Spec File
Write `specs/CK-XX-topic.md` using the CK number from Step 7, based on `specs/SPEC_TEMPLATE.md`.
The spec is in English. The understanding loop is in Turkish.

## Quality Test (Superpowers)

> "If an enthusiastic junior engineer with poor taste read this spec, could they build the right thing?"

If the answer is no, the spec is not ready. Go back to step 2.

## Design Gate (Superpowers + ECC)

**HARD GATE: Do NOT enter Execution mode until Emre explicitly approves the design.**

This gate cannot be bypassed -- no exception for "obviously correct" designs, no exception for "simple changes." Superpowers: "Do NOT invoke any implementation skill regardless of perceived simplicity."

The Building/Designing workflow enforces this:
1. Research mode -> gather data
2. Design mode -> compose solution, cite sources
3. **Present to Emre for approval -> WAIT** (this is the gate)
4. Emre approves -> Verification mode -> Execution mode
5. Emre rejects/revises -> back to step 2

## Checkpoint Protocol (during execution)

Three checkpoint types for interrupting execution (GSD checkpoint protocol):

| Type | When | In auto-mode | Example |
|------|------|-------------|---------|
| **confirmation** (~90%) | Routine verification needed | Auto-approve + log | "Pattern file updated, looks correct?" |
| **decision** (~9%) | Strategic choice between alternatives | STOP and present options | "Should CEO agent use Gstack's 4-layer or Superpowers' 2-layer review?" |
| **blocker** (~1%) | Cannot proceed without Emre's input | ALWAYS STOP | "This contradicts locked constraint X" |

**Default behavior:** Implementation details are YOUR domain -- handle them silently. Only surface decisions that are STRATEGIC (affect architecture, change locked constraints, or expand scope).
