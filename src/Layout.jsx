import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import BackgroundWrapper from '@/components/background/BackgroundWrapper';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackground();
    
    // Listen for background changes
    const interval = setInterval(loadBackground, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadBackground = async () => {
    try {
      const user = await base44.auth.me();
      setBackground(user.background || null);
      setLoading(false);
    } catch (err) {
      setBackground(null);
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider>
      <BackgroundWrapper background={background}>
        {children}
      </BackgroundWrapper>
    </ThemeProvider>
  );
}