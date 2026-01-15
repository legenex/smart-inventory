import React, { createContext, useState, useEffect } from 'react';
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

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const user = await base44.auth.me();
      setThemeColor(user.theme_color || 'purple');
    } catch (err) {
      setThemeColor('purple');
    }
    setLoading(false);
  };

  const updateTheme = (newTheme) => {
    setThemeColor(newTheme);
  };

  const colors = themeColor ? THEME_COLORS[themeColor] : THEME_COLORS.purple;

  return (
    <ThemeContext.Provider value={{
      colors,
      themeColor: themeColor || 'purple',
      loading,
      updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { THEME_COLORS };