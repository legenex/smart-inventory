import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';

export default function QuestionCard({ 
  question, 
  questionNumber,
  type, // 'yesno', 'text', 'yesno-text'
  value,
  details,
  onValueChange,
  onDetailsChange,
  onNext,
  onBack,
  isFirst,
  isLast
}) {
  const showDetails = type === 'yesno-text' && value === true;
  const isTextOnly = type === 'text';
  
  const canProceed = isTextOnly 
    ? value && value.trim().length > 0 
    : value !== null && value !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-white rounded-[25px] shadow-lg shadow-purple-100/50 p-8 md:p-10">
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#7667E5]/10 to-[#A48FFF]/10 text-[#7667E5] rounded-full text-sm font-medium mb-4">
          Question {questionNumber}
        </span>
        
        <h2 className="text-xl md:text-2xl font-semibold text-[#1F2C46] mb-8 leading-relaxed">
          {question}
        </h2>
        
        {!isTextOnly && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => onValueChange(true)}
              className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                value === true 
                  ? 'border-[#7667E5] bg-[#7667E5]/10 text-[#7667E5]' 
                  : 'border-gray-200 hover:border-[#7667E5]/50 text-gray-600'
              }`}
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Yes</span>
            </button>
            <button
              onClick={() => onValueChange(false)}
              className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                value === false 
                  ? 'border-[#6BC2CE] bg-[#6BC2CE]/10 text-[#6BC2CE]' 
                  : 'border-gray-200 hover:border-[#6BC2CE]/50 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
              <span className="font-medium">No</span>
            </button>
          </div>
        )}
        
        <AnimatePresence>
          {(showDetails || isTextOnly) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Textarea
                placeholder={isTextOnly ? "Share your thoughts..." : "Tell us more about what happened..."}
                value={isTextOnly ? value || '' : details || ''}
                onChange={(e) => isTextOnly ? onValueChange(e.target.value) : onDetailsChange(e.target.value)}
                className="w-full min-h-[120px] rounded-2xl border-2 border-gray-200 focus:border-[#7667E5] p-4 text-[#1F2C46] resize-none transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex gap-4 mt-8">
          {!isFirst && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 py-6 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex-1 py-6 rounded-2xl bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 ${isFirst ? 'w-full' : ''}`}
          >
            {isLast ? 'Complete Inventory' : 'Continue'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}