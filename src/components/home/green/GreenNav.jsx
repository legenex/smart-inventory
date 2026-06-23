import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { G } from './palette';

const NAV_LINKS = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Two modes', id: 'two-modes' },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: G.accent }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="font-bold text-base tracking-tight" style={{ color: G.ink }}>Smart Inventory</span>
    </div>
  );
}

export default function GreenNav({ onCTA, ctaLabel, onLogin, scrollTo, user }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50"
      style={{ backgroundColor: 'rgba(244,241,232,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${G.line}` }}>
      <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm font-medium min-h-[44px] flex items-center" style={{ color: G.muted }}>{l.label}</button>
          ))}
          {!user && (
            <button onClick={onLogin} className="text-sm font-medium min-h-[44px] flex items-center" style={{ color: G.ink }}>Log in</button>
          )}
          <button onClick={onCTA} className="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors min-h-[44px]"
            style={{ backgroundColor: G.accent, color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = G.accentHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = G.accent}>
            {ctaLabel}
          </button>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
          {open ? <X className="w-5 h-5" style={{ color: G.ink }} /> : <Menu className="w-5 h-5" style={{ color: G.ink }} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 py-4 space-y-1" style={{ backgroundColor: G.bg, borderTop: `1px solid ${G.line}` }}>
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => { scrollTo(l.id); setOpen(false); }} className="block w-full text-left py-3 text-sm font-medium min-h-[44px]" style={{ color: G.ink }}>{l.label}</button>
          ))}
          {!user && (
            <button onClick={() => { onLogin(); setOpen(false); }} className="block w-full text-left py-3 text-sm font-medium min-h-[44px]" style={{ color: G.ink }}>Log in</button>
          )}
          <button onClick={() => { onCTA(); setOpen(false); }} className="w-full py-3 rounded-full text-sm font-semibold min-h-[44px] mt-2" style={{ backgroundColor: G.accent, color: '#fff' }}>{ctaLabel}</button>
        </div>
      )}
    </nav>
  );
}