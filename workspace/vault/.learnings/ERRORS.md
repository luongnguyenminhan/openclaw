# Errors Log

Track tool failures, command crashes, and runtime errors. Identify patterns.

## Format
- Date: YYYY-MM-DD HH:MM
- Tool/command: [what failed]
- Error: [stack trace or message]
- Severity: [LOW | MEDIUM | HIGH]
- Root cause: [why did it fail]
- Workaround: [how to avoid it next time]

## Entries
_(Agent appends after each error)_

## Pattern Analysis
- Memory search timeouts: [count] times
- Ollama disconnects: [count] times
- Context overflows: [count] times
