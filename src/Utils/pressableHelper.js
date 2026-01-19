/**
 * Adds .is-pressed class to .pressable elements during mouse/touch/keyboard interaction
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
  // Observe DOM mutations for newly added pressables with throttling
  let pending = false;
  const mo = new MutationObserver(muts => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      for (const m of muts) {
        if (m.addedNodes?.length) {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) enhancePressable(node);
          });
        }
      }
    });
  });
  mo.observe(document.body, { subtree: true, childList: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initPressables, 0);
  } else {
    document.addEventListener('DOMContentLoaded', () => initPressables());
  }
}
