import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditor from '@/components/settings/ProfileEditor';
import ThemeSelector from '@/components/settings/ThemeSelector';
import BackgroundSelector from '@/components/settings/BackgroundSelector';
import QuestionSettings from '@/components/settings/QuestionSettings';
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

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  
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
  
  const handleLogout = () => {
    base44.auth.logout();
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
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(createPageUrl('Dashboard'))}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-extrabold text-[#1F2C46]">Settings</h1>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProfileEditor user={user} onUpdate={loadUser} />
            </motion.div>
          </TabsContent>

          <TabsContent value="inventory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[25px] p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Inventory Type</h3>
              <p className="text-sm text-gray-500 mb-6">
                Choose which reflection style works best for you
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSettings({ ...settings, recovery_status: 'aa' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    settings.recovery_status === 'aa'
                      ? 'border-[#7667E5] bg-[#7667E5]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-[#1F2C46]">Recovery Program (AA/NA)</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Structured 10th step inventory questions
                  </div>
                </button>
                
                <button
                  onClick={() => setSettings({ ...settings, recovery_status: 'general' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    settings.recovery_status === 'general'
                      ? 'border-[#7667E5] bg-[#7667E5]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-[#1F2C46]">General Reflection</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Open-ended daily reflection prompts
                  </div>
                </button>
              </div>

              <Button 
                onClick={handleSaveSettings} 
                disabled={saving}
                className="w-full mt-6"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="questions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[25px] p-6 shadow-sm"
            >
              <QuestionSettings user={user} onSave={loadUser} />
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[25px] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Theme</h3>
                <ThemeSelector user={user} onUpdate={loadUser} />
              </div>

              <div className="bg-white rounded-[25px] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Background</h3>
                <BackgroundSelector user={user} onUpdate={loadUser} />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="reminders">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-[25px] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1F2C46] mb-4">Daily Reminder</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Set a time to receive a reminder for your daily inventory
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label>Reminder Time</Label>
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

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label>Daily Mood Check-In</Label>
                      <p className="text-sm text-gray-500 mt-1">
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
                  className="w-full mt-6"
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