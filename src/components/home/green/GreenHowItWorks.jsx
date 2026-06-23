import React from 'react';
import { Compass, PenLine, TrendingUp } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';

const STEPS = [
  { icon: Compass, title: 'Choose your mode', desc: 'Recovery or general self-reflection. The language adapts — the calm doesn\'t.' },
  { icon: PenLine, title: 'Answer a few guided questions each night', desc: 'Structured prompts replace the blank page. Three to seven minutes, that\'s it.' },
  { icon: TrendingUp, title: 'Watch the patterns surface over time', desc: 'The AI quietly notices themes across days and weeks you would miss on your own.' },
];

export default function GreenHowItWorks() {
  return (
    <section id="how-it-works" className="px-5 md:px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: G.ink }}>How it works</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: G.muted }}>Three calm steps to a daily practice that actually sticks.</p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: G.card, border: `1px solid ${G.line}` }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: G.soft }}>
                  <step.icon className="w-5 h-5" style={{ color: G.accent }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: G.accent }}>Step {i + 1}</p>
                <h3 className="font-semibold text-base mb-2" style={{ color: G.ink }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: G.muted }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}