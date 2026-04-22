# Gateway Crash-Loop Prevention

## The Problem (Pre-2026.4.15)
Gateway process crashes could leave stale PID files, causing immediate restart crashes when trying to bind to the same port.

## The Fix (2026.4.15+)

### On Linux/macOS
Before starting the gateway, clean up stale PIDs:
```bash
rm -f /tmp/openclaw-gateway.pid
pkill -f "openclaw.*gateway" || true
```

Add this to your startup script:
```bash
#!/bin/bash
set -e

# Kill stale gateway processes
pkill -f "openclaw.*gateway" || true
sleep 1

# Clean PID file
rm -f /tmp/openclaw-gateway.pid

# Start gateway
openclaw gateway start
```

### On Windows (gateway.cmd)
```batch
@echo off
REM Kill stale processes
taskkill /IM node.exe /F 2>nul || echo No processes to kill
timeout /t 2 /nobreak

REM Clean stale PID files
for /f "delims=" %%i in ('dir /s /b "%APPDATA%\OpenClaw\*.pid" 2^>nul') do del "%%i" 2>nul

REM Start gateway with clean environment
openclaw gateway start
```

### Manual Recovery
If gateway is stuck in restart loop:

```bash
# 1. Kill all openclaw processes
pkill -9 -f openclaw || true

# 2. Clean all state files
rm -f ~/.openclaw/gateway*.pid
rm -f /tmp/openclaw-*.pid
rm -rf ~/.openclaw/flows/registry.sqlite-*

# 3. Restart
openclaw gateway start
```

## Prevention in Code
AGENTS.md rule:
- Never force-kill the gateway (`kill -9`)
- Use `openclaw gateway stop` instead
- Let the gateway shut down gracefully

If the gateway must be killed: clean PIDs before restart.

## Reference
- Part 15: Infrastructure Hardening
- Tested on 2026.4.15 stable (April 16, 2026)
