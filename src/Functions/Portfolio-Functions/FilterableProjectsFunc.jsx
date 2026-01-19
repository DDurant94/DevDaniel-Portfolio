// src/Functions/Portfolio-Functions/FilterableProjectsFunc.jsx
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BentoProjects from './BentoProjectsFunc';
import FilterGroup from './FilterGroupFunc';
import useProjectFilters from './../../Hooks/Portfolio-Hooks/useProjectFilters';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/FilterableProjectsFunctionStyles.css';

/** FilterableProjects - Complete search and filter UI for portfolio */

const filterBarMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function FilterableProjects({
  allProjects = [],
  onProjectClick,
  externalFilters,
  onlyFilters = false,
}) {
  const filtersPanelRef = useRef(null);
  
  // Always call the hook, but use external filters if provided
  const internalFilters = useProjectFilters(allProjects);
  const {
    selectedTypes,
    search,
    showAllTypes,
    filtersVisible,
    setShowAllTypes,
    typeFilters,
    handleTypeSelect,
    clearAllFilters,
    filtered = [],
  } = externalFilters || internalFilters;

  const normalize = (v) =>
    v == null
      ? ''
      : String(v).toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

  const normalizedFiltered = filtered.map((p) => {
    const pTypeArr = Array.isArray(p.type)
      ? p.type
      : p.type
      ? p.type.split(',')
      : [];
    return pTypeArr.map(normalize);
  });

  const typeOptions = typeFilters
    .map(({ key, label }) => {
      const hasMatch = normalizedFiltered.some((pTypes) =>
        pTypes.includes(key)
      );
      return { key, label, disabled: selectedTypes.length > 0 && !hasMatch };
    })
    .sort((a, b) =>
      a.disabled === b.disabled
        ? a.label.localeCompare(b.label)
        : a.disabled
        ? 1
        : -1
    );

  const handleClearAll = () => {
    clearAllFilters();
    requestAnimationFrame(() => {
      if (filtersPanelRef.current) {
        filtersPanelRef.current.focus();
      }
    });
  };

  return (
    <div className="filterable-projects">
      {/* === Filter bar === */}
      <AnimatePresence>
        {filtersVisible && (
          <motion.div
            id="portfolio-filters-panel"
            className="filters-bar-top"
            role="region"
            aria-label="Project filters"
            aria-live="polite"
            tabIndex={-1}
            ref={filtersPanelRef}
            onKeyDown={(e) => {
              if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                handleClearAll();
              }
            }}
            {...filterBarMotion}
          >
            <FilterGroup
              label="Filters"
              options={showAllTypes ? typeOptions : typeOptions.slice(0, 8)}
              selected={selectedTypes}
              onSelect={handleTypeSelect}
              showToggle={typeFilters.length > 6}
              showAllTypes={showAllTypes}
              onToggleShowAll={() => setShowAllTypes(!showAllTypes)}
              showClear={(selectedTypes.length > 0 || search.trim() !== '')}
              onClear={handleClearAll}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Projects grid === */}
      {!onlyFilters && (
        <motion.div layout>
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>
                {search.trim() ? (
                  <>
                    No projects found for <strong>{search}</strong>.
                  </>
                ) : (
                  'No projects match the selected filters.'
                )}
              </p>
              <p>I haven't built that yet — maybe it's next on the list!</p>
            </div>
          ) : (
            <BentoProjects
              projects={filtered}
              onProjectClick={(project) => {
                if (typeof onProjectClick === 'function') {
                  onProjectClick(project);
                }
              }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

FilterableProjects.propTypes = {
  allProjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  externalFilters: PropTypes.object,
  onlyFilters: PropTypes.bool,
  hideSearch: PropTypes.bool,
};