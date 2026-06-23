import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Heart, Sparkles, Coffee } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';

const READINGS = [
  {
    id: 'aa',
    title: 'Daily Reflection',
    description: 'A daily reflection for your journey',
    icon: BookOpen
  },
  {
    id: 'na',
    title: 'Daily Meditation',
    description: 'A daily meditation for growth',
    icon: Heart
  },
  {
    id: 'hazelden',
    title: 'Thought for the Day',
    description: 'Daily thoughts and meditations',
    icon: Sparkles
  },
  {
    id: 'slaa',
    title: 'Daily Reading',
    description: 'A daily reading for reflection',
    icon: Coffee
  }
];

export default function ReadingsDialog({ open, onClose }) {
  const [selectedReading, setSelectedReading] = useState(null);
  const [content, setContent] = useState('');
  const [readingDate, setReadingDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectReading = async (readingType) => {
    setSelectedReading(readingType);
    setLoading(true);

    try {
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const response = await base44.functions.invoke('fetchDailyReadings', {
        readingType: readingType,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      });
      setContent(response.data.content);
      setReadingDate(today);
    } catch (error) {
      console.error(error);
      setContent('Unable to load today\'s reading. Please try again later.');
    }
    setLoading(false);
  };

  const handleBack = () => {
    setSelectedReading(null);
    setContent('');
    setReadingDate('');
  };

  const reading = READINGS.find(r => r.id === selectedReading);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 overflow-hidden rounded-3xl"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
        <AnimatePresence mode="wait">
          {!selectedReading ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={onClose}
                  className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--soft)' }}
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                </button>
                <div>
                  <h2 className="text-xl font-bold font-display" style={{ color: 'var(--ink)' }}>Today's Readings</h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Daily reflections for your journey</p>
                </div>
              </div>

              <div className="grid gap-3">
                {READINGS.map((reading, index) => (
                  <motion.button
                    key={reading.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectReading(reading.id)}
                    className="rounded-2xl p-4 transition-all text-left"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--line)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--soft)' }}>
                        <reading.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{reading.title}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{reading.description}</p>
                      </div>
                      <ArrowLeft className="w-5 h-5 rotate-180" style={{ color: 'var(--muted)' }} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-3 p-6 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
                <button
                  onClick={handleBack}
                  className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--soft)' }}
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                </button>
                <div>
                  <h2 className="text-lg font-bold font-display" style={{ color: 'var(--ink)' }}>{reading?.title}</h2>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{readingDate}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-12 overscroll-contain">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 rounded-full animate-spin"
                      style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
                  </div>
                ) : selectedReading === 'hazelden' && typeof content === 'object' ? (
                  <div className="space-y-6 leading-relaxed pb-8" style={{ color: 'var(--ink)' }}>
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>Thought for the Day</h3>
                      <p className="whitespace-pre-line">{content.thought}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>Meditation for the Day</h3>
                      <p className="whitespace-pre-line">{content.meditation}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>Prayer for the Day</h3>
                      <p className="whitespace-pre-line">{content.prayer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="leading-relaxed pb-8" style={{ color: 'var(--ink)' }}>
                    <p className="whitespace-pre-line">{typeof content === 'string' ? content : JSON.stringify(content)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}