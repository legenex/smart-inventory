import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, Sparkles, TrendingUp, Calendar, Bell, Lock,
  Menu, X, PenLine, Heart, Zap, BookOpen, Star, ChevronDown,
  Shield, Brain, ArrowRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ContactDialog from '@/components/home/ContactDialog';
import HomePricingSection from '@/components/home/HomePricingSection';
import HomeFooter from '@/components/home/HomeFooter';

const FAQ_ITEMS = [
  { q: 'Is my data private?', a: 'Yes. Your reflections are stored securely and only visible to you. We never sell or share your data.' },
  { q: 'Do I need to be in a recovery program?', a: 'No. Smart Inventory works for everyone — people in recovery AND those who simply want a structured daily reflection practice.' },
  { q: 'How long does each session take?', a: 'A typical inventory takes 3–7 minutes. Spot checks take under 2 minutes. It\'s designed to fit into any routine.' },
  { q: 'Can I use it on my phone?', a: 'Yes — it\'s built mobile-first and works beautifully on iPhone and Android.' },
  { q: 'What happens after the free trial?', a: 'After 7 days you choose a paid plan to continue. You\'ll never be cut off mid-reflection.' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  useEffect(() => {
    loadUser();
    return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      if (userData?.onboarding_completed) {
        redirectTimer.current = setTimeout(() => navigate(createPageUrl('Dashboard')), 2000);
      }
    } catch {
      // logged out — show marketing page normally
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleCTA = () => {
    if (user?.onboarding_completed) {
      navigate(createPageUrl('Dashboard'));
    } else if (user) {
      navigate(createPageUrl('Onboarding'));
    } else {
      base44.auth.redirectToLogin(createPageUrl('Onboarding'));
    }
  };

  const handleLogin = () => {
    if (user?.onboarding_completed) {
      navigate(createPageUrl('Dashboard'));
    } else if (user) {
      navigate(createPageUrl('Onboarding'));
    } else {
      base44.auth.redirectToLogin();
    }
  };

  const ctaLabel = user?.onboarding_completed ? 'Open the App' : 'Start Free Trial';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Redirect banner for already-onboarded users */}
      {user?.onboarding_completed && (
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white text-center py-3 px-4 text-sm font-medium">
          Welcome back! Redirecting to your dashboard…
          <button onClick={() => navigate(createPageUrl('Dashboard'))} className="underline ml-2 font-bold">Go now →</button>
        </motion.div>
      )}

      {/* Navbar */}
      <nav className={`fixed left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50 ${user?.onboarding_completed ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-[#7667E5] to-[#5B9FED] bg-clip-text text-transparent">
            Smart Inventory
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-gray-600 hover:text-[#7667E5] text-sm font-medium transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-gray-600 hover:text-[#7667E5] text-sm font-medium transition-colors">How It Works</button>
            <button onClick={() => scrollTo('pricing')} className="text-gray-600 hover:text-[#7667E5] text-sm font-medium transition-colors">Pricing</button>
            <ContactDialog>
              <button className="text-gray-600 hover:text-[#7667E5] text-sm font-medium transition-colors">Contact</button>
            </ContactDialog>
            {!user && (
              <button onClick={handleLogin} className="text-gray-700 hover:text-[#7667E5] text-sm font-semibold transition-colors">
                Log In
              </button>
            )}
            <Button onClick={handleCTA} size="sm" className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white rounded-xl">
              {ctaLabel}
            </Button>
          </div>
          <button onClick={() => setMobileMenuOpen(v => !v)}
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
              {['features', 'how-it-works', 'pricing'].map(id => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="block w-full text-left text-gray-700 py-3 font-medium min-h-[44px] capitalize">
                  {id.replace('-', ' ')}
                </button>
              ))}
              <ContactDialog>
                <button className="block w-full text-left text-gray-700 py-3 font-medium min-h-[44px]">Contact</button>
              </ContactDialog>
              {!user && (
                <button onClick={handleLogin} className="block w-full text-left text-gray-700 py-3 font-medium min-h-[44px]">
                  Log In
                </button>
              )}
              <Button onClick={handleCTA} className="w-full bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white rounded-xl mt-2 min-h-[48px]">
                {ctaLabel}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className={`${user?.onboarding_completed ? 'pt-36' : 'pt-28'} pb-24 px-6 bg-gradient-to-br from-[#F8F7FF] via-white to-[#EFF6FF]`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm border border-purple-100">
                <Sparkles className="w-4 h-4 text-[#7667E5]" />
                <span className="text-sm font-semibold text-[#7667E5]">AI-Powered Self-Reflection</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#1F2C46] mb-6 leading-[1.1]">
                A modern spiritual toolkit{' '}
                <span className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] bg-clip-text text-transparent">
                  that learns your patterns
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
                Guided daily inventories, spot checks, journal insights, and daily reflections — with AI that notices what you miss. Private, calm, and beautifully simple.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCTA} size="lg"
                  className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all min-h-[56px]">
                  {ctaLabel} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => scrollTo('how-it-works')} variant="outline" size="lg"
                  className="px-8 py-4 text-lg rounded-2xl border-2 border-gray-200 min-h-[56px]">
                  See How It Works
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> 7-day free trial · No credit card required
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7667E5]/10 to-[#5B9FED]/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-xl flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2C46]">Evening Review</p>
                    <p className="text-xs text-gray-400">Today · 9:12 PM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { q: 'What challenged you today?', a: 'I reacted instead of responding in a meeting.' },
                    { q: 'What are you grateful for?', a: 'My health, my morning walk, a good conversation.' },
                    { q: 'What could you do better tomorrow?', a: 'Listen more carefully before speaking.' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
                      className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-[#7667E5] font-semibold mb-1">{item.q}</p>
                      <p className="text-sm text-gray-700">{item.a}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                  className="mt-4 bg-gradient-to-r from-[#7667E5]/10 to-[#5B9FED]/10 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-[#7667E5] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Insight
                  </p>
                  <p className="text-sm text-gray-600 italic">You show a recurring pattern around reactivity. Your gratitude practice is growing — keep going.</p>
                </motion.div>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div><p className="font-bold text-[#1F2C46] text-sm">14 Days</p><p className="text-xs text-gray-500">Streak</p></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1F2C46] mb-4">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Three simple steps to a daily reflection practice that actually sticks.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: PenLine, title: 'Answer guided prompts', desc: 'Structured questions replace the blank page. Takes 3–7 minutes. Works for recovery and general self-growth.' },
              { step: '02', icon: Brain, title: 'Get AI-powered insights', desc: 'Your patterns are analyzed across days and weeks. The AI surfaces recurring themes you might miss on your own.' },
              { step: '03', icon: TrendingUp, title: 'Watch yourself grow', desc: 'Track streaks, milestones, and trends over time. Build awareness that compounds day after day.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative">
                <div className="text-7xl font-black text-gray-100 absolute -top-4 -left-2 select-none">{item.step}</div>
                <div className="relative bg-gradient-to-br from-[#F8F7FF] to-white rounded-2xl p-6 border border-purple-50">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7667E5] to-[#5B9FED] rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1F2C46] text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1F2C46] mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">A complete modern self-reflection toolkit, not just a journal.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PenLine, title: 'Daily & Evening Inventory', desc: 'Guided structured prompts for reflection. Adapts for recovery or general self-growth.', color: 'from-violet-500 to-purple-600' },
              { icon: Zap, title: 'Spot Check', desc: 'A quick mid-day pause when you feel off. Check in honestly and get a grounding response in seconds.', color: 'from-amber-400 to-orange-500' },
              { icon: BookOpen, title: 'Journal Scanner', desc: 'Take a photo of your handwritten journal and get an AI transcription and emotional analysis.', color: 'from-blue-500 to-cyan-500' },
              { icon: Star, title: 'Daily Reflections', desc: 'Original, app-authored daily readings tailored to your mode.', color: 'from-pink-400 to-rose-500' },
              { icon: Brain, title: 'Adaptive AI Insights', desc: 'The AI learns your patterns — recurring themes, emotional trends, growth wins — and adapts its suggestions.', color: 'from-emerald-400 to-teal-500' },
              { icon: TrendingUp, title: 'Streaks & Milestones', desc: 'Track your consistency. Celebrate milestones from 1 day to 10 years.', color: 'from-indigo-500 to-blue-500' },
              { icon: Heart, title: 'Gratitude & Affirmations', desc: 'A dedicated daily practice for gratitude lists and positive affirmations.', color: 'from-rose-400 to-pink-500' },
              { icon: Lock, title: 'Private & Secure', desc: 'Your reflections are yours. We never sell your data. Full control, always.', color: 'from-slate-500 to-gray-600' },
              { icon: Bell, title: 'Smart Reminders', desc: 'Set your preferred time and get a gentle nudge to maintain your practice.', color: 'from-yellow-400 to-amber-500' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1F2C46] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1F2C46] mb-4">Simple, Honest Pricing</h2>
            <p className="text-lg text-gray-500">Start with a free 7-day trial. No credit card required.</p>
          </motion.div>
          <HomePricingSection onCTA={handleCTA} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl font-extrabold text-[#1F2C46] text-center mb-12">
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-[#1F2C46] min-h-[56px]">
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1F2C46] to-[#2D3F5E] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl font-extrabold mb-6">Start Reflecting Today</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-10">Less than 5 minutes a day. Compounding clarity for life.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Button onClick={handleCTA} size="lg"
              className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED] text-white px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all min-h-[56px]">
              {ctaLabel} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-4 text-sm text-white/40">7-day free trial · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <HomeFooter user={user} onCTA={handleCTA} scrollTo={scrollTo} />
    </div>
  );
}