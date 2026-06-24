import React, { useState } from 'react';
import { Camera, Edit2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { isRecovery, getCopy } from '@/lib/mode';
import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInMinutes } from 'date-fns';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const cardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--line)',
};

const fieldStyle = {
  backgroundColor: 'var(--soft)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
};

export default function ProfileEditor({ user, onUpdate }) {
  const recovery = isRecovery(user.recovery_status);
  const copy = getCopy(user.recovery_status);
  const [isEditing, setIsEditing] = useState(false);
  const displayName = user.display_name || user.full_name || '';
  const nameParts = displayName.trim().split(' ');
  const [firstName, setFirstName] = useState(toTitleCase(nameParts[0] || ''));
  const [lastName, setLastName] = useState(toTitleCase(nameParts.slice(1).join(' ') || ''));
  const [dateOfBirth, setDateOfBirth] = useState(user.date_of_birth || '');
  const [soberDate, setSoberDate] = useState(user.sober_date || '');
  const [location, setLocation] = useState(user.location || '');
  const [bio, setBio] = useState(user.bio || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modeSaving, setModeSaving] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(user.date_of_birth);

  const calculateTimeTracked = () => {
    if (!user.sober_date) return null;
    const startDate = new Date(user.sober_date);
    const now = new Date();
    return {
      years: differenceInYears(now, startDate),
      months: differenceInMonths(now, startDate) % 12,
      weeks: Math.floor(differenceInWeeks(now, startDate) % 52),
      days: differenceInDays(now, startDate) % 7,
      minutes: differenceInMinutes(now, startDate)
    };
  };

  const timeTracked = calculateTimeTracked();

  const handleModeChange = async (newMode) => {
    if (newMode === user.recovery_status) return;
    setModeSaving(true);
    try {
      await base44.auth.updateMe({ recovery_status: newMode });
      await onUpdate();
    } catch (err) {
      console.error('Failed to update mode', err);
    }
    setModeSaving(false);
  };

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
      const newDisplayName = `${toTitleCase(firstName.trim())} ${toTitleCase(lastName.trim())}`.trim();
      await base44.auth.updateMe({
        display_name: newDisplayName,
        date_of_birth: dateOfBirth || null,
        sober_date: soberDate || null,
        location: location || null,
        bio: bio || null
      });
      await onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    const dn = user.display_name || user.full_name || '';
    const np = dn.trim().split(' ');
    setFirstName(toTitleCase(np[0] || ''));
    setLastName(toTitleCase(np.slice(1).join(' ') || ''));
    setDateOfBirth(user.date_of_birth || '');
    setSoberDate(user.sober_date || '');
    setLocation(user.location || '');
    setBio(user.bio || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      {/* Mode Switch */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h3 className="text-sm font-semibold text-foreground mb-1">Mode</h3>
        <p className="text-xs text-muted-foreground mb-3">Choose your reflection style</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleModeChange('aa')}
            disabled={modeSaving}
            className="rounded-xl p-3 text-left transition-all min-h-[44px] disabled:opacity-50"
            style={{
              border: `2px solid ${user.recovery_status === 'aa' ? 'var(--accent)' : 'var(--line)'}`,
              backgroundColor: user.recovery_status === 'aa' ? 'var(--soft)' : 'var(--surface)',
            }}
          >
            <div className="font-semibold text-sm text-foreground">Recovery</div>
            <div className="text-xs text-muted-foreground mt-0.5">AA/NA Step 10</div>
          </button>
          <button
            onClick={() => handleModeChange('general')}
            disabled={modeSaving}
            className="rounded-xl p-3 text-left transition-all min-h-[44px] disabled:opacity-50"
            style={{
              border: `2px solid ${user.recovery_status === 'general' ? 'var(--accent)' : 'var(--line)'}`,
              backgroundColor: user.recovery_status === 'general' ? 'var(--soft)' : 'var(--surface)',
            }}
          >
            <div className="font-semibold text-sm text-foreground">General</div>
            <div className="text-xs text-muted-foreground mt-0.5">Open self-reflection</div>
          </button>
        </div>
      </div>

      {/* Profile Picture and Info */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold overflow-hidden"
                style={{
                  background: user.profile_picture
                    ? 'none'
                    : 'var(--accent)',
                  color: 'var(--accentInk)',
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
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '2px solid var(--line)',
                  minHeight: 36,
                }}
              >
                {uploading ? (
                  <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid var(--line)', borderTopColor: 'var(--accent)' }} />
                ) : (
                  <Camera className="w-4 h-4 text-muted-foreground" />
                )}
              </label>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-bold text-xl text-foreground truncate">
                  {toTitleCase(user.display_name || user.full_name) || 'User'}
                </h2>
                {user.sober_date && (
                  <span
                    className="inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}
                  >
                    {copy.sinceLabel} {new Date(user.sober_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <p className="text-muted-foreground text-sm mt-1 truncate">{user.email}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--soft)',
                    color: 'var(--muted)',
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        {isEditing ? (
          <div className="space-y-3 mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="rounded-xl"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name</label>
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
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{copy.startDateLabel}</label>
                <Input
                  type="date"
                  value={soberDate}
                  onChange={(e) => setSoberDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
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
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-h-[44px] disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accentInk)' }}
              >
                {saving ? (
                  <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid var(--accentInk)', borderTopColor: 'transparent' }} />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Save</span>
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
                style={{ backgroundColor: 'var(--soft)', color: 'var(--muted)' }}
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name</label>
                <div className="rounded-xl px-4 py-2.5 text-sm" style={fieldStyle}>
                  {toTitleCase(firstName) || '-'}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name</label>
                <div className="rounded-xl px-4 py-2.5 text-sm" style={fieldStyle}>
                  {toTitleCase(lastName) || '-'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Age</label>
                <div className="rounded-xl px-4 py-2.5 text-sm" style={fieldStyle}>
                  {userAge || '-'}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{copy.startDateLabel}</label>
                <div className="rounded-xl px-4 py-2.5 text-sm" style={fieldStyle}>
                  {user.sober_date ? new Date(user.sober_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
              <div className="rounded-xl px-4 py-2.5 text-sm" style={fieldStyle}>
                {user.location || '-'}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
              <div className="rounded-xl px-4 py-2.5 text-sm min-h-[80px]" style={fieldStyle}>
                {user.bio || '-'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Tracked Card */}
      {timeTracked && (
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: 'var(--soft)',
            border: '1px solid var(--line)',
          }}
        >
          <p className="text-xs font-semibold mb-3 text-center" style={{ color: 'var(--accent)' }}>
            {copy.timeTrackedLabel}
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{timeTracked.years}</div>
              <div className="text-xs text-muted-foreground">Years</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{timeTracked.months}</div>
              <div className="text-xs text-muted-foreground">Months</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{timeTracked.weeks}</div>
              <div className="text-xs text-muted-foreground">Weeks</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{timeTracked.days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="text-xs text-center text-muted-foreground">
              {timeTracked.minutes.toLocaleString()} minutes total
            </div>
          </div>
        </div>
      )}
    </div>
  );
}