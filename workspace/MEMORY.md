# MEMORY.md — Curated Knowledge Index

**[TIER: CURATED SUMMARY — Injected every message. Target <3 KB. Pure index only.]**  
*Durable facts, promoted from daily logs via memory-core dreaming. Human reads this, agent reads rarely (mostly via memory_search).*

## Identity
- OpenClaw Agent @ 2026.4.15 stable. Owner: [your-name]. Workspace: `/home/anlnm/.openclaw/workspace`.

## Active Projects
_(pointer to vault/01_thinking/... or vault/projects/...)_
- Example: `[[project-slug]]` → `vault/projects/project-slug.md`

## Recent Decisions
_(pointer to vault/learnings/... or vault/02_reference/...)_
- Example: `[[decision-on-architecture]]` → `vault/learnings/decision-on-architecture.md`

## Key Infrastructure
- Primary model: `github-copilot/claude-haiku-4.7` (main orchestrator, see TOOLS.md)
- Compaction: `cerebras/gpt-oss-120b` (Opus-grade reasoning, 5-10x cheaper than Gemini, no crash loops)
- Sub-agents: `gemini/flash-2.5` (free tier, 3000+ tok/s)
- Embedding: `ollama/qwen3-embedding:0.6b` (local, <100ms)
- Prompt caching: enabled on Opus (`cacheRetention: "extended"`)
- Task Brain: enabled, semantic approval categories
- Cron session rotation: `rotateBytes: "100mb"` (prevents unbounded session growth)
- Vault root: `./vault` (raw sources, searched on demand)

## Key Rules
- Always search memory before claiming "I don't remember".
- Backup `openclaw.json` before any config change.
- Details live in `vault/` — **this file is an index only**.
- Dream consolidation runs nightly via memory-core (built-in).
- Credentials: env vars only, never in files or memory.
- **Orchestration:** Delegate heavy work to sub-agents. You plan; workers execute.
- **Verification:** Re-read the original request before finishing. Run real tests, not just re-reads.

---

**LLM Wiki Pattern (Part 31):**  
This file is **TIER 2 (Curated Summary)**. It's human-written, auto-promoted from daily logs via dreaming, and injected on every message. See [WIKI.md](./WIKI.md) for the full three-tier model.
