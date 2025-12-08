import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BACKGROUND_OPTIONS = [
  {
    id: 'purple-1',
    name: 'Purple Nebula',
    theme: 'purple',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(118, 103, 229, 0.8) 0%, rgba(164, 143, 255, 0.6) 25%, rgba(107, 194, 206, 0.4) 50%, rgba(31, 44, 70, 0.95) 100%)',
    stars: true
  },
  {
    id: 'purple-2',
    name: 'Purple Galaxy',
    theme: 'purple',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(164, 143, 255, 0.7) 0%, rgba(118, 103, 229, 0.5) 30%, rgba(107, 194, 206, 0.3) 60%, rgba(15, 23, 42, 0.98) 100%)',
    stars: true
  },
  {
    id: 'blue-1',
    name: 'Blue Nebula',
    theme: 'blue',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.8) 0%, rgba(96, 165, 250, 0.6) 25%, rgba(14, 165, 233, 0.4) 50%, rgba(31, 44, 70, 0.95) 100%)',
    stars: true
  },
  {
    id: 'blue-2',
    name: 'Blue Galaxy',
    theme: 'blue',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.5) 30%, rgba(14, 165, 233, 0.3) 60%, rgba(15, 23, 42, 0.98) 100%)',
    stars: true
  },
  {
    id: 'green-1',
    name: 'Green Nebula',
    theme: 'green',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.8) 0%, rgba(52, 211, 153, 0.6) 25%, rgba(20, 184, 166, 0.4) 50%, rgba(31, 44, 70, 0.95) 100%)',
    stars: true
  },
  {
    id: 'green-2',
    name: 'Green Galaxy',
    theme: 'green',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(52, 211, 153, 0.7) 0%, rgba(16, 185, 129, 0.5) 30%, rgba(20, 184, 166, 0.3) 60%, rgba(15, 23, 42, 0.98) 100%)',
    stars: true
  },
  {
    id: 'red-1',
    name: 'Red Nebula',
    theme: 'red',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(248, 113, 113, 0.8) 0%, rgba(252, 165, 165, 0.6) 25%, rgba(251, 146, 60, 0.4) 50%, rgba(31, 44, 70, 0.95) 100%)',
    stars: true
  },
  {
    id: 'red-2',
    name: 'Red Galaxy',
    theme: 'red',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(252, 165, 165, 0.7) 0%, rgba(248, 113, 113, 0.5) 30%, rgba(251, 146, 60, 0.3) 60%, rgba(15, 23, 42, 0.98) 100%)',
    stars: true
  },
  {
    id: 'orange-1',
    name: 'Orange Nebula',
    theme: 'orange',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.8) 0%, rgba(251, 146, 60, 0.6) 25%, rgba(251, 191, 36, 0.4) 50%, rgba(31, 44, 70, 0.95) 100%)',
    stars: true
  },
  {
    id: 'orange-2',
    name: 'Orange Galaxy',
    theme: 'orange',
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(251, 146, 60, 0.7) 0%, rgba(249, 115, 22, 0.5) 30%, rgba(251, 191, 36, 0.3) 60%, rgba(15, 23, 42, 0.98) 100%)',
    stars: true
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
            <div 
              className="absolute inset-0"
              style={{ background: option.gradient }}
            >
              {option.stars && (
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(1px 1px at 20% 30%, white, transparent),
                    radial-gradient(1px 1px at 60% 70%, white, transparent),
                    radial-gradient(1px 1px at 50% 50%, white, transparent),
                    radial-gradient(1px 1px at 80% 10%, white, transparent),
                    radial-gradient(1px 1px at 90% 60%, white, transparent),
                    radial-gradient(1px 1px at 33% 85%, white, transparent),
                    radial-gradient(1px 1px at 15% 75%, white, transparent),
                    radial-gradient(1px 1px at 70% 40%, white, transparent)
                  `,
                  backgroundSize: '200% 200%, 150% 150%, 180% 180%, 220% 220%, 190% 190%, 210% 210%, 170% 170%, 160% 160%',
                  backgroundPosition: '50% 50%',
                  opacity: 0.6
                }} />
              )}
            </div>
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