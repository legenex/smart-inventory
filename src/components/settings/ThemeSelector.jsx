import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const THEMES = [
  { 
    id: 'purple', 
    name: 'Purple', 
    gradient: 'from-[#7667E5] to-[#A48FFF]',
    bg: 'bg-gradient-to-br from-[#7667E5] to-[#A48FFF]'
  },
  { 
    id: 'blue', 
    name: 'Blue', 
    gradient: 'from-[#3B82F6] to-[#60A5FA]',
    bg: 'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]'
  },
  { 
    id: 'green', 
    name: 'Green', 
    gradient: 'from-[#10B981] to-[#34D399]',
    bg: 'bg-gradient-to-br from-[#10B981] to-[#34D399]'
  },
  { 
    id: 'red', 
    name: 'Light Red', 
    gradient: 'from-[#F87171] to-[#FCA5A5]',
    bg: 'bg-gradient-to-br from-[#F87171] to-[#FCA5A5]'
  },
  { 
    id: 'orange', 
    name: 'Orange', 
    gradient: 'from-[#F97316] to-[#FB923C]',
    bg: 'bg-gradient-to-br from-[#F97316] to-[#FB923C]'
  }
];

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {THEMES.map((theme) => (
        <motion.button
          key={theme.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onThemeChange(theme.id)}
          className="relative"
        >
          <div className={`w-full aspect-square rounded-2xl ${theme.bg} shadow-md relative overflow-hidden`}>
            {currentTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-800" strokeWidth={3} />
                </div>
              </motion.div>
            )}
          </div>
          <p className="text-xs text-center mt-1 text-gray-600 font-medium">{theme.name}</p>
        </motion.button>
      ))}
    </div>
  );
}

export { THEMES };