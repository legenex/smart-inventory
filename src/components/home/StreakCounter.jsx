import React from 'react';
import { Flame } from 'lucide-react';
import useTheme from '@/components/theme/useTheme';

export default function StreakCounter({ streak }) {
  const { colors } = useTheme();

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
      <Flame className="w-3.5 h-3.5" style={{ color: colors.primary }} strokeWidth={1.5} />
      <span className="text-sm font-semibold text-foreground tabular-nums">{streak}</span>
      <span className="text-xs text-muted-foreground">{streak === 1 ? 'day' : 'days'}</span>
    </div>
  );
}