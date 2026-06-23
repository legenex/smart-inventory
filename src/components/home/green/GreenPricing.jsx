import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';
import { base44 } from '@/api/base44Client';

const FALLBACK_PLANS = [
  { key: 'monthly', name: 'Monthly', tagline: 'Full access, month by month', price_cents: 999, interval: 'month', trial_days: 7, is_featured: false, features: ['Daily inventory', 'Spot checks', 'AI insights', 'Journal scanner', 'Streaks & milestones'] },
  { key: 'annual', name: 'Annual', tagline: 'Best value — save 40%', price_cents: 5999, interval: 'year', trial_days: 7, is_featured: true, features: ['Everything in Monthly', 'Priority support', 'Early access to new features', 'Export your history'] },
];

function formatPrice(cents, interval) {
  if (cents === 0) return 'Free';
  const dollars = (cents / 100).toFixed(2).replace(/\.00$/, '');
  const suffix = interval === 'month' ? '/mo' : interval === 'year' ? '/yr' : '';
  return `$${dollars}${suffix}`;
}

export default function GreenPricing({ onCTA }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Plan.filter({ is_active: true }, 'sort_order', 20)
      .then(data => setPlans(data && data.length > 0 ? data : FALLBACK_PLANS))
      .catch(() => setPlans(FALLBACK_PLANS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `3px solid ${G.line}`, borderTopColor: G.accent }} />
      </div>
    );
  }

  return (
    <section id="pricing" className="px-5 md:px-6 py-20 md:py-28" style={{ backgroundColor: G.soft }}>
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: G.ink }}>Simple, honest pricing</h2>
          <p className="text-base" style={{ color: G.muted }}>Start with a 7-day free trial. No card required.</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-5">
          {plans.map((plan, i) => (
            <FadeIn key={plan.key || i} delay={i * 0.1}>
              <div className="relative rounded-2xl p-7 h-full" style={{
                backgroundColor: G.card,
                border: plan.is_featured ? `2px solid ${G.accent}` : `1px solid ${G.line}`,
                boxShadow: plan.is_featured ? '0 8px 30px rgba(47,133,90,0.12)' : 'none',
              }}>
                {plan.is_featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap" style={{ backgroundColor: G.accent, color: '#fff' }}>
                    <Star className="w-3 h-3 fill-current" /> Most popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: G.ink }}>{plan.name}</h3>
                {plan.tagline && <p className="text-sm mb-4" style={{ color: G.muted }}>{plan.tagline}</p>}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold" style={{ color: G.ink }}>{formatPrice(plan.price_cents, plan.interval)}</span>
                </div>
                {plan.trial_days > 0 && <p className="text-xs mb-5" style={{ color: G.muted }}>{plan.trial_days}-day free trial included</p>}
                {plan.features?.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: G.ink }}>
                        <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: G.accent }} /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={onCTA} className="w-full py-3 rounded-full text-sm font-semibold transition-colors min-h-[48px]"
                  style={{ backgroundColor: G.accent, color: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = G.accentHover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = G.accent}>
                  Start free trial
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}