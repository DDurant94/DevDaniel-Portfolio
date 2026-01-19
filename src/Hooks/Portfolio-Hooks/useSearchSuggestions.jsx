import { useState, useRef, useEffect } from 'react';

/**
 * useSearchSuggestions - Custom hook for search autocomplete with keyboard navigation
 * 
 * @description Manages search suggestions state, keyboard navigation, and click-outside behavior.
 * Supports arrow key navigation, Enter to select, Escape to close, and Tab to focus suggestions.
 * 
 * Features:
 * - Show/hide suggestions dropdown
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape, Tab)
 * - Highlighted suggestion tracking
 * - Click outside detection
 * - Programmatic search flag (prevents re-showing suggestions)
 * - Suggestion click handling
 * 
 * @param {Object} options
 * @param {Function} options.onSelectSuggestion - Callback when suggestion is selected
 * @param {HTMLElement} options.searchWrapperRef - Ref to search wrapper for click-outside detection
 * @returns {Object} - Search suggestion state and handlers
 * 
 * @example
 * const {
 *   showSuggestions,
 *   setShowSuggestions,
 *   highlightedIndex,
 *   setHighlightedIndex,
 *   handleKeyDown,
 *   handleSuggestionClick,
 *   inputRef,
 *   suggestionClickRef
 * } = useSearchSuggestions({
 *   onSelectSuggestion: (title) => setSearch(title),
 *   searchWrapperRef
 * });
 */
export function useSearchSuggestions({ onSelectSuggestion, searchWrapperRef }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const suggestionClickRef = useRef(false);
  const programmaticSearchRef = useRef(false);
  const hidingSuggestionsRef = useRef(false);
  const inputRef = useRef(null);

  // Close suggestions when clicking outside
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
  }, [showSuggestions, searchWrapperRef]);

  // Hide suggestions and select suggestion
  const selectSuggestion = (title) => {
    hidingSuggestionsRef.current = true;
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    programmaticSearchRef.current = true;
    onSelectSuggestion(title);
    setTimeout(() => {
      inputRef.current?.focus();
      hidingSuggestionsRef.current = false;
    }, 0);
  };

  // Handle keyboard navigation in input
  const handleKeyDown = (e, suggestions = []) => {
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
          selectSuggestion(suggestions[highlightedIndex].title);
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
      if (showSuggestions) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
  };

  // Handle suggestion click (both mouse and touch)
  const handleSuggestionClick = (title) => {
    suggestionClickRef.current = true;
    selectSuggestion(title);
  };

  // Handle suggestion keyboard navigation
  const handleSuggestionKeyDown = (e, idx, suggestions = []) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectSuggestion(suggestions[idx].title);
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
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    } else if (e.key === 'Tab') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return {
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
  };
}
