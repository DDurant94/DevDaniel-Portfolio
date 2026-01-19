/**
 * usePortfolioFilter Hook - Access portfolio filter state
 * 
 * @hook
 * @example
 * import { usePortfolioFilter } from './usePortfolioFilter';
 * 
 * const { activeTab, setActiveTab, activeFilters } = usePortfolioFilter();
 */
import { useContext } from 'react';
import { PortfolioFilterContext } from './PortfolioFilterContext';

export const usePortfolioFilter = () => useContext(PortfolioFilterContext);
