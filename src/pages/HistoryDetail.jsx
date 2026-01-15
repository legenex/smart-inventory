import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ShareButton from '@/components/summary/ShareButton';
import useTheme from '@/components/theme/useTheme';

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry Today?' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?' },
  { id: 'better', question: 'Is There Anything That You Could Have Done Better Today?' },
  { id: 'gratitude', question: 'Gratitudes' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What Emotions Did You Feel Most Strongly Today?' },
  { id: 'challenged', question: 'What Challenged You Today?' },
  { id: 'well', question: 'What Did You Do Well Today?' },
  { id: 'alignment', question: 'Did You Act Out of Alignment With Your Values? If So, Explain.' },
  { id: 'avoided', question: 'Did You Avoid Anything Important Today?' },
  { id: 'joy', question: 'Who or What Brought You Joy Today?' },
  { id: 'gratitude', question: 'Gratitudes' }
];

export default function HistoryDetail() {
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
    return null;
  }
  
  if (!entry) return null;
  
  const questions = entry.inventory_type === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
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
            <h1 className="text-lg font-semibold" style={{ color: colors.primary }}>
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
          <h3 className="text-lg font-semibold text-[#1F2C46] mb-6">Your Responses</h3>
          <div className="space-y-5">
            {questions.map((q, index) => {
              const response = entry.responses?.[q.id];
              const isGratitude = q.id === 'gratitude';
              const isText = isGratitude || q.id === 'emotions' || q.id === 'well' || q.id === 'joy' || q.id === 'challenged';
              
              // Format answer by removing duplicate Yes/yes
              let formattedDetails = response?.details || '';
              if (formattedDetails && response?.value === true) {
                // Remove "Yes, " or "yes, " from the beginning
                formattedDetails = formattedDetails.replace(/^(Yes|yes),?\s*/i, '');
              }
              
              return (
                <div key={q.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary
                      }}
                    >
                      Q{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1F2C46]">
                        {q.question}
                      </p>
                    </div>
                  </div>
                  <div className="ml-11">
                    {isGratitude ? (
                      <div>
                        {Array.isArray(response?.value) ? (
                          <ul className="space-y-1">
                            {response.value.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span style={{ color: colors.primary }}>•</span>
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">{response?.value || 'Not answered'}</p>
                        )}
                      </div>
                    ) : isText ? (
                      <p className="text-gray-600 italic">"{response?.value || 'Not answered'}"</p>
                    ) : (
                      <p className="text-gray-600">
                        <span style={{ color: colors.primary }} className="font-medium">
                          {response?.value ? 'Yes' : 'No'}
                        </span>
                        {formattedDetails && <span style={{ color: colors.primary }}>,</span>}
                        {formattedDetails && <span> {formattedDetails}</span>}
                      </p>
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
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
            Reflective Summary
          </h3>
          <div 
            className="prose prose-slate max-w-none
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
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
            Reflective Journalling Prompts
          </h3>
          <div 
            className="prose prose-slate max-w-none
              [&_ul]:space-y-4 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-0
              [&_li]:p-4 [&_li]:rounded-xl [&_li]:text-gray-700 [&_li]:leading-relaxed"
            ref={(el) => {
              if (el) {
                el.querySelectorAll('li').forEach((li, index) => {
                  li.style.background = `linear-gradient(to right, ${colors.primary}08, ${colors.secondary}08)`;
                  // Add number prefix with bold styling and theme color
                  if (!li.textContent.match(/^\d+\./)) {
                    const number = `${index + 1}.`;
                    const text = li.textContent;
                    li.innerHTML = `<span style="color: ${colors.primary}; font-weight: bold;">${number}</span> ${text}`;
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
      </div>
    </div>
  );
}