# Vault Philosophy

This document explains how to use the vault system effectively. The vault is the knowledge layer — everything important lives here, organized by claim-named notes and connected via wiki-links.

## Five Core Principles

### 1. The Network Is The Knowledge
No single note is the complete answer. The answer is the **path through connected notes**. When answering a question, scan MOCs → read relevant notes → follow wiki-links → synthesize → respond.

### 2. Notes Named As Claims
The filename IS the knowledge. Stop naming files by date or topic category.

**Bad:** `2026-03-19.md`, `research.md`, `local-models.md`  
**Good:** `local-models-are-the-fast-layer.md`, `memory-is-the-bottleneck.md`, `ollama-crashes-on-windows-with-qwen.md`

When you scan a folder, filenames alone tell you what the vault knows.

### 3. Links Woven Into Sentences
Wiki-links create the graph. Use them inline, woven into sentences — not as footnotes or link dumps at the end.

**Bad:**
```
Ollama is good for local embeddings.
See also: [[ollama-setup]], [[embedding-models]], [[gpu-requirements]]
```

**Good:**
```
[[ollama-setup]] supports local [[embedding-models]], but [[ollama-crashes-on-windows]] 
without a proper [[gpu-requirements]] configuration. Use [[qwen3-embedding-4b]] for 32GB+ RAM systems.
```

### 4. Agent Orients Before Acting
Start every session by orienting in the vault:

1. Scan `vault/01_thinking/` — read MOC filenames (instant topic map)
2. If the user message relates to an existing MOC, read it before responding
3. Follow `[[wiki-links]]` from the MOC for deeper context
4. If nothing exists yet, respond and then capture

### 5. Agent Leaves Breadcrumbs
Update MOC "Agent Notes" section after every session. Next session reads the breadcrumbs.

```markdown
## Agent Notes
- [x] Vault restructure completed - 8 MOCs + philosophy doc
- [x] Integrated with LightRAG knowledge graph
- [ ] Add claim-named notes for Ollama Windows crashes (in progress)
```

### 6. Capture First, Structure Later
Don't overthink the vault structure. Dump raw notes in `00_inbox/` now. Organize + link later.

## Folder Meanings

| Folder | Purpose | Files | Update Frequency |
|--------|---------|-------|------------------|
| **00_inbox** | Raw captures, work-in-progress | .md files, unstructured | Daily (dump) |
| **01_thinking** | MOCs + synthesized knowledge | ~8 active MOCs | Per-session (updates) |
| **02_reference** | External knowledge, docs, links | Tool docs, tutorials, papers | As-needed |
| **03_creating** | Content drafts in progress | ~2-3 active drafts | Per-session |
| **04_published** | Finished work + polished notes | Blog posts, guides, decisions | Weekly |
| **05_archive** | Inactive, but never delete | Old projects, resolved decisions | Quarterly review |
| **06_system** | Vault philosophy, templates, index | This file + graph configs | Rarely |
| **.learnings** | Micro-learning logs | ERRORS.md, corrections.md, HOT.md | Every session |

## The Orientation Protocol (Add to AGENTS.md)

```
## Vault Orientation Protocol (Every Session)
1. Scan vault/01_thinking/ MOC filenames — instant topic map
2. If user message matches existing MOC → read it before responding
3. Follow [[wiki-links]] for deeper context
4. New work → capture to vault/00_inbox/ with claim-name
5. At session end: update MOC "Agent Notes" with what was done
```

## Searching the Vault

Use **graph-search** for connected knowledge, **vector-search** for discovery:

```bash
# Find directly connected notes
node scripts/vault-graph/graph-search.mjs "local models"

# Find similar notes (wider net)
memory_search("local models")
```

**Graph search:** Navigate files you know are connected (structure)  
**Vector search:** Discover files you didn't know were relevant (similarity)

Use both.

## MOC Template

Save to `vault/01_thinking/` with a claim-name:

```markdown
# [Claim: This is X]

## Key Facts
- Fact 1
- Fact 2

## Connected Topics
- [[vault/note-a.md]]
- [[vault/note-b.md]]

## Agent Notes
- [x] Topic researched, conclusions recorded
- [ ] Next step (if any)
```

## When to Move Out of 00_inbox

Move a note from `00_inbox/` to permanent folders when:
- It's claim-named (filename = knowledge)
- It has connections to 2+ existing MOCs (at least 1 wiki-link)
- It's either finished work OR reference material you'll reuse

Everything else can stay in inbox for 30 days, then archive.
