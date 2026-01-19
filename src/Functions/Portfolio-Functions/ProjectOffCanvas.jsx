// src/Functions/Portfolio-Functions/ProjectOffCanvas.jsx
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigation } from '../../Context/Navigation-Context/useNavigation';
import { useMediaQuery } from '../../Context/MediaQueryContext.hook';
import { getMediaType } from './../../Utils/mediaHelpers.js';
import LazyImage from './../../Components/UI/LazyImage/LazyImage';
import LazyVideo from './../../Components/UI/LazyVideo/LazyVideo';
import FullscreenMediaViewer from './../../Components/UI/FullscreenMediaViewer/FullscreenMediaViewer.jsx';
import './../../Styles/General-Styles/DesignSystem-Styles/Design-Component-Styles/OffCanvasStyles.css';

/** ProjectOffCanvas - Full-screen project detail panel with media gallery */
export default function ProjectOffCanvas({ show, onHide, content }) {
  const { closeMobileMenu } = useNavigation();
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    if (show) {
      closeMobileMenu();
    }
  }, [show, closeMobileMenu]);
  const links = [
    ...(Array.isArray(content?.links) ? content.links : []),
    ...(Array.isArray(content?.offCanvasLinks) ? content.offCanvasLinks : []),
  ];

  const {
    title = '',
    isPersonal = false,
    isApiOnly = false,
    isFrontend = false,
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

  const mediaItems = useMemo(() => {
    const rest = Array.isArray(media) ? media : [];
    const set = new Map();
    // Don't add coverImage separately - it should already be in media array
    rest.forEach((m) => {
      if (m?.src) set.set(m.src, m);
    });
    return Array.from(set.values());
  }, [media]);


  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    setActiveIdx(0);
  }, [mediaItems]);

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);

  // Consolidated show/hide effects - focus, overflow, scroll lock, and escape handler
  useEffect(() => {
    if (show) {
      // Focus management
      requestAnimationFrame(() => {
        panelRef.current?.focus();
      });

      // Scroll lock with scrollbar compensation
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Wheel event handler
      const handleWheel = (e) => {
        if (bodyRef.current?.contains(e.target)) {
          e.stopPropagation();
        }
      };
      
      // Escape key handler
      const handleEscape = (e) => {
        if (e.key === 'Escape') onHide();
      };

      window.addEventListener('wheel', handleWheel, { capture: true });
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.removeEventListener('wheel', handleWheel, { capture: true });
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
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
          <h2 className="ds-offcanvas__title util-flex util-items-center">
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
                      <LazyVideo
                        src={mediaItems[activeIdx]?.src}
                        className="ds-offcanvas-media__img"
                        autoplay={true}
                        loop={true}
                        muted={true}
                        playsInline={true}
                        pauseWhenOutOfView={false}
                        threshold={0}
                        rootMargin="0px"
                        onClick={() => setIsFullscreen(true)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <LazyImage
                        src={mediaItems[activeIdx]?.src}
                        webpSrc={mediaItems[activeIdx]?.src?.match(/\.(jpg|jpeg|png)$/i) ? mediaItems[activeIdx]?.src?.replace(/\.(jpg|jpeg|png)$/i, '.webp') : undefined}
                        alt={mediaItems[activeIdx]?.alt || title}
                        className={`ds-offcanvas-media__img${
                          mediaItems[activeIdx]?.hasBackground ? ' ds-offcanvas-media__img--with-background' : ''
                        }`}
                        fadeIn={false}
                        threshold={0}
                        rootMargin="0px"
                        onClick={() => setIsFullscreen(true)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    
                    {mediaItems[activeIdx]?.hasLogo && logoOverlay && (
                      <LazyImage
                        src={logoOverlay}
                        alt={`${title} Logo`}
                        className="ds-offcanvas-media__logo-overlay"
                        fadeIn={false}
                        threshold={0}
                        rootMargin="0px"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

              </div>
              {mediaItems.length > 1 && (
                <div className="ds-offcanvas-media__thumbs util-flex">
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

          {isMobile ? (
            <div tabIndex={0} role="article" aria-label="Project description">
              {powerTitle && <h4 style={{ whiteSpace: 'pre-wrap' }}>{powerTitle}</h4>}
              {description && <p className="util-my-md" style={{ whiteSpace: 'pre-wrap' }}>{description}</p>}
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
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.4, 0.7, 0.25, 1] }}
              tabIndex={0} 
              role="article" 
              aria-label="Project description"
            >
            {powerTitle && <h4 style={{ whiteSpace: 'pre-wrap' }}>{powerTitle}</h4>}
            {description && <p className="util-my-md" style={{ whiteSpace: 'pre-wrap' }}>{description}</p>}
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
        mediaType={getMediaType(mediaItems[activeIdx]?.src)}
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

