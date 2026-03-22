import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import QuestionCard from '@/components/inventory/QuestionCard';
import ProgressBar from '@/components/inventory/ProgressBar';
import useTheme from '@/components/theme/useTheme';
import NavigationMenu from '@/components/home/NavigationMenu';
import { Button } from '@/components/ui/button';

const QUESTIONS = [
  {
    id: 'gratitude',
    question: "What Are You Grateful For Today?",
    description: "List at least 5 things — big or small. Gratitude shifts your energy and opens your heart.",
    type: 'gratitude'
  },
  {
    id: 'affirmations',
    question: "Write Your Affirmations for Today",
    description: "Write positive, present-tense statements about who you are and who you're becoming. E.g. 'I am enough. I am loved. I am at peace.'",
    type: 'text'
  },
  {
    id: 'gift',
    question: "What Is One Gift or Blessing You Often Take for Granted?",
    description: "Slow down and notice something you might overlook — your health, a relationship, a simple comfort.",
    type: 'text'
  },
  {
    id: 'intention',
    question: "What Is Your Intention for Today?",
    description: "Set one clear, positive intention to carry with you. How do you want to show up today?",
    type: 'text'
  }
];

export default function GratitudeAffirmations() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reflection, setReflection] = useState('');

  const currentQ = QUESTIONS[currentQuestion];

  const handleValueChange = (value) => {
    setResponses(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], value } }));
  };

  const handleDetailsChange = (details) => {
    setResponses(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], details } }));
  };

  const handleNext = async () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await handleSave();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
  };

  const handleSave = async () => {
    setProcessing(true);
    try {
      const gratitudes = Array.isArray(responses.gratitude?.value) ? responses.gratitude.value : [];
      const affirmations = responses.affirmations?.value || '';
      const gift = responses.gift?.value || '';
      const intention = responses.intention?.value || '';

      const aiRes = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate spiritual coach. The user has completed a gratitude and affirmations practice. Write a warm, uplifting 2-3 sentence reflection that affirms their practice and encourages them.

Gratitudes: ${gratitudes.join(', ')}
Affirmations: ${affirmations}
Blessing they notice: ${gift}
Today's intention: ${intention}

Keep it brief, warm, and spiritually affirming. No lists — just flowing, encouraging prose.`,
      });

      await base44.entities.GratitudeEntry.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        responses,
        ai_reflection: aiRes
      });

      setReflection(aiRes);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4"
            style={{ borderColor: `${colors.primary}20`, borderTopColor: colors.primary }}
          />
          <h2 className="text-xl font-semibold text-[#1F2C46] mb-2">Saving your practice...</h2>
          <p className="text-gray-500">Generating your reflection</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})` }}
            >
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2C46] mb-2">Practice Complete</h2>
            <p className="text-gray-500 mb-6">Your gratitude and affirmations have been saved.</p>

            {reflection && (
              <div
                className="rounded-[20px] p-6 mb-8 text-left"
                style={{ background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.secondary}10)` }}
              >
                <p className="text-gray-700 leading-relaxed italic">"{reflection}"</p>
              </div>
            )}

            <Button
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="w-full py-4 rounded-2xl text-white text-lg font-medium"
              style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
            >
              Return to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[#1F2C46]">Gratitude & Affirmations</h1>
              <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>
          </div>
          <NavigationMenu />
        </div>

        <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />

        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQ.id}
            question={currentQ.question}
            description={currentQ.description}
            questionNumber={currentQuestion + 1}
            type={currentQ.type}
            value={responses[currentQ.id]?.value}
            details={responses[currentQ.id]?.details}
            onValueChange={handleValueChange}
            onDetailsChange={handleDetailsChange}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === QUESTIONS.length - 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}