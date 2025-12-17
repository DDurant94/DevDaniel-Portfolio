/**
 * LogoLoop Component
 * 
 * @description Infinite scrolling logo carousel with smooth, continuous animation. Automatically
 * duplicates logos to create seamless loop effect. Supports both horizontal directions with
 * pause on hover and optimized performance.
 * 
 * Features:
 * - Infinite seamless looping (no jump back)
 * - Automatic logo duplication for smooth wrapping
 * - Configurable speed and direction
 * - Pause on hover for accessibility
 * - Responsive sizing
 * - Image lazy loading support
 * - ResizeObserver for dynamic container adjustments
 * - GPU-accelerated transforms
 * - Automatic copy calculation for container width
 * 
 * How It Works:
 * 1. Measures logo sequence width
 * 2. Duplicates logos to fill container + headroom
 * 3. Animates using CSS transform translateX
 * 4. Resets position when one sequence scrolls out
 * 5. Seamless continuous loop
 * 
 * Performance:
 * - Uses transform (GPU accelerated)
 * - ResizeObserver for efficient resize detection
 * - Memoized calculations
 * - Image load detection for accurate sizing
 * 
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.logos - Array of logo objects with src, alt, etc.
 * @param {number} [props.speed=60] - Pixels per second scroll speed
 * @param {'left'|'right'} [props.direction='left'] - Scroll direction
 * @param {number} [props.logoHeight=3] - Logo height in rem
 * @param {number} [props.gap=40] - Gap between logos in pixels
 * @param {number} [props.maxCopies=Infinity] - Maximum sequence duplications
 * @param {boolean} [props.pauseOnHover=true] - Pause animation on hover
 * @param {string} [props.className=''] - Additional CSS classes
 * 
 * @example
 * ```jsx
 * import { IconList } from './data/icons';
 * 
 * <LogoLoop
 *   logos={Object.values(IconList)}
 *   speed={80}
 *   direction="left"
 *   logoHeight={4}
 *   gap={60}
 *   pauseOnHover={true}
 * />
 * ```
 */

import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import '../../../Styles/Component-Styles/UI-Styles/LogoLoop-Styles/LogoLoopStyles.css';

/** Animation configuration constants */
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 1
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, dependencies);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach(img => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    }
  }, dependencies);
};

const useAnimationLoop = (
  trackRef,
  targetVelocity,
  seqWidth,
  isHovered,
  pauseOnHover,
  duplicationDisabled = false,
  containerWidth = 0,
  isInView = true,
  pauseWhenOffscreen = true
) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Scroll pause detector - stops RAF during scroll for performance
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150); // Resume 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

  const shouldPause = (pauseOnHover && isHovered) || (pauseWhenOffscreen && !isInView) || isScrollingRef.current;
  const target = shouldPause ? 0 : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;

        if (duplicationDisabled && containerWidth > 0) {
          // Bounce between 0 and maxOffset so a single list scrolls smoothly without visible wrapping
          const maxOffset = Math.max(0, seqWidth - containerWidth);
          if (maxOffset <= 0) {
            nextOffset = 0; // No scroll needed when content smaller/equal to container
            velocityRef.current = 0;
          } else {
            if (nextOffset < 0) {
              nextOffset = 0;
              velocityRef.current = Math.abs(velocityRef.current); // reverse to forward
            } else if (nextOffset > maxOffset) {
              nextOffset = maxOffset;
              velocityRef.current = -Math.abs(velocityRef.current); // reverse to backward
            }
          }
        } else {
          // Seamless wrap with modulo when duplicates are present
          nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        }

        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, duplicationDisabled, containerWidth, isInView, pauseWhenOffscreen, trackRef]);
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
  pauseWhenOffscreen = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    maxCopies = 6,
    disableDuplication = false,
    ariaLabel = 'skill logos',
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      // Batch layout reads in RAF to prevent forced reflow
      requestAnimationFrame(() => {
        const nextContainerWidth = containerRef.current?.clientWidth ?? 0;
        const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

        if (sequenceWidth > 0) {
          setSeqWidth(Math.ceil(sequenceWidth));
          setContainerWidth(nextContainerWidth);
          // If duplication is disabled, force 1 copy; otherwise compute minimal copies
          if (disableDuplication) {
            setCopyCount(1);
          } else {
            // If the base sequence already exceeds the container, two copies are enough for a seamless loop.
            const baseCopies = sequenceWidth >= nextContainerWidth
              ? 2
              : Math.ceil(nextContainerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
            setCopyCount(Math.min(Math.max(ANIMATION_CONFIG.MIN_COPIES, baseCopies), maxCopies));
          }
        }
      });
    }, [maxCopies, disableDuplication]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, maxCopies, disableDuplication]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, maxCopies, disableDuplication]);

    useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      isHovered,
      pauseOnHover,
      disableDuplication,
      containerWidth,
      isInView,
      pauseWhenOffscreen
    );

    // Observe visibility to optionally pause when offscreen
    useEffect(() => {
      if (!pauseWhenOffscreen) return undefined;
      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') return undefined;
      const observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          setIsInView(entry?.isIntersecting ?? true);
        },
        { root: null, threshold: 0 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [pauseWhenOffscreen]);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}rem`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        ['logoloop', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', className]
          .filter(Boolean)
          .join(' '),
      [fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback((item, key) => {
      const isNodeItem = 'node' in item;

      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ''}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
      const itemLabelText = item.title ?? item.alt ?? itemAriaLabel;

      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || 'logo link'}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
          {itemLabelText ? (
            <span className="logoloop__label" aria-hidden="true">{itemLabelText}</span>
          ) : null}
        </li>
      );
    }, []);

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: toCssLength(width) ?? '100%',
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style]
    );

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="logoloop__track" ref={trackRef}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
