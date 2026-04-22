#!/usr/bin/env node

/**
 * Daily Learnings Promotion
 * 
 * Runs during off-hours (e.g., 2 AM daily) to:
 * 1. Read vault/.learnings/HOT.md
 * 2. Promote high-value entries to MEMORY.md (pointer index)
 * 3. Create/update vault/01_thinking/ MOCs with new knowledge
 * 4. Archive processed learnings
 * 
 * Usage:
 *   node learnings-promotion.js [--dry-run]
 *   
 * Cron setup (runs at 2 AM daily):
 *   0 2 * * * cd ~/.openclaw/workspace && node scripts/learnings-promotion.js >> logs/learnings.log 2>&1
 */

const fs = require('fs');
const path = require('path');

const vaultRoot = path.join(process.env.WORKSPACE || path.join(process.env.HOME, '.openclaw/workspace'), 'vault');
const dryRun = process.argv.includes('--dry-run');

const hotFile = path.join(vaultRoot, '.learnings/HOT.md');
const memoryFile = path.join(process.env.WORKSPACE || path.join(process.env.HOME, '.openclaw/workspace'), 'MEMORY.md');
const archiveDir = path.join(vaultRoot, '05_archive');

console.log(`[Learnings Promotion] Started at ${new Date().toISOString()}`);
console.log(`[Learnings Promotion] Dry run: ${dryRun}`);

/**
 * Parse HOT entries
 */
function parseHotLearnings() {
  if (!fs.existsSync(hotFile)) {
    console.log('[Learnings Promotion] No HOT.md file found');
    return [];
  }
  
  const content = fs.readFileSync(hotFile, 'utf-8');
  const lines = content.split('\n');
  const entries = [];
  
  let currentEntry = {};
  for (const line of lines) {
    if (line.match(/^- \[[\sx]\]/)) {
      if (currentEntry.title) {
        entries.push(currentEntry);
      }
      const checked = line.includes('[x]');
      currentEntry = {
        title: line.replace(/^- \[[^\]]*\]\s*/, '').trim(),
        checked,
        timestamp: new Date().toISOString()
      };
    }
  }
  if (currentEntry.title) {
    entries.push(currentEntry);
  }
  
  return entries.filter(e => e.checked);
}

/**
 * Create MOC from entry if it's significant enough
 */
function createOrUpdateMOC(entry) {
  // Only create MOCs for entries with "is" claims (indicates a decision/principle)
  if (!entry.title.includes('is') && !entry.title.includes('are')) {
    return null;
  }
  
  const mocName = entry.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '.md';
  
  const mocPath = path.join(vaultRoot, '01_thinking', mocName);
  
  if (fs.existsSync(mocPath)) {
    // Update existing MOC
    const existing = fs.readFileSync(mocPath, 'utf-8');
    if (!existing.includes(`Updated: ${new Date().toISOString().split('T')[0]}`)) {
      const updated = existing + `\n\nUpdated: ${new Date().toISOString().split('T')[0]}\n`;
      if (!dryRun) fs.writeFileSync(mocPath, updated, 'utf-8');
      return `(updated) ${mocPath}`;
    }
  } else {
    // Create new MOC
    const mocContent = `# ${entry.title}

Created: ${new Date().toISOString().split('T')[0]}

## Key Points
- ${entry.title}

## Connected Topics
(Add wiki-links to related notes here)

## Agent Notes
- [ ] Further exploration needed
`;
    if (!dryRun) fs.writeFileSync(mocPath, mocContent, 'utf-8');
    return `(created) ${mocPath}`;
  }
  
  return null;
}

/**
 * Update MEMORY.md with new pointers
 */
function updateMemoryIndex(entries) {
  if (!fs.existsSync(memoryFile)) {
    console.log('[Learnings Promotion] MEMORY.md not found');
    return;
  }
  
  let memory = fs.readFileSync(memoryFile, 'utf-8');
  
  // Check if there's a "Recent Learnings" section
  if (!memory.includes('## Recent Learnings')) {
    memory += '\n## Recent Learnings\n_(Promoted from daily learning)_\n';
  }
  
  // Add entries as pointers
  for (const entry of entries.slice(0, 3)) {
    const pointer = `- [[${entry.title.toLowerCase().replace(/\s+/g, '-')}]] — ${entry.title}\n`;
    if (!memory.includes(pointer)) {
      memory = memory.replace('## Recent Learnings', `## Recent Learnings\n${pointer}`);
    }
  }
  
  const size = memory.length;
  if (size > 3072) {
    console.log(`[Learnings Promotion] ⚠️  Warning: MEMORY.md is ${size} bytes (limit 3072)`);
    console.log('[Learnings Promotion] Consider moving entries to vault/01_thinking/ MOCs');
  }
  
  if (!dryRun) fs.writeFileSync(memoryFile, memory, 'utf-8');
}

/**
 * Archive processed entries
 */
function archiveProcessed(entries) {
  const archiveName = `learnings-${new Date().toISOString().split('T')[0]}.md`;
  const archivePath = path.join(archiveDir, archiveName);
  
  let archiveContent = `# Learnings Archive — ${new Date().toISOString().split('T')[0]}\n\n`;
  for (const entry of entries) {
    archiveContent += `- [x] ${entry.title}\n`;
  }
  
  if (!dryRun) {
    fs.mkdirSync(archiveDir, { recursive: true });
    fs.writeFileSync(archivePath, archiveContent, 'utf-8');
  }
  
  // Clear HOT.md
  const hotTemplate = `# Hot Insights

Track things worth remembering from this session. These get promoted nightly.

## Format
- [x] Completed learning (checked = promoted)
- [ ] Work in progress

## Entries
`;
  
  if (!dryRun) fs.writeFileSync(hotFile, hotTemplate, 'utf-8');
}

// Main
try {
  console.log('[Learnings Promotion] Parsing HOT.md...');
  const entries = parseHotLearnings();
  
  console.log(`[Learnings Promotion] Found ${entries.length} entries to promote`);
  
  if (entries.length === 0) {
    console.log('[Learnings Promotion] Nothing to do');
    process.exit(0);
  }
  
  console.log('[Learnings Promotion] Creating MOCs...');
  for (const entry of entries) {
    const result = createOrUpdateMOC(entry);
    if (result) console.log(`  ${result}`);
  }
  
  console.log('[Learnings Promotion] Updating MEMORY.md...');
  updateMemoryIndex(entries);
  
  console.log('[Learnings Promotion] Archiving processed entries...');
  archiveProcessed(entries);
  
  console.log(`[Learnings Promotion] ✅ Complete at ${new Date().toISOString()}`);
} catch (e) {
  console.error(`[Learnings Promotion] ❌ Error: ${e.message}`);
  process.exit(1);
}
