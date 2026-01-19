/**
 * Portfolio Landing Page - Filterable projects with search, category tabs, and detail panels
 */

// src/Pages/PortfolioLandingPage.jsx
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FadeInWhenVisible from '../../Components/Effects/Fade-Effect/FadeIn.jsx';
import { useContactAside } from '../../Context/Aside-Context/useContactAside';
import { useProjectOffCanvas } from '../../Context/OffCanvas-Context/useProjectOffCanvas';
import { usePortfolioFilter } from '../../Context/Portfolio-Context/usePortfolioFilter';

import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain.jsx';
import FilterableProjects from './../../Functions/Portfolio-Functions/FilterableProjectsFunc';
import SearchWithSuggestions from '../../Components/Navigation/Portfolio-Navigation/SearchNavigation/SearchWithSuggestions.jsx';
import TabNavigation from '../../Components/Navigation/Portfolio-Navigation/TabNavigation/TabNavigation.jsx';
import { allProjects } from '../../DataSets/Portfolio/Projects';
import './../../Styles/Page-Styles/Portfolio-Styles/PortfolioLandingStyles.css';
import PageHero from '../../Components/UI/PageHero/PageHero.jsx';

export default function PortfolioLandingPage() {
  const { openContactAside } = useContactAside();
  const { openProject } = useProjectOffCanvas();
  const { activeTab, setActiveTab, activeFilters, clearAllFiltersForTab } = usePortfolioFilter();
  
  const searchWrapperRef = useRef(null);
  const filterToggleRef = useRef(null);
  const deepLinkHandledRef = useRef(false);
  const location = useLocation();

  const tabs = useMemo(() => ['All', 'Professional', 'Personal'], []);
  const suggestions = activeFilters.getSuggestions(4);

  const professionalProjects = useMemo(
    () => allProjects.filter((p) => !p.isPersonal),
    []
  );

  const personalProjects = useMemo(
    () => allProjects.filter((p) => p.isPersonal),
    []
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    clearAllFiltersForTab();
  }, [setActiveTab, clearAllFiltersForTab]);

  const handleFiltersToggle = useCallback(() => {
    const willShow = !activeFilters.filtersVisible;
    activeFilters.setFiltersVisible(willShow);
    if (willShow) {
      requestAnimationFrame(() => {
        document.getElementById('portfolio-filters-panel')?.focus();
      });
    }
  }, [activeFilters]);

  // Handle deep linking to specific project
  useEffect(() => {
    if (location.state?.project && location.state?.openImmediately && !deepLinkHandledRef.current) {
      deepLinkHandledRef.current = true;
      const project = location.state.project;
      
      // Open project immediately without scrolling
      setTimeout(() => {
        openProject(project);
      }, 100);
      
      // Clean up state
      window.history.replaceState({}, document.title);
    } else if (location.state?.projectTitle && !deepLinkHandledRef.current) {
      // Legacy support for title-based navigation
      deepLinkHandledRef.current = true;
      const project = allProjects.find(p => p.title === location.state.projectTitle);
      if (project) {
        setTimeout(() => {
          const projectsSection = document.getElementById('projects-intro-section');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setTimeout(() => {
            openProject(project);
          }, 300);
        }, 100);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, openProject]);

  return (
    <div id="portfolio-container">
      <SkipToMain targetId="portfolio-main-content" />
      
      <header id="portfolio-header" className="util-w-full">
        <div id="portfolio-hero-container">
          <div id="portfolio-hero">
            <PageHero
              id="portfolio-hero"
              title="My Projects"
              subtitle="Projects spanning client solutions and personal innovation."
            />
          </div>
        </div>
      </header>

      <main id="portfolio-main-content">
        <section id="projects-intro-section" className="util-text-center util-flex-center">
          <div id="projects-intro-container">
            <h1>Explore My Work</h1>
            <p className="util-max-w-compact">
              Here's a curated selection of my work — from professional client
              projects to personal experiments that kept me up way too late.
            </p>
          </div>
        </section>

        {/* === Tabs & Search === */}
        <div className="portfolio-header custom-tabs tabs-row ds-tabs">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <SearchWithSuggestions
            value={activeFilters.search}
            onChange={(value) => {
              activeFilters.setSearch(value);
              activeFilters.setFiltersVisible(false);
            }}
            suggestions={suggestions}
            placeholder={`Search ${activeTab} projects...`}
            searchWrapperRef={searchWrapperRef}
            onFiltersToggle={handleFiltersToggle}
            filtersVisible={activeFilters.filtersVisible}
            filterToggleRef={filterToggleRef}
          />
        </div>

        {/* === Project Sections === */}
        {activeTab === 'All' && (
          <FadeInWhenVisible
            as="section"
            id="panel-all"
            role="tabpanel"
            aria-labelledby="tab-all"
            tabIndex={0}
            className="util-mx-sm"
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
            className="util-mx-sm"
            y={20}
            duration={0.5}>
            <p className="section-intro">
              A showcase of my client and workplace projects — built to spec, on
              deadline, and with polish.
            </p>
            <FilterableProjects
              allProjects={professionalProjects}
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
            className="util-mx-sm"
            y={20}
            duration={0.5}>
            <p className="section-intro">
              Experiments, side projects, and ideas I just had to try — where I
              play with new tech and concepts.
            </p>
              <FilterableProjects
                allProjects={personalProjects}
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

        <div id="projects-signoff-btn-container" className='util-mt-sm'>
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
