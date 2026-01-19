import { useState, useMemo } from 'react';

/**
 * useProjectFilters - Advanced search and filtering for portfolio projects
 * 
 * Provides intelligent project filtering with fuzzy search, type filters,
 * and smart suggestions. Handles text normalization, scoring, and multi-criteria
 * filtering for a polished portfolio browsing experience.
 * 
 * Features:
 * - Text search (title, techs, concepts)
 * - Multi-select type filters (Web App, Mobile, etc.)
 * - Smart suggestions with relevance scoring
 * - Normalization (case-insensitive, special char removal)
 * - Suggestion types: project titles, techs, concepts
 * - Show/hide filter panel state
 * - Clear all filters action
 * 
 * Search Scoring:
 * 1. Title starts with search (best match)
 * 2. Word in title matches search
 * 3. Title contains search
 * 4. Tech starts with search
 * 5. Tech contains search
 * 6. Concept starts with search
 * 7. Concept contains search
 * 
 * @hook
 * @param {Array<Object>} projects - Array of project objects
 * @param {string} projects[].title - Project title
 * @param {string|string[]} projects[].type - Project type(s)
 * @param {Object} projects[].body - Project details
 * @param {string[]} projects[].body.techs - Technologies used
 * @param {string[]} projects[].body.concepts - Concepts/techniques
 * 
 * @returns {Object} Filter state and actions
 * @returns {string} search - Current search text
 * @returns {Function} setSearch - Update search text
 * @returns {string[]} selectedTypes - Selected type filter keys
 * @returns {Function} setSelectedTypes - Update type selections
 * @returns {boolean} filtersVisible - Filter panel visibility
 * @returns {Function} setFiltersVisible - Toggle filter panel
 * @returns {boolean} showAllTypes - Show all types or truncated
 * @returns {Function} setShowAllTypes - Toggle show all types
 * @returns {Array<{key: string, label: string}>} typeFilters - Available type filters
 * @returns {Function} handleTypeSelect - Toggle type selection
 * @returns {Function} clearAllFilters - Reset all filters
 * @returns {Array<Object>} filtered - Filtered project results
 * @returns {Function} getSuggestions - Get search suggestions (limit=8)
 * 
 * @example
 * const {
 *   search,
 *   setSearch,
 *   selectedTypes,
 *   handleTypeSelect,
 *   filtered,
 *   getSuggestions
 * } = useProjectFilters(projects);
 * 
 * // Search input
 * <input value={search} onChange={(e) => setSearch(e.target.value)} />
 * 
 * // Suggestions
 * {getSuggestions(5).map(s => (
 *   <div key={s.title}>{s.type}: {s.title}</div>
 * ))}
 * 
 * // Filtered results
 * {filtered.map(project => <ProjectCard {...project} />)}
 */
export default function useProjectFilters(projects = []) {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  // --- Normalization ---
  const normalize = (val) =>
    val == null
      ? ''
      : String(val)
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, ' ')
          .trim()
          .replace(/\s+/g, ' ');

  // --- Scoring for suggestions ---
  const scoreMatch = (title, normSearch) => {
    const normTitle = normalize(title);
    const words = normTitle.split(' ');

    if (normTitle.startsWith(normSearch)) return 1;
    if (words.includes(normSearch)) {
      return 2 + words.indexOf(normSearch) / 10;
    }
    if (normTitle.includes(normSearch)) return 3;
    return Infinity;
  };

  const typeFilters = useMemo(() => {
    const types = new Map();
    projects.forEach((p) => {
      const arr = Array.isArray(p.type)
        ? p.type
        : p.type
        ? p.type.split(',')
        : [];
      arr.forEach((t) => {
        const label = t.trim();
        const key = normalize(label);
        if (!types.has(key)) {
          types.set(key, label);
        }
      });
    });
    return Array.from(types.entries()).map(([key, label]) => ({
      key,    // normalized
      label,  // original
    }));
  }, [projects]);

  // --- Filtered projects ---
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const titleMatch = normalize(p.title).includes(normalize(search));
      const techMatch = normalize(p.body.techs).includes(normalize(search));
      const conceptMatch = normalize(p.body.concepts).includes(normalize(search));

      const matchesSearch =
        !search || titleMatch || techMatch || conceptMatch;

      const projectTypes = Array.isArray(p.type)
        ? p.type.map(normalize)
        : p.type
        ? p.type.split(',').map(normalize)
        : [];

      const matchesTypes =
        selectedTypes.length === 0 ||
        selectedTypes.every((t) => projectTypes.includes(t));

      return matchesSearch && matchesTypes;
    });
  }, [projects, search, selectedTypes]);

  // --- Suggestions (smarter ranking) ---
  const getSuggestions = (limit = 8) => {
    if (!search) return [];
    const normSearch = normalize(search);

    const results = [];

    projects.forEach((p) => {
      const score = scoreMatch(p.title, normSearch);
      if (score < Infinity) {
        results.push({ type: 'project', title: p.title, project: p, score });
      }

      // Techs
      (Array.isArray(p.body?.techs) ? p.body.techs : []).forEach((t) => {
        const normT = normalize(t);
        if (normT.startsWith(normSearch)) {
          results.push({ type: 'tech', title: t, project: p, score: 4 });
        } else if (normT.includes(normSearch)) {
          results.push({ type: 'tech', title: t, project: p, score: 5 });
        }
      });

      // Concepts
      (Array.isArray(p.body?.concepts) ? p.body.concepts : []).forEach((c) => {
        const normC = normalize(c);
        if (normC.startsWith(normSearch)) {
          results.push({ type: 'concept', title: c, project: p, score: 6 });
        } else if (normC.includes(normSearch)) {
          results.push({ type: 'concept', title: c, project: p, score: 7 });
        }
      });
    });

    // Deduplicate + sort
    const seen = new Set();
    const unique = results.filter((s) => {
      const key = `${s.type}:${s.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title));

    return unique.slice(0, limit);
  };

  // --- Handlers ---
  const handleTypeSelect = (key) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedTypes([]);
  };

  return {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    filtersVisible,
    setFiltersVisible,
    showAllTypes,
    setShowAllTypes,
    typeFilters,
    handleTypeSelect,
    clearAllFilters,
    filtered,
    getSuggestions,
  };
}