import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday } from 'date-fns';

export default function DateSelector({ selectedDate, onDateChange }) {
  const handlePrevDay = () => {
    onDateChange(new Date(selectedDate.getTime() - 86400000));
  };

  const handleNextDay = () => {
    if (!isToday(selectedDate)) {
      onDateChange(new Date(selectedDate.getTime() + 86400000));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div
      className="flex items-center justify-between rounded-2xl p-4 mb-6"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <button
        onClick={handlePrevDay}
        className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
        style={{ color: 'var(--muted)' }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <div className="text-center">
          <p className="font-semibold" style={{ color: 'var(--ink)' }}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </p>
          {!isToday(selectedDate) && (
            <button
              onClick={handleToday}
              className="text-xs hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Go to today
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleNextDay}
        disabled={isToday(selectedDate)}
        className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: 'var(--muted)' }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}