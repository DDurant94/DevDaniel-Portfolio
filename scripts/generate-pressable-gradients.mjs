#!/usr/bin/env node
/**
 * generate-pressable-gradients.mjs
 * Programmatically emits CSS custom property definitions for pressable gradient stacks
 * given a set of base hues (primary + accent). This helps keep gradient math
 * consistent and enables future palette experimentation from a single config.
 */

const fs = await import('fs');
const path = await import('path');

// Configuration: extend or modify hues here
const config = {
  primary: {
    name: 'primary',
    top: 'var(--color-primary)',
    hoverTop: 'var(--brand-orange-500)',
    hoverBottom: 'var(--brand-orange-600)'
  },
  accent: {
    name: 'accent',
    top: 'var(--comp-blue-500)',
    hoverTop: 'var(--comp-blue-500)',
    hoverBottom: 'var(--comp-blue-600)'
  }
};

function buildSet(prefix, top, hoverTop, hoverBottom) {
  return `  --gradient-pressable-${prefix}-base: linear-gradient(\n    180deg,\n    color-mix(in srgb, ${top} 90%, white 10%) 0%,\n    color-mix(in srgb, ${top} 84%, black 16%) 100%\n  );\n  --gradient-pressable-${prefix}-hover: linear-gradient(\n    180deg,\n    color-mix(in srgb, ${hoverTop} 92%, white 8%) 0%,\n    color-mix(in srgb, ${hoverBottom} 90%, black 10%) 100%\n  );\n  --gradient-pressable-${prefix}-active: linear-gradient(\n    180deg,\n    color-mix(in srgb, ${top} 92%, white 8%) 0%,\n    color-mix(in srgb, ${top} 82%, black 18%) 100%\n  );`;
}

let output = '/* Generated Pressable Gradient Tokens */\n';
output += buildSet(config.primary.name, config.primary.top, config.primary.hoverTop, config.primary.hoverBottom) + '\n\n';
output += buildSet(config.accent.name, config.accent.top, config.accent.hoverTop, config.accent.hoverBottom) + '\n';

const target = path.resolve(process.cwd(), 'generated-pressable-gradients.css');
fs.writeFileSync(target, output, 'utf8');
console.log(`Generated gradient token block -> ${target}`);
