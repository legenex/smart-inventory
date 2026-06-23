import React from 'react';
import useTheme from '../theme/useTheme';
import { CANVAS_OPTIONS } from '../settings/BackgroundSelector';

export default function BackgroundWrapper({ children, background }) {
  const { isDark } = useTheme();

  // Always render the clean editorial canvas.
  // Only honor new canvas tints; IGNORE legacy image backgrounds
  // (old presets or custom uploads fall through to the default canvas).
  let baseColor = isDark ? '#0F0E0C' : '#F7F4EE';
  let midColor = isDark ? '#14120F' : '#FAF8F3';

  if (background && typeof background === 'object' && background.type === 'canvas' && background.id) {
    const option = CANVAS_OPTIONS.find(opt => opt.id === background.id);
    if (option) {
      baseColor = isDark ? option.dark : option.light;
      midColor = isDark ? option.darkMid : option.lightMid;
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${baseColor} 0%, ${midColor} 50%, ${baseColor} 100%)`,
      }}
    >
      {children}
    </div>
  );
}