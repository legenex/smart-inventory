import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, PenLine, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const TOOLS = [
  { title: 'Spot Check', desc: 'A quick mid-day pause to check in', icon: Zap, path: 'SpotCheck', color: 'from-amber-400 to-orange-500' },
  { title: 'Gratitude & Affirmations', desc: 'Daily gratitude practice', icon: Heart, path: 'GratitudeAffirmations', color: 'from-pink-400 to-rose-500' },
  { title: 'Journal', desc: 'Scan handwritten notes for insights', icon: PenLine, path: 'Journaling', color: 'from-violet-400 to-purple-500' },
  { title: "Today's Reading", desc: 'Daily reflections and readings', icon: BookOpen, path: 'TodayReadings', color: 'from-blue-400 to-cyan-500' },
];

export default function Toolkit() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-28">
      <h1 className="text-3xl font-extrabold font-display text-foreground mb-2">Toolkit</h1>
      <p className="text-muted-foreground mb-8">Quick access to all your reflection tools.</p>
      <div className="space-y-3">
        {TOOLS.map((tool, i) => (
          <motion.button
            key={tool.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(createPageUrl(tool.path))}
            className="w-full bg-card rounded-card p-5 shadow-soft border border-border hover:shadow-lg transition-all group text-left flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.color} shadow-md group-hover:scale-105 transition-transform flex-shrink-0`}>
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}