import { createContext, useState, useCallback, useMemo } from 'react';
import useProjectFilters from '../../Hooks/Portfolio-Hooks/useProjectFilters';
import { allProjects } from '../../DataSets/Portfolio/Projects';

/**
 * PortfolioFilterContext - Tab-based project filtering state management
 * 
 * Manages three separate filter instances for portfolio tabs (All, Professional, Personal).
 * Each tab maintains independent search and type filter state. Provides centralized
 * access to the active filter set based on selected tab.
 * 
 * Features:
 * - Three independent filter instances (all, professional, personal)
 * - Active tab tracking ('All', 'Professional', 'Personal')
 * - Automatic dataset filtering (isPersonal flag)
 * - Active filter set switching based on tab
 * - Clear filters action for active tab
 * - Memoized values for performance
 * 
 * Filter Instances:
 * - allFilters: All projects (no filtering)
 * - professionalFilters: Projects where isPersonal = false
 * - personalFilters: Projects where isPersonal = true
 * 
 * Each filter instance includes:
 * - search, setSearch
 * - selectedTypes, setSelectedTypes
 * - filtered (results)
 * - typeFilters (available types)
 * - getSuggestions
 * - clearAllFilters
 * 
 * @context
 * @example
 * import { usePortfolioFilter } from './PortfolioFilterContext';
 * 
 * const { activeTab, setActiveTab, activeFilters } = usePortfolioFilter();
 * 
 * <Tabs value={activeTab} onChange={setActiveTab}>
 *   <Tab value="All" />
 *   <Tab value="Professional" />
 *   <Tab value="Personal" />
 * </Tabs>
 * 
 * <SearchInput 
 *   value={activeFilters.search}
 *   onChange={(e) => activeFilters.setSearch(e.target.value)}
 * />
 * 
 * {activeFilters.filtered.map(project => <ProjectCard {...project} />)}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const PortfolioFilterContext = createContext({
  activeTab: 'All',
  allFilters: {},
  professionalFilters: {},
  personalFilters: {},
  activeFilters: {},
  setActiveTab: () => {},
  clearAllFiltersForTab: () => {}
});

export const PortfolioFilterProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('All');

  const allFilters = useProjectFilters(allProjects);
  const professionalFilters = useProjectFilters(
    allProjects.filter((p) => !p.isPersonal)
  );
  const personalFilters = useProjectFilters(
    allProjects.filter((p) => p.isPersonal)
  );

  const activeFilters = useMemo(() => {
    switch (activeTab) {
      case 'Professional':
        return professionalFilters;
      case 'Personal':
        return personalFilters;
      default:
        return allFilters;
    }
  }, [activeTab, allFilters, professionalFilters, personalFilters]);

  const clearAllFiltersForTab = useCallback(() => {
    activeFilters.clearAllFilters();
  }, [activeFilters]);

  const value = useMemo(() => ({
    activeTab,
    allFilters,
    professionalFilters,
    personalFilters,
    activeFilters,
    setActiveTab,
    clearAllFiltersForTab
  }), [
    activeTab,
    allFilters,
    professionalFilters,
    personalFilters,
    activeFilters,
    clearAllFiltersForTab
  ]);

  return (
    <PortfolioFilterContext.Provider value={value}>
      {children}
    </PortfolioFilterContext.Provider>
  );
};
