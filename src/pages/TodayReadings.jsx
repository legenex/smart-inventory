import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getCopy } from '@/lib/mode';
import ReadingsDialog from '@/components/readings/ReadingsDialog';

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function TodayReadings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showReadingsDialog, setShowReadingsDialog] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (err) {
      // user not logged in
    }
  };

  const { data: dailyReflection, isLoading } = useQuery({
    queryKey: ['dailyReflection', user?.recovery_status],
    queryFn: async () => {
      const mode = user.recovery_status;
      const todayKey = format(new Date(), 'MM-dd');
      let reflections = await base44.entities.DailyReflection.filter({
        day_key: todayKey,
        is_published: true
      });
      reflections = reflections.filter(r => r.mode === mode || r.mode === 'both');
      if (reflections.length === 0) {
        reflections = await base44.entities.DailyReflection.filter({ is_published: true });
        reflections = reflections.filter(r => r.mode === mode || r.mode === 'both');
      }
      return reflections[0] || null;
    },
    enabled: !!user
  });

  const copy = getCopy(user?.recovery_status);

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(createPageUrl('Dashboard'))}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--ink)' }}>Daily Readings</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : dailyReflection ? (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 md:p-8 mb-6"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                {copy.reflectionTitle}
              </p>
            </div>
            <h2 className="font-display text-2xl font-medium mb-4" style={{ color: 'var(--ink)' }}>
              {dailyReflection.title}
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--ink)' }}>
              {dailyReflection.body}
            </p>
            {dailyReflection.prompt && (
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--soft)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>Reflection prompt</p>
                <p className="text-sm" style={{ color: 'var(--ink)' }}>{dailyReflection.prompt}</p>
              </div>
            )}
            {dailyReflection.theme && (
              <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}>
                {dailyReflection.theme}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-12 text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--soft)' }}>
              <BookOpen className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink)' }}>No reading available</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Check back later for today's reflection.</p>
          </motion.div>
        )}

        {/* More readings button */}
        <motion.button
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={prefersReduced ? undefined : { scale: 0.97 }}
          onClick={() => setShowReadingsDialog(true)}
          className="w-full rounded-2xl p-5 flex items-center gap-4 text-left mb-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--soft)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>More Readings</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Explore daily reflections and meditations</p>
          </div>
        </motion.button>

        {/* Discreet aa.org link */}
        <div className="text-center pb-8">
          <a
            href="https://www.aa.org/pages/en_US/daily-reflections"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs inline-flex items-center gap-1"
            style={{ color: 'var(--muted)' }}
          >
            Official daily reading on aa.org
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <ReadingsDialog open={showReadingsDialog} onClose={() => setShowReadingsDialog(false)} />
    </div>
  );
}