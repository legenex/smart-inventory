import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';
import AppPreviewCard from './AppPreviewCard';

const REASSURANCES = ['7-day free trial', 'No card required', 'Private by design'];

export default function GreenHero({ onCTA, ctaLabel, scrollTo }) {
  return (
    <section className="px-5 md:px-6 pt-12 md:pt-20 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <FadeIn>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5" style={{ backgroundColor: G.soft, color: G.accent }}>
            Daily reflection, gently guided
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.12] mb-5" style={{ color: G.ink }}>
            End each day a little more <span className="italic" style={{ color: G.accent }}>honest with yourself.</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8 max-w-md" style={{ color: G.muted }}>
            Smart Inventory turns the nightly inventory into a few calm, guided questions, then quietly notices the patterns you would miss on your own. Built for recovery, open to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <button onClick={onCTA} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors min-h-[48px]"
              style={{ backgroundColor: G.accent, color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = G.accentHover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = G.accent}>
              {ctaLabel} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-colors min-h-[48px]" style={{ color: G.ink }}>
              See how it works
            </button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {REASSURANCES.map(r => (
              <span key={r} className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: G.muted }}>
                <Check className="w-3.5 h-3.5" style={{ color: G.accent }} /> {r}
              </span>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <AppPreviewCard />
        </FadeIn>
      </div>
    </section>
  );
}