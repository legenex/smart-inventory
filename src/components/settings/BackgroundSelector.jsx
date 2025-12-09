import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BACKGROUND_OPTIONS = [
  {
    id: 'purple-1',
    name: 'Purple Galaxy',
    theme: 'purple',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80'
  },
  {
    id: 'purple-2',
    name: 'Purple Nebula',
    theme: 'purple',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80'
  },
  {
    id: 'blue-1',
    name: 'Blue Galaxy',
    theme: 'blue',
    image: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=1920&q=80'
  },
  {
    id: 'blue-2',
    name: 'Blue Nebula',
    theme: 'blue',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1920&q=80'
  },
  {
    id: 'green-1',
    name: 'Green Galaxy',
    theme: 'green',
    image: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=1920&q=80'
  },
  {
    id: 'green-2',
    name: 'Emerald Nebula',
    theme: 'green',
    image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=1920&q=80'
  },
  {
    id: 'red-1',
    name: 'Red Galaxy',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80'
  },
  {
    id: 'red-2',
    name: 'Red Nebula',
    theme: 'red',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1920&q=80'
  },
  {
    id: 'orange-1',
    name: 'Orange Galaxy',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=1920&q=80'
  },
  {
    id: 'orange-2',
    name: 'Cosmic Orange',
    theme: 'orange',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80'
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