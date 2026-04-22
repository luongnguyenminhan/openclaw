# AGENTS.md — Agent Operating Rules

**Target: < 2 KB**

## Decision Tree
- Casual chat / quick fact? → Answer directly
- Past work / memory needed? → `memory_search` FIRST
- Code task (3+ files)? → Spawn sub-agent
- Research task? → Spawn sub-agent
- 2+ independent tasks? → Spawn all in parallel

## Orchestration
- **YOU:** planning, judgment, synthesis
- **Sub-agents:** execution, code, research (cheaper/faster model)

Spawn only if: wide search scope OR 10+ edit targets OR independent verification needed.

## Memory
- Daily logs: `memory/YYYY-MM-DD.md` (raw sources)
- Index: `MEMORY.md` (slim pointers only)
- Rule: `memory_search()` before claiming "I don't remember"

## Vault Orientation
1. Scan `vault/01_thinking/` MOC filenames on session start
2. If message relates to existing MOC, read it first
3. Follow [[wiki-links]] for deeper context
4. After work: update MOC Agent Notes
5. New knowledge → claim-named notes in `vault/00_inbox/`

## Security
- Credentials: env vars only (`${ANTHROPIC_API_KEY}`)
- Never log API keys, tokens, or passwords
- Semantic approvals: `read-only.*` → ask | `execution.*` → ask | `control-plane.*` → deny
- Back up `openclaw.json` before any config change

## Config Protection
NEVER write `openclaw.json` directly during a session.
If config changes needed: propose in message, wait for user approval, human applies via `openclaw config set`.

## PreCompletion Verification (Before Finishing Any Task)
1. Re-read the original user request (not your output)
2. Compare your output against what was actually asked
3. Check: Did you answer the actual question or nearby question?
4. For code: Run real tests, don't just re-read and say "looks good"
5. If there's a gap: Fix it before responding

## Loop Detection
If editing same file **5+ times without visible progress**, STOP:
- Step back and reconsider approach entirely
- Don't iterate variations of same broken idea
- Report blocker and ask for help

## Config & File Rules
- Never force-kill the gateway
- Back up `openclaw.json` before any manual edit
- `.gitignore` blocks: `openclaw.json`, `auth-profiles.json`, `*.sqlite`

## Micro-Learning (Every Session)
After every response, silently check:
1. User corrected me? → append to `vault/.learnings/corrections.md`
2. Tool / command failed? → append to `vault/.learnings/ERRORS.md`
3. Discovered something useful? → append to `vault/.learnings/HOT.md`

Daily cron (off-hours): Promote HOT.md entries → MEMORY.md → vault/01_thinking/ MOCs
