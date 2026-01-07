// src/Functions/Portfolio-Functions/ProjectOffCanvas.jsx
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigation } from '../../Context/Navigation-Context/NavigationContext';
import { useMediaQuery } from '../../Context/MediaQueryContext';
import { getMediaType } from './../../Utils/mediaHelpers.js';
import FullscreenMediaViewer from './../../Components/UI/FullscreenMediaViewer/FullscreenMediaViewer.jsx';
import './../../Styles/General-Styles/DesignSystem-Styles/Design-Component-Styles/OffCanvasStyles.css';

/**
 * ProjectOffCanvas - Full-screen project detail panel with media gallery
 * 
 * Displays comprehensive project information in an off-canvas panel with image gallery,
 * fit mode toggle, and smooth animations. Automatically closes mobile menu when opened.
 * 
 * Features:
 * - Image gallery with thumbnails and navigation
 * - Fit mode toggle (cover/contain) for images
 * - Automatic orientation detection
 * - Smart fit toggle visibility (hides when aspect ratios match)
 * - Link merging (links + offCanvasLinks)
 * - Safe destructuring with defaults
 * - Framer Motion animations
 * - Tech stack and concepts display
 * - Project type badges (Personal/Professional/API/Frontend)
 * - Media deduplication
 * 
 * Gallery Controls:
 * - Thumbnail navigation
 * - Keyboard support (arrows, escape)
 * - Fit mode toggle (visible only when needed)
 * - Responsive aspect ratio handling
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.show - Panel visibility state
 * @param {Function} props.onHide - Close handler
 * @param {Object} props.content - Project data object
 * @param {string} props.content.title - Project title
 * @param {string} props.content.coverImage - Primary image
 * @param {Array<{src: string, alt: string}>} props.content.media - Gallery images
 * @param {Object} props.content.body - Project details
 * @param {string} props.content.body.powerTitle - Short tagline
 * @param {string} props.content.body.description - Summary
 * @param {string} props.content.body.offCanvasDescription - Full description
 * @param {string[]} props.content.body.techs - Technologies used
 * @param {string[]} props.content.body.concepts - Key concepts
 * @param {Array<{label: string, url: string}>} props.content.links - External links
 * @param {boolean} props.content.isPersonal - Personal project flag
 * @param {boolean} props.content.isApiOnly - API-only flag
 * @param {boolean} props.content.isFrontend - Frontend-only flag
 * 
 * @example
 * const [selectedProject, setSelectedProject] = useState(null);
 * 
 * <ProjectOffCanvas
 *   show={!!selectedProject}
 *   onHide={() => setSelectedProject(null)}
 *   content={selectedProject}
 * />
 */
