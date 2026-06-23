import React from 'react';
import { PenLine, Zap, Camera, BookOpen, Brain, Lock } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';

const FEATURES = [
  { icon: PenLine, title: 'Nightly inventory', desc: 'A few guided questions each evening to close the day honestly.' },
  { icon: Zap, title: 'Spot check', desc: 'A two-minute reset when you feel off-center mid-day.' },
  { icon: Camera, title: 'Journal scanner', desc: 'Photograph your handwritten pages and get AI transcription and insight.' },
  { icon: BookOpen, title: 'Daily reflections', desc: 'Original, app-authored readings tailored to your mode.' },
  { icon: Brain, title: 'Adaptive AI insights', desc: 'The AI surfaces recurring themes and patterns you might miss.' },
  { icon: Lock, title: 'Private by design', desc: 'Your reflections are yours. We never sell or share your data.' },
];

export default function GreenFeatures() {
  return (
    <section id="features" className="px-5 md:px-6 py-20 md:py-28" style={{ backgroundColor: G.soft }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: G.ink }}>Everything you need</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: G.muted }}>A complete reflection toolkit, not just a journal.</p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={(i % 3) * 0.08}>
              <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: G.card, border: `1px solid ${G.line}` }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: G.soft }}>
                  <f.icon className="w-5 h-5" style={{ color: G.accent }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: G.ink }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: G.muted }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}