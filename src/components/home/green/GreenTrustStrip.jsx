import React from 'react';
import { Star, Clock, Lock } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';

const ITEMS = [
  { icon: Star, label: '4.9 average rating' },
  { icon: Clock, label: '3–7 minutes a night' },
  { icon: Lock, label: '100% private' },
];

export default function GreenTrustStrip() {
  return (
    <FadeIn>
      <section className="px-5 md:px-6 py-8" style={{ borderTop: `1px solid ${G.line}`, borderBottom: `1px solid ${G.line}` }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          <p className="text-sm font-medium" style={{ color: G.muted }}>Trusted in quiet daily practice</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ITEMS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: G.ink }}>
                <Icon className="w-4 h-4" style={{ color: G.accent }} /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}