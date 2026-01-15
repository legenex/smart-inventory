import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import ProgressBar from '@/components/inventory/ProgressBar';
import QuestionCard from '@/components/inventory/QuestionCard';
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

const AA_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry Today?', description: 'Notice any people, situations, or thoughts you replayed in your mind that disturbed your peace or kept you emotionally stuck.', type: 'yesno-text' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?', description: 'Look at what you said, what you avoided saying, and how you may have presented yourself in a way that was not fully truthful.', type: 'yesno-text' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?', description: 'Reflect on where you put your comfort, control, image, or personal agenda ahead of honesty, fairness, or connection.', type: 'yesno-text' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?', description: 'Reflect on where fear or anxiety showed up today, particularly around rejection, abandonment, failure, loss of control, security, or not being enough, and how those fears influenced your thoughts, emotions, or actions.', type: 'yesno-text' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?', description: 'Consider whether your words, actions, or omissions caused harm, discomfort, or confusion for someone else.', type: 'yesno-text' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?', description: 'Since keeping secrets builds shame and isolation, reflect on any secrets, shame, rationalizations, or justifications that you had throughout the day.', type: 'yesno-text' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?', description: 'Observe moments where you were impatient, irritable, dismissive, cold, selfish or emotionally unavailable.', type: 'yesno-text-no' },
  { id: 'better', question: 'Is There Anything That You Could Have Done Better Today?', description: 'Reflect on whether you could have handled something better today to see if there was room for growth or a better choice.', type: 'yesno-text' },
  { id: 'gratitude', question: 'Gratitudes', type: 'gratitude' }
];

const GENERAL_QUESTIONS = [
  { id: 'emotions', question: 'What Emotions Did You Feel Most Strongly Today?', type: 'text' },
  { id: 'challenged', question: 'What Challenged You Today?', type: 'text' },
  { id: 'well', question: 'What Did You Do Well Today?', type: 'text' },
  { id: 'alignment', question: 'Did You Act Out of Alignment With Your Values? If So, Explain.', type: 'yesno-text' },
  { id: 'avoided', question: 'Did You Avoid Anything Important Today?', type: 'yesno-text' },
  { id: 'joy', question: 'Who or What Brought You Joy Today?', type: 'text' },
  { id: 'gratitude', question: 'What Are You Grateful for Today?', type: 'gratitude' }
];

export default function Inventory() {
  const [user, setUser] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [processing, setProcessing] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
    // Load draft if exists
    const draft = localStorage.getItem('inventory_draft');
    if (draft) {
      try {
        const { responses: draftResponses, question } = JSON.parse(draft);
        setResponses(draftResponses);
        setCurrentQuestion(question);
      } catch (err) {
        console.error('Failed to load draft', err);
      }
    }
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
    return null;
  }
  
  const questions = user.recovery_status === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  const currentQ = questions[currentQuestion];
  
  const handleValueChange = (value) => {
    const newResponses = {
      ...responses,
      [currentQ.id]: {
        ...responses[currentQ.id],
        value
      }
    };
    setResponses(newResponses);
    // Save draft
    localStorage.setItem('inventory_draft', JSON.stringify({
      responses: newResponses,
      question: currentQuestion
    }));
  };
  
  const handleDetailsChange = (details) => {
    const newResponses = {
      ...responses,
      [currentQ.id]: {
        ...responses[currentQ.id],
        details
      }
    };
    setResponses(newResponses);
    // Save draft
    localStorage.setItem('inventory_draft', JSON.stringify({
      responses: newResponses,
      question: currentQuestion
    }));
  };
  
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      // Update draft with new question
      localStorage.setItem('inventory_draft', JSON.stringify({
        responses,
        question: nextQuestion
      }));
    } else {
      // Clear draft and go to review page
      localStorage.removeItem('inventory_draft');
      navigate(createPageUrl(`ReviewInventory?responses=${encodeURIComponent(JSON.stringify(responses))}&type=${user.recovery_status}`));
    }
  };

  
  const handleBack = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      // Update draft with new question
      localStorage.setItem('inventory_draft', JSON.stringify({
        responses,
        question: prevQuestion
      }));
    }
  };

  const handleExit = () => {
    if (Object.keys(responses).length > 0) {
      setShowExitDialog(true);
    } else {
      navigate(createPageUrl('Home'));
    }
  };

  const confirmExit = () => {
    // Keep draft saved
    navigate(createPageUrl('Home'));
  };

  const discardAndExit = () => {
    localStorage.removeItem('inventory_draft');
    navigate(createPageUrl('Home'));
  };
  

  
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleExit}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
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
            isLast={currentQuestion === questions.length - 1}
          />
        </AnimatePresence>

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save your progress?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved responses. Would you like to save them as a draft to continue later?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={discardAndExit}>Discard</AlertDialogCancel>
              <AlertDialogAction onClick={confirmExit}>Save Draft</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}