import React from 'react';
import { Flame } from 'lucide-react';
import { G } from './palette';

export default function AppPreviewCard() {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const progress = 0.62;
  return (
    <div className="relative">
      <div className="rounded-3xl p-6 md:p-7"
        style={{ backgroundColor: G.card, border: `1px solid ${G.line}`, boxShadow: '0 8px 30px rgba(31,42,34,0.08)' }}>
        <p className="text-lg font-semibold" style={{ color: G.ink }}>Evening, Nick</p>
        <p className="text-sm mb-5" style={{ color: G.muted }}>Tuesday, June 23 · day's almost done</p>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative shrink-0">
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke={G.soft} strokeWidth="8" />
              <circle cx="60" cy="60" r={radius} fill="none" stroke={G.accent} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} transform="rotate(-90 60 60)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: G.ink }}>3,832</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: G.muted }}>Days since I started</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: G.soft, color: G.accent }}>Year 11 · 62% there</span>
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#FBFAF4', border: `1px solid ${G.line}` }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: G.muted }}>Evening Review · 9:12 PM</p>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: G.accent }}>Did anything disturb your peace?</p>
              <p className="text-sm" style={{ color: G.ink }}>A coworker took credit; I replayed it on the drive home.</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: G.accent }}>What are you grateful for?</p>
              <p className="text-sm" style={{ color: G.ink }}>A quiet morning, strong coffee, a friend who texted back.</p>
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${G.line}` }}>
            <p className="text-sm italic font-display" style={{ color: G.accent }}>A recurring thread of reactivity this week, and your gratitude practice is quietly growing.</p>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 rounded-full px-4 py-2 flex items-center gap-1.5 text-xs font-semibold"
        style={{ backgroundColor: G.card, border: `1px solid ${G.line}`, boxShadow: '0 4px 12px rgba(31,42,34,0.1)', color: G.ink }}>
        <Flame className="w-3.5 h-3.5" style={{ color: G.accent }} />
        6 days on a streak
      </div>
    </div>
  );
}