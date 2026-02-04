import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Upload, PenLine, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';

export default function Journaling() {
  const [step, setStep] = useState('select'); // select, write, upload, processing
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
    
    if (!promptsParam || !invId) {
      navigate(createPageUrl('Dashboard'));
      return;
    }
    
    setInventoryId(invId);
    try {
      const parsedPrompts = JSON.parse(decodeURIComponent(promptsParam));
      setPrompts(parsedPrompts);
    } catch (err) {
      navigate(createPageUrl('Dashboard'));
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
      
      // Transcribe the photo
      const transcription = await base44.integrations.Core.InvokeLLM({
        prompt: 'Transcribe all the handwritten text from this journal entry. Return only the transcribed text, maintaining the structure and formatting as much as possible.',
        file_urls: [data.file_url]
      });
      
      // Analyze emotions
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
      
      // Save journal entry
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
      
      // Analyze emotions
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your journal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => step === 'select' ? navigate(-1) : setStep('select')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reflective Journaling</h1>
            <p className="text-sm text-gray-500">Deep reflection leads to growth</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Handwriting is powerful</h3>
                <p className="text-blue-800 text-sm">
                  Research shows that handwriting deepens reflection and retention. We encourage you to write by hand, then photograph your journal to track your progress.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Button
                  onClick={() => setStep('upload')}
                  size="lg"
                  className="h-32 flex-col bg-gradient-to-br from-[#7667E5] to-[#5B9FED] hover:opacity-90"
                >
                  <PenLine className="w-8 h-8 mb-2" />
                  <span className="text-lg font-semibold">Write by Hand</span>
                  <span className="text-xs opacity-80">Recommended</span>
                </Button>
                
                <Button
                  onClick={() => setStep('write')}
                  size="lg"
                  variant="outline"
                  className="h-32 flex-col border-2"
                >
                  <PenLine className="w-8 h-8 mb-2" />
                  <span className="text-lg font-semibold">Type Here</span>
                  <span className="text-xs text-gray-500">Digital option</span>
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Select prompts to explore:</h3>
                <div className="space-y-3">
                  {prompts.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedPrompts.includes(index)}
                        onCheckedChange={() => handlePromptToggle(index)}
                        className="mt-1"
                      />
                      <label 
                        onClick={() => handlePromptToggle(index)}
                        className="text-gray-700 cursor-pointer flex-1"
                      >
                        {prompt}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {selectedPrompts.map((promptIndex) => (
                  <div key={promptIndex} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">{prompts[promptIndex]}</h3>
                    <Textarea
                      value={responses[promptIndex] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [promptIndex]: e.target.value }))}
                      placeholder="Write your reflection here..."
                      className="min-h-[200px] resize-y"
                    />
                  </div>
                ))}
                
                <Button
                  onClick={handleSaveWrittenJournal}
                  disabled={selectedPrompts.length === 0 || processing}
                  className="w-full py-6 text-lg bg-gradient-to-r from-[#7667E5] to-[#5B9FED]"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Save Journal Entry
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl p-12 shadow-sm border-2 border-dashed border-gray-300 text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Handwritten Journal</h3>
                <p className="text-gray-500 mb-6">Take a clear photo of your journal entry</p>
                
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button asChild size="lg" className="bg-gradient-to-r from-[#7667E5] to-[#5B9FED]">
                    <span>
                      <Upload className="w-5 h-5 mr-2" />
                      Choose Photo
                    </span>
                  </Button>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}