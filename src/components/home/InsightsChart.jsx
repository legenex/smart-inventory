import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useTheme from '@/components/theme/useTheme';

export default function InsightsChart({ entries }) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  
  // Generate last 7 days
  const generateLast7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days;
  };
  
  // Calculate Awareness Score for a single entry
  const calculateEntryAwareness = (entry) => {
    const responses = entry.responses || {};
    let score = 0;
    
    // Depth - how many questions were answered
    const answeredQuestions = Object.keys(responses).filter(key => {
      const value = responses[key]?.value;
      return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
    }).length;
    score += Math.min(answeredQuestions / 5, 1) * 40;
    
    // Emotional engagement - facing difficult truths
    let emotionalEngagement = 0;
    if (responses.resentful?.value === 'yes') emotionalEngagement++;
    if (responses.fearful?.value === 'yes') emotionalEngagement++;
    if (responses.dishonest?.value === 'yes') emotionalEngagement++;
    score += (emotionalEngagement / 3) * 30;
    
    // Gratitude depth
    const gratitudes = responses.gratitude?.value || [];
    const gratitudeCount = Array.isArray(gratitudes) ? gratitudes.length : 0;
    score += Math.min(gratitudeCount / 3, 1) * 30;
    
    return Math.min(5, Math.max(1, Math.round(score / 20)));
  };
  
  // Process entries to show awareness over time
  const processData = () => {
    const last7Days = generateLast7Days();
    
    return last7Days.map(date => {
      const entry = entries.find(e => isSameDay(parseISO(e.date), date));
      
      if (!entry) {
        return {
          date: format(date, 'MMM d'),
          dayLabel: format(date, 'EEE'),
          fullDate: date,
          hasEntry: false,
          awareness: 0,
          entryId: null
        };
      }
      
      const awarenessScore = calculateEntryAwareness(entry);
      
      return {
        date: format(date, 'MMM d'),
        dayLabel: format(date, 'EEE'),
        fullDate: date,
        hasEntry: true,
        awareness: awarenessScore,
        entryId: entry.id
      };
    });
  };
  
  const data = processData();
  
  const hasAnyEntries = data.some(d => d.hasEntry);
  const entriesWithData = data.filter(d => d.hasEntry);
  
  // Calculate summary stats
  const avgAwarenessScore = hasAnyEntries 
    ? (entriesWithData.reduce((sum, d) => sum + d.awareness, 0) / entriesWithData.length).toFixed(1)
    : 0;
  
  const awarenessLabel = () => {
    if (!hasAnyEntries) return 'N/A';
    const avg = parseFloat(avgAwarenessScore);
    if (avg >= 4) return 'High';
    if (avg >= 2.5) return 'Moderate';
    return 'Low';
  };
  
  const inventoryConsistency = `${entriesWithData.length} of 7`;
  
  // Custom dot component - clickable for days with entries
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload.hasEntry) return null;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={colors.primary}
        stroke="white"
        strokeWidth={2}
        className="drop-shadow-md cursor-pointer hover:r-8 transition-all"
        onClick={() => navigate(createPageUrl(`HistoryDetail?id=${payload.entryId}`))}
        style={{ cursor: 'pointer' }}
      />
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1F2C46]">Inventory Trends</h3>
        {hasAnyEntries && (
          <div className="flex gap-4 text-xs">
            <div className="text-center">
              <div className="font-bold text-[#1F2C46]">{awarenessLabel()}</div>
              <div className="text-gray-500">Awareness Score</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#1F2C46]">{inventoryConsistency}</div>
              <div className="text-gray-500">Consistency</div>
            </div>
          </div>
        )}
      </div>
      
      {!hasAnyEntries ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-2">Your 7-day trends will appear here</p>
          <p className="text-sm text-gray-400">Complete inventories to track your patterns</p>
        </div>
      ) : (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="awarenessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <YAxis hide domain={[0, 5]} opacity={0.3} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].payload.hasEntry) {
                      return (
                        <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                          <p className="text-sm font-semibold text-[#1F2C46] mb-2">
                            {format(payload[0].payload.fullDate, 'EEEE, MMM d')}
                          </p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                              <span className="text-gray-600">Awareness: {payload[0].payload.awareness}/5</span>
                            </div>
                            <div className="text-gray-500">Inventory completed</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="awareness" 
                  stroke={colors.primary}
                  strokeWidth={2.5}
                  fill="url(#awarenessGradient)" 
                  dot={<CustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Dots indicate days you completed an inventory. Tap to view that entry.
          </p>
        </>
      )}
    </motion.div>
  );
}