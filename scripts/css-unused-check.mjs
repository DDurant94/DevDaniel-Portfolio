#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const REPORT_PATH = path.resolve(process.cwd(), 'css-usage-report.json');
const STRICT = process.argv.includes('--strict') || process.env.STRICT_UNUSED_CSS === '1';

// Safelist classes that may be conditionally added at runtime or provided by libraries
// Add to this list if the audit flags a class you know is used dynamically
const SAFE_LIST = new Set([
  // Bootstrap nav/tab classes may be toggled by React/Bootstrap
  'nav', 'nav-tabs', 'nav-link', 'nav-item',
  // Design-system tab wrappers
  'ds-tabs',
  // Utility shells used via string building
  'pressable', 'pressable-edge', 'pressable-glow-outline', 'pressable-glow-inset',
]);

function isSafe(name) {
  if (SAFE_LIST.has(name)) return true;
  // Allow prefix-based utilities if you later add them (example)
  const prefixes = ['btn-variant-', 'btn-size-'];
  return prefixes.some(p => name.startsWith(p));
}

async function main() {
  const raw = await fs.readFile(REPORT_PATH, 'utf8');
  const report = JSON.parse(raw);
  const unused = (report.summary?.unused || []).filter(cls => !isSafe(cls));

  if (unused.length) {
    const msg = `Unused CSS selectors detected (${unused.length}). Example slice: ${JSON.stringify(unused.slice(0, 20))}`;
    if (STRICT) {
      console.error(msg);
      console.error('See css-usage-report.json for full details.');
      process.exit(1);
    } else {
      console.warn(msg);
      console.warn('Non-strict mode: reporting only. Enable --strict to fail CI.');
      process.exit(0);
    }
  } else {
    console.log('Unused CSS audit passed: no unused selectors (after safelist).');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
