/**
 * ThemeContext.js
 * ──────────────────────────────────────────────────────────────
 * Dark/Light mode context provider for Bhakti Steps.
 * Color palettes are centralized in theme.js — edit there.
 * ──────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { lightColors, darkColors } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const value = useMemo(() => ({
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme: () => setIsDark(prev => !prev),
  }), [isDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
