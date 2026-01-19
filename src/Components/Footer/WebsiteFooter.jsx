/** WebsiteFooter - Site-wide footer with social links and resume viewer */

import useResumeViewer from '../../Hooks/Utility-Hooks/useResumeViewer.hook';
import './../../Styles/Component-Styles/Footer-Styles/FooterStyles.css';


const Footer = () => {
  const { openResume } = useResumeViewer();

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
              type="button"
              className="footer-resume-button"
              onClick={openResume}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openResume();
                }
              }}
              aria-label="View resume in fullscreen"
            >
              <i className="fa-solid fa-file-pdf" aria-hidden="true"></i>
              View Resume
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