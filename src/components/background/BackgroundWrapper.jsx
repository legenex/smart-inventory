import React from 'react';
import { BACKGROUND_OPTIONS } from '../settings/BackgroundSelector';

export default function BackgroundWrapper({ children, background }) {
  const getBackgroundStyle = () => {
    if (!background) {
      return {};
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

    return {};
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5]" 
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  );
}