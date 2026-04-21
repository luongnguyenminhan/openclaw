# TOOLS.md - Setup Reference

Environment variables (store securely, never commit):

```bash
export CEREBRAS_API_KEY="csk-..."      # Compaction, $0.60/M, 3000 tok/s
export GOOGLE_API_KEY="AIza..."        # Sub-agents, free tier
export ANTHROPIC_API_KEY="sk-ant-..."  # Opus with prompt caching (optional)
```

**Models:**
- **Orchestrator:** `github-copilot/claude-haiku-4.7` (GitHub Copilot default)
- **Compaction:** `cerebras/gpt-oss-120b` (5-10x cheaper than Gemini, no crash loops)
- **Sub-agents:** `gemini/flash-2.5` (free, fast)
- **Prompt cache:** Opus only, `cacheRetention: "extended"` (90% token savings)

**Session rotation:** `rotateBytes: "100mb"` prevents cron bloat.

**Verification:** `grep -A 20 '"models":' ~/.openclaw/openclaw.json`
