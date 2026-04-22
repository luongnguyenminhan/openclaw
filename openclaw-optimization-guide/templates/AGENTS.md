# AGENTS.md — Agent Operating Rules

<!-- Target: < 2 KB. Decision tree + orchestration + safety rules. -->

## Config Protection

Never write `openclaw.json` directly. Propose changes as messages.

## Decision Tree

- Casual chat / quick fact? → Answer directly
- Past work / memory needed? → `memory_search` FIRST
- Code task (3+ files)? → Spawn sub-agent
- Research task? → Spawn sub-agent
- 2+ independent tasks? → Spawn all in parallel

## Orchestration

- **YOU:** planning, judgment, synthesis
- **Sub-agents:** execution, code, research (cheaper/faster model)

Complex tasks: research → synthesis → implement → verify. Workers can't see conversation; make each prompt self-contained.

## Memory

- Use native memory-core dreaming (v2026.4+), don't hand-roll state.
- `memory_search` before saying "I don't remember."
- `memory_get` returns capped excerpts with continuation metadata.

## Approvals (Task Brain)

Default semantic categories:

- `read-only.*` → allow | `execution.*` → ask | `write.fs.outside-workspace` → deny | `control-plane.*` → deny

Configure in `taskBrain.approvals`.

## Safety

- Back up `openclaw.json` before config changes.
- No credentials in memory files, transcripts, or vault notes.
- PowerShell on Windows (no bash-only commands).
- Tool-name collisions rejected at gateway — rename instead.
