import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareButton({ shareText }) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = async () => {
    // Add zero-width character to prevent WhatsApp formatting issues
    const formattedText = shareText.replace(/\*/g, '\u200B*');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Daily Inventory',
          text: formattedText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopy(formattedText);
        }
      }
    } else {
      fallbackCopy(formattedText);
    }
  };
  
  const fallbackCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <Button
      onClick={handleShare}
      className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#6BC2CE] to-[#7667E5] text-white font-medium hover:opacity-90 transition-opacity"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Copied to Clipboard
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Your Reflection
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}