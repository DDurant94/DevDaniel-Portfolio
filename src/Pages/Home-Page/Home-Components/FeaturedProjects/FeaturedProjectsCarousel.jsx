import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { allProjects } from '../../../../DataSets/Portfolio/Projects';
import { getMediaType } from '../../../../Utils/mediaHelpers.js';
import LazyImage from '../../../../Components/UI/LazyImage/LazyImage';
import LazyVideo from '../../../../Components/UI/LazyVideo/LazyVideo';
import '../../../../Styles/Page-Styles/Home-Styles/FeaturedProjects-Styles/FeaturedProjectsCarouselStyles.css';

/**
 * FeaturedProjectsCarousel - Modern 3D carousel for featured projects
 * 
 * Auto-playing carousel with keyboard navigation, manual controls, and transition effects.
 * Displays projects marked as featured with slide direction tracking for animations.
 * Pauses auto-play on hover for better UX.
 * 
 * Features:
 * - Auto-play carousel (8s interval)
 * - Pause on hover
 * - Keyboard navigation (Arrow keys, Home, End, Enter/Space)
 * - Direction tracking for slide animations
 * - Featured project filtering
 * - Framer Motion slide transitions
 * - Focus management for accessibility
 * - Responsive dot indicators
 * 
 * Keyboard Controls:
 * - Left Arrow: Previous slide
 * - Right Arrow: Next slide
 * - Home: Jump to first slide
 * - End: Jump to last slide
 * - Enter/Space: Navigate to project detail
 * 
 * Auto-play:
 * - Advances every 8 seconds
 * - Pauses when hovering over carousel
 * - Resumes when mouse leaves
 * 
 * Direction:
 * - 1: Forward (left to right)
 * - -1: Backward (right to left)
 * - Used for slide animation direction
 * 
 * @component
 * @param {Object} props
 * @param {number} props.index - Current slide index (0-based)
 * @param {Function} props.onSelect - Callback when slide changes (receives new index)
 * @param {Function} props.onDetails - Callback when user wants to see project details
 * 
 * @example
 * const [currentIndex, setCurrentIndex] = useState(0);
 * 
 * <FeaturedProjectsCarousel
 *   index={currentIndex}
 *   onSelect={setCurrentIndex}
 *   onDetails={(project) => navigate('/projects', { state: { project } })}
 * />
 */
const FeaturedProjectsCarousel = ({ index, onSelect, onDetails }) => {
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const onSelectRef = useRef(onSelect);

  // Keep ref in sync with prop
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);
  
  const slides = useMemo(() => {
    return allProjects.filter(p => p.featured === true);
  }, []);

  // Defer media loading until after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadMedia(true);
    }, 1800); // Load media after loader fades
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      onSelectRef.current((index + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [index, slides.length, isHovered]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    onSelectRef.current(index === 0 ? slides.length - 1 : index - 1);
  }, [index, slides.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    onSelectRef.current((index + 1) % slides.length);
  }, [index, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Enter':
        case ' ':
          if (e.target.classList.contains('carousel-slide') || e.target.closest('.carousel-slide')) {
            e.preventDefault();
            onDetails(slides[index]);
          }
          break;
        case 'Home':
          e.preventDefault();
          setDirection(-1);
          onSelectRef.current(0);
          break;
        case 'End':
          e.preventDefault();
          setDirection(1);
          onSelectRef.current(slides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, slides, onDetails, handleNext, handlePrev]);

  if (!slides.length) return null;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8,
      z: -400
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      z: 0
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
      scale: 0.8,
      z: -400
    })
  };

  return (
    <div 
      className="featured-projects-carousel-3d util-overflow-hidden" 
      aria-label="Featured Projects"
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-live="polite"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing project {index + 1} of {slides.length}: {slides[index].title}
      </div>
      
      <div 
        className="carousel-container util-w-full util-flex-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              rotateY: { duration: 0.6, ease: 'easeInOut' },
              scale: { duration: 0.4 },
              z: { duration: 0.6 }
            }}
            className="carousel-slide util-w-full util-h-full"
            onClick={() => onDetails(slides[index])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDetails(slides[index]);
              }
            }}
            tabIndex="0"
            role="button"
            aria-label={`View details for ${slides[index].title}. Press arrow keys to navigate, Enter to view details.`}
            style={{ cursor: 'pointer' }}
          >
            <div className="slide-card util-full">
              <div className="slide-image-wrapper util-full">
                {shouldLoadMedia ? (
                  getMediaType(slides[index].coverImage) === 'video' ? (
                    <LazyVideo
                      src={slides[index].coverImage}
                      className="util-pointer-none"
                      autoplay={true}
                      loop={true}
                      muted={true}
                      playsInline={true}
                      pauseWhenOutOfView={false}
                      preload="auto"
                      threshold={0}
                      rootMargin="0px"
                    />
                  ) : (
                    <LazyImage
                      src={slides[index].coverImage}
                      webpSrc={slides[index].coverImage.match(/\.(jpg|jpeg|png)$/i) ? slides[index].coverImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : undefined}
                      alt={`${slides[index].title} cover`}
                      className="util-pointer-none"
                      fadeIn={false}
                      threshold={0}
                      rootMargin="0px"
                    />
                  )
                ) : (
                  <div className="util-full" style={{ backgroundColor: '#1a1a1a' }} />
                )}
                {shouldLoadMedia && slides[index].logoOverlay && (
                  <LazyImage
                    src={slides[index].logoOverlay}
                    alt={`${slides[index].title} logo`}
                    className="slide-image-wrapper__logo util-pointer-none"
                    fadeIn={false}
                    threshold={0}
                    rootMargin="0px"
                  />
                )}
                <div className="slide-overlay util-pointer-none" />
              </div>
              <div className="slide-content util-flex-col-justify-center">
                <h3 className="slide-title">{slides[index].title}</h3>
                <p className="slide-description">{slides[index].description}</p>
                <div className="slide-tags util-flex util-flex-wrap">
                  {slides[index].type.slice(0, 3).map((tag, i) => (
                    <span key={i} className="slide-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="carousel-indicators util-flex util-justify-center" role="tablist" aria-label="Project navigation">
        {slides.map((slide, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-controls={`carousel-slide-${i}`}
            className={`indicator ${i === index ? 'active' : ''}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              onSelectRef.current(i);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDirection(i > index ? 1 : -1);
                onSelectRef.current(i);
              }
            }}
            aria-label={`Go to project ${i + 1}: ${slide.title}`}
            tabIndex={i === index ? 0 : -1}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjectsCarousel;
