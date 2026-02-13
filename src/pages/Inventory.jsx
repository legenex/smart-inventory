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
  { id: 'do_well', question: 'What Did You Do Well Today?', description: 'Reflect on what you handled properly today, especially in situations where you normally would have acted from fear, ego, or old patterns.', type: 'yesno-text' },
  { id: 'better', question: 'Is There Anything That You Could Have Done Better Today?', description: 'Reflect on whether you could have handled something better today to see if there was room for growth or a better choice.', type: 'yesno-text' },
  { id: 'gratitude', question: 'Gratitudes', type: 'gratitude' },
  { id: 'avoidance', question: 'Did You Avoid Anything You Needed to Face Today?', description: 'Look at where you procrastinated, avoided conflict, avoided honesty, avoided vulnerability, or stayed in comfort instead of growth.', type: 'yesno-text', optional: true },
  { id: 'authentic', question: 'Were You Authentic Today?', description: 'Reflect on whether you showed up as your real self, or whether you performed, people-pleased, manipulated, hid your feelings, or tried to control how others saw you.', type: 'yesno-text', optional: true },
  { id: 'boundaries', question: 'Did You Respect Your Boundaries and Other People\'s Boundaries Today?', description: 'Reflect on whether you said yes when you meant no, overgave, overcontrolled, crossed boundaries, or allowed resentment to build by not being honest.', type: 'yesno-text', optional: true },
  { id: 'present', question: 'Were You Present Today?', description: 'Reflect on whether you lived in the moment or escaped into distractions, fantasy, overthinking, social media, validation seeking, or future-tripping.', type: 'yesno-text', optional: true },
  { id: 'surrender', question: 'What Did You Need to Let Go of Today?', description: 'Step 10 requires surrender. Reflect on what you tried to control, obsess over, or cling to, and what you may need to release to stay spiritually free.', type: 'yesno-text', optional: true },
  { id: 'prayer', question: 'Did You Take Time for Prayer or Meditation Today?', description: 'Step 10 encourages continued spiritual practice. Reflect on whether you connected to a Higher Power, practiced mindfulness, or grounded yourself spiritually.', type: 'yesno-text', optional: true },
  { id: 'triggers', question: 'What Triggered You Today?', description: 'Reflect on situations or people that activated you emotionally. Look for patterns where you reacted from old wounds, insecurities, or ego.', type: 'yesno-text', optional: true },
  { id: 'lesson', question: 'What Was the Biggest Lesson You Learned Today?', description: 'Step 10 is about growth through awareness. Reflect on what today taught you about yourself, your recovery, your relationships, or your character defects.', type: 'yesno-text', optional: true },
  { id: 'tomorrow', question: 'What Intention Do You Want to Set for Tomorrow?', description: 'Choose one simple intention to carry forward into tomorrow. This creates momentum and keeps you focused on progress instead of perfection.', type: 'yesno-text', optional: true },
  { id: 'service', question: 'Were You of Service Today?', description: 'Step 10 is strengthened through service. Reflect on whether you helped someone, supported someone emotionally, showed kindness, or contributed to someone else\'s well-being without expecting anything in return.', type: 'yesno-text', optional: true }
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
  const [inventoryDate, setInventoryDate] = useState(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
    // Check for date parameter
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      setInventoryDate(new Date(dateParam));
    }
    
    // Load draft if exists
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
  
  // Check for entry on selected date
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
  
  // Fetch user question settings
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
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Filter and order questions based on settings
  const allQuestions = user.recovery_status === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
  
  // Always use default non-optional questions as the base
  const defaultQuestions = allQuestions.filter(q => !q.optional);
  
  const questions = React.useMemo(() => {
    // If customization is disabled or no settings, return defaults
    if (!questionSettings || !questionSettings.customization_enabled) {
      return defaultQuestions;
    }
    
    // If settings incomplete, return defaults
    if (!questionSettings.question_order || !questionSettings.enabled_questions) {
      return defaultQuestions;
    }
    
    // Use user's custom settings
    const orderedQuestions = questionSettings.question_order
      .map(id => allQuestions.find(q => q.id === id))
      .filter(q => q && questionSettings.enabled_questions.includes(q.id));
    
    // Add custom questions
    if (questionSettings.custom_questions && questionSettings.custom_questions.length > 0) {
      orderedQuestions.push(...questionSettings.custom_questions);
    }
    
    // Always fall back to defaults if nothing is configured
    return orderedQuestions.length > 0 ? orderedQuestions : defaultQuestions;
  }, [questionSettings]);
  
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
    // Save draft
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
    // Save draft
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
      // Update draft with new question
      localStorage.setItem('inventory_draft', JSON.stringify({
        responses,
        question: nextQuestion,
        date: inventoryDate.toISOString()
      }));
    } else {
      // Clear draft and go to review page
      localStorage.removeItem('inventory_draft');
      navigate(createPageUrl(`ReviewInventory?responses=${encodeURIComponent(JSON.stringify(responses))}&type=${user.recovery_status}&date=${format(inventoryDate, 'yyyy-MM-dd')}`));
    }
  };

  
  const handleBack = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      // Update draft with new question
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
              <p className="text-sm text-gray-500">{format(inventoryDate, 'EEEE, MMMM d')}</p>
            </div>
          </div>
          <NavigationMenu />
        </div>

        <DateSelector 
          selectedDate={inventoryDate} 
          onDateChange={(newDate) => {
            setInventoryDate(newDate);
            // Clear responses when changing date
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
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600">Loading questions...</p>
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