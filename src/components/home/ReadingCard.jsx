import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BookOpen, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getCopy, isRecovery } from '@/lib/mode';
import useTheme from '@/components/theme/useTheme';

export default function ReadingCard({ user }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const copy = getCopy(user.recovery_status);
  const recovery = isRecovery(user.recovery_status);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { data: reflections = [] } = useQuery({
    queryKey: ['dailyReflections'],
    queryFn: () =>
      base44.entities.DailyReflection.filter({ is_published: true }, 'sort_order', 100),
    enabled: !!user,
  });

  const visibleReflections = reflections.filter(
    (r) => r.mode === 'both' || r.mode === (recovery ? 'recovery' : 'general')
  );

  const todayKey = format(new Date(), 'MM-dd');
  const byDayKey = visibleReflections.find((r) => r.day_key === todayKey);
  const fallbackIndex =
    visibleReflections.length > 0
      ? new Date().getDate() % visibleReflections.length
      : 0;
  const reflection = byDayKey || visibleReflections[fallbackIndex] || null;

  const excerpt = reflection?.body
    ? reflection.body.replace(/\s+/g, ' ').trim().slice(0, 130) +
      (reflection.body.length > 130 ? '…' : '')
    : '';

  const subtitle = recovery
    ? 'A moment of reflection for today'
    : 'A gentle reflection for your day';

  return (
    <>
      <motion.button
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        onClick={() => reflection && setOpen(true)}
        className="w-full bg-card rounded-card p-5 shadow-soft border border-border text-left transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.primary}14` }}
          >
            <BookOpen className="w-5 h-5" style={{ color: colors.primary }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
              {copy.reflectionTitle}
            </p>
            <h3 className="font-display text-base font-semibold text-foreground truncate">
              {reflection?.title || subtitle}
            </h3>
            {excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{excerpt}</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-card bg-card border-border shadow-soft">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              {reflection?.title}
            </DialogTitle>
            {reflection?.theme && (
              <DialogDescription className="capitalize">{reflection.theme}</DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">
              {reflection?.body}
            </p>
            {reflection?.prompt && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  Reflect
                </p>
                <p className="text-muted-foreground italic text-sm">{reflection.prompt}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}