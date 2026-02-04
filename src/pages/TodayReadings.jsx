import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, BookOpen, Heart, Sparkles, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    title: "Hazelden's Daily Meditations",
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

export default function TodayReadings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(createPageUrl('Dashboard'))}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today's Readings</h1>
            <p className="text-sm text-gray-500">Daily reflections for your journey</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {READINGS.map((reading, index) => (
            <motion.button
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(createPageUrl(`Reading?type=${reading.id}`))}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${reading.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <reading.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{reading.title}</h3>
              <p className="text-sm text-gray-500">{reading.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}