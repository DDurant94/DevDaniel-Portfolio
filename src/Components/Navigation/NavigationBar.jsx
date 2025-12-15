/**
 * NavigationBar Component
 * 
 * @description Main navigation header with responsive mobile menu, theme toggle, and social links.
 * Features include:
 * - Sticky navigation that responds to scroll position
 * - Responsive mobile hamburger menu with focus trap
 * - Active route highlighting
 * - Theme toggle integration
 * - Contact aside trigger
 * - Social media links
 * - Full keyboard navigation and ARIA support
 * 
 * @component
 * @requires react-router-dom - For navigation and route detection
 * @requires NavigationContext - For menu state management
 * @requires ScrollContext - For scroll position detection
 * @requires ContactAsideContext - For contact panel control
 * 
 * @example
 * ```jsx
 * <NavigationBar />
 * ```
 */

import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import NavigationBrand from './NavigationBar-Components/NavigationBrand';
import ThemeToggle from './NavigationBar-Components/ThemeToggle/ThemeToggle';
import { useContactAside } from '../../Context/Aside-Context/ContactAsideContext';
import { useScroll } from '../../Context/Scroll-Context/ScrollContext';
import { useNavigation } from '../../Context/Navigation-Context/NavigationContext';
import '../../Styles/Component-Styles/NavigationBar-Styles/NavigationStyles.css';

