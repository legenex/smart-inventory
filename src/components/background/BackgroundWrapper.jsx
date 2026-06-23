import React from 'react';
import { BACKGROUND_OPTIONS } from '../settings/BackgroundSelector';
import useTheme from '../theme/useTheme';

export default function BackgroundWrapper({ children, background }) {
  const { themeColor } = useTheme();

  const getDefaultBackground = () => {
    const themeBackgrounds = {
      purple: 'linear-gradient(to bottom right, #f3f0ff, #faf5ff, #ffffff)',
      blue: 'linear-gradient(to bottom right, #eff6ff, #dbeafe, #ffffff)',
      green: 'linear-gradient(to bottom right, #ecfdf5, #d1fae5, #ffffff)',
      red: 'linear-gradient(to bottom right, #fef2f2, #fee2e2, #ffffff)',
      orange: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #ffffff)'
    };
    return themeBackgrounds[themeColor] || 'linear-gradient(to bottom right, #F5F5F7, #ffffff, #E1E1E5)';
  };

  const getBackgroundStyle = () => {
    if (!background) {
      return { background: getDefaultBackground() };
    }

    if (background.type === 'custom' && background.url) {
      return {
        backgroundImage: `url(${background.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }

    if (background.type === 'preset' && background.id) {
      const preset = BACKGROUND_OPTIONS.find(opt => opt.id === background.id);
      if (preset && preset.image) {
        return {
          backgroundImage: `url(${preset.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        };
      }
    }

    return { background: getDefaultBackground() };
  };

  return (
    <div 
      className="min-h-screen" 
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  );
}