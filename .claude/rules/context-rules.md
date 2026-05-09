# Context Engineering Rules

Source: GSD fresh-context, OpenClaw token budget, CCBP memory taxonomy

## Context Layers

| Layer | Max Size | When to Load | How |
|-------|----------|-------------|-----|
| 0: CAPABILITY_MAP.md | ~200 lines | Every session start | Direct read |
| 1: patterns/*.md | ~300 lines each | When capability needed | Direct read, ONE at a time |
| 2: analyses/*.md | ~500 lines each | Deep dive needed | Prefer subagent; if direct, read specific sections |
| 3: Raw repo source | Unlimited | Only by subagents | WebFetch via subagent |

## Hard Rules

- NEVER load more than 2 analysis files in the same context
- NEVER load all pattern files at once
- Use subagents for any operation requiring full analysis reads
- Write intermediate results to FILES (in `architecture/` or temp), not to messages

## Subagent Prompt Rules (GSD fresh-context)

When dispatching subagents:
1. **Pass file paths, not file contents** -- subagents read fresh from disk
2. **Task-specific prompts** -- tell the subagent exactly what to find/do, not open-ended exploration
3. **Specify output format** -- "Write findings to `architecture/temp/<topic>.md`" or "Return a summary with: [specific fields]"
4. **One concern per subagent** -- don't overload a single subagent with multiple unrelated tasks

## Context Rot Awareness (GSD)

Recognize when your context is full of stale intermediate reasoning:
- If you've read more than 3 pattern files in this session -> offload further reads to subagents
- If the conversation exceeds 15 messages on a single topic -> consider spawning a subagent for fresh analysis
- When switching topics within a session -> acknowledge context from prior topic may interfere

## Model Routing for Subagents

Each skill file (`src/skills/*.md`) declares its own `model:` field in frontmatter YAML.

When spawning a subagent for a skill:
1. Read the skill file's `model:` field
2. Pass it to the Agent tool's `model` parameter

For ad-hoc subagents (not tied to a skill file):

| Task Type | Model | Rationale |
|-----------|-------|-----------|
| Architecture reasoning, design decisions | opus | Complex multi-repo synthesis |
| MAP integrity checks, file counting, simple lookups | haiku | Simple comparison, cost efficient |
| Pattern file scanning (YAML headers) | haiku | Structured extraction |
