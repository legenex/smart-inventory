import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Logo({ size = 'md', showText = false, className = '' }) {
  const sizes = {
    sm: { icon: 'w-5 h-5', container: 'w-10 h-10', text: 'text-base' },
    md: { icon: 'w-7 h-7', container: 'w-14 h-14', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', container: 'w-24 h-24', text: 'text-2xl' }
  };
  
  const s = sizes[size];
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${s.container} bg-gradient-to-br from-[#6BC2CE] to-[#7667E5] rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-200/50`}>
        <BookOpen className={`${s.icon} text-white`} strokeWidth={2.5} />
      </div>
      {showText && (
        <div>
          <h1 className={`${s.text} font-bold text-[#1F2C46]`}>Smart-Inventory</h1>
          <p className="text-xs text-gray-500">Reflect. Grow. Become your best self.</p>
        </div>
      )}
    </div>
  );
}