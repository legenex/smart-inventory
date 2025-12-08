import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import ProgressBar from '@/components/inventory/ProgressBar';
import QuestionCard from '@/components/inventory/QuestionCard';

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Were you resentful or angry today?', type: 'yesno-text' },
  { id: 'dishonest', question: 'Were you dishonest in any way today?', type: 'yesno-text' },
  { id: 'selfish', question: 'Were you selfish or self-centered today?', type: 'yesno-text' },
  { id: 'fearful', question: 'Were you fearful or anxious today?', type: 'yesno-text' },
  { id: 'harmful', question: 'Did you harm anyone today? Do you owe an apology?', type: 'yesno-text' },
  { id: 'secret', question: 'Did you keep a secret or withhold the truth from someone?', type: 'yesno-text' },
  { id: 'unkind', question: 'Were you unkind or unloving? Could you have done better?', type: 'yesno-text' },
  { id: 'gratitude', question: 'What are you grateful for today?', type: 'text' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What emotions did you feel most strongly today?', type: 'text' },
  { id: 'challenged', question: 'What challenged you today?', type: 'yesno-text' },
  { id: 'well', question: 'What did you do well today?', type: 'text' },
  { id: 'alignment', question: 'Did you act out of alignment with your values? If so, explain.', type: 'yesno-text' },
  { id: 'avoided', question: 'Did you avoid anything important today?', type: 'yesno-text' },
  { id: 'joy', question: 'Who or what brought you joy today?', type: 'text' },
  { id: 'gratitude', question: 'What are 3 things you\'re grateful for today?', type: 'text' }
];

export default function Inventory() {
  const [user, setUser] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
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
  
  // Check for today's entry
  const { data: entries = [] } = useQuery({
    queryKey: ['inventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 1),
    enabled: !!user
  });
  
  useEffect(() => {
    if (entries.length > 0 && isToday(parseISO(entries[0].date))) {
      navigate(createPageUrl(`HistoryDetail?id=${entries[0].id}`));
    }
  }, [entries]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  const questions = user.recovery_status === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  const currentQ = questions[currentQuestion];
  
  const handleValueChange = (value) => {
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        value
      }
    }));
  };
  
  const handleDetailsChange = (details) => {
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        details
      }
    }));
  };
  
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Submit inventory
      setProcessing(true);
      
      try {
        // Generate AI summary
        const inventoryType = user.recovery_status;
        const formattedResponses = questions.map(q => {
          const r = responses[q.id];
          if (q.type === 'text') {
            return `${q.question}\nAnswer: ${r?.value || 'Not answered'}`;
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
              reflective_summary: { type: 'string', description: 'HTML formatted reflective summary' },
              journaling_prompts: { type: 'string', description: 'HTML formatted journaling prompts as ul/li' }
            }
          }
        });
        
        // Create share text
        const today = format(new Date(), 'EEEE, d MMMM yyyy');
        let shareText = `Nightly Inventory – ${today}\n━━━━━━━━━━━━━━\n`;
        
        questions.forEach((q, i) => {
          const r = responses[q.id];
          if (q.type === 'text') {
            shareText += `${i + 1}. ${q.question.split('?')[0]}:\n${r?.value || 'Not answered'}\n\n`;
          } else {
            shareText += `${i + 1}. ${q.question.split('?')[0]}: ${r?.value ? 'Yes' : 'No'}\n`;
            if (r?.details) shareText += `   → ${r.details}\n`;
            shareText += '\n';
          }
        });
        
        shareText += `━━━━━━━━━━━━━━\nShared via Smart-Inventory`;
        
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
    }
  };
  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
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
            className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-[#7667E5]/20 border-t-[#7667E5]"
          />
          <h2 className="text-xl font-semibold text-[#1F2C46] mb-2">Reflecting on your day...</h2>
          <p className="text-gray-500">Creating your personalized insights</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5]">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[#1F2C46]">
              {user.recovery_status === 'aa' ? 'Nightly Inventory' : 'Daily Reflection'}
            </h1>
            <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>
        
        <ProgressBar current={currentQuestion + 1} total={questions.length} />
        
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQ.id}
            question={currentQ.question}
            questionNumber={currentQuestion + 1}
            type={currentQ.type}
            value={responses[currentQ.id]?.value}
            details={responses[currentQ.id]?.details}
            onValueChange={handleValueChange}
            onDetailsChange={handleDetailsChange}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === questions.length - 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}