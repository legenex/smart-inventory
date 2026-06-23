import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--line)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--accent)' }}
          initial={prefersReduced ? false : { width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}