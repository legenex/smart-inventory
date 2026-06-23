import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Share2, PenLine } from 'lucide-react';
import NavigationMenu from '@/components/home/NavigationMenu';
import { format } from 'date-fns';
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
  { id: 'resentful', question: 'Were You Resentful or Angry Today?' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?' },
  { id: 'do_well', question: 'What Did You Do Well Today?' },
  { id: 'better', question: 'What Could You Have Done Better Today?' },
  { id: 'gratitude', question: 'Gratitude List' }
];

const GENERAL_QUESTIONS = [
  { id: 'resentful', question: 'Were You Resentful or Angry Today?' },
  { id: 'dishonest', question: 'Were You Dishonest in Any Way Today?' },
  { id: 'selfish', question: 'Were You Selfish or Self-Centered Today?' },
  { id: 'fearful', question: 'Were You Fearful or Anxious Today?' },
  { id: 'harmful', question: 'Did You Harm Anyone Today? Do You Owe an Apology?' },
  { id: 'secret', question: 'Did You Keep a Secret or Withhold the Truth from Someone?' },
  { id: 'unkind', question: 'Were You Kind And Loving Toward All Today?' },
  { id: 'do_well', question: 'What Did You Do Well Today?' },
  { id: 'better', question: 'What Could You Have Done Better Today?' },
  { id: 'gratitude', question: 'Gratitude List' }
];

