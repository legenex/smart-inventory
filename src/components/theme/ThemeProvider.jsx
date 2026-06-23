import React, { createContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const THEMES = {
  bone: {
    light: { bg: '#F4EEE3', surface: '#FBF7EF', ink: '#2B2620', muted: '#8C8175', line: '#E3DACA', accent: '#BC5A38', accentInk: '#FFF6EF', soft: '#F0E2D6' },
    dark:  { bg: '#1C1815', surface: '#262019', ink: '#EFE7D9', muted: '#9C9080', line: '#382F25', accent: '#D2724F', accentInk: '#1C1006', soft: '#2E2419' }
  },
  midnight: {
    light: { bg: '#F6F1E6', surface: '#FCF8EF', ink: '#2A2418', muted: '#8C8266', line: '#E7DEC8', accent: '#B8893A', accentInk: '#FFFBF0', soft: '#F0E6CF' },
    dark:  { bg: '#17140F', surface: '#221D16', ink: '#ECE3D2', muted: '#9A8E78', line: '#322A20', accent: '#D9A94E', accentInk: '#1A1206', soft: '#2A2014' }
  },
  sage: {
    light: { bg: '#E7EADF', surface: '#F2F4EA', ink: '#232C25', muted: '#6E7A6B', line: '#D2D8C5', accent: '#2F5D44', accentInk: '#F2F6EE', soft: '#DCE4D2' },
    dark:  { bg: '#141A15', surface: '#1D241E', ink: '#E4EADD', muted: '#8A968A', line: '#2A332B', accent: '#5B9E78', accentInk: '#08130C', soft: '#233027' }
  },
  dawn: {
    light: { bg: '#F7E9EC', surface: '#FCF3F5', ink: '#3A2E36', muted: '#9A7E8A', line: '#ECD7DD', accent: '#DC6F86', accentInk: '#FFF4F6', soft: '#F3DFE5' },
    dark:  { bg: '#1E161A', surface: '#281E23', ink: '#F0E2E8', muted: '#A98E9A', line: '#382A30', accent: '#E68298', accentInk: '#1E0A10', soft: '#301F27' }
  },
  tide: {
    light: { bg: '#ECEFF5', surface: '#F8FAFE', ink: '#1B2530', muted: '#6B7788', line: '#D6DEEC', accent: '#3B83F6', accentInk: '#FFFFFF', soft: '#DEE8FC' },
    dark:  { bg: '#121620', surface: '#1B2230', ink: '#E3E9F4', muted: '#8A93A6', line: '#28313F', accent: '#5B97F8', accentInk: '#07101F', soft: '#1E2A40' }
  }
};

function resolveThemeName(name) {
  if (THEMES[name]) return name;
  return 'tide';
}

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState('tide');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);

    loadTheme();

    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const resolved = resolveThemeName(themeColor);
    const tokens = THEMES[resolved][darkMode ? 'dark' : 'light'];
    const root = document.documentElement;
    root.style.setProperty('--bg', tokens.bg);
    root.style.setProperty('--surface', tokens.surface);
    root.style.setProperty('--ink', tokens.ink);
    root.style.setProperty('--muted', tokens.muted);
    root.style.setProperty('--line', tokens.line);
    root.style.setProperty('--accent', tokens.accent);
    root.style.setProperty('--accentInk', tokens.accentInk);
    root.style.setProperty('--soft', tokens.soft);
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeColor, darkMode]);

  const loadTheme = async () => {
    try {
      const user = await base44.auth.me();
      setThemeColor(user.theme_color || 'tide');
    } catch (err) {
      setThemeColor('tide');
    }
    setLoading(false);
  };

  const updateTheme = (newTheme) => {
    setThemeColor(newTheme);
  };

  const resolved = resolveThemeName(themeColor);
  const tokens = THEMES[resolved][darkMode ? 'dark' : 'light'];

  // Backward-compatible colors object for components not yet redesigned
  const colors = {
    primary: tokens.accent,
    secondary: tokens.accent,
    light: tokens.accent,
    accent: tokens.accent,
    shadow: '',
    gradient: '',
    gradientFull: 'bg-accent-gradient',
    textClass: 'text-accent-c',
    bgLight: 'bg-accent-soft',
    borderClass: 'border-accent-c',
    hoverBorder: '',
    borderColor: tokens.accent
  };

  return (
    <ThemeContext.Provider value={{
      colors,
      themeColor: resolved,
      loading,
      updateTheme,
      darkMode,
      tokens
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { THEMES };