/**
 * pressableHelper - Tactile pressed state for interactive elements
 * 
 * Automatically adds .is-pressed class to elements with .pressable class during interaction.
 * Supports mouse, touch, and keyboard (Space/Enter) with proper cancel handling.
 * Auto-initializes on DOM ready and observes for dynamically added elements.
 * 
 * Features:
 * - CSS class toggle (.is-pressed) for visual feedback
 * - Multi-input support: mouse (pointerdown), touch, keyboard (Space/Enter)
 * - Proper cleanup: removes state on pointerup/pointerleave/pointercancel/blur
 * - Left-click only (button === 0)
 * - MutationObserver for dynamic content
 * - SSR-safe (typeof window check)
 * - Auto-init after DOM ready
 * - Prevents duplicate binding (__pressableBound flag)
 * 
 * Usage:
 * Add .pressable class to any interactive element. The helper automatically
 * adds .is-pressed during interaction for CSS-based visual feedback.
 * 
 * CSS Example:
 * .pressable {
 *   transform: scale(1);
 *   transition: transform 0.1s;
 * }
 * .pressable.is-pressed {
 *   transform: scale(0.97);
 * }
 * 
 * Manual Initialization:
 * Call initPressables() after dynamically adding content if MutationObserver
 * doesn't catch it (rare edge cases).
 * 
 * @module pressableHelper
 * @example
 * // HTML:
 * <button class="pressable">Click me</button>
 * 
 * // CSS:
 * .pressable.is-pressed {
 *   transform: scale(0.95);
 *   opacity: 0.9;
 * }
 * 
 * @example
 * // Manual init after dynamic content load:
 * import { initPressables } from './pressableHelper';
 * 
 * function addDynamicButtons() {
 *   container.innerHTML = '<button class="pressable">New Button</button>';
 *   initPressables(); // Ensure new buttons are enhanced
 * }
 */
// Any element with class 'pressable' will be enhanced.
function enhancePressable(root = document) {
  const candidates = Array.from(root.querySelectorAll('.pressable'));
  candidates.forEach(el => {
    if (el.__pressableBound) return;
    el.__pressableBound = true;

    const add = () => el.classList.add('is-pressed');
    const remove = () => el.classList.remove('is-pressed');

    el.addEventListener('pointerdown', e => {
      if (e.button !== 0) return; // left only
      add();
    });
    el.addEventListener('pointerup', remove);
    el.addEventListener('pointerleave', remove);
    el.addEventListener('pointercancel', remove);

    el.addEventListener('keydown', e => {
      if ((e.code === 'Space' || e.code === 'Enter')) add();
    });
    el.addEventListener('keyup', e => {
      if ((e.code === 'Space' || e.code === 'Enter')) remove();
    });
    el.addEventListener('blur', remove);
  });
}

// Expose for manual invocation (e.g., after dynamic content loads)
export function initPressables() {
  if (typeof window === 'undefined') return;
  enhancePressable();
  // Observe DOM mutations for newly added pressables (lightweight observer)
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes?.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) enhancePressable(node);
        });
      }
    }
  });
  mo.observe(document.body, { subtree: true, childList: true });
}

// Auto-init after DOM ready (framework safe: delay one tick)
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initPressables, 0);
  } else {
    document.addEventListener('DOMContentLoaded', () => initPressables());
  }
}
