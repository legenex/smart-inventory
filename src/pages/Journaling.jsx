import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Upload, PenLine, Check, Camera, Menu } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Journaling() {
  const [step, setStep] = useState('choice');
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [responses, setResponses] = useState({});
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [inventoryId, setInventoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promptsParam = urlParams.get('prompts');
    const invId = urlParams.get('inventoryId');

    if (invId) {
      setInventoryId(invId);
    }
    if (promptsParam) {
      try {
        const parsedPrompts = JSON.parse(decodeURIComponent(promptsParam));
        setPrompts(parsedPrompts);
      } catch (err) {
        // invalid prompts — continue with empty (upload-only mode)
      }
    }
  }, []);

  const handlePromptToggle = (index) => {
    setSelectedPrompts(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    try {
      const { data } = await base44.integrations.Core.UploadFile({ file });
      setUploadedPhoto(data.file_url);

      const transcription = await base44.integrations.Core.InvokeLLM({
        prompt: 'Transcribe all the handwritten text from this journal entry. Return only the transcribed text, maintaining the structure and formatting as much as possible.',
        file_urls: [data.file_url]
      });

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this journal entry and extract emotional state, challenges mentioned, and growth areas. Return as JSON.

        Journal entry:
        ${transcription}`,
        response_json_schema: {
          type: 'object',
          properties: {
            emotions: { type: 'array', items: { type: 'string' } },
            challenges: { type: 'array', items: { type: 'string' } },
            growth_areas: { type: 'array', items: { type: 'string' } },
            overall_mood: { type: 'string' }
          }
        }
      });

      await base44.entities.JournalEntry.create({
        date: new Date().toISOString().split('T')[0],
        inventory_id: inventoryId,
        photo_url: data.file_url,
        transcription: transcription,
        emotional_analysis: analysis
      });

      setProcessing(false);
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error(error);
      setProcessing(false);
      alert('Failed to process photo. Please try again.');
    }
  };

  const handleSaveWrittenJournal = async () => {
    setProcessing(true);
    try {
      const journalText = selectedPrompts.map(i =>
        `${prompts[i]}\n\n${responses[i] || ''}`
      ).join('\n\n---\n\n');

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this journal entry and extract emotional state, challenges mentioned, and growth areas. Return as JSON.

        Journal entry:
        ${journalText}`,
        response_json_schema: {
          type: 'object',
          properties: {
            emotions: { type: 'array', items: { type: 'string' } },
            challenges: { type: 'array', items: { type: 'string' } },
            growth_areas: { type: 'array', items: { type: 'string' } },
            overall_mood: { type: 'string' }
          }
        }
      });

      await base44.entities.JournalEntry.create({
        date: new Date().toISOString().split('T')[0],
        inventory_id: inventoryId,
        prompts_answered: responses,
        transcription: journalText,
        emotional_analysis: analysis
      });

      setProcessing(false);
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error(error);
      setProcessing(false);
      alert('Failed to save journal. Please try again.');
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent)' }} />
          <p style={{ color: 'var(--muted)' }}>Processing your journal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step === 'choice' ? navigate(-1) : setStep(step === 'write' ? 'select' : 'choice')}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--ink)' }}>Reflective Journaling</h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Deep reflection leads to growth</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <Menu className="w-5 h-5" style={{ color: 'var(--muted)' }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(createPageUrl('Dashboard'))}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(createPageUrl('Settings'))}>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AnimatePresence mode="wait">
          {step === 'choice' && (
            <motion.div
              key="choice"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            >
              <div className="rounded-3xl p-6 mb-6"
                style={{ backgroundColor: 'var(--soft)', border: '1px solid var(--line)' }}>
                <h3 className="font-semibold text-base mb-3" style={{ color: 'var(--accent)' }}>Track Your Progress</h3>
                <p className="leading-relaxed mb-3" style={{ color: 'var(--ink)' }}>
                  Journaling on these prompts helps you process emotions, identify patterns, and track your growth over time. Your responses feed into progress visualizations and insights.
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  💡 <strong>Handwriting is powerful:</strong> Research shows handwriting deepens reflection and retention.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                  onClick={() => setStep('upload')}
                  className="rounded-3xl p-8 text-center transition-all min-h-[200px] flex flex-col items-center justify-center"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
                >
                  <Camera className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Write by Hand</h3>
                  <p className="text-sm opacity-80 mb-3">Recommended</p>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Write on paper, then photograph your journal. We'll transcribe it using AI and track your progress automatically.
                  </p>
                </motion.button>

                {prompts.length > 0 && (
                  <motion.button
                    whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                    onClick={() => setStep('select')}
                    className="rounded-3xl p-8 text-center transition-all min-h-[200px] flex flex-col items-center justify-center"
                    style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--line)' }}
                  >
                    <PenLine className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Type Here</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>Digital option</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                      Select which prompts resonate with you, then type your reflections directly in the app.
                    </p>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'select' && prompts.length > 0 && (
            <motion.div
              key="select"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            >
              <div className="rounded-3xl p-6 mb-6"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>Select prompts to explore:</h3>
                <div className="space-y-3">
                  {prompts.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-2xl transition-colors"
                      style={{ backgroundColor: 'var(--bg)' }}>
                      <Checkbox
                        checked={selectedPrompts.includes(index)}
                        onCheckedChange={() => handlePromptToggle(index)}
                        className="mt-1"
                      />
                      <label
                        onClick={() => handlePromptToggle(index)}
                        className="cursor-pointer flex-1"
                        style={{ color: 'var(--ink)' }}
                      >
                        {prompt}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                onClick={() => setStep('write')}
                disabled={selectedPrompts.length === 0}
                className="w-full min-h-[52px] rounded-2xl font-semibold disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
              >
                Next: Write Reflections
              </motion.button>
            </motion.div>
          )}

          {step === 'write' && (
            <motion.div
              key="write"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {selectedPrompts.map((promptIndex) => (
                  <div key={promptIndex} className="rounded-3xl p-6"
                    style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--ink)' }}>{prompts[promptIndex]}</h3>
                    <Textarea
                      value={responses[promptIndex] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [promptIndex]: e.target.value }))}
                      placeholder="Write your reflection here..."
                      className="min-h-[200px] resize-y rounded-2xl"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--line)',
                        color: 'var(--ink)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 3px var(--soft)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--line)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}

                <motion.button
                  whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                  onClick={handleSaveWrittenJournal}
                  disabled={selectedPrompts.length === 0 || processing}
                  className="w-full min-h-[52px] rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
                >
                  <Check className="w-5 h-5" />
                  Save Journal Entry
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            >
              <div className="rounded-3xl p-12 text-center"
                style={{ backgroundColor: 'var(--surface)', border: '2px dashed var(--line)' }}>
                <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>Upload Your Handwritten Journal</h3>
                <p className="mb-6" style={{ color: 'var(--muted)' }}>Take a clear photo of your journal entry</p>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="inline-block cursor-pointer">
                   <span
                     className="rounded-2xl px-8 py-4 font-semibold min-h-[52px] flex items-center justify-center gap-2"
                     style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
                   >
                     <Upload className="w-5 h-5" />
                     Choose Photo
                   </span>
                 </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}