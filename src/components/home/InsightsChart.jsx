import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { startOfWeek, addDays, format, parseISO, isSameDay } from 'date-fns';
import useTheme from '@/components/theme/useTheme';

export default function InsightsChart({ entries }) {
  const { colors } = useTheme();
  
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
  
  // Process entries to show dots on days with inventories
  const processData = () => {
    const last7Days = generateLast7Days();
    
    return last7Days.map(date => {
      const entry = entries.find(e => isSameDay(parseISO(e.date), date));
      
      if (!entry) {
        return {
          date: format(date, 'EEE'),
          fullDate: date,
          hasEntry: false,
          gratitude: 0,
          growth: 0,
          gratitudeScore: 0,
          growthScore: 0
        };
      }
      
      const responses = entry.responses || {};
      let gratitudeScore = 0;
      let challengeScore = 0;
      
      // Calculate scores based on responses
      if (entry.inventory_type === 'aa') {
        const gratitudes = responses.gratitude?.value || [];
        gratitudeScore = Array.isArray(gratitudes) ? gratitudes.length : 0;
        challengeScore = [
          responses.resentful?.value,
          responses.dishonest?.value,
          responses.selfish?.value,
          responses.fearful?.value,
          responses.harmful?.value
        ].filter(v => v === 'yes').length;
      } else {
        const gratitudes = responses.gratitude?.value || [];
        gratitudeScore = Array.isArray(gratitudes) ? gratitudes.length : 0;
        challengeScore = responses.challenged?.value ? 1 : 0;
      }
      
      const gratitudeLevel = Math.min(5, gratitudeScore);
      const growthLevel = Math.max(1, 5 - challengeScore);
      
      return {
        date: format(date, 'EEE'),
        fullDate: date,
        hasEntry: true,
        gratitude: gratitudeLevel,
        growth: growthLevel,
        gratitudeScore: gratitudeScore,
        growthScore: Math.round((growthLevel / 5) * 100)
      };
    });
  };
  
  const data = processData();
  
  const hasAnyEntries = data.some(d => d.hasEntry);
  
  // Calculate summary stats
  const avgGratitude = hasAnyEntries 
    ? (data.filter(d => d.hasEntry).reduce((sum, d) => sum + d.gratitudeScore, 0) / data.filter(d => d.hasEntry).length).toFixed(1)
    : 0;
  const avgGrowth = hasAnyEntries
    ? Math.round(data.filter(d => d.hasEntry).reduce((sum, d) => sum + d.growthScore, 0) / data.filter(d => d.hasEntry).length)
    : 0;
  
  // Custom dot component - always visible on days with entries
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
        className="drop-shadow-md"
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
              <div className="font-bold text-[#1F2C46]">{avgGratitude}</div>
              <div className="text-gray-500">Avg Gratitudes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#1F2C46]">{avgGrowth}%</div>
              <div className="text-gray-500">Growth Score</div>
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
                  <linearGradient id="gratitudeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].payload.hasEntry) {
                      return (
                        <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                          <p className="text-sm font-semibold text-[#1F2C46] mb-2">
                            {format(payload[0].payload.fullDate, 'EEE, MMM d')}
                          </p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                              <span className="text-gray-600">{payload[0].payload.gratitudeScore} Gratitudes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                              <span className="text-gray-600">{payload[0].payload.growthScore}% Growth</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gratitude" 
                  stroke={colors.primary}
                  strokeWidth={2}
                  fill="url(#gratitudeGradient)" 
                  name="Gratitude"
                  dot={<CustomDot />}
                />
                <Area 
                  type="monotone" 
                  dataKey="growth" 
                  stroke={colors.secondary}
                  strokeWidth={2}
                  fill="url(#growthGradient)" 
                  name="Growth"
                  dot={<CustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
              <span className="text-sm text-gray-600">Gratitude</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary }} />
              <span className="text-sm text-gray-600">Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: colors.primary }} />
              <span className="text-sm text-gray-600">Inventory Done</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}