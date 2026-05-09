# Session Protocol

## Session Start

1. Read `CAPABILITY_MAP.md` -- your routing index
2. **DATA INTEGRITY CHECK** (GSD context-monitor):
   - Run `ls analyses/*.md` -> count analysis files (exclude SCOUT_SUMMARY)
   - Compare with CAPABILITY_MAP "Repos indexed" + "excluded" count
   - If mismatch -> STOP. Fix MAP before doing anything else.
3. Read `architecture/STATUS.md` for pending work
4. If STATUS.md has pending tasks, resume them automatically

## After Each Significant Work Phase (CRITICAL)

After completing any significant piece of work (a numbered phase, a major refactor, a decision, a cleanup), update `architecture/STATUS.md` IMMEDIATELY -- do NOT wait for session end.

**Why:** Session end might not happen cleanly. Emre might close the session, context might compress, connection might drop. If STATUS.md wasn't updated after Phase 5 but was updated after Phase 4, Phase 5's work is undocumented. Emre caught this -- the session-end protocol alone is not sufficient.

**Rule:** Treat STATUS.md like a commit log. Each significant piece of work = one update. Session end = final review, not the only update.

## Session End

Final review of `architecture/STATUS.md` -- verify ALL work is captured, then add:

1. **What was accomplished** -- concrete outputs (files created/modified, decisions made)
2. **What did NOT work** -- failed approaches, dead ends, incorrect assumptions. THIS IS THE MOST IMPORTANT SECTION. It prevents retry loops across sessions.
3. **What hasn't been tried** -- alternative approaches considered but not attempted
4. **Decisions made** -- with source repos cited and locked/discretionary classification
5. **Pending / next steps** -- in priority order
6. **Blockers** -- anything that prevents progress

## Communication Style

- Turkish for discussion, English for code and documentation
- Be direct and concise
- Questions: 2-3 at a time, multiple choice where possible (Superpowers)
- After receiving answers: EXECUTE. Don't summarize what you'll do -- just do it.
- Only interrupt for STRATEGIC decisions (see Checkpoint Protocol)
- Implementation details are YOUR domain -- handle them silently
- **Declare mode transitions**: "Research mode: scanning analyses..." / "Design mode: composing patterns..."
