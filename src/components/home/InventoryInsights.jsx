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
  const recentEntries = entries.slice(0, 30); // Last 30 entries for better analysis
  const last30Days = recentEntries.slice(0, Math.min(30, recentEntries.length));
  
  // Calculate Happiness Score (based on gratitudes, positive responses, and growth)
  let happinessScore = 0;
  let totalResponses = 0;
  
  recentEntries.forEach(entry => {
    const gratitudes = entry.responses?.gratitude?.value || [];
    const gratitudeCount = Array.isArray(gratitudes) ? gratitudes.length : 0;
    
    // Positive indicators
    if (entry.responses?.do_well?.value === 'yes' || entry.responses?.well?.value) {
      happinessScore += 2;
      totalResponses++;
    }
    if (entry.responses?.unkind?.value === 'yes') {
      happinessScore += 2;
      totalResponses++;
    }
    if (gratitudeCount > 0) {
      happinessScore += Math.min(gratitudeCount, 3);
      totalResponses++;
    }
    
    // Negative indicators (reduce score)
    if (entry.responses?.resentful?.value === 'yes') {
      happinessScore -= 1;
      totalResponses++;
    }
    if (entry.responses?.fearful?.value === 'yes') {
      happinessScore -= 1;
      totalResponses++;
    }
  });
  
  const happinessPercentage = totalResponses > 0 
    ? Math.max(0, Math.min(100, Math.round((happinessScore / (totalResponses * 2)) * 100)))
    : 0;
  
  // Analyze patterns for insights
  const patterns = {
    resentment: 0,
    fear: 0,
    dishonesty: 0,
    selfishness: 0,
    kindness: 0,
    growth: 0,
    service: 0
  };
  
  recentEntries.forEach(entry => {
    if (entry.responses?.resentful?.value === 'yes') patterns.resentment++;
    if (entry.responses?.fearful?.value === 'yes') patterns.fear++;
    if (entry.responses?.dishonest?.value === 'yes') patterns.dishonesty++;
    if (entry.responses?.selfish?.value === 'yes') patterns.selfishness++;
    if (entry.responses?.unkind?.value === 'yes') patterns.kindness++;
    if (entry.responses?.do_well?.value === 'yes') patterns.growth++;
    if (entry.responses?.service?.value === 'yes') patterns.service++;
  });
  
  // Generate insights
  const generateInsights = () => {
    const insights = [];
    const total = recentEntries.length;
    
    if (patterns.resentment > total * 0.4) {
      insights.push("Resentment appears frequently. Consider working through the 4th Step columns.");
    }
    if (patterns.fear > total * 0.4) {
      insights.push("Fear patterns detected. Explore what's driving your anxiety.");
    }
    if (patterns.kindness < total * 0.3) {
      insights.push("Opportunities to practice more kindness and compassion.");
    }
    if (patterns.growth > total * 0.6) {
      insights.push("Strong self-awareness and growth mindset showing through.");
    }
    if (patterns.service > 0) {
      insights.push("Service work strengthens recovery. Keep showing up for others.");
    }
    
    return insights.length > 0 ? insights.join(' ') : "Your reflections show honest self-examination. Keep tracking patterns.";
  };
  
  const insights = generateInsights();
  
  // Current focus areas
  const generateFocus = () => {
    if (recentEntries.length < 3) {
      return "Continue building your daily practice. The insights will deepen as you maintain consistency.";
    }
    
    const focusAreas = [];
    const total = recentEntries.length;
    
    if (patterns.resentment > total * 0.3) {
      focusAreas.push("work on letting go of resentments");
    }
    if (patterns.fear > total * 0.3) {
      focusAreas.push("address underlying fears");
    }
    if (patterns.dishonesty > total * 0.2) {
      focusAreas.push("practice radical honesty");
    }
    if (patterns.kindness < total * 0.4) {
      focusAreas.push("cultivate more kindness");
    }
    
    if (focusAreas.length === 0) {
      return "You're showing consistent growth and self-awareness. Keep focusing on your daily practice and gratitude.";
    }
    
    return `Based on your recent inventories, consider focusing on: ${focusAreas.join(', ')}. These patterns offer opportunities for deeper healing.`;
  };
  
  const focusText = generateFocus();
  
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
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{happinessPercentage}%</div>
            <div className="text-xs text-gray-600">Happiness Score</div>
          </div>
          
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)`
            }}
          >
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{recentEntries.length}</div>
            <div className="text-xs text-gray-600">Total Inventories</div>
          </div>
        </div>

        {/* Insights */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">Insights</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {insights}
          </p>
        </div>

        {/* Current Focus */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">Current Focus</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {focusText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}