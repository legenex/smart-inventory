import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Check, X, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import useTheme from '@/components/theme/useTheme';

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry?' },
  { id: 'dishonest', question: 'Were You Dishonest?' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered?' },
  { id: 'fearful', question: 'Were You Fearful or Anxious?' },
  { id: 'harmful', question: 'Did You Harm Anyone?' },
  { id: 'secret', question: 'Did You Keep a Secret?' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All?' },
  { id: 'better', question: 'Could You Have Done Better?' },
  { id: 'gratitude', question: 'Gratitudes' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What Emotions Did You Feel Most Strongly?' },
  { id: 'challenged', question: 'What Challenged You?' },
  { id: 'well', question: 'What Did You Do Well?' },
  { id: 'alignment', question: 'Did You Act Out of Alignment With Your Values?' },
  { id: 'avoided', question: 'Did You Avoid Anything Important?' },
  { id: 'joy', question: 'Who or What Brought You Joy?' },
  { id: 'gratitude', question: 'What Are You Grateful For?' }
];

export default function ReviewInventory() {
  const { colors } = useTheme();
  const [responses, setResponses] = useState(null);
  const [inventoryType, setInventoryType] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [shareText, setShareText] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const responsesParam = urlParams.get('responses');
    const typeParam = urlParams.get('type');
    
    if (!responsesParam || !typeParam) {
      navigate(createPageUrl('Inventory'));
      return;
    }
    
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setResponses(JSON.parse(decodeURIComponent(responsesParam)));
      setInventoryType(typeParam);
    } catch (err) {
      navigate(createPageUrl('Inventory'));
    }
  };
  
  const generateShareText = () => {
    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    const today = format(new Date(), 'd MMMM yyyy');
    const zws = '\u200B';
    let text = `Nightly Inventory - ${today}\n━━━━━━━━━━━━━━━━━━━\n\n`;
    
    questions.forEach((q, i) => {
      const r = responses[q.id];
      text += `${zws}${i + 1}. ${q.question}\n`;
      
      if (q.id === 'gratitude') {
        const gratList = Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered');
        text += `${gratList}\n\n`;
      } else if (typeof r?.value === 'string') {
        text += `${r.value}\n\n`;
      } else {
        text += `${r?.value ? 'Yes' : 'No'}`;
        if (r?.details) {
          text += `, ${r.details}`;
        }
        text += '\n\n';
      }
    });
    
    text += `━━━━━━━━━━━━━━━━━━━\n\nShared via Smart-Inventory.co`;
    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleContinue = async () => {
    setProcessing(true);
    localStorage.removeItem('inventory_draft');
    
    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    
    try {
      // Generate AI summary
      const formattedResponses = questions.map(q => {
        const r = responses[q.id];
        if (q.id === 'gratitude') {
          const gratList = Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered');
          return `${q.question}\nAnswer: ${gratList}`;
        }
        if (typeof r?.value === 'string') {
          return `${q.question}\nAnswer: ${r.value}`;
        }
        return `${q.question}\nAnswer: ${r?.value ? 'Yes' : 'No'}${r?.details ? `\nDetails: ${r.details}` : ''}`;
      }).join('\n\n');
      
      const prompt = inventoryType === 'aa'
        ? `You are an AA aligned nightly inventory interpreter. Analyze the user's Step 10 inventory answers and return:

1. <h4>Reflective Summary</h4>
<p>One paragraph synthesizing the emotional and spiritual themes.</p>

2. <h4>Reflective Journalling Prompts</h4>
<ul>
<li>Five personalised prompts, compassionate, specific, and tied directly to the user's answers.</li>
</ul>

Do not mention AA explicitly unless the user's answers do. Keep tone compassionate and growth-oriented.

User's inventory:
${formattedResponses}`
        : `You are a personal growth and emotional awareness coach. Analyze the user's daily reflection answers and return:

1. <h4>Reflective Summary</h4>
<p>One paragraph summarizing the user's emotional, mental and behavioral patterns.</p>

2. <h4>Reflective Journalling Prompts</h4>
<ul>
<li>Five personalised prompts supporting clarity, emotional regulation, and personal growth.</li>
</ul>

Do not reference AA or addiction recovery in this flow.

User's reflection:
${formattedResponses}`;
      
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            reflective_summary: { type: 'string', description: 'Plain text reflective summary without HTML' },
            journaling_prompts: { type: 'string', description: 'HTML formatted journaling prompts as ul/li' }
          }
        }
      });
      
      // Create share text with zero-width space before numbers
      const today = format(new Date(), 'd MMMM yyyy');
      const zws = '\u200B'; // zero-width space
      let shareText = `Nightly Inventory - ${today}\n━━━━━━━━━━━━━━━━━━━\n\n`;
      
      questions.forEach((q, i) => {
        const r = responses[q.id];
        shareText += `${zws}${i + 1}. ${q.question}\n`;
        
        if (q.id === 'gratitude') {
          const gratList = Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered');
          shareText += `${gratList}\n\n`;
        } else if (typeof r?.value === 'string') {
          shareText += `${r.value}\n\n`;
        } else {
          shareText += `${r?.value ? 'Yes' : 'No'}`;
          if (r?.details) {
            const cleanDetails = r.details.replace(/^(yes|no)[,\s]*/i, '');
            shareText += `, ${cleanDetails}`;
          }
          shareText += '\n\n';
        }
      });
      
      shareText += `━━━━━━━━━━━━━━━━━━━\n📝 Reflective Summary:\n\n${aiResponse.reflective_summary}\n\n━━━━━━━━━━━━━━━━━━━\n\nShared via Smart-Inventory.co`;
      
      // Save entry
      const entry = await base44.entities.InventoryEntry.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        inventory_type: inventoryType,
        responses,
        reflective_summary: aiResponse.reflective_summary,
        journaling_prompts: aiResponse.journaling_prompts,
        share_text: shareText
      });
      
      navigate(createPageUrl(`Summary?id=${entry.id}`));
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };
  
  if (!responses || !inventoryType) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-4"
            style={{
              borderColor: `${colors.primary}20`,
              borderTopColor: colors.primary
            }}
            />
          <h2 className="text-xl font-semibold text-[#1F2C46] mb-2">Reflecting on your day...</h2>
          <p className="text-gray-500">Creating your personalized insights</p>
        </motion.div>
      </div>
    );
  }
  
  const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5]">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(createPageUrl('Inventory'))}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#1F2C46]">Your Nightly Inventory</h1>
            <p className="text-sm text-gray-500">Review your full reflection before continuing</p>
          </div>
        </motion.div>
        
        {/* Review Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br rounded-[30px] p-8 mb-8 border-2"
          style={{
            background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)`,
            borderColor: `${colors.primary}30`
          }}
        >
          <div className="bg-white rounded-[25px] p-6 shadow-sm">
            <div className="space-y-6">
              {questions.map((q, index) => {
                const r = responses[q.id];
                const isGratitude = q.id === 'gratitude';
                const isText = typeof r?.value === 'string' && !Array.isArray(r?.value);
                
                return (
                  <div key={q.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-[#1F2C46] text-lg mb-2">
                      {index + 1}. {q.question}
                    </h3>
                    {isGratitude ? (
                      <p className="text-gray-700">
                        {Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered')}
                      </p>
                    ) : isText ? (
                      <p className="text-gray-700">{r?.value}</p>
                    ) : (
                     <div>
                       <span className={`font-medium`} style={{ color: colors.primary }}>
                         {r?.value ? 'Yes' : 'No'}
                       </span>
                       {r?.details && (
                         <span className="text-gray-600">, {r.details.replace(/^(yes|no)[,\s]*/i, '')}</span>
                       )}
                     </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleShare}
            className="w-full py-6 rounded-2xl border-2 text-lg font-medium hover:opacity-90 transition-opacity mb-4"
            variant="outline"
            style={{
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </motion.div>
        
        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full py-6 rounded-2xl text-white text-lg font-medium hover:opacity-90 transition-opacity"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
            }}
          >
            Continue to Reflection
          </Button>
        </motion.div>
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <button
            onClick={() => {
              // Go back to inventory but keep draft
              navigate(createPageUrl('Inventory'));
            }}
            className="w-full py-6 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to Edit
          </button>
        </motion.div>
      </div>
    </div>
  );
}