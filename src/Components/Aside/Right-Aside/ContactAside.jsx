/**
 * Contact Aside Panel Component
 * 
 * @description Slide-out contact form panel accessible from anywhere in the app.
 * Implements full accessibility with focus trap, keyboard navigation, and ARIA attributes.
 * 
 * Features:
 * - Slide-in animation from right side
 * - Focus trap (Tab cycles through panel elements only)
 * - Escape key to close
 * - Click backdrop to close
 * - Body scroll lock with scrollbar compensation
 * - Allows scrolling within panel body
 * - Auto-focus on open
 * - Closes mobile menu when opening
 * - Success callback on form submission
 * - Full ARIA compliance (modal, dialog, labels)
 * 
 * Accessibility:
 * - aria-modal="true" - Marks as modal dialog
 * - role="dialog" - Semantic dialog role
 * - Focus trap with Shift+Tab support
 * - Keyboard navigation (Tab, Shift+Tab, Escape)
 * - aria-live="polite" - Announces state changes
 * - Backdrop click to close (non-keyboard users)
 * 
 * Body Scroll Management:
 * - Locks body scroll when open
 * - Calculates and compensates for scrollbar width
 * - Allows wheel events inside panel body
 * - Restores scroll on close
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Whether the aside panel is open
 * @param {Function} props.onClose - Callback to close the panel
 * 
 * @example
 * ```jsx
 * const [isOpen, setIsOpen] = useState(false);
 * <ContactAside open={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

import { useEffect, useRef } from "react";
import ContactMeForm from "../../../Pages/ContactMe-Page/ContactMe-Components/ContactMeForm";
import { useNavigation } from "../../../Context/Navigation-Context/NavigationContext";
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
