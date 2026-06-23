import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Menu } from 'lucide-react';
import NavigationMenu from '@/components/home/NavigationMenu';
import DateSelector from '@/components/inventory/DateSelector';
import { format, isToday, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import ProgressBar from '@/components/inventory/ProgressBar';
import QuestionCard from '@/components/inventory/QuestionCard';
import { getCopy } from '@/lib/mode';
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
  { id: 'resentful', question: 'Were You Resentful or Angry Today?', description: 'Notice any people, situations, or thoughts you replayed that disturbed your peace or kept you emotionally stuck.', type: 'yesno-text' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?', description: 'Look at what you said, what you avoided saying, and any way you presented yourself that was not fully truthful.', type: 'yesno-text' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?', description: 'Reflect on where you put your comfort, control, image, or agenda ahead of honesty, fairness, or connection.', type: 'yesno-text' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?', description: 'Reflect on where fear or anxiety showed up today and how it influenced your thoughts, emotions, or actions.', type: 'yesno-text' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?', description: 'Consider whether your words, actions, or omissions caused harm, discomfort, or confusion for someone else.', type: 'yesno-text' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?', description: 'Keeping secrets builds shame and isolation. Reflect on any secrets, shame, rationalizations, or justifications from the day.', type: 'yesno-text' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?', description: 'Observe moments where you were impatient, irritable, dismissive, cold, or emotionally unavailable.', type: 'yesno-text-no' },
  { id: 'do_well', question: 'What Did You Do Well Today?', description: 'Reflect on what you handled properly today, especially where you would normally have acted from fear, ego, or old patterns.', type: 'text' },
  { id: 'better', question: 'What Could You Have Done Better Today?', description: 'Reflect on whether you could have handled something better today, to find room for growth or a better choice.', type: 'text' },
  { id: 'gratitude', question: 'Gratitude List', description: 'List the things, people, experiences, or moments you are grateful for today.', type: 'gratitude' }
];

const GENERAL_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry Today?', description: 'Notice any people, situations, or thoughts you replayed that disturbed your peace or kept you emotionally stuck.', type: 'yesno-text' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?', description: 'Look at what you said, what you avoided saying, and any way you presented yourself that was not fully truthful.', type: 'yesno-text' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?', description: 'Reflect on where you put your comfort, control, image, or agenda ahead of honesty, fairness, or connection.', type: 'yesno-text' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?', description: 'Reflect on where fear or anxiety showed up today and how it influenced your thoughts, emotions, or actions.', type: 'yesno-text' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?', description: 'Consider whether your words, actions, or omissions caused harm, discomfort, or confusion for someone else.', type: 'yesno-text' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?', description: 'Keeping secrets builds shame and isolation. Reflect on any secrets, shame, rationalizations, or justifications from the day.', type: 'yesno-text' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?', description: 'Observe moments where you were impatient, irritable, dismissive, cold, or emotionally unavailable.', type: 'yesno-text-no' },
  { id: 'do_well', question: 'What Did You Do Well Today?', description: 'Reflect on what you handled properly today, especially where you would normally have acted from fear, ego, or old patterns.', type: 'text' },
  { id: 'better', question: 'What Could You Have Done Better Today?', description: 'Reflect on whether you could have handled something better today, to find room for growth or a better choice.', type: 'text' },
  { id: 'gratitude', question: 'Gratitude List', description: 'List the things, people, experiences, or moments you are grateful for today.', type: 'gratitude' }
];

