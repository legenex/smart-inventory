import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';

const FAQ_ITEMS = [
  { q: 'Is my data private?', a: 'Yes. Your reflections are stored securely and only visible to you. We never sell or share your data.' },
  { q: 'Do I need to be in a recovery program?', a: 'No. Smart Inventory works for everyone — people in recovery AND those who simply want a structured daily reflection practice.' },
  { q: 'How long does each session take?', a: 'A typical inventory takes 3–7 minutes. Spot checks take under 2 minutes.' },
  { q: 'What happens after the free trial?', a: 'After 7 days you choose a paid plan to continue. You\'ll never be cut off mid-reflection.' },
];

export default function GreenFaq() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="px-5 md:px-6 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: G.ink }}>Frequently asked</h2>
        </FadeIn>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: G.card, border: `1px solid ${G.line}` }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left font-medium min-h-[48px]" style={{ color: G.ink }}>
                  <span className="text-sm">{item.q}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 ml-3 transition-transform" style={{ color: G.muted, transform: open === i ? 'rotate(180deg)' : 'none' }} />
                </button>
                {open === i && <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: G.muted }}>{item.a}</div>}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}