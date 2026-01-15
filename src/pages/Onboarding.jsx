import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sun } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Logo from '@/components/brand/Logo';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkExistingUser();
  }, []);
  
  const checkExistingUser = async () => {
    try {
      const user = await base44.auth.me();
      if (user.recovery_status) {
        navigate(createPageUrl('Home'));
      }
    } catch (err) {
      // Not logged in, continue with onboarding
    }
  };
  
  const handleSelection = async (isRecovery) => {
    setLoading(true);
    try {
      await base44.auth.updateMe({
        recovery_status: isRecovery ? 'aa' : 'general',
        reminder_time: '21:00',
        streak: 0
      });
      navigate(createPageUrl('Dashboard'));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-8"
            >
              <Logo size="lg" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-[#1F2C46] mb-4">
              Welcome to Smart-Inventory
            </h1>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Reflect. Grow. Become your best self.
            </p>
            
            <Button
              onClick={() => setStep(1)}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Button>
          </motion.div>
        )}
        
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-[#1F2C46] mb-4">
              Personalize Your Experience
            </h2>
            <p className="text-gray-500 mb-10">
              This helps us tailor your daily reflections
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleSelection(true)}
                disabled={loading}
                className="w-full bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-[#7667E5]/30 group text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7667E5]/10 to-[#A48FFF]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#7667E5]/20 group-hover:to-[#A48FFF]/20 transition-colors">
                    <Heart className="w-7 h-7 text-[#7667E5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2C46] text-lg">Yes, I'm in Recovery</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Step 10-style AA nightly inventory with spiritual and emotional focus
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSelection(false)}
                disabled={loading}
                className="w-full bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-[#6BC2CE]/30 group text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6BC2CE]/10 to-[#7667E5]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#6BC2CE]/20 group-hover:to-[#7667E5]/20 transition-colors">
                    <Sun className="w-7 h-7 text-[#6BC2CE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2C46] text-lg">No, General Reflection</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Daily mindfulness and personal growth focused inventory
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}