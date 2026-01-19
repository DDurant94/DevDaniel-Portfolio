// src/Components/UI/FullscreenMediaViewer/FullscreenMediaViewer.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'motion/react';
import { getMediaType } from '../../../Utils/mediaHelpers.js';
import './../../../Styles/Component-Styles/UI-Styles/FullscreenMediaViewer-Styles/FullscreenMediaViewerStyles.css';

/** FullscreenMediaViewer - Interactive fullscreen overlay for media viewing with zoom and pan controls */
export default function FullscreenMediaViewer({
  isOpen,
  onClose,
  mediaSrc,
  mediaAlt,
  logoSrc,
  hasLogo,
  hasBackground,
  mediaType: mediaTypeProp
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const mediaRef = useRef(null);

  const mediaType = mediaTypeProp || getMediaType(mediaSrc);
  const isPDF = mediaType === 'pdf';
  const minZoom = 0.25;
  const maxZoom = 2;
  const zoomStep = 0.25;

  // Debug logging
  useEffect(() => {
    if (isOpen && mediaSrc) {
      console.log('FullscreenMediaViewer:', { mediaType, mediaSrc, hasBackground });
    }
  }, [isOpen, mediaSrc, mediaType, hasBackground]);

  // Reset zoom and position when media changes or viewer closes
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, mediaSrc]);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom));
  };

  // Reset zoom and position
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle PDF download
  const handleDownload = (e) => {
    if (e) e.preventDefault();
    
    // Use fetch to get the file and trigger download
    fetch(mediaSrc)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = mediaAlt || 'DanielDurantsResume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Download failed:', err);
        // Fallback: try direct download
        const link = document.createElement('a');
        link.href = mediaSrc;
        link.download = mediaAlt || 'DanielDurantsResume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (zoom <= 1 || isPDF) return; // Only allow dragging when zoomed in and not PDF
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        case '+':
        case '=':
          if (!isPDF) {
            e.preventDefault();
            handleZoomIn();
          }
          break;
        case '-':
          if (!isPDF) {
            e.preventDefault();
            handleZoomOut();
          }
          break;
        case '0':
          if (!isPDF) {
            e.preventDefault();
            handleReset();
          }
          break;
        case 'ArrowLeft':
          if (zoom > 1) {
            e.preventDefault();
            setPosition(prev => ({ ...prev, x: prev.x + 50 }));
          }
          break;
        case 'ArrowRight':
          if (zoom > 1) {
            e.preventDefault();
            setPosition(prev => ({ ...prev, x: prev.x - 50 }));
          }
          break;
        case 'ArrowUp':
          if (zoom > 1) {
            e.preventDefault();
            setPosition(prev => ({ ...prev, y: prev.y + 50 }));
          }
          break;
        case 'ArrowDown':
          if (zoom > 1) {
            e.preventDefault();
            setPosition(prev => ({ ...prev, y: prev.y - 50 }));
          }
          break;
        case ' ':
          if (mediaType === 'video' && mediaRef.current) {
            e.preventDefault();
            if (mediaRef.current.paused) {
              mediaRef.current.play();
            } else {
              mediaRef.current.pause();
            }
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, zoom, onClose, mediaType, isPDF]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fullscreen-viewer util-flex-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            // Close if clicking backdrop (not media or controls)
            if (e.target.classList.contains('fullscreen-viewer')) {
              onClose();
            }
          }}
        >
          {/* Backdrop */}
          <div className="fullscreen-viewer__backdrop" />

          {/* Media Container */}
          <div
            ref={containerRef}
            className="fullscreen-viewer__container util-flex-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            <motion.div
              className="fullscreen-viewer__media-wrapper util-flex-center"
              animate={{
                scale: isPDF ? 1 : zoom,
                x: isPDF ? 0 : position.x,
                y: isPDF ? 0 : position.y
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {isPDF ? (
                <div className="fullscreen-viewer__pdf-container">
                  <object
                    data={mediaSrc}
                    type="application/pdf"
                    className="fullscreen-viewer__pdf"
                    aria-label={mediaAlt || "PDF Document"}
                    tabIndex="-1"
                  >
                    {/* Fallback for browsers that don't support embedded PDFs */}
                    <div className="fullscreen-viewer__pdf-fallback util-flex-center">
                      <div className="pdf-fallback-content">
                        <i className="fa-solid fa-file-pdf" aria-hidden="true"></i>
                        <h3>PDF Preview Unavailable</h3>
                        <p>Your browser doesn't support embedded PDF viewing.</p>
                        <button
                          className="fullscreen-viewer__btn fullscreen-viewer__btn--download util-flex util-items-center"
                          onClick={handleDownload}
                        >
                          <i className="fa-solid fa-download" aria-hidden="true"></i>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </object>
                </div>
              ) : mediaType === 'video' ? (
                <video
                  ref={mediaRef}
                  src={mediaSrc}
                  className={`fullscreen-viewer__media${hasBackground ? ' fullscreen-viewer__media--with-background' : ''}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : mediaType === 'svg' ? (
                <img
                  ref={mediaRef}
                  src={mediaSrc}
                  alt={mediaAlt}
                  className={`fullscreen-viewer__media fullscreen-viewer__media--svg${hasBackground ? ' fullscreen-viewer__media--with-background' : ''}`}
                  draggable={false}
                  style={{ minWidth: '300px', minHeight: '300px' }}
                  onLoad={() => console.log('SVG loaded:', mediaSrc)}
                  onError={(e) => console.error('SVG load error:', mediaSrc, e)}
                />
              ) : (
                <img
                  ref={mediaRef}
                  src={mediaSrc}
                  alt={mediaAlt}
                  className={`fullscreen-viewer__media${hasBackground ? ' fullscreen-viewer__media--with-background' : ''}`}
                  draggable={false}
                />
              )}

              {/* Logo Overlay (not for PDFs) */}
              {!isPDF && hasLogo && logoSrc && (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="fullscreen-viewer__logo"
                  draggable={false}
                />
              )}
            </motion.div>
          </div>

          {/* Close Button - Top Right */}
          <button
              className="fullscreen-viewer__btn fullscreen-viewer__btn--close-top util-flex-center"
            onClick={onClose}
            aria-label="Close viewer"
            title="Close (Esc)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* PDF Download Button - Top Right */}
          {isPDF && (
            <button
              className="fullscreen-viewer__btn--download-primary util-flex util-items-center"
              onClick={handleDownload}
              aria-label="Download PDF"
              title="Download Resume PDF"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </button>
          )}

          {/* Controls */}
          <div className="fullscreen-viewer__controls util-flex-col">
            {/* Zoom Controls (not for PDFs) */}
            {!isPDF && (
              <div className="fullscreen-viewer__zoom-controls util-flex-col">
              <button
                className="fullscreen-viewer__btn fullscreen-viewer__btn--zoom util-flex-center"
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
                aria-label="Zoom out"
                title="Zoom out (-)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <span className="fullscreen-viewer__zoom-level" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>

              <button
                className="fullscreen-viewer__btn fullscreen-viewer__btn--zoom util-flex-center"
                onClick={handleZoomIn}
                disabled={zoom >= maxZoom}
                aria-label="Zoom in"
                title="Zoom in (+)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <button
                className="fullscreen-viewer__btn fullscreen-viewer__btn--reset util-flex-center"
                onClick={handleReset}
                disabled={zoom === 1 && position.x === 0 && position.y === 0}
                aria-label="Reset zoom and position"
                title="Reset (0)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>
            )}
          </div>

          {/* Keyboard Hints */}
          <div className="fullscreen-viewer__hints" aria-live="polite" aria-atomic="true">
            <kbd>Esc</kbd> Close
            {!isPDF && (
              <>
                · <kbd>+/-</kbd> Zoom · <kbd>0</kbd> Reset
                {zoom > 1 && <> · <kbd>↑↓←→</kbd> Pan</>}
                {mediaType === 'video' && <> · <kbd>Space</kbd> Play/Pause</>}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

FullscreenMediaViewer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mediaSrc: PropTypes.string,
  mediaAlt: PropTypes.string,
  logoSrc: PropTypes.string,
  hasLogo: PropTypes.bool,
  hasBackground: PropTypes.bool,
  mediaType: PropTypes.oneOf(['image', 'video', 'pdf'])
};
