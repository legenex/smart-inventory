import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PenLine, Zap, Heart, Camera, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { getCopy } from '@/lib/mode';
import InventoryCard from '@/components/home/InventoryCard';

export default function Tools() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tools');
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'history') setActiveTab('history');
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.recovery_status) {
        navigate(createPageUrl('Onboarding'));
        return;
      }
      setUser(userData);
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['allInventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 100),
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  const copy = getCopy(user.recovery_status);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardProps = (delay = 0) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: prefersReduced ? 0 : delay },
    whileTap: { scale: prefersReduced ? 1 : 0.97 }
  });

  const TOOLS = [
    { id: 'inventory', title: copy.inventoryVerb, desc: copy.inventoryDesc, icon: PenLine, path: '/Inventory' },
    { id: 'spotcheck', title: copy.spotCheckTitle, desc: copy.spotCheckDesc, icon: Zap, path: '/SpotCheck' },
    { id: 'gratitude', title: copy.gratitudeTitle, desc: copy.gratitudeDesc, icon: Heart, path: '/GratitudeAffirmations' },
    { id: 'affirmations', title: copy.affirmationsTitle, desc: copy.affirmationsDesc, icon: Sparkles, path: '/GratitudeAffirmations' },
    { id: 'journal', title: copy.journalTitle, desc: copy.journalDesc, icon: Camera, path: '/Journaling' },
  ];

  const handleDeleteEntry = () => refetch();

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <h1 className="text-2xl font-bold font-display mb-6" style={{ color: 'var(--ink)' }}>
          {copy.toolkit}
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
          <button
            onClick={() => setActiveTab('tools')}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]"
            style={{
              backgroundColor: activeTab === 'tools' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'tools' ? 'var(--accentInk)' : 'var(--muted)'
            }}
          >
            Tools
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]"
            style={{
              backgroundColor: activeTab === 'history' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'history' ? 'var(--accentInk)' : 'var(--muted)'
            }}
          >
            History
          </button>
        </div>

        {activeTab === 'tools' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOOLS.map((tool, index) => (
              <motion.button
                key={tool.id}
                {...cardProps(index * 0.05)}
                onClick={() => navigate(tool.path)}
                className="rounded-2xl p-5 text-left flex items-start gap-4"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--soft)' }}>
                  <tool.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>{tool.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{tool.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--muted)' }} />
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl p-5 animate-pulse"
                    style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl" style={{ backgroundColor: 'var(--soft)' }} />
                      <div className="flex-1">
                        <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--soft)' }} />
                        <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--soft)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="rounded-2xl p-12 text-center"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--soft)' }}>
                  <Calendar className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink)' }}>No reflections yet</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Start your first inventory</p>
                <button
                  onClick={() => navigate(createPageUrl('Inventory'))}
                  className="px-6 py-3 rounded-xl font-medium min-h-[44px]"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
                >
                  Start Inventory
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <InventoryCard key={entry.id} entry={entry} index={index} onDelete={handleDeleteEntry} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}