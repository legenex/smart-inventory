import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { format, subDays, isToday, isFuture } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useTheme from '@/components/theme/useTheme';

export default function InventoryDateDialog({ open, onClose }) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleTodayClick = () => {
    navigate(createPageUrl('Inventory'));
    onClose();
  };

  const handleDateSelect = (date) => {
    if (date && !isFuture(date)) {
      setSelectedDate(date);
      navigate(createPageUrl(`Inventory?date=${format(date, 'yyyy-MM-dd')}`));
      onClose();
    }
  };

  const yesterday = subDays(new Date(), 1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#1F2C46]">
            Write Inventory
          </DialogTitle>
        </DialogHeader>

        {!showCalendar ? (
          <div className="space-y-3 py-4">
            {/* Today Button */}
            <button
              onClick={handleTodayClick}
              className="w-full p-5 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 text-left group"
              style={{
                borderColor: colors.primary,
                background: `linear-gradient(to right, ${colors.primary}08, ${colors.secondary}08)`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1F2C46] text-lg">Today</p>
                  <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM d')}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Yesterday Button */}
            <button
              onClick={() => handleDateSelect(yesterday)}
              className="w-full p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1F2C46]">Yesterday</p>
                  <p className="text-sm text-gray-500">{format(yesterday, 'EEEE, MMMM d')}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Choose Date Button */}
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5" style={{ color: colors.primary }} />
                  <p className="font-semibold text-[#1F2C46]">Choose a Date</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => isFuture(date)}
              className="rounded-2xl border-0"
              classNames={{
                months: "flex flex-col space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md",
                day_selected: "text-white hover:text-white focus:text-white",
                day_today: "bg-gray-100 text-gray-900",
                day_outside: "text-gray-300 opacity-50",
                day_disabled: "text-gray-300 opacity-50",
                day_hidden: "invisible",
              }}
              style={{
                '--selected-bg': colors.primary,
              }}
            />
            <Button
              onClick={() => setShowCalendar(false)}
              variant="outline"
              className="w-full mt-4"
            >
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}