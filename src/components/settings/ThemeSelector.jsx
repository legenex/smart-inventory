import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { THEMES } from '@/components/theme/ThemeProvider';
import useTheme from '@/components/theme/useTheme';
import { base44 } from '@/api/base44Client';

const THEME_LIST = [
  { id: 'bone',      name: 'Bone',      subtitle: 'Terracotta', accent: THEMES.bone.light.accent,      bg: THEMES.bone.light.bg,      surface: THEMES.bone.light.surface },
  { id: 'midnight',  name: 'Midnight',   subtitle: 'Gold',      accent: THEMES.midnight.light.accent,  bg: THEMES.midnight.light.bg,  surface: THEMES.midnight.light.surface },
  { id: 'sage',      name: 'Sage',       subtitle: 'Green',     accent: THEMES.sage.light.accent,      bg: THEMES.sage.light.bg,      surface: THEMES.sage.light.surface },
  { id: 'dawn',      name: 'Dawn',       subtitle: 'Rose',      accent: THEMES.dawn.light.accent,      bg: THEMES.dawn.light.bg,      surface: THEMES.dawn.light.surface },
  { id: 'tide',      name: 'Tide',       subtitle: 'Blue',      accent: THEMES.tide.light.accent,      bg: THEMES.tide.light.bg,      surface: THEMES.tide.light.surface },
];

export default function ThemeSelector({ user, onUpdate }) {
  const { themeColor, updateTheme } = useTheme();
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSelect = async (themeId) => {
    updateTheme(themeId);
    try {
      await base44.auth.updateMe({ theme_color: themeId });
      onUpdate?.();
    } catch (err) {
      console.error('Failed to save theme', err);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {THEME_LIST.map((theme) => {
        const selected = themeColor === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            className="relative flex flex-col items-center"
            style={{ minHeight: 44 }}
          >
            <div
              className="w-full aspect-square rounded-2xl relative overflow-hidden transition-all"
              style={{
                backgroundColor: theme.surface,
                border: selected ? `2.5px solid ${theme.accent}` : '1px solid var(--line)',
                boxShadow: selected ? `0 0 0 3px ${theme.accent}33` : 'none',
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ backgroundColor: theme.accent, opacity: 0.15 }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {selected && !prefersReduced && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.accent, border: '2px solid var(--surface)' }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
              {selected && prefersReduced && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.accent, border: '2px solid var(--surface)' }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <p
              className="text-xs mt-1.5 font-medium text-center"
              style={{ color: selected ? 'var(--ink)' : 'var(--muted)' }}
            >
              {theme.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}