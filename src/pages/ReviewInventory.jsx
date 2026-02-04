import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Check, X, Share2, PenLine, Menu } from 'lucide-react';
import NavigationMenu from '@/components/home/NavigationMenu';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [summary, setSummary] = useState('');
  const [prompts, setPrompts] = useState('');
  const [showBackDialog, setShowBackDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (responses && inventoryType) {
      generateAIContent();
    }
  }, [responses, inventoryType]);
  
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
    
    // Add reflective summary
    if (summary) {
      text += `━━━━━━━━━━━━━━━━━━━\n📝 Reflective Summary:\n\n${summary}\n\n`;
    }
    
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

  const generateAIContent = async () => {
    setProcessing(true);
    localStorage.removeItem('inventory_draft');
    
    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    
    try {
      // Set a timeout to handle stuck requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      );
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

1. Reflective Summary
One paragraph synthesizing the emotional and spiritual themes. IMPORTANT: If the user provided only brief "Yes" or "No" answers without elaborating, gently acknowledge this and encourage them to explore deeper in their journaling.

2. Reflective Journalling Prompts
Five personalised prompts, compassionate, specific, and tied directly to the user's answers. For answers that were brief or yes/no only, ask "why" questions to encourage deeper reflection (e.g., "What led to...", "Why do you think...", "What feelings were behind...").

Do not mention AA explicitly unless the user's answers do. Keep tone compassionate and growth-oriented.

User's inventory:
${formattedResponses}`
        : `You are a personal growth and emotional awareness coach. Analyze the user's daily reflection answers and return:

1. Reflective Summary
One paragraph summarizing the user's emotional, mental and behavioral patterns. IMPORTANT: If the user provided only brief "Yes" or "No" answers without elaborating, gently acknowledge this and encourage them to explore deeper in their journaling.

2. Reflective Journalling Prompts
Five personalised prompts supporting clarity, emotional regulation, and personal growth. For answers that were brief or yes/no only, ask "why" questions to encourage deeper reflection (e.g., "What led to...", "Why do you think...", "What feelings were behind...").

Do not reference AA or addiction recovery in this flow.

User's reflection:
${formattedResponses}`;
      
      const llmPromise = base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            reflective_summary: { type: 'string', description: 'Plain text reflective summary without HTML' },
            journaling_prompts: { type: 'string', description: 'HTML formatted journaling prompts as ul/li' }
          }
        }
      });
      
      const aiResponse = await Promise.race([llmPromise, timeoutPromise]);
      
      setSummary(aiResponse.reflective_summary);
      setPrompts(aiResponse.journaling_prompts);
      setProcessing(false);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setSummary('Unable to generate AI insights at this time. Your responses have been saved.');
      setPrompts('<ul><li>What patterns do you notice in today\'s reflection?</li><li>What would you like to explore more deeply?</li><li>What action can you take tomorrow based on today\'s insights?</li></ul>');
    }
  };

  const handleSave = async () => {
    setProcessing(true);
    
    // Use original responses - skip spell check to avoid timeouts
    const correctedResponses = { ...responses };

    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    const today = format(new Date(), 'd MMMM yyyy');
    const zws = '\u200B';
    let shareText = `Nightly Inventory - ${today}\n━━━━━━━━━━━━━━━━━━━\n\n`;
    
    questions.forEach((q, i) => {
      const r = correctedResponses[q.id];
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
    
    shareText += `━━━━━━━━━━━━━━━━━━━\n📝 Reflective Summary:\n\n${summary}\n\n━━━━━━━━━━━━━━━━━━━\n\nShared via Smart-Inventory.co`;
    
    try {
      const entry = await base44.entities.InventoryEntry.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        inventory_type: inventoryType,
        responses: correctedResponses,
        reflective_summary: summary,
        journaling_prompts: prompts,
        share_text: shareText
      });
      
      setProcessing(false);
      navigate(createPageUrl('Dashboard'));
    } catch (err) {
      console.error(err);
      setProcessing(false);
      alert('Failed to save inventory. Please try again.');
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
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
          </div>
          <NavigationMenu />
        </motion.div>
        
        {/* Review Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h3 className="text-lg font-semibold text-[#1F2C46] mb-6">Your Responses</h3>
          <div className="space-y-5">
            {questions.map((q, index) => {
              const r = responses[q.id];
              const isGratitude = q.id === 'gratitude';
              const isText = typeof r?.value === 'string' && !Array.isArray(r?.value);
              
              return (
                <div key={q.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold text-[#1F2C46] text-base mb-2">
                    {index + 1}. {q.question}
                  </h3>
                  {isGratitude ? (
                    <p className="text-gray-600">
                      {Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered')}
                    </p>
                  ) : isText ? (
                    <p className="text-gray-600 italic">"{r?.value}"</p>
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
        </motion.div>

        {/* Reflective Summary */}
        {!processing && summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
              Reflective Summary
            </h3>
            <p className="text-gray-600 leading-relaxed">{summary}</p>
          </motion.div>
        )}

        {/* Journaling Prompts */}
        {!processing && prompts && (
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
                    li.style.background = `linear-gradient(to right, ${colors.primary}18, ${colors.secondary}18)`;
                    if (!li.textContent.match(/^\d+\./)) {
                      const number = `${index + 1}.`;
                      const text = li.textContent;
                      li.innerHTML = `<span style="color: ${colors.primary}; font-weight: bold;">${number}</span> ${text}`;
                    }
                  });
                }
              }}
              dangerouslySetInnerHTML={{ __html: prompts }}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        {!processing && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  const promptsList = prompts.split('</li>').filter(p => p.includes('<li>')).map(p => 
                    p.replace(/<\/?[^>]+(>|$)/g, '').trim()
                  );
                  const urlParams = new URLSearchParams(window.location.search);
                  const invId = urlParams.get('inventoryId') || 'temp_' + Date.now();
                  navigate(createPageUrl(`Journaling?prompts=${encodeURIComponent(JSON.stringify(promptsList))}&inventoryId=${invId}`));
                }}
                className="w-full py-6 rounded-2xl text-lg font-medium mb-4"
                style={{
                  background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`
                }}
              >
                <PenLine className="w-5 h-5 mr-2" />
                Start Journaling
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
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
          </>
        )}
        
        {/* Save and Exit Button */}
        {!processing && summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleSave}
              disabled={processing}
              className="w-full py-6 rounded-2xl text-white text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
              }}
            >
              {processing ? 'Saving...' : 'Return To Dashboard'}
            </Button>
          </motion.div>
        )}
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <button
            onClick={() => setShowBackDialog(true)}
            className="w-full py-6 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to Edit
          </button>
        </motion.div>

        {/* Back Confirmation Dialog */}
        <AlertDialog open={showBackDialog} onOpenChange={setShowBackDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save as draft?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to save your progress to continue later, or discard and start fresh?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                localStorage.removeItem('inventory_draft');
                navigate(createPageUrl('Inventory'));
              }}>
                Discard
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate(createPageUrl('Inventory'))}>
                Save Draft
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}