import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ShareButton from '@/components/summary/ShareButton';

export default function Summary() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntry();
  }, []);

  const loadEntry = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      navigate(createPageUrl('Home'));
      return;
    }

    try {
      const entries = await base44.entities.InventoryEntry.filter({ id });
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        navigate(createPageUrl('Home'));
      }
    } catch (err) {
      console.error(err);
      navigate(createPageUrl('Home'));
    }
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (!entry) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-lg mx-auto px-4 md:px-6 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <Home className="w-5 h-5" style={{ color: 'var(--muted)' }} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Your Reflection</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </motion.div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 mb-6 text-center"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--soft)' }}
          >
            <Sparkles className="w-7 h-7" style={{ color: 'var(--accent)' }} />
          </div>
          <h2 className="text-xl font-semibold font-display mb-2" style={{ color: 'var(--ink)' }}>Great job reflecting!</h2>
          <p style={{ color: 'var(--muted)' }}>You're building self-awareness one day at a time</p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-6 mb-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--accent)' }}>
            Reflective Summary
          </h3>
          <div
            className="max-w-none leading-relaxed
              [&_p]:mb-2
              [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:list-none [&_ul]:pl-0
              [&_li]:flex [&_li]:items-start [&_li]:gap-2"
            style={{ color: 'var(--ink)' }}
            dangerouslySetInnerHTML={{ __html: entry.reflective_summary }}
          />
        </motion.div>

        {/* Journaling Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-6 mb-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--accent)' }}>
            Reflective Journalling Prompts
          </h3>
          <div
            className="max-w-none
              [&_ul]:space-y-3 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-0
              [&_li]:p-4 [&_li]:rounded-xl [&_li]:leading-relaxed"
            ref={(el) => {
              if (el) {
                el.querySelectorAll('li').forEach((li, index) => {
                  li.style.backgroundColor = 'var(--soft)';
                  li.style.color = 'var(--ink)';
                  if (!li.textContent.match(/^\d+\./)) {
                    const number = `${index + 1}.`;
                    const text = li.textContent;
                    li.innerHTML = `<span style="color: var(--accent); font-weight: 600;">${number}</span> ${text}`;
                  }
                });
              }
            }}
            dangerouslySetInnerHTML={{ __html: entry.journaling_prompts }}
          />
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ShareButton shareText={entry.share_text} />
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3"
        >
          <Link to={createPageUrl('Home')}>
            <button
              className="w-full min-h-[52px] rounded-2xl font-medium transition-colors"
              style={{
                border: '1px solid var(--line)',
                color: 'var(--muted)'
              }}
            >
              Return to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}