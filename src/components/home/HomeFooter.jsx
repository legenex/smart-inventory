import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Lock, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ContactDialog from '@/components/home/ContactDialog';

export default function HomeFooter({ user, onCTA, scrollTo }) {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0F172A] text-white">
      {/* CTA band */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#1E2A4A] to-[#2A3A55] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Start Reflecting Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg text-white/70 mb-8"
          >
            Less than 5 minutes a day. Compounding clarity for life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onCTA}
              size="lg"
              className="bg-gradient-to-r from-[#6366F1] to-[#5B9FED] text-white px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all min-h-[56px]"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-4 text-sm text-white/40">7-day free trial · Cancel anytime</p>
          </motion.div>
        </div>
      </div>

      {/* Main footer bar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="text-2xl font-extrabold bg-gradient-to-r from-[#818CF8] to-[#5B9FED] bg-clip-text text-transparent mb-2">
              Smart Inventory
            </div>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              A modern spiritual &amp; self-reflection toolkit. Guided daily inventories, AI insights, and a calmer mind — one reflection at a time.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                <Shield className="w-3.5 h-3.5 text-green-400" /> Private &amp; Secure
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                <Lock className="w-3.5 h-3.5 text-green-400" /> No data sold
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-bold text-white/90 mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => scrollTo('features')} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">Features</button></li>
              <li><button onClick={() => scrollTo('how-it-works')} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">How It Works</button></li>
              <li><button onClick={() => scrollTo('pricing')} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">Pricing</button></li>
              <li><button onClick={() => scrollTo('faq')} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">FAQ</button></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-bold text-white/90 mb-4 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <ContactDialog>
                  <button className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1.5 min-h-[36px]">
                    <Mail className="w-3.5 h-3.5" /> Contact Us
                  </button>
                </ContactDialog>
              </li>
              {user && (
                <li>
                  <button onClick={() => navigate(createPageUrl('Dashboard'))} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">
                    Dashboard
                  </button>
                </li>
              )}
              <li>
                <button onClick={onCTA} className="text-white/60 hover:text-white text-sm transition-colors min-h-[36px]">
                  {user ? 'Open App' : 'Log In'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Smart Inventory. All rights reserved.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-white/40 fill-current" /> for daily reflection
          </p>
        </div>
      </div>
    </footer>
  );
}