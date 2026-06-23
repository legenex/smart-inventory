import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, BookOpen, TrendingUp, Settings as SettingsIcon } from 'lucide-react';

const TABS = [
  { label: 'Home', icon: Home, path: '/Dashboard' },
  { label: 'Tools', icon: LayoutGrid, path: '/Tools' },
  { label: 'Daily Readings', icon: BookOpen, path: '/TodayReadings' },
  { label: 'Insights', icon: TrendingUp, path: '/Insights' },
  { label: 'Settings', icon: SettingsIcon, path: '/Settings' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-safe border-t"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
    >
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path ||
          (tab.path === '/Dashboard' && location.pathname === '/');
        return (
          <Link
            key={tab.label}
            to={tab.path}
            className="flex flex-col items-center gap-0.5 py-2 px-2 min-h-[52px] justify-center transition-colors max-w-[20%]"
          >
            <tab.icon
              className="w-5 h-5"
              style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className="text-[10px] font-medium text-center leading-tight"
              style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}