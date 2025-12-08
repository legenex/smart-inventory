import React from 'react';
import { BACKGROUND_OPTIONS } from '../settings/BackgroundSelector';

export default function BackgroundWrapper({ children, background }) {
  const getBackgroundStyle = () => {
    if (!background) {
      return { background: 'linear-gradient(to bottom right, #F5F5F7, #ffffff, #E1E1E5)' };
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
      if (preset) {
        return {
          background: preset.gradient,
          position: 'relative'
        };
      }
    }

    return { background: 'linear-gradient(to bottom right, #F5F5F7, #ffffff, #E1E1E5)' };
  };

  const preset = background?.type === 'preset' && background?.id 
    ? BACKGROUND_OPTIONS.find(opt => opt.id === background.id)
    : null;

  return (
    <div className="min-h-screen" style={getBackgroundStyle()}>
      {preset?.stars && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20% 30%, white, transparent),
              radial-gradient(1px 1px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(1px 1px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 85%, white, transparent),
              radial-gradient(1px 1px at 15% 75%, white, transparent),
              radial-gradient(1px 1px at 70% 40%, white, transparent)
            `,
            backgroundSize: '200% 200%, 150% 150%, 180% 180%, 220% 220%, 190% 190%, 210% 210%, 170% 170%, 160% 160%',
            backgroundPosition: '50% 50%',
            opacity: 0.6,
            zIndex: 0
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}