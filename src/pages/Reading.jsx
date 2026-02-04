import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TITLES = {
  aa: 'AA Daily Reflections',
  na: 'NA Just For Today',
  hazelden: "Hazelden's Daily Meditations",
  slaa: 'SLAA State of Grace'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(createPageUrl('TodayReadings'))}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{TITLES[readingType]}</h1>
            <p className="text-sm text-gray-500">Today's reflection</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      </div>
    </div>
  );
}