import React from 'react';
import { BACKGROUND_OPTIONS } from '../settings/BackgroundSelector';
import useTheme from '../theme/useTheme';

export default function BackgroundWrapper({ children, background }) {
  const { themeColor } = useTheme();

  const getDefaultBackground = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      return 'linear-gradient(to bottom right, #0F0E0C, #14120F, #0F0E0C)';
    }
    const themeBackgrounds = {
      purple: 'linear-gradient(to bottom right, #F7F4EE, #FFFFFF, #F4F0E8)',
      blue: 'linear-gradient(to bottom right, #F5F4EE, #FFFFFF, #F0F0E8)',
      green: 'linear-gradient(to bottom right, #F4F5EE, #FFFFFF, #EFF0E8)',
      red: 'linear-gradient(to bottom right, #F8F4EE, #FFFFFF, #F5F0E8)',
      orange: 'linear-gradient(to bottom right, #F8F5EE, #FFFFFF, #F5F2E8)'
    };
    return themeBackgrounds[themeColor] || 'linear-gradient(to bottom right, #F7F4EE, #FFFFFF, #F2EDE4)';
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