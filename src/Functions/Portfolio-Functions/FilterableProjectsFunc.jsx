// src/Functions/Portfolio-Functions/FilterableProjectsFunc.jsx
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BentoProjects from './BentoProjectsFunc';
import FilterGroup from './FilterGroupFunc';
import useProjectFilters from './../../Hooks/Portfolio-Hooks/useProjectFilters';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/FilterableProjectsFunctionStyles.css';

/**
 * FilterableProjects - Complete search and filter UI for portfolio
 * 
 * Combines search input, type filters, and bento grid display with filter state
 * management. Supports external filter instance or creates its own. Includes
 * disabled state for filters with no matching results.
 * 
 * Features:
 * - Search bar with suggestions
 * - Type filters with checkboxes
 * - Disabled filters when no matches
 * - Smart filter sorting (enabled first, alphabetical)
 * - Clear all filters button
 * - Filter panel toggle (animated expand/collapse)
 * - Show more/less types (initial: 6, expanded: all)
 * - Keyboard accessibility (focus management)
 * - Only filters mode (hides project grid)
 * - External filter instance support
 * 
 * Filter Bar Animations:
 * - Height auto with smooth easing
 * - 0.3s duration
 * - Opacity fade
 * 
 * Type Filter Behavior:
 * - Disabled when selected filters would produce no results
 * - Sorted: enabled first, then alphabetical by label
 * - Visual disabled state with opacity + cursor
 * 
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.allProjects - All projects to filter
 * @param {Function} props.onProjectClick - Project card click handler
 * @param {Object} props.externalFilters - External filter instance (optional)
 * @param {boolean} props.onlyFilters - Show only filters, hide grid (default: false)
 * @param {boolean} props.hideSearch - Hide search bar (default: false)
 * 
 * @example
 * // Standalone with internal filters
 * <FilterableProjects
 *   allProjects={allProjects}
 *   onProjectClick={(project) => openOffCanvas(project)}
 * />
 * 
 * @example
 * // With external filter instance (shared across tabs)
 * const filters = useProjectFilters(projects);
 * <FilterableProjects
 *   allProjects={projects}
 *   externalFilters={filters}
 *   onProjectClick={handleClick}
 * />
 */

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
  hideSearch = false,
}) {
  const filtersPanelRef = useRef(null);
  const {
    selectedTypes,       // array of normalized keys
    search,
    showAllTypes,
    filtersVisible,
    setShowAllTypes,
    typeFilters,         // array of { key, label }
    handleTypeSelect,
    clearAllFilters,
    filtered = [],
  } = externalFilters || useProjectFilters(allProjects);

  const normalize = (v) =>
    v == null
      ? ''
      : String(v).toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

  // Build type options with disabled state if no matches
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
    // After clearing, move focus to the filters region so keyboard users can continue
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