function NavigationBar() {
  const location = useLocation();
  const { openContactAside } = useContactAside();
  const { isScrolled } = useScroll();
  const { mobileMenuOpen, themeExpanded, toggleMobileMenu, toggleTheme, closeMobileMenu } = useNavigation();
  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  /**
   * Focus Trap for Mobile Menu
   * Manages keyboard navigation within mobile menu, including:
   * - Tab cycling through all focusable elements
   * - Escape key to close menu
   * - Focus restoration when closing
   */
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      // Close on Escape
      if (e.key === 'Escape') {
        closeMobileMenu();
        menuToggleRef.current?.focus();
        return;
      }

      // Focus cycling between toggle and all menu elements
      if (e.key === 'Tab') {
        // Get all focusable elements inside the menu including dynamically rendered ones
        const menuFocusable = mobileMenuRef.current?.querySelectorAll(
          'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), [role="button"]:not([tabindex="-1"])'
        );
        const focusableElements = menuFocusable ? Array.from(menuFocusable) : [];
        
        // Include the toggle button in the cycle
        const allFocusable = [menuToggleRef.current, ...focusableElements].filter(Boolean);
        const currentIndex = allFocusable.indexOf(document.activeElement);
        
        if (currentIndex !== -1) {
          e.preventDefault();
          
          if (e.shiftKey) {
            // Shift+Tab: go backwards
            const prevIndex = currentIndex === 0 ? allFocusable.length - 1 : currentIndex - 1;
            allFocusable[prevIndex]?.focus();
          } else {
            // Tab: go forwards
            const nextIndex = currentIndex === allFocusable.length - 1 ? 0 : currentIndex + 1;
            allFocusable[nextIndex]?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  /** Navigation menu items configuration */
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { label: 'Contact' } // No path - triggers aside panel instead of routing
  ];

  /** Social media links with Font Awesome icons */
  const socialLinks = [
    { icon: 'fa-brands fa-linkedin', url: 'https://www.linkedin.com/in/daniel-durant-30a0252b9', label: 'LinkedIn Profile' },
    { icon: 'fa-brands fa-github', url: 'https://github.com/DDurant94', label: 'GitHub Profile' },
    { icon: 'fa-brands fa-google', url: 'mailto:dannyjdurant@gmail.com', label: 'Email Contact' },
    { icon: 'fa-brands fa-youtube', url: 'https://www.youtube.com/@CodingWithDevDaniel', label: 'YouTube Channel' },
  ];

  /**
   * Handles navigation item clicks
   * Closes mobile menu for normal links, triggers contact aside for Contact item
   */  const handleNavClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      {/* Desktop Sidebar - Left side */}
      <aside className="left-sidebar desktop-only">
        <div className="sidebar-background" />
        
        <Link to="/" className="sidebar-logo" aria-label="Home">
          <NavigationBrand />
        </Link>
        
        <nav className={`sidebar-nav ${isScrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            !item.path ? (
              <button
                key={item.label}
                className="nav-link"
                aria-label={item.label}
                onClick={openContactAside}
                type="button"
              >
                <span className="nav-text">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span className="nav-text">{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        <div className="sidebar-footer">
          <ul className="sidebar-social-list">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-social-icon"
                  aria-label={link.label}
                >
                  <i className={link.icon}></i>
                </a>
              </li>
            ))}
          </ul>

          <div
            className="sidebar-theme-container"
            data-expanded={themeExpanded}
          >
            <button
              className="sidebar-theme-toggle-button"
              onClick={toggleTheme}
              aria-label="Toggle theme options"
              aria-expanded={themeExpanded}
            >
              <span className="theme-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v2m0 14v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2m14 0h2M4.93 19.07l1.41-1.41" />
                  <path d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8z" />
                </svg>
              </span>
            </button>

            {themeExpanded && (
              <div className="sidebar-theme-content">
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Navigation - Top bar + Full-screen menu */}
      <div className="mobile-navbar mobile-only">
        <div className={`mobile-navbar-viewport ${mobileMenuOpen ? 'menu-open' : ''}`}>
          <Link 
            to="/" 
            className={`mobile-logo-container ${mobileMenuOpen ? 'menu-open' : ''}`}
            aria-label="Home"
            tabIndex="0"
          >
            <NavigationBrand />
          </Link>

          <button
            ref={menuToggleRef}
            className="mobile-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleMobileMenu();
            }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg 
              className="menu-icon-open" 
              width="18" 
              height="9" 
              viewBox="0 0 18 9" 
              fill="none"
            >
              <path d="M1.08032 1.36H16.6637" stroke="currentColor" strokeLinecap="round" />
              <path d="M1.08032 8.20375H16.6637" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <svg 
              className="menu-icon-close" 
              width="18" 
              height="18" 
              viewBox="0 0 18 18" 
              fill="none"
            >
              <path 
                d="M17.4854 1.92969L10.4141 9L17.4854 16.0713L16.0713 17.4854L9 10.4141L1.92871 17.4854L0.514648 16.0713L7.58594 9L0.514648 1.92871L1.92871 0.514648L9 7.58594L16.0713 0.514648L17.4854 1.92969Z" 
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Full-screen menu overlay */}
        <div 
          ref={mobileMenuRef}
          className={`mobile-menu-wrapper ${mobileMenuOpen ? 'menu-open' : ''}`}
          inert={!mobileMenuOpen ? true : undefined}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mobile-menu-content">
            <div className="mobile-safearea"></div>
            
            <div className="mobile-main-links">
              <p className="mobile-links-label">Explore</p>
              {navItems.map((item) => (
                !item.path ? (
                  <button
                    key={item.label}
                    className="mobile-nav-link"
                    onClick={() => {
                      handleNavClick();
                      openContactAside();
                    }}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    type="button"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 6 14" 
                      className="mobile-link-slash"
                    >
                      <path fill="currentColor" d="M.42 13.425 4.185.54H5.43L1.665 13.425z" />
                    </svg>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
                    onClick={handleNavClick}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 6 14" 
                      className="mobile-link-slash"
                    >
                      <path fill="currentColor" d="M.42 13.425 4.185.54H5.43L1.665 13.425z" />
                    </svg>
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            <div className="mobile-bottom-options">
              <div className="mobile-social-links">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-social-link"
                    onClick={handleNavClick}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                  >
                    <i className={link.icon}></i>
                  </a>
                ))}
              </div>

              <div className="mobile-theme-toggle">
                <div 
                  style={mobileMenuOpen ? {} : { pointerEvents: 'none' }}
                  ref={(el) => {
                    if (el && !mobileMenuOpen) {
                      // Set tabindex on all focusable elements inside when menu is closed
                      const focusable = el.querySelectorAll('button, input, [role="button"]');
                      focusable.forEach(elem => elem.setAttribute('tabindex', '-1'));
                    } else if (el && mobileMenuOpen) {
                      // Restore tabindex when menu is open
                      const focusable = el.querySelectorAll('button, input, [role="button"]');
                      focusable.forEach(elem => elem.setAttribute('tabindex', '0'));
                    }
                  }}
                >
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;