import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import GratitudeInput from './GratitudeInput';
import useTheme from '../theme/useTheme';

export default function QuestionCard({ 
  question, 
  questionNumber,
  type, // 'yesno', 'text', 'yesno-text', 'gratitude'
  value,
  details,
  onValueChange,
  onDetailsChange,
  onNext,
  onBack,
  isFirst,
  isLast
}) {
  const { colors } = useTheme();
  const showDetails = type === 'yesno-text' && value === true;
  const isTextOnly = type === 'text';
  const isGratitude = type === 'gratitude';
  
  const canProceed = isGratitude
    ? Array.isArray(value) && value.length > 0
    : isTextOnly 
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
        <span 
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${colors.bgLight} ${colors.textClass}`}
        >
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
                  ? `${colors.borderClass} ${colors.bgLight} ${colors.textClass}` 
                  : `border-gray-200 ${colors.hoverBorder} text-gray-600`
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
          {isGratitude && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GratitudeInput
                values={Array.isArray(value) ? value : []}
                onChange={onValueChange}
              />
            </motion.div>
          )}
          {!isGratitude && (showDetails || isTextOnly) && (
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
            className={`flex-1 py-6 rounded-2xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 ${isFirst ? 'w-full' : ''}`}
            style={{
              background: canProceed ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` : undefined
            }}
          >
            {isLast ? 'Complete Inventory' : 'Continue'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}