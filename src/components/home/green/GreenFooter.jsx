import React from 'react';
import { Heart, Shield, Lock, Mail } from 'lucide-react';
import { G } from './palette';
import FadeIn from './FadeIn';
import ContactDialog from '@/components/home/ContactDialog';

export default function GreenFooter({ onCTA, scrollTo, ctaLabel }) {
  return (
    <footer style={{ backgroundColor: G.ink, color: '#E7EFE7' }}>
      <div className="max-w-5xl mx-auto px-5 md:px-6 py-16">
        <FadeIn className="text-center mb-14">
          <h2 className="font-display text-2xl md:text-3xl mb-4" style={{ color: '#fff' }}>Start reflecting today</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(231,239,231,0.7)' }}>A few calm minutes a night. Compounding clarity for life.</p>
          <button onClick={onCTA} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors min-h-[48px]"
            style={{ backgroundColor: G.accent, color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = G.accentHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = G.accent}>
            {ctaLabel}
          </button>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8 pt-10" style={{ borderTop: '1px solid rgba(231,239,231,0.15)' }}>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: G.accent }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="font-bold text-base" style={{ color: '#fff' }}>Smart Inventory</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'rgba(231,239,231,0.6)' }}>
              A modern reflection toolkit. Guided daily inventories, AI insights, and a calmer mind — one reflection at a time.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(231,239,231,0.5)' }}><Shield className="w-3.5 h-3.5" /> Private &amp; Secure</span>
              <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(231,239,231,0.5)' }}><Lock className="w-3.5 h-3.5" /> No data sold</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'rgba(231,239,231,0.9)' }}>Explore</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollTo('features')} className="text-sm min-h-[36px]" style={{ color: 'rgba(231,239,231,0.6)' }}>Features</button></li>
              <li><button onClick={() => scrollTo('how-it-works')} className="text-sm min-h-[36px]" style={{ color: 'rgba(231,239,231,0.6)' }}>How it works</button></li>
              <li><button onClick={() => scrollTo('pricing')} className="text-sm min-h-[36px]" style={{ color: 'rgba(231,239,231,0.6)' }}>Pricing</button></li>
              <li>
                <ContactDialog>
                  <button className="text-sm inline-flex items-center gap-1.5 min-h-[36px]" style={{ color: 'rgba(231,239,231,0.6)' }}>
                    <Mail className="w-3.5 h-3.5" /> Contact
                  </button>
                </ContactDialog>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(231,239,231,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(231,239,231,0.4)' }}>© {new Date().getFullYear()} Smart Inventory. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(231,239,231,0.3)' }}>Made with <Heart className="w-3 h-3" /> for daily reflection</p>
        </div>
      </div>
    </footer>
  );
}