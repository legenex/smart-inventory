import React from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}