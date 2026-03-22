import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Zap } from 'lucide-react';
import { format } from 'date-fns';
import QuestionCard from '@/components/inventory/QuestionCard';
import ProgressBar from '@/components/inventory/ProgressBar';
import useTheme from '@/components/theme/useTheme';
import NavigationMenu from '@/components/home/NavigationMenu';
import { Button } from '@/components/ui/button';

const SPOT_CHECK_QUESTIONS = [
  {
    id: 'resentful',
    question: 'Am I Resentful or Angry Right Now?',
    description: 'Check in honestly. Is there anyone or anything disturbing your peace right now?',
    type: 'yesno-text'
  },
  {
    id: 'fearful',
    question: 'Am I Fearful or Anxious Right Now?',
    description: 'Notice any worry, dread, or unease in your body or mind right now.',
    type: 'yesno-text'
  },
  {
    id: 'selfish',
    question: 'Am I Being Selfish or Self-Centered Right Now?',
    description: 'Am I making this about me? Am I seeking to control, manipulate, or get my way?',
    type: 'yesno-text'
  },
  {
    id: 'dishonest',
    question: 'Am I Being Dishonest in Any Way Right Now?',
    description: 'With others or with myself. Am I pretending, hiding, or avoiding something?',
    type: 'yesno-text'
  },
  {
    id: 'letting_go',
    question: 'What Do I Need to Let Go of Right Now?',
    description: 'Name it. A thought, feeling, expectation, or need for control.',
    type: 'text'
  },
  {
    id: 'action',
    question: 'What Is One Action I Can Take Right Now to Restore My Peace?',
    description: 'A prayer, a call, an amend, a walk — something small and concrete.',
    type: 'text'
  }
];

export default function SpotCheck() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reflection, setReflection] = useState('');

  const currentQ = SPOT_CHECK_QUESTIONS[currentQuestion];

  const handleValueChange = (value) => {
    setResponses(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], value } }));
  };

  const handleDetailsChange = (details) => {
    setResponses(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], details } }));
  };

  const handleNext = async () => {
    if (currentQuestion < SPOT_CHECK_QUESTIONS.length - 1) {
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
      const now = new Date();
      const summaryLines = SPOT_CHECK_QUESTIONS.map(q => {
        const r = responses[q.id];
        if (typeof r?.value === 'boolean') {
          return `${q.question}: ${r.value ? 'Yes' : 'No'}${r.details ? ` — ${r.details}` : ''}`;
        }
        return `${q.question}: ${r?.value || 'Not answered'}`;
      }).join('\n');

      const aiRes = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate spiritual sponsor. The user just did a quick spot check inventory. Give them a brief (2-3 sentence) grounding response — acknowledge what they're feeling, remind them they have the tools, and encourage them to take the action they identified.

Their spot check:
${summaryLines}

Be direct, warm, and brief. No bullet points.`,
      });

      await base44.entities.SpotCheckEntry.create({
        date: format(now, 'yyyy-MM-dd'),
        time: format(now, 'HH:mm'),
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
          <h2 className="text-xl font-semibold text-[#1F2C46] mb-2">Checking in...</h2>
          <p className="text-gray-500">Processing your spot check</p>
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
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2C46] mb-2">Spot Check Complete</h2>
            <p className="text-gray-500 mb-6">You paused, checked in, and took stock. That's the practice.</p>

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
              <h1 className="text-lg font-semibold text-[#1F2C46]">Spot Check Inventory</h1>
              <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM d · h:mm a')}</p>
            </div>
          </div>
          <NavigationMenu />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
          <p className="text-amber-800 text-sm font-medium">⚡ Quick check-in — pause and be honest with yourself right now.</p>
        </div>

        <ProgressBar current={currentQuestion + 1} total={SPOT_CHECK_QUESTIONS.length} />

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
            isLast={currentQuestion === SPOT_CHECK_QUESTIONS.length - 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}