export default function Inventory() {
  const [user, setUser] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [processing, setProcessing] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [inventoryDate, setInventoryDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      setInventoryDate(new Date(dateParam));
    }

    const draft = localStorage.getItem('inventory_draft');
    if (draft) {
      try {
        const { responses: draftResponses, question, date } = JSON.parse(draft);
        setResponses(draftResponses);
        setCurrentQuestion(question);
        if (date) setInventoryDate(new Date(date));
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

  const { data: entries = [] } = useQuery({
    queryKey: ['inventoryEntries', format(inventoryDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const allEntries = await base44.entities.InventoryEntry.list('-date', 50);
      return allEntries.filter(e => e.date === format(inventoryDate, 'yyyy-MM-dd'));
    },
    enabled: !!user
  });

  useEffect(() => {
    if (entries.length > 0) {
      navigate(createPageUrl(`HistoryDetail?id=${entries[0].id}`));
    }
  }, [entries]);

  const { data: questionSettings } = useQuery({
    queryKey: ['questionSettings', user?.recovery_status],
    queryFn: async () => {
      const settings = await base44.entities.UserQuestionSettings.filter({
        inventory_type: user?.recovery_status,
        created_by: user?.email
      });
      return settings[0] || null;
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  const copy = getCopy(user.recovery_status);
  const allQuestions = user.recovery_status === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  const defaultQuestions = allQuestions.filter(q => !q.optional);

  let questions = defaultQuestions;

  if (questionSettings?.customization_enabled &&
      questionSettings?.question_order &&
      questionSettings?.enabled_questions) {
    const orderedQuestions = questionSettings.question_order
      .map(id => allQuestions.find(q => q.id === id))
      .filter(q => q && questionSettings.enabled_questions.includes(q.id));

    if (questionSettings.custom_questions?.length > 0) {
      orderedQuestions.push(...questionSettings.custom_questions);
    }

    if (orderedQuestions.length > 0) {
      questions = orderedQuestions;
    }
  }

  const currentQ = questions[currentQuestion] || questions[0];

  const handleValueChange = (value) => {
    if (!currentQ) return;
    const newResponses = {
      ...responses,
      [currentQ.id]: {
        ...responses[currentQ.id],
        value
      }
    };
    setResponses(newResponses);
    localStorage.setItem('inventory_draft', JSON.stringify({
      responses: newResponses,
      question: currentQuestion,
      date: inventoryDate.toISOString()
    }));
  };

  const handleDetailsChange = (details) => {
    if (!currentQ) return;
    const newResponses = {
      ...responses,
      [currentQ.id]: {
        ...responses[currentQ.id],
        details
      }
    };
    setResponses(newResponses);
    localStorage.setItem('inventory_draft', JSON.stringify({
      responses: newResponses,
      question: currentQuestion,
      date: inventoryDate.toISOString()
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      localStorage.setItem('inventory_draft', JSON.stringify({
        responses,
        question: nextQuestion,
        date: inventoryDate.toISOString()
      }));
    } else {
      localStorage.removeItem('inventory_draft');
      navigate(createPageUrl(`ReviewInventory?responses=${encodeURIComponent(JSON.stringify(responses))}&type=${user.recovery_status}&date=${format(inventoryDate, 'yyyy-MM-dd')}`));
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      localStorage.setItem('inventory_draft', JSON.stringify({
        responses,
        question: prevQuestion,
        date: inventoryDate.toISOString()
      }));
    }
  };

  const handleExit = () => {
    if (Object.keys(responses).length > 0) {
      setShowExitDialog(true);
    } else {
      navigate(createPageUrl('Dashboard'));
    }
  };

  const confirmExit = () => {
    navigate(createPageUrl('Home'));
  };

  const discardAndExit = () => {
    localStorage.removeItem('inventory_draft');
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            </button>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                {copy.inventoryTitle}
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(inventoryDate, 'EEEE, MMMM d')}</p>
            </div>
          </div>
          <NavigationMenu />
        </div>

        <DateSelector
          selectedDate={inventoryDate}
          onDateChange={(newDate) => {
            setInventoryDate(newDate);
            setResponses({});
            setCurrentQuestion(0);
            localStorage.removeItem('inventory_draft');
          }}
        />

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        {currentQ ? (
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
        ) : (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
            <p style={{ color: 'var(--muted)' }}>Loading questions...</p>
          </div>
        )}

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