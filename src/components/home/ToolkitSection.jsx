import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Zap, PenLine } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getCopy } from '@/lib/mode';
import useTheme from '@/components/theme/useTheme';

export default function ToolkitSection({ user }) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const copy = getCopy(user.recovery_status);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tools = [
    { label: copy.spotCheckTitle, desc: 'Quick check-in', icon: Zap, path: 'SpotCheck' },
    { label: 'Gratitude', desc: 'Daily practice', icon: Heart, path: 'GratitudeAffirmations' },
    { label: 'Journal', desc: 'Reflect deeper', icon: PenLine, path: 'Journaling' },
  ];

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-3">
        {copy.toolkitName}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.path}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.08 * i }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            onClick={() => navigate(createPageUrl(tool.path))}
            className="bg-card rounded-card p-4 shadow-soft border border-border text-left transition-shadow hover:shadow-md flex flex-col items-start"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5"
              style={{ backgroundColor: `${colors.primary}14` }}
            >
              <tool.icon className="w-5 h-5" style={{ color: colors.primary }} strokeWidth={1.5} />
            </div>
            <h4 className="font-medium text-foreground text-sm leading-tight">{tool.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}