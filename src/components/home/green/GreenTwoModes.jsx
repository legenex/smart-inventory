import React from 'react';
import { Check } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';

const MODES = [
  {
    badge: 'For recovery',
    title: 'Built for the program',
    points: ['Sobriety tracking with milestones', 'Nightly Step 10 inventory', 'Daily reflections for recovery'],
  },
  {
    badge: 'For everyone',
    title: 'Open to all',
    points: ['Neutral, non-recovery language', 'Same calm guided tools', 'No recovery wording, ever'],
  },
];

export default function GreenTwoModes() {
  return (
    <section id="two-modes" className="px-5 md:px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: G.ink }}>Two ways in</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: G.muted }}>Built for recovery, open to everyone. The product adapts to where you are.</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-5">
          {MODES.map((mode, i) => (
            <FadeIn key={mode.title} delay={i * 0.1}>
              <div className="rounded-2xl p-7 h-full" style={{ backgroundColor: G.card, border: `1px solid ${G.line}` }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: G.soft, color: G.accent }}>{mode.badge}</span>
                <h3 className="font-display text-xl mb-4" style={{ color: G.ink }}>{mode.title}</h3>
                <ul className="space-y-3">
                  {mode.points.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: G.ink }}>
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: G.accent }} /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}