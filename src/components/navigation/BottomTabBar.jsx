import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenLine, TrendingUp, BookOpen, Settings as SettingsIcon } from 'lucide-react';

const TABS = [
  { label: 'Home', icon: Home, path: '/Dashboard' },
  { label: 'Inventory', icon: PenLine, path: '/Inventory' },
  { label: 'Insights', icon: TrendingUp, path: '/History' },
  { label: 'Today', icon: BookOpen, path: '/TodayReadings' },
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
            className="flex flex-col items-center gap-0.5 py-2 px-3 min-h-[52px] justify-center transition-colors"
          >
            <tab.icon
              className="w-5 h-5"
              style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className="text-[10px] font-medium"
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