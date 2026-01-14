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
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80'
  },
  {
    id: 'purple-2',
    name: 'Lavender Mist',
    theme: 'purple',
    image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80'
  },
  {
    id: 'blue-1',
    name: 'Soft Blue',
    theme: 'blue',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/d38207128_image.png'
  },
  {
    id: 'blue-2',
    name: 'Sky Whisper',
    theme: 'blue',
    image: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920&q=80'
  },
  {
    id: 'green-1',
    name: 'Mint Whisper',
    theme: 'green',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6936a138c3177c75bb95a5bf/28f7d547e_image.png'
  },
  {
    id: 'green-2',
    name: 'Soft Sage',
    theme: 'green',
    image: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=1920&q=80'
  },
  {
    id: 'red-1',
    name: 'Rose Whisper',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1557682233-43e671455dfa?w=1920&q=80'
  },
  {
    id: 'red-2',
    name: 'Blush Flow',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80&hue=350'
  },
  {
    id: 'orange-1',
    name: 'Peach Glow',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80&hue=30'
  },
  {
    id: 'orange-2',
    name: 'Warm Mist',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920&q=80&hue=40'
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