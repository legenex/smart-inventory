import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useTheme from '../theme/useTheme';

export const CANVAS_OPTIONS = [
  {
    id: 'bone',
    name: 'Bone',
    light: '#F7F4EE',
    lightMid: '#FAF8F3',
    dark: '#0F0E0C',
    darkMid: '#14120F',
  },
  {
    id: 'warm',
    name: 'Warm',
    light: '#F5EFE2',
    lightMid: '#F9F5EC',
    dark: '#1A1714',
    darkMid: '#221E1A',
  },
  {
    id: 'slate',
    name: 'Slate',
    light: '#EDEDEB',
    lightMid: '#F2F2F0',
    dark: '#1C1C1A',
    darkMid: '#232320',
  },
];

export default function BackgroundSelector({ user, onUpdate }) {
  const { colors, isDark } = useTheme();
  const [saving, setSaving] = useState(null);

  const currentBackground =
    user?.background && typeof user.background === 'object'
      ? user.background
      : null;

  const handleSelect = async (bg) => {
    setSaving(bg ? bg.id : 'none');
    try {
      await base44.auth.updateMe({ background: bg });
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error(err);
    }
    setSaving(null);
  };

  const isSelected = (option) => {
    return currentBackground?.type === 'canvas' && currentBackground?.id === option.id;
  };

  const isNoneSelected = !currentBackground || currentBackground?.type !== 'canvas';

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose a calm canvas tone. Photo backgrounds have been retired in favor of a clean editorial canvas.
      </p>

      {/* Default / None */}
      <button
        onClick={() => handleSelect(null)}
        disabled={saving !== null}
        className="w-full h-14 rounded-control flex items-center justify-center gap-2 transition-all border-2 disabled:opacity-50"
        style={{
          borderColor: isNoneSelected ? colors.primary : 'hsl(var(--border))',
          backgroundColor: isNoneSelected ? `${colors.primary}0D` : 'transparent',
        }}
      >
        {isNoneSelected && <Check className="w-4 h-4" style={{ color: colors.primary }} />}
        <span
          className="text-sm font-medium"
          style={{ color: isNoneSelected ? colors.primary : 'hsl(var(--foreground))' }}
        >
          Default Canvas
        </span>
      </button>

      {/* Canvas Tint Options */}
      <div className="grid grid-cols-3 gap-3">
        {CANVAS_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect({ type: 'canvas', id: option.id })}
            disabled={saving !== null}
            className="relative h-20 rounded-control overflow-hidden transition-all border-2 disabled:opacity-50"
            style={{
              borderColor: isSelected(option) ? colors.primary : 'hsl(var(--border))',
              backgroundColor: isDark ? option.dark : option.light,
            }}
          >
            {isSelected(option) && (
              <div
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2">
              <p
                className="text-xs font-medium"
                style={{ color: isDark ? '#ECE7DD' : '#1A1714' }}
              >
                {option.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}