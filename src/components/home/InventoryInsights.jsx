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
  
  // Calculate Awareness Score (based on consistency, depth, and emotional range)
  const calculateAwarenessScore = () => {
    if (recentEntries.length === 0) return 'Low';
    
    let score = 0;
    
    // Consistency factor (40%)
    const consistencyRate = recentEntries.length / 30;
    score += consistencyRate * 40;
    
    // Depth factor (30%) - checking if they're engaging with multiple questions
    let depthScore = 0;
    recentEntries.forEach(entry => {
      const responses = entry.responses || {};
      const answeredQuestions = Object.keys(responses).filter(key => {
        const value = responses[key]?.value;
        return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
      }).length;
      depthScore += Math.min(answeredQuestions / 5, 1);
    });
    score += (depthScore / recentEntries.length) * 30;
    
    // Emotional range factor (30%) - engaging with difficult emotions
    let emotionalEngagement = 0;
    recentEntries.forEach(entry => {
      if (entry.responses?.resentful?.value === 'yes') emotionalEngagement++;
      if (entry.responses?.fearful?.value === 'yes') emotionalEngagement++;
      if (entry.responses?.dishonest?.value === 'yes') emotionalEngagement++;
    });
    score += Math.min((emotionalEngagement / recentEntries.length) * 30, 30);
    
    if (score >= 70) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };
  
  const awarenessScore = calculateAwarenessScore();
  
  // Calculate last 7 days consistency
  const last7DaysCount = recentEntries.filter(entry => {
    const daysDiff = Math.floor((new Date() - new Date(entry.date)) / (1000 * 60 * 60 * 24));
    return daysDiff < 7;
  }).length;
  
  // Analyze patterns for recurring themes
  const patterns = {
    resentment: 0,
    fear: 0,
    dishonesty: 0,
    selfishness: 0,
    kindness: 0,
    growth: 0,
    service: 0,
    boundaries: 0
  };
  
  recentEntries.forEach(entry => {
    if (entry.responses?.resentful?.value === 'yes') patterns.resentment++;
    if (entry.responses?.fearful?.value === 'yes') patterns.fear++;
    if (entry.responses?.dishonest?.value === 'yes') patterns.dishonesty++;
    if (entry.responses?.selfish?.value === 'yes') patterns.selfishness++;
    if (entry.responses?.unkind?.value === 'no') patterns.kindness++;
    if (entry.responses?.do_well?.value === 'yes') patterns.growth++;
    if (entry.responses?.service?.value === 'yes') patterns.service++;
    
    // Check for boundary themes in text responses
    const allText = JSON.stringify(entry.responses).toLowerCase();
    if (allText.includes('boundary') || allText.includes('boundaries')) patterns.boundaries++;
  });
  
  // Generate recurring patterns (1-3 bullet points)
  const generatePatterns = () => {
    const patternList = [];
    const total = recentEntries.length;
    
    if (patterns.resentment >= 3) {
      patternList.push(`Resentment showed up in ${patterns.resentment} of your last ${total} inventories`);
    }
    if (patterns.fear >= 3) {
      patternList.push('Fear and avoidance came up often this week');
    }
    if (patterns.boundaries >= 2) {
      patternList.push('Boundaries were a recurring theme');
    }
    if (patterns.dishonesty >= 2) {
      patternList.push('Struggled with honesty in several situations');
    }
    if (patterns.selfishness >= 3) {
      patternList.push('Self-centeredness appeared frequently');
    }
    
    return patternList.length > 0 
      ? patternList.slice(0, 3) 
      : ['No strong patterns yet—keep tracking'];
  };
  
  // Generate what you're doing well (1-3 bullet points)
  const generateStrengths = () => {
    const strengths = [];
    const total = recentEntries.length;
    
    if (last7DaysCount >= 5) {
      strengths.push("You've been consistent with daily check-ins");
    }
    if (patterns.growth >= total * 0.5) {
      strengths.push("You've been more honest and self-aware");
    }
    if (patterns.service >= 2) {
      strengths.push("Showing up in service for others");
    }
    if (patterns.kindness >= total * 0.6) {
      strengths.push("You're noticing when you're kind to others");
    }
    
    if (strengths.length === 0 && recentEntries.length >= 3) {
      strengths.push("You're showing up and doing the work");
    }
    
    return strengths.length > 0 ? strengths.slice(0, 3) : ['Keep building your practice'];
  };
  
  // Generate suggested focus (one actionable item)
  const generateSuggestedFocus = () => {
    if (recentEntries.length < 3) {
      return "Focus on completing one inventory each day this week";
    }
    
    const total = recentEntries.length;
    
    if (patterns.resentment > total * 0.4) {
      return "Tomorrow, pause and ask: what's my part in this resentment?";
    }
    if (patterns.fear > total * 0.4) {
      return "Focus on letting go of control in one situation";
    }
    if (patterns.dishonesty > total * 0.3) {
      return "Practice being rigorously honest in one conversation";
    }
    if (patterns.service === 0) {
      return "Look for one small way to be of service";
    }
    if (patterns.kindness < total * 0.3) {
      return "Tomorrow, pause before reacting when irritation shows up";
    }
    
    return "Continue showing up. One day at a time";
  };
  
  const recurringPatterns = generatePatterns();
  const strengths = generateStrengths();
  const suggestedFocus = generateSuggestedFocus();
  
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
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{awarenessScore}</div>
            <div className="text-xs text-gray-600">Awareness Score</div>
            <div className="text-[10px] text-gray-500 mt-1">Based on reflection depth and consistency</div>
          </div>
          
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)`
            }}
          >
            <div className="text-3xl font-bold text-[#1F2C46] mb-1">{last7DaysCount} of 7</div>
            <div className="text-xs text-gray-600">Inventory Consistency</div>
            <div className="text-[10px] text-gray-500 mt-1">Completed in the last 7 days</div>
          </div>
        </div>

        {/* Recurring Patterns */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">Recurring Patterns</h4>
          <div className="space-y-1.5">
            {recurringPatterns.map((pattern, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-snug">{pattern}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You're Doing Well */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">What You're Doing Well</h4>
          <div className="space-y-1.5">
            {strengths.map((strength, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-snug">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Focus */}
        <div 
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}05, ${colors.secondary}05)`
          }}
        >
          <h4 className="text-sm font-semibold text-[#1F2C46] mb-2">Suggested Focus</h4>
          <p className="text-sm text-gray-600 leading-snug">
            {suggestedFocus}
          </p>
        </div>
      </div>
    </motion.div>
  );
}