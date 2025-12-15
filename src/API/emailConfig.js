/**
 * EmailJS Configuration
 * 
 * @description Central configuration for EmailJS email delivery service.
 * Handles both owner notifications and auto-reply confirmations to users.
 * 
 * Setup Instructions:
 * 1. Sign up at https://www.emailjs.com/
 * 2. Create a service (Gmail, Outlook, etc.)
 * 3. Create two templates:
 *    - Owner notification template (TEMPLATE_ID)
 *    - Auto-reply template (AUTO_REPLY_TEMPLATE_ID)
 * 4. Get your public key from Account settings
 * 5. Update values below with your credentials
 * 
 * Template Variables:
 * - {{from_name}} - User's name from form
 * - {{from_email}} - User's email address
 * - {{subject}} - Form subject line
 * - {{message}} - User's message content
 * - {{to_name}} - Your name (recipient)
 * - {{timestamp}} - Formatted submission timestamp
 * 
 * Security Notes:
 * - Public key is safe to expose (client-side only)
 * - Service ID and Template IDs are not sensitive
 * - Never expose your EmailJS private key
 * - Consider rate limiting on EmailJS dashboard
 * 
 * @module emailConfig
 */

// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and get your credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (from EmailJS dashboard)
  SERVICE_ID: 'service_a4oz23n',
  
  // Your EmailJS Template ID (from EmailJS dashboard)
  TEMPLATE_ID: 'template_v5escgh',
  
  // Auto-reply template ID (sends confirmation to user)
  AUTO_REPLY_TEMPLATE_ID: 'template_u4synoa',
  
  // Your EmailJS Public Key (from EmailJS dashboard)
  PUBLIC_KEY: 'AeMJ-g_wuiT2HeLtz',
};

/**
 * Create Email Parameters
 * 
 * @description Transforms form data into EmailJS template parameters with timestamp.
 * Maps user-submitted data to template variables for email rendering.
 * 
 * @param {Object} formData - Raw form submission data
 * @param {string} formData.name - User's full name
 * @param {string} formData.email - User's email address
 * @param {string} [formData.subject] - Optional subject line (defaults to 'Contact Form Submission')
 * @param {string} formData.message - User's message content
 * 
 * @returns {Object} Template parameters for EmailJS
 * @returns {string} returns.from_name - User's name
 * @returns {string} returns.from_email - User's email
 * @returns {string} returns.subject - Email subject line
 * @returns {string} returns.message - User's message
 * @returns {string} returns.to_name - Your name (hardcoded: 'Daniel Durant')
 * @returns {string} returns.timestamp - Formatted timestamp (locale: en-US)
 * 
 * Timestamp Format:
 * - "Tue, Dec 15, 2025, 03:45 PM EST"
 * - Includes: weekday, month, day, year, time, timezone
 * 
 * @example
 * ```js
 * const params = createEmailParams({
 *   name: 'Jane Smith',
 *   email: 'jane@example.com',
 *   subject: 'Project Inquiry',
 *   message: 'I would like to discuss a project...'
 * });
 * 
 * // Returns:
 * // {
 * //   from_name: 'Jane Smith',
 * //   from_email: 'jane@example.com',
 * //   subject: 'Project Inquiry',
 * //   message: 'I would like to discuss a project...',
 * //   to_name: 'Daniel Durant',
 * //   timestamp: 'Sun, Dec 15, 2025, 03:45 PM EST'
 * // }
 * ```
 */
// Template parameters mapping
export const createEmailParams = (formData) => {
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  return {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject || 'Contact Form Submission',
    message: formData.message,
    to_name: 'Daniel Durant', // Your name to appear in email
    timestamp: timestamp,
  };
};