export default function ProjectOffCanvas({ show, onHide, content }) {
  const { closeMobileMenu } = useNavigation();
  const { isMobile } = useMediaQuery();

  // Close mobile menu when offcanvas opens
  useEffect(() => {
    if (show) {
      closeMobileMenu();
    }
  }, [show, closeMobileMenu]);
  // Merge both link formats so nothing is lost
  const links = [
    ...(Array.isArray(content?.links) ? content.links : []),
    ...(Array.isArray(content?.offCanvasLinks) ? content.offCanvasLinks : []),
  ];

  // Safe destructuring with defaults
  const {
    title = '',
    isPersonal = false,
    isApiOnly = false,
    isFrontend = false,
    coverImage,
    image,
    logoOverlay,
    media = [],
    body = {},
  } = content || {};

  const {
    powerTitle = '',
    description = '',
    offCanvasDescription = '',
    techs = [],
    concepts = [],
  } = body;

  // Build media items without duplicates
  const mediaItems = useMemo(() => {
    const primary = coverImage || image ? [{ src: coverImage || image, alt: title }] : [];
    const rest = Array.isArray(media) ? media : [];
    const set = new Map();
    [...primary, ...rest].forEach((m) => {
      if (m?.src) set.set(m.src, m);
    });
    return Array.from(set.values());
  }, [coverImage, image, media, title]);


  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef(null);
  // Parallax removed per user request

  // Determine orientation after media load
  const handleImageLoad = (e) => {
    const media = e.target;
    let w, h;
    
    // Handle both images and videos
    if (media.tagName === 'VIDEO') {
      w = media.videoWidth;
      h = media.videoHeight;
    } else {
      w = media.naturalWidth;
      h = media.naturalHeight;
    }
    
    if (!w || !h) return; // Skip if dimensions aren't available yet
    
    const orientation = w >= h ? 'landscape' : 'portrait';
    media.dataset.orientation = orientation;
  };

  useEffect(() => {
    setActiveIdx(0);
  }, [mediaItems]);

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);

  // Trap initial focus to panel when opened
  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => {
        panelRef.current?.focus();
      });
    }
  }, [show]);

  // Lock body scroll when offcanvas is open
  useEffect(() => {
    if (show) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Allow wheel events inside the offcanvas body
      const handleWheel = (e) => {
        // If the wheel event is inside the offcanvas body, allow it
        if (bodyRef.current?.contains(e.target)) {
          e.stopPropagation();
        }
      };
      
      // Capture wheel events before they reach global listeners
      window.addEventListener('wheel', handleWheel, { capture: true });
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.removeEventListener('wheel', handleWheel, { capture: true });
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [show]);

  // Close on escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && show) onHide();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [show, onHide]);


  if (!show) return null;

  return (
    <div className="ds-offcanvas-wrapper" data-active={show} ref={wrapperRef} aria-live="polite">
      <div 
        className="ds-offcanvas-backdrop" 
        onClick={onHide} 
        aria-hidden="true" 
      />
      <section
        className="ds-offcanvas"
        aria-label={title || 'Project Details'}
        role="dialog"
        aria-modal="true"
        data-state={show ? 'enter' : 'exit'}
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="ds-offcanvas__header">
          <h2 className="ds-offcanvas__title">
            {title}
            {isPersonal && (
              <span className="util-badge" data-legacy="badge-removed">
                {isApiOnly ? 'API Only' : isFrontend ? 'Front-End' : 'Full-Stack'}
              </span>
            )}
          </h2>
          <button className="ds-offcanvas__close-btn" onClick={onHide} aria-label="Close panel">✕</button>
        </header>
        <div className="ds-offcanvas__body" ref={bodyRef}>
          {mediaItems.length > 0 && (
            <div className="ds-offcanvas-media">
              <div
                className="ds-offcanvas-media__stage"
                ref={stageRef}
                role="figure"
                aria-label="Project image preview"
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={mediaItems[activeIdx]?.src}
                    className="ds-offcanvas-media__img-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {getMediaType(mediaItems[activeIdx]?.src) === 'video' ? (
                      <video
                        src={mediaItems[activeIdx]?.src}
                        className="ds-offcanvas-media__img"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        loading="lazy"
                        disablePictureInPicture
                        onLoadedMetadata={handleImageLoad}
                        onClick={() => setIsFullscreen(true)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <img
                        src={mediaItems[activeIdx]?.src}
                        alt={mediaItems[activeIdx]?.alt || title}
                        className={`ds-offcanvas-media__img${
                          mediaItems[activeIdx]?.hasBackground ? ' ds-offcanvas-media__img--with-background' : ''
                        }`}
                        loading="eager"
                        onLoad={handleImageLoad}
                        onClick={() => setIsFullscreen(true)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    
                    {/* Logo Overlay (only for media items with hasLogo flag) */}
                    {mediaItems[activeIdx]?.hasLogo && logoOverlay && (
                      <img
                        src={logoOverlay}
                        alt={`${title} Logo`}
                        className="ds-offcanvas-media__logo-overlay"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

              </div>
              {mediaItems.length > 1 && (
                <div className="ds-offcanvas-media__thumbs">
                  {mediaItems.map((m, i) => {
                    const thumbType = getMediaType(m.src);
                    return (
                      <button
                        key={m.src}
                        className={`ds-offcanvas-media__thumb ${i === activeIdx ? 'active' : ''}`}
                        onClick={() => setActiveIdx(i)}
                        aria-label={`View ${thumbType === 'video' ? 'video' : 'image'} ${i + 1}`}
                        aria-current={i === activeIdx}
                      >
                        {thumbType === 'video' ? (
                          <>
                            <video 
                              src={m.src} 
                              muted 
                              playsInline 
                              preload="auto"
                              disablePictureInPicture
                              onLoadedData={(e) => {
                                // Seek to different time for each video (2.5s or 3.5s)
                                e.target.currentTime = i === 0 ? 2.5 : 3.5;
                                e.target.pause();
                              }}
                            />
                            {m.hasLogo && logoOverlay && (
                              <img
                                src={logoOverlay}
                                alt="Logo"
                                className="ds-offcanvas-media__thumb-logo"
                              />
                            )}
                          </>
                        ) : (
                          <img 
                            src={m.src} 
                            alt={m.alt || `${title} ${i + 1}`} 
                            loading="lazy"
                            className={m.hasBackground ? 'ds-offcanvas-media__img--with-background' : ''}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* On mobile: no scroll reveal, show immediately */}
          {isMobile ? (
            <div tabIndex={0} role="article" aria-label="Project description">
              {powerTitle && <h4 style={{ whiteSpace: 'pre-wrap' }}>{powerTitle}</h4>}
              {description && <p className="my-3" style={{ whiteSpace: 'pre-wrap' }}>{description}</p>}
              {offCanvasDescription && (
                <p className="offcanvas__body-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {offCanvasDescription}
                </p>
              )}

              {techs && techs.length > 0 && (
                <div className="util-section" data-ref="offcanvas-techs">
                  <h5 className="util-section-title">Technologies Used</h5>
                  <ul className="util-pill-list">
                    {(Array.isArray(techs) ? techs : Object.values(techs).flat()).map((tech) => (
                      <li key={tech} className="util-pill">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {concepts && concepts.length > 0 && (
                <div className="util-section" data-ref="offcanvas-concepts">
                  <h5 className="util-section-title">Concepts & Domains</h5>
                  <ul className="util-pill-list">
                    {concepts.map((concept) => (
                      <li key={concept} className="util-pill">
                        {concept}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {links.length > 0 && (
                <ul className="ds-offcanvas__links">
                  {links.map((link) => (
                    <li key={link.url || link.label}>
                      {link.isDisabled ? (
                        <span className="disabled" aria-disabled="true">
                          {link.label}
                        </span>
                      ) : (
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Desktop: use motion.div for reliable animation on offcanvas open */
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.4, 0.7, 0.25, 1] }}
              tabIndex={0} 
              role="article" 
              aria-label="Project description"
            >
            {powerTitle && <h4 style={{ whiteSpace: 'pre-wrap' }}>{powerTitle}</h4>}
            {description && <p className="my-3" style={{ whiteSpace: 'pre-wrap' }}>{description}</p>}
            {offCanvasDescription && (
              <p className="offcanvas__body-text" style={{ whiteSpace: 'pre-wrap' }}>
                {offCanvasDescription}
              </p>
            )}

            {techs && techs.length > 0 && (
              <div className="util-section" data-ref="offcanvas-techs">
                <h5 className="util-section-title">Technologies Used</h5>
                <ul className="util-pill-list">
                  {(Array.isArray(techs) ? techs : Object.values(techs).flat()).map((tech, i) => (
                    <motion.li
                      key={tech}
                      className="util-pill"
                      initial={{ opacity: 0, y: 20, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: i * 0.05,
                        ease: [0.4, 0.7, 0.25, 1]
                      }}
                    >
                      {tech}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {concepts && concepts.length > 0 && (
              <div className="util-section" data-ref="offcanvas-concepts">
                <h5 className="util-section-title">Concepts & Domains</h5>
                <ul className="util-pill-list">
                  {concepts.map((concept, i) => (
                    <motion.li
                      key={concept}
                      className="util-pill"
                      initial={{ opacity: 0, y: 20, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: i * 0.05,
                        ease: [0.4, 0.7, 0.25, 1]
                      }}
                    >
                      {concept}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {links.length > 0 && (
              <ul className="ds-offcanvas__links">
                {links.map((link) => (
                  <li key={link.url || link.label}>
                    {link.isDisabled ? (
                      <span className="disabled" aria-disabled="true">
                        {link.label}
                      </span>
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
          )}
        </div>
      </section>

      {/* Fullscreen Media Viewer */}
      <FullscreenMediaViewer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        mediaSrc={mediaItems[activeIdx]?.src}
        mediaAlt={mediaItems[activeIdx]?.alt || title}
        logoSrc={logoOverlay}
        hasLogo={mediaItems[activeIdx]?.hasLogo}
        hasBackground={mediaItems[activeIdx]?.hasBackground}
      />
    </div>
  );
};

ProjectOffCanvas.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  content: PropTypes.shape({
    title: PropTypes.string,
    isApiOnly: PropTypes.bool,
    isFrontend: PropTypes.bool,
    isPersonal: PropTypes.bool,
    image: PropTypes.string,
    coverImage: PropTypes.string,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string,
      })
    ),
    body: PropTypes.shape({
      powerTitle: PropTypes.string,
      description: PropTypes.string,
      offCanvasDescription: PropTypes.string,
      techs: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      ]),
      concepts: PropTypes.arrayOf(PropTypes.string),
    }),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
        isDisabled: PropTypes.bool,
      })
    ),
    offCanvasLinks: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
        isDisabled: PropTypes.bool,
      })
    ),
  }).isRequired,
};

