import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ShareButton from '@/components/summary/ShareButton';

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Resentful or angry' },
  { id: 'dishonest', question: 'Dishonest' },
  { id: 'selfish', question: 'Selfish or self-centered' },
  { id: 'fearful', question: 'Fearful or anxious' },
  { id: 'harmful', question: 'Harmed anyone' },
  { id: 'secret', question: 'Kept a secret' },
  { id: 'unkind', question: 'Unkind or unloving' },
  { id: 'gratitude', question: 'Gratitude' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'Strong emotions' },
  { id: 'challenged', question: 'Challenged' },
  { id: 'well', question: 'Did well' },
  { id: 'alignment', question: 'Out of alignment' },
  { id: 'avoided', question: 'Avoided something' },
  { id: 'joy', question: 'Joy' },
  { id: 'gratitude', question: 'Gratitude' }
];

export default function HistoryDetail() {
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
      navigate(createPageUrl('History'));
      return;
    }
    
    try {
      const entries = await base44.entities.InventoryEntry.filter({ id });
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        navigate(createPageUrl('History'));
      }
    } catch (err) {
      console.error(err);
      navigate(createPageUrl('History'));
    }
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!entry) return null;
  
  const questions = entry.inventory_type === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  
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
            to={createPageUrl('History')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[#1F2C46]">
              {entry.inventory_type === 'aa' ? 'Recovery Inventory' : 'Daily Reflection'}
            </h1>
            <p className="text-sm text-gray-500">{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </motion.div>
        
        {/* Responses Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Your Responses</h3>
          <div className="space-y-3">
            {questions.map((q) => {
              const response = entry.responses?.[q.id];
              const isText = q.id === 'gratitude' || q.id === 'emotions' || q.id === 'well' || q.id === 'joy';
              
              return (
                <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  {!isText && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      response?.value 
                        ? 'bg-[#7667E5]/10 text-[#7667E5]' 
                        : 'bg-[#6BC2CE]/10 text-[#6BC2CE]'
                    }`}>
                      {response?.value ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#1F2C46] text-sm">{q.question}</p>
                    {isText ? (
                      <p className="text-gray-600 text-sm mt-1">{response?.value || 'Not answered'}</p>
                    ) : response?.details && (
                      <p className="text-gray-500 text-sm mt-1 italic">"{response.details}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
              [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-0"
            dangerouslySetInnerHTML={{ __html: entry.reflective_summary }}
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
              [&_li]:bg-gradient-to-r [&_li]:from-[#7667E5]/5 [&_li]:to-[#A48FFF]/5 
              [&_li]:p-4 [&_li]:rounded-xl [&_li]:text-gray-700 [&_li]:leading-relaxed"
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
      </div>
    </div>
  );
}