/**
 * WebsiteFooter Component
 * 
 * @description Site-wide footer with social media links, resume download, and copyright information.
 * Provides consistent footer across all pages with external link safety and accessibility.
 * 
 * Features:
 * - Social media links (LinkedIn, GitHub, Email, YouTube)
 * - Resume download with dual action (view + download)
 * - External links with rel="noopener noreferrer" security
 * - ARIA labels for screen readers
 * - Icon-based social links with Font Awesome
 * - Responsive layout
 * 
 * Social Links:
 * - LinkedIn: Professional profile
 * - GitHub: Code repositories
 * - Email: Direct contact via mailto
 * - YouTube: Tutorial videos and content
 * 
 * Resume Action:
 * - Opens PDF in new tab for viewing
 * - Simultaneously triggers download
 * - Uses temporary anchor element for download
 * 
 * @component
 * 
 * @example
 * ```jsx
 * // In main App layout
 * <main>
 *   <Routes />
 * </main>
 * <WebsiteFooter />
 * ```
 */

import './../../Styles/Component-Styles/Footer-Styles/FooterStyles.css';


const Footer = () => {

  /**
   * Handles resume download and view
   * Opens PDF in new tab while triggering download
   */
  function handleResumeClick() {
    const resumeUrl = "/Resume/DanielDurantResume.pdf";
    window.open(resumeUrl, "_blank");
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "DanielDurantResume.pdf";
    link.textContent = "Resume";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return(
    <div className="footer-container">
      <footer id="footer">
        <div className="footer-content">
          
          {/* Social Links */}
          <div id='footer-socials-container'>
            <div id="footer-social-list">
              <div className="social-icon">
                <a href="https://www.linkedin.com/in/daniel-durant-30a0252b9" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                </a>
              </div>
              <div className="social-icon">
                <a href="https://github.com/DDurant94" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <i className="fa-brands fa-github" aria-hidden="true"></i>
                </a>
              </div>
              <div className="social-icon">
                <a href="mailto:dannyjdurant@gmail.com" aria-label="Email Contact">
                  <i className="fa-brands fa-google" aria-hidden="true"></i>
                </a>
              </div>
              <div className="social-icon">
                <a href="https://www.youtube.com/@CodingWithDevDaniel" target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel">
                  <i className="fa-brands fa-youtube" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Resume Download */}
          <div className="footer-resume">
            <button 
              className="footer-resume-button"
              onClick={handleResumeClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleResumeClick();
                }
              }}
              aria-label="Download resume as PDF"
            >
              <i className="fa-solid fa-download" aria-hidden="true"></i>
              Download Resume
            </button>
          </div>

          {/* Footer Info */}
          <div className="footer-info">
            <div className="footer-links">
              <a href="mailto:dannyjdurant@gmail.com?subject=Hello Daniel, I'd like to work with you!" className="footer-email">
                dannyjdurant@gmail.com
              </a>
            </div>
            <div className="footer-copyright">
              <p>&copy; 2025 DevDaniel.tech. All Rights Reserved.</p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;