import { useState } from "react";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, createEmailParams } from '../../../API/emailConfig.js';
import BaseButton from '../../../Components/UI/BaseButton/BaseButton.jsx';
import { motion } from "framer-motion";
import './../../../Styles/Page-Styles/ContactMe-Styles/ContactMeForm-Styles/ContactMeFormStyles.css';

/**
 * isValidEmail - Email validation helper
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * ContactMeForm - Contact form with EmailJS integration and validation
 * 
 * Full-featured contact form with real-time validation, error handling, loading states,
 * and success confirmation. Sends email to site owner and auto-reply to user via EmailJS.
 * 
 * Features:
 * - Real-time field validation (touched state)
 * - Email format validation regex
 * - Loading state during submission
 * - Success screen with reset option
 * - Error handling with user feedback
 * - Dual email sending (to owner + auto-reply to user)
 * - ARIA attributes for accessibility
 * - Framer Motion animations
 * - Font Awesome icons
 * - BaseButton integration
 * 
 * Form Fields:
 * - Name (required, non-empty)
 * - Email (required, valid format)
 * - Message (required, non-empty)
 * 
 * Validation:
 * - Shows errors only after field blur (touched)
 * - Clears errors on input change
 * - Submit disabled until all fields valid
 * 
 * EmailJS Flow:
 * 1. Send notification email to owner (TEMPLATE_ID)
 * 2. Send auto-reply to user (AUTO_REPLY_TEMPLATE_ID)
 * 3. Show success screen or error message
 * 
 * States:
 * - Default: Form with validation
 * - Loading: Disabled inputs, loading button
 * - Success: Confirmation message with reset button
 * - Error: Error message above submit button
 * 
 * @component
 * @example
 * <ContactMeForm />
 */
const ContactMeForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError(null);
  };

  const nameValid = formData.name.trim().length > 0;
  const emailValid = isValidEmail(formData.email);
  const messageValid = formData.message.trim().length > 0;
  const formValid = nameValid && emailValid && messageValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const emailParams = createEmailParams(formData);
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        emailParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      if (response.status !== 200) {
        throw new Error('Failed to send message');
      }
      
      // Send auto-reply to user
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID,
        emailParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      setSent(true);
    } catch (e) {
      console.error('EmailJS Error:', e);
      setError(e.text || e.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="contact-success util-flex-col-center"
      >
        <div className="success-icon util-flex-center">
          <i className="fa-solid fa-check-circle" aria-hidden="true"></i>
        </div>
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
        <BaseButton
          variant="outline"
          size="sm"
          onClick={() => {
            setSent(false);
            setFormData({ name: "", email: "", message: "" });
            setTouched({ name: false, email: false, message: false });
          }}
          ariaLabel="Send another message"
        >
          Send Another Message
        </BaseButton>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="contact-form util-w-full util-flex-col"
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      noValidate
    >
      {/* Name Field */}
      <div className="form-field">
        <label htmlFor="contact-name" className="form-label util-flex util-items-center">
          <i className="fa-solid fa-user" aria-hidden="true"></i>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          className={`form-input util-w-full ${touched.name && !nameValid ? 'input-error' : ''}`}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Your full name"
          required
          aria-invalid={touched.name && !nameValid}
          aria-describedby={touched.name && !nameValid ? "name-error" : undefined}
        />
        {touched.name && !nameValid && (
          <span id="name-error" className="field-error util-flex util-items-center" role="alert">
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            Name is required
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="form-field util-flex-col">
        <label htmlFor="contact-email" className="form-label util-flex util-items-center">
          <i className="fa-solid fa-envelope" aria-hidden="true"></i>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          className={`form-input util-w-full ${touched.email && !emailValid ? 'input-error' : ''}`}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="your.email@example.com"
          required
          aria-invalid={touched.email && !emailValid}
          aria-describedby={touched.email && !emailValid ? "email-error" : undefined}
        />
        {touched.email && !emailValid && (
          <span id="email-error" className="field-error util-flex util-items-center" role="alert">
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            {formData.email ? 'Enter a valid email address' : 'Email is required'}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="form-field util-flex-col">
        <label htmlFor="contact-message" className="form-label util-flex util-items-center">
          <i className="fa-solid fa-message" aria-hidden="true"></i>
          Message
        </label>
        <textarea
          id="contact-message"
          className={`form-input form-textarea util-w-full ${touched.message && !messageValid ? 'input-error' : ''}`}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="Tell me about your opportunity, project, or how we can work together..."
          rows={6}
          required
          aria-invalid={touched.message && !messageValid}
          aria-describedby={touched.message && !messageValid ? "message-error" : undefined}
        />
        {touched.message && !messageValid && (
          <span id="message-error" className="field-error util-flex util-items-center" role="alert">
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            Message is required
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="form-error util-flex util-items-center" role="alert">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="form-actions util-flex util-justify-center">
        <BaseButton
          variant="primary"
          size="lg"
          type="submit"
          disabled={!formValid || loading}
          loading={loading}
          ariaLabel="Submit contact form"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </BaseButton>
      </div>
    </motion.form>
  );
};

export default ContactMeForm;

