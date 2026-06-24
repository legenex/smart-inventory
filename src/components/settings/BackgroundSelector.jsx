import React from 'react';
import { Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BackgroundSelector({ user, onUpdate }) {
  const currentBackground = user?.background || null;
  const hasBackground = !!currentBackground;

  const handleClear = async () => {
    try {
      await base44.auth.updateMe({ background: null });
      onUpdate?.();
    } catch (err) {
      console.error('Failed to clear background', err);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="w-full rounded-xl flex items-center justify-between px-4 transition-all"
        style={{
          minHeight: 56,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: !hasBackground ? 'var(--accent)' : 'var(--line)',
          backgroundColor: !hasBackground ? 'var(--soft)' : 'var(--surface)',
        }}
      >
        <div className="flex items-center gap-2">
          {!hasBackground && <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
            Theme Default
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {hasBackground ? 'Custom background set' : 'Active'}
        </span>
      </div>

      {hasBackground && (
        <button
          onClick={handleClear}
          className="w-full rounded-xl py-3 text-sm font-medium transition-colors"
          style={{
            minHeight: 44,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
          }}
        >
          Clear background
        </button>
      )}

      <p className="text-xs" style={{ color: 'var(--muted)' }}>
        Your theme color provides the background. Keep it clean and subtle.
      </p>
    </div>
  );
}