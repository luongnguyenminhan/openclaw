# Daily Learnings Promotion Setup

This directory contains scripts for automating knowledge promotion from daily learnings to the vault.

## What These Do

### Memory Bridge Scripts
- **preflight-context.js**: Creates CONTEXT.md for coding agents by scanning vault for relevant notes
- **memory-query.js**: CLI tool to search vault notes and recent learnings

### Learnings Promotion
- **learnings-promotion.js**: Runs nightly to promote checked entries from HOT.md to MEMORY.md and vault MOCs

## Installation

### 1. Install Node.js dependencies (if needed)
```bash
npm install minimist  # Used by scripts for CLI arg parsing
```

### 2. Set up cron job for daily learnings promotion

Edit your crontab:
```bash
crontab -e
```

Add this line to run at 2 AM daily:
```
0 2 * * * cd ~/.openclaw/workspace && node scripts/learnings-promotion.js >> logs/learnings.log 2>&1
```

Or every 6 hours:
```
0 */6 * * * cd ~/.openclaw/workspace && node scripts/learnings-promotion.js >> logs/learnings.log 2>&1
```

### 3. Create logs directory
```bash
mkdir -p ~/.openclaw/workspace/logs
```

## Usage

### Generate context for a coding task
```bash
node preflight-context.js --task "Build auth middleware" --workdir ./my-project
```

This creates `./my-project/CONTEXT.md` with relevant vault knowledge.

### Search vault
```bash
# Search all vault
node memory-query.js "local models"

# Find MOCs by claim-name
node memory-query.js --moc "embedding"

# Search recent learnings
node memory-query.js --learning "timeout"
```

### Run learnings promotion manually
```bash
# Dry run (shows what would happen)
node learnings-promotion.js --dry-run

# Actually promote learnings
node learnings-promotion.js
```

## Workflow

1. **During sessions**: Add important learnings to `vault/.learnings/HOT.md` with checkbox `[x]`
2. **After sessions**: Mark learnings as learned with `[x]` in HOT.md
3. **Nightly (cron)**: `learnings-promotion.js` runs, promotes checked entries to MOCs
4. **Before coding tasks**: Run `preflight-context.js` to inject vault context

## Cost

The daily learnings promotion uses a cheap/free model (recommended: Cerebras gpt-oss-120b at $0.60/M) for summarization and MOC creation. Total cost ~$0.01/day.

## Troubleshooting

- **Script not running**: Check crontab logs: `tail -f ~/.openclaw/workspace/logs/learnings.log`
- **MEMORY.md too large**: Remove old entries and they'll be auto-archived to vault/05_archive/
- **Missing context**: Ensure vault/01_thinking/ and vault/02_reference/ have claim-named notes
