import React from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getNextMilestone, getCopy } from '@/lib/mode';
import CountUp from './CountUp';
import StreakCounter from './StreakCounter';
import useTheme from '@/components/theme/useTheme';

export default function HeroMilestone({ user, streak }) {
  const { colors } = useTheme();
  const copy = getCopy(user.recovery_status);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const soberDate = user.sober_date;
  const days = soberDate ? differenceInDays(new Date(), parseISO(soberDate)) : 0;
  const nextMilestone = getNextMilestone(days);
  const progress = nextMilestone
    ? Math.min(100, Math.round((days / nextMilestone.days) * 100))
    : 100;

  /* No start date — calm inline prompt */
  if (!soberDate) {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-card p-7 shadow-soft border border-border"
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          {copy.milestoneLabelDefault}
        </p>
        <p className="font-display text-xl text-foreground leading-snug mb-1">
          Track your progress from day one.
        </p>
        <p className="text-sm text-muted-foreground mb-5">
          Set your {copy.dateFieldLabel.toLowerCase()} to see your milestone journey here.
        </p>
        <Link
          to={createPageUrl('Settings')}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-control bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          Set {copy.dateFieldLabel}
        </Link>
        <div className="mt-5">
          <StreakCounter streak={streak} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-card p-7 shadow-soft border border-border"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            {copy.dayCounterLabel}
          </p>
          <span className="font-display text-6xl font-semibold text-foreground tabular-nums leading-none block">
            <CountUp to={days} />
          </span>
        </div>
        <StreakCounter streak={streak} />
      </div>

      {/* Slim accent progress bar toward next milestone */}
      {nextMilestone && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Next: {nextMilestone.emoji} {nextMilestone.label}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={prefersReducedMotion ? false : { width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}