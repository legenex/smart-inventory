import React, { createContext, useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

const THEME_COLORS = {
  purple: {
    primary: '#7667E5',
    secondary: '#A48FFF',
    light: '#7667E5',
    accent: '#6BC2CE',
    shadow: 'shadow-purple-200/50',
    gradient: 'from-[#7667E5] to-[#A48FFF]',
    gradientFull: 'bg-gradient-to-r from-[#7667E5] to-[#A48FFF]',
    textClass: 'text-[#7667E5]',
    bgLight: 'bg-[#7667E5]/10',
    borderClass: 'border-[#7667E5]',
    hoverBorder: 'hover:border-[#7667E5]/30',
    borderColor: '#7667E5'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    light: '#3B82F6',
    accent: '#0EA5E9',
    shadow: 'shadow-blue-200/50',
    gradient: 'from-[#3B82F6] to-[#60A5FA]',
    gradientFull: 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]',
    textClass: 'text-[#3B82F6]',
    bgLight: 'bg-[#3B82F6]/10',
    borderClass: 'border-[#3B82F6]',
    hoverBorder: 'hover:border-[#3B82F6]/30',
    borderColor: '#3B82F6'
  },
  green: {
    primary: '#10B981',
    secondary: '#34D399',
    light: '#10B981',
    accent: '#14B8A6',
    shadow: 'shadow-green-200/50',
    gradient: 'from-[#10B981] to-[#34D399]',
    gradientFull: 'bg-gradient-to-r from-[#10B981] to-[#34D399]',
    textClass: 'text-[#10B981]',
    bgLight: 'bg-[#10B981]/10',
    borderClass: 'border-[#10B981]',
    hoverBorder: 'hover:border-[#10B981]/30',
    borderColor: '#10B981'
  },
  red: {
    primary: '#F87171',
    secondary: '#FCA5A5',
    light: '#F87171',
    accent: '#FB923C',
    shadow: 'shadow-red-200/50',
    gradient: 'from-[#F87171] to-[#FCA5A5]',
    gradientFull: 'bg-gradient-to-r from-[#F87171] to-[#FCA5A5]',
    textClass: 'text-[#F87171]',
    bgLight: 'bg-[#F87171]/10',
    borderClass: 'border-[#F87171]',
    hoverBorder: 'hover:border-[#F87171]/30',
    borderColor: '#F87171'
  },
  orange: {
    primary: '#F97316',
    secondary: '#FB923C',
    light: '#F97316',
    accent: '#FBBF24',
    shadow: 'shadow-orange-200/50',
    gradient: 'from-[#F97316] to-[#FB923C]',
    gradientFull: 'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
    textClass: 'text-[#F97316]',
    bgLight: 'bg-[#F97316]/10',
    borderClass: 'border-[#F97316]',
    hoverBorder: 'hover:border-[#F97316]/30',
    borderColor: '#F97316'
  }
};

function hexToHsl(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case r: h = ((g - b) / diff + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / diff + 2); break;
      case b: h = ((r - g) / diff + 4); break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync dark mode with system preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkChange = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
      setIsDark(e.matches);
    };
    handleDarkChange(mql);
    mql.addEventListener('change', handleDarkChange);
    return () => mql.removeEventListener('change', handleDarkChange);
  }, []);

  // Write accent colors to CSS variables whenever theme changes
  useEffect(() => {
    if (!themeColor) return;
    const tc = THEME_COLORS[themeColor];
    if (!tc) return;
    const root = document.documentElement;
    const hsl = hexToHsl(tc.primary);
    root.style.setProperty('--primary', hsl);
    root.style.setProperty('--ring', hsl);
    root.style.setProperty('--sidebar-primary', hsl);
    root.style.setProperty('--sidebar-ring', hsl);
    root.style.setProperty('--theme-primary', tc.primary);
    root.style.setProperty('--theme-secondary', tc.secondary);
  }, [themeColor]);

  const loadTheme = async () => {
    try {
      const user = await base44.auth.me();
      setThemeColor(user.theme_color || 'purple');
    } catch {
      setThemeColor('purple');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const updateTheme = (newTheme) => {
    setThemeColor(newTheme);
  };

  const colors = themeColor ? THEME_COLORS[themeColor] : THEME_COLORS.purple;

  return (
    <ThemeContext.Provider value={{
      colors,
      themeColor: themeColor || 'purple',
      isDark,
      loading,
      updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { THEME_COLORS };