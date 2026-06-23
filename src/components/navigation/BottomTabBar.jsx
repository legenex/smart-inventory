import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, History, LayoutGrid, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';

const TABS = [
  { label: 'Home', icon: Home, path: 'Dashboard' },
  { label: 'History', icon: History, path: 'History' },
  { label: 'Toolkit', icon: LayoutGrid, path: 'Toolkit' },
  { label: 'Settings', icon: Settings, path: 'Settings' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = TABS.find(tab => {
    const tabPath = `/${tab.path}`;
    return location.pathname === tabPath || location.pathname.startsWith(`${tabPath}/`);
  })?.label || 'Home';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(createPageUrl(tab.path))}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 min-h-[48px] min-w-[64px] transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}