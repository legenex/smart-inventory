import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { format, subDays, isToday, isFuture } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function InventoryDateDialog({ open, onClose }) {
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
      <DialogContent
        className="sm:max-w-md rounded-3xl border-0 shadow-2xl"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center" style={{ color: 'var(--ink)' }}>
            Write Inventory
          </DialogTitle>
        </DialogHeader>

        {!showCalendar ? (
          <div className="space-y-3 py-4">
            {/* Today Button */}
            <button
              onClick={handleTodayClick}
              className="w-full p-5 rounded-2xl border-2 transition-all text-left group min-h-[72px]"
              style={{
                borderColor: 'var(--accent)',
                backgroundColor: 'var(--soft)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg" style={{ color: 'var(--ink)' }}>Today</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(new Date(), 'EEEE, MMMM d')}</p>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--muted)' }} />
              </div>
            </button>

            {/* Yesterday Button */}
            <button
              onClick={() => handleDateSelect(yesterday)}
              className="w-full p-5 rounded-2xl border transition-all text-left group min-h-[72px]"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--ink)' }}>Yesterday</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(yesterday, 'EEEE, MMMM d')}</p>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--muted)' }} />
              </div>
            </button>

            {/* Choose Date Button */}
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full p-5 rounded-2xl border transition-all text-left group min-h-[72px]"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <p className="font-semibold" style={{ color: 'var(--ink)' }}>Choose a Date</p>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--muted)' }} />
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
                nav_button: "h-7 w-7 p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative",
                day: "h-9 w-9 p-0 font-normal rounded-md",
                day_selected: "text-white",
                day_today: "font-bold",
                day_outside: "opacity-50",
                day_disabled: "opacity-50",
                day_hidden: "invisible",
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