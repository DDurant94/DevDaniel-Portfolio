import React from 'react';
import ThemeToggle from './ThemeToggle';

/**
 * ThemeToggleContainer - Simple wrapper for ThemeToggle component
 * Renders the sliding segmented theme toggle without drag functionality
 */
export default function ThemeToggleContainer() {
  return <ThemeToggle showContrast={true} />;
}
