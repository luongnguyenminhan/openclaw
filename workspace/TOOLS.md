# TOOLS.md - Setup Reference

Environment variables (store securely, never commit):

```bash
export GOOGLE_API_KEY="AIza..."        # Sub-agents, free tier
export ANTHROPIC_API_KEY="sk-ant-..."  # Opus with prompt caching (optional)
```

**Models:**
- **Orchestrator:** `github-copilot/claude-haiku-4.5` (GitHub Copilot default)
- **Compaction:** `github-copilot/claude-haiku-4.5` (5-10x cheaper than Gemini, no crash loops)
- **Sub-agents:** `gemini-2.5-flash` (free, fast)
- **Prompt cache:** Opus only, `cacheRetention: "extended"` (90% token savings)

**Session rotation:** `rotateBytes: "100mb"` prevents cron bloat.

**Verification:** `grep -A 20 '"models":' ~/.openclaw/openclaw.json`
