import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Sun, ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Logo from '@/components/brand/Logo';
import { getCopy } from '@/lib/mode';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recovery_status: null,
    display_name: '',
    sober_date: '',
    reminder_time: '21:00',
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.onboarding_completed) {
        navigate(createPageUrl('Dashboard'));
        return;
      }
      if (user?.display_name) setForm(f => ({ ...f, display_name: user.display_name }));
      if (user?.recovery_status) setForm(f => ({ ...f, recovery_status: user.recovery_status }));
    } catch {
      // not logged in
    }
  };

  const copy = getCopy(form.recovery_status);

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const handleModeSelect = (mode) => {
    setForm(f => ({ ...f, recovery_status: mode }));
    goNext();
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({
        recovery_status: form.recovery_status,
        display_name: form.display_name.trim() || undefined,
        sober_date: form.sober_date || undefined,
        reminder_time: form.reminder_time,
        streak: 0,
        onboarding_completed: true,
      });
      navigate(createPageUrl('Dashboard'));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateTimeOptions = () => {
    const opts = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const period = h < 12 ? 'AM' : 'PM';
        opts.push({ value: val, label: `${dh}:${String(m).padStart(2, '0')} ${period}` });
      }
    }
    return opts;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5] flex items-center justify-center p-6"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
      <div className="w-full max-w-md">

        {/* Progress dots — shown on steps 1–3 */}
        {step >= 1 && step <= 3 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-[#7667E5]' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div key="welcome"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="mx-auto mb-8">
                <Logo size="lg" />
              </motion.div>
              <h1 className="text-3xl font-extrabold text-[#1F2C46] mb-3">Welcome to Smart Inventory</h1>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                A private, guided daily reflection practice. Let's set up your experience in a few quick steps.
              </p>
              <Button onClick={goNext}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white text-lg font-semibold hover:opacity-90 transition-opacity min-h-[56px]">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* Step 1: Recovery / General */}
          {step === 1 && (
            <motion.div key="mode"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="text-2xl font-extrabold text-[#1F2C46] mb-2 text-center">Are you in recovery?</h2>
              <p className="text-gray-500 text-center mb-8 text-sm">This tailors the language and prompts throughout the entire app.</p>
              <div className="space-y-4">
                <button onClick={() => handleModeSelect('aa')}
                  className="w-full bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#7667E5]/40 group text-left min-h-[88px]">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#7667E5]/10 to-[#A48FFF]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#7667E5]/20 group-hover:to-[#A48FFF]/20 transition-colors">
                      <Heart className="w-7 h-7 text-[#7667E5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F2C46] text-lg">Yes, I am in recovery</h3>
                      <p className="text-gray-500 text-sm mt-1">Nightly inventory with recovery-oriented language and spiritual focus</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => handleModeSelect('general')}
                  className="w-full bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#6BC2CE]/40 group text-left min-h-[88px]">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#6BC2CE]/10 to-[#7667E5]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#6BC2CE]/20 group-hover:to-[#7667E5]/20 transition-colors">
                      <Sun className="w-7 h-7 text-[#6BC2CE]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F2C46] text-lg">No, this is for general self-reflection</h3>
                      <p className="text-gray-500 text-sm mt-1">Evening review with neutral, growth-focused language — no recovery references</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <motion.div key="name"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="text-2xl font-extrabold text-[#1F2C46] mb-2 text-center">What should we call you?</h2>
              <p className="text-gray-500 text-center mb-8 text-sm">Used to personalise your experience throughout the app.</p>
              <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6">
                <Label className="text-[#1F2C46] font-semibold mb-2 block">Display name</Label>
                <Input
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="Your first name or nickname"
                  className="rounded-xl border-gray-200 min-h-[48px]"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={goBack} variant="outline" className="flex-1 rounded-2xl min-h-[52px]">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 rounded-2xl bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white min-h-[52px]">
                  Next <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Start date + reminder */}
          {step === 3 && (
            <motion.div key="date"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="text-2xl font-extrabold text-[#1F2C46] mb-2 text-center">
                {form.recovery_status === 'aa' ? 'Your sobriety date' : 'Start date & reminders'}
              </h2>
              <p className="text-gray-500 text-center mb-8 text-sm">
                {form.recovery_status === 'aa'
                  ? 'Used to calculate your days and show milestone celebrations.'
                  : 'Your start date is optional and used for milestones.'}
              </p>
              <div className="bg-white rounded-[20px] p-6 shadow-sm mb-4 space-y-5">
                <div>
                  <Label className="text-[#1F2C46] font-semibold mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {copy.dateFieldLabel}
                    {form.recovery_status === 'general' && <span className="text-gray-400 font-normal text-xs">(optional)</span>}
                  </Label>
                  <Input
                    type="date"
                    value={form.sober_date}
                    onChange={e => setForm(f => ({ ...f, sober_date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    className="rounded-xl border-gray-200 min-h-[48px]"
                  />
                </div>
                <div>
                  <Label className="text-[#1F2C46] font-semibold mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Daily reminder time
                  </Label>
                  <Select value={form.reminder_time} onValueChange={val => setForm(f => ({ ...f, reminder_time: val }))}>
                    <SelectTrigger className="rounded-xl min-h-[48px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions().map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={goBack} variant="outline" className="flex-1 rounded-2xl min-h-[52px]">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={handleFinish} disabled={loading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white min-h-[52px]">
                  {loading ? 'Setting up…' : 'Start Reflecting'}
                </Button>
              </div>
              {form.recovery_status === 'general' && (
                <button onClick={handleFinish} disabled={loading}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors min-h-[44px]">
                  Skip for now
                </button>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}