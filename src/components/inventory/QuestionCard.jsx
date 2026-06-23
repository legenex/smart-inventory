import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import GratitudeInput from './GratitudeInput';

export default function QuestionCard({
  question,
  description,
  questionNumber,
  type,
  value,
  details,
  onValueChange,
  onDetailsChange,
  onNext,
  onBack,
  isFirst,
  isLast
}) {
  const showDetails = (type === 'yesno-text' && value === true) || (type === 'yesno-text-no' && value === false);
  const isTextOnly = type === 'text';
  const isGratitude = type === 'gratitude';

  const canProceed = true;

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const slideVariants = {
    enter: prefersReduced ? { opacity: 0 } : { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: prefersReduced ? { opacity: 0 } : { opacity: 0, x: -40 }
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)' }}
      >
        {/* Question number badge */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}
        >
          Question {questionNumber}
        </span>

        {/* Question in serif */}
        <h2 className="font-display text-2xl md:text-3xl leading-snug mb-3" style={{ color: 'var(--ink)' }}>
          {question}
        </h2>

        {description && (
          <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        )}

        {/* Yes / No buttons */}
        {!isTextOnly && !isGratitude && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => onValueChange(true)}
              className="flex-1 min-h-[56px] rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              style={{
                borderColor: value === true ? 'var(--accent)' : 'var(--line)',
                backgroundColor: value === true ? 'var(--soft)' : 'transparent',
                color: value === true ? 'var(--accent)' : 'var(--muted)'
              }}
            >
              <Check className="w-5 h-5" />
              Yes
            </button>
            <button
              onClick={() => onValueChange(false)}
              className="flex-1 min-h-[56px] rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              style={{
                borderColor: value === false ? 'var(--accent)' : 'var(--line)',
                backgroundColor: value === false ? 'var(--soft)' : 'transparent',
                color: value === false ? 'var(--accent)' : 'var(--muted)'
              }}
            >
              <X className="w-5 h-5" />
              No
            </button>
          </div>
        )}

        <AnimatePresence>
          {isGratitude && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
            >
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                List 5 things you were grateful for today
              </p>
              <GratitudeInput
                values={Array.isArray(value) ? value : []}
                onChange={onValueChange}
              />
            </motion.div>
          )}
          {!isGratitude && (showDetails || isTextOnly) && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
            >
              <Textarea
                placeholder="Please describe with as much detail as possible"
                value={isTextOnly ? value || '' : details || ''}
                onChange={(e) => isTextOnly ? onValueChange(e.target.value) : onDetailsChange(e.target.value)}
                className="w-full min-h-[140px] rounded-2xl p-4 resize-none transition-colors focus:ring-2"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex gap-3 mt-8">
          {!isFirst && (
            <motion.button
              whileTap={prefersReduced ? undefined : { scale: 0.96 }}
              onClick={onBack}
              className="min-h-[48px] px-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-medium"
              style={{
                borderColor: 'var(--line)',
                color: 'var(--muted)',
                backgroundColor: 'transparent'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
          <motion.button
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            onClick={onNext}
            className="min-h-[48px] rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 flex-1"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accentInk)'
            }}
          >
            {isLast ? 'Complete Inventory' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}