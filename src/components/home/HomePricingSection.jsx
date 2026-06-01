import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const FALLBACK_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    tagline: 'Full access, month by month',
    price_cents: 999,
    interval: 'month',
    trial_days: 7,
    is_featured: false,
    features: ['Daily inventory', 'Spot checks', 'AI insights', 'Journal scanner', 'Streaks & milestones'],
  },
  {
    id: 'annual',
    name: 'Annual',
    tagline: 'Best value — save 40%',
    price_cents: 5999,
    interval: 'year',
    trial_days: 7,
    is_featured: true,
    features: ['Everything in Monthly', 'Priority support', 'Early access to new features', 'Export your history'],
  },
];

function formatPrice(cents, interval) {
  const dollars = (cents / 100).toFixed(2).replace(/\.00$/, '');
  const suffix = interval === 'month' ? '/mo' : interval === 'year' ? '/yr' : '';
  return `$${dollars}${suffix}`;
}

export default function HomePricingSection({ onCTA }) {
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
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`grid gap-6 max-w-3xl mx-auto ${plans.length === 1 ? 'max-w-sm' : 'md:grid-cols-2'}`}>
      {plans.map((plan, i) => (
        <motion.div key={plan.id || i}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className={`relative rounded-3xl p-8 border-2 ${
            plan.is_featured
              ? 'border-[#7667E5] bg-gradient-to-br from-[#7667E5] to-[#5B9FED] text-white shadow-2xl'
              : 'border-gray-200 bg-white text-[#1F2C46] shadow-sm'
          }`}>
          {plan.is_featured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <Star className="w-3 h-3 fill-current" /> Most Popular
            </div>
          )}
          <h3 className={`text-2xl font-extrabold mb-1 ${plan.is_featured ? 'text-white' : 'text-[#1F2C46]'}`}>{plan.name}</h3>
          {plan.tagline && <p className={`text-sm mb-4 ${plan.is_featured ? 'text-white/80' : 'text-gray-500'}`}>{plan.tagline}</p>}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-black">{formatPrice(plan.price_cents, plan.interval)}</span>
          </div>
          {(plan.trial_days > 0) && (
            <p className={`text-xs mb-6 ${plan.is_featured ? 'text-white/70' : 'text-gray-400'}`}>
              {plan.trial_days}-day free trial included
            </p>
          )}
          {plan.features && plan.features.length > 0 && (
            <ul className="space-y-3 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.is_featured ? 'text-white' : 'text-[#7667E5]'}`} />
                  <span className={plan.is_featured ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={onCTA}
            className={`w-full min-h-[48px] text-base font-semibold rounded-2xl ${
              plan.is_featured ? 'bg-white text-[#7667E5] hover:bg-gray-100' : 'bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white hover:opacity-90'
            }`}>
            Start Free Trial
          </Button>
        </motion.div>
      ))}
    </div>
  );
}