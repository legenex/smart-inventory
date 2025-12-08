import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export default function ShareButton({ shareText }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Nightly Inventory',
          text: shareText
        });
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      alert('Sharing is not supported on this device. Please copy the text manually.');
    }
  };
  
  return (
    <Button
      onClick={handleShare}
      className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#6BC2CE] to-[#7667E5] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
    >
      <Share2 className="w-5 h-5" />
      Share Your Reflection
    </Button>
  );
}