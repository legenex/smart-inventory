import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import BackgroundWrapper from '@/components/background/BackgroundWrapper';
import Sidebar from '@/components/navigation/Sidebar';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadBackground();
    const interval = setInterval(loadBackground, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadBackground = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setBackground(userData.background || null);
      setLoading(false);
    } catch (err) {
      setBackground(null);
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  const showNavShell = currentPageName !== 'Home' && currentPageName !== 'Onboarding' && !!user;

  return (
    <ThemeProvider>
      <BackgroundWrapper background={background}>
        {showNavShell ? (
          <div className="min-h-screen flex">
            <Sidebar user={user} />
            <div className="flex-1 min-w-0">
              <div className="mx-auto max-w-4xl px-4 md:px-8 py-6 pb-28 md:pb-8">
                {children}
              </div>
            </div>
            <BottomTabBar />
          </div>
        ) : (
          children
        )}
      </BackgroundWrapper>
    </ThemeProvider>
  );
}