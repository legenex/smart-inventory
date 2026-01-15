import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import useTheme from '../theme/useTheme';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

export default function ProfileEditor({ user, onUpdate }) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const nameParts = (user.full_name || '').trim().split(' ');
  const [firstName, setFirstName] = useState(toTitleCase(nameParts[0] || ''));
  const [lastName, setLastName] = useState(toTitleCase(nameParts.slice(1).join(' ') || ''));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleSaveName = async () => {
    if (!firstName.trim() && !lastName.trim()) return;
    
    setSaving(true);
    try {
      const displayName = `${toTitleCase(firstName.trim())} ${toTitleCase(lastName.trim())}`.trim();
      await base44.auth.updateMe({ display_name: displayName });
      // Force reload user data
      await onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving name:', err);
      alert('Failed to save name. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold overflow-hidden"
          style={{
            background: user.profile_picture 
              ? 'none' 
              : `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
          }}
        >
          {user.profile_picture ? (
            <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            user.full_name?.[0] || user.email?.[0] || 'U'
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
          className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md ${uploading ? 'bg-gray-300' : 'bg-white hover:bg-gray-50'}`}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-gray-600" />
          )}
        </label>
      </div>
      
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="rounded-xl"
                autoFocus
              />
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleSaveName}
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
                  const nameParts = (user.full_name || '').trim().split(' ');
                  setFirstName(toTitleCase(nameParts[0] || ''));
                  setLastName(toTitleCase(nameParts.slice(1).join(' ') || ''));
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
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <h2 className="font-semibold text-[#1F2C46] text-lg">{toTitleCase(user.full_name) || 'User'}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}