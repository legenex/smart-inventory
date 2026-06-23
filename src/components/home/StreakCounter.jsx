import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import useTheme from '../theme/useTheme';

export default function StreakCounter({ streak }) {
  const { colors } = useTheme();
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-[25px] p-6 text-white shadow-lg ${colors.shadow}`}
      style={{
        background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
          <Flame className="w-7 h-7" />
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">Current Streak</p>
          <p className="text-3xl font-bold">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
        </div>
      </div>
    </motion.div>
  );
}