import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BACKGROUND_OPTIONS = [
  {
    id: 'purple-1',
    name: 'Soft Purple',
    theme: 'purple',
    image: 'https://images.unsplash.com/photo-1730780897906-14c86766f584?w=1920&q=80'
  },
  {
    id: 'purple-2',
    name: 'Lavender Dream',
    theme: 'purple',
    image: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=1920&q=80'
  },
  {
    id: 'blue-1',
    name: 'Pastel Blue',
    theme: 'blue',
    image: 'https://images.unsplash.com/photo-1730780883153-b3c046b001c1?w=1920&q=80'
  },
  {
    id: 'blue-2',
    name: 'Sky Flow',
    theme: 'blue',
    image: 'https://images.unsplash.com/photo-1601408993947-6ef9e7a1ed97?w=1920&q=80'
  },
  {
    id: 'green-1',
    name: 'Mint Abstract',
    theme: 'green',
    image: 'https://images.unsplash.com/photo-1764345713176-3fd77a47bfd9?w=1920&q=80'
  },
  {
    id: 'green-2',
    name: 'Soft Green',
    theme: 'green',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=1920&q=80'
  },
  {
    id: 'red-1',
    name: 'Rose Blush',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1580508271385-40f3683cf893?w=1920&q=80'
  },
  {
    id: 'red-2',
    name: 'Coral Wave',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80'
  },
  {
    id: 'orange-1',
    name: 'Peach Abstract',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1730473360570-881f4bd1b2e3?w=1920&q=80'
  },
  {
    id: 'orange-2',
    name: 'Warm Shapes',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1746563947278-64005fe02020?w=1920&q=80'
  }
];

export default function BackgroundSelector({ currentBackground, onBackgroundChange }) {
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
        className={`w-full h-16 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
          !currentBackground
            ? 'border-[#7667E5] bg-[#7667E5]/5 text-[#7667E5]'
            : 'border-gray-200 hover:border-gray-300 text-gray-600'
        }`}
      >
        {!currentBackground && <Check className="w-5 h-5" />}
        <span className="font-medium">No Background</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {BACKGROUND_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onBackgroundChange({ type: 'preset', id: option.id })}
            className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
              isSelected(option)
                ? 'border-[#7667E5] ring-2 ring-[#7667E5]/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img 
              src={option.image} 
              alt={option.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isSelected(option) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-[#7667E5]" />
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
          className={`flex items-center justify-center gap-3 w-full h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            uploading 
              ? 'border-gray-300 bg-gray-50' 
              : currentBackground?.type === 'custom'
                ? 'border-[#7667E5] bg-[#7667E5]/5'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className={`w-6 h-6 ${currentBackground?.type === 'custom' ? 'text-[#7667E5]' : 'text-gray-400'}`} />
              <div>
                <p className={`font-medium ${currentBackground?.type === 'custom' ? 'text-[#7667E5]' : 'text-gray-600'}`}>
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