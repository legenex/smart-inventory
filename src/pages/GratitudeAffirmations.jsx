import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart } from 'lucide-react';
import { format } from 'date-fns';
import QuestionCard from '@/components/inventory/QuestionCard';
import ProgressBar from '@/components/inventory/ProgressBar';
import NavigationMenu from '@/components/home/NavigationMenu';

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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--bg)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4"
            style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }}
          />
          <h2 className="text-xl font-semibold font-display mb-2" style={{ color: 'var(--ink)' }}>Saving your practice...</h2>
          <p style={{ color: 'var(--muted)' }}>Generating your reflection</p>
        </motion.div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-lg mx-auto px-4 md:px-6 py-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--soft)' }}>
              <Heart className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--ink)' }}>Practice Complete</h2>
            <p className="mb-6" style={{ color: 'var(--muted)' }}>Your gratitude and affirmations have been saved.</p>

            {reflection && (
              <div className="rounded-3xl p-6 mb-8 text-left"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <p className="leading-relaxed italic" style={{ color: 'var(--ink)' }}>"{reflection}"</p>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="w-full min-h-[52px] rounded-2xl font-semibold"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(createPageUrl('Dashboard'))}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            </button>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Gratitude & Affirmations</h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(new Date(), 'EEEE, MMMM d')}</p>
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