import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Monitor } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditor from '@/components/settings/ProfileEditor';
import ThemeSelector from '@/components/settings/ThemeSelector';
import BackgroundSelector from '@/components/settings/BackgroundSelector';
import QuestionSettings from '@/components/settings/QuestionSettings';
import AccountSection from '@/components/settings/AccountSection';
import useTheme from '@/components/theme/useTheme';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--line)',
};

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const motionProps = prefersReduced
  ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
  : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const APPEARANCE_MODES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { appearanceMode, setAppearanceMode } = useTheme();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.recovery_status) {
        navigate(createPageUrl('Onboarding'));
        return;
      }
      setUser(userData);
      setSettings({
        recovery_status: userData.recovery_status,
        reminder_time: userData.reminder_time || '21:00',
        mood_check_enabled: userData.mood_check_enabled !== false
      });
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(settings);
      await loadUser();
    } catch (err) {
      console.error('Failed to save settings', err);
    }
    setSaving(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const displayMinute = minute.toString().padStart(2, '0');
        options.push({
          value: timeString,
          label: `${displayHour}:${displayMinute} ${period}`
        });
      }
    }
    return options;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '3px solid var(--line)', borderTopColor: 'var(--accent)' }}
        />
      </div>
    );
  }

  const tabTriggerClass = "min-h-[44px] rounded-xl text-xs md:text-sm data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground transition-colors";

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate(createPageUrl('Dashboard'))}
            className="rounded-xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              minHeight: 44,
              minWidth: 44,
            }}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 gap-1 rounded-2xl" style={cardStyle}>
            <TabsTrigger value="profile" className={tabTriggerClass}>Profile</TabsTrigger>
            <TabsTrigger value="inventory" className={tabTriggerClass}>Inventory</TabsTrigger>
            <TabsTrigger value="questions" className={tabTriggerClass}>Questions</TabsTrigger>
            <TabsTrigger value="appearance" className={tabTriggerClass}>Appearance</TabsTrigger>
            <TabsTrigger value="reminders" className={tabTriggerClass}>Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div {...motionProps}>
              <ProfileEditor user={user} onUpdate={loadUser} />
              <AccountSection />
            </motion.div>
          </TabsContent>

          <TabsContent value="inventory">
            <motion.div
              {...motionProps}
              className="rounded-2xl p-6 mt-2"
              style={cardStyle}
            >
              <h3 className="text-lg font-semibold text-foreground mb-1">Inventory Type</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose which reflection style works best for you
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setSettings({ ...settings, recovery_status: 'aa' })}
                  className="w-full p-4 rounded-xl text-left transition-all min-h-[44px]"
                  style={{
                    border: `2px solid ${settings.recovery_status === 'aa' ? 'var(--accent)' : 'var(--line)'}`,
                    backgroundColor: settings.recovery_status === 'aa' ? 'var(--soft)' : 'var(--surface)',
                  }}
                >
                  <div className="font-semibold text-foreground">Recovery Program (AA/NA)</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Structured 10th step inventory questions
                  </div>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, recovery_status: 'general' })}
                  className="w-full p-4 rounded-xl text-left transition-all min-h-[44px]"
                  style={{
                    border: `2px solid ${settings.recovery_status === 'general' ? 'var(--accent)' : 'var(--line)'}`,
                    backgroundColor: settings.recovery_status === 'general' ? 'var(--soft)' : 'var(--surface)',
                  }}
                >
                  <div className="font-semibold text-foreground">General Reflection</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Open-ended daily reflection prompts
                  </div>
                </button>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full mt-6 min-h-[44px]"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="questions">
            <motion.div
              {...motionProps}
              className="rounded-2xl p-6 mt-2"
              style={cardStyle}
            >
              <QuestionSettings user={user} onSave={loadUser} />
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance">
            <motion.div {...motionProps} className="space-y-6 mt-2">
              {/* Theme */}
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
                <ThemeSelector user={user} onUpdate={loadUser} />
              </div>

              {/* Appearance Mode */}
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-lg font-semibold text-foreground mb-1">Appearance Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose light, dark, or follow your system</p>
                <div className="grid grid-cols-3 gap-3">
                  {APPEARANCE_MODES.map(({ id, label, icon: Icon }) => {
                    const selected = appearanceMode === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setAppearanceMode(id)}
                        className="rounded-xl p-4 flex flex-col items-center gap-2 transition-all min-h-[44px]"
                        style={{
                          border: `2px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
                          backgroundColor: selected ? 'var(--soft)' : 'var(--surface)',
                          color: selected ? 'var(--accent)' : 'var(--muted)',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background */}
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Background</h3>
                <BackgroundSelector user={user} onUpdate={loadUser} />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="reminders">
            <motion.div {...motionProps} className="mt-2">
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h3 className="text-lg font-semibold text-foreground mb-1">Daily Reminder</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set a time to receive a reminder for your daily inventory
                </p>

                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Reminder Time</Label>
                    <Select
                      value={settings.reminder_time}
                      onValueChange={(value) => setSettings({ ...settings, reminder_time: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <Label className="text-foreground">Daily Mood Check-In</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quick mood tracking when you open the app
                      </p>
                    </div>
                    <Switch
                      checked={settings.mood_check_enabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, mood_check_enabled: checked })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full mt-6 min-h-[44px]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}