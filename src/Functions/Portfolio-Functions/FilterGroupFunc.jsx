// src/Functions/Portfolio-Functions/FilterGroupFunc.jsx
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';

/** FilterGroup - Accessible multi-select filter chips with keyboard navigation */
export default function FilterGroup({ label, options, selected, onSelect, showToggle = false, showAllTypes = false, onToggleShowAll, showClear = false, onClear }) {
  const chipRefs = useRef([]);
  const enabledIndices = useMemo(() => options.reduce((acc, o, i) => { if (!o.disabled) acc.push(i); return acc; }, []), [options]);
  const firstSelectedIndex = useMemo(() => options.findIndex(o => selected.includes(o.key) && !o.disabled), [options, selected]);
  const initialIndex = firstSelectedIndex !== -1 ? firstSelectedIndex : (enabledIndices[0] ?? -1);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (activeIndex === -1 || activeIndex >= options.length || options[activeIndex]?.disabled) {
      const fallback = firstSelectedIndex !== -1 ? firstSelectedIndex : (enabledIndices[0] ?? -1);
      setActiveIndex(fallback);
    }
  }, [options, activeIndex, firstSelectedIndex, enabledIndices]);

  const focusIndex = (idx) => {
    if (idx == null || idx < 0 || idx >= options.length || options[idx]?.disabled) return;
    setActiveIndex(idx);
    const el = chipRefs.current[idx];
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  };

  const move = (dir) => {
    if (!enabledIndices.length) return;
    const cur = enabledIndices.indexOf(activeIndex);
    const nextPos = cur === -1 ? 0 : (cur + dir + enabledIndices.length) % enabledIndices.length;
    focusIndex(enabledIndices[nextPos]);
  };
  const handleClick = (e, key, isDisabled) => {
    if (isDisabled) return;

    const chip = e.currentTarget;
    const rect = chip.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    chip.style.setProperty('--ripple-x', `${x}px`);
    chip.style.setProperty('--ripple-y', `${y}px`);

    onSelect(key);
  };

  return (
    <div className="filter-group">
      <div className="filter-group-header">
        <span className="filter-group-label">{label}</span>
        {showClear && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onClear}
            aria-label="Clear all filters"
            aria-keyshortcuts="Alt+C"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All
          </button>
        )}
      </div>
      <div className="filter-chips-row">
        <ul
          className="filter-chips"
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          onKeyDown={(e) => {
            if (e.altKey && (e.key === 'm' || e.key === 'M')) {
              if (showToggle && typeof onToggleShowAll === 'function') {
                e.preventDefault();
                onToggleShowAll();
              }
              return;
            }

            switch (e.key) {
              case 'ArrowRight':
              case 'ArrowDown':
                e.preventDefault();
                move(1);
                break;
              case 'ArrowLeft':
              case 'ArrowUp':
                e.preventDefault();
                move(-1);
                break;
              case 'Home':
                e.preventDefault();
                if (enabledIndices.length) focusIndex(enabledIndices[0]);
                break;
              case 'End':
                e.preventDefault();
                if (enabledIndices.length) focusIndex(enabledIndices[enabledIndices.length - 1]);
                break;
              default:
                break;
            }
          }}
        >
          {options.map((option, idx) => {
          const { key, label, disabled } = option;
          const isSelected = selected.includes(key);

            return (
              <li
                key={key}
                className={`filter-chip ${isSelected ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                style={{ '--index': idx }}
                role="option"
                aria-selected={isSelected}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : (idx === activeIndex ? 0 : -1)}
                ref={(el) => { chipRefs.current[idx] = el; }}
                onFocus={() => { if (!disabled && activeIndex !== idx) setActiveIndex(idx); }}
                onClick={(e) => handleClick(e, key, disabled)}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelect(key);
                  }
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
        {showToggle && (
          <button
            type="button"
            className="filter-toggle"
            onClick={onToggleShowAll}
            aria-label={showAllTypes ? 'Show fewer filter options' : 'Show more filter options'}
            aria-expanded={showAllTypes}
            data-expanded={showAllTypes}
            aria-keyshortcuts="Alt+M"
          >
            {showAllTypes ? 'Less' : 'More'}
          </button>
        )}
      </div>
    </div>
  );
};

FilterGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  showToggle: PropTypes.bool,
  showAllTypes: PropTypes.bool,
  onToggleShowAll: PropTypes.func,
  showClear: PropTypes.bool,
  onClear: PropTypes.func,
};
