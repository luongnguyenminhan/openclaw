#!/usr/bin/env node

/**
 * Memory Bridge: Vault Query Tool
 * 
 * Query vault notes and search results from the command line.
 * 
 * Usage:
 *   node memory-query.js "search term"
 *   node memory-query.js --moc "topic"        (find MOC by claim-name)
 *   node memory-query.js --learning "error"  (search recent learnings)
 */

const fs = require('fs');
const path = require('path');

// Parse CLI args
const query = process.argv[2] || '';
const args = require('minimist')(process.argv.slice(2));

const vaultRoot = path.join(process.env.WORKSPACE || path.join(process.env.HOME, '.openclaw/workspace'), 'vault');

if (!query && !args.moc && !args.learning) {
  console.log('Usage:');
  console.log('  node memory-query.js "search term"');
  console.log('  node memory-query.js --moc "topic"');
  console.log('  node memory-query.js --learning "error"');
  process.exit(1);
}

/**
 * Search vault files
 */
function searchVault(searchTerm) {
  const results = [];
  
  try {
    const searchDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        if (content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            file,
            path: filePath,
            snippet: content.split('\n').slice(0, 5).join('\n')
          });
        }
      }
    };
    
    // Search all vault subdirectories
    const subdirs = fs.readdirSync(vaultRoot);
    for (const subdir of subdirs) {
      const fullPath = path.join(vaultRoot, subdir);
      if (fs.statSync(fullPath).isDirectory()) {
        searchDir(fullPath);
      }
    }
  } catch (e) {
    console.error(`Error searching vault: ${e.message}`);
  }
  
  return results;
}

/**
 * Find MOC by claim-name
 */
function findMOC(topic) {
  const results = searchVault(topic);
  
  if (results.length === 0) {
    console.log(`No MOCs found for "${topic}"`);
    return;
  }
  
  console.log(`\n📋 MOCs for "${topic}":\n`);
  for (const result of results.slice(0, 5)) {
    console.log(`📄 ${result.file}`);
    console.log(`   Path: ${result.path}`);
    console.log(`   Preview:\n${result.snippet}\n`);
  }
}

/**
 * Search learnings
 */
function searchLearnings(term) {
  const learningsDir = path.join(vaultRoot, '.learnings');
  
  if (!fs.existsSync(learningsDir)) {
    console.log('No learnings directory found');
    return;
  }
  
  const files = ['HOT.md', 'ERRORS.md', 'corrections.md'];
  let found = false;
  
  for (const file of files) {
    const filePath = path.join(learningsDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.toLowerCase().includes(term.toLowerCase())) {
      console.log(`\n📚 Found in ${file}:\n`);
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(term.toLowerCase())) {
          console.log(`  Line ${i + 1}: ${lines[i]}`);
        }
      }
      found = true;
    }
  }
  
  if (!found) {
    console.log(`No learnings found for "${term}"`);
  }
}

// Execute based on flag
if (args.moc) {
  findMOC(args.moc);
} else if (args.learning) {
  searchLearnings(args.learning);
} else {
  findMOC(query);
}
