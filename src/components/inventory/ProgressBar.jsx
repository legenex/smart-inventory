import React from 'react';
import { motion } from 'framer-motion';
import useTheme from '../theme/useTheme';

export default function ProgressBar({ current, total }) {
  const { colors } = useTheme();
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 font-medium">Question {current} of {total}</span>
        <span className="text-sm text-gray-500 font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}