import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import BackgroundWrapper from '@/components/background/BackgroundWrapper';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [background, setBackground] = useState(null);

  useEffect(() => {
    loadBackground();
  }, []);

  const loadBackground = async () => {
    try {
      const user = await base44.auth.me();
      setBackground(user.background || null);
    } catch (err) {
      setBackground(null);
    }
  };

  return (
    <ThemeProvider>
      <BackgroundWrapper background={background}>
        {children}
      </BackgroundWrapper>
    </ThemeProvider>
  );
}