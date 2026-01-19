import PropTypes from 'prop-types';
import { useSearchSuggestions } from '../../../../Hooks/Portfolio-Hooks/useSearchSuggestions';

/** SearchWithSuggestions - Search input with autocomplete dropdown and keyboard navigation */
export default function SearchWithSuggestions({
  value,
  onChange,
  suggestions: rawSuggestions,
  placeholder,
  searchWrapperRef,
  onFiltersToggle,
  filtersVisible,
  filterToggleRef
}) {
  const {
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    handleSuggestionClick,
    handleSuggestionKeyDown,
    inputRef,
    suggestionClickRef,
    programmaticSearchRef,
    hidingSuggestionsRef
  } = useSearchSuggestions({
    onSelectSuggestion: onChange,
    searchWrapperRef
  });

  const suggestions = (showSuggestions && !hidingSuggestionsRef.current) ? rawSuggestions : [];

  return (
    <div className="ds-combobox util-flex util-items-center" ref={searchWrapperRef}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!programmaticSearchRef.current) {
              setShowSuggestions(true);
            }
            programmaticSearchRef.current = false;
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            if (!suggestionClickRef.current) {
              setShowSuggestions(false);
            }
            suggestionClickRef.current = false;
          }}
          onKeyDown={(e) => handleKeyDown(e, rawSuggestions)}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-activedescendant={highlightedIndex >= 0 && showSuggestions ? `suggestion-${highlightedIndex}` : undefined}
          aria-controls="search-suggestions"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul id="search-suggestions" className="combo-list show" role="listbox">
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
                  handleSuggestionClick(p.title);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(p.title);
                }}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => handleSuggestionKeyDown(e, idx, rawSuggestions)}
              >
                {p.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="combo-toggle util-flex-center pressable pressable-edge"
        ref={filterToggleRef}
        aria-label={filtersVisible ? 'Hide filters' : 'Show filters'}
        aria-pressed={filtersVisible}
        aria-controls="portfolio-filters-panel"
        aria-expanded={filtersVisible}
        onClick={onFiltersToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFiltersToggle();
          } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length) {
            e.preventDefault();
            setHighlightedIndex(0);
            requestAnimationFrame(() => {
              document.getElementById('suggestion-0')?.focus();
            });
          }
        }}
      >
        {filtersVisible ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5zm0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5zm0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5z"/>
            </svg>
            <span className="combo-toggle-text">Hide Filters</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <span className="combo-toggle-text">Filters</span>
          </>
        )}
      </button>
    </div>
  );
}

SearchWithSuggestions.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  searchWrapperRef: PropTypes.object.isRequired,
  onFiltersToggle: PropTypes.func.isRequired,
  filtersVisible: PropTypes.bool.isRequired,
  filterToggleRef: PropTypes.object.isRequired
};
