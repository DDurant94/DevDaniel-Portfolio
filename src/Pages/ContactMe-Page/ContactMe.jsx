/**
 * Contact Me Page Component
 * 
 * @description Dedicated contact page with form for inquiries, collaboration requests,
 * and general communication. Features animated entrance and clean, focused layout.
 * 
 * Features:
 * - Contact form with validation
 * - Smooth entrance animation
 * - Body class management for page-specific styling
 * - Accessibility skip link
 * - Clear call-to-action messaging
 * 
 * Page Lifecycle:
 * - Adds 'contact-page' class to body on mount
 * - Removes class on unmount (prevents style bleed)
 * 
 * @component
 * @requires framer-motion - Page entrance animation
 * @requires ContactMeForm - Form component with validation
 * @requires SkipToMain - Accessibility skip link
 * 
 * @example
 * ```jsx
 * <ContactMe />
 * ```
 */

import ContactMeForm from "./ContactMe-Components/ContactMeForm";
import { useEffect } from "react";
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain';
import { motion } from "framer-motion";

const ContactMe = () => {

  /**
   * Page-specific body class management
   * Adds 'contact-page' class for custom styling on this page only
   * Cleanup removes class to prevent style bleeding to other pages
   */
  useEffect(() => {
    document.body.classList.add('contact-page');
    return () => {
      document.body.classList.remove('contact-page');
    };
  }, []);

  return (
    <div id="contact-page-container" className="contact-page">
      <SkipToMain targetId="contact-form-section" />

      {/* Foreground Form */}
      <motion.section
        id="contact-form-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div id="contact-form-container">
          <div className="contact-header">
            <h2>Let's Work Together</h2>
            <p className="contact-subtitle">Whether you're looking to hire, collaborate, or just want to connect — I'd love to hear from you.</p>
          </div>
          <div id="contact-container">
            <ContactMeForm />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactMe;
