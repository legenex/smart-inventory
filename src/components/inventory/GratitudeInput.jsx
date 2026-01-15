import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import useTheme from '../theme/useTheme';

export default function GratitudeInput({ values = [], onChange }) {
  const { colors } = useTheme();
  const [inputs, setInputs] = useState(values.length > 0 ? values : ['']);
  
  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    
    // Add new input if current one has content and we're under 5
    if (value && index === inputs.length - 1 && inputs.length < 5) {
      newInputs.push('');
    }
    
    setInputs(newInputs);
    onChange(newInputs.filter(i => i.trim()));
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputs[index] && inputs.length > 1) {
      // Remove empty input on backspace
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
      onChange(newInputs.filter(i => i.trim()));
      // Focus previous input
      setTimeout(() => {
        const prevInput = document.getElementById(`gratitude-${index - 1}`);
        if (prevInput) prevInput.focus();
      }, 0);
    }
  };
  
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {inputs.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id={`gratitude-${index}`}
              placeholder={`I am grateful for...`}
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="rounded-2xl border-2 p-4 text-[#1F2C46] transition-colors"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: `${colors.primary}08`
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {inputs.length < 5 && inputs[inputs.length - 1] && (
        <p className="text-sm text-gray-400 text-center">
          {5 - inputs.length} more {5 - inputs.length === 1 ? 'item' : 'items'} available
        </p>
      )}
    </div>
  );
}