import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TITLES = {
  aa: 'Daily Reflection',
  na: 'Daily Meditation',
  hazelden: 'Thought for the Day',
  slaa: 'Daily Reading'
};

export default function Reading() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [readingType, setReadingType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    if (!type) {
      navigate(createPageUrl('TodayReadings'));
      return;
    }

    setReadingType(type);
    fetchReading(type);
  }, []);

  const fetchReading = async (type) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('fetchDailyReadings', {
        readingType: type,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      });
      setContent(response.data.content);
    } catch (error) {
      console.error(error);
      setContent('<p>Unable to load today\'s reading. Please try again later.</p>');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(createPageUrl('TodayReadings'))}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--ink)' }}>{TITLES[readingType]}</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Today's reflection</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 md:p-8"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div
            className="max-w-none [&_p]:mb-4 [&_p]:leading-relaxed"
            style={{ color: 'var(--ink)' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      </div>
    </div>
  );
}