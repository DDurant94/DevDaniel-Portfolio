/**
 * Portfolio Landing Page Component
 * 
 * @description Main portfolio showcase page featuring filterable project grid, search functionality,
 * category tabs, and detailed project off-canvas panels. Includes hero section with cloud zoom transition.
 * 
 * Features:
 * - Multi-tab filtering (All Projects, Web Development, AI/ML, Data Engineering)
 * - Real-time search with autocomplete suggestions
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Tag-based filtering system
 * - Project detail off-canvas panel
 * - Smooth animations and transitions
 * - Responsive grid layout
 * - Accessibility support (ARIA, focus management)
 * 
 * Search Features:
 * - Live suggestions as you type
 * - Keyboard navigation through suggestions
 * - Click-outside to close
 * - Escape key handling
 * - Highlighted suggestion tracking
 * 
 * @component
 * @requires framer-motion - Scroll animations and transitions
 * @requires ContactAsideContext - Contact panel integration
 * @requires ProjectOffCanvasContext - Project detail panel
 * @requires PortfolioFilterContext - Filter and search state management
 * 
 * @example
 * ```jsx
 * <PortfolioLandingPage />
 * ```
 */

// src/Pages/PortfolioLandingPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FadeInWhenVisible from '../../Components/Effects/Fade-Effect/FadeIn.jsx';
import { useContactAside } from '../../Context/Aside-Context/ContactAsideContext';
import { useProjectOffCanvas } from '../../Context/OffCanvas-Context/ProjectOffCanvasContext';
import { usePortfolioFilter } from '../../Context/Portfolio-Context/PortfolioFilterContext';

import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain.jsx';
import FilterableProjects from './../../Functions/Portfolio-Functions/FilterableProjectsFunc';
import ProjectOffCanvas from './../../Functions/Portfolio-Functions/ProjectOffCanvas';
import { allProjects } from '../../DataSets/Portfolio/Projects';
import './../../Styles/Page-Styles/Portfolio-Styles/PortfolioLandingStyles.css';
import PortfolioHero from './Portfolio-Components/Hero/PortfolioHero.jsx';
import CloudZoomTransition from '../../Components/Effects/Scroll-Effect/CloudZoomTransition.jsx';

export default function PortfolioLandingPage() {
  const { openContactAside } = useContactAside();
  const { openProject } = useProjectOffCanvas();
  const { activeTab, setActiveTab, activeFilters, clearAllFiltersForTab } = usePortfolioFilter();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const suggestionClickRef = useRef(false);
  const programmaticSearchRef = useRef(false);
  const hidingSuggestionsRef = useRef(false);
  const inputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const filterToggleRef = useRef(null);

  const location = useLocation();

  const suggestions = (showSuggestions && !hidingSuggestionsRef.current) ? activeFilters.getSuggestions(4) : [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // ✅ Reset filters when switching tabs
    clearAllFiltersForTab();
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    // Handle suggestion navigation while input focused
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        setHighlightedIndex(
          (prev) => (prev + direction + suggestions.length) % suggestions.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          const selectedTitle = suggestions[highlightedIndex].title;
          hidingSuggestionsRef.current = true;
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          programmaticSearchRef.current = true;
          activeFilters.setSearch(selectedTitle);
          setTimeout(() => { hidingSuggestionsRef.current = false; }, 0);
        }
      } else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        setHighlightedIndex(0);
        requestAnimationFrame(() => {
          document.getElementById('suggestion-0')?.focus();
        });
      }
    }

    if (e.key === 'Escape') {
      const hadSuggestions = showSuggestions;
      const hadFilters = activeFilters.filtersVisible;
      // Shift+Escape closes only suggestions if present
      if (e.shiftKey) {
        if (hadSuggestions) {
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        }
        return; // do not close filters on Shift+Esc
      }
      // Regular Escape: close suggestions first then filters
      if (hadSuggestions) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      } else if (hadFilters) {
        activeFilters.setFiltersVisible(false);
        requestAnimationFrame(() => {
          filterToggleRef.current?.focus();
        });
      }
    }
  };

  // ✅ Open project if navigated from featured carousel
  useEffect(() => {
    if (location.state?.projectTitle) {
      const project = allProjects.find(p => p.title === location.state.projectTitle);
      if (project) {
        // Small delay to ensure page has rendered
        setTimeout(() => {
          // Scroll to the projects section smoothly
          const projectsSection = document.getElementById('projects-intro-section');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // Then open the offcanvas after a brief delay
          setTimeout(() => {
            openProject(project);
          }, 300);
        }, 100);
        // Clear the state to prevent reopening on future navigations
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  // Context handles offcanvas state globally
  // No need to manage local state for offcanvas

  // Close suggestions when clicking outside the search wrapper
  useEffect(() => {
    if (!showSuggestions) return;
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const tabs = ['All', 'Professional', 'Personal'];
  const tabRefs = useRef([]);

  const onTabsKeyDown = (e) => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % tabs.length; break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length; break;
      case 'Home':
        nextIndex = 0; break;
      case 'End':
        nextIndex = tabs.length - 1; break;
      default:
        return;
    }
    e.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab);
    // Move focus after state updates flush
    requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus();
    });
  };

  return (
    <div id="portfolio-container" className="container-fluid-center">
      <SkipToMain targetId="portfolio-main-content" />
      
      <header id="portfolio-header">
        <div id="portfolio-hero-container">
          <div id="portfolio-hero">
            <PortfolioHero />
          </div>
        </div>
      </header>



      <main id="portfolio-main-content">
        <section id="projects-intro-section">
          <div id="projects-intro-container">
            <h1>&#60;Explore My Work /&#62;</h1>
            <p>
              Here's a curated selection of my work — from professional client
              projects to personal experiments that kept me up way too late.
            </p>
          </div>
        </section>
        {/* === Tabs & Search === */}
        <div
          className="portfolio-header custom-tabs tabs-row ds-tabs"
          role="tablist"
          aria-label="Portfolio Categories"
        >
          <ul className="nav nav-tabs" onKeyDown={onTabsKeyDown}>
            {tabs.map((tab, idx) => (
              <li className="project-nav-item" key={tab} role="presentation">
                {/* Accessibility Note: All tabs are tabbable (tabIndex=0) for easier discovery.
                    For WCAG best practice + reduced tab stops, a roving tabIndex could be re-enabled. */}
                <BaseButton
                  ref={el => tabRefs.current[idx] = el}
                  variant={activeTab === tab ? 'primary' : 'ghost'}
                  className={`project-nav-link pressable-edge pressable-glow-inset ${activeTab === tab ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`panel-${tab.toLowerCase()}`}
                  id={`tab-${tab.toLowerCase()}`}
                  tabIndex={0}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </BaseButton>
              </li>
            ))}
          </ul>

          <div className="ds-combobox" ref={searchWrapperRef}>
            <div className="search-input-container">
              <input
                ref={inputRef}
                type="text"
                placeholder={`Search ${activeTab} projects...`}
                value={activeFilters.search}
                onChange={(e) => {
                  activeFilters.setSearch(e.target.value);
                  if (!programmaticSearchRef.current) {
                    setShowSuggestions(true);
                  }
                  programmaticSearchRef.current = false;
                  activeFilters.setFiltersVisible(false);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  if (!suggestionClickRef.current) {
                    setShowSuggestions(false);
                  }
                  suggestionClickRef.current = false;
                }}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={showSuggestions}
                aria-activedescendant={highlightedIndex >=0 && showSuggestions ? `suggestion-${highlightedIndex}` : undefined}
                aria-controls="search-suggestions"
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul
                  id="search-suggestions"
                  className="combo-list show"
                  role="listbox"
                >
                  {suggestions.map((p, idx) => (
                    <li
                      id={`suggestion-${idx}`}
                      key={idx}
                      role="option"
                      aria-selected={idx === highlightedIndex}
                      tabIndex={-1}
                      className={idx === highlightedIndex ? 'active' : ''}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        suggestionClickRef.current = true;
                        hidingSuggestionsRef.current = true;
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                        programmaticSearchRef.current = true;
                        activeFilters.setSearch(p.title);
                        setTimeout(() => {
                          inputRef.current?.focus();
                          hidingSuggestionsRef.current = false;
                        }, 0);
                      }}
                      onMouseDown={(e) => { 
                        e.preventDefault(); // Prevent blur from firing
                        suggestionClickRef.current = true;
                        hidingSuggestionsRef.current = true;
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                        programmaticSearchRef.current = true;
                        activeFilters.setSearch(p.title);
                        setTimeout(() => {
                          inputRef.current?.focus();
                          hidingSuggestionsRef.current = false;
                        }, 0);
                      }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent any duplicate handling
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          hidingSuggestionsRef.current = true;
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                          programmaticSearchRef.current = true;
                          activeFilters.setSearch(p.title);
                          inputRef.current?.focus();
                          setTimeout(() => { hidingSuggestionsRef.current = false; }, 0);
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = (idx + 1) % suggestions.length;
                          setHighlightedIndex(next);
                          requestAnimationFrame(() => document.getElementById(`suggestion-${next}`)?.focus());
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = (idx - 1 + suggestions.length) % suggestions.length;
                          setHighlightedIndex(prev);
                          requestAnimationFrame(() => document.getElementById(`suggestion-${prev}`)?.focus());
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          if (e.shiftKey) {
                            // Close only suggestions
                            setShowSuggestions(false);
                            setHighlightedIndex(-1);
                            inputRef.current?.focus();
                          } else {
                            // Close suggestions; if filters panel open (and suggestions already closed) second Esc in input will handle it
                            setShowSuggestions(false);
                            setHighlightedIndex(-1);
                            inputRef.current?.focus();
                          }
                        } else if (e.key === 'Tab') {
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                        }
                      }}
                    >
                      {p.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="combo-toggle pressable pressable-edge"
              ref={filterToggleRef}
              aria-label={activeFilters.filtersVisible ? 'Hide filters' : 'Show filters'}
              aria-pressed={activeFilters.filtersVisible}
              aria-controls="portfolio-filters-panel"
              aria-expanded={activeFilters.filtersVisible}
              onClick={() => {
                const willShow = !activeFilters.filtersVisible;
                activeFilters.setFiltersVisible(willShow);
                if (willShow) {
                  requestAnimationFrame(() => {
                    document.getElementById('portfolio-filters-panel')?.focus();
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const willShow = !activeFilters.filtersVisible;
                  activeFilters.setFiltersVisible(willShow);
                  if (willShow) {
                    requestAnimationFrame(() => {
                      document.getElementById('portfolio-filters-panel')?.focus();
                    });
                  }
                } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length) {
                  e.preventDefault();
                  setHighlightedIndex(0);
                  // move focus to first suggestion after paint
                  requestAnimationFrame(() => {
                    const first = document.getElementById('suggestion-0');
                    first?.focus();
                  });
                }
              }}
            >
              {activeFilters.filtersVisible ? (
                <>
                  <i className="bi bi-filter-right" aria-hidden="true"></i>
                  <span className="combo-toggle-text">Hide Filters</span>
                </>
              ) : (
                <>
                  <i className="bi bi-filter" aria-hidden="true"></i>
                  <span className="combo-toggle-text">Filters</span>
                </>
              )}
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="search-suggestions"
                className="combo-list show"
                role="listbox"
              >
                {suggestions.map((p, idx) => (
                  <li
                    id={`suggestion-${idx}`}
                    key={idx}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                    tabIndex={-1}
                    className={idx === highlightedIndex ? 'active' : ''}
                    onMouseDown={() => { suggestionClickRef.current = true; }}
                    onClick={() => {
                      hidingSuggestionsRef.current = true;
                      setShowSuggestions(false);
                      setHighlightedIndex(-1);
                      programmaticSearchRef.current = true;
                      activeFilters.setSearch(p.title);
                      inputRef.current?.focus();
                      setTimeout(() => { hidingSuggestionsRef.current = false; }, 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        hidingSuggestionsRef.current = true;
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                        programmaticSearchRef.current = true;
                        activeFilters.setSearch(p.title);
                        inputRef.current?.focus();
                        setTimeout(() => { hidingSuggestionsRef.current = false; }, 0);
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const next = (idx + 1) % suggestions.length;
                        setHighlightedIndex(next);
                        requestAnimationFrame(() => document.getElementById(`suggestion-${next}`)?.focus());
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prev = (idx - 1 + suggestions.length) % suggestions.length;
                        setHighlightedIndex(prev);
                        requestAnimationFrame(() => document.getElementById(`suggestion-${prev}`)?.focus());
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        if (e.shiftKey) {
                          // Close only suggestions
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                          inputRef.current?.focus();
                        } else {
                          // Close suggestions; if filters panel open (and suggestions already closed) second Esc in input will handle it
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                          inputRef.current?.focus();
                        }
                      } else if (e.key === 'Tab') {
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                      }
                    }}
                  >
                    {p.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* === Project Sections === */}
        {activeTab === 'All' && (
          <FadeInWhenVisible
            as="section"
            id="panel-all"
            role="tabpanel"
            aria-labelledby="tab-all"
            tabIndex={0}
            className="mx-1"
            y={20}
            duration={0.5}>
            <p className="section-intro">
              A showcase of all of my projects. Take a look around and let me know what you think. I would greatly appreciate any feedback on my projects.
            </p>
            <FilterableProjects
              allProjects={allProjects}
              onProjectClick={openProject}
              externalFilters={activeFilters}
              hideSearch
            />
          </FadeInWhenVisible>
        )}

        {activeTab === 'Professional' && (
          <FadeInWhenVisible
            as="section"
            id="panel-professional"
            role="tabpanel"
            aria-labelledby="tab-professional"
            tabIndex={0}
            className="mx-1"
            y={20}
            duration={0.5}>
            <p className="section-intro">
              A showcase of my client and workplace projects — built to spec, on
              deadline, and with polish.
            </p>
            <FilterableProjects
              allProjects={allProjects.filter((p) => !p.isPersonal)}
              onProjectClick={openProject}
              externalFilters={activeFilters}
              hideSearch
            />
          </FadeInWhenVisible>
        )}

        {activeTab === 'Personal' && (
          <FadeInWhenVisible
            as="section"
            id="panel-personal"
            role="tabpanel"
            aria-labelledby="tab-personal"
            tabIndex={0}
            className="mx-1"
            y={20}
            duration={0.5}>
            <p className="section-intro">
              Experiments, side projects, and ideas I just had to try — where I
              play with new tech and concepts.
            </p>
              <FilterableProjects
                allProjects={allProjects.filter((p) => p.isPersonal)}
                onProjectClick={openProject}
                externalFilters={activeFilters}
                hideSearch
              />
          </FadeInWhenVisible>
        )}
      </main>

      <section id="projects-signoff">
        <p>
          Thanks for exploring my work — I'm always building something new, so
          check back soon.
        </p>

        <div id="projects-signoff-btn-container" className='mt-1'>
          <BaseButton
            variant="primary"
            size="md"
            to="/skills"
            ariaLabel="Explore my skills section via the skills page"
          >
            Explore My Skills
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            to="/about"
            ariaLabel="Learn more about me via the about me section"
          >
            Learn About Me
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            onClick={openContactAside}
            ariaLabel="Lets connect via the contact panel"
          >
            Lets Connect
          </BaseButton>
        </div>
      </section>
    </div>
  );
}
