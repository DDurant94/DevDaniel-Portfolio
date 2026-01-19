/** ScrollStack - Scroll-based stacked card animation system */
import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { useMediaQuery } from '../../../Context/MediaQueryContext.hook';
import './../../../Styles/Component-Styles/UI-Styles/ScrollStack-Styles/ScrollStackStyles.css';

/**
 * ScrollStackItem Component
 * 
 * @description Individual card wrapper for ScrollStack animation system.
 * Provides accessibility features and optional activation callbacks.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.itemClassName=''] - CSS class for inner card
 * @param {string} [props.wrapperClassName=''] - CSS class for wrapper
 * @param {number} [props.tabIndex=0] - Keyboard navigation index
 * @param {string} [props.role='group'] - ARIA role
 * @param {string} [props.ariaLabel] - Accessibility label
 * @param {Function} [props.onActivate] - Callback on Enter/Space key
 * 
 * @example
 * ```jsx
 * <ScrollStackItem
 *   ariaLabel="Service: Web Development"
 *   onActivate={() => console.log('Activated!')}
 * >
 *   <h3>Web Development</h3>
 *   <p>Description...</p>
 * </ScrollStackItem>
 * ```
 */
export const ScrollStackItem = ({
  children,
  itemClassName = '',
  wrapperClassName = '',
  tabIndex = 0,
  role = 'group',
  ariaLabel,
  onActivate
}) => {
  const handleKey = e => {
    if (!onActivate) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  };
  return (
    <div
      className={`scroll-stack-card-wrapper ${wrapperClassName}`.trim()}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={handleKey}
    >
      <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
    </div>
  );
};

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 450,
  itemScale = 0.03,
  itemStackDistance = 8,
  stackPosition = '2%',
  scaleEndPosition = '30%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scaleEasing = 'easeInOut', // string key or function(progress)=>progress
  onStackComplete
}) => {
  const { prefersReducedMotion, isMobile, isTablet } = useMediaQuery();
  
  // Disable animations only for mobile/tablet OR reduced motion
  const shouldDisableAnimations = prefersReducedMotion || isMobile || isTablet;
  
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const createdLocalLenisRef = useRef(false);
  const cardsRef = useRef([]); // transformed elements
  const wrappersRef = useRef([]); // measurement elements (not transformed)
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const wrapperTopsRef = useRef([]);
  const endElementTopRef = useRef(0);
  const containerHeightRef = useRef(0);
  const stackPosPxRef = useRef(0);
  const scaleEndPosPxRef = useRef(0);
  const needsRecomputeRef = useRef(true);
  const prevTimeRef = useRef(null);
  const dtRef = useRef(16); // ms between frames, default ~60fps

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (!element) return 0;
      if (useWindowScroll) {
        // Use wrapper (non-transformed) elements for stable measurements
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const recomputeLayoutMetrics = useCallback(() => {
    const { containerHeight } = getScrollData();
    containerHeightRef.current = containerHeight;

    // Compute percentage-based positions once per resize
    stackPosPxRef.current = parsePercentage(stackPosition, containerHeight);
    scaleEndPosPxRef.current = parsePercentage(scaleEndPosition, containerHeight);

    // Measure end element once (not affected by transforms)
    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');
    endElementTopRef.current = endElement ? getElementOffset(endElement) : 0;

    // Measure wrapper tops
    const wrappers = wrappersRef.current;
    const tops = new Array(wrappers.length);
    for (let i = 0; i < wrappers.length; i++) {
      tops[i] = getElementOffset(wrappers[i]);
    }
    wrapperTopsRef.current = tops;
    needsRecomputeRef.current = false;
  }, [getScrollData, parsePercentage, getElementOffset, useWindowScroll, stackPosition, scaleEndPosition]);

  const updateCardTransforms = useCallback(() => {
  if (!cardsRef.current.length || !wrappersRef.current.length || isUpdatingRef.current) return;

    // Skip all transform animations if user prefers reduced motion
    // Mobile uses CSS sticky positioning instead (no JS transforms)
    if (shouldDisableAnimations) {
      isUpdatingRef.current = false;
      return;
    }

    isUpdatingRef.current = true;

    if (needsRecomputeRef.current || wrapperTopsRef.current.length !== wrappersRef.current.length) {
      recomputeLayoutMetrics();
    }

  const { scrollTop } = getScrollData();
    const stackPositionPx = stackPosPxRef.current;
    const scaleEndPositionPx = scaleEndPosPxRef.current;
    const endElementTop = endElementTopRef.current;
    const containerHeight = containerHeightRef.current;
  const dt = dtRef.current || 16;

    const resolveEase = p => {
      const clamp = v => (v < 0 ? 0 : v > 1 ? 1 : v);
      if (typeof scaleEasing === 'function') return clamp(scaleEasing(p));
      switch (scaleEasing) {
        case 'easeInOut':
          // easeInOutCubic
          return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        case 'easeOutQuad':
          return 1 - (1 - p) * (1 - p);
        case 'easeOutCubic':
          return 1 - Math.pow(1 - p, 3);
        case 'easeInQuad':
          return p * p;
        case 'linear':
        default:
          return clamp(p);
      }
    };

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const wrapper = wrappersRef.current[i];
      const wrapperTop = wrapperTopsRef.current[i] ?? getElementOffset(wrapper);
      const triggerStart = wrapperTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = wrapperTop - scaleEndPositionPx;
      const pinStart = wrapperTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const eased = resolveEase(scaleProgress);
      const targetScale = baseScale + i * itemScale;
      const target = 1 - eased * (1 - targetScale);
      // Smooth scale towards target using time-based exponential smoothing
      let scale = target;
      if (scaleDuration && scaleDuration > 0) {
        const lastScale = lastTransformsRef.current.get(i)?.scale ?? target;
        const tau = scaleDuration * 1000; // ms
        const alpha = 1 - Math.exp(-dt / Math.max(1, tau));
        scale = lastScale + alpha * (target - lastScale);
      }
      const rotation = rotationAmount ? i * rotationAmount * eased : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < wrappersRef.current.length; j++) {
          const jWrapperTop = wrapperTopsRef.current[j] ?? getElementOffset(wrappersRef.current[j]);
          const jTriggerStart = jWrapperTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - wrapperTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - wrapperTop + stackPositionPx + itemStackDistance * i;
      }

      // Removed rounding for more precise sub-pixel smoothing
      const newTransform = {
        translateY,
        scale,
        rotation,
        blur
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = rotation
          ? `translateY(${newTransform.translateY}px) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
          : `translateY(${newTransform.translateY}px) scale(${newTransform.scale})`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    shouldDisableAnimations,
    itemScale,
    itemStackDistance,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    scaleEasing,
    onStackComplete,
    calculateProgress,
    getScrollData,
    getElementOffset,
    recomputeLayoutMetrics
  ]);

  const setupLenis = useCallback(() => {
    const commonOptions = {
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.75
    };

    let lenis;
    if (useWindowScroll) {
      // Reuse global Lenis if available to avoid conflicts
      if (typeof window !== 'undefined' && window.__lenis) {
        lenis = window.__lenis;
        createdLocalLenisRef.current = false;
      } else {
        lenis = new Lenis(commonOptions);
        createdLocalLenisRef.current = true;
      }
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      lenis = new Lenis({
        ...commonOptions,
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        gestureOrientationHandler: true,
        normalizeWheel: false,
        touchInertiaMultiplier: 35,
        touchInertia: 0.6
      });
      createdLocalLenisRef.current = true;
    }

    // Per-frame updates for smoother motion; avoids relying only on scroll events.
    const raf = time => {
      // compute delta time in ms for smoothing
      if (prevTimeRef.current == null) prevTimeRef.current = time;
      const dt = time - prevTimeRef.current;
      prevTimeRef.current = time;
      dtRef.current = dt;
      lenis.raf(time);
      updateCardTransforms();
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
    return lenis;
  }, [useWindowScroll, updateCardTransforms]);

  // Keyboard navigation: arrow up/down moves focus between wrappers
  const focusNext = useCallback(direction => {
    const wrappers = wrappersRef.current;
    if (!wrappers.length) return;
    const active = document.activeElement;
    let idx = wrappers.indexOf(active);
    if (idx === -1) {
      idx = 0;
    } else {
      idx = Math.min(Math.max(idx + direction, 0), wrappers.length - 1);
    }
    const target = wrappers[idx];
    if (target) {
      target.focus({ preventScroll: true });
      // Smooth scroll to keep focused card in view using lenis
      const top = wrapperTopsRef.current[idx] ?? getElementOffset(target);
      if (lenisRef.current) {
        // center card in viewport
        const { containerHeight } = getScrollData();
        lenisRef.current.scrollTo(top - containerHeight / 4, { duration: 0.6 });
      } else {
        window.scrollTo({ top: top - window.innerHeight / 4, behavior: 'smooth' });
      }
    }
  }, [getElementOffset, getScrollData]);

  const handleGlobalKey = useCallback(
    e => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusNext(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusNext(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const wrappers = wrappersRef.current;
        if (wrappers[0]) wrappers[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        const wrappers = wrappersRef.current;
        if (wrappers[wrappers.length - 1]) wrappers[wrappers.length - 1].focus();
      }
    },
    [focusNext]
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const wrappers = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card-wrapper')
        : scroller.querySelectorAll('.scroll-stack-card-wrapper')
    );
    const cards = wrappers.map(w => w.querySelector('.scroll-stack-card'));

    wrappersRef.current = wrappers;
    cardsRef.current = cards;
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      // Shift will-change hint to wrapper instead of card (experimental):
      wrappers[i].style.willChange = 'transform';
      // Promote wrapper for compositing instead of the card
      wrappers[i].style.transform = 'translateZ(0)';
      wrappers[i].style.webkitTransform = 'translateZ(0)';
      card.style.willChange = '';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      // Remove translateZ and perspective from card to avoid extra 3D context on animated element
    });

    // Initial compute after DOM renders
    recomputeLayoutMetrics();

    // Observe container size changes
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        needsRecomputeRef.current = true;
        // Recompute soon after resize settles
        requestAnimationFrame(recomputeLayoutMetrics);
      });
      const resizeTarget = useWindowScroll ? document.documentElement : scroller;
      if (resizeTarget) resizeObserver.observe(resizeTarget);
    } else {
      window.addEventListener('resize', recomputeLayoutMetrics);
    }

    // Observe DOM mutations affecting wrappers
    const inner = useWindowScroll
      ? document.querySelector('.scroll-stack-inner')
      : scroller.querySelector('.scroll-stack-inner');
    const mutationObserver = new MutationObserver(() => {
      // refresh wrapper list and recompute metrics on structure change
      const newWrappers = Array.from(
        useWindowScroll
          ? document.querySelectorAll('.scroll-stack-card-wrapper')
          : scroller.querySelectorAll('.scroll-stack-card-wrapper')
      );
      wrappersRef.current = newWrappers;
      cardsRef.current = newWrappers.map(w => w.querySelector('.scroll-stack-card'));
      needsRecomputeRef.current = true;
      requestAnimationFrame(recomputeLayoutMetrics);
    });
    if (inner) {
      mutationObserver.observe(inner, { childList: true, subtree: true });
    }

  setupLenis();
  // Attach keyboard listener for roving focus
  document.addEventListener('keydown', handleGlobalKey);

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current && createdLocalLenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      wrappersRef.current = [];
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const lastTransforms = lastTransformsRef.current;
      lastTransforms.clear();
      isUpdatingRef.current = false;
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', recomputeLayoutMetrics);
      mutationObserver.disconnect();
      document.removeEventListener('keydown', handleGlobalKey);
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    scaleEasing,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    recomputeLayoutMetrics,
    handleGlobalKey
  ]);

  return (
    <div
      className={`scroll-stack-scroller util-full ${className}`.trim()}
      ref={scrollerRef}
      style={{ overflowY: useWindowScroll ? 'visible' : 'auto' }}
    >
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
