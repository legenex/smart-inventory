import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/summary/ShareButton';
import useTheme from '@/components/theme/useTheme';

export default function Summary() {
  const { colors } = useTheme();
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
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5]">
      <div className="max-w-lg mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[#1F2C46]">Your Reflection</h1>
            <p className="text-sm text-gray-500">{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </motion.div>
        
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-[25px] p-6 mb-6 text-white text-center"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
          }}
        >
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Great job reflecting!</h2>
          <p className="text-white/80">You're building self-awareness one day at a time</p>
        </motion.div>
        
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div 
            className="prose prose-slate max-w-none
              [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#1F2C46] [&_h4]:mb-3 [&_h4]:mt-0
              [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-0
              [&_ul]:mt-4 [&_ul]:space-y-3 [&_ul]:list-none [&_ul]:pl-0
              [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-gray-600
              [&_li]:before:content-['→'] [&_li]:before:font-bold"
            dangerouslySetInnerHTML={{ __html: entry.reflective_summary }}
            style={{
              '--arrow-color': colors.primary
            }}
            onLoad={(e) => {
              const arrows = e.currentTarget.querySelectorAll('li::before');
              arrows.forEach(arrow => {
                arrow.style.color = colors.primary;
              });
            }}
          />
        </motion.div>
        
        {/* Journaling Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div 
            className="prose prose-slate max-w-none
              [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#1F2C46] [&_h4]:mb-4 [&_h4]:mt-0
              [&_ul]:space-y-4 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-0
              [&_li]:p-4 [&_li]:rounded-xl [&_li]:text-gray-700 [&_li]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: entry.journaling_prompts }}
            style={{
              '--prompt-gradient-from': `${colors.primary}08`,
              '--prompt-gradient-to': `${colors.secondary}08`
            }}
            ref={(el) => {
              if (el) {
                el.querySelectorAll('li').forEach(li => {
                  li.style.background = `linear-gradient(to right, ${colors.primary}08, ${colors.secondary}08)`;
                });
              }
            }}
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
          className="mt-4"
        >
          <Link to={createPageUrl('Home')}>
            <Button
              variant="outline"
              className="w-full py-6 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}