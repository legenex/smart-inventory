import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenLine, ChevronRight, Trash2, LogOut, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import InventoryDateDialog from '@/components/inventory/InventoryDateDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, isToday, differenceInDays, parseISO } from 'date-fns';
import HeroMilestone from '@/components/home/HeroMilestone';
import ReadingCard from '@/components/home/ReadingCard';
import ToolkitSection from '@/components/home/ToolkitSection';
import InventoryCard from '@/components/home/InventoryCard';
import InsightsChart from '@/components/home/InsightsChart';
import useTheme from '@/components/theme/useTheme';
import MoodCheckIn from '@/components/home/MoodCheckIn';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import ResponsiveMenu from '@/components/ui/responsive-menu';
import { getCopy } from '@/lib/mode';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Dashboard() {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    loadUser();
  }, [location]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.recovery_status) {
        navigate(createPageUrl('Onboarding'));
        return;
      }
      setUser(userData);
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };

  // Reload user data periodically to keep it fresh
  useEffect(() => {
    const interval = setInterval(loadUser, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show mood check-in if enabled and not done today
  useEffect(() => {
    if (user && user.mood_check_enabled !== false) {
      const today = new Date().toISOString().split('T')[0];
      if (user.last_mood_check !== today) {
        setTimeout(() => setShowMoodCheckIn(true), 1500);
      }
    }
  }, [user]);

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['inventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 50),
    enabled: !!user,
  });

  const { pullDistance, isRefreshing } = usePullToRefresh(async () => {
    await refetch();
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.list('-date', 5),
    enabled: !!user,
  });

  // Check for draft
  const [draftExists, setDraftExists] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem('inventory_draft');
    setDraftExists(!!draft);
  }, [location]);

  const handleDeleteDraft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem('inventory_draft');
    setDraftExists(false);
  };

  const handleDeleteEntry = (deletedId) => {
    refetch();
  };

  // Calculate streak
  const calculateStreak = () => {
    if (!entries.length) return 0;

    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (streak === 0 && differenceInDays(today, entryDate) === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const todayEntry = entries.find((e) => isToday(parseISO(e.date)));
  const streak = calculateStreak();
  const copy = getCopy(user?.recovery_status);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName =
    toTitleCase(user.display_name || user.full_name)?.split(' ')[0] || 'Friend';

  return (
    <div className="min-h-screen">
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex justify-center items-end overflow-hidden"
          style={{ height: pullDistance }}
        >
          <div
            className={`w-6 h-6 border-2 border-primary border-t-transparent rounded-full ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ opacity: Math.min(pullDistance / 60, 1) }}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-6 pb-28">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
              {copy.dashboardGreeting}
            </p>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
              {firstName}
            </h1>
          </div>
          <ResponsiveMenu
            trigger={
              <button className="flex items-center gap-2 bg-card rounded-full shadow-soft border border-border px-2 py-1.5 hover:shadow-md transition-shadow">
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={user.profile_picture}
                    alt={user.display_name || user.full_name}
                  />
                  <AvatarFallback
                    className="text-xs font-medium text-primary-foreground"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {(user.display_name || user.full_name)
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            }
            title="Account"
            items={[
              { label: 'Settings', icon: SettingsIcon, onClick: () => navigate(createPageUrl('Settings')) },
              { separator: true },
              { label: 'Sign Out', icon: LogOut, onClick: () => base44.auth.logout(), className: 'text-red-600' },
            ]}
          />
        </motion.div>

        {/* Hero Milestone */}
        <div className="mb-4">
          <HeroMilestone user={user} streak={streak} />
        </div>

        {/* Primary Action */}
        <motion.button
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.1 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          onClick={() => {
            if (todayEntry) {
              navigate(createPageUrl(`HistoryDetail?id=${todayEntry.id}`));
            } else {
              setShowInventoryDialog(true);
            }
          }}
          className="w-full bg-primary text-primary-foreground rounded-card p-5 shadow-soft flex items-center gap-4 text-left transition-shadow hover:shadow-md mb-4"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-primary-foreground/15 flex-shrink-0">
            <PenLine className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-base font-semibold">
              {todayEntry ? "View Today's Entry" : copy.inventoryVerb}
            </h2>
            <p className="text-sm text-primary-foreground/80">
              {todayEntry
                ? 'You already reflected today'
                : 'Reflect on today or catch up on past days'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
        </motion.button>

        {/* Reading Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
          className="mb-4"
        >
          <ReadingCard user={user} />
        </motion.div>

        {/* Toolkit */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
          className="mb-4"
        >
          <ToolkitSection user={user} />
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.25 }}
          className="mb-8"
        >
          <InsightsChart entries={entries} />
        </motion.div>

        {/* Saved Inventories */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold text-foreground">Saved Entries</h3>
            <Link
              to={createPageUrl('History')}
              className="text-xs px-3 py-1.5 rounded-full font-medium text-primary border border-border hover:bg-muted transition-colors"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-card p-5 shadow-soft border border-border animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-card rounded-card p-8 text-center shadow-soft border border-border">
              <p className="text-muted-foreground">No reflections yet. Start your first inventory.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {draftExists && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    to={createPageUrl('Inventory')}
                    className="block bg-card rounded-card p-5 shadow-soft border-2 border-dashed border-primary hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <PenLine
                            className="w-4 h-4"
                            style={{ color: colors.primary }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-display font-semibold text-foreground">
                              {format(new Date(), 'EEEE, MMMM d')}
                            </p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium text-primary-foreground"
                              style={{ backgroundColor: colors.primary }}
                            >
                              Draft
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Continue your entry</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleDeleteDraft}
                          className="p-2 hover:bg-muted rounded-control transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
              {entries.slice(0, 5).map((entry, index) => (
                <InventoryCard
                  key={entry.id}
                  entry={entry}
                  index={index}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Journaling History */}
        {journalEntries.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.35 }}
            className="mt-8"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">
              Journaling History
            </h3>
            <div className="space-y-2">
              {journalEntries.map((journal, index) => (
                <motion.div
                  key={journal.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.35 + index * 0.05 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    to={createPageUrl(`HistoryDetail?id=${journal.inventory_id}`)}
                    className="block bg-card rounded-card p-5 shadow-soft border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <PenLine
                            className="w-4 h-4"
                            style={{ color: colors.primary }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-display font-semibold text-foreground">
                            {format(new Date(journal.date), 'EEEE, MMMM d')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {journal.emotional_analysis?.overall_mood || 'Journal entry'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <MoodCheckIn open={showMoodCheckIn} onClose={() => setShowMoodCheckIn(false)} />

      <InventoryDateDialog
        open={showInventoryDialog}
        onClose={() => setShowInventoryDialog(false)}
      />
    </div>
  );
}