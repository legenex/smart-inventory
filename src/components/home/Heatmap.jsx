import React from 'react';
import { format } from 'date-fns';
import { Flame } from 'lucide-react';

export default function Heatmap({ entries, streak = 0 }) {
  const today = new Date();
  const days = [];

  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);

    let level = 0;
    if (entry) {
      const responseCount = Object.keys(entry.responses || {}).filter(key => {
        const v = entry.responses[key]?.value;
        return v && (Array.isArray(v) ? v.length > 0 : true);
      }).length;
      level = Math.max(0.35, Math.min(1, responseCount / 8));
    }

    days.push({ date, dateStr, hasEntry: !!entry, level });
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <div
            key={i}
            className="aspect-square rounded-[5px] transition-transform hover:scale-110"
            style={{
              backgroundColor: day.hasEntry
                ? `var(--accent)`
                : 'var(--soft)',
              opacity: day.hasEntry ? day.level : 0.4,
            }}
            title={format(day.date, 'MMM d')}
          />
        ))}
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1.5 mt-3">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
          >
            <Flame className="w-3 h-3" />
            {streak} day streak
          </div>
        </div>
      )}
    </div>
  );
}