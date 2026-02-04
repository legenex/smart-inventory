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
import { Smile, Meh, Frown, Heart, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MOODS = [
  { id: 'great', label: 'Great', icon: Heart, color: '#10B981' },
  { id: 'good', label: 'Good', icon: Smile, color: '#6BC2CE' },
  { id: 'okay', label: 'Okay', icon: Meh, color: '#FCD34D' },
  { id: 'struggling', label: 'Struggling', icon: Frown, color: '#F87171' },
  { id: 'energized', label: 'Energized', icon: Zap, color: '#7667E5' }
];

export default function MoodCheckIn({ open, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) return;
    
    setSaving(true);
    try {
      const user = await base44.auth.me();
      const today = new Date().toISOString().split('T')[0];
      
      // Save mood to user's daily log
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                selectedMood === mood.id ? 'ring-2 ring-offset-2' : 'hover:bg-gray-50'
              }`}
              style={selectedMood === mood.id ? { ringColor: mood.color } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <mood.icon 
                className="w-8 h-8" 
                style={{ color: mood.color }}
              />
              <span className="text-xs font-medium text-gray-700">{mood.label}</span>
            </motion.button>
          ))}
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!selectedMood || saving}
          className="w-full bg-gradient-to-r from-[#7667E5] to-[#5B9FED]"
        >
          {saving ? 'Saving...' : 'Continue'}
        </Button>
        
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700 text-center"
        >
          Skip for now
        </button>
      </DialogContent>
    </Dialog>
  );
}