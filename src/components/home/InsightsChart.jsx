import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function InsightsChart({ entries }) {
  // Process entries to extract emotional patterns
  const processData = () => {
    if (!entries || entries.length === 0) return [];
    
    const last7 = entries.slice(0, 7).reverse();
    
    return last7.map(entry => {
      const responses = entry.responses || {};
      let gratitudeScore = 0;
      let challengeScore = 0;
      
      // Calculate scores based on responses
      if (entry.inventory_type === 'aa') {
        gratitudeScore = responses.gratitude ? 5 : 3;
        challengeScore = [
          responses.resentful?.value,
          responses.dishonest?.value,
          responses.selfish?.value,
          responses.fearful?.value,
          responses.harmful?.value
        ].filter(Boolean).length;
      } else {
        gratitudeScore = responses.gratitude ? 5 : 3;
        challengeScore = responses.challenged?.value ? 3 : 1;
      }
      
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        gratitude: gratitudeScore,
        growth: Math.max(1, 5 - challengeScore)
      };
    });
  };
  
  const data = processData();
  
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Weekly Insights</h3>
        <p className="text-gray-500 text-center py-8">Complete more inventories to see your patterns</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Weekly Insights</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gratitudeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7667E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7667E5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6BC2CE" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6BC2CE" stopOpacity={0}/>
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
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="gratitude" 
              stroke="#7667E5" 
              strokeWidth={2}
              fill="url(#gratitudeGradient)" 
              name="Gratitude"
            />
            <Area 
              type="monotone" 
              dataKey="growth" 
              stroke="#6BC2CE" 
              strokeWidth={2}
              fill="url(#growthGradient)" 
              name="Growth"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#7667E5]" />
          <span className="text-sm text-gray-600">Gratitude</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6BC2CE]" />
          <span className="text-sm text-gray-600">Growth</span>
        </div>
      </div>
    </motion.div>
  );
}