export default function ReviewInventory() {
  const [responses, setResponses] = useState(null);
  const [inventoryType, setInventoryType] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState('');
  const [prompts, setPrompts] = useState('');
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [inventoryDate, setInventoryDate] = useState(new Date());
  const [savedEntryId, setSavedEntryId] = useState(null);
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
    const dateParam = urlParams.get('date');

    if (!responsesParam || !typeParam) {
      navigate(createPageUrl('Inventory'));
      return;
    }

    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setResponses(JSON.parse(decodeURIComponent(responsesParam)));
      setInventoryType(typeParam);
      if (dateParam) {
        setInventoryDate(new Date(dateParam));
      }
    } catch (err) {
      navigate(createPageUrl('Inventory'));
    }
  };

  const generateShareText = () => {
    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    const dateFormatted = format(inventoryDate, 'd MMMM yyyy');
    const zws = '\u200B';
    let text = `${getCopy(inventoryType).inventoryTitle} - ${dateFormatted}\n━━━━━━━━━━━\n\n`;

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

    if (summary) {
      text += `━━━━━━━━━━━\n📝 Reflective Summary:\n\n${summary}\n\n`;
    }

    text += `━━━━━━━━━━━\n\nShared via Smart-Inventory.co`;
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
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const generateAIContent = async () => {
    setProcessing(true);
    localStorage.removeItem('inventory_draft');

    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;

    try {
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

      const reflectiveSummary = aiResponse.reflective_summary;
      const journalingPrompts = aiResponse.journaling_prompts;

      setSummary(reflectiveSummary);
      setPrompts(journalingPrompts);

      await autoSave(reflectiveSummary, journalingPrompts);

      setProcessing(false);
    } catch (err) {
      console.error(err);
      const fallbackSummary = 'Unable to generate AI insights at this time. Your responses have been saved.';
      const fallbackPrompts = '<ul><li>What patterns do you notice in today\'s reflection?</li><li>What would you like to explore more deeply?</li><li>What action can you take tomorrow based on today\'s insights?</li></ul>';
      setSummary(fallbackSummary);
      setPrompts(fallbackPrompts);
      await autoSave(fallbackSummary, fallbackPrompts);
      setProcessing(false);
    }
  };

  const autoSave = async (reflectiveSummary, journalingPrompts) => {
    const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;
    const dateFormatted = format(inventoryDate, 'd MMMM yyyy');
    const zws = '\u200B';
    let shareText = `${getCopy(inventoryType).inventoryTitle} - ${dateFormatted}\n━━━━━━━━━━━\n\n`;

    questions.forEach((q, i) => {
      const r = responses[q.id];
      shareText += `${zws}${i + 1}. ${q.question}\n`;
      if (q.id === 'gratitude') {
        shareText += `${Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered')}\n\n`;
      } else if (typeof r?.value === 'string') {
        shareText += `${r.value}\n\n`;
      } else {
        shareText += `${r?.value ? 'Yes' : 'No'}`;
        if (r?.details) shareText += `, ${r.details.replace(/^(yes|no)[,\s]*/i, '')}`;
        shareText += '\n\n';
      }
    });
    shareText += `━━━━━━━━━━━\n📝 Reflective Summary:\n\n${reflectiveSummary}\n\n━━━━━━━━━━━\n\nShared via Smart-Inventory.co`;

    try {
      const entry = await base44.entities.InventoryEntry.create({
        date: format(inventoryDate, 'yyyy-MM-dd'),
        inventory_type: inventoryType,
        responses,
        reflective_summary: reflectiveSummary,
        journaling_prompts: journalingPrompts,
        share_text: shareText
      });
      setSavedEntryId(entry.id);
      localStorage.removeItem('inventory_draft');
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  };

  const handleSave = () => {
    navigate(createPageUrl('Dashboard'));
  };

  if (!responses || !inventoryType) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4"
            style={{
              borderColor: 'var(--line)',
              borderTopColor: 'var(--accent)'
            }}
          />
          <h2 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--ink)' }}>
            Reflecting on your day...
          </h2>
          <p style={{ color: 'var(--muted)' }}>Creating your personalized insights</p>
        </motion.div>
      </div>
    );
  }

  const questions = inventoryType === 'aa' ? AA_QUESTIONS : GENERAL_QUESTIONS;

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(createPageUrl('Inventory'))}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            </button>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>{getCopy(inventoryType).inventoryTitle}</h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(inventoryDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          <NavigationMenu />
        </motion.div>

        {/* Review Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 mb-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--ink)' }}>Your Responses</h3>
          <div className="space-y-0">
            {questions.map((q, index) => {
              const r = responses[q.id];
              const isGratitude = q.id === 'gratitude';
              const isText = typeof r?.value === 'string' && !Array.isArray(r?.value);

              return (
                <div
                  key={q.id}
                  className="py-4"
                  style={{ borderBottom: index < questions.length - 1 ? '1px solid var(--line)' : 'none' }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
                    {index + 1}. {q.question}
                  </p>
                  {isGratitude ? (
                    <p className="font-medium" style={{ color: 'var(--ink)' }}>
                      {Array.isArray(r?.value) ? r.value.join(', ') : (r?.value || 'Not answered')}
                    </p>
                  ) : isText ? (
                    <p className="font-medium italic" style={{ color: 'var(--ink)' }}>
                      "{r?.value}"
                    </p>
                  ) : (
                    <div>
                      <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                        {r?.value ? 'Yes' : 'No'}
                      </span>
                      {r?.details && (
                        <span style={{ color: 'var(--ink)' }}>, {r.details.replace(/^(yes|no)[,\s]*/i, '')}</span>
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
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--accent)' }}>
              Reflective Summary
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--ink)' }}>{summary}</p>
          </motion.div>
        )}

        {/* Journaling Prompts */}
        {!processing && prompts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--accent)' }}>
              Reflective Journalling Prompts
            </h3>
            <div
              className="max-w-none
                [&_ul]:space-y-3 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-0
                [&_li]:p-4 [&_li]:rounded-xl [&_li]:leading-relaxed"
              ref={(el) => {
                if (el) {
                  el.querySelectorAll('li').forEach((li, index) => {
                    li.style.backgroundColor = 'var(--soft)';
                    li.style.color = 'var(--ink)';
                    if (!li.textContent.match(/^\d+\./)) {
                      const number = `${index + 1}.`;
                      const text = li.textContent;
                      li.innerHTML = `<span style="color: var(--accent); font-weight: 600;">${number}</span> ${text}`;
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
              <button
                onClick={() => {
                  const promptsList = prompts.split('</li>').filter(p => p.includes('<li>')).map(p =>
                    p.replace(/<\/?[^>]+(>|$)/g, '').trim()
                  );
                  navigate(createPageUrl(`Journaling?prompts=${encodeURIComponent(JSON.stringify(promptsList))}&inventoryId=${savedEntryId || 'temp_' + Date.now()}`));
                }}
                className="w-full min-h-[52px] rounded-2xl font-semibold mb-3 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accentInk)'
                }}
              >
                <PenLine className="w-5 h-5" />
                Start Journaling
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <button
                onClick={handleShare}
                className="w-full min-h-[52px] rounded-2xl font-semibold mb-3 flex items-center justify-center gap-2 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)'
                }}
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
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
            <button
              onClick={handleSave}
              disabled={processing}
              className="w-full min-h-[52px] rounded-2xl font-semibold disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accentInk)'
              }}
            >
              {processing ? 'Saving...' : 'Return To Dashboard'}
            </button>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3"
        >
          <button
            onClick={() => setShowBackDialog(true)}
            className="w-full min-h-[52px] rounded-2xl font-medium transition-colors"
            style={{
              border: '1px solid var(--line)',
              color: 'var(--muted)'
            }}
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