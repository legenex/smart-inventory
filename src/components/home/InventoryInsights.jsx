import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';
import useTheme from '@/components/theme/useTheme';

export default function InventoryInsights({ entries }) {
  const { colors } = useTheme();

  // If no entries, show empty state
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}20, ${colors.secondary}20)`
            }}
          >
            <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1F2C46]">Inventory Insights</h3>
            <p className="text-sm text-gray-500">AI-powered analysis of your journey</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-2">
            Your personal insights dashboard will appear here once you start your inventory practice.
          </p>
          <p className="text-sm text-gray-500">
            As you complete inventories, our AI will identify patterns, track your growth, and highlight areas of focus to support your recovery journey.
          </p>
        </div>
      </motion.div>
    );
  }

  // Analyze recent entries for insights
  const recentEntries = entries.slice(0, 7); // Last 7 entries
  
  // Count gratitudes
  const totalGratitudes = recentEntries.reduce((sum, entry) => {
    const gratitudes = entry.responses?.gratitude?.value || [];
    return sum + gratitudes.length;
  }, 0);
  
  // Identify common themes (simplified)
  const themes = {
    growth: 0,
    challenges: 0,
    positivity: 0
  };
  
  recentEntries.forEach(entry => {
    if (entry.responses?.do_well?.value === 'yes' || entry.responses?.well?.value) themes.growth++;
    if (entry.responses?.resentful?.value === 'yes' || entry.responses?.challenged?.value) themes.challenges++;
    if (entry.responses?.unkind?.value === 'yes') themes.positivity++;
  });

  const avgGratitudesPerDay = (totalGratitudes / recentEntries.length).toFixed(1);
  const positivityScore = Math.round((themes.positivity / recentEntries.length) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}20, ${colors.secondary}20)`
          }}
        >
          <TrendingUp className="w-6 h-6" style={{ color: colors.primary }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1F2C46]">Inventory Insights</h3>
          <p className="text-sm text-gray-500">Based on your last {recentEntries.length} inventories</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)`
            }}
          >
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{avgGratitudesPerDay}</div>
            <div className="text-xs text-gray-600">Avg. Gratitudes/Day</div>
          </div>
          
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)`
            }}
          >
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{positivityScore}%</div>
            <div className="text-xs text-gray-600">Kindness Score</div>
          </div>
        </div>

        {/* Focus Areas */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">Current Focus</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {themes.growth > themes.challenges 
              ? "You're showing consistent growth and self-awareness. Keep focusing on your wins and gratitude practice."
              : themes.challenges > 0
              ? "You're working through challenges with honesty. Consider exploring these patterns further in your reflections."
              : "Continue building your daily practice. The insights will deepen as you maintain consistency."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}