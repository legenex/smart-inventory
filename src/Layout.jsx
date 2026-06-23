import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import BackgroundWrapper from '@/components/background/BackgroundWrapper';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import { base44 } from '@/api/base44Client';

const HIDDEN_TAB_ROUTES = ['/', '/Home', '/Onboarding'];

export default function Layout() {
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadBackground();
    const interval = setInterval(loadBackground, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadBackground = async () => {
    try {
      const user = await base44.auth.me();
      setBackground(user.background || null);
      setIsAuthed(true);
    } catch {
      setBackground(null);
      setIsAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const showTabBar = isAuthed && !HIDDEN_TAB_ROUTES.includes(location.pathname);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ThemeProvider>
      <BackgroundWrapper background={background}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        {showTabBar && <BottomTabBar />}
      </BackgroundWrapper>
    </ThemeProvider>
  );
}