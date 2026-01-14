import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useTheme from '../theme/useTheme';

const BACKGROUND_OPTIONS = [
  {
    id: 'purple-1',
    name: 'Soft Purple',
    theme: 'purple',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/603743a5f_purple_watercolour_background_corners.jpg'
  },
  {
    id: 'purple-2',
    name: 'Lavender Mist',
    theme: 'purple',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/2740f0bdb_4fac6a19-7f87-431d-838d-46ba0a12a094.jpg'
  },
  {
    id: 'blue-1',
    name: 'Soft Blue',
    theme: 'blue',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/1801c54a3_job297-ploy-07a-blue-01.jpg'
  },
  {
    id: 'blue-2',
    name: 'Sky Whisper',
    theme: 'blue',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/98acce72e_abstract-blue-background-with-smooth-shining-lines.jpg'
  },
  {
    id: 'green-1',
    name: 'Mint Whisper',
    theme: 'green',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/ccc105c1d_rm222batch5-mind-21.jpg'
  },
  {
    id: 'green-2',
    name: 'Soft Sage',
    theme: 'green',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/b238ae16c_0745aa7f-ba6a-4716-8792-d9032e1882be.jpg'
  },
  {
    id: 'red-1',
    name: 'Rose Whisper',
    theme: 'red',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/86da7d987_9517697.jpg'
  },
  {
    id: 'red-2',
    name: 'Blush Flow',
    theme: 'red',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/882d511c7_9df4e803-d75c-4574-b02a-1d8635c6a0d3.jpg'
  },
  {
    id: 'orange-1',
    name: 'Peach Glow',
    theme: 'orange',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/6e775870d_background41.jpg'
  },
  {
    id: 'orange-2',
    name: 'Warm Mist',
    theme: 'orange',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/a4a3b387e_5595248.jpg'
  }
];

export default function BackgroundSelector({ currentBackground, onBackgroundChange }) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onBackgroundChange({ type: 'custom', url: file_url });
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const isSelected = (option) => {
    return currentBackground?.type === 'preset' && currentBackground?.id === option.id;
  };

  return (
    <div className="space-y-4">
      {/* None Option */}
      <button
        onClick={() => onBackgroundChange(null)}
        className={`w-full h-16 rounded-xl transition-all flex items-center justify-center gap-2`}
        style={{
          borderWidth: '2px',
          borderColor: !currentBackground ? colors.borderColor : '#e5e7eb',
          backgroundColor: !currentBackground ? `${colors.primary}0D` : 'transparent',
          color: !currentBackground ? colors.primary : '#4b5563'
        }}
      >
        {!currentBackground && <Check className="w-5 h-5" />}
        <span className="font-medium">No Background (Theme Default)</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {BACKGROUND_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onBackgroundChange({ type: 'preset', id: option.id })}
            className={`relative h-24 rounded-xl overflow-hidden transition-all`}
            style={{
              borderWidth: '2px',
              borderColor: isSelected(option) ? colors.borderColor : '#e5e7eb',
              boxShadow: isSelected(option) ? `0 0 0 2px ${colors.primary}33` : 'none'
            }}
          >
            <img 
              src={option.image} 
              alt={option.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isSelected(option) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-xs text-white font-medium drop-shadow-lg">{option.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Upload */}
      <div className="relative">
        <input
          type="file"
          id="background-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="background-upload"
          className={`flex items-center justify-center gap-3 w-full h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer`}
          style={{
            borderColor: uploading 
              ? '#d1d5db' 
              : currentBackground?.type === 'custom'
                ? colors.borderColor
                : '#d1d5db',
            backgroundColor: uploading
              ? '#f9fafb'
              : currentBackground?.type === 'custom'
                ? `${colors.primary}0D`
                : 'transparent'
          }}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary, borderTopColor: 'transparent' }} />
          ) : (
            <>
              <Upload className="w-6 h-6" style={{ color: currentBackground?.type === 'custom' ? colors.primary : '#9ca3af' }} />
              <div>
                <p className="font-medium" style={{ color: currentBackground?.type === 'custom' ? colors.primary : '#4b5563' }}>
                  {currentBackground?.type === 'custom' ? 'Custom Background Set' : 'Upload Custom Background'}
                </p>
                <p className="text-xs text-gray-400">Click to change image</p>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

export { BACKGROUND_OPTIONS };