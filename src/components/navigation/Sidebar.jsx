import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenLine, TrendingUp, BookOpen, Settings as SettingsIcon, Plus, Flame } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/Dashboard' },
  { label: 'Inventory', icon: PenLine, path: '/Inventory' },
  { label: 'Insights', icon: TrendingUp, path: '/History' },
  { label: 'Today', icon: BookOpen, path: '/TodayReadings' },
  { label: 'Settings', icon: SettingsIcon, path: '/Settings' },
];

export default function Sidebar({ user }) {
  const location = useLocation();

  const daysCount = user?.sober_date
    ? Math.floor((new Date() - new Date(user.sober_date)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <aside className="hidden md:flex flex-col w-60 lg:w-64 min-h-screen border-r shrink-0" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}>
      {/* Wordmark */}
      <div className="px-5 pt-7 pb-5">
        <Link to="/Dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <PenLine className="w-4 h-4" style={{ color: 'var(--accentInk)' }} />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: 'var(--ink)' }}>
            Smart Inventory
          </span>
        </Link>
      </div>

      {/* + Inventory button */}
      <div className="px-4 mb-4">
        <Link
          to="/Inventory"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all min-h-[44px]"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
        >
          <Plus className="w-4 h-4" />
          Inventory
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/Dashboard' && location.pathname === '/');
          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]"
              style={{
                backgroundColor: isActive ? 'var(--soft)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 rounded-xl">
            <AvatarImage src={user?.profile_picture} alt={user?.display_name || user?.full_name} />
            <AvatarFallback
              className="text-xs font-medium rounded-xl"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
            >
              {(user?.display_name || user?.full_name)?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
              {user?.display_name || user?.full_name || 'User'}
            </p>
            {daysCount !== null && (
              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                <Flame className="w-3 h-3" />
                {daysCount} days
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}