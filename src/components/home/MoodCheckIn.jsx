import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SmilePlus, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useTheme from '@/components/theme/useTheme';

const MOODS = [
  { id: 'great', label: 'Great', icon: SmilePlus, color: '#10B981' },
  { id: 'good', label: 'Good', icon: Smile, color: '#6BC2CE' },
  { id: 'okay', label: 'Okay', icon: Meh, color: '#D4A853' },
  { id: 'struggling', label: 'Struggling', icon: Frown, color: '#C47070' },
  { id: 'energized', label: 'Energized', icon: Sparkles, color: '#A48FFF' },
];

export default function MoodCheckIn({ open, onClose }) {
  const { colors } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);
  const [disableCheckin, setDisableCheckin] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await base44.auth.updateMe({
        last_mood_check: today,
        last_mood: selectedMood,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const handleSkip = async () => {
    if (disableCheckin) {
      try {
        await base44.auth.updateMe({ mood_check_enabled: false });
      } catch (error) {
        console.error(error);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-card bg-card border-border shadow-soft">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center text-foreground">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Check in with yourself to track your emotional journey
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-2 py-4">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-control transition-all border-2 ${
                selectedMood === mood.id ? '' : 'border-transparent hover:bg-muted'
              }`}
              style={
                selectedMood === mood.id
                  ? { borderColor: mood.color, backgroundColor: `${mood.color}0D` }
                  : {}
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              <mood.icon
                className="w-8 h-8"
                style={{
                  color: mood.color,
                  strokeWidth: selectedMood === mood.id ? 2.5 : 1.5,
                }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={!selectedMood || saving}
          className="w-full h-12 rounded-control"
        >
          {saving ? 'Saving...' : 'Continue'}
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              id="disable-checkin"
              checked={disableCheckin}
              onCheckedChange={setDisableCheckin}
            />
            <label
              htmlFor="disable-checkin"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't ask me again
            </label>
          </div>

          <button
            onClick={handleSkip}
            className="w-full text-sm text-muted-foreground hover:text-foreground text-center py-2"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}