import React from 'react';
import { BACKGROUND_OPTIONS } from '../settings/BackgroundSelector';

export default function BackgroundWrapper({ children, background }) {
  const getBackgroundStyle = () => {
    if (!background) {
      return { background: 'var(--bg)' };
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

    return { background: 'var(--bg)' };
  };

  return (
    <div className="min-h-screen" style={getBackgroundStyle()}>
      {children}
    </div>
  );
}