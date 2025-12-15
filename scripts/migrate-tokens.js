#!/usr/bin/env node
/**
 * migrate-tokens.js
 * Batch replace legacy raw values in CSS with design token references.
 * Dry-run by default; pass --write to apply edits.
 */

import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src', 'Styles');
const write = process.argv.includes('--write');

/** Ordered replacements (longer / more specific first) */
const replacements = [
  { from: /linear-gradient\(90deg,\s*#0077ff,\s*#00cfff\)/gi, to: 'var(--gradient-brand-horizontal)' },
  { from: /linear-gradient\(to right,\s*#0077ff,\s*#00cfff\)/gi, to: 'var(--gradient-brand-horizontal)' },
  { from: /#005fcc/gi, to: 'var(--color-primary-hover)' },
  { from: /#0077ff/gi, to: 'var(--color-primary)' },
  { from: /#00cfff/gi, to: 'var(--color-accent)' },
  { from: /#ff6b6b/gi, to: 'var(--color-danger)' },
  { from: /#f59e0b/gi, to: 'var(--color-warning)' },
  { from: /#12b886/gi, to: 'var(--color-success)' },
  { from: /#e0e0e0/gi, to: 'var(--color-border-subtle)' },
  { from: /#ccc/gi, to: 'var(--color-border-subtle)' },
  { from: /#333(?![0-9a-fA-F])/gi, to: 'var(--color-text-soft)' },
  { from: /#555/gi, to: 'var(--color-text-mute)' },
  { from: /#666/gi, to: 'var(--color-text-mute)' },
  { from: /#f7f9fc/gi, to: 'var(--color-surface)' },
  { from: /#ffffff(?!d)/gi, to: 'var(--color-bg)' },
  // Accent yellows used maybe in contrast design (skip if already tokenized)
  { from: /#ffcc00/gi, to: 'var(--color-accent, #ffcc00)' },
  { from: /#ffdd44/gi, to: 'var(--color-accent-hover, #ffdd44)' },
];

let filesChanged = 0;
let totalReplacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.css$/i.test(entry.name)) processFile(full);
  }
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  let localCount = 0;
  replacements.forEach(r => {
    content = content.replace(r.from, match => { localCount++; return r.to; });
  });
  if (file.endsWith('RootStyles.css')) return;
  // Suggest replacing heavy multi-layer shadows with elevation alias (non-destructive comment)
  if (/box-shadow:\s*var\(--box-shadow\)/.test(content) && !/elev-/.test(content)) {
    content = content.replace(/box-shadow:\s*var\(--box-shadow\);/g, m => `${m} /* consider: var(--elev-3) for consistency */`);
  }
  if (localCount > 0) {
    filesChanged++;
    totalReplacements += localCount;
    if (write) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[WRITE] ${file} -> ${localCount} replacements.`);
    } else {
      console.log(`[DRY ] ${file} -> would replace ${localCount} occurrence(s).`);
    }
  }
}

walk(root);
console.log(`\nSummary: ${filesChanged} file(s), ${totalReplacements} replacement(s) ${write ? 'applied' : 'found (dry-run)'}\n`);
console.log('Pass --write to apply changes.');
