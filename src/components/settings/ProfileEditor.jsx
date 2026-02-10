import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit2, X, Check, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import useTheme from '../theme/useTheme';
import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInMinutes } from 'date-fns';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

export default function ProfileEditor({ user, onUpdate }) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const displayName = user.display_name || user.full_name || '';
  const nameParts = displayName.trim().split(' ');
  const [firstName, setFirstName] = useState(toTitleCase(nameParts[0] || ''));
  const [lastName, setLastName] = useState(toTitleCase(nameParts.slice(1).join(' ') || ''));
  const [age, setAge] = useState(user.age || '');
  const [sobrietyDate, setSobrietyDate] = useState(user.sobriety_date || '');
  const [location, setLocation] = useState(user.location || '');
  const [bio, setBio] = useState(user.bio || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Calculate sobriety time
  const calculateSobrietyTime = () => {
    if (!user.sobriety_date) return null;
    const sobrietyDate = new Date(user.sobriety_date);
    const now = new Date();
    
    return {
      years: differenceInYears(now, sobrietyDate),
      months: differenceInMonths(now, sobrietyDate) % 12,
      weeks: Math.floor(differenceInWeeks(now, sobrietyDate) % 52),
      days: differenceInDays(now, sobrietyDate) % 7,
      minutes: differenceInMinutes(now, sobrietyDate)
    };
  };
  
  const sobrietyTime = calculateSobrietyTime();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_picture: file_url });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!firstName.trim() && !lastName.trim()) return;
    
    setSaving(true);
    try {
      const displayName = `${toTitleCase(firstName.trim())} ${toTitleCase(lastName.trim())}`.trim();
      await base44.auth.updateMe({ 
        display_name: displayName,
        age: age || null,
        sobriety_date: sobrietyDate || null,
        location: location || null,
        bio: bio || null
      });
      // Force reload user data
      await onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture and Name */}
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold overflow-hidden"
              style={{
                background: user.profile_picture 
                  ? 'none' 
                  : `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
              }}
            >
              {user.profile_picture ? (
                <img src={user.profile_picture} alt={user.display_name || user.full_name} className="w-full h-full object-cover" />
              ) : (
                (user.display_name || user.full_name)?.[0] || user.email?.[0] || 'U'
              )}
            </div>
            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="profile-pic"
              className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md ${uploading ? 'bg-gray-300' : 'bg-white hover:bg-gray-50'}`}
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-gray-600" />
              )}
            </label>
          </div>
          
          {/* Sobriety Time Display */}
          {sobrietyTime && (
            <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 w-[200px]">
              <p className="text-xs font-semibold text-green-700 mb-2 text-center">Sobriety Time</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{sobrietyTime.years}</div>
                  <div className="text-xs text-gray-600">Years</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{sobrietyTime.months}</div>
                  <div className="text-xs text-gray-600">Months</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{sobrietyTime.weeks}</div>
                  <div className="text-xs text-gray-600">Weeks</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{sobrietyTime.days}</div>
                  <div className="text-xs text-gray-600">Days</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-green-200">
                <div className="text-xs text-center text-gray-500">
                  {sobrietyTime.minutes.toLocaleString()} minutes
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-[#1F2C46] text-xl">
                  {toTitleCase(user.display_name || user.full_name) || 'User'}
                </h2>
                {user.sobriety_date && (
                  <span className="text-sm font-bold text-green-600 px-3 py-1 bg-green-50 rounded-full">
                    Sober since {new Date(user.sobriety_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="rounded-xl"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Age</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Sobriety Date</label>
                  <Input
                    type="date"
                    value={sobrietyDate}
                    onChange={(e) => setSobrietyDate(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="rounded-xl min-h-[80px]"
                />
              </div>
              
              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  onClick={handleSave}
                  disabled={(!firstName.trim() && !lastName.trim()) || saving}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    (firstName.trim() || lastName.trim()) ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Save</span>
                </button>
                <button
                  onClick={() => {
                    const displayName = user.display_name || user.full_name || '';
                    const nameParts = displayName.trim().split(' ');
                    setFirstName(toTitleCase(nameParts[0] || ''));
                    setLastName(toTitleCase(nameParts.slice(1).join(' ') || ''));
                    setAge(user.age || '');
                    setSobrietyDate(user.sobriety_date || '');
                    setLocation(user.location || '');
                    setBio(user.bio || '');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">First Name</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200">
                    {toTitleCase(firstName) || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Last Name</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200">
                    {toTitleCase(lastName) || '-'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Age</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200">
                    {user.age || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Sobriety Date</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200">
                    {user.sobriety_date ? new Date(user.sobriety_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Location</label>
                <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200">
                  {user.location || '-'}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Bio</label>
                <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 border border-gray-200 min-h-[80px]">
                  {user.bio || '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Sign Out Button */}
      <div className="pt-4 border-t border-gray-100">
        <Button
          variant="destructive"
          onClick={() => base44.auth.logout()}
          className="w-full rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}