#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

// Config
const ROOT = path.resolve(process.cwd(), 'src');
const STYLES_DIR = path.join(ROOT, 'Styles');
const OUTPUT_FILE = path.resolve(process.cwd(), 'css-usage-report.json');
const CODE_EXTENSIONS = new Set(['.jsx', '.js', '.tsx', '.ts', '.html']);
const CSS_CLASS_REGEX = /\.(?:[a-zA-Z0-9_-]+)(?=[\s{.,:#>])/g; // simple class selector (single segment) heuristic

// Heuristic filters to drop false positives that look like values accidentally matched
function isLikelyValueToken(cls) {
  // Starts with a digit (e.g. 5rem, 35s, 3px, 45rem)
  if (/^\d/.test(cls)) return true;
  // Pure timing / unit pattern (e.g. 3s, 35s, 01ms)
  if (/^\d+(ms|s)$/.test(cls)) return true;
  // Dimension tokens (e.g. 5rem, 45rem, 3px, 9rem, 8vw)
  if (/^\d+(px|rem|vw|vh|%)$/.test(cls)) return true;
  // Mixed number + unit without letters beyond unit (e.g. 35rem, 85rem)
  if (/^\d{1,3}(rem|px|vw|vh)$/.test(cls)) return true;
  // Lone short fragments likely from gradients or parsing artifacts (e.g. g)
  if (cls.length === 1 && cls !== 'x') return true;
  // Avoid capturing common CSS property-like tokens that slipped (e.g. css)
  if (['css','left','right','g'].includes(cls) && cls.length <= 5) return false; // keep directional state if used
  return false;
}

async function walk(dir, filterExts = null) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(full, filterExts));
    } else {
      if (!filterExts || filterExts.has(path.extname(e.name))) {
        files.push(full);
      }
    }
  }
  return files;
}

async function collectCssClasses() {
  const cssFiles = await walk(STYLES_DIR, new Set(['.css']));
  const map = {}; // file -> Set(classes)
  const globalSet = new Set();

  for (const file of cssFiles) {
    const text = await fs.readFile(file, 'utf8');
    const localSet = new Set();
    const matches = text.match(CSS_CLASS_REGEX) || [];
    for (const raw of matches) {
      const cls = raw.slice(1); // drop leading dot
      if (cls.startsWith('dark:')) continue; // skip any variant prefix patterns just in case
      if (cls.includes(':')) continue; // pseudo states
      if (isLikelyValueToken(cls)) continue; // discard value-like tokens
      localSet.add(cls);
      globalSet.add(cls);
    }
    map[file] = Array.from(localSet).sort();
  }
  return { cssFiles, fileToClasses: map, allClasses: Array.from(globalSet).sort() };
}

async function buildCodeIndex() {
  const codeFiles = await walk(ROOT);
  return codeFiles.filter(f => CODE_EXTENSIONS.has(path.extname(f)));
}

function countOccurrences(content, className) {
  // Match className as a whole word inside className attributes or className concatenations
  const pattern = new RegExp(`(^|["'\\s` + '`' + `])${className}(?=["'\\s` + '`' + `])`, 'g');
  return (content.match(pattern) || []).length;
}

async function scanUsage(classes, codeFiles) {
  const usage = {}; // class -> {count, files:Set}
  for (const cls of classes) {
    usage[cls] = { count: 0, files: new Set() };
  }

  for (const file of codeFiles) {
    const text = await fs.readFile(file, 'utf8');
    for (const cls of classes) {
      const c = countOccurrences(text, cls);
      if (c > 0) {
        usage[cls].count += c;
        usage[cls].files.add(file);
      }
    }
  }

  const normalized = Object.fromEntries(Object.entries(usage).map(([k,v]) => [k, { count: v.count, files: Array.from(v.files) }]));
  return normalized;
}

function classify(usageEntry) {
  if (usageEntry.count === 0) return 'unused';
  if (usageEntry.files.length === 1 && usageEntry.count <= 2) return 'low-use';
  return 'in-use';
}

async function main() {
  console.log('Collecting CSS classes...');
  const cssMeta = await collectCssClasses();
  console.log(`Found ${cssMeta.allClasses.length} unique classes.`);
  console.log('Indexing code files...');
  const codeFiles = await buildCodeIndex();
  console.log(`Scanning ${codeFiles.length} code files for usage...`);
  const usage = await scanUsage(cssMeta.allClasses, codeFiles);

  const summary = { unused: [], 'low-use': [], 'in-use': [] };
  for (const [cls, data] of Object.entries(usage)) {
    const bucket = classify(data);
    summary[bucket].push(cls);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    totalClasses: cssMeta.allClasses.length,
    cssFiles: cssMeta.cssFiles,
    fileToClasses: cssMeta.fileToClasses,
    usage,
    summary,
    guidance: {
      unused: 'Candidates for deletion (verify no dynamic runtime generation).',
      'low-use': 'Consider inlining or converting to utility tokens if semantics overlap.',
      'in-use': 'Leave or consider abstraction if patterns repeat.'
    }
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`Report written to ${OUTPUT_FILE}`);
  console.log('Summary counts:', Object.fromEntries(Object.entries(summary).map(([k,v]) => [k, v.length])));
}

main().catch(err => { console.error(err); process.exit(1); });
