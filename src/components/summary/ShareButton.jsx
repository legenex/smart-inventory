import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShareButton({ shareText }) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Nightly Inventory',
          text: shareText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    } else {
      alert('Sharing is not supported on this device.');
    }
  };

  return (
    <motion.button
      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
      onClick={handleShare}
      className="w-full min-h-[52px] rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
      style={{
        backgroundColor: 'var(--accent)',
        color: 'var(--accentInk)'
      }}
    >
      <Share2 className="w-5 h-5" />
      Share Your Inventory
    </motion.button>
  );
}