import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SmilePlus, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useTheme from '@/components/theme/useTheme';

const MOODS = [
  { id: 'great', label: 'Great', icon: SmilePlus, color: '#10B981' },
  { id: 'good', label: 'Good', icon: Smile, color: '#6BC2CE' },
  { id: 'okay', label: 'Okay', icon: Meh, color: '#FCD34D' },
  { id: 'struggling', label: 'Struggling', icon: Frown, color: '#F87171' },
  { id: 'energized', label: 'Energized', icon: Sparkles, color: '#A48FFF' }
];

export default function MoodCheckIn({ open, onClose }) {
  const { colors } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);
  const [disableCheckin, setDisableCheckin] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) return;
    
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await base44.auth.updateMe({
        last_mood_check: today,
        last_mood: selectedMood
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
        await base44.auth.updateMe({
          mood_check_enabled: false
        });
      } catch (error) {
        console.error(error);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">How are you feeling today?</DialogTitle>
          <DialogDescription className="text-center">
            Check in with yourself to track your emotional journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-5 gap-3 py-6">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedMood === mood.id ? 'ring-2 ring-offset-2 shadow-lg' : 'hover:bg-gray-50/50'
              }`}
              style={selectedMood === mood.id ? { 
                ringColor: mood.color,
                backgroundColor: `${mood.color}10`
              } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <mood.icon 
                className="w-10 h-10" 
                style={{ 
                  color: mood.color,
                  strokeWidth: selectedMood === mood.id ? 2.5 : 2
                }}
              />
              <span className="text-xs font-semibold text-gray-700">{mood.label}</span>
            </motion.button>
          ))}
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!selectedMood || saving}
          className="w-full py-6 rounded-2xl text-white"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
          }}
        >
          {saving ? 'Saving...' : 'Continue'}
        </Button>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              id="disable-checkin"
              checked={disableCheckin}
              onCheckedChange={setDisableCheckin}
            />
            <label
              htmlFor="disable-checkin"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Don't ask me again
            </label>
          </div>
          
          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}