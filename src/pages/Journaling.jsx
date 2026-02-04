import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Upload, PenLine, Check, Camera, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import useTheme from '@/components/theme/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Journaling() {
  const { colors } = useTheme();
  const [step, setStep] = useState('choice'); // choice, select, write, upload, processing
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: colors.primary }} />
          <p className="text-gray-600">Processing your journal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => step === 'choice' ? navigate(-1) : setStep(step === 'write' ? 'select' : 'choice')}
              className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reflective Journaling</h1>
              <p className="text-sm text-gray-500">Deep reflection leads to growth</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
                <Menu className="w-5 h-5 text-gray-600" />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="rounded-3xl p-6 mb-6" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)` }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: colors.primary }}>✨ Track Your Spiritual Progress</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Journaling on these prompts helps you process emotions, identify patterns, and track your spiritual growth over time. Your responses feed into progress visualizations and insights.
                </p>
                <p className="text-sm text-gray-600">
                  💡 <strong>Handwriting is powerful:</strong> Research shows handwriting deepens reflection and retention, helping you connect more deeply with your thoughts.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('upload')}
                  className="rounded-3xl p-8 text-center shadow-md border-2 transition-all"
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
                    borderColor: colors.primary
                  }}
                >
                  <Camera className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Write by Hand</h3>
                  <p className="text-white/90 text-sm mb-3">Recommended</p>
                  <p className="text-white/80 text-xs leading-relaxed">
                    Write on paper, then photograph your journal. We'll transcribe it using AI and track your progress automatically.
                  </p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('select')}
                  className="bg-white rounded-3xl p-8 text-center shadow-md border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <PenLine className="w-12 h-12 mx-auto mb-4" style={{ color: colors.primary }} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Type Here</h3>
                  <p className="text-gray-500 text-sm mb-3">Digital option</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Select which prompts resonate with you, then type your reflections directly in the app.
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Select prompts to explore:</h3>
                <div className="space-y-3">
                  {prompts.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
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
              
              <Button
                onClick={() => setStep('write')}
                disabled={selectedPrompts.length === 0}
                className="w-full py-6 text-lg rounded-2xl"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  color: 'white'
                }}
              >
                Next: Write Reflections
              </Button>
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
                  <div key={promptIndex} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">{prompts[promptIndex]}</h3>
                    <Textarea
                      value={responses[promptIndex] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [promptIndex]: e.target.value }))}
                      placeholder="Write your reflection here..."
                      className="min-h-[200px] resize-y rounded-2xl"
                    />
                  </div>
                ))}
                
                <Button
                  onClick={handleSaveWrittenJournal}
                  disabled={selectedPrompts.length === 0 || processing}
                  className="w-full py-6 text-lg rounded-2xl"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: 'white'
                  }}
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
              <div className="bg-white rounded-3xl p-12 shadow-sm border-2 border-dashed border-gray-300 text-center">
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
                  <Button asChild size="lg" className="rounded-2xl" style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: 'white'
                  }}>
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