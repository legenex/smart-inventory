import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Bell, Heart, Sparkles, LogOut, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThemeSelector from '@/components/settings/ThemeSelector';
import ProfileEditor from '@/components/settings/ProfileEditor';
import BackgroundSelector from '@/components/settings/BackgroundSelector';
import useTheme from '@/components/theme/useTheme';

export default function Settings() {
  const { updateTheme, colors } = useTheme();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    recovery_status: 'general',
    reminder_enabled: true,
    reminder_time: '21:00',
    theme: 'light',
    background: null
  });
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
        recovery_status: userData.recovery_status || 'general',
        reminder_enabled: userData.reminder_enabled !== false,
        reminder_time: userData.reminder_time || '21:00',
        theme_color: userData.theme_color || 'purple',
        background: userData.background || null
      });
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };
  
  const handleSave = async (newSettings) => {
    setSaving(true);
    try {
      await base44.auth.updateMe(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      if (newSettings.theme_color) {
        updateTheme(newSettings.theme_color);
      }
      // Reload user to ensure everything is in sync
      await loadUser();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };
  
  const handleLogout = async () => {
    await base44.auth.logout();
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  const timeOptions = [];
  for (let h = 8; h <= 23; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to={createPageUrl('Dashboard')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-[#1F2C46]">Settings</h1>
        </motion.div>
        
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <ProfileEditor user={user} onUpdate={loadUser} />
        </motion.div>
        
        {/* Inventory Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h3 className="font-semibold text-[#1F2C46] mb-4">Inventory Type</h3>

          <div className="space-y-3">
            <button
              onClick={() => handleSave({ ...settings, recovery_status: 'aa' })}
              className={`w-full p-4 rounded-xl transition-all text-left`}
              style={{
                borderWidth: '2px',
                borderColor: settings.recovery_status === 'aa' ? colors.borderColor : '#e5e7eb',
                backgroundColor: settings.recovery_status === 'aa' ? `${colors.primary}0D` : 'transparent'
              }}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-5 h-5`} style={{ color: settings.recovery_status === 'aa' ? colors.primary : '#9ca3af' }} />
                <div>
                  <p className="font-medium text-[#1F2C46]">Recovery (AA)</p>
                  <p className="text-sm text-gray-500">Step 10-style inventory</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSave({ ...settings, recovery_status: 'general' })}
              className={`w-full p-4 rounded-xl transition-all text-left`}
              style={{
                borderWidth: '2px',
                borderColor: settings.recovery_status === 'general' ? colors.borderColor : '#e5e7eb',
                backgroundColor: settings.recovery_status === 'general' ? `${colors.primary}0D` : 'transparent'
              }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-5 h-5`} style={{ color: settings.recovery_status === 'general' ? colors.primary : '#9ca3af' }} />
                <div>
                  <p className="font-medium text-[#1F2C46]">General Reflection</p>
                  <p className="text-sm text-gray-500">Personal growth focused</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
        
        {/* Theme Color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5" style={{ color: colors.primary }} />
            <h3 className="font-semibold text-[#1F2C46]">Theme Color</h3>
          </div>
          <ThemeSelector 
            currentTheme={settings.theme_color} 
            onThemeChange={(color) => handleSave({ ...settings, theme_color: color })}
          />
        </motion.div>
        
        {/* Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h3 className="font-semibold text-[#1F2C46] mb-4">Background</h3>
          <BackgroundSelector
            currentBackground={settings.background}
            onBackgroundChange={(bg) => handleSave({ ...settings, background: bg })}
          />
        </motion.div>
        
        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: colors.primary }} />
              <h3 className="font-semibold text-[#1F2C46]">Daily Reminder</h3>
            </div>
            <Switch
              checked={settings.reminder_enabled}
              onCheckedChange={(checked) => handleSave({ ...settings, reminder_enabled: checked })}
            />
          </div>
          
          {settings.reminder_enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <label className="text-sm text-gray-500 mb-2 block">Reminder Time</label>
              <Select
                value={settings.reminder_time}
                onValueChange={(value) => handleSave({ ...settings, reminder_time: value })}
              >
                <SelectTrigger className="w-full rounded-xl">
                 <SelectValue>
                   {(() => {
                     const time = settings.reminder_time;
                     const [hours] = time.split(':');
                     const hour = parseInt(hours);
                     if (hour === 12) return '12:00 PM';
                     if (hour === 0) return '12:00 AM';
                     if (hour > 12) return `${hour - 12}:00 PM`;
                     return `${hour}:00 AM`;
                   })()}
                 </SelectValue>
                </SelectTrigger>
                <SelectContent>
                 {timeOptions.map(time => {
                   const [hours] = time.split(':');
                   const hour = parseInt(hours);
                   let display;
                   if (hour === 12) display = '12:00 PM';
                   else if (hour === 0) display = '12:00 AM';
                   else if (hour > 12) display = `${hour - 12}:00 PM`;
                   else display = `${hour}:00 AM`;

                   return (
                     <SelectItem key={time} value={time}>
                       {display}
                     </SelectItem>
                   );
                 })}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </motion.div>
        
        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full py-6 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
        
        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">Smart-Inventory v1.0</p>
          <p className="text-gray-300 text-xs mt-1">Reflect. Grow. Become your best self.</p>
        </motion.div>
      </div>
    </div>
  );
}