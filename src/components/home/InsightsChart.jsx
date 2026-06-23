import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useTheme from '@/components/theme/useTheme';

export default function InsightsChart({ entries }) {
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cardStroke = isDark ? '#181613' : '#FFFFFF';

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

  const calculateEntryAwareness = (entry) => {
    const responses = entry.responses || {};
    let score = 0;

    const answeredQuestions = Object.keys(responses).filter((key) => {
      const value = responses[key]?.value;
      return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
    }).length;
    score += Math.min(answeredQuestions / 5, 1) * 40;

    let emotionalEngagement = 0;
    if (responses.resentful?.value === 'yes') emotionalEngagement++;
    if (responses.fearful?.value === 'yes') emotionalEngagement++;
    if (responses.dishonest?.value === 'yes') emotionalEngagement++;
    score += (emotionalEngagement / 3) * 30;

    const gratitudes = responses.gratitude?.value || [];
    const gratitudeCount = Array.isArray(gratitudes) ? gratitudes.length : 0;
    score += Math.min(gratitudeCount / 3, 1) * 30;

    return Math.min(5, Math.max(1, Math.round(score / 20)));
  };

  const processData = () => {
    const last7Days = generateLast7Days();
    return last7Days.map((date) => {
      const entry = entries.find((e) => isSameDay(parseISO(e.date), date));
      if (!entry) {
        return {
          date: format(date, 'MMM d'),
          dayLabel: format(date, 'EEE'),
          fullDate: date,
          hasEntry: false,
          awareness: 0,
          entryId: null,
        };
      }
      return {
        date: format(date, 'MMM d'),
        dayLabel: format(date, 'EEE'),
        fullDate: date,
        hasEntry: true,
        awareness: calculateEntryAwareness(entry),
        entryId: entry.id,
      };
    });
  };

  const data = processData();
  const hasAnyEntries = data.some((d) => d.hasEntry);
  const entriesWithData = data.filter((d) => d.hasEntry);

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

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload.hasEntry) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={colors.primary}
        stroke={cardStroke}
        strokeWidth={2}
        className="cursor-pointer transition-all"
        onClick={() => navigate(createPageUrl(`HistoryDetail?id=${payload.entryId}`))}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-card p-6 shadow-soft border border-border"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-foreground">Trends</h3>
        {hasAnyEntries && (
          <div className="flex gap-4 text-xs">
            <div className="text-right">
              <div className="font-display font-semibold text-foreground tabular-nums">
                {awarenessLabel()}
              </div>
              <div className="text-muted-foreground">Awareness</div>
            </div>
            <div className="text-right">
              <div className="font-display font-semibold text-foreground tabular-nums">
                {inventoryConsistency}
              </div>
              <div className="text-muted-foreground">Consistency</div>
            </div>
          </div>
        )}
      </div>

      {!hasAnyEntries ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground mb-1">Your 7-day trends will appear here</p>
          <p className="text-xs text-muted-foreground">
            Complete inventories to track your patterns
          </p>
        </div>
      ) : (
        <>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="awarenessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis hide domain={[0, 5]} opacity={0.3} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0].payload.hasEntry) {
                      return (
                        <div className="bg-card rounded-control p-3 shadow-soft border border-border">
                          <p className="font-display text-sm font-semibold text-foreground mb-1">
                            {format(payload[0].payload.fullDate, 'EEE, MMM d')}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Awareness: {payload[0].payload.awareness}/5
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
                  strokeWidth={2}
                  fill="url(#awarenessGradient)"
                  dot={<CustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Dots indicate days you completed an inventory. Tap to view.
          </p>
        </>
      )}
    </motion.div>
  );
}