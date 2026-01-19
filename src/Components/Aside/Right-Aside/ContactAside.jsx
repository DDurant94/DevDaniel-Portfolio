/** ContactAside - Slide-out contact form panel with focus trap and accessibility features */

import { useEffect, useRef } from "react";
import ContactMeForm from "../../../Pages/ContactMe-Page/ContactMe-Components/ContactMeForm";
import { useNavigation } from "../../../Context/Navigation-Context/useNavigation";
import "../../../Styles/Page-Styles/ContactMe-Styles/ContactMeAside-Styles/ContactMeAsideStyles.css";

const ContactAside = ({ open, onClose }) => {
  const asideRef = useRef(null);
  const closeButtonRef = useRef(null);
  const bodyRef = useRef(null);
  const { closeMobileMenu } = useNavigation();

  // Close mobile menu when aside opens
  useEffect(() => {
    if (open) {
      closeMobileMenu();
    }
  }, [open, closeMobileMenu]);

  // Lock body scroll when aside is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Allow wheel events inside the aside body
      const handleWheel = (e) => {
        if (bodyRef.current?.contains(e.target)) {
          e.stopPropagation();
        }
      };
      
      window.addEventListener('wheel', handleWheel, { capture: true });
      
      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        window.removeEventListener('wheel', handleWheel, { capture: true });
      };
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [open]);

  // Focus aside panel when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        asideRef.current?.focus();
      });
    }
  }, [open]);

  // Focus trap and keyboard accessibility
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: cycle through focusable elements
      if (e.key === 'Tab') {
        const focusableElements = asideRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if on first element, go to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, go to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="contact-aside-wrapper" data-active={open} aria-live="polite">
      <div 
        className="contact-aside-backdrop" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <aside 
        ref={asideRef}
        className="contact-aside"
        data-state={open ? 'enter' : 'exit'}
        aria-modal="true" 
        role="dialog"
        aria-label="Contact Form"
        tabIndex={-1}
      >
        <header className="contact-aside__header">
          <h2 className="contact-aside__title">Let's Work Together</h2>
          <button 
            ref={closeButtonRef}
            className="contact-aside__close-btn" 
            onClick={onClose} 
            aria-label="Close contact form"
            type="button"
          >
            ✕
          </button>
        </header>
        <div className="contact-aside__body" ref={bodyRef}>
          <p className="contact-aside__subtitle">
            Whether you're looking to hire, collaborate, or just want to connect — I'd love to hear from you.
          </p>
          <ContactMeForm onSuccess={onClose} />
        </div>
      </aside>
    </div>
  );
};

export default ContactAside;
