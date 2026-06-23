import React from 'react';

export default function BackgroundWrapper({ children, background }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {children}
    </div>
  );
}