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
  { id: 'gratitude', question: 'What are you grateful for today?', type: 'gratitude' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What emotions did you feel most strongly today?', type: 'text' },
  { id: 'challenged', question: 'What challenged you today?', type: 'text' },
  { id: 'well', question: 'What did you do well today?', type: 'text' },
  { id: 'alignment', question: 'Did you act out of alignment with your values? If so, explain.', type: 'yesno-text' },
  { id: 'avoided', question: 'Did you avoid anything important today?', type: 'yesno-text' },
  { id: 'joy', question: 'Who or what brought you joy today?', type: 'text' },
  { id: 'gratitude', question: 'What are you grateful for today?', type: 'gratitude' }
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
      // Go to review page
      navigate(createPageUrl(`ReviewInventory?responses=${encodeURIComponent(JSON.stringify(responses))}&type=${user.recovery_status}`));
    }
  };

  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  

  
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