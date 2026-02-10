import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Heart, Sparkles, Coffee } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';

const READINGS = [
  {
    id: 'aa',
    title: 'AA Daily Reflections',
    description: 'Daily reflections from Alcoholics Anonymous',
    icon: BookOpen,
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'na',
    title: 'NA Just For Today',
    description: 'Daily meditations from Narcotics Anonymous',
    icon: Heart,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'hazelden',
    title: 'Hazelden Twenty Four Hours a Day Reading',
    description: 'Daily reflections for spiritual growth',
    icon: Sparkles,
    gradient: 'from-pink-500 to-orange-500'
  },
  {
    id: 'slaa',
    title: 'SLAA State of Grace',
    description: 'Daily readings from Sex and Love Addicts Anonymous',
    icon: Coffee,
    gradient: 'from-teal-500 to-blue-500'
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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md">
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
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Readings</h2>
                  <p className="text-sm text-gray-500">Daily reflections for your journey</p>
                </div>
              </div>

              <div className="grid gap-3">
                {READINGS.map((reading, index) => (
                  <motion.button
                    key={reading.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectReading(reading.id)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${reading.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <reading.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{reading.title}</h3>
                        <p className="text-xs text-gray-500">{reading.description}</p>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
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
              <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-100">
                <button
                  onClick={handleBack}
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{reading?.title}</h2>
                  <p className="text-xs text-gray-500">{readingDate}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : selectedReading === 'hazelden' && typeof content === 'object' ? (
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Thought for the Day</h3>
                      <p className="whitespace-pre-line">{content.thought}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Meditation for the Day</h3>
                      <p className="whitespace-pre-line">{content.meditation}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Prayer for the Day</h3>
                      <p className="whitespace-pre-line">{content.prayer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed">
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