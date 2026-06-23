import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function Insights() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <h1 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--ink)' }}>Insights</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Your patterns and progress</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-12 text-center"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--soft)' }}>
            <TrendingUp className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink)' }}>Insights are coming</h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            We're building detailed analytics to help you see patterns in your reflections, moods, and growth over time.
          </p>
        </motion.div>
      </div>
    </div>
  );
}