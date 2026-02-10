import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, isToday, isFuture } from 'date-fns';
import useTheme from '@/components/theme/useTheme';

export default function DateSelector({ selectedDate, onDateChange }) {
  const { colors } = useTheme();

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
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
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
      <button
        onClick={handlePrevDay}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5" style={{ color: colors.primary }} />
        <div className="text-center">
          <p className="font-semibold text-[#1F2C46]">
            {format(selectedDate, 'EEEE, MMMM d')}
          </p>
          {!isToday(selectedDate) && (
            <button
              onClick={handleToday}
              className="text-xs hover:underline"
              style={{ color: colors.primary }}
            >
              Go to today
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleNextDay}
        disabled={isToday(selectedDate) || isFuture(selectedDate)